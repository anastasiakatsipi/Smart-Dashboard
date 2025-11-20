export const environmentChartsData = [
  {
    title: "CO₂ Levels",
    description: "Current CO₂ values from weather stations (ppm)",
    color: "green",
    footer: "Updated live",
    chart: {
      type: "line",
      height: 250,
      series: [
        {
          name: "CO₂ (ppm)",
          data: [], // θα γεμίσουμε από API
        },
      ],
      options: {
        chart: {
          toolbar: { show: false },
        },
        xaxis: {
          categories: [], // ονόματα συσκευών
        },
        stroke: {
          curve: "smooth",
        },
      },
    },
  },
];
