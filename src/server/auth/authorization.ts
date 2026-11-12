import "server-only";

import { ApiError } from "@/server/http/api-error";

import { getCurrentUserId } from "./session";

export type WeddingRole = "admin" | "manager";

export async function requireUser(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) throw new ApiError(401, "Authentication required");
  return userId;
}

export function requireRole(role: WeddingRole, allowedRoles: readonly WeddingRole[]): void {
  if (!allowedRoles.includes(role)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }
}
