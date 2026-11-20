import "server-only";
import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const schema = new Schema({
  weddingId: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  emailNormalized: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "MANAGER"], required: true },
  tokenHash: { type: String, required: true, unique: true, select: false },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "REVOKED"], default: "PENDING" },
  delivery: { type: String, enum: ["SENDING", "SENT", "FAILED"], default: "SENDING" },
  invitedByUserId: { type: Schema.Types.ObjectId, required: true },
  acceptedByUserId: Schema.Types.ObjectId,
  acceptedAt: Date,
  expiresAt: { type: Date, required: true },
}, { timestamps: true, collection: "wedding_member_invitations" });
schema.index({ weddingId: 1, emailNormalized: 1 }, { unique: true, partialFilterExpression: { status: "PENDING" } });
schema.index({ weddingId: 1, status: 1 });
export const InvitationModel = (mongoose.models.WeddingInvitation as Model<InferSchemaType<typeof schema>>) || mongoose.model("WeddingInvitation", schema);
