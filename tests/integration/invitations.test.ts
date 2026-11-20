import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
const { send } = vi.hoisted(() => ({ send: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/server/invitations/email", () => ({ emailConfig: vi.fn(), sendInvitation: send }));
vi.mock("@/server/auth/request", () => ({ rateLimit: vi.fn() }));
const enabled = process.env.RUN_INVITATION_DB_TESTS === "1";
describe.skipIf(!enabled)("database invitation lifecycle (mock email)", () => {
  let service: typeof import("@/server/invitations/service");
  let users: typeof import("@/server/auth/models");
  let models: typeof import("@/server/weddings/models");
  let invitations: typeof import("@/server/invitations/model");
  const ids = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());
  const weddingId = new mongoose.Types.ObjectId();
  const suffix = weddingId.toString();
  const email = (i: number) => `invitation-test-${suffix}-${i}@example.invalid`;
  let token: string;
  let invitationId: string;
  beforeAll(async () => {
    const nodeEnv = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "development");
    loadEnvConfig(process.cwd(), true);
    vi.stubEnv("NODE_ENV", nodeEnv);
    service = await import("@/server/invitations/service"); users = await import("@/server/auth/models"); models = await import("@/server/weddings/models"); invitations = await import("@/server/invitations/model");
    const db = await import("@/server/database"); await db.connectToDatabase(); await db.requireTransactionDatabase();
    await Promise.all([models.MembershipModel.init(), invitations.InvitationModel.init()]);
    await users.UserModel.create(ids.map((_id, i) => ({ _id, name: "Invitation test", email: email(i), emailNormalized: email(i), passwordHash: "not-a-login-hash" })));
    await models.WeddingModel.create({ _id: weddingId, brideName: "Test", groomName: "Team", weddingDate: "2027-01-01", location: { city: "Test" }, createdByUserId: ids[0], website: { slug: `test-${suffix}` } });
    await models.MembershipModel.create([{ userId: ids[0], weddingId, role: "ADMIN" }, { userId: ids[1], weddingId, role: "MANAGER" }]);
  }, 30000);
  afterAll(async () => {
    if (mongoose.connection.readyState === 1 && models && users && invitations) {
      await invitations.InvitationModel.deleteMany({ weddingId }); await models.MembershipModel.deleteMany({ userId: { $in: ids } }); await models.WeddingModel.deleteMany({ _id: weddingId }); await users.UserModel.deleteMany({ _id: { $in: ids } });
    }
    await mongoose.disconnect();
  });
  it("rejects manager invitations", async () => {
    await expect(service.invite(String(ids[1]), { email: email(2) })).rejects.toMatchObject({ status: 403 });
    expect(send).not.toHaveBeenCalled();
  });
  it("creates a pending invite, stores a hash and prevents duplicates", async () => {
    expect((await service.invite(String(ids[0]), { email: email(2) })).sent).toBe(true);
    token = send.mock.calls[0][3];
    const doc = await invitations.InvitationModel.findOne({ weddingId, email: email(2) }).select("+tokenHash").lean();
    expect(doc?.tokenHash).toBe(service.hashToken(token)); expect(doc?.tokenHash).not.toBe(token); invitationId = String(doc!._id);
    expect(await models.MembershipModel.exists({ userId: ids[2] })).toBeNull();
    await expect(service.invite(String(ids[0]), { email: email(2) })).rejects.toMatchObject({ status: 409 });
  });
  it("enforces resend cooldown, rotates tokens and invalidates old links", async () => {
    await expect(service.invite(String(ids[0]), {}, invitationId)).rejects.toMatchObject({ status: 409 });
    await invitations.InvitationModel.updateOne({ _id: invitationId }, { $set: { updatedAt: new Date(Date.now() - 120000) } }, { timestamps: false });
    await service.invite(String(ids[0]), {}, invitationId);
    expect(await service.inspectInvitation(token)).toBeNull(); token = send.mock.calls[0][3];
    expect(await service.inspectInvitation(token)).not.toBeNull();
  });
  it("rejects wrong email and expired invitations without adding membership", async () => {
    await expect(service.acceptInvitation(String(ids[3]), token)).rejects.toMatchObject({ status: 403 });
    await invitations.InvitationModel.updateOne({ _id: invitationId }, { $set: { expiresAt: new Date(0) } });
    await expect(service.acceptInvitation(String(ids[2]), token)).rejects.toMatchObject({ status: 410 });
    expect(await models.MembershipModel.exists({ userId: ids[2] })).toBeNull();
    await invitations.InvitationModel.updateOne({ _id: invitationId }, { $set: { expiresAt: new Date(Date.now() + 86400000) } });
  });
  it("accepts atomically and safely handles repeated acceptance", async () => {
    await Promise.all([service.acceptInvitation(String(ids[2]), token), service.acceptInvitation(String(ids[2]), token)]);
    expect(await models.MembershipModel.countDocuments({ userId: ids[2], weddingId })).toBe(1);
    expect((await invitations.InvitationModel.findById(invitationId))?.status).toBe("ACCEPTED");
    expect(await service.inspectInvitation(token)).not.toBeNull();
    await invitations.InvitationModel.updateOne({ _id: invitationId }, { $set: { expiresAt: new Date(0) } });
    expect(await service.inspectInvitation(token)).toBeNull();
  });
  it("retains failed delivery for resend and blocks joining another wedding", async () => {
    send.mockRejectedValueOnce(new Error("provider unavailable"));
    expect((await service.invite(String(ids[0]), { email: email(4) })).sent).toBe(false);
    const failed = await invitations.InvitationModel.findOne({ email: email(4) }); expect(failed?.delivery).toBe("FAILED");
    const otherToken = send.mock.calls[0][3];
    await models.MembershipModel.create({ userId: ids[4], weddingId: new mongoose.Types.ObjectId(), role: "MANAGER" });
    await expect(service.acceptInvitation(String(ids[4]), otherToken)).rejects.toMatchObject({ status: 409 });
    expect((await invitations.InvitationModel.findById(failed!._id))?.status).toBe("PENDING");
  });
});
