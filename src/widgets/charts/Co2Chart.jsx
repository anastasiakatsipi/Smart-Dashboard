import React from "react";
import MetricBarChart from "@/widgets/charts/MetricBarChart";

export function Co2Chart({ data, height = 250 }) {
  return (
    <MetricBarChart
      data={data}
      height={height}
      valueKey="co2"
      yLabel="CO₂ (ppm)"
      title="Διάγραμμα CO₂ ανά σχολείο"
      description="Άξονας Χ = σχολεία, άξονας Υ = CO₂ σε ppm."
    />
  );
}

export default Co2Chart;
