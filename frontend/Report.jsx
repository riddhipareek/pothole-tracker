import { useCallback, useState } from "react";
import LeafletMap from "../components/LeafletMap.jsx";
import { createReport } from "../api.js";

export default function Report() {
  const [pin, setPin] = useState(null);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onPick = useCallback((latlng) => {
    setPin({ lat: latlng.lat, lng: latlng.lng });
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("This browser cannot share your location. Click the map instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Could not read location. Click the map to drop a pin.")
    );
  }

  function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhoto("");
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(file));
    if (file.size > 200 * 1024) {
      setPhoto("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!pin) {
      setError("Click the map (or use your location) so we know where the pothole is.");
      return;
    }
    setBusy(true);
    try {
      await createReport({
        lat: pin.lat,
        lng: pin.lng,
        description,
        severity,
        photo,
      });
      setDescription("");
      setPhoto("");
      setPreview("");
      setMessage("Report submitted. It now appears on the public map.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section report-page">
      <p className="eyebrow">No login required</p>
      <h1>Report a pothole</h1>
      <p className="lede">
        Drop a pin, add a short description, and optionally attach a photo.
      </p>

      {message ? <p className="banner success">{message}</p> : null}
      {error ? <p className="banner error">{error}</p> : null}

      <form className="report-grid" onSubmit={onSubmit}>
        <div className="form-card">
          <label>Location</label>
          <p className="help">Click the map to drop a pin.</p>
          <LeafletMap
            height="360px"
            onPick={onPick}
            pickPosition={pin}
            reports={[]}
          />
          <button type="button" className="btn btn-secondary" onClick={useMyLocation}>
            Use my location
          </button>
          {pin ? (
            <p className="help">
              Pin: {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
            </p>
          ) : null}
        </div>

        <div className="form-card">
          <label htmlFor="description">What should crews know?</label>
          <textarea
            id="description"
            required
            maxLength={400}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: Deep hole in the left lane, fills with water after rain."
          />

          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="low">Low — annoying but passable</option>
            <option value="medium">Medium — drivers swerve</option>
            <option value="high">High — vehicle damage risk</option>
          </select>

          <label htmlFor="photo">Photo (optional, under 200 KB)</label>
          <input id="photo" type="file" accept="image/*" onChange={onPhoto} />
          {preview ? <img className="thumb" src={preview} alt="Preview" /> : null}

          <button type="submit" className="btn btn-report" disabled={busy}>
            {busy ? "Sending…" : "Submit report"}
          </button>
        </div>
      </form>
    </section>
  );
}
