// src/services/snap/traffic.js
import { apiSnap } from "@/services";

const bbox = "36.0;27.7;36.6;28.3";

export async function fetchTrafficLights() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      model: "RhodesTrafficLightProfile",
      format: "json",
    },
  });

  const features = data?.features ?? [];

  return features.map((f) => {
    const props = f.properties;
    const val = props.values ?? {};

    return {
      type: "traffic_light",
      deviceName: props.deviceName || props.name || "Unknown Light",
      lat: f.geometry?.coordinates?.[1],
      lng: f.geometry?.coordinates?.[0],
      serviceUri: props.serviceUri ?? null,
      dateObserved: val.dateObserved ?? null,
      passenger_counter: val.passenger_counter ?? null,
    };
  });
}

export async function fetchTrafficSensors() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      model: "RhodesTrafficSensorProfile",
      format: "json",
    },
  });

  const features = data?.features ?? [];

  return features.map((f) => {
    const props = f.properties;
    const val = props.values ?? {};

    return {
      type: "traffic_sensor",
      deviceName: props.deviceName || props.name || "Unknown Sensor",
      lat: f.geometry?.coordinates?.[1],
      lng: f.geometry?.coordinates?.[0],
      serviceUri: props.serviceUri ?? null,
      dateObserved: val.dateObserved ?? null,
      speed: val.speed ?? null,
      traffic_level: val.traffic_level ?? null,
      vehicle_counter: val.vehicle_counter ?? val.vehile_counter ?? null,
    };
  });
}
