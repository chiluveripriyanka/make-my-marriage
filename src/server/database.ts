import "server-only";

import mongoose from "mongoose";

import { env } from "@/config/env";
import { ApiError } from "@/server/http/api-error";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.connection) return cache.connection;

  cache.promise ??= mongoose.connect(env.MONGODB_URI);

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}

export async function requireTransactionDatabase() {
  await connectToDatabase();
  const hello = await mongoose.connection.db!.admin().command({ hello: 1 });
  if (!hello.setName && hello.msg !== "isdbgrid") {
    throw new ApiError(503, "Wedding creation requires MongoDB Atlas or a replica set. See README for local setup.", "TRANSACTIONS_UNAVAILABLE");
  }
}
