"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { sample } from "./dashboard-data";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const total = sample.expenses.reduce((sum, item) => sum + item.amount, 0);
function Panel({ title, icon, action, children, subtitle }: { title: string; icon?: string; action?: ReactNode; children: ReactNode; subtitle?: string }) {
  return <section className="dash-panel"><header className="dash-panel-heading"><div><h2><span aria-hidden="true">{icon}</span>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>{children}</section>;
}
export default function Dashboard({ days, admin }: { days: number; admin: boolean }) {
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(sample.tasks.map(t => t.status === "COMPLETED"));
  const completed = 31 + done.filter(Boolean).length;
  const coming = (feature: string) => setNotice(`${feature} is coming in a future update. This dashboard currently shows sample planning data.`);
  const action = (label: string, feature: string, className = "dash-link") => <button className={className} onClick={() => coming(feature)}>{label}</button>;
  return <main className="dashboard">
    <div className="dash-preview"><span>✧ Sample dashboard</span> Explore the design with sample planning data. Your actual wedding settings and team are available in the sidebar.</div>
    <section className="dash-hero"><div className="dash-hero-copy"><span className="dash-kicker">Wedding Command Center · {sample.city}</span><h1>{sample.couple}’s Wedding</h1><p className="dash-date">▦ 12–14 February 2027</p><p>⌖ {sample.venue}</p><span className="dash-countdown">⌛ {days > 0 ? `${days} Days to Go` : "Wedding celebrations"}</span></div><div className="dash-quick">{action("＋ Add Event", "Events", "dash-button")}{action("＋ Add Task", "Tasks", "dash-button")}{action("＋ Add Guest", "Guest management", "dash-button")}{action("▤ Record Expense", "Expenses", "dash-button primary")}</div></section>
    <section className="dash-stats" aria-label="Sample wedding summary">{[
      { label: "Ceremonies", icon: "♧", value: "6 Events", detail: "3 Confirmed · 3 in Final Prep" },
      { label: "Tasks & Duties", icon: "☷", value: `${completed} / 48`, detail: `${48 - completed} Pending Delegations`, progress: Math.round(completed / 48 * 100) },
      { label: "Invitations", icon: "✉", value: "186 Cards", detail: "218 Confirmed Attendees" },
      { label: "Total Spent", icon: "▣", value: money(total), detail: "Across 6 Categories" },
      { label: "Vendors", icon: "✧", value: "8 Vendors", detail: "Across 6 Service Categories" },
    ].map(stat => <article className="dash-stat" key={stat.label}><div><span>{stat.label}</span><i aria-hidden="true">{stat.icon}</i></div><strong>{stat.value}</strong>{stat.progress && <progress value={stat.progress} max={100} aria-label="Tasks completed" />}<p>{stat.detail}</p></article>)}</section>
    <div className="dash-columns"><div className="dash-column">
      <Panel title="Upcoming Ceremonies" icon="♧" subtitle="Multi-day itinerary & auspicious timings" action={action("View all 6 events →", "Events")}><ol className="dash-timeline">{sample.events.map((event, i) => <li key={event.name}><article><div className="dash-event-title"><h3><span className={`dash-tag ${i === 3 ? "maroon" : ""}`}>{event.label}</span>{event.name}</h3><button className="dash-edit" aria-label={`Edit ${event.name}`} onClick={() => coming("Event editing")}>✎</button></div><p className="dash-event-time">{event.time}</p><p>⌖ {event.venue}</p><p>♧ <b>Dress Code:</b> {event.dress}</p><p>ⓘ <b>Notes:</b> {event.notes}</p></article></li>)}</ol></Panel>
      <Panel title="Expense Overview" icon="▣" subtitle="Recorded expenses. Shared visibility for your wedding team." action={action("＋ Record", "Expenses", "dash-button")}><strong className="dash-expense-total">{money(total)}</strong><div className="dash-expenses">{sample.expenses.map(expense => <div key={expense.name}><div><span>{expense.name}</span><span><b>{money(expense.amount)}</b> <small>({(expense.amount / total * 100).toFixed(1)}%)</small></span></div><div className="dash-track"><span style={{ width: `${expense.amount / total * 100}%`, background: expense.color }} /></div></div>)}</div><footer className="dash-panel-footer"><span>Sample expense breakdown</span>{action("All Expenses →", "Expenses")}</footer></Panel>
    </div><div className="dash-column">
      <Panel title="Tasks & Delegations" icon="☷" action={action("View all (48) →", "Tasks")}><div className="dash-tasks">{sample.tasks.map((task, i) => <article className={done[i] ? "is-complete" : ""} key={task.title}><label><input type="checkbox" checked={done[i]} onChange={() => { setDone(previous => previous.map((v, index) => index === i ? !v : v)); setNotice("Sample task updated for this visit only. No wedding data was changed."); }} /><span>{task.title}</span></label><div className="dash-task-tags"><span className={`dash-tag ${task.priority === "HIGH" ? "urgent" : ""}`}>{task.priority}</span><span className="dash-tag gold">{done[i] ? "COMPLETED ✓" : task.status === "COMPLETED" ? "PENDING" : task.status}</span>{!done[i] && <small>{task.due}</small>}</div><footer><span><i className="workspace-avatar">{task.initials}</i>{task.member}</span><b>{task.event}</b></footer></article>)}</div></Panel>
      <Panel title="Guest RSVP Overview" icon="✉" action={action("View Guest List →", "Guest management")}><div className="dash-rsvp-heading"><strong>61.3% Accepted</strong><span>114 of 186 Cards</span></div><div className="dash-rsvp-bar" aria-label="114 accepted, 54 pending, 18 declined"><span /><span /><span /></div><div className="dash-rsvp-counts">{[["114", "Accepted", "218 Attending"], ["54", "Pending", "Awaiting response"], ["18", "Declined", "Regrets sent"]].map(([n, label, detail]) => <div key={label}><strong>{n}</strong><b>{label}</b><small>{detail}</small></div>)}</div><p>186 invitation records · 218 confirmed attendees. Invitations and attending people are counted separately.</p>{action("✉ Send RSVP reminders", "Email RSVP reminders", "dash-button dash-wide")}</Panel>
      <Panel title="Wedding Team" icon="♧" action={<Link className="dash-link" href="/app/settings/members">{admin ? "Manage" : "View"} your team →</Link>}><div className="dash-team">{sample.team.map(member => <div key={member.name}><span className="workspace-avatar">{member.initials}</span><div><strong>{member.name}</strong><p>{member.detail}</p></div><span className={`dash-tag ${member.role === "ADMIN" ? "gold" : ""}`}>{member.role}</span></div>)}</div><footer className="dash-panel-footer">Sample team · Only Admins can invite or change roles. <span aria-hidden="true">♧</span></footer></Panel>
      <Panel title="Workspace Setup" action={<span className="dash-setup-count">4 of 5 Complete (80%)</span>}><progress max={5} value={4} aria-label="Sample workspace setup progress" /><ul className="dash-checklist">{sample.setup.map((item, i) => <li key={item}><span aria-hidden="true">{i < 4 ? "✓" : "○"}</span><div>{item}{i === 4 && action("Complete now →", "Wedding website")}</div></li>)}</ul></Panel>
    </div></div>
    {notice && <div className="dash-notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}
  </main>;
}
