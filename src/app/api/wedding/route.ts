import { requireUser } from "@/server/auth/authorization";
import { checkOrigin } from "@/server/auth/request";
import { createWedding, editWedding } from "@/server/weddings/service";
import { apiSuccess } from "@/server/http/api-response";
import { ApiError } from "@/server/http/api-error";
import { withErrorHandling } from "@/server/http/route-handler";
export const runtime = "nodejs";
async function save(request: Request, editing: boolean) {
  checkOrigin(request);
  const id = await requireUser();
  const text = await request.text();
  if (text.length > 4096) throw new ApiError(413, "Request too large");
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError(400, "Invalid JSON");
  }
  await (editing ? editWedding(id, body) : createWedding(id, body));
  return apiSuccess({ redirect: editing ? "/app" : "/wedding-ready" });
}
export const POST = withErrorHandling((request: Request) =>
  save(request, false),
);
export const PATCH = withErrorHandling((request: Request) =>
  save(request, true),
);
