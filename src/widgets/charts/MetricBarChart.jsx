// src/components/MetricBarChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export function MetricBarChart({
  data,
  title,
  description,
  height = 300,
  valueKey,    
  yLabel,
}) {
  const hasData = Array.isArray(data) && data.length > 0;
  
  // 🔥 1. Φιλτράρουμε τιμές null, undefined, 0
  const cleanData = (Array.isArray(data) ? data : []).filter(
    (d) => d[valueKey] !== null && d[valueKey] !== undefined && d[valueKey] > 0
  );

  // 🔥 2. Όλα τα labels = "Building"
  const transformedData = cleanData.map((d) => ({
    ...d,
    label: "Building",
  }));



  return (
    <div className="rounded-xl bg-white shadow-md p-6 space-y-4 border border-blue-gray-100">
      
      {/* ΤΙΤΛΟΣ */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* ΔΙΑΓΡΑΜΜΑ */}
      {hasData ? (
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              
              <XAxis
                dataKey="name"
                tick={false}    // κρύβει τα ticks
                axisLine={false} // κρύβει τον άξονα }}
              />

              <YAxis
                tick={{ fill: "#475569" }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#475569" },
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderColor: "#e2e8f0",
                }}
                itemStyle={{ color: "#334155" }}
                labelStyle={{ color: "#475569" }}
              />

              <Bar
                dataKey={valueKey}
                fill="#334155"       // blue-gray-700
                stroke="#1e293b"     // blue-gray-800
                radius={[4, 4, 0, 0]}
              />


            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          Δεν υπάρχουν διαθέσιμα δεδομένα.
        </div>
      )}
    </div>
  );
}

export default MetricBarChart;
