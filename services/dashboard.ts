import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];

  const [
    transfers,
    drivers,
    vehicles,
    partners,
  ] = await Promise.all([
    supabase
      .from("transfers")
      .select("id, price, date"),

    supabase
      .from("drivers")
      .select("id")
      .eq("active", true),

    supabase
      .from("vehicles")
      .select("id")
      .eq("active", true),

    supabase
      .from("partners")
      .select("id")
      .eq("active", true),
  ]);

  if (
    transfers.error ||
    drivers.error ||
    vehicles.error ||
    partners.error
  ) {
    throw (
      transfers.error ||
      drivers.error ||
      vehicles.error ||
      partners.error
    );
  }

  const todayTransfers =
    transfers.data?.filter(
      (t) => t.date === today
    ) ?? [];

  const todayRevenue = todayTransfers.reduce(
    (sum, t) => sum + Number(t.price ?? 0),
    0
  );

  return {
    todayTransfers: todayTransfers.length,
    activeDrivers: drivers.data?.length ?? 0,
    activeVehicles: vehicles.data?.length ?? 0,
    activePartners: partners.data?.length ?? 0,
    todayRevenue,
  };
}