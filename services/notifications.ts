import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getTransfersToNotify() {
  const now = new Date();

  const end = new Date(
    now.getTime() + 48 * 60 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("status", "Assigned")
    .eq("driver_notified", false)
    .gte(
      "date",
      now.toISOString().slice(0, 10)
    )
    .lte(
      "date",
      end.toISOString().slice(0, 10)
    );

  if (error) throw error;

  return data ?? [];
}

export async function markDriverNotified(
  id: string
) {
  const { error } = await supabase
    .from("transfers")
    .update({
      driver_notified: true,
      driver_notified_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}