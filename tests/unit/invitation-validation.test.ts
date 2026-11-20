import { describe, expect, it } from "vitest";
import { invitationSchema, invitationPath } from "@/server/invitations/validation";
describe("invitation input", () => {
  it("normalizes email and defaults to Manager", () => {
    expect(invitationSchema.parse({ email: " Family@Example.com " })).toEqual({ email: "family@example.com", role: "MANAGER" });
  });
  it("rejects invalid emails and privilege values", () => {
    expect(invitationSchema.safeParse({ email: "bad" }).success).toBe(false);
    expect(invitationSchema.safeParse({ email: "a@example.com", role: "OWNER" }).success).toBe(false);
  });
  it("allows only token-shaped internal invitation paths", () => {
    expect(invitationPath("a".repeat(64))).toBe(`/join/${"a".repeat(64)}`);
    for (const value of ["https://evil.example", "//evil.example", "../app", ["a".repeat(64)], undefined]) expect(invitationPath(value)).toBe(null);
  });
});
