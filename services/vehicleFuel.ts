import { createClient } from "@/lib/supabase/client";

import {
  VehicleFuel,
} from "@/types/vehicle-fuel";

const supabase = createClient();

function mapFuel(
  row: any
): VehicleFuel {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

    date:
      row.date,

    liters:
      Number(row.liters ?? 0),

    pricePerLiter:
      Number(
        row.price_per_liter ?? 0
      ),

    totalCost:
      Number(
        row.total_cost ?? 0
      ),

    kilometers:
      row.kilometers !== null &&
      row.kilometers !== undefined
        ? Number(row.kilometers)
        : null,

    fuelStation:
      row.fuel_station ?? "",

    note:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}

export async function getVehicleFuel(
  vehicleId: string
): Promise<VehicleFuel[]> {
  const { data, error } =
    await supabase
      .from("vehicle_fuel")
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
    mapFuel
  );
}

export async function createVehicleFuel(
  vehicleId: string,
  date: string,
  liters: number,
  pricePerLiter: number,
  totalCost: number,
  kilometers: number | null,
  fuelStation: string,
  note: string
) {
  const { error } =
    await supabase
      .from("vehicle_fuel")
      .insert({
        vehicle_id:
          vehicleId,

        date,

        liters,

        price_per_liter:
          pricePerLiter,

        total_cost:
          totalCost,

        kilometers,

        fuel_station:
          fuelStation ||
          null,

        note:
          note || null,
      });

  if (error) {
    throw error;
  }
}

export async function deleteVehicleFuel(
  id: string
) {
  const { error } =
    await supabase
      .from("vehicle_fuel")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}