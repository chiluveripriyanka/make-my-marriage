import { afterEach, describe, expect, it, vi } from "vitest";
import { emailConfig, sendInvitation } from "@/server/invitations/email";
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("invitation email", () => {
  it("refuses missing credentials", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(emailConfig).toThrow("not configured");
  });
  it("sends a plain text invitation with a fixed application origin", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key"); vi.stubEnv("RESEND_FROM_EMAIL", "test@example.invalid"); vi.stubEnv("APP_URL", "https://wedding.example");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal("fetch", fetchMock);
    await sendInvitation("person@example.invalid", "A & B", "MANAGER", "a".repeat(64), "invitation/test");
    const request = fetchMock.mock.calls[0][1];
    expect(JSON.parse(request.body).text).toContain(`https://wedding.example/join/${"a".repeat(64)}`);
    expect(request.headers["Idempotency-Key"]).toBe("invitation/test");
    fetchMock.mockResolvedValue({ ok: false });
    await expect(sendInvitation("a@example.invalid", "Wedding", "ADMIN", "token", "key")).rejects.toThrow("rejected");
  });
});
