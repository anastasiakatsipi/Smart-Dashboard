import React from "react";
import MetricBarChart from "@/widgets/charts/MetricBarChart";

export function PassengerCounterChart({ lights, height = 250 }) {
  // Δημιουργούμε το data array όπως χρειάζεται για MetricBarChart
  const data = lights.map((l) => ({
    name: l.deviceName,
    passenger_counter: l.passenger_counter || 0,
  }));

  return (
    <MetricBarChart
      data={data}
      height={height}
      valueKey="passenger_counter"
      yLabel="People"
      title="Passenger Counter per Traffic Light"
      description="X-axis = traffic lights, Y-axis = number of people detected."
    />
  );
}

export default PassengerCounterChart;
