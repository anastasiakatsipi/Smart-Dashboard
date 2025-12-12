// src/pages/dashboard/Mobility.jsx

import { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

import MobilityMap from "@/widgets/maps/MobilityMap";
import PassengerCounterChart from "@/widgets/charts/PassengerCounterChart"
import VehicleHourChart from "@/widgets/charts/VehicleHourChart";

import {  fetchTrafficLightsSupabase,
          fetchTrafficSensorsSupabase, } from "@/services/snap/traffic";

export function Mobility() {
  const [lights, setLights] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Χρησιμοποιούμε useCallback ώστε να μη δημιουργείται νέα συνάρτηση σε κάθε render
  const loadData = useCallback(async () => {
  setLoading(true);

  try {
    const [tl, ts] = await Promise.all([
      fetchTrafficLightsSupabase(),
      fetchTrafficSensorsSupabase(),
    ]);

    setLights(tl);
    setSensors(ts);
  } catch (err) {
    console.error("Mobility FETCH ERROR (Supabase):", err);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    loadData(); // αρχική φόρτωση

    const interval = setInterval(loadData, 300000); // κάθε 5 λεπτά

    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">
      <Card className="shadow-md border border-blue-gray-100">

        <CardHeader
          floated={false}
          shadow={false}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <Typography
              variant="h3"
              color="blue-gray"
              className="font-bold flex items-center gap-2"
            >
              Mobility Dashboard
            </Typography>

            <Typography
              variant="paragraph"
              color="gray"
              className="mt-1"
            >
              Traffic lights, vehicle counters & real-time flows.
            </Typography>
          </div>

          <Button onClick={loadData} color="blue-gray" disabled={loading}>
            {loading ? "Φόρτωση..." : "Ανανέωση"}
          </Button>
        </CardHeader>

        <CardBody className="p-4">
          <MobilityMap lights={lights} sensors={sensors} />
        </CardBody>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
                    {lights.length > 0 && (
                      <PassengerCounterChart lights={lights} height={250} />
                    )}
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 min-h-[300px]">
                    { sensors.length > 0 && (
                      <div className="w-full h-80">
                        <VehicleHourChart sensors={sensors} height={250} />
                      </div>
                    )}
                  </div>
                </div>
        
      </Card>
    </div>
  );
}

export default Mobility;
