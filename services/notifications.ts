import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getTransfersToNotify() {
  const now = new Date();

  const in48Hours = new Date(
    now.getTime() + 48 * 60 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("status", "Assigned")
    .eq("driver_notified", false)
    .gte(
      "date",
      now.toISOString().split("T")[0]
    )
    .lte(
      "date",
      in48Hours.toISOString().split("T")[0]
    );

  if (error) throw error;

  return data ?? [];
}

export async function markDriverNotified(
  transferId: string
) {
  const { error } = await supabase
    .from("transfers")
    .update({
      driver_notified: true,
      driver_notified_at:
        new Date().toISOString(),
    })
    .eq("id", transferId);

  if (error) throw error;
}