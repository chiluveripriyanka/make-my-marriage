import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/server/auth/session";
import WorkspaceShell from "./workspace-shell";
import { UserModel } from "@/server/auth/models";
import { findWedding } from "@/server/weddings/service";
import type { ReactNode } from "react";
import "./wedding.css";
export const dynamic = "force-dynamic";
export default async function WeddingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const context = await findWedding(userId);
  const user = await UserModel.findById(userId).select("name").lean();
  return (
    <WorkspaceShell wedding={context?.wedding.title || "Your Wedding"} city={context?.wedding.location?.city || ""} name={user?.name || "Wedding member"} role={context?.membership.role || "ADMIN"}>
      {children}
    </WorkspaceShell>
  );
}
