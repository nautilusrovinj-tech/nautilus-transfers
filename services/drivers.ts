import { createClient } from "@/lib/supabase/client";
import { Driver } from "@/types/driver";

const supabase = createClient();

export async function getDrivers() {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("name");

  if (error) throw error;

  return data ?? [];
}

export async function createDriver(driver: Driver) {
  const { error } = await supabase
    .from("drivers")
    .insert(driver);

  if (error) throw error;
}

export async function updateDriver(
  id: string,
  driver: Driver
) {
  const { error } = await supabase
    .from("drivers")
    .update(driver)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteDriver(id: string) {
  const { error } = await supabase
    .from("drivers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}