import "server-only";
import { createHash, randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase, requireTransactionDatabase } from "@/server/database";
import { UserModel } from "@/server/auth/models";
import { rateLimit } from "@/server/auth/request";
import { MembershipModel, WeddingModel } from "@/server/weddings/models";
import { findWedding } from "@/server/weddings/service";
import { ApiError } from "@/server/http/api-error";
import { InvitationModel } from "./model";
import { invitationSchema, tokenSchema } from "./validation";
import { emailConfig, sendInvitation } from "./email";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
async function admin(userId: string) {
  const context = await findWedding(userId);
  if (!context || context.membership.role !== "ADMIN") throw new ApiError(403, "Only wedding admins can manage invitations");
  await rateLimit("invitation-send", String(context.wedding._id));
  return context;
}
export async function invite(userId: string, input: unknown, resendId?: string) {
  const { wedding } = await admin(userId);
  emailConfig();
  await InvitationModel.init();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 7 * 86400000);
  let invitation;
  if (resendId) {
    if (!mongoose.isValidObjectId(resendId)) throw new ApiError(404, "Invitation not found");
    invitation = await InvitationModel.findOneAndUpdate({ _id: resendId, weddingId: wedding._id, status: "PENDING", updatedAt: { $lt: new Date(Date.now() - 60000) } }, { $set: { tokenHash, expiresAt, delivery: "SENDING" } }, { new: true });
    if (!invitation) throw new ApiError(409, "Invitation unavailable or recently sent. Wait one minute before resending.");
  } else {
    const data = invitationSchema.parse(input);
    const existing = await UserModel.findOne({ emailNormalized: data.email }).lean();
    if (existing && await MembershipModel.exists({ userId: existing._id })) throw new ApiError(409, "This email already belongs to a wedding workspace");
    try {
      invitation = await InvitationModel.create({ weddingId: wedding._id, email: data.email, emailNormalized: data.email, role: data.role, tokenHash, expiresAt, invitedByUserId: userId });
    } catch (error) {
      if ((error as { code?: number }).code === 11000) throw new ApiError(409, "An invitation already exists for this email. Resend it from Pending Invitations.");
      throw error;
    }
  }
  let sent = false;
  try { await sendInvitation(invitation.email, wedding.title || "Your wedding", invitation.role, token, `invitation/${tokenHash}`); sent = true; } catch { /* Do not log credentials or invitation tokens. */ }
  await InvitationModel.updateOne({ _id: invitation._id, tokenHash, status: "PENDING" }, { $set: { delivery: sent ? "SENT" : "FAILED" } });
  return { sent, message: sent ? "Invitation sent. The link expires in 7 days." : "Invitation saved, but email delivery could not be confirmed. Please resend after one minute." };
}
export async function inspectInvitation(token: string) {
  if (!tokenSchema.safeParse(token).success) return null;
  await connectToDatabase();
  const invitation = await InvitationModel.findOne({ tokenHash: hashToken(token) }).lean();
  if (!invitation || invitation.status === "REVOKED" || invitation.expiresAt <= new Date()) return null;
  const wedding = await WeddingModel.findOne({ _id: invitation.weddingId, deletedAt: null }).lean();
  return wedding ? { invitation, wedding } : null;
}
export async function acceptInvitation(userId: string, token: string) {
  tokenSchema.parse(token);
  await connectToDatabase();
  await rateLimit("invitation-accept", userId);
  await requireTransactionDatabase();
  await MembershipModel.init();
  try {
    await mongoose.connection.transaction(async session => {
      const invitation = await InvitationModel.findOne({ tokenHash: hashToken(token) }).session(session);
      const user = await UserModel.findById(userId).session(session);
      if (!invitation || invitation.status === "REVOKED") throw new ApiError(410, "This invitation is no longer available");
      if (!user || user.emailNormalized !== invitation.emailNormalized) throw new ApiError(403, "Sign in with the invited email address");
      if (!await WeddingModel.exists({ _id: invitation.weddingId, deletedAt: null }).session(session)) throw new ApiError(410, "Wedding unavailable");
      const member = await MembershipModel.findOne({ userId }).session(session);
      if (member) {
        if (String(member.weddingId) === String(invitation.weddingId)) return;
        throw new ApiError(409, "You already belong to another wedding");
      }
      if (invitation.status !== "PENDING" || invitation.expiresAt <= new Date()) throw new ApiError(410, "This invitation has expired or was already accepted");
      await MembershipModel.create([{ userId, weddingId: invitation.weddingId, role: invitation.role }], { session });
      invitation.status = "ACCEPTED";
      invitation.acceptedByUserId = new mongoose.Types.ObjectId(userId);
      invitation.acceptedAt = new Date();
      await invitation.save({ session });
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) throw new ApiError(409, "You already belong to a wedding. Refresh to continue.");
    throw error;
  }
}
