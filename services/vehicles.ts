import { createClient } from "@/lib/supabase/client";
import { Vehicle } from "@/types/vehicle";

const supabase = createClient();

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []) as Vehicle[];
}

export async function getVehicleById(
  id: string
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Vehicle;
}

export async function createVehicle(
  vehicle: Vehicle
) {
  const { error } = await supabase
    .from("vehicles")
    .insert(vehicle);

  if (error) {
    throw error;
  }
}

export async function updateVehicle(
  id: string,
  vehicle: Vehicle
) {
  const { error } = await supabase
    .from("vehicles")
    .update(vehicle)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteVehicle(
  id: string
) {
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}