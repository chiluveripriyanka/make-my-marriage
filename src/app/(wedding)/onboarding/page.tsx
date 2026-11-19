import { redirect } from "next/navigation";
import { requireUser } from "../access";
import { findWedding } from "@/server/weddings/service";
import WeddingForm from "../wedding-form";
export default async function OnboardingPage() {
  if (await findWedding(await requireUser())) redirect("/app");
  return <WeddingForm />;
}
