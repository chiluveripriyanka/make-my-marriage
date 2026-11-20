"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function MemberActions({ id, name, role, you }: { id: string; name: string; role: string; you: boolean }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [action, setAction] = useState<"edit" | "remove">("edit");
  const [selected, setSelected] = useState(role);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function open(value: "edit" | "remove") {
    setAction(value); setSelected(role); setError(""); setMessage(""); dialog.current?.showModal();
  }
  async function save() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/wedding/members/${id}`, {
        method: action === "edit" ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        ...(action === "edit" ? { body: JSON.stringify({ role: selected }) } : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Unable to update member. Please try again.");
      setMessage(result.data.message); dialog.current?.close(); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); }
    finally { setBusy(false); }
  }
  if (you) return <div className="member-self-note"><strong>You</strong><small>You can’t change your own role or remove yourself.</small></div>;
  return <>
    <div className="member-row-actions"><button className="team-secondary" aria-label={`Edit role for ${name}`} onClick={() => open("edit")}>Change Role</button><button className="team-secondary" aria-label={`Remove ${name}`} onClick={() => open("remove")}>Remove</button></div>
    {message && <p role="status">{message}</p>}
    <dialog ref={dialog} className="team-dialog" aria-label={action === "edit" ? "Change member role" : "Remove member"} onCancel={e => { if (busy) e.preventDefault(); }}>
      <form onSubmit={e => { e.preventDefault(); void save(); }}>
        <h2>{action === "edit" ? "Change Member Role" : "Remove Member?"}</h2>
        <p>{name}</p>
        {action === "edit" ? <fieldset><legend>Permission role</legend>{["MANAGER", "ADMIN"].map(value => <label className="team-choice" key={value}><input type="radio" name="member-role" value={value} checked={selected === value} onChange={() => setSelected(value)} disabled={busy} /><span><strong>{value === "ADMIN" ? "Admin" : "Manager"}</strong><small>{value === "ADMIN" ? "Full wedding access, including team management." : "Coordinate wedding plans without managing members."}</small></span></label>)}</fieldset> : <p>This member will lose access to this wedding. Their account and past activity will be preserved. They will need a new invitation to rejoin.</p>}
        <p className="team-notice">Your wedding must always have at least one Admin.</p>
        {error && <p role="alert" className="team-error">{error}</p>}
        <div className="team-dialog-actions"><button type="button" className="team-secondary" disabled={busy} onClick={() => dialog.current?.close()}>Cancel</button><button className="button" disabled={busy}>{busy ? "Saving…" : action === "edit" ? "Save Changes" : "Remove Member"}</button></div>
      </form>
    </dialog>
  </>;
}
