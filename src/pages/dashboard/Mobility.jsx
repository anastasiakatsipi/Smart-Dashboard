import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";

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
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">
      {/* Mobility Map */}
      <Card className="shadow-md border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="p-4 flex items-center justify-between">
          {/* Page Title */}
        <Typography variant="h2" color="blue-gray" className="font-bold">
          🚦 Mobility Dashboard
        </Typography>
          {/* Refresh Button */}
          <Button onClick={loadData} color="blue-gray" disabled={loading}>
            {loading ? "Φόρτωση..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        <CardBody className="h-[500px]">
          <MobilityMap lights={lights} sensors={sensors} />
        </CardBody>
      </Card>

      {/* OPTIONAL charts area */}
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrafficLevelChart data={sensors} />
        <SpeedChart data={sensors} />
        <PassengerCounterChart data={lights} />
      </div>
      */}

    </div>
  );
}

export default Mobility;
