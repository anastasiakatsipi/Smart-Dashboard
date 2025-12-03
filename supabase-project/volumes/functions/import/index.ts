import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// admin client
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { email, password } = body;

  if (!email || !password) {
    return json({ error: "Missing email or password" }, 422);
  }

  // CREATE USER IN SUPABASE AUTH
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // optional
  });

  if (error) {
    return json({ error: error.message }, 400);
  }

  return json({ user: data.user }, 201);
});
