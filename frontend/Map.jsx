import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LeafletMap from "../components/LeafletMap.jsx";
import { getReports } from "../api.js";

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch(() => setError("Could not reach the API. Start the backend on port 3000."));
  }, []);

  const openReports = reports.filter((item) => item.status !== "resolved");

  return (
    <section className="section map-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Public map</p>
          <h1>See what still needs repair</h1>
          <p className="lede">
            Color is about time, not size. Green is recent, orange has waited
            30–89 days, red has waited 90+ days.
          </p>
        </div>
        <Link to="/report" className="btn btn-report">
          Report a pothole
        </Link>
      </div>

      {error ? <p className="banner error">{error}</p> : null}

      <div className="map-shell">
        <aside className="map-side">
          <p className="open-count">
            <strong>{openReports.length}</strong> open reports
          </p>
          <ul className="legend">
            <li>
              <span className="legend-dot dot-green" />
              Green — recently reported
            </li>
            <li>
              <span className="legend-dot dot-orange" />
              Orange — 30–89 days unresolved
            </li>
            <li>
              <span className="legend-dot dot-red" />
              Red — 90+ days unresolved
            </li>
          </ul>
        </aside>
        <LeafletMap reports={openReports} />
      </div>
    </section>
  );
}
