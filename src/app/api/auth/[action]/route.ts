import { authenticate } from "@/server/auth/service";
import { checkOrigin, aggregateRateLimit } from "@/server/auth/request";
import { deleteSession } from "@/server/auth/session";
import { ApiError } from "@/server/http/api-error";
import { apiSuccess } from "@/server/http/api-response";
import { withErrorHandling } from "@/server/http/route-handler";

export const runtime = "nodejs";
export const POST = withErrorHandling(async (request: Request, context: { params: Promise<{ action: string }> }) => {
  checkOrigin(request);
  const { action } = await context.params;
  if (action === "logout") { await deleteSession(); return apiSuccess({ redirect: "/login" }); }
  if (!["login", "signup"].includes(action)) throw new ApiError(404, "Not found");
  await aggregateRateLimit();
  const text = await request.text();
  if (text.length > 4096) throw new ApiError(413, "Request too large");
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new ApiError(400, "Invalid JSON request"); }
  return apiSuccess(await authenticate(action, body));
});
