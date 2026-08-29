import { useEffect, useState } from "react";
import { daysOpen, getReports, markerColor, updateReport } from "../api.js";

const PIN_KEY = "fixmyroad-admin";

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(PIN_KEY) === "1"
  );
  const [pin, setPin] = useState("");
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  async function load() {
    try {
      setReports(await getReports());
    } catch {
      setError("Could not reach the API. Start the backend on port 3000.");
    }
  }

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  function login(event) {
    event.preventDefault();
    if (pin !== "fixmyroad") {
      setError("Wrong PIN. Team default is fixmyroad.");
      return;
    }
    sessionStorage.setItem(PIN_KEY, "1");
    setError("");
    setAuthed(true);
  }

  async function resolve(id) {
    try {
      await updateReport(id, { status: "resolved", pin: "fixmyroad" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = reports.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });
  const open = reports.filter((item) => item.status !== "resolved").length;

  if (!authed) {
    return (
      <section className="section admin-page">
        <p className="eyebrow">City crew view</p>
        <h1>Admin</h1>
        <p className="lede">
          Hackathon PIN is <strong>fixmyroad</strong>. Replace this when you add
          real logins.
        </p>
        {error ? <p className="banner error">{error}</p> : null}
        <form className="form-card login-box" onSubmit={login}>
          <label htmlFor="pin">Admin PIN</label>
          <input
            id="pin"
            type="password"
            autoComplete="off"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Enter dashboard
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="section admin-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">City crew view</p>
          <h1>Admin</h1>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            sessionStorage.removeItem(PIN_KEY);
            setAuthed(false);
          }}
        >
          Log out
        </button>
      </div>

      {error ? <p className="banner error">{error}</p> : null}

      <div className="stats">
        <article className="stat">
          <span>Total</span>
          <strong>{reports.length}</strong>
        </article>
        <article className="stat">
          <span>Open</span>
          <strong>{open}</strong>
        </article>
        <article className="stat">
          <span>Resolved</span>
          <strong>{reports.length - open}</strong>
        </article>
      </div>

      <div className="toolbar">
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All reports</option>
          <option value="open">Open only</option>
          <option value="resolved">Resolved only</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Days</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id}>
                <td>
                  {report.photo ? (
                    <img className="thumb" src={report.photo} alt="" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{report.description}</td>
                <td>{report.severity}</td>
                <td>{daysOpen(report)}</td>
                <td>
                  <span
                    className="status-dot"
                    style={{ background: markerColor(report) }}
                  />
                  {report.status}
                </td>
                <td>
                  {report.status === "resolved" ? (
                    "Resolved"
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={() => resolve(report.id)}
                    >
                      Mark resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
