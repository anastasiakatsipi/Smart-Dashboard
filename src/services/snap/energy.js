// src/services/snap/energy.js
import { apiSnap } from "@/services";

export async function fetchEnergyData() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: "36.0;27.7;36.6;28.3",
      model: "Energy_Consolidated",
      format: "json",
    },
  });

  return data?.features ?? [];
}
