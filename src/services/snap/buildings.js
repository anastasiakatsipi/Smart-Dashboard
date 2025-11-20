// src/services/snap/buildings.js
import { apiSnap } from "@/services";

const bbox = "36.0;27.7;36.6;28.3";

export async function fetchBuildingProfiles() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      model: "RhodesBuildingProfile",
      format: "json",
    },
  });

  return data.features ?? [];
}

export async function fetchSchoolBuildingProfiles() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: bbox,
      model: "RhodesSchoolBuildingProfile",
      format: "json",
    },
  });

  return data.features ?? [];
}
