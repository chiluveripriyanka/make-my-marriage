import Dashboard from "./dashboard";
import { sample } from "./dashboard-data";
import { redirect } from "next/navigation";
import { requireUser } from "../access";
import { findWedding } from "@/server/weddings/service";
export const metadata = { title: "Wedding Dashboard | Make My Marriage" };
export default async function DashboardPage() {
  const context = await findWedding(await requireUser());
  if (!context) redirect("/onboarding");
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const days = Math.max(0, Math.ceil((Date.parse(sample.date) - Date.parse(today)) / 86400000));
  return <Dashboard days={days} admin={context.membership.role === "ADMIN"} />;
}
