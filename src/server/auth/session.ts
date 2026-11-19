import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { env } from "@/config/env";
import { connectToDatabase } from "@/server/database";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

type Session = InferSchemaType<typeof sessionSchema>;

const SessionModel: Model<Session> =
  (mongoose.models.Session as Model<Session> | undefined) ??
  mongoose.model<Session>("Session", sessionSchema);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}


function sessionExpiry(): Date {
  return new Date(Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export async function createSession(userId: string): Promise<void> {
  await connectToDatabase();

  const token = randomBytes(32).toString("base64url");
  const expiresAt = sessionExpiry();

  await SessionModel.create({ userId, tokenHash: hashToken(token), expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  await connectToDatabase();
  const session = await SessionModel.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();

  return session?.userId.toString() ?? null;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  if (token) {
    await connectToDatabase();
    await SessionModel.deleteOne({ tokenHash: hashToken(token) });
  }

  cookieStore.delete(env.SESSION_COOKIE_NAME);
}
