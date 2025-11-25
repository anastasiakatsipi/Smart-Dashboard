import React from "react";

export default function MetricRow({ label, value, unit, metric, building, onRangeSelect }) {
  return (
    <div className="flex items-center justify-between mb-2 gap-3">

      {/* Left side */}
      <div className="text-sm text-gray-800">
        <strong>{label}:</strong> {value ?? "N/A"} {unit}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {["24h", "7d", "1m", "3m"].map((range) => (
          <button
            key={range}
            onClick={() => onRangeSelect(building, range, metric)}
            className="
              px-2 py-1
              text-xs 
              rounded-md 
              bg-gray-700
              text-white 
              hover:bg-gray-800 
              transition duration-150
              shadow-sm
            "
          >
            {range}
          </button>
        ))}
      </div>

    </div>
  );
}
