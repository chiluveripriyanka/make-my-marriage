import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./auth.css";

export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-shell"><header className="auth-header"><Link className="brand" href="/">Make My Marriage<small>Royal Celebrations Suite</small></Link><Link href="/">Return to Main Site</Link></header><main className="auth-main"><div className="auth-card"><aside className="auth-art"><Image src="/images/stitch-1.png" alt="" fill sizes="(max-width: 700px) 100vw, 400px" /><span className="eyebrow">✧ Auspicious Beginning</span><div><blockquote>Every sacred step,<br />crafted with grace.</blockquote><p>Your people. Your plans.<br />Your beautiful beginning.</p></div></aside><div className="auth-panel">{children}</div></div></main><div className="auth-footer">Make My Marriage · Crafted for auspicious beginnings.</div></div>;
}
