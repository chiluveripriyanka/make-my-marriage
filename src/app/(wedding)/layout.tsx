import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/server/auth/session";
import LogoutButton from "../welcome/logout-button";
import type { ReactNode } from "react";
import "./wedding.css";
export const dynamic = "force-dynamic";
export default async function WeddingLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await getCurrentUserId())) redirect("/login");
  return (
    <>
      <header className="wedding-header">
        <Link className="brand" href="/">
          Make My Marriage<small>Your family workspace</small>
        </Link>
        <LogoutButton />
      </header>
      {children}
    </>
  );
}
