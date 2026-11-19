"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { weddingSchema, type WeddingInput } from "@/server/weddings/schema";
export default function WeddingForm({
  initial,
  editing = false,
}: {
  initial?: WeddingInput;
  editing?: boolean;
}) {
  const [values, setValues] = useState<WeddingInput>(
    initial || {
      brideName: "",
      groomName: "",
      title: "",
      city: "",
      weddingDate: "",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = weddingSchema.safeParse(values);
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const r = await fetch("/api/wedding", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const j = await r.json();
      if (!r.ok) {
        setErrors({ form: j.error?.message || "Unable to save wedding" });
        return;
      }
      router.replace(j.data.redirect);
      router.refresh();
    } catch {
      setErrors({ form: "Connection failed. Please try again." });
    } finally {
      setBusy(false);
    }
  }
  function field(
    key: keyof WeddingInput,
    label: string,
    type = "text",
    required = true,
  ) {
    return (
      <label>
        {label}
        {required ? " *" : ""}
        <input
          name={key}
          type={type}
          required={required}
          maxLength={key === "title" ? 160 : key === "city" ? 200 : 100}
          value={values[key]}
          placeholder={
            {
              brideName: "e.g., Ananya Sharma",
              groomName: "e.g., Rohan Kapoor",
              city: "e.g., Udaipur, Rajasthan",
              title: "e.g., Ananya & Rohan’s Wedding",
              weddingDate: "",
            }[key]
          }
          onChange={(e) => setValues({ ...values, [key]: e.target.value })}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        {errors[key] && (
          <small id={`${key}-error`} role="alert">
            {errors[key]}
          </small>
        )}
      </label>
    );
  }
  return (
    <main className="wedding-setup">
      <aside className="wedding-story">
        <Image
          src="/images/wedding-onboarding.jpg"
          alt="Couple in regal Indian wedding attire"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 500px"
        />
        <div className="wedding-story-shade" />
        <span className="story-badge">✧ Royal Concierge Setup</span>
        <div className="story-caption">
          <blockquote>
            “Where two families unite in sacred celebration.”
          </blockquote>
          <p>
            Curate rituals, coordinate celebrations, and share moments with your
            loved ones.
          </p>
          <span className="story-privacy">♡ Private Family Workspace</span>
        </div>
      </aside>
      <section className="wedding-form-panel">
        <div className="setup-stepper">
          <span className="eyebrow">
            {editing ? "Your wedding details" : "Step 1 of 1 · Wedding setup"}
          </span>
          <span className="setup-speed">
            ◷ {editing ? "Keep your plans up to date" : "A beautiful beginning"}
          </span>
        </div>
        <h1>
          {editing
            ? "Edit Your Wedding Details"
            : "Create Your Wedding Workspace"}
        </h1>
        <p>
          Enter the couple and celebration details to create your family’s
          central wedding workspace.
        </p>
        <form onSubmit={submit}>
          <fieldset disabled={busy}>
            <legend>
              <span>1</span> The Blessed Couple
            </legend>
            <div className="wedding-fields">
              {field("brideName", "Bride’s Full Name")}
              {field("groomName", "Groom’s Full Name")}
            </div>
          </fieldset>
          <fieldset disabled={busy}>
            <legend>
              <span>2</span> Celebration Logistics
            </legend>
            <div className="wedding-fields">
              {field("weddingDate", "Primary Vivah Date", "date")}
              {field("city", "Host City / Destination")}
            </div>
            <div className="city-suggestions">
              {["Dehradun", "Udaipur", "Jaipur", "Delhi NCR", "Goa"].map(
                (city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setValues({ ...values, city })}
                  >
                    {city}
                  </button>
                ),
              )}
            </div>
          </fieldset>
          <fieldset disabled={busy}>
            <legend>
              <span>3</span> Wedding Title & Visuals{" "}
              <small className="optional-label">Optional</small>
            </legend>
            {field("title", "Workspace Display Title", "text", false)}
            <div className="cover-placeholder">
              <span className="cover-icon" aria-hidden="true">
                ▧
              </span>
              <div>
                Add couple cover photo<p>Photo uploads are coming soon.</p>
              </div>
              <button type="button" disabled>
                Upload Photo
              </button>
            </div>
          </fieldset>
          {errors.form && (
            <p role="alert" className="wedding-error">
              {errors.form}
            </p>
          )}
          <div className="wedding-form-actions">
            <button className="button" disabled={busy}>
              {busy
                ? "Saving…"
                : editing
                  ? "Save Changes"
                  : "Create Wedding & Enter Dashboard →"}
            </button>
            {editing && <Link href="/app">Cancel</Link>}
          </div>
          {!editing && (
            <p className="wedding-footnote">
              You will be set as the wedding Admin.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
