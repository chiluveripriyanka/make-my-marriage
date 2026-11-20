import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "../access";
import { findWedding } from "@/server/weddings/service";
export default async function DashboardPage() {
  const context = await findWedding(await requireUser());
  if (!context) redirect("/onboarding");
  const w = context.wedding;
  return (
    <main className="wedding-ready">
      <span className="eyebrow">
        Your wedding workspace · {context.membership.role}
      </span>
      <h1>{w.title}</h1>
      <p>
        {w.weddingDate} · {w.location?.city}
      </p>
      <Link className="button" href="/app/settings/wedding">
        Edit Wedding
      </Link>
      <Link className="button" href="/app/settings/members">Your Wedding Team</Link>
      <section className="wedding-summary">
        <h2>A beautiful beginning</h2>
        <p>
          Your wedding team is ready to grow. Events, tasks, and guests
          will be added in the next milestones.
        </p>
        <Link href="/wedding-ready" className="text-link">
          View wedding overview →
        </Link>
      </section>
    </main>
  );
}
