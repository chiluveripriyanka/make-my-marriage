"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function JoinActions({ token, state, email }: { token: string; state: string; email?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function act(switchAccount = false) {
    setBusy(true); setError("");
    try {
      const response = await fetch(switchAccount ? "/api/auth/logout" : "/api/invitations", { method: "POST", headers: { "Content-Type": "application/json" }, ...(switchAccount ? {} : { body: JSON.stringify({ action: "accept", token }) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Unable to continue");
      if (!switchAccount) setSuccess(true);
      router.replace(switchAccount ? `/login?invitation=${token}` : "/app/settings/members"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again"); setBusy(false); }
  }
  return <div className="join-actions">{state === "signedout" ? <><h3>Claim your invitation</h3><p>Your invitation stays with you while you sign in or register.</p><Link className="button" href={`/signup?invitation=${token}`}>Create Account</Link><Link className="join-secondary" href={`/login?invitation=${token}`}>Sign In</Link></> : state === "mismatch" ? <><h3>Switch to your invited account</h3><p>You’re signed in as {email}. This invitation belongs to a different email address.</p><button className="button" disabled={busy} onClick={() => void act(true)}>{busy ? "Signing out…" : "Switch Account"}</button></> : state === "member" ? <><h3>You’re already on the team</h3><Link className="button" href="/app/settings/members">View Wedding Team</Link></> : state === "other" ? <><h3>You already belong to another wedding</h3><p>Each account can belong to one wedding workspace.</p><Link className="button" href="/app">Return to My Wedding</Link></> : state === "used" ? <p>This invitation was already accepted. Contact your wedding organiser.</p> : <><p>Signed in as {email}</p><button className="button" disabled={busy} onClick={() => void act()}>{busy ? "Joining Wedding…" : "Accept Invitation →"}</button></>}{success && <p role="status">Welcome to the team! Opening your wedding team…</p>}{error && <p className="join-error" role="alert">{error}</p>}</div>;
}
