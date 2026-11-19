"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LogoutButton() { const router = useRouter(); const [error,setError] = useState(""); const [busy,setBusy] = useState(false); return <><button className="button" disabled={busy} onClick={async()=>{setBusy(true);setError("");try{const r=await fetch("/api/auth/logout",{method:"POST"});if(!r.ok)throw new Error();router.replace("/login");router.refresh();}catch{setError("Unable to sign out. Please try again.");}finally{setBusy(false);}}}>{busy ? "Signing out…" : "Sign Out"}</button>{error && <p role="alert">{error}</p>}</>; }
