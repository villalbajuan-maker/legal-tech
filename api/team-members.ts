import { createClient } from "@supabase/supabase-js";

type TeamMembersRequestBody = {
  fullName?: string;
  email?: string;
  password?: string;
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

async function getAdminMembership(userId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("organization_id, role, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .in("role", ["platform_admin", "account_admin"])
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
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

async function listTeamMembers(organizationId: string) {
  const supabase = getServerSupabase();

  const { data: memberships, error: membershipsError } = await supabase
    .from("organization_memberships")
    .select("id, user_id, role, status, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (membershipsError) {
    throw membershipsError;
  }

  const memberRows = memberships ?? [];
  const userIds = memberRows.map((item) => item.user_id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  if (profilesError) {
    throw profilesError;
  }

  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return memberRows.map((membership) => {
    const profile = profilesById.get(membership.user_id);
    return {
      id: membership.id,
      user_id: membership.user_id,
      role: membership.role,
      status: membership.status,
      created_at: membership.created_at,
      email: profile?.email ?? null,
      full_name: profile?.full_name ?? null,
    };
  });
}

async function getOrganizationLimits(organizationId: string) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("organizations")
    .select("member_limit")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    memberLimit: data?.member_limit ?? 4,
  };
}

async function createTeamMember(organizationId: string, body: TeamMembersRequestBody) {
  const fullName = body.fullName?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const password = body.password || "";

  if (!fullName) {
    return json(400, { error: "El nombre completo es obligatorio." });
  }

  if (!email) {
    return json(400, { error: "El correo es obligatorio." });
  }

  if (password.length < 8) {
    return json(400, { error: "La contraseña debe tener al menos 8 caracteres." });
  }

  const supabase = getServerSupabase();
  const members = await listTeamMembers(organizationId);
  const limits = await getOrganizationLimits(organizationId);
  const activeMembers = members.filter((member) => member.status === "active");

  if (activeMembers.length >= limits.memberLimit) {
    return json(409, { error: `Esta cuenta ya alcanzó el límite de ${limits.memberLimit} responsables.` });
  }

  if (members.some((member) => member.email?.toLowerCase() === email)) {
    return json(409, { error: "Ese correo ya pertenece a un responsable de esta cuenta." });
  }

  const userResult = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      name: fullName,
    },
  });

  if (userResult.error || !userResult.data.user) {
    return json(400, {
      error: userResult.error?.message || "No fue posible crear el usuario responsable.",
    });
  }

  const userId = userResult.data.user.id;

  const { error: membershipError } = await supabase.from("organization_memberships").insert({
    organization_id: organizationId,
    user_id: userId,
    role: "operator",
    status: "active",
  });

  if (membershipError) {
    await supabase.auth.admin.deleteUser(userId);
    return json(400, {
      error: membershipError.message || "No fue posible asignar el responsable a la cuenta.",
    });
  }

  const nextMembers = await listTeamMembers(organizationId);
  const createdMember = nextMembers.find((member) => member.user_id === userId) || null;

  return json(200, {
    member: createdMember,
    team: nextMembers,
    activeCount: nextMembers.filter((member) => member.status === "active").length,
    limit: limits.memberLimit,
  });
}

export default {
  async fetch(request: Request) {
    try {
      const { user } = await getAuthenticatedUser(request);

      if (!user) {
        return json(401, { error: "Sesión inválida o expirada." });
      }

      if (request.method === "GET") {
        const membership = await getActiveMembership(user.id);

        if (!membership?.organization_id) {
          return json(403, { error: "No tienes una organización activa para esta cuenta." });
        }

        const members = await listTeamMembers(membership.organization_id);
        const limits = await getOrganizationLimits(membership.organization_id);
        return json(200, {
          team: members,
          activeCount: members.filter((member) => member.status === "active").length,
          limit: limits.memberLimit,
        });
      }

      if (request.method === "POST") {
        const membership = await getAdminMembership(user.id);

        if (!membership?.organization_id) {
          return json(403, { error: "No tienes permisos de administración para esta cuenta." });
        }

        const body = (await request.json()) as TeamMembersRequestBody;
        return createTeamMember(membership.organization_id, body);
      }

      return json(405, { error: "Method not allowed" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected server error";
      return json(500, { error: message });
    }
  },
};
