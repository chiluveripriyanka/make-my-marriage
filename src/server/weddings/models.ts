import "server-only";
import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";
const weddingSchema = new Schema(
  {
    brideName: { type: String, required: true },
    groomName: { type: String, required: true },
    title: String,
    weddingDate: { type: String, required: true },
    timeZone: { type: String, default: "Asia/Kolkata" },
    location: { city: { type: String, required: true } },
    website: {
      slug: { type: String, unique: true },
      isPublished: { type: Boolean, default: false },
      theme: { type: String, default: "CLASSIC_INDIAN" },
    },
    createdByUserId: { type: Schema.Types.ObjectId, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
const membershipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    weddingId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ["ADMIN", "MANAGER"], required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "wedding_memberships" },
);
membershipSchema.index({ weddingId: 1, role: 1 });
export const WeddingModel =
  (mongoose.models.Wedding as Model<InferSchemaType<typeof weddingSchema>>) ||
  mongoose.model("Wedding", weddingSchema);
export const MembershipModel =
  (mongoose.models.WeddingMembership as Model<
    InferSchemaType<typeof membershipSchema>
  >) || mongoose.model("WeddingMembership", membershipSchema);
