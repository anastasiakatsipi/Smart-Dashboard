import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { SchoolMap } from "@/widgets/maps";
import { fetchEnvironmentData } from "@/services/snap/environment";
import { fetchWeatherStations } from "@/services/snap/weather";
import Co2Chart from "@/widgets/charts/Co2Chart";
import TemperatureChart from "@/widgets/charts/TemperatureChart";

export function Environment() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✔ EXACT SAME STYLE AS Energy.jsx
  const ALLOWED_BUILDINGS = {
    lykeio_archangelou: "Archangelos High School",
    gymnasio_kremastis: "Kremasti Junior High School",
    venetokleio_b: "Venetokleio (Building B)",
    venetokleio_a: "Venetokleio (Building A)",
    kapnoviomichania: "Tobacco Industry Building",
    oikokyriki: "Home Economics School",
    kazouleio: "Kazouleio Cultural Center",
    akadimia: "Academy Hall",
    gymnasio_gennadiou: "Gennadi Junior High School",
  };

  const ALLOWED_STATIONS = {
    weather_station_sae1: "Weather Station SAE 1",
    weather_station_sae2: "Weather Station SAE 2",
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const buildings = await fetchEnvironmentData();
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
          <Typography variant="h2" color="blue-gray" className="font-bold">
            🌿 Environment Dashboard
          </Typography>

          <Button onClick={loadData} color="dark" disabled={loading}>
            {loading ? "Loading..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        <CardBody className="pb-4">
          <SchoolMap schools={rows} />
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
