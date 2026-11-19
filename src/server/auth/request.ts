import "server-only";
import { createHash } from "node:crypto";
import { ApiError } from "@/server/http/api-error";
import { LimitModel } from "./models";
import { connectToDatabase } from "@/server/database";

export function checkOrigin(request: Request) {
  const expected = new URL(process.env.APP_URL || request.url).origin;
  if (request.headers.get("origin") !== expected) throw new ApiError(403, "Request origin not allowed");
}

async function consumeAllowance(scope: string, maximum: number) {
  const window = Math.floor(Date.now() / 900000);
  const key = createHash("sha256").update(`${scope}:${window}`).digest("hex");
  let count;
  try {
    count = await LimitModel.findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 2) * 900000) } }, { upsert: true, new: true });
  } catch (error) {
    if ((error as {code?: number}).code !== 11000) throw error;
    count = await LimitModel.findOneAndUpdate({ _id: key }, { $inc: { count: 1 } }, { new: true });
  }
  if (!count || count.count > maximum) throw new ApiError(429, "Too many attempts. Please try again in 15 minutes.");
}

// Database-backed aggregate bucket is shared across instances and independent
// of attacker-controlled emails, tokens, and forwarded-IP headers.
export async function aggregateRateLimit() {
  await connectToDatabase();
  await consumeAllowance("auth:aggregate", 100);
}

export async function rateLimit(action: string, email: string) {
  await consumeAllowance(`auth:account:${action}:${email}`, 10);
}
