import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/server/auth/session";
import LogoutButton from "../welcome/logout-button";
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
  return (
    <>
      <header className="wedding-header">
        <Link className="brand" href="/">
          Make My Marriage<small>Your family workspace</small>
        </Link>
        <div className="wedding-header-actions">
          {context && <nav aria-label="Wedding workspace"><Link href="/app">Dashboard</Link><Link href="/app/settings/members">Wedding Team</Link></nav>}
          <LogoutButton />
        </div>
      </header>
      {children}
    </>
  );
}
