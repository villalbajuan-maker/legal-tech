import { createClient } from "@supabase/supabase-js";
import { processBatch } from "../workers/crawler/src/index";

type MonitoringSyncRequestBody = {
  batchSize?: number;
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getServerSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!token) {
    return { token: null, user: null };
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { token, user: null };
  }

  return { token, user: data.user };
}

async function getActiveMembership(userId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("organization_id, role, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getOrganizationSyncSummary(organizationId: string) {
  const supabase = getServerSupabase();

  const { count: caseCount, error: caseError } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  if (caseError) throw caseError;

  const { data: caseRows, error: caseRowsError } = await supabase
    .from("cases")
    .select("id")
    .eq("organization_id", organizationId);

  if (caseRowsError) throw caseRowsError;

  const caseIds = (caseRows ?? []).map((row) => row.id);

  if (caseIds.length === 0) {
    return {
      caseCount: caseCount ?? 0,
      sourceCount: 0,
      pendingCount: 0,
      activeCount: 0,
      errorCount: 0,
      blockedCount: 0,
      notFoundCount: 0,
      snapshotCount: 0,
    };
  }

  const { data: caseSourceRows, error: sourceError } = await supabase
    .from("case_sources")
    .select("id, status, case_id")
    .in("case_id", caseIds);

  if (sourceError) throw sourceError;

  const caseSourceIds = (caseSourceRows ?? []).map((row) => row.id);
  let snapshotCount = 0;

  if (caseSourceIds.length > 0) {
    const { count, error: snapshotError } = await supabase
      .from("source_snapshots")
      .select("id", { count: "exact", head: true })
      .in("case_source_id", caseSourceIds);

    if (snapshotError) throw snapshotError;
    snapshotCount = count ?? 0;
  }

  const sources = caseSourceRows ?? [];

  return {
    caseCount: caseCount ?? 0,
    sourceCount: sources.length,
    pendingCount: sources.filter((row) => row.status === "pending").length,
    activeCount: sources.filter((row) => row.status === "active").length,
    errorCount: sources.filter((row) => row.status === "error").length,
    blockedCount: sources.filter((row) => row.status === "blocked").length,
    notFoundCount: sources.filter((row) => row.status === "not_found").length,
    snapshotCount,
  };
}

export default {
  async fetch(request: Request) {
    try {
      if (request.method !== "POST") {
        return json(405, { error: "Method not allowed" });
      }

      const { user } = await getAuthenticatedUser(request);

      if (!user) {
        return json(401, { error: "Sesión inválida o expirada." });
      }

      const membership = await getActiveMembership(user.id);

      if (!membership?.organization_id) {
        return json(403, { error: "No tienes una organización activa para esta cuenta." });
      }

      const body = ((await request.json().catch(() => ({}))) || {}) as MonitoringSyncRequestBody;
      const requestedBatchSize = typeof body.batchSize === "number" ? body.batchSize : 10;
      const batchSize = Math.min(25, Math.max(1, Math.trunc(requestedBatchSize)));

      const before = await getOrganizationSyncSummary(membership.organization_id);
      const batchResult = await processBatch({
        organizationId: membership.organization_id,
        batchSize,
        suppressLog: true,
      });
      const after = await getOrganizationSyncSummary(membership.organization_id);

      const phase =
        after.sourceCount === 0
          ? "idle"
          : after.pendingCount > 0
            ? before.snapshotCount === 0
              ? "initiating"
              : "partial"
            : "complete";

      return json(200, {
        phase,
        batchSize,
        before,
        after,
        batchResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected server error";
      return json(500, { error: message });
    }
  },
};
