import { apiSnap } from "@/services";

export async function fetchHistoricData(deviceUri, metric, fromTime, toTime) {
  const { data } = await apiSnap.get("/ServiceMap/api/v1/", {
    params: {
      serviceUri: deviceUri,
      fromTime,
      toTime,
      format: "json",
    },
  });

  // Extract values
  const bindings = data?.realtime?.results?.bindings ?? [];

  const mapped = bindings.map((b) => ({
    timestamp: b?.dateObserved?.value,
    value: parseFloat(b?.[metric]?.value ?? NaN),
  }));

  return mapped;
}