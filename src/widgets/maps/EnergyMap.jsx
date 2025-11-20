// src/widgets/maps/EnergyMap.jsx
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

export function EnergyMap({ devices = [] }) {

  // Μοναδικό κλειδί = deviceName
  const [selected, setSelected] = useState(
    devices.map((d) => d.deviceName)
  );

  const toggleDevice = (deviceName) => {
    setSelected((prev) =>
      prev.includes(deviceName)
        ? prev.filter((x) => x !== deviceName)
        : [...prev, deviceName]
    );
  };

  const filtered = devices.filter((d) =>
    selected.includes(d.name)
  );

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">

      {/* ---------- SIDEBAR ---------- */}
      <div
        className="w-64 bg-white rounded-xl shadow-md border border-blue-gray-100 p-4 flex-shrink-0"
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        <h3 className="text-lg font-semibold text-blue-gray-800 mb-3">
          ⚡ Επιλογή Ενεργειακών Σημείων
        </h3>

        <div className="space-y-2">
          {devices.map((d) => (
            <label
              key={d.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(d.name)}
                onChange={() => toggleDevice(d.name)}
                className="w-4 h-4 accent-blue-gray-700"
              />
              <span className="text-blue-gray-700 text-sm">
                {d.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ---------- MAP AREA ---------- */}
      <div
        className="flex-1 rounded-xl overflow-hidden border border-blue-gray-100 shadow-md"
        style={{ height: "450px" }}
      >
        <MapContainer
          center={[36.44, 28.22]}
          zoom={12}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((d) => (
            <Marker
              key={d.name}
              position={[d.lat, d.lng]}
            >
              <Popup>
                <strong>{d.name}</strong>
                <br />
                <small className="text-gray-600">
                  Last update: {d.dateObserved}
                </small>
                <hr />

                <div>
                  Fuel tank: <b>{d.fuel_tank ?? "N/A"}</b> L<br />
                  Power consumption: <b>{d.power_consumption ?? "N/A"}</b> kWh<br />
                  Temperature: <b>{d.temperature ?? "N/A"}</b> °C<br />
                  Humidity: <b>{d.humidity ?? "N/A"}</b> %
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default EnergyMap;
