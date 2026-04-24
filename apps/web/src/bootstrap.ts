function shouldLoadInternalSurface() {
  if (typeof window === "undefined") return false;

  const internalHosts = new Set(["app.lexcontrol.co", "www.app.lexcontrol.co"]);
  return internalHosts.has(window.location.hostname) || window.location.pathname.startsWith("/app");
}

async function bootstrap() {
  if (shouldLoadInternalSurface()) {
    await import("./internal-entry");
    return;
  }

  await import("./marketing-entry");
}

void bootstrap();
