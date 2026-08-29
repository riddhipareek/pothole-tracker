import { Link } from 'react-router-dom'

export default function MapPlaceholder() {
  return (
    <section className="section placeholder-page">
      <p className="eyebrow">Public map</p>
      <h1>Road map coming soon.</h1>
      <p>
        The live pothole map is being built by another teammate. When it is
        ready, reported hazards will appear here with colors that show how long
        they have remained unresolved.
      </p>
      <Link to="/report" className="btn btn-primary">
        Report a pothole instead
      </Link>
    </section>
  )
}
