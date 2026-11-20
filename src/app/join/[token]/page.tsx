import Link from "next/link";
import { inspectInvitation } from "@/server/invitations/service";
import { getCurrentUserId } from "@/server/auth/session";
import { UserModel } from "@/server/auth/models";
import { MembershipModel } from "@/server/weddings/models";
import JoinActions from "./join-actions";
import "./join.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Join This Wedding | Make My Marriage", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const context = await inspectInvitation(token);
  if (!context) return <main className="join-shell"><Link className="brand" href="/">Make My Marriage</Link><section className="join-card"><h1>Invitation unavailable</h1><p>This link is invalid, expired, or has been replaced. Ask your wedding organiser to resend your invitation.</p><Link className="button" href="/">Return Home</Link></section></main>;
  const { wedding, invitation } = context;
  const userId = await getCurrentUserId();
  const user = userId ? await UserModel.findById(userId).lean() : null;
  const membership = userId ? await MembershipModel.findOne({ userId }).lean() : null;
  const mismatch = !!user && user.emailNormalized !== invitation.emailNormalized;
  const sameWedding = !!membership && String(membership.weddingId) === String(wedding._id);
  const state = !user ? "signedout" : mismatch ? "mismatch" : sameWedding ? "member" : membership ? "other" : invitation.status === "ACCEPTED" ? "used" : "ready";
  return <main className="join-shell"><header><Link className="brand" href="/">Make My Marriage</Link><span>Wedding Team Invitation</span></header><div className="join-layout"><section className="join-story"><span className="eyebrow">Together for a beautiful beginning</span><h1>Join the Wedding Council</h1><p>You’re invited to help bring <strong>{wedding.brideName} &amp; {wedding.groomName}’s</strong> celebrations to life.</p><div className="join-details"><div><small>Wedding Date</small><strong>{wedding.weddingDate}</strong></div><div><small>Wedding Location</small><strong>{wedding.location?.city}</strong></div></div><div className="join-role"><span className="eyebrow">Your role · {invitation.role === "ADMIN" ? "Admin" : "Manager"}</span><h2>A place in the planning circle</h2><p>{invitation.role === "ADMIN" ? "Help manage the wedding and invite trusted people to the team." : "Help coordinate the wedding alongside family and trusted organisers."}</p><small>This invitation is for the private planning team, rather than a guest RSVP.</small></div></section><section className="join-card"><span className="eyebrow">Your invitation envelope</span><h2>You’re invited</h2><p>Reserved for</p><strong className="join-email">{invitation.email}</strong><p className="join-note">Sign in with this email address to join the wedding.</p><JoinActions token={token} state={state} email={user?.email} /></section></div><footer>Make My Marriage · Your celebration, kept private</footer></main>;
}
