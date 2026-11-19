import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireUser } from "../access";
import { findWedding } from "@/server/weddings/service";
export default async function ReadyPage() {
  const context = await findWedding(await requireUser());
  if (!context) redirect("/onboarding");
  const w = context.wedding;
  const date = new Date(`${w.weddingDate}T00:00:00Z`);
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const todayParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: w.timeZone || "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => todayParts.find((p) => p.type === type)?.value;
  const today = Date.UTC(
    Number(part("year")),
    Number(part("month")) - 1,
    Number(part("day")),
  );
  const days = Math.round((date.getTime() - today) / 86400000);
  const countdown =
    days > 0
      ? `${days} ${days === 1 ? "Day" : "Days"} to Go`
      : days === 0
        ? "Today is the Day!"
        : "A Celebration to Remember";
  return (
    <>
      <main className="ready-showcase">
        <svg
          className="ready-mandala"
          aria-hidden="true"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        >
          <circle cx="200" cy="200" r="180" strokeDasharray="4 6" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="100" strokeDasharray="2 4" />
          <circle cx="200" cy="200" r="60" />
          <path d="M200 20V380M20 200H380M72 72L328 328M72 328L328 72" />
          <path d="M200 60C230 120 280 170 340 200C280 230 230 280 200 340C170 280 120 230 60 200C120 170 170 120 200 60Z" />
        </svg>
        <div className="ready-intro">
          <h1>Your Wedding is Ready</h1>
          <p>
            Welcome to your private wedding workspace for {w.brideName} &{" "}
            {w.groomName}.
          </p>
        </div>
        <article className="ready-card">
          <div className="ready-photo">
            <Image
              src="/images/wedding-ready.png"
              alt="Indian wedding celebration inspiration"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 420px"
            />
            <div className="ready-photo-shade" />
            <div className="ready-photo-caption">
              <h2>
                {w.brideName} & {w.groomName}
              </h2>
              <p>Wedding Workspace · {month}</p>
              <span>Celebration inspiration</span>
            </div>
          </div>
          <div className="ready-details">
            <section className="ready-detail ready-date">
              <span className="ready-icon" aria-hidden="true">
                ▦
              </span>
              <div>
                <span className="eyebrow">Wedding Date</span>
                <h3>{formattedDate}</h3>
              </div>
              <span className="ready-countdown">{countdown}</span>
            </section>
            <section className="ready-detail ready-location">
              <span className="ready-icon" aria-hidden="true">
                ⌖
              </span>
              <div>
                <span className="eyebrow">Location</span>
                <h3>{w.location?.city}</h3>
              </div>
            </section>
          </div>
        </article>
        <div className="ready-actions">
          <Link className="button" href="/app">
            Enter Dashboard →
          </Link>
        </div>
      </main>
      <footer className="ready-footer">
        <div>
          <strong>Make My Marriage</strong>
          <p>
            Curated wedding logistics, cultural ceremonies & celebratory
            excellence.
          </p>
        </div>
        <Link href="/app/settings/wedding">Setup Preferences</Link>
        <small>© {new Date().getFullYear()} Make My Marriage Workspace.</small>
      </footer>
    </>
  );
}
