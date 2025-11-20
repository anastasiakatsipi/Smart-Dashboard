// src/pages/dashboard/Energy.jsx

import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { fetchEnvironmentData } from "@/services/snap/environment";
import EnergyMap from "@/widgets/maps/EnergyMap";

export function Energy() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchEnvironmentData();   // ⬅️ από εδώ έρχονται όλα
      setRows(data.filter(d => d.lat && d.lng));    // μόνο όσα έχουν γεωγραφία
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <Card className="shadow-md border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="p-4 flex items-center justify-between">
          <Typography variant="h2" color="blue-gray" className="font-bold">
            ⚡ Energy Dashboard
          </Typography>
          <Button
            color="blue-gray"
            onClick={loadData}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Φόρτωση..." : "Ανανέωση"}
          </Button>
        </CardHeader>
        <CardBody className="h-[500px]">
          <EnergyMap devices={rows} />
        </CardBody>
      </Card>

    </div>
  );
}


export default Energy;