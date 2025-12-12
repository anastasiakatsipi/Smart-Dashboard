export const cardsConfig = [
  {
    id: "energy",
    title: "Energy",
    description: "Monitor energy consumption & fuel levels.",
    icon: "energy",
    path: "/dashboard/energy",
    roles: ["areamanager", "manager", "guest"],
  },
  {
    id: "environment",
    title: "Environment",
    description: "Values for CO₂, temperature, humidity & air quality.",
    icon: "environment",
    path: "/dashboard/environment",
    roles: ["areamanager", "manager", "guest"],
  },
  {
    id: "mobility",
    title: "Mobility",
    description: "Traffic lights, vehicle counters & real-time flows.",
    icon: "mobility",
    path: "/dashboard/mobility",
    roles: ["areamanager", "manager", "guest"],
  }
];
