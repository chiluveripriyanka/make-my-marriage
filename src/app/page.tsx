import Image from "next/image";
import PlanningButton from "./planning-button";
import { getCurrentUserId } from "@/server/auth/session";
import { findWedding } from "@/server/weddings/service";
import MasterItinerary from "./master-itinerary";

const features = [
  [
    "01",
    "Multi-Day Events",
    "Every ceremony, connected",
    "Plan Mehendi, Haldi, Sangeet, Pheras, and Reception with dates, venues, and dress codes in one place.",
  ],
  [
    "02",
    "Guest List & RSVP",
    "A warm welcome for everyone",
    "Organize guests, choose their invited events, and collect attendance through secure personal links.",
  ],
  [
    "03",
    "Digital Invitations",
    "A personal invitation",
    "Share invitation links on WhatsApp, send emails, and follow up with RSVP reminders.",
  ],
  [
    "04",
    "Your Wedding Website",
    "Your story, beautifully shared",
    "Choose a theme and share your celebration details, venues, and YouTube livestream with loved ones.",
  ],
  [
    "05",
    "Expense Tracker",
    "Every expense in one place",
    "Record expenses in rupees, organize them by category, and keep your family on the same page.",
  ],
  [
    "06",
    "Your Vendor Directory",
    "The people behind the magic",
    "Discover nearby vendors and keep your chosen vendors’ contacts and event information together.",
  ],
];
const steps = [
  [
    "Create Your Wedding",
    "Add your names, wedding date, and location. Give your celebration a place to call home.",
  ],
  [
    "Invite Your Family",
    "Bring your partner, parents, siblings, and trusted friends into your workspace.",
  ],
  [
    "Plan Every Detail",
    "Create events, assign tasks, invite guests, and record expenses together.",
  ],
  [
    "Celebrate Together",
    "Share your wedding website and collect the candid memories your guests capture.",
  ],
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Make My Marriage home">
      <Image src="/images/stitch-0.png" alt="" width={36} height={36} />
      <span>
        Make My Marriage<small>The Celebration Suite</small>
      </span>
    </a>
  );
}

