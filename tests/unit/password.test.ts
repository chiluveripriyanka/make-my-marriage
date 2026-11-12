import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "@/server/auth/password";

describe("password helpers", () => {
  it("hashes and verifies a password", async () => {
    const passwordHash = await hashPassword("A-strong-password-123");

    expect(passwordHash).not.toBe("A-strong-password-123");
    await expect(verifyPassword("A-strong-password-123", passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", passwordHash)).resolves.toBe(false);
  });
});
