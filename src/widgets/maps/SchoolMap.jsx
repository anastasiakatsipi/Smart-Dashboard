// src/widgets/maps/SchoolMap.jsx

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function SchoolMap({ schools }) {
  const [selected, setSelected] = useState(schools.map((s) => s.name));

  const toggleSchool = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const filtered = schools.filter((s) => selected.includes(s.name));

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
      <div
        className="w-64 bg-white rounded-xl shadow-md border border-blue-gray-100 p-4 flex-shrink-0"
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        <h3 className="text-lg font-semibold text-blue-gray-800 mb-3">
          🧭 Επιλογή σχολείων
        </h3>

        <div className="space-y-2">
          {schools.map((s) => (
            <label
              key={s.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(s.name)}
                onChange={() => toggleSchool(s.name)}
                className="w-4 h-4 accent-blue-gray-700"
              />
              <span className="text-blue-gray-700 text-sm">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* --- RIGHT MAP AREA --- */}
      <div
        className="flex-1 rounded-xl overflow-hidden border border-blue-gray-100 shadow-md"
        style={{ height: "450px" }}   // <– Keeps map inside container
      >
        <MapContainer
          center={[36.44, 28.22]}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((s, i) => (
            <Marker key={i} position={[s.lat, s.lng]}>
              <Popup>
                <strong>{s.name}</strong> <br />
                CO₂: {s.co2 ?? "N/A"} ppm <br />
                Θερμοκρασία: {s.temperature ?? "N/A"} °C
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default SchoolMap;
