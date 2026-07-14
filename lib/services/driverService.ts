import { supabase } from "@/lib/supabase";
import { mapDriver } from "@/lib/mappers/driverMapper";
import { Driver } from "@/types/driver";

export async function getDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapDriver);
}