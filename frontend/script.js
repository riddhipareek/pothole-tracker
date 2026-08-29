/**
 * Shared frontend logic for FixMyRoad.
 *
 * Pages set data-page on <body>:
 *   map    → public Leaflet map
 *   report → submit a pothole
 *   admin  → mark reports resolved
 *
 * Talks to the Express API when it is running (http://localhost:3000).
 * If the API is down, reports are stored in this browser's localStorage
 * so the UI still works while the backend teammate finishes the server.
 */

const API_BASE = "http://localhost:3000";
const STORAGE_KEY = "fixmyroad-reports";
const ADMIN_PIN = "fixmyroad";
const DEFAULT_CENTER = [28.6139, 77.209]; // New Delhi — change if your city is different

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  const page = document.body.dataset.page;
  if (page === "map") initMapPage();
  if (page === "report") initReportPage();
  if (page === "admin") initAdminPage();
});

function markActiveNav() {
  const file = location.pathname.split("/").pop() || "map.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === file || (file === "" && href === "map.html")) {
      link.classList.add("is-active");
    }
  });
}

function uid() {
  return "r_" + Math.random().toString(36).slice(2, 10);
}

function daysOpen(report) {
  const start = new Date(report.createdAt).getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 86400000));
}

function markerColor(report) {
  if (report.status === "resolved") return "#8b93a7";
  const days = daysOpen(report);
  if (days >= 90) return "#d64545";
  if (days >= 30) return "#e07a28";
  return "#2f9e5a";
}

function colorClass(report) {
  if (report.status === "resolved") return "dot-gray";
  const days = daysOpen(report);
  if (days >= 90) return "dot-red";
  if (days >= 30) return "dot-orange";
  return "dot-green";
}

function seedReports() {
  return [
    {
      id: "seed-1",
      lat: 28.6329,
      lng: 77.2195,
      description: "Deep pothole near the crossing, fills with water after rain.",
      severity: "high",
      status: "open",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      photo: "",
    },
    {
      id: "seed-2",
      lat: 28.5921,
      lng: 77.227,
      description: "Broken asphalt on the left lane, cars swerve around it.",
      severity: "medium",
      status: "open",
      createdAt: new Date(Date.now() - 47 * 86400000).toISOString(),
      photo: "",
    },
    {
      id: "seed-3",
      lat: 28.5672,
      lng: 77.187,
      description: "Long-standing crater. Reported by neighbors for months.",
      severity: "high",
      status: "open",
      createdAt: new Date(Date.now() - 110 * 86400000).toISOString(),
      photo: "",
    },
  ];
}

function readLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedReports();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return seedReports();
  }
}

