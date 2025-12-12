// src/widgets/maps/MobilityMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import MetricRow from "@/widgets/tables/MetricRow";
import HistoricPanel from "@/widgets/panels/HistoricPanel";
import { fetchHistoricData } from "@/services/snap/history";
import { createRange } from "@/utils/dateRanges";
import { fetchHistoricFromSupabase } from "@/services/snap/myHistoric";

// Fix default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons
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

  // ------- HISTORIC DATA STATE -------
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [historicData, setHistoricData] = useState([]);
  const [loadingHistoric, setLoadingHistoric] = useState(false);

  const handleRangeSelect = async (device, rangeKey, metric) => {
  if (!device) return;

  setLoadingHistoric(true);
  setSelectedDevice(device);
  setSelectedMetric(metric);

  const { from, to } = createRange(rangeKey);

  const table =
    device.type === "light"
      ? "traffic_lights_data"
      : "traffic_sensors_data";

  try {
    // Fetch all rows from Supabase
    const data = await fetchHistoricFromSupabase(
      table,
      new Date(from).toISOString(),
      new Date(to).toISOString()
    );

    console.log("Raw Supabase data:", data);

    // Filter rows by selected device and extract metric
    const deviceData = data
      .filter((row) => {
        const deviceName =
          row.payload?.deviceName || row.deviceName || row.payload?.name;
        return deviceName === device.deviceName;
      })
      .map((row) => {
        let value;

        if (row.payload && Object.prototype.hasOwnProperty.call(row.payload, metric)) {
          value = row.payload[metric];
        } else if (row.payload?.values && Object.prototype.hasOwnProperty.call(row.payload.values, metric)) {
          value = row.payload.values[metric];
        }

        let timestamp = row.timestamp || row.created_at;
        if (typeof timestamp === "number") timestamp = new Date(timestamp).toISOString();

        return { timestamp, value };
      })
      .filter((d) => d.value !== undefined);

    // Aggregate daily
    const dailyData = deviceData.reduce((acc, { timestamp, value }) => {
      const date = new Date(timestamp);
      const dayKey = `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;

      if (!acc[dayKey]) acc[dayKey] = { sum: 0, count: 0 };
      acc[dayKey].sum += value;
      acc[dayKey].count += 1;

      return acc;
    }, {});

    const aggregatedData = Object.entries(dailyData).map(([day, { sum, count }]) => ({
      timestamp: day,
      value: metric === "speed" ? sum / count : sum, // average speed, sum for counters
    }));

    // Sort by date
    aggregatedData.sort((a, b) => {
      const [d1, m1, y1] = a.timestamp.split("/").map(Number);
      const [d2, m2, y2] = b.timestamp.split("/").map(Number);
      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    console.log("Aggregated daily data:", aggregatedData);
    setHistoricData(aggregatedData);
  } catch (err) {
    console.error("Error fetching historic data:", err);
    setHistoricData([]);
  } finally {
    setLoadingHistoric(false);
  }
};


  return (
    <div className="flex flex-col w-full gap-4 overflow-y-auto">

      {/* ---------- TOP: SIDEBAR + MAP ---------- */}
      <div className="flex w-full gap-4">

        {/* SIDEBAR */}
        <div
          className="w-64 bg-white rounded-xl shadow-md border p-4 flex-shrink-0"
          style={{ height: "450px", overflowY: "auto" }}
        >
          <h4 className="text-sm font-bold text-blue-gray-700 mt-2 mb-2">📡 Traffic Sensors</h4>
          {sensors.map((s) => (
            <label
              key={`sensor-${s.deviceName}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(s.deviceName)}
                onChange={() => toggleDevice(s.deviceName)}
                className="w-4 h-4 accent-blue-gray-700"
              />
              <span className="text-blue-gray-700 text-sm">{s.deviceName}</span>
            </label>
          ))}

          <h4 className="text-sm font-bold text-blue-gray-700 mt-4 mb-2">🚥 Traffic Lights</h4>
          {lights.map((l) => (
            <label
              key={`light-${l.deviceName}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(l.deviceName)}
                onChange={() => toggleDevice(l.deviceName)}
                className="w-4 h-4 accent-blue-gray-700"
              />
              <span className="text-blue-gray-700 text-sm">{l.deviceName}</span>
            </label>
          ))}
        </div>

        {/* MAP AREA */}
        <div
          className="flex-1 rounded-xl overflow-hidden border shadow-md"
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
                key={`marker-${d.deviceName}`}
                position={[d.lat, d.lng]}
                icon={
                  d.type === "light"
                    ? trafficLightIcon
                    : d.type === "sensor"
                    ? trafficSensorIcon
                    : defaultIcon
                }
                eventHandlers={{ click: () => setSelectedDevice(d) }}
              >
                <Popup>
                  <strong>{d.deviceName}</strong>
                  <br />
                  <small className="text-gray-600">
                    Last Update: {d.dateObserved || "N/A"}
                  </small>
                  <hr />

                  {d.type === "sensor" && (
                    <>
                      {d.speed !== null && (
                        <MetricRow
                          key={`${d.deviceName}-speed`}
                          label="Speed"
                          value={d.speed}
                          unit="km/h"
                          metric="speed"
                          building={d}
                          onRangeSelect={handleRangeSelect}
                        />
                      )}

                      {d.vehicle_counter !== null && (
                        <MetricRow
                          key={`${d.deviceName}-vehicle_counter`}
                          label="Vehicle Counter"
                          value={d.vehicle_counter}
                          unit="vehicles"
                          metric="vehicle_counter"
                          building={d}
                          onRangeSelect={handleRangeSelect}
                        />
                      )}

                      {d.traffic_level !== null && (
                        <MetricRow
                          key={`${d.deviceName}-traffic_level`}
                          label="Traffic Level"
                          value={d.traffic_level}
                          unit=""
                          metric="traffic_level"
                          building={d}
                          onRangeSelect={handleRangeSelect}
                        />
                      )}
                    </>
                  )}

                  {d.type === "light" && (
                    <>
                      {d.passenger_counter !== null && (
                        <MetricRow
                          key={`${d.deviceName}-passenger_counter`}
                          label="Passenger Counter"
                          value={d.passenger_counter}
                          unit="people"
                          metric="passenger_counter"
                          building={d}
                          onRangeSelect={handleRangeSelect}
                        />
                      )}
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ---------- HISTORIC PANEL BELOW ---------- */}
      <HistoricPanel
        metric={selectedMetric}
        data={historicData}
        building={selectedDevice}
        loading={loadingHistoric}
      />
    </div>
  );
}

export default MobilityMap;
