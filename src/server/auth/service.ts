import "server-only";
import { connectToDatabase } from "@/server/database";
import { ApiError } from "@/server/http/api-error";
import { UserModel } from "./models";
import { createSession, deleteSession } from "./session";
import { hashPassword, verifyPassword } from "./password";
import { signupSchema, loginSchema } from "./schemas";
import { rateLimit } from "./request";

export async function authenticate(action: string, input: unknown) {
  await connectToDatabase();
  if (action === "signup") {
    const data = signupSchema.parse(input);
    await rateLimit(action, data.email);
    const passwordHash = await hashPassword(data.password);
    let user;
    try { user = await UserModel.create({ name: data.name, email: data.email, emailNormalized: data.email, passwordHash }); }
    catch (error) { if ((error as { code?: number }).code === 11000) throw new ApiError(409, "Unable to create this account. Try signing in."); throw error; }
    await deleteSession();
    await createSession(user.id);
    return { redirect: "/welcome" };
  }
  if (action === "login") {
    const data = loginSchema.parse(input);
    await rateLimit(action, data.email);
    const user = await UserModel.findOne({ emailNormalized: data.email }).select("+passwordHash");
    const fallback = "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW";
    const valid = await verifyPassword(data.password, user?.passwordHash || fallback);
    if (!user || !valid) throw new ApiError(401, "Email or password is incorrect.");
    await deleteSession();
    await createSession(user.id);
    return { redirect: "/welcome" };
  }
  throw new ApiError(404, "Unknown authentication action");
}
