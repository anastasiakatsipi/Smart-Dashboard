import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { SchoolMap } from "@/widgets/maps";
import { fetchBuildingsData } from "@/services/snap/buildings";
import { fetchWeatherStations } from "@/services/snap/weather";
import Co2Chart from "@/widgets/charts/Co2Chart";
import TemperatureChart from "@/widgets/charts/TemperatureChart";

export function Environment() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✔ EXACT SAME STYLE AS Energy.jsx
  const ALLOWED_BUILDINGS = {
    lykeio_archangelou: "Archangelos Senior High School",
    gymnasio_kremastis: "Kremastis Middle School",
    venetokleio_b: "Venetokleio (Building B)",
    venetokleio_a: "Venetokleio (Building A)",
    kapnoviomichania: "Tobacco Industry",
    oikokyriki: "Oikokyriki",
    kazouleio: "Kazouleio",
    akadimia: "Academy Hall",
    gymnasio_gennadiou: "Gennadiou Middle School",
  };

  const ALLOWED_STATIONS = {
    weather_station_sae1: "Weather Station 1",
    weather_station_sae2: "Weather Station 2",
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const buildings = await fetchBuildingsData();
      const stations = await fetchWeatherStations();

      // buildings that have geo
      const buildingsWithGeo = buildings.filter((d) => d.lat && d.lng);

      // ONLY keep allowed buildings
      const filteredBuildings = buildingsWithGeo
        .filter((b) => ALLOWED_BUILDINGS[b.name])
        .map((b) => ({
          ...b,
          displayName: ALLOWED_BUILDINGS[b.name],
        }));

      // ONLY keep allowed stations
      const filteredStations = stations
        .filter((s) => ALLOWED_STATIONS[s.name])
        .map((s) => ({
          ...s,
          displayName: ALLOWED_STATIONS[s.name],
        }));
        
      setRows([...filteredBuildings, ...filteredStations]);

    } catch (err) {
      console.error("Environment fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">
      <Card className="shadow-md border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <Typography variant="h3" color="blue-gray" className="font-bold flex items-center gap-2">
              Environment Dashboard
            </Typography>

            <Typography variant="paragraph" color="gray" className="mt-1">
              Values for CO₂, temperature, humidity & air quality.
            </Typography>
          </div>

          <Button onClick={loadData} color="dark" disabled={loading}>
            {loading ? "Loading..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        <CardBody className="pb-4">
          <SchoolMap schools={rows} loading={loading} />
        </CardBody>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
            <Co2Chart data={rows} height={260} />
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
            <TemperatureChart data={rows} height={260} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Environment;
