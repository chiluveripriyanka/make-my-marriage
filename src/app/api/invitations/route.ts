import { z } from "zod";
import { requireUser } from "@/server/auth/authorization";
import { checkOrigin } from "@/server/auth/request";
import { ApiError } from "@/server/http/api-error";
import { apiSuccess } from "@/server/http/api-response";
import { withErrorHandling } from "@/server/http/route-handler";
import { invite, acceptInvitation } from "@/server/invitations/service";
export const runtime = "nodejs";
export const POST = withErrorHandling(async (request: Request) => {
  checkOrigin(request);
  const userId = await requireUser();
  const text = await request.text();
  if (text.length > 4096) throw new ApiError(413, "Request too large");
  let input;
  try { input = JSON.parse(text); } catch { throw new ApiError(400, "Invalid JSON"); }
  const body = z.object({ action: z.enum(["invite", "resend", "accept"]), id: z.string().optional(), token: z.string().optional(), email: z.unknown().optional(), role: z.unknown().optional() }).parse(input);
  if (body.action === "accept") { await acceptInvitation(userId, z.string().parse(body.token)); return apiSuccess({ redirect: "/app/settings/members", message: "Welcome to the team!" }); }
  return apiSuccess(await invite(userId, body, body.action === "resend" ? z.string().min(1).parse(body.id) : undefined));
});
