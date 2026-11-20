"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invitationPath } from "@/server/invitations/validation";

export type AuthMode = "login" | "signup";
const titles = { login: "Sign In to Your Wedding", signup: "Your Beautiful Beginning" };
export default function AuthForm({ mode, invitation }: { mode: AuthMode; invitation?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (mode === "signup" && fields.password !== fields.confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const result = await response.json();
      if (!response.ok) { setError(result.error?.message || "Unable to complete your request."); return; }
      if (result.data.redirect) { router.replace(invitationPath(invitation) || result.data.redirect); router.refresh(); }
    } catch { setError("Unable to connect. Please try again."); } finally { setBusy(false); }
  }
  return <><span className="eyebrow">Royal Celebrations</span><h1>{titles[mode]}</h1><p className="auth-description">{mode === "login" ? "Welcome to your wedding sanctuary. Bring your plans and your people together." : "Create your account and begin your wedding journey."}</p>
    <form onSubmit={submit} className="auth-form">
      {mode === "signup" && <label>Your Name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" /></label>}
      {<label>Email Address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>}
      {<><div className="auth-password-label"><label htmlFor="password">Password</label></div><div className="auth-password"><input id="password" name="password" type={visible ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} maxLength={72} aria-describedby={mode !== "login" ? "password-help" : undefined} /><button type="button" aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button></div>{mode !== "login" && <><small id="password-help">At least 8 characters; up to 72 bytes.</small><label>Confirm Password<input name="confirm" type={visible ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={72} /></label></>}</>}
      {error && <p className="auth-error" role="alert">{error}</p>}<button className="button" disabled={busy} type="submit">{busy ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}</button>
    </form>
    {invitation && <p className="auth-description">Use the email address that received your invitation. You’ll return to it after signing in.</p>}
    <p className="auth-switch">{mode === "login" ? <>Don’t have an account? <Link href={invitation ? `/signup?invitation=${invitation}` : "/signup"}>Create your account</Link></> : <Link href={invitation ? `/login?invitation=${invitation}` : "/login"}>Already have an account? Sign in</Link>}</p><p className="auth-trust">♡ Your celebration, kept private</p></>;
}
