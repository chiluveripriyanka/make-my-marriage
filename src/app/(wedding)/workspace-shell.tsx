"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import LogoutButton from "../welcome/logout-button";
import "./workspace.css";

const groups = [
  { title: "Overview", items: [["Dashboard", "◫", "/app"]] },
  { title: "Planning", items: [["Events", "▦", ""], ["Tasks", "☷", ""]] },
  { title: "Guests", items: [["Guest List", "♧", ""], ["Invitations & RSVP", "✉", ""]] },
  { title: "Finance & Vendors", items: [["Expenses", "▣", ""], ["My Vendors", "▤", ""], ["Discover Vendors", "◎", ""]] },
  { title: "Wedding Experience", items: [["Wedding Website", "⊕", ""], ["Gallery", "▧", ""], ["Livestream", "▷", ""]] },
  { title: "Settings", items: [["Wedding Details", "☷", "/app/settings/wedding"], ["Wedding Members", "♧", "/app/settings/members"]] },
];
export default function WorkspaceShell({ children, wedding, city, name, role }: { children: ReactNode; wedding: string; city: string; name: string; role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (!pathname.startsWith("/app")) return <><header className="wedding-header"><Link className="brand" href="/">Make My Marriage<small>Your family workspace</small></Link><div className="wedding-header-actions"><Link href="/app">Dashboard</Link><LogoutButton /></div></header>{children}</>;
  return <div className="workspace">
    <a href="#workspace-main" className="workspace-skip">Skip to content</a>
    <aside className={`workspace-sidebar ${open ? "is-open" : ""}`} id="workspace-navigation">
      <Link href="/app" className="workspace-brand">♧ Make My Marriage<small>REGAL WEDDING SUITE</small></Link>
      <nav aria-label="Wedding workspace">{groups.map(group => <section key={group.title}><h2>{group.title}</h2>{group.items.map(([label, icon, href]) => href ? <Link key={label} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}><span aria-hidden="true">{icon}</span>{label}</Link> : <button key={label} disabled title={`${label} is coming soon`}><span aria-hidden="true">{icon}</span>{label}<small>Soon</small></button>)}</section>)}</nav>
      <div className="workspace-profile"><span className="workspace-avatar">{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><span className="workspace-badge">{role}</span></div><LogoutButton /></div>
    </aside>
    <div className="workspace-body"><header className="workspace-topbar"><button className="workspace-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="workspace-navigation" aria-label="Toggle navigation">☰</button><span>♧ {city || wedding}</span><Link href="/app/settings/wedding" aria-label="Wedding settings" className="workspace-avatar">{name.slice(0, 1).toUpperCase()}</Link></header><div id="workspace-main" tabIndex={-1}>{children}</div></div>
  </div>;
}
