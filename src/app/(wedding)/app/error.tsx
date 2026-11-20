"use client";
export default function WorkspaceError({ reset }: { reset: () => void }) {
  return <main className="dashboard"><section className="dash-panel"><h1>We couldn’t load your workspace</h1><p>Please try again in a moment.</p><button className="dash-button primary" onClick={reset}>Try again</button></section></main>;
}
