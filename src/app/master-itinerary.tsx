const days = [
  {
    title: "Day 1 • Arrival & Rituals",
    icon: "✓",
    tone: "gold",
    status: "Completed Day 1",
    detail: "2 of 2 Events Ready",
    events: [
      {
        time: "10:00 AM",
        venue: "Courtyard",
        title: "Yellow Marigold Haldi Ritual",
        note: "Dhol troupe arrives 9:45 AM • Organic Haldi samagri delivered by Chachi",
        tone: "gold",
      },
      {
        time: "04:00 PM",
        venue: "Poolside Cabanas",
        title: "Henna & Mehendi Soirée",
        note: "6 Bridal Mehendi artists seated • Live acoustic Rajasthani folk musicians",
        tone: "gold",
      },
    ],
  },
  {
    title: "Day 2 • Sangeet Gala",
    icon: "▷",
    tone: "burgundy",
    status: "In Progress",
    detail: "Stage Crew Ready",
    events: [
      {
        time: "04:00 PM",
        venue: "Grand Ballroom",
        title: "Technical Sound & Light Check",
        note: "DJ console, LED wall visual cues & couple entrance pyrotechnics test",
        tone: "neutral",
      },
      {
        time: "07:30 PM",
        venue: "Grand Ballroom",
        title: "Sangeet Extravaganza & Awards",
        note: "14 family dance performances scheduled • Family playlist finalized",
        tone: "burgundy",
      },
    ],
  },
  {
    title: "Day 3 • Mandap & Reception",
    icon: "◷",
    tone: "gold",
    status: "Upcoming",
    detail: "Panditji Briefed",
    events: [
      {
        time: "04:45 PM",
        venue: "Palace Lawns",
        title: "Auspicious Mandap Pheras (Muhurat)",
        note: "Baraat assembly at 3:30 PM • 7 Vedic vows coordination with Pandit Shastri",
        tone: "gold",
      },
      {
        time: "08:30 PM",
        venue: "Royal Banquet Hall",
        title: "Grand Reception & Royal Dinner",
        note: "Gourmet royal feast, stage congratulations, cake-cutting & photo studio",
        tone: "burgundy",
      },
    ],
  },
];

export default function MasterItinerary() {
  return (
    <section className="master-itinerary" aria-labelledby="itinerary-title">
      <div className="itinerary-heading">
        <div className="itinerary-heading-copy">
          <span className="itinerary-symbol" aria-hidden="true">
            ✧
          </span>
          <div>
            <h4 id="itinerary-title">Multi-Event Master Itinerary</h4>
            <p>
              Sequential ritual schedule shared across families, pandits &
              vendors
            </p>
          </div>
        </div>
        <span className="itinerary-badge">
          <span aria-hidden="true">✓</span> All 5 Ceremonies Locked
        </span>
      </div>
      <div className="itinerary-days">
        {days.map((day) => (
          <article className={`itinerary-day ${day.tone}`} key={day.title}>
            <div className="itinerary-day-heading">
              <h5>{day.title}</h5>
              <span aria-hidden="true">{day.icon}</span>
            </div>
            <ol className="itinerary-events">
              {day.events.map((event) => (
                <li className="itinerary-event" key={event.title}>
                  <div className="itinerary-event-meta">
                    <time>{event.time}</time>
                    <span className={`venue-badge ${event.tone}`}>
                      {event.venue}
                    </span>
                  </div>
                  <h6>{event.title}</h6>
                  <p>{event.note}</p>
                </li>
              ))}
            </ol>
            <div className="itinerary-day-status">
              <span>
                <span aria-hidden="true">{day.icon}</span> {day.status}
              </span>
              <span>{day.detail}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
