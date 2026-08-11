import { createClient } from "@/lib/supabase/client";

import { VehicleTire } from "@/types/vehicle-tire";

const supabase = createClient();


// -----------------------------------------
// Map database row
// -----------------------------------------

function mapTire(row: any): VehicleTire {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

    date:
      row.date,

    kilometers:
      row.kilometers ?? null,

    tireType:
      row.tire_type ?? "",

    brand:
      row.brand ?? "",

    size:
      row.size ?? "",

    cost:
      Number(row.cost ?? 0),

    note:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}


// -----------------------------------------
// Get vehicle tires
// -----------------------------------------

export async function getVehicleTires(
  vehicleId: string
): Promise<VehicleTire[]> {
  const { data, error } =
    await supabase
      .from("vehicle_tires")
      .select("*")
      .eq(
        "vehicle_id",
        vehicleId
      )
      .order("date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "GET VEHICLE TIRES ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      [
        `Message: ${error.message}`,
        `Code: ${error.code ?? "-"}`,
        `Details: ${error.details ?? "-"}`,
        `Hint: ${error.hint ?? "-"}`,
      ].join("\n")
    );
  }

  return (data ?? []).map(
    mapTire
  );
}


// -----------------------------------------
// Create tire record
// -----------------------------------------

export async function createVehicleTire(
  tire: Partial<VehicleTire>
) {
  const payload = {
    vehicle_id:
      tire.vehicleId,

    date:
      tire.date,

    kilometers:
      tire.kilometers,

    tire_type:
      tire.tireType,

    brand:
      tire.brand,

    size:
      tire.size,

    cost:
      tire.cost,

    note:
      tire.note,
  };

  const {
    data,
    error,
  } = await supabase
    .from("vehicle_tires")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(
      "CREATE VEHICLE TIRE ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      [
        `Message: ${error.message}`,
        `Code: ${error.code ?? "-"}`,
        `Details: ${error.details ?? "-"}`,
        `Hint: ${error.hint ?? "-"}`,
      ].join("\n")
    );
  }

  return mapTire(data);
}


// -----------------------------------------
// Update tire record
// -----------------------------------------

export async function updateVehicleTire(
  id: string,
  tire: Partial<VehicleTire>
) {
  const payload = {
    date:
      tire.date,

    kilometers:
      tire.kilometers,

    tire_type:
      tire.tireType,

    brand:
      tire.brand,

    size:
      tire.size,

    cost:
      tire.cost,

    note:
      tire.note,
  };

  const {
    data,
    error,
  } = await supabase
    .from("vehicle_tires")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "UPDATE VEHICLE TIRE ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      [
        `Message: ${error.message}`,
        `Code: ${error.code ?? "-"}`,
        `Details: ${error.details ?? "-"}`,
        `Hint: ${error.hint ?? "-"}`,
      ].join("\n")
    );
  }

  return mapTire(data);
}


// -----------------------------------------
// Delete tire record
// -----------------------------------------

export async function deleteVehicleTire(
  id: string
) {
  const { error } =
    await supabase
      .from("vehicle_tires")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE VEHICLE TIRE ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      [
        `Message: ${error.message}`,
        `Code: ${error.code ?? "-"}`,
        `Details: ${error.details ?? "-"}`,
        `Hint: ${error.hint ?? "-"}`,
      ].join("\n")
    );
  }
}