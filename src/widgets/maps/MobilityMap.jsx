// src/widgets/maps/MobilityMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



export const trafficLightIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/483/483511.png",
  iconSize: [32, 32],
});

export const trafficSensorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

export const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
  iconSize: [28, 28],
});

export function MobilityMap({ sensors = [], lights = [] }) {
  // Combine all devices into one list
  const allDevices = [
    ...sensors.map((d) => ({ ...d, type: "sensor" })),
    ...lights.map((d) => ({ ...d, type: "light" })),
  ];


  const [selected, setSelected] = useState(allDevices.map((d) => d.deviceName));

  const toggleDevice = (deviceName) => {
    setSelected((prev) =>
      prev.includes(deviceName)
        ? prev.filter((x) => x !== deviceName)
        : [...prev, deviceName]
    );
  };

  const filteredDevices = allDevices.filter((d) =>
    selected.includes(d.deviceName)
  );

  return (
    <div className="flex w-full h-full gap-4 overflow-hidden">
      {/* ---------- SIDEBAR ---------- */}
      <div
        className="w-64 bg-white rounded-xl shadow-md border border-blue-gray-100 p-4 flex-shrink-0"
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        <h3 className="text-lg font-semibold text-blue-gray-800 mb-3">
          🚦 Επιλογή Σημείων
        </h3>

        {/* GROUP 1: Traffic Sensors */}
        <h4 className="text-sm font-bold text-blue-gray-700 mt-4 mb-2">
          📡 Traffic Sensors
        </h4>
        {sensors.map((s) => (
          <label
            key={s.deviceName}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(s.deviceName)}
              onChange={() => toggleDevice(s.deviceName)}
              className="w-4 h-4 accent-blue-gray-700"
            />
            <span className="text-blue-gray-700 text-sm">
              {s.deviceName}
            </span>
          </label>
        ))}

        {/* GROUP 2: Traffic Lights */}
        <h4 className="text-sm font-bold text-blue-gray-700 mt-4 mb-2">
          🚥 Traffic Lights
        </h4>
        {lights.map((l) => (
          <label
            key={l.deviceName}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(l.deviceName)}
              onChange={() => toggleDevice(l.deviceName)}
              className="w-4 h-4 accent-blue-gray-700"
            />
            <span className="text-blue-gray-700 text-sm">
              {l.deviceName}
            </span>
          </label>
        ))}
      </div>

      {/* ---------- MAP AREA ---------- */}
      <div
        className="flex-1 rounded-xl overflow-hidden border border-blue-gray-100 shadow-md"
        style={{ height: "450px" }}
      >
        <MapContainer
          center={[36.44, 28.22]}
          zoom={11}
          className="w-full h-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredDevices.map((d) => (
            <Marker
              key={d.deviceName}
              position={[d.lat, d.lng]}
              icon={
                d.type === "light"
                  ? trafficLightIcon
                  : d.type === "sensor"
                  ? trafficSensorIcon
                  : defaultIcon}>

              <Popup>
                <strong>{d.deviceName}</strong>
                <br />
                <span className="text-xs text-gray-600">
                  Last Update: {d.dateObserved || "N/A"}
                </span>
                <hr />

                {d.type === "sensor" && (
                  <div>
                    Speed: <b>{d.speed ?? "N/A"}</b> km/h <br />
                    Traffic Level: <b>{d.traffic_level ?? "N/A"}</b> <br />
                    Vehicle Counter: <b>{d.vehicle_counter ?? "N/A"}</b>
                  </div>
                )}

                {d.type === "light" && (
                  <div>
                    Passenger Counter:{" "}
                    <b>{d.passenger_counter ?? "N/A"}</b> <br />
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MobilityMap;
