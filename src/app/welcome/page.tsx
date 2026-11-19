import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/server/auth/session";
import { UserModel } from "@/server/auth/models";
import { findWedding } from "@/server/weddings/service";
import "../(auth)/auth.css";
export const dynamic = "force-dynamic";
export default async function WelcomePage() {
  const id = await getCurrentUserId();
  if (!id) redirect("/login");
  const user = await UserModel.findById(id).lean();
  if (!user) redirect("/login");
  redirect((await findWedding(id)) ? "/app" : "/onboarding");
}
