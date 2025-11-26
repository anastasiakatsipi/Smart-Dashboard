import { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import {
  BoltIcon,
  GlobeAmericasIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

import { fetchBuildingsData } from "@/services/snap/buildings";
import { fetchTrafficLights, fetchTrafficSensors } from "@/services/snap/traffic";

export function Home() {
  const [envCount, setEnvCount] = useState(0);
  const [energyCount, setEnergyCount] = useState(0);
  const [trafficLightsCount, setTrafficLightsCount] = useState(0);
  const [trafficSensorsCount, setTrafficSensorsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);

    const minimumDelay = new Promise((resolve) =>
      setTimeout(resolve, 1500)  // 3 seconds minimum
    );

    try {
      // Fetch everything in parallel
      const [env, lights, sensors] = await Promise.all([
        fetchBuildingsData(),
        fetchTrafficLights(),
        fetchTrafficSensors(),
        minimumDelay,   // wait at least 3 seconds
      ]);

      setEnvCount(env.length);
      setEnergyCount(env.filter((e) => e.power_consumption !== null).length);
      setTrafficLightsCount(lights.length);
      setTrafficSensorsCount(sensors.length);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData(); // load once on mount

    // refresh every 5 minutes
    const interval = setInterval(() => {
      loadData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const Skeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-blue-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-8 bg-blue-gray-300 rounded w-1/3"></div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 w-full mx-auto max-w-7xl">

      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" color="blue-gray" className="font-bold">
            Smart City Dashboard
          </Typography>
          <Typography color="blue-gray" className="opacity-70 mt-1">
            Live insights into energy, environment & mobility across Rhodes.
          </Typography>
        </div>

        <Button color="blue-gray" onClick={loadData} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* ---------- KPI CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card className="border border-blue-gray-100 shadow-sm p-4">
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Environment Sensors
            </Typography>
            {loading ? (
              <Skeleton />
            ) : (
              <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
                {envCount}
              </Typography>
            )}
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm p-4">
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Energy Meters
            </Typography>
            {loading ? (
              <Skeleton />
            ) : (
              <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
                {energyCount}
              </Typography>
            )}
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm p-4">
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Traffic Lights
            </Typography>
            {loading ? (
              <Skeleton />
            ) : (
              <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
                {trafficLightsCount}
              </Typography>
            )}
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm p-4">
          <CardBody>
            <Typography variant="h6" color="blue-gray">
              Traffic Sensors
            </Typography>
            {loading ? (
              <Skeleton />
            ) : (
              <Typography className="text-3xl font-bold text-blue-gray-800 mt-2">
                {trafficSensorsCount}
              </Typography>
            )}
          </CardBody>
        </Card>

      </div>

      {/* ---------- FEATURE CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ENERGY */}
        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <BoltIcon className="h-10 w-10 text-yellow-600" />
            <div>
              <Typography variant="h5" className="font-bold">
                Energy
              </Typography>
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

        {/* ENVIRONMENT */}
        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <GlobeAmericasIcon className="h-10 w-10 text-green-700" />
            <div>
              <Typography variant="h5" className="font-bold">
                Environment
              </Typography>
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

        {/* MOBILITY */}
        <Card className="p-6 border border-blue-gray-100 shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <TruckIcon className="h-10 w-10 text-red-600" />
            <div>
              <Typography variant="h5" className="font-bold">
                Mobility
              </Typography>
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
