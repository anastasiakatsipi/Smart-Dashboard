// src/services/snap/weather.js
import { apiSnap } from "@/services";

export async function fetchWeatherStations() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: "36.0;27.7;36.6;28.3",
      model: "RhodesWeatherStationProfile",
      format: "json",
    },
  });

  return (data?.features ?? []).map(f => ({
    name: f.properties.deviceName || f.properties.name,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    humidity: f.properties.values?.humidity,
    wind: f.properties.values?.wind_speed,
    temperature: f.properties.values?.temperature,
  }));
}
