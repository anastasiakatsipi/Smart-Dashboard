// DAILY SYNC WITH HARDCODED SNAP CREDENTIALS
import { createClient } from "jsr:@supabase/supabase-js@2";
// Supabase service key
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
// SNAP AUTH (hardcoded)
const SNAP_TOKEN_URL = "https://snap4.rhodes.gr/auth/realms/master/protocol/openid-connect/token/";
const SNAP_USERNAME = Deno.env.get("SNAP_USERNAME");
const SNAP_PASSWORD = Deno.env.get("SNAP_PASSWORD");
const SNAP_CLIENT_ID = Deno.env.get("SNAP_CLIENT_ID");
const SNAP_CLIENT_SECRET = Deno.env.get("SNAP_CLIENT_SECRET");
// SNAP api base
const SNAP_BASE = "https://snap4.rhodes.gr/ServiceMap/api/v1/iot-search/";
const BBOX = "36.0;27.7;36.6;28.3";
// -----------------------
// GET SNAP TOKEN
// -----------------------
async function getSnapToken() {
  const body = new URLSearchParams({
    grant_type: "password",
    username: SNAP_USERNAME,
    password: SNAP_PASSWORD
  });
  const res = await fetch(SNAP_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(`${SNAP_CLIENT_ID}:${SNAP_CLIENT_SECRET}`)
    },
    body
  });
  if (!res.ok) {
    console.error("Token fetch failed:", res.status);
    return null;
  }
  const json = await res.json();
  return json.access_token;
}
// -----------------------
// FETCH SNAP DATA
// -----------------------
async function fetchSnap(params) {
  const token = await getSnapToken();
  if (!token) return [];
  let url = `${SNAP_BASE}?selection=${BBOX}`;
  for (const [k, v] of Object.entries(params)){
    url += `&${k}=${encodeURIComponent(v)}`;
  }
  console.log("Fetching URL:", url);
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    }
  });
  if (!res.ok) {
    console.error("SNAP fetch failed:", res.status);
    return [];
  }
  const json = await res.json();
  return json?.features ?? [];
}
// -----------------------
// CLEAN FEATURE
// -----------------------
function cleanFeature(f) {
  const props = f.properties ?? {};
  const values = props.values ?? {};
  const merged = {
    ...props,
    ...values
  };
  if (f.geometry?.coordinates) {
    merged.lng = f.geometry.coordinates[0];
    merged.lat = f.geometry.coordinates[1];
  }
  return merged;
}
// -----------------------
// SAVE TO SUPABASE
// -----------------------
async function saveTo(table, items) {
  if (!items.length) {
    console.log(`No data for ${table}`);
    return;
  }
  const rows = items.map((i)=>({
      payload: i
    }));
  const { error } = await supabase.from(table).insert(rows);
  if (error) console.error("Save error:", error);
  else console.log(`Saved ${items.length} rows to ${table}`);
}
// -----------------------
// TASKS
// -----------------------
// ============================
// BUILDINGS
// ============================
async function syncBuildings() {
  const features = await fetchSnap({
    model: "RhodesBuildingProfile",
    type: "BuildingProfile"
  });
  console.log("Buildings fetched:", features.length);
  const cleaned = features.map(cleanFeature);
  await saveTo("building_data", cleaned);
}
// ============================
// TRAFFIC LIGHTS — FIXED
// ============================
async function syncTrafficLights() {
  const features = await fetchSnap({
    model: "RhodesTrafficLightProfile"
  });
  console.log("TrafficLights fetched:", features.length);
  const cleaned = features.map(cleanFeature);
  await saveTo("traffic_lights_data", cleaned);
}
// ============================
// TRAFFIC SENSORS — FIXED
// ============================
async function syncTrafficSensors() {
  const features = await fetchSnap({
    model: "RhodesTrafficSensorProfile"
  });
  console.log("TrafficSensors fetched:", features.length);
  const cleaned = features.map(cleanFeature);
  await saveTo("traffic_sensors_data", cleaned);
}
// -----------------------
// RUN ALL
// -----------------------
async function runDailySync() {
  console.log("▶ Starting sync...");
  await syncBuildings();
  await syncTrafficLights();
  await syncTrafficSensors();
  console.log("✔ Completed");
}
// -----------------------
// EDGE FUNCTION ENTRY
// -----------------------
Deno.serve(async ()=>{
  await runDailySync();
  return new Response("Done", {
    status: 200
  });
});
