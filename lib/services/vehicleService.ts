import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/vehicle";

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map((vehicle: any) => ({
    id: vehicle.id,
    name: vehicle.name,
    registration: vehicle.registration,
    seats: vehicle.seats,
    active: vehicle.active,
  }));
}