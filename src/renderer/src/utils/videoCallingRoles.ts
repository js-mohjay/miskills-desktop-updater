export type VideoCallingRoles = "host" | "participant";

export function normalizeVideoCallingRole(role: string | null): VideoCallingRoles {
  if (!role) return "participant";

  if (["host", "coHost", "mod", "admin"].includes(role)) {
    return "host";
  }

  return "participant";
}
