import { describe, expect, it } from "vitest";
import { weddingSchema } from "@/server/weddings/schema";
const data = {
  brideName: " Priya ",
  groomName: "Arjun",
  weddingDate: "2028-02-29",
  city: " Jaipur ",
};
describe("wedding input", () => {
  it("trims fields and accepts a leap-day wedding", () => {
    expect(weddingSchema.parse(data)).toMatchObject({
      brideName: "Priya",
      city: "Jaipur",
      title: "",
    });
  });
  it("rejects impossible dates and blank names", () => {
    expect(
      weddingSchema.safeParse({ ...data, weddingDate: "2027-02-29" }).success,
    ).toBe(false);
    expect(weddingSchema.safeParse({ ...data, brideName: " " }).success).toBe(
      false,
    );
  });
  it("does not accept client ownership or publishing fields", () => {
    const parsed = weddingSchema.parse({
      ...data,
      createdByUserId: "other",
      weddingId: "other",
      role: "ADMIN",
      website: { isPublished: true },
    });
    expect(parsed).not.toHaveProperty("weddingId");
    expect(parsed).not.toHaveProperty("website");
    expect(parsed).not.toHaveProperty("createdByUserId");
  });
});
