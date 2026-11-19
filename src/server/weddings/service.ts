import "server-only";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase, requireTransactionDatabase } from "@/server/database";
import { ApiError } from "@/server/http/api-error";
import { UserModel } from "@/server/auth/models";
import { WeddingModel, MembershipModel } from "./models";
import { weddingSchema } from "./schema";

export async function findWedding(userId: string) {
  await connectToDatabase();
  const membership = await MembershipModel.findOne({ userId }).lean();
  if (!membership) return null;
  const wedding = await WeddingModel.findOne({
    _id: membership.weddingId,
    deletedAt: null,
  }).lean();
  if (!wedding)
    throw new ApiError(
      409,
      "Your wedding workspace is unavailable. Contact support.",
    );
  return { wedding, membership };
}
export async function createWedding(userId: string, input: unknown) {
  const data = weddingSchema.parse(input);
  await connectToDatabase();
  await requireTransactionDatabase();
  await Promise.all([WeddingModel.init(), MembershipModel.init()]);
  try {
    await mongoose.connection.transaction(async (session) => {
      if (!(await UserModel.exists({ _id: userId }).session(session)))
        throw new ApiError(401, "Sign in again");
      if (await MembershipModel.exists({ userId }).session(session))
        throw new ApiError(409, "You already belong to a wedding");
      const slug =
        `${data.brideName}-${data.groomName}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 70) +
        "-" +
        randomBytes(6).toString("hex");
      const [wedding] = await WeddingModel.create(
        [
          {
            brideName: data.brideName,
            groomName: data.groomName,
            title:
              data.title || `${data.brideName} & ${data.groomName}’s Wedding`,
            weddingDate: data.weddingDate,
            location: { city: data.city },
            createdByUserId: userId,
            website: { slug, isPublished: false },
          },
        ],
        { session },
      );
      await MembershipModel.create(
        [{ userId, weddingId: wedding._id, role: "ADMIN" }],
        { session },
      );
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000)
      throw new ApiError(409, "You already belong to a wedding");
    throw error;
  }
}
export async function editWedding(userId: string, input: unknown) {
  const data = weddingSchema.parse(input);
  const context = await findWedding(userId);
  if (!context) throw new ApiError(403, "Create or join a wedding first");
  if (!["ADMIN", "MANAGER"].includes(context.membership.role))
    throw new ApiError(403, "Access denied");
  await WeddingModel.updateOne(
    { _id: context.wedding._id, deletedAt: null },
    {
      $set: {
        brideName: data.brideName,
        groomName: data.groomName,
        title: data.title || `${data.brideName} & ${data.groomName}’s Wedding`,
        weddingDate: data.weddingDate,
        "location.city": data.city,
      },
    },
  );
}
