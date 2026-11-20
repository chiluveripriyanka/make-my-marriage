import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

describe.skipIf(process.env.RUN_INVITATION_DB_TESTS !== "1")("wedding member access and concurrency", () => {
  let changeMember: typeof import("@/server/weddings/members").changeMember;
  let models: typeof import("@/server/weddings/models");
  const users = Array.from({ length: 4 }, () => new mongoose.Types.ObjectId());
  const weddings = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
  const members = Array.from({ length: 4 }, () => new mongoose.Types.ObjectId());
  beforeAll(async () => {
    const previous = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "development"); loadEnvConfig(process.cwd(), true); vi.stubEnv("NODE_ENV", previous);
    ({ changeMember } = await import("@/server/weddings/members"));
    models = await import("@/server/weddings/models");
    await (await import("@/server/database")).requireTransactionDatabase();
    await models.MembershipModel.init();
    await models.WeddingModel.create(weddings.map((_id, i) => ({ _id, brideName: "Test", groomName: "Team", weddingDate: "2027-01-01", location: { city: "Test" }, createdByUserId: users[i ? 3 : 0], website: { slug: `member-test-${_id}` } })));
    await models.MembershipModel.create(users.map((userId, i) => ({ _id: members[i], userId, weddingId: weddings[i === 3 ? 1 : 0], role: i === 2 ? "MANAGER" : "ADMIN" })));
  }, 30000);
  afterAll(async () => {
    if (models && mongoose.connection.readyState === 1) {
      await models.MembershipModel.deleteMany({ weddingId: { $in: weddings } });
      await models.WeddingModel.deleteMany({ _id: { $in: weddings } });
    }
    await mongoose.disconnect();
  });
  it("rejects Manager operations and foreign wedding targets", async () => {
    await expect(changeMember(String(users[2]), String(members[1]), { action: "remove" })).rejects.toMatchObject({ status: 403 });
    await expect(changeMember(String(users[0]), String(members[3]), { action: "remove" })).rejects.toMatchObject({ status: 404 });
  });
  it("blocks self changes and last Admin removal", async () => {
    await expect(changeMember(String(users[0]), String(members[0]), { action: "edit", role: "MANAGER" })).rejects.toMatchObject({ status: 409 });
    await expect(changeMember(String(users[3]), String(members[3]), { action: "remove" })).rejects.toThrow("at least one Admin");
  });
  it("edits roles and removes membership", async () => {
    await changeMember(String(users[0]), String(members[2]), { action: "edit", role: "ADMIN" });
    expect((await models.MembershipModel.findById(members[2]))?.role).toBe("ADMIN");
    await changeMember(String(users[0]), String(members[2]), { action: "edit", role: "MANAGER" });
    await changeMember(String(users[0]), String(members[2]), { action: "remove" });
    expect(await models.MembershipModel.findById(members[2])).toBeNull();
    await expect(changeMember(String(users[2]), String(members[0]), { action: "remove" })).rejects.toMatchObject({ status: 403 });
  });
  it("serializes concurrent Admin demotions and preserves an Admin", async () => {
    const results = await Promise.allSettled([
      changeMember(String(users[0]), String(members[1]), { action: "edit", role: "MANAGER" }),
      changeMember(String(users[1]), String(members[0]), { action: "edit", role: "MANAGER" }),
    ]);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
    expect(await models.MembershipModel.countDocuments({ weddingId: weddings[0], role: "ADMIN" })).toBe(1);
  });
});
