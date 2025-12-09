import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Admin client → full permissions (bypasses RLS)
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

serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON format" }, 400);
  }

  const { email, password, organization_id, full_name, role } = body;

  if (!email || !password || !organization_id) {
    return json({ error: "email, password, and organization_id are required" }, 422);
  }

  // 1️⃣ Create user in Supabase Auth
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) return json({ error: createError.message }, 400);

  const uid = userData.user.id;

  // 2️⃣ Create profile row
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      uid,
      full_name: full_name ?? null,
    });

  if (profileError) {
    console.error("Profile creation failed", profileError);
    return json({ error: "Failed to create profile" }, 500);
  }

  // 3️⃣ Add user to organization_members
  const { error: memberError } = await supabaseAdmin
    .from("organization_members")
    .insert({
      organization_id,
      uid,
      role: role ?? "member",
    });

  if (memberError) {
    console.error("Member insert failed", memberError);
    return json({ error: "Failed to assign user to organization" }, 500);
  }

  return json({
    message: "User created and added to organization successfully",
    uid,
    email,
    organization_id,
    role: role ?? "member",
  });
});
