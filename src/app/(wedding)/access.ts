import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/server/auth/session";

export async function requireUser() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return userId;
}
