import { requireUser } from "@/server/auth/authorization";
import { checkOrigin } from "@/server/auth/request";
import { changeMember } from "@/server/weddings/members";
import { ApiError } from "@/server/http/api-error";
import { apiSuccess } from "@/server/http/api-response";
import { withErrorHandling } from "@/server/http/route-handler";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export const PATCH = withErrorHandling(async (request: Request, context: Context) => {
  checkOrigin(request);
  const userId = await requireUser();
  const text = await request.text();
  if (text.length > 4096) throw new ApiError(413, "Request too large");
  let body;
  try { body = JSON.parse(text); } catch { throw new ApiError(400, "Invalid JSON"); }
  await changeMember(userId, (await context.params).id, { action: "edit", role: body?.role });
  return apiSuccess({ message: "Member role updated." });
});
export const DELETE = withErrorHandling(async (request: Request, context: Context) => {
  checkOrigin(request);
  await changeMember(await requireUser(), (await context.params).id, { action: "remove" });
  return apiSuccess({ message: "Member removed from this wedding." });
});
