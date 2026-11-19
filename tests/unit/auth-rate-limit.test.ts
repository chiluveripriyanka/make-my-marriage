import { beforeEach, describe, expect, it, vi } from "vitest";
const { update, connect } = vi.hoisted(() => ({ update: vi.fn(), connect: vi.fn() }));
vi.mock("@/server/auth/models", () => ({ LimitModel: { findOneAndUpdate: update } }));
vi.mock("@/server/database", () => ({ connectToDatabase: connect }));
import { aggregateRateLimit, rateLimit } from "@/server/auth/request";

describe("authentication limits", () => {
  beforeEach(() => { update.mockReset(); connect.mockReset(); });
  it("uses the same aggregate bucket across requests and blocks attempt 101", async () => {
    update.mockResolvedValueOnce({ count: 100 }).mockResolvedValueOnce({ count: 101 });
    await aggregateRateLimit();
    await expect(aggregateRateLimit()).rejects.toMatchObject({ status: 429 });
    expect(update.mock.calls[0][0]).toEqual(update.mock.calls[1][0]);
    expect(connect).toHaveBeenCalledTimes(2);
  });
  it("also limits individual accounts", async () => {
    update.mockResolvedValue({ count: 11 });
    await expect(rateLimit("login", "test@example.invalid")).rejects.toMatchObject({ status: 429 });
  });
  it("handles a concurrent bucket creation without granting a free attempt", async () => {
    update.mockRejectedValueOnce({ code: 11000 }).mockResolvedValueOnce({ count: 101 });
    await expect(aggregateRateLimit()).rejects.toMatchObject({ status: 429 });
    expect(update).toHaveBeenCalledTimes(2);
  });
});
