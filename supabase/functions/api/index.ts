import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Create global admin client
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"));
// Helper return JSON
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
// Verify user using Supabase Auth
async function requireAuth(req) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return {
    error: "Missing token"
  };
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return {
    error: "Invalid JWT"
  };
  return {
    user: data.user
  };
}
Deno.serve(async (req)=>{
  const url = new URL(req.url);
  const path = url.pathname.replace("/api", "");
  // Public health check
  if (path === "/health") {
    return json({
      ok: true
    });
  }
  // Protected routes
  const auth = await requireAuth(req);
  if (auth.error) return json({
    error: auth.error
  }, 401);
  if (path === "/buildings") {
    const { data } = await supabaseAdmin.from("building_data").select("*");
    return json({
      buildings: data
    });
  }
  if (path === "/latest") {
    const buildings = await supabaseAdmin.from("building_data_latest").select("*");
    const lights = await supabaseAdmin.from("traffic_lights_data_latest").select("*");
    const sensors = await supabaseAdmin.from("traffic_sensors_data_latest").select("*");
    return json({
      latest: {
        buildings: buildings.data,
        traffic_lights: lights.data,
        traffic_sensors: sensors.data
      }
    });
  }
  return json({
    error: "Not Found"
  }, 404);
});
