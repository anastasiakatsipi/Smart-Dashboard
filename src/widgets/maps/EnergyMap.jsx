// src/widgets/maps/EnergyMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MetricRow from "@/widgets/tables/MetricRow";
import HistoricPanel from "@/widgets/panels/HistoricPanel";
import { fetchHistoricData } from "@/services/snap/history";
import { createRange } from "@/utils/dateRanges";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function EnergyMap({ devices = [], loading }) {
  const [selected, setSelected] = useState(devices.map((d) => d.name));

  // For historic panel
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [historicData, setHistoricData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [loadingHistoric, setLoadingHistoric] = useState(false);

  const toggleDevice = (deviceName) => {
    setSelected((prev) =>
      prev.includes(deviceName)
        ? prev.filter((x) => x !== deviceName)
        : [...prev, deviceName]
    );
  };

  const filtered = devices.filter((d) => selected.includes(d.name));

  // ----- HISTORIC RANGE HANDLER -----
  const handleRangeSelect = async (building, rangeKey, metric) => {
  if (!building.serviceUri) {
    console.warn("❌ NO serviceUri, historic cannot load.");
    return;
  }

  setLoadingHistoric(true);
  setSelectedBuilding(building);
  setSelectedMetric(metric);

  const { from, to } = createRange(rangeKey);

  const data = await fetchHistoricData(
    building.serviceUri,
    metric,
    `${from}`,
    `${to}`
  );

  setHistoricData(data);
  setLoadingHistoric(false);
};


  return (
    <div className="w-full h-full flex flex-col gap-4">

      {/* ---------- TOP: SIDEBAR + MAP ---------- */}
      <div className="flex w-full gap-4">


        {/* Sidebar */}
        <div
          className="w-64 bg-white rounded-xl shadow-md border p-4 flex-shrink-0"
          style={{ height: "450px", overflowY: "auto" }}
        >
          <h4 className="text-center text-sm font-bold text-blue-gray-700 mt-4 mb-2">
            Select Energy Points<hr/>
          </h4>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-7 h-7 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-700 font-medium">
                Loading data, please wait...
              </p>
            </div>
          ) : (
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
                  {d.displayName ?? d.name}
                </span>
              </label>
            ))}
          </div>
          )}
        </div>

        {/* Map */}
        <div
          className="flex-1 rounded-xl overflow-hidden border shadow-md"
          style={{ height: "450px" }}
        >
          <MapContainer
            center={[36.44, 28.22]}
            zoom={12}
            scrollWheelZoom
            className="w-full h-full"
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filtered.map((d, i) => (
              <Marker
                key={i}
                position={[d.lat, d.lng]}
                eventHandlers={{ click: () => setSelectedBuilding(d) }}
              >
                <Popup>
                  <strong>{d.displayName ?? d.name}</strong>
                  <br />
                  <small className="text-gray-600">
                    Last update: {d.dateObserved ?? "N/A"}
                  </small>
                  <hr />

                  {/* ----- HISTORIC METRICS ----- */}
                  {d.power_consumption !== null && (
                    <MetricRow
                      label="Power Consumption"
                      value={d.power_consumption}
                      unit="kWh"
                      metric="power_consumption"
                      building={d}
                      onRangeSelect={handleRangeSelect}
                    />
                  )}

                  {d.temperature !== null && (
                    <MetricRow
                      label="Temperature"
                      value={d.temperature}
                      unit="°C"
                      metric="temperature"
                      building={d}
                      onRangeSelect={handleRangeSelect}
                    />
                  )}

                  {d.humidity !== null && (
                    <MetricRow
                      label="Humidity"
                      value={d.humidity}
                      unit="%"
                      metric="humidity"
                      building={d}
                      onRangeSelect={handleRangeSelect}
                    />
                  )}

                  {d.fuel_tank !== null && (
                    <MetricRow
                      label="Fuel Tank"
                      value={d.fuel_tank}
                      unit="L"
                      metric="fuel_tank"
                      building={d}
                      onRangeSelect={handleRangeSelect}
                    />
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ---------- HISTORIC PANEL BELOW ---------- */}
      <HistoricPanel
        className="h-72"
        metric={selectedMetric}
        data={historicData}
        building={selectedBuilding}
        loading={loadingHistoric}

        
      />
    </div>
  );
}

export default EnergyMap;
