import {
  fetchEnvironmentData,
  fetchBuildingProfiles,
  fetchTrafficLights,
  fetchWeatherStations,
  fetchMobilityData,
  fetchEnergyData
} from "@/services/snap";

import {
  saveEnvironmentData,
  saveBuildingsData,
  saveTrafficData,
  saveWeatherData,
  saveMobilityData,
  saveEnergyData
} from "@/repositories";

export async function fetchDailyData() {
  console.log("Daily fetch started...");

  await saveEnvironmentData(await fetchEnvironmentData());
  await saveBuildingsData(await fetchBuildingProfiles());
  await saveTrafficData(await fetchTrafficLights());
  await saveWeatherData(await fetchWeatherStations());
  await saveMobilityData(await fetchMobilityData());
  await saveEnergyData(await fetchEnergyData());

  console.log("Daily fetch completed");
}
