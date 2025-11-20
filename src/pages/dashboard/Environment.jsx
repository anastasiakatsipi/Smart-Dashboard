import { useState, useEffect } from "react";
import { Typography, Button, Card, CardHeader, CardBody } from "@material-tailwind/react";

import { SchoolMap } from "@/widgets/maps";
import { fetchEnvironmentData } from "@/services/snap/environment";
import Co2Chart from "@/widgets/charts/Co2Chart";
import TemperatureChart from "@/widgets/charts/TemperatureChart";

export function Environment() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchEnvironmentData();
      setRows(result);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-8 w-full mx-auto max-w-7xl">    
      {/* Map */}
            <Card className="shadow-md border border-blue-gray-100">
              <CardHeader floated={false} shadow={false} className="p-4 flex items-center justify-between">
                <Typography variant="h2" color="blue-gray" className="font-bold">
                  🌿 Environment Dashboard
                </Typography>
                <Button onClick={loadData} color="black" disabled={loading}>
                    {loading ? "Φόρτωση..." : "Ανανέωση"}
                </Button>
              </CardHeader>
              <CardBody className="h-[500px]">
                <SchoolMap schools={rows} />
              </CardBody>
            
      {/* 2 Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-4">
          <Co2Chart
            data={rows.map(r => ({ name: r.name, co2: r.co2 }))}
            height={260}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <TemperatureChart
            data={rows.map(r => ({ name: r.name, temperature: r.temperature }))}
            height={260}
          />
        </div>
      </div>
</Card>
      
    </div>
  );
}

export default Environment;
