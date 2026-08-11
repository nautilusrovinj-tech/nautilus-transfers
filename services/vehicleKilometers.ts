import { createClient } from "@/lib/supabase/client";

import {
  VehicleKilometer,
} from "@/types/vehicle-kilometer";

const supabase = createClient();

function mapKilometer(
  row: any
): VehicleKilometer {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

    date:
      row.date,

    kilometers:
      Number(row.kilometers ?? 0),

    note:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}

export async function getVehicleKilometers(
  vehicleId: string
): Promise<VehicleKilometer[]> {
  const { data, error } =
    await supabase
      .from("vehicle_kilometers")
      .select("*")
      .eq(
        "vehicle_id",
        vehicleId
      )
      .order("date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    mapKilometer
  );
}

export async function createVehicleKilometer(
  vehicleId: string,
  date: string,
  kilometers: number,
  note: string
) {
  const { error } =
    await supabase
      .from("vehicle_kilometers")
      .insert({
        vehicle_id:
          vehicleId,

        date,

        kilometers,

        note:
          note || null,
      });

  if (error) {
    throw error;
  }
}

export async function deleteVehicleKilometer(
  id: string
) {
  const { error } =
    await supabase
      .from("vehicle_kilometers")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}