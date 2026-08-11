import { createClient } from "@/lib/supabase/client";
import { VehicleExpense } from "@/types/vehicle-expense";

const supabase = createClient();

function mapExpense(row: any): VehicleExpense {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

    date:
      row.date,

    kilometers:
      row.kilometers ?? null,

    category:
      row.category ?? "",

    description:
      row.description ?? "",

    amount:
      Number(row.amount ?? 0),

    liters:
      row.liters !== null &&
      row.liters !== undefined
        ? Number(row.liters)
        : null,

    pricePerLiter:
      row.price_per_liter !== null &&
      row.price_per_liter !== undefined
        ? Number(row.price_per_liter)
        : null,

    provider:
      row.provider ?? "",

    note:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}

export async function getVehicleExpenses(
  vehicleId: string
): Promise<VehicleExpense[]> {
  const { data, error } =
    await supabase
      .from("vehicle_expenses")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "GET VEHICLE EXPENSES ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return (data ?? []).map(
    mapExpense
  );
}

export async function createVehicleExpense(
  expense: Partial<VehicleExpense>
) {
  const payload = {
    vehicle_id:
      expense.vehicleId,

    date:
      expense.date,

    kilometers:
      expense.kilometers,

    category:
      expense.category,

    description:
      expense.description,

    amount:
      expense.amount ?? 0,

    liters:
      expense.liters,

    price_per_liter:
      expense.pricePerLiter,

    provider:
      expense.provider,

    note:
      expense.note,
  };

  const {
    data,
    error,
  } = await supabase
    .from("vehicle_expenses")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(
      "CREATE VEHICLE EXPENSE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return mapExpense(data);
}

export async function updateVehicleExpense(
  id: string,
  expense: Partial<VehicleExpense>
) {
  const payload = {
    date:
      expense.date,

    kilometers:
      expense.kilometers,

    category:
      expense.category,

    description:
      expense.description,

    amount:
      expense.amount ?? 0,

    liters:
      expense.liters,

    price_per_liter:
      expense.pricePerLiter,

    provider:
      expense.provider,

    note:
      expense.note,
  };

  const {
    data,
    error,
  } = await supabase
    .from("vehicle_expenses")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "UPDATE VEHICLE EXPENSE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return mapExpense(data);
}

export async function deleteVehicleExpense(
  id: string
) {
  const { error } =
    await supabase
      .from("vehicle_expenses")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE VEHICLE EXPENSE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }
}