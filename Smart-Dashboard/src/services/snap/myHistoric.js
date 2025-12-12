import { supabase } from "@/lib/supabaseClient";

export async function fetchHistoricFromSupabase(table, from, to) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .gte("created_at", from)
    .lte("created_at", to)
    .order("created_at", { ascending: true });

  if (error) console.error("Supabase error:", error);
  return data;
}
