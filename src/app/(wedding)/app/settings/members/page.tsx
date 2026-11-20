import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "../../../access";
import { findWedding } from "@/server/weddings/service";
import { MembershipModel } from "@/server/weddings/models";
import { UserModel } from "@/server/auth/models";
import { InvitationModel } from "@/server/invitations/model";
import Team from "./team";
import "./team.css";
export default async function MembersPage() {
  const userId = await requireUser();
  const context = await findWedding(userId);
  if (!context) redirect("/onboarding");
  const admin = context.membership.role === "ADMIN";
  const members = await MembershipModel.find({ weddingId: context.wedding._id }).sort({ joinedAt: 1 }).lean();
  const users = await UserModel.find({ _id: { $in: members.map(m => m.userId) } }).select("name email").lean();
  const pending = admin ? await InvitationModel.find({ weddingId: context.wedding._id, status: "PENDING" }).sort({ createdAt: -1 }).lean() : [];
  return <main className="team-shell"><aside className="team-sidebar"><p className="eyebrow">Settings Hub</p><Link className="selected" href="/app/settings/members">Wedding Members</Link><Link href="/app/settings/wedding">Wedding Profile</Link><Link href="/app">← Dashboard</Link></aside><section className="team-content"><p className="team-breadcrumb">Settings / Wedding Members</p><p className="team-notice">Pending invitations expire after 7 days. Resending replaces the previous invitation link.</p><Team admin={admin} title={context.wedding.title || "Your Wedding"} date={context.wedding.weddingDate} city={context.wedding.location?.city || ""} members={members.map(m => { const user = users.find(u => String(u._id) === String(m.userId)); return { id: String(m._id), name: user?.name || "Team member", email: user?.email || "", role: m.role, joined: m.joinedAt.toISOString(), you: String(m.userId) === userId }; })} invitations={pending.map(i => ({ id: String(i._id), email: i.email, role: i.role, expires: i.expiresAt.toISOString(), delivery: i.delivery || "SENT" }))} /></section></main>;
}
