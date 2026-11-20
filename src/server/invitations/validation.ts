import { z } from "zod";
export const invitationSchema = z.object({ email: z.string().trim().max(254).email().transform(value => value.toLowerCase()), role: z.enum(["ADMIN", "MANAGER"]).default("MANAGER") });
export const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export function invitationPath(token: unknown) {
  return tokenSchema.safeParse(token).success ? `/join/${token}` : null;
}
