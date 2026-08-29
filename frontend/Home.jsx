import { Link } from 'react-router-dom'

/**
 * Homepage for FixMyRoad.
 */

const features = [
  {
    title: 'Report',
    body: 'Spot a pothole, drop a pin, and submit in seconds. No account required — anyone can help make roads safer.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2c3.3 0 6 2.6 6 5.8 0 4.4-6 11.2-6 11.2S6 12.2 6 7.8C6 4.6 8.7 2 12 2zm0 3.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'Track',
    body: 'Every report lands on a public map. Neighbors, volunteers, and officials can all see what still needs repair.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 5.5 10 3l6 2.5L22 3v15.5L16 21l-6-2.5L2 21V5.5L4 5.5zm6 1.1v11.2l6 2.5V9.1l-6-2.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'Accountability',
    body: 'Unresolved hazards stay visible. Marker colors show how long a pothole has waited — delay is harder to ignore.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2 4 6v6c0 5 3.4 9.4 8 10.5C16.6 21.4 20 17 20 12V6l-8-4zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

const legend = [
  {
    className: 'dot-green',
    label: 'Green — recently reported',
    detail: 'New reports that still need attention.',
  },
  {
    className: 'dot-orange',
    label: 'Orange — 30–89 days unresolved',
    detail: 'Waiting long enough that follow-up is overdue.',
  },
  {
    className: 'dot-red',
    label: 'Red — 90+ days unresolved',
    detail: 'Long-standing hazards that demand accountability.',
  },
]

export default function Home() {
  return (
    <>
      {/* 1. Hero: headline + two CTAs wired to future routes */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">No-login civic reporting</p>
          <h1>Every pothole deserves to be seen.</h1>
          <p className="lede">
            FixMyRoad is a public accountability platform. Report a pothole in
            seconds, watch it appear on a shared map, and keep unresolved
            hazards visible until they are fixed.
          </p>
          <div className="hero-actions">
            <Link to="/report" className="btn btn-report">
              Report a pothole
            </Link>
            <Link to="/map" className="btn btn-secondary">
              View the map
            </Link>
          </div>
        </div>

        {/* Decorative preview — not a real map yet */}
        <div className="hero-visual" aria-hidden="true">
          <div className="road-card">
            <div className="road-lane">
              <span className="dash" />
              <span className="dash" />
              <span className="dash" />
            </div>
            <div className="hazard-pin pin-a">90+ days</div>
            <div className="hazard-pin pin-b">Recent</div>
            <div className="hazard-pin pin-c">45 days</div>
          </div>
        </div>
      </section>

      {/* 2. Three feature cards */}
      <section className="section" aria-labelledby="features-heading">
        <div className="section-head">
          <p className="eyebrow">How FixMyRoad works</p>
          <h2 id="features-heading">Report. Track. Demand repair.</h2>
        </div>
        <div className="card-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Map preview + color legend */}
      <section className="section" aria-labelledby="map-preview-heading">
        <div className="map-preview">
          <div>
            <p className="eyebrow">Public map</p>
            <h2 id="map-preview-heading">See what still needs attention</h2>
            <p>
              Markers on the map show reported potholes. Color is about time,
              not size: it tells you how long a hazard has stayed unresolved.
            </p>
            <ul className="legend" aria-label="Map marker colors">
              {legend.map((item) => (
                <li key={item.label}>
                  <span className={`legend-dot ${item.className}`} aria-hidden="true" />
                  <span>
                    <strong>{item.label}</strong>
                    <span className="legend-detail">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link to="/map" className="btn btn-secondary">
              Explore full map
            </Link>
          </div>

          <div className="preview-panel" aria-hidden="true">
            <div className="mini-map">
              <span className="map-dot green d1" />
              <span className="map-dot orange d2" />
              <span className="map-dot red d3" />
              <span className="map-dot green d4" />
              <span className="map-dot orange d5" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
