import "server-only";
import mongoose from "mongoose";
import { z } from "zod";
import { requireTransactionDatabase } from "@/server/database";
import { ApiError } from "@/server/http/api-error";
import { MembershipModel, WeddingModel } from "./models";

const changeSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("edit"), role: z.enum(["ADMIN", "MANAGER"]) }),
  z.object({ action: z.literal("remove") }),
]);

export async function changeMember(userId: string, memberId: string, input: unknown) {
  const change = changeSchema.parse(input);
  if (!/^[a-f\d]{24}$/i.test(memberId)) throw new ApiError(404, "Member not found");
  await requireTransactionDatabase();
  await mongoose.connection.transaction(async session => {
    const actor = await MembershipModel.findOne({ userId }).session(session);
    if (!actor || actor.role !== "ADMIN") throw new ApiError(403, "Only Admins can manage wedding members");
    // Serialize membership changes per wedding to prevent concurrent Admins
    // removing/demoting each other based on stale membership counts.
    const locked = await WeddingModel.updateOne(
      { _id: actor.weddingId, deletedAt: null },
      { $inc: { membershipVersion: 1 } }, { session },
    );
    if (!locked.matchedCount) throw new ApiError(404, "Wedding unavailable");
    const target = await MembershipModel.findOne({ _id: memberId, weddingId: actor.weddingId }).session(session);
    if (!target) throw new ApiError(404, "Member not found");
    if (target.role === "ADMIN" && (change.action === "remove" || change.role !== "ADMIN")) {
      if (await MembershipModel.countDocuments({ weddingId: actor.weddingId, role: "ADMIN" }).session(session) <= 1)
        throw new ApiError(409, "The wedding must keep at least one Admin. Promote another member first.");
    }
    if (String(target.userId) === userId) throw new ApiError(409, "You cannot change your own role or remove yourself");
    if (change.action === "remove") await target.deleteOne({ session });
    else { target.role = change.role; await target.save({ session }); }
  });
}
