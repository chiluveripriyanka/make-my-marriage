import { z } from "zod";

export const emailSchema = z.string().trim().email().max(254).transform(v => v.toLowerCase());
export const passwordSchema = z.string().min(8, "Use at least 8 characters").refine(v => new TextEncoder().encode(v).length <= 72, "Password must be at most 72 bytes");
export const signupSchema = z.object({ name: z.string().trim().min(1).max(100), email: emailSchema, password: passwordSchema });
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(256) });
