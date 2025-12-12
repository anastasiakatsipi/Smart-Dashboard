import React from "react";
import MetricBarChart from "@/widgets/charts/MetricBarChart";

export function VehicleSensorChart({ sensors = [], height = 250 }) {
  // Δημιουργούμε το data array όπως χρειάζεται για MetricBarChart
  const data = sensors.map((s) => ({
    name: s.deviceName,
    vehicle_count: s.vehicle_counter || 0,
  }));

  return (
    <MetricBarChart
      data={data}
      height={height}
      valueKey="vehicle_count"
      yLabel="Vehicles"
      title="Vehicle Counter per Sensor"
      description="X-axis = traffic sensors, Y-axis = number of vehicles detected."
    />
  );
}

export default VehicleSensorChart;
