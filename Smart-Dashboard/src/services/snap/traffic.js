// src/services/snap/traffic.js
import { apiSnap } from "@/services";
import { supabase } from "@/lib/supabaseClient";

const bbox = "36.0;27.7;36.6;28.3";

// ------------------------------------------------------------
// SNAP4CITY FUNCTIONS (τα αφήνουμε όπως είναι)
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// SUPABASE FUNCTIONS (νέες)
// ------------------------------------------------------------

export async function fetchTrafficLightsSupabase() {
  const { data, error } = await supabase
    .from("traffic_lights_data_latest")
    .select("*");

  if (error) throw error;

  return data.map((row) => {
    const p = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;

    return {
      type: "traffic_light",
      deviceName: p.deviceName ?? "Unknown Light",
      lat: p.lat,
      lng: p.lng,
      dateObserved: p.dateObserved ?? p.values?.dateObserved ?? null,
      passenger_counter: p.passenger_counter ?? p.values?.passenger_counter ?? null,
      serviceUri: p.serviceUri ?? null,
    };
  });
}

export async function fetchTrafficSensorsSupabase() {
  const { data, error } = await supabase
    .from("traffic_sensors_data_latest")
    .select("*");

  if (error) throw error;

  return data.map((row) => {
    const p = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;

    return {
      type: "traffic_sensor",
      deviceName: p.deviceName ?? "Unknown Sensor",
      lat: p.lat,
      lng: p.lng,
      dateObserved: p.dateObserved ?? p.values?.dateObserved ?? null,
      speed: p.speed ?? p.values?.speed ?? null,
      traffic_level: p.traffic_level ?? p.values?.traffic_level ?? null,
      vehicle_counter: p.vehicle_counter ?? p.values?.vehicle_counter ?? null,
      serviceUri: p.serviceUri ?? null,
    };
  });
}
