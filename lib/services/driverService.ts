import { supabase } from "@/lib/supabase";
import { Driver } from "@/types/driver";

export async function getDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map((driver: any) => ({
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    email: driver.email,
    languages: driver.languages,
    active: driver.active,
  }));
}