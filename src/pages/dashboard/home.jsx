import { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button, CardHeader } from "@material-tailwind/react";
import {
  BoltIcon,
  GlobeAmericasIcon,
  TruckIcon,
  MapIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { fetchEnvironmentData } from "@/services/snap/environment";
import { fetchTrafficLights, fetchTrafficSensors } from "@/services/snap/traffic";
import SimpleMap from "@/widgets/maps/SimpleMap";

export function Home() {
  const [envCount, setEnvCount] = useState(0);
  const [energyCount, setEnergyCount] = useState(0);
  const [trafficLightsCount, setTrafficLightsCount] = useState(0);
  const [trafficSensorsCount, setTrafficSensorsCount] = useState(0);
  const [mapPoints, setMapPoints] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const env = await fetchEnvironmentData();
      setEnvCount(env.length);

      // Για τώρα energy = buildings που έχουν values (ίδια data)
      setEnergyCount(env.filter((e) => e.power_consumption !== null).length);

      const lights = await fetchTrafficLights();
      const sensors = await fetchTrafficSensors();

      setTrafficLightsCount(lights.length);
      setTrafficSensorsCount(sensors.length);

      // Μικτός χάρτης overview
      const combinedPoints = [
        ...env.map((e) => ({ lat: e.lat, lng: e.lng, name: e.name })),
        ...lights.map((l) => ({ lat: l.geometry.coordinates[1], lng: l.geometry.coordinates[0], name: l.properties.deviceName })),
      ].slice(0, 20);

      setMapPoints(combinedPoints);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 w-full mx-auto max-w-7xl">

      {/* ---------- HERO TITLE ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" color="blue-gray" className="font-bold">
            Smart City Dashboard
          </Typography>
          <Typography color="blue-gray" className="opacity-70 mt-1">
            Live insights into energy, environment & mobility across Rhodes.
          </Typography>
        </div>

        <Button color="blue-gray" onClick={loadStats}>
          Refresh
        </Button>
      </div>

      {/* ---------- QUICK KPIs ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody>
            <Typography variant="h6" color="blue-gray">Environment Sensors</Typography>
            <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
              {envCount}
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody>
            <Typography variant="h6" color="blue-gray">Energy Meters</Typography>
            <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
              {energyCount}
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody>
            <Typography variant="h6" color="blue-gray">Traffic Lights</Typography>
            <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
              {trafficLightsCount}
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody>
            <Typography variant="h6" color="blue-gray">Traffic Sensors</Typography>
            <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
              {trafficSensorsCount}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* ---------- FEATURE CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <BoltIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <Typography variant="h5" className="font-bold">Energy</Typography>
              <Typography color="gray" className="text-sm">
                Monitor energy consumption & fuel levels.
              </Typography>
            </div>
          </div>
          <Link to="/dashboard/energy">
            <Button color="blue-gray" className="mt-6" fullWidth>
              View Energy
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <GlobeAmericasIcon className="h-10 w-10 text-green-700" />
            <div>
              <Typography variant="h5" className="font-bold">Environment</Typography>
              <Typography color="gray" className="text-sm">
                Values for CO₂, temperature, humidity & air quality.    
              </Typography>
            </div>
          </div>
            <Link to="/dashboard/environment">
            <Button color="blue-gray" className="mt-6" fullWidth>
              View Environment
            </Button>
          </Link>
        </Card>
       

        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <TruckIcon className="h-10 w-10 text-red-600" />
            <div>
              <Typography variant="h5" className="font-bold">Mobility</Typography>
              <Typography color="gray" className="text-sm">
                Traffic lights, vehicle counters & real-time flows.
              </Typography>
            </div>
          </div>
          <Link to="/dashboard/mobility">
            <Button color="blue-gray" className="mt-6" fullWidth>
              View Mobility
            </Button>
          </Link>
        </Card>
      </div>


    </div>
  );
}

export default Home;