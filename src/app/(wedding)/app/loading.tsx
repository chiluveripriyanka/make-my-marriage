export default function LoadingDashboard() {
  return <main className="dashboard" aria-busy="true" aria-label="Loading wedding workspace"><section className="dash-hero"><div><span className="dash-kicker">Your wedding workspace</span><h1>Preparing your dashboard…</h1><p>Your planning circle is coming together.</p></div></section><div className="dash-stats" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <div className="dash-stat" key={i}><div>Loading…</div><progress /></div>)}</div></main>;
}
