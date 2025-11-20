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

  return data.features ?? [];
}

export async function fetchTrafficSensors() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      model: "RhodesTrafficSensorProfile",
      format: "json",
    },
  });

  return data.features ?? [];
}
