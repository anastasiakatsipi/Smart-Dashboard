// src/pages/dashboard/Energy.jsx

import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";

import { fetchEnvironmentData } from "@/services/snap/environment";
import EnergyMap from "@/widgets/maps/EnergyMap";

export function Energy() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Τα buildings που θέλεις να εμφανίζονται
  const ALLOWED_BUILDINGS = {
    megaro_akadimia: "Academy Hall",
    venetokleio_building_b: "Venetokleio (Building B)",
    venetokleio_building_a: "Venetokleio (Building A)",
    geniko_lykeio_rodou_3: "3rd General Lyceum of Rhodes",
    neo_dimotiko_archaggelou: "New Primary School of Archangelos",
    epal_rodou_1: "1st Vocational High School of Rhodes",
    kleisto_gipedo_kalithion: "Kalithies Indoor Gym",
    kleisto_gipedo_venetokleiou: "Venetokleio Indoor Gym",
    geniko_lykeio_rodou_2: "2nd General Lyceum of Rhodes",
    gymnasio_rodou_5: "5th Junior High School of Rhodes",
    gymnasio_rodou_4: "4th Junior High School of Rhodes",
    geniko_lykeio_rodou_4: "4th General Lyceum of Rhodes",
    techniki_ypiresia: "Technical Services Department",
    dimarxeio: "City Hall",
  };



  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchEnvironmentData();

      const withGeo = result.filter((d) => d.lat && d.lng);

      // 1️⃣ Filter only the devices you want
      const filtered = withGeo.filter((item) =>
        ALLOWED_BUILDINGS[item.name]
      );

      // 2️⃣ Add the English displayName
      const mapped = filtered.map((item) => ({
        ...item,
        displayName: ALLOWED_BUILDINGS[item.name],
      }));

      setDevices(mapped);

    } catch (err) {
      console.error("Energy fetch error:", err);
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
      <Card className="shadow-md border border-blue-gray-100">

        {/* HEADER */}
        <CardHeader
          floated={false}
          shadow={false}
          className="p-4 flex items-center justify-between"
        >
          <Typography variant="h2" color="blue-gray" className="font-bold">
            ⚡ Energy Dashboard
          </Typography>

          <Button
            color="dark"
            onClick={loadData}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </CardHeader>

        {/* BODY — ΕΔΩ ΜΠΑΙΝΕΙ ΤΟ ENERGYMAP */}
        <CardBody className="pb-4">
          <EnergyMap devices={devices} />
        </CardBody>

      </Card>
    </div>

  );
}

export default Energy;
