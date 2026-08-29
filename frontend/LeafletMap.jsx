import { useEffect, useRef } from "react";
import L from "leaflet";
import { DEFAULT_CENTER, markerColor, daysOpen } from "../api.js";

export default function LeafletMap({
  reports = [],
  height = "70vh",
  onPick,
  pickPosition,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const pickRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(DEFAULT_CENTER, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    if (onPick) {
      map.on("click", (event) => onPick(event.latlng));
    }

    const resize = () => map.invalidateSize();
    setTimeout(resize, 200);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      map.remove();
      mapRef.current = null;
    };
  }, [onPick]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    reports.forEach((report) => {
      const marker = L.circleMarker([report.lat, report.lng], {
        radius: 10,
        color: "#fff",
        weight: 2,
        fillColor: markerColor(report),
        fillOpacity: 0.95,
      });
      const days = daysOpen(report);
      const status =
        report.status === "resolved" ? "Resolved" : `${days} day(s) open`;
      marker.bindPopup(
        `<strong>${report.severity}</strong><br>${report.description}<br><em>${status}</em>`
      );
      marker.addTo(layer);
    });
  }, [reports]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pickPosition) return;
    if (pickRef.current) pickRef.current.setLatLng(pickPosition);
    else {
      pickRef.current = L.circleMarker(pickPosition, {
        radius: 12,
        color: "#f5b301",
        weight: 3,
        fillColor: "#141821",
        fillOpacity: 1,
      }).addTo(map);
    }
    map.panTo(pickPosition);
  }, [pickPosition]);

  return <div ref={containerRef} className="leaflet-host" style={{ height }} />;
}
