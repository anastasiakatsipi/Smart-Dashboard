// src/services/snap/weather.js
import { apiSnap } from "@/services";

export async function fetchWeatherStations() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: "36.0;27.7;36.6;28.3",
      model: "RhodesWeatherStationProfile",
      type: "WeatherStationProfile",
      format: "json",
    },
  });

  const features = data?.features ?? [];

  return features.map(f => {
    const props = f.properties;
    const values = props.values || {};

    return {
      name: props.deviceName ?? props.name,
      displayName: props.station_name ?? null,

      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],

      // METEOROLOGICAL DATA
      humidity: values.humidity ?? null,
      precipitation: values.precipitation ?? null,
      pressure: values.pressure ?? null,
      temperature: values.temperature ?? null,
      wind_speed: values.wind_speed ?? null,
      wind_direction: values.wind_direction ?? null,

      // METADATA
      dateObserved: values.dateObserved ?? props.dateObserved ?? null,

      serviceUri: props.serviceUri ?? null,
    };
  });
}