function writeLocal(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function apiOptions(extra = {}) {
  return { ...extra, signal: AbortSignal.timeout(1500) };
}

async function loadReports() {
  try {
    const res = await fetch(`${API_BASE}/api/reports`, apiOptions());
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Array.isArray(data) ? data : data.reports || [];
  } catch {
    return readLocal();
  }
}

async function createReport(payload) {
  try {
    const res = await fetch(
      `${API_BASE}/api/reports`,
      apiOptions({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    const reports = readLocal();
    const saved = { ...payload, id: uid() };
    reports.unshift(saved);
    writeLocal(reports);
    return saved;
  }
}

async function updateReport(id, patch) {
  try {
    const res = await fetch(
      `${API_BASE}/api/reports/${id}`,
      apiOptions({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
    );
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    const reports = readLocal().map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    writeLocal(reports);
    return reports.find((item) => item.id === id);
  }
}

function showBanner(el, type, text) {
  if (!el) return;
  el.className = `banner ${type}`;
  el.textContent = text;
  el.hidden = false;
}

function popupHtml(report) {
  const days = daysOpen(report);
  const status = report.status === "resolved" ? "Resolved" : `${days} day(s) open`;
  return `<strong>${report.severity.toUpperCase()}</strong><br>${escapeHtml(
    report.description
  )}<br><em>${status}</em>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function addCircleMarker(map, report) {
  const marker = L.circleMarker([report.lat, report.lng], {
    radius: 10,
    color: "#fff",
    weight: 2,
    fillColor: markerColor(report),
    fillOpacity: 0.95,
  });
  marker.bindPopup(popupHtml(report));
  marker.addTo(map);
  return marker;
}

async function initMapPage() {
  const map = L.map("map").setView(DEFAULT_CENTER, 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
  setTimeout(() => map.invalidateSize(), 200);

  const reports = await loadReports();
  const openReports = reports.filter((item) => item.status !== "resolved");
  openReports.forEach((report) => addCircleMarker(map, report));

  const countEl = document.getElementById("open-count");
  if (countEl) countEl.textContent = String(openReports.length);
}

async function initReportPage() {
  const map = L.map("report-map").setView(DEFAULT_CENTER, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  const latInput = document.getElementById("lat");
  const lngInput = document.getElementById("lng");
  const form = document.getElementById("report-form");
  const banner = document.getElementById("form-banner");
  const photoInput = document.getElementById("photo");
  const preview = document.getElementById("photo-preview");
  let pin = null;

  function setPin(latlng) {
    latInput.value = latlng.lat.toFixed(6);
    lngInput.value = latlng.lng.toFixed(6);
    if (pin) pin.setLatLng(latlng);
    else pin = L.marker(latlng).addTo(map);
    map.panTo(latlng);
  }

  map.on("click", (event) => setPin(event.latlng));

  document.getElementById("use-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
      showBanner(banner, "error", "Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map.setView(latlng, 16);
        setPin(latlng);
      },
      () => showBanner(banner, "error", "Could not read your location. Click the map instead.")
    );
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) {
      preview.hidden = true;
      return;
    }
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!latInput.value || !lngInput.value) {
      showBanner(banner, "error", "Click the map (or use your location) to drop a pin first.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    let photo = "";
    const file = photoInput.files[0];
    if (file && file.size < 200 * 1024) {
      photo = await fileToDataUrl(file);
    }

    const payload = {
      lat: Number(latInput.value),
      lng: Number(lngInput.value),
      description: document.getElementById("description").value.trim(),
      severity: document.getElementById("severity").value,
      status: "open",
      createdAt: new Date().toISOString(),
      photo,
    };

    try {
      await createReport(payload);
      form.reset();
      preview.hidden = true;
      showBanner(
        banner,
        "success",
        "Report submitted. It will show on the public map. (Saved locally if the API is not running yet.)"
      );
    } catch {
      showBanner(banner, "error", "Could not save this report. Try again.");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isAdminAuthed() {
  return sessionStorage.getItem("fixmyroad-admin") === "1";
}

async function initAdminPage() {
  const gate = document.getElementById("admin-gate");
  const app = document.getElementById("admin-app");
  const pinForm = document.getElementById("pin-form");
  const banner = document.getElementById("admin-banner");

  function showApp() {
    gate.hidden = true;
    app.hidden = false;
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) logoutBtn.hidden = false;
    renderAdmin();
  }

  if (isAdminAuthed()) showApp();

  pinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pin = document.getElementById("pin").value;
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("fixmyroad-admin", "1");
      showApp();
    } else {
      showBanner(banner, "error", "Wrong PIN. Team default is: fixmyroad");
    }
  });

  document.getElementById("logout")?.addEventListener("click", () => {
    sessionStorage.removeItem("fixmyroad-admin");
    location.reload();
  });
}

async function renderAdmin() {
  const reports = await loadReports();
  const filter = document.getElementById("status-filter").value;
  const filtered = reports.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const open = reports.filter((item) => item.status !== "resolved").length;
  const resolved = reports.length - open;
  document.getElementById("stat-total").textContent = String(reports.length);
  document.getElementById("stat-open").textContent = String(open);
  document.getElementById("stat-resolved").textContent = String(resolved);

  const tbody = document.getElementById("report-rows");
  tbody.innerHTML = "";

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="6">No reports match this filter.</td></tr>';
    return;
  }

  filtered.forEach((report) => {
    const tr = document.createElement("tr");
    const thumb = report.photo
      ? `<img class="thumb" src="${report.photo}" alt="">`
      : "—";
    const action =
      report.status === "resolved"
        ? "<span class='status-pill'>Resolved</span>"
        : `<button class="btn btn-primary btn-small" data-resolve="${report.id}">Mark resolved</button>`;

    tr.innerHTML = `
      <td>${thumb}</td>
      <td>${escapeHtml(report.description)}</td>
      <td>${escapeHtml(report.severity)}</td>
      <td>${daysOpen(report)}</td>
      <td><span class="status-pill"><span class="legend-dot ${colorClass(report)}"></span>${escapeHtml(report.status)}</span></td>
      <td>${action}</td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-resolve]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      await updateReport(button.dataset.resolve, { status: "resolved" });
      await renderAdmin();
    });
  });
}

document.addEventListener("change", (event) => {
  if (event.target.id === "status-filter" && document.body.dataset.page === "admin") {
    renderAdmin();
  }
});
