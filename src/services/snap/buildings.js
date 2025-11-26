// src/services/snap/environment.js
import { apiSnap } from "@/services";

export async function fetchBuildingsData() {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/iot-search/", {
    params: {
      selection: "36.0;27.7;36.6;28.3",
      model: "RhodesBuildingProfile",
      type:"BuildingProfile",
      format: "json",
    },
  });
   //console.log("RAW API RESPONSE:", data);  // ⬅️ ΕΔΩ
  const features = data?.features ?? [];

  return features.map((f) => {
    const props = f.properties;
    const values = props.values || {};

    return {
      name: props.deviceName,
      displayName: props.building_name || null,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],

      // --- NEW FIELD ---
      serviceUri: props.serviceUri ?? null,

      // --- Environmental values ---
      LVOC: values.LVOC ?? null,
      PM1: values.PM1 ?? null,
      PM25: values.PM25 ?? null,
      acceleration: values.acceleration ?? null,
      co2: values.co2 ?? null,
      humidity: values.humidity ?? null,
      outdoor_temperature: values.outdoor_temperature ?? null,
      temperature: values.temperature ?? null,

      // --- Metadata ---
      dateObserved: values.dateObserved || props.dateObserved || null,
      entry_date: values.entry_date || props.entry_date || null,

      adress: values.adress ?? props.adress ?? null,
      city: values.city ?? props.city ?? null,
      postal_code: values.postal_code ?? props.postal_code ?? null,
      building_name: values.building_name ?? props.building_name ?? null,

      // --- Energy / utility measurements ---
      power_consumption: values.power_consumption ?? null,
      water_consumption: values.water_consumption ?? null,
      fuel_tank: values.fuel_tank ?? null,


      
    };
  });
}
