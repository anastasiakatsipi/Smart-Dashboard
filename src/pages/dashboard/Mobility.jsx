// src/pages/dashboard/Mobility.jsx

import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

import MobilityMap from "@/widgets/maps/MobilityMap";
import { fetchTrafficLights, fetchTrafficSensors } from "@/services/snap/traffic";

export function Mobility() {
  const [lights, setLights] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const tl = await fetchTrafficLights();
      const ts = await fetchTrafficSensors();

      setLights(tl);
      setSensors(ts);
    } catch (err) {
      console.error("Mobility FETCH ERROR:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">

      {/* Mobility Map Card */}
      <Card className="shadow-md border border-blue-gray-100">

        {/* Header */}
        <CardHeader
          floated={false}
          shadow={false}
          className="p-4 flex items-center justify-between"
        >
          <Typography variant="h2" color="blue-gray" className="font-bold">
            🚦 Mobility Dashboard
          </Typography>

          <Button onClick={loadData} color="blue-gray" disabled={loading}>
            {loading ? "Φόρτωση..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        {/* Body without fixed height */}
        <CardBody className="p-4">
          <MobilityMap lights={lights} sensors={sensors} />
        </CardBody>

      </Card>
    </div>
  );
}

export default Mobility;
