import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="brand-name footer-brand">FixMyRoad</p>
          <p className="footer-tagline">
            Making road hazards visible, trackable, and harder to ignore.
          </p>
        </div>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/map">Map</Link>
          <Link to="/report">Report Pothole</Link>
          <Link to="/about">About</Link>
        </nav>
        <p className="footer-meta">Hackathon Project</p>
      </div>
    </footer>
  )
}
