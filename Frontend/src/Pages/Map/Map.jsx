import React from "react";
import "./Map.css";
import "../../SiteStyles.css";

// Leaflet styles are required for tiles/controls to render correctly
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
  return (
    <div className="Map page-layout">
      <header className="workout-title">
        <h1>Map</h1>
      </header>

      <div className="map-container">
        {/* MapContainer needs an explicit height (or a parent with height) to display tiles */}
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: "60vh", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
