import { describe, expect, it, vi } from "vitest";
const { command } = vi.hoisted(() => ({ command: vi.fn() }));
vi.mock("@/config/env", () => ({ env: { MONGODB_URI: "mongodb://test.invalid/test" } }));
vi.mock("mongoose", () => ({ default: { connect: vi.fn().mockResolvedValue({}), connection: { db: { admin: () => ({ command }) } } } }));
import { requireTransactionDatabase } from "@/server/database";
describe("transaction deployment check", () => {
  it("rejects standalone MongoDB with a setup message", async () => { command.mockResolvedValue({}); await expect(requireTransactionDatabase()).rejects.toMatchObject({ status: 503, code: "TRANSACTIONS_UNAVAILABLE" }); });
  it("accepts replica sets and sharded deployments", async () => { command.mockResolvedValue({ setName: "rs0" }); await expect(requireTransactionDatabase()).resolves.toBeUndefined(); command.mockResolvedValue({ msg: "isdbgrid" }); await expect(requireTransactionDatabase()).resolves.toBeUndefined(); });
});
