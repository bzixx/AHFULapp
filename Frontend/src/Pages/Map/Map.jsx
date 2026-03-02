import React, { useEffect, useState } from "react";
import "./Map.css";
import "../../SiteStyles.css";

// Leaflet styles are required for tiles/controls to render correctly
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix marker icon paths for bundlers (Vite/webpack). Importing the images returns
// a resolved URL which Leaflet can use when creating the default icon.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Merge options so the default icon uses the imported URLs.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export function Map() {
  const position = [44.8697, -91.9278];
  // State for the mock form & saved gyms (frontend-only)
  const [form, setForm] = useState({ name: "", address: "", lat: position[0], lng: position[1], notes: "", type: "other" });
  const [savedGyms, setSavedGyms] = useState([]);

  // Load saved gyms from localStorage (mock persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mockSavedGyms");
      if (raw) setSavedGyms(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load saved gyms", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mockSavedGyms", JSON.stringify(savedGyms));
    } catch (e) {
      console.warn("Failed to persist saved gyms", e);
    }
  }, [savedGyms]);

  function onMapClick(mapinput) {
    setForm((f) => ({ ...f, lat: mapinput.lat, lng: mapinput.lng }));
  }

  function saveGym(e) {
    e.preventDefault();
    const trimmedName = (form.name || "").trim();
    if (!trimmedName) return alert("Please enter a gym name before saving.");

    const gym = {
      id: Date.now(),
      name: trimmedName,
      address: form.address,
      type: form.type || "other",
      lat: Number(form.lat),
      lng: Number(form.lng),
      notes: form.notes,
    };
    setSavedGyms((s) => [gym, ...s]);
    setForm({ name: "", address: "", lat: gym.lat, lng: gym.lng, notes: "", type: "other" });
  }

  function removeGym(id) {
    setSavedGyms((s) => s.filter((g) => g.id !== id));
  }

  // Component to capture map clicks and report coordinates
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng);
      },
    });
    return null;
  }

  return (
    <div className="Map page-layout">
      <header className="workout-title">
        <h1>Map</h1>
      </header>

      <div className="map-and-form">
        <div className="map-container">
          {/* MapContainer needs an explicit height (or a parent with height) to display tiles */}
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "60vh", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />

            {/* Default center marker */}
            <Marker position={position}>
              <Popup>
                Default center. Click the map to populate the form coordinates.
              </Popup>
            </Marker>

            {/* Markers for saved gyms */}
            {savedGyms.map((g) => (
              <Marker key={g.id} position={[g.lat, g.lng]}>
                <Popup>
                  <strong>{g.name}</strong>
                  <br />
                  {g.address}
                  {g.notes ? (
                    <>
                      <br />
                      <em>{g.notes}</em>
                    </>
                  ) : null}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="gym-form-wrapper">
          <form className="gym-form" onSubmit={saveGym}>
            <h2>Save Gym</h2>
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Gym name"
                required
              />
            </label>

            <label>
              Address
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Street, city"
              />
            </label>

            <fieldset className="gym-type">
              <legend>Type</legend>
              <label>
                <input
                  type="radio"
                  name="gymType"
                  value="other"
                  checked={form.type === "other"}
                  onChange={() => setForm((f) => ({ ...f, type: "other" }))}
                />
                Other
              </label>
              <label>
                <input
                  type="radio"
                  name="gymType"
                  value="home"
                  checked={form.type === "home"}
                  onChange={() => setForm((f) => ({ ...f, type: "home" }))}
                />
                Home gym
              </label>
            </fieldset>

            <div className="coords-row">
              <label>
                Latitude
                <input
                  value={form.lat}
                  onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                  type="number"
                  step="any"
                />
              </label>
              <label>
                Longitude
                <input
                  value={form.lng}
                  onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                  type="number"
                  step="any"
                />
              </label>
            </div>

            <label>
              Notes
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Optional notes"
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary">Save</button>
            </div>

            <p className="hint">Tip: click anywhere on the map to fill latitude/longitude.</p>
          </form>

          <div className="saved-list">
            <h3>Saved gyms</h3>
            {savedGyms.length === 0 ? (
              <p className="muted">No saved gyms yet.</p>
            ) : (
              <ul>
                {savedGyms.map((g) => (
                  <li key={g.id}>
                    <div className="saved-item">
                      <div>
                                <strong>{g.name} <span className="type-pill">{g.type === 'home' ? 'Home' : 'Other'}</span></strong>
                                  <div className="muted small">{g.address}</div>
                                  <div className="muted small">{g.lat.toFixed ? g.lat.toFixed(5) : g.lat}, {g.lng.toFixed ? g.lng.toFixed(5) : g.lng}</div>
                      </div>
                      <div className="saved-actions">
                        <button onClick={() => removeGym(g.id)} aria-label={`Remove ${g.name}`}>Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