export default async function HomePage() {
  const userId = await getCurrentUserId();
  const hasWedding = userId ? Boolean(await findWedding(userId)) : false;
  const planningProps = { signedIn: Boolean(userId), hasWedding };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#traditions">Traditional Ceremonies</a>
          </nav>
          <div className="header-actions">
            <PlanningButton login {...planningProps} />
            <PlanningButton {...planningProps} />
          </div>
        </div>
        <details className="mobile-menu">
          <summary>Explore the celebration suite</summary>
          <nav aria-label="Mobile navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#traditions">Traditional Ceremonies</a>
          </nav>
        </details>
      </header>
      <main id="main">
        <section className="hero section" id="home">
          <div className="container">
            <span className="eyebrow pill">✧ Made for Indian weddings</span>
            <h1>
              Your Dream Wedding.
              <br />
              <em>Beautifully Organized.</em>
            </h1>
            <p className="intro">
              Effortlessly coordinate multi-day celebrations — from Mehendi and
              Sangeet to the Mandap and Grand Reception. Bring your partner and
              families together in one harmonious place.
            </p>
            <div className="actions">
              <PlanningButton {...planningProps} />
              <a className="button secondary" href="#preview">
                ▷ Explore the Preview
              </a>
            </div>
            <p className="hero-note">
              One wedding. Many celebrations. Everyone together.
            </p>
            <div className="hero-visual">
              <Image
                src="/images/stitch-1.png"
                alt="An Indian bride and groom celebrating at a decorated wedding mandap"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1000px"
              />
              <div className="photo-shade" />
              <span className="floating-label">✧ Haldi · Sangeet · Pheras</span>
              <div className="photo-caption">
                <strong>A celebration as unique as you</strong>
                <span>Made for the moments that matter</span>
              </div>
              <span className="floating-note">
                ♡ Family, at the heart of every plan
              </span>
            </div>
          </div>
        </section>
        <section className="section tinted" id="features">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Comprehensive capabilities</span>
                <h2>
                  Everything You Need for
                  <br />a Royal Celebration
                </h2>
              </div>
              <p>
                A thoughtful wedding workspace that honors your traditions and
                makes planning together feel simple.
              </p>
            </div>
            <div className="feature-grid">
              {features.map(([number, title, tag, body]) => (
                <article className="feature-card" key={title}>
                  <span className="feature-icon" aria-hidden="true">
                    {number}
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span className="card-tag">✧ {tag}</span>
                </article>
              ))}
            </div>
            <article className="family-card">
              <div>
                <span className="eyebrow">Bridal party & family harmony</span>
                <h3>
                  One Family Workspace.
                  <br />A Lifetime of Memories.
                </h3>
                <p>
                  Assign tasks to family and friends. Guests can scan your
                  gallery QR code to share candid photos through a secure link —
                  no account required.
                </p>
                <a href="#guest-experience" className="text-link">
                  Discover the guest experience →
                </a>
              </div>
              <div className="family-photo">
                <Image
                  src="/images/stitch-2.png"
                  alt="Family and friends sharing a joyful Indian wedding celebration"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            </article>
          </div>
        </section>
        <section className="section" id="preview">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">Command center preview</span>
              <h2>Crafted for Poise Under Pressure</h2>
              <p>Your plans, brought together in a calm and welcoming space.</p>
              <span className="sample-label">
                Illustrative preview · Sample wedding data
              </span>
            </div>
            <div className="dashboard">
              <div className="dashboard-heading">
                <span className="monogram">AR</span>
                <div>
                  <h3>Ananya & Rohan’s Wedding</h3>
                  <p>Jodhpur · 24–27 November 2027</p>
                </div>
              </div>
              <div className="stats">
                {[
                  ["Confirmed Guests", "420", "Guest responses"],
                  [
                    "Recorded Expenses",
                    "₹12,45,000",
                    "Across all celebrations",
                  ],
                  ["My Vendors", "14", "Contacts in one place"],
                  ["Tasks Completed", "32 / 48", "One step closer"],
                ].map(([label, value, note]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{note}</small>
                  </div>
                ))}
              </div>
              <MasterItinerary />
            </div>
          </div>
        </section>
        <section className="section tinted" id="traditions">
          <div className="container tradition-grid">
            <div className="tradition-photo">
              <Image
                src="/images/stitch-2.png"
                alt="Loved ones celebrating Mehendi and Sangeet together"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div>
              <span className="eyebrow">Honoring every tradition</span>
              <h2>Built Specifically for the Soul of Indian Weddings</h2>
              <p>
                It’s the scale, the emotion, and the people who make an Indian
                wedding unforgettable. Make room for every tradition and
                everyone you love.
              </p>
              {[
                [
                  "Family Task Delegation without Chaos",
                  "Give each helping hand a clear task, from mithai boxes to Sangeet preparations.",
                ],
                [
                  "Every Ceremony Has Its Moment",
                  "Plan your own sequence of celebrations, with the timings and details that matter to your family.",
                ],
                [
                  "Simple Across Generations",
                  "Clear schedules and easy-to-share links keep parents, cousins, and friends connected.",
                ],
              ].map(([title, body]) => (
                <div className="tradition-point" key={title}>
                  <span aria-hidden="true">✧</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="how-it-works">
          <div className="container">
            <div className="center-heading">
              <span className="eyebrow">A seamless journey</span>
              <h2>From Your First Plan to “I Do” in 4 Steps</h2>
              <p>A little organization. A lot more room for celebration.</p>
            </div>
            <div className="steps">
              {steps.map(([title, body], i) => (
                <article key={title}>
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section tinted" id="guest-experience">
          <div className="container center-heading">
            <span className="eyebrow">Everyone is part of the celebration</span>
            <h2>A Warm Welcome. A Simple Link.</h2>
            <p>
              Guests can open their personal invitation, view their invited
              events, and RSVP without creating an account. A shared gallery
              link lets them view and contribute wedding memories.
            </p>
            <div className="guest-benefits">
              <span>✉ Personal invitations</span>
              <span>✓ No guest accounts</span>
              <span>♡ Private photo sharing</span>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container final-cta">
            <span className="eyebrow">Begin your celebration journey</span>
            <h2>Your Forever Begins With a Beautiful Plan</h2>
            <p>
              Bring your plans out of scattered spreadsheets and messages.
              <br />
              Give your family one place to plan something unforgettable.
            </p>
            <PlanningButton {...planningProps} />
            <span className="cta-note">
              Made for couples. Shared with family.
            </span>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              The celebration suite for unforgettable Indian weddings.
              Thoughtfully made for couples and their families.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#features">Wedding planning features</a>
            <a href="#preview">Workspace preview</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div>
            <h3>Celebrate</h3>
            <a href="#traditions">Mehendi & Sangeet</a>
            <a href="#traditions">Haldi & Pheras</a>
            <a href="#guest-experience">Guest experience</a>
          </div>
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} Make My Marriage. Crafted for
          extraordinary celebrations.
        </div>
      </footer>
    </>
  );
}
