import { redirect } from "next/navigation";
import { requireUser } from "../../../access";
import { findWedding } from "@/server/weddings/service";
import WeddingForm from "../../../wedding-form";
export default async function EditPage() {
  const context = await findWedding(await requireUser());
  if (!context) redirect("/onboarding");
  const w = context.wedding;
  return (
    <WeddingForm
      editing
      initial={{
        brideName: w.brideName,
        groomName: w.groomName,
        title: w.title || "",
        weddingDate: w.weddingDate,
        city: w.location?.city || "",
      }}
    />
  );
}
