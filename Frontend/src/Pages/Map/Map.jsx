import React from "react";
import "./Map.css";
import "../../SiteStyles.css";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

export function Map() {
  const position = [44.8697, -91.9278];
  return (
    <div className="Map">
      <h1>Map</h1>

      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
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
  );
}
