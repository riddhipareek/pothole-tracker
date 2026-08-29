import { Link } from 'react-router-dom'

export default function ReportPlaceholder() {
  return (
    <section className="section placeholder-page">
      <p className="eyebrow">No-login reporting</p>
      <h1>Reporting is on its way.</h1>
      <p>
        The report form is owned by another teammate. This page is a route so
        you can reach it from the homepage while that work is in progress.
      </p>
      <Link to="/map" className="btn btn-secondary">
        View the map
      </Link>
    </section>
  )
}
