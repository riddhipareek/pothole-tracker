import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📍',
    title: 'Report in Seconds',
    body: 'No-login reporting with location and optional photo evidence.',
  },
  {
    icon: '🗺️',
    title: 'Track Publicly',
    body: 'Reported potholes appear on a public map.',
  },
  {
    icon: '⏳',
    title: 'Demand Accountability',
    body: 'Unresolved potholes remain visible until they are addressed.',
  },
]

const steps = [
  {
    num: '01',
    title: 'SPOT',
    body: 'Find a pothole on your route.',
  },
  {
    num: '02',
    title: 'REPORT',
    body: 'Share its location, severity and optional photo.',
  },
  {
    num: '03',
    title: 'TRACK',
    body: 'Monitor its status until it is fixed.',
  },
]

const legend = [
  { className: 'dot-green', label: 'Recently Reported' },
  { className: 'dot-orange', label: '30–89 Days Unresolved' },
  { className: 'dot-red', label: '90+ Days Unresolved' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Civic accountability for safer streets</p>
          <h1>Every Pothole Deserves to Be Seen.</h1>
          <p className="lede">
            Report potholes, track unresolved road hazards, and help make our roads
            safer — one report at a time.
          </p>
          <div className="hero-actions">
            <Link to="/report" className="btn btn-primary">
              🚨 REPORT A POTHOLE
            </Link>
            <Link to="/map" className="btn btn-secondary">
              🗺️ VIEW ROAD MAP
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="road-card">
            <div className="road-lane">
              <span className="dash" />
              <span className="dash" />
              <span className="dash" />
            </div>
            <div className="hazard-pin pin-a">
              <span className="pin-pulse" />
              90+ days
            </div>
            <div className="hazard-pin pin-b">Recent</div>
            <div className="hazard-pin pin-c">45 days</div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="impact-heading">
        <div className="section-head">
          <p className="eyebrow">Why it matters</p>
          <h2 id="impact-heading">Visibility is the first step to repair.</h2>
        </div>
        <div className="card-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-dark" aria-labelledby="how-heading">
        <div className="section-head">
          <p className="eyebrow">Simple by design</p>
          <h2 id="how-heading">How it works</h2>
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.num} className="step-card">
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="map-preview-heading">
        <div className="map-preview">
          <div>
            <p className="eyebrow">Public map</p>
            <h2 id="map-preview-heading">See What Needs Attention.</h2>
            <p>
              FixMyRoad displays reported potholes on a public map so anyone can
              see which hazards are still waiting to be fixed.
            </p>
            <p className="legend-note">
              Marker colors show how long a pothole has remained unresolved — not
              how severe it is.
            </p>
            <ul className="legend" aria-label="Map legend">
              {legend.map((item) => (
                <li key={item.label}>
                  <span className={`legend-dot ${item.className}`} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
            <Link to="/map" className="btn btn-primary">
              EXPLORE THE MAP →
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

      <section className="cta-band">
        <h2>Spotted a pothole?</h2>
        <p>Your report could help get it fixed.</p>
        <Link to="/report" className="btn btn-primary">
          REPORT A POTHOLE →
        </Link>
      </section>
    </>
  )
}
