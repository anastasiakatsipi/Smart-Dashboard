// DAILY SYNC EDGE FUNCTION
// Runs once a day (with CRON) and saves all SNAP datasets to Supabase

// ---------------------------
// 1. CONFIG
// ---------------------------

const SNAP_BASE = "https://YOUR-SNAP-API-HERE"; 
// 👆 Βάλε εδώ το σωστό domain (π.χ. snap4city API). 
// Ή θα σου το συμπληρώσω εγώ αν μου το δώσεις.

// Supabase credentials (Service key because Edge Function runs on server)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Create Supabase client for server
import { createClient } from "jsr:@supabase/supabase-js@2";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);


// ---------------------------------------------
// 2. HELPERS TO FETCH AND SAVE
// ---------------------------------------------

async function fetchSnap(path: string, params: Record<string, string>) {
  const url = new URL(path, SNAP_BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error("Fetch failed:", url.toString());
    return [];
  }

  const data = await res.json();
  return data?.features ?? [];
}

function cleanFeature(f: any) {
  const props = f.properties ?? {};
  const values = props.values ?? {};
  return { ...props, ...values };
}

async function saveToSupabase(table: string, items: any[]) {
  if (!items.length) return;

  const payload = items.map((i) => ({ payload: i }));

  const { error } = await supabase.from(table).insert(payload);
  if (error) console.error(`Error saving to ${table}`, error);
  else console.log(`Saved ${items.length} rows to ${table}`);
}


// ---------------------------------------------
// 3. DATASET FUNCTIONS
// ---------------------------------------------

async function syncEnvironment() {
  const features = await fetchSnap("/ServiceMap/api/v1/iot-search/", {
    selection: "36.0;27.7;36.6;28.3",
    type: "EnvironmentSensor",
    format: "json",
  });

  const cleaned = features.map(cleanFeature);
  await saveToSupabase("environment_data", cleaned);
}

async function syncBuildings() {
  const features = await fetchSnap("/ServiceMap/api/v1/iot-search/", {
