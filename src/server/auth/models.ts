import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true }, emailNormalized: { type: String, required: true, unique: true }, passwordHash: { type: String, required: true, select: false } }, { timestamps: true });
const limitSchema = new Schema({ _id: String, count: { type: Number, required: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } } });
type User = InferSchemaType<typeof userSchema>;
type Limit = InferSchemaType<typeof limitSchema>;
export const UserModel = (mongoose.models.User as Model<User>) || mongoose.model("User", userSchema);
export const LimitModel = (mongoose.models.AuthRateLimit as Model<Limit>) || mongoose.model("AuthRateLimit", limitSchema);
