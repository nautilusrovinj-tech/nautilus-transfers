import { createClient } from "@/lib/supabase/client";
import { Transfer } from "@/types/transfer";

import { createVehicleKilometer } from "@/services/vehicleKilometers";
import { createVehicleFuel } from "@/services/vehicleFuel";

const supabase = createClient();

function mapTransfer(row: any): Transfer {
  return {
    id: row.id,

    transferNumber:
      row.transfer_number,

    transferType:
      row.transfer_type,

    clientName:
      row.client_name,

    phone:
      row.phone ?? "",

    email:
      row.email ?? "",

    date:
      row.date,

    time:
      row.time,

    pickup:
      row.pickup,

    destination:
      row.destination,

    flight:
      row.flight ?? "",

    adults:
      row.adults ?? 0,

    children:
      row.children ?? 0,

    childSeats:
      row.child_seats ?? 0,

    babySeats:
      row.baby_seats ?? 0,

    boosterSeats:
      row.booster_seats ?? 0,

    driver:
      row.drivers?.name ??
      row.driver ??
      "",

    vehicle:
      row.vehicles?.name ??
      row.vehicle ??
      "",

    partner:
      row.partners?.name ??
      row.partner ??
      "",

    driverId:
      row.driver_id ?? "",

    vehicleId:
      row.vehicle_id ?? "",

    partnerId:
      row.partner_id ?? "",

    price:
      Number(row.price ?? 0),

    paymentMethod:
      row.payment_method ??
      "Cash",

    status:
      row.status,

    notes:
      row.notes ?? "",

    actualKilometers:
      row.actual_kilometers !== null &&
      row.actual_kilometers !== undefined
        ? Number(row.actual_kilometers)
        : null,

    driverNote:
      row.driver_note ?? "",

    fuelLiters:
      row.fuel_liters !== null &&
      row.fuel_liters !== undefined
        ? Number(row.fuel_liters)
        : null,

    fuelCost:
      row.fuel_cost !== null &&
      row.fuel_cost !== undefined
        ? Number(row.fuel_cost)
        : null,
  };
}

function mapToDatabase(
  transfer: Partial<Transfer>
) {
  return {
    transfer_number:
      transfer.transferNumber,

    transfer_type:
      transfer.transferType,

    client_name:
      transfer.clientName,

    phone:
      transfer.phone,

    email:
      transfer.email,

    date:
      transfer.date,

    time:
      transfer.time,

    pickup:
      transfer.pickup,

    destination:
      transfer.destination,

    flight:
      transfer.flight,

    adults:
      transfer.adults,

    children:
      transfer.children,

    child_seats:
      transfer.childSeats,

    baby_seats:
      transfer.babySeats,

    booster_seats:
      transfer.boosterSeats,

    driver:
      transfer.driver,

    vehicle:
      transfer.vehicle,

    partner:
      transfer.partner,

    driver_id:
      transfer.driverId,

    vehicle_id:
      transfer.vehicleId,

    partner_id:
      transfer.partnerId,

    price:
      transfer.price,

    payment_method:
      transfer.paymentMethod,

    status:
      transfer.status,

    notes:
      transfer.notes,

    actual_kilometers:
      transfer.actualKilometers,

    driver_note:
      transfer.driverNote,

    fuel_liters:
      transfer.fuelLiters,

    fuel_cost:
      transfer.fuelCost,
  };
}

/*
 * GET ALL TRANSFERS
 */
export async function getTransfers(): Promise<
  Transfer[]
> {
  const { data, error } =
    await supabase
      .from("transfers")
      .select(`
        *,
        drivers:driver_id (
          name,
          phone
        ),
        vehicles:vehicle_id (
          name
        ),
        partners:partner_id (
          name
        )
      `)
      .order("date", {
        ascending: true,
      })
      .order("time", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    mapTransfer
  );
}

/*
 * CREATE TRANSFER
 */
export async function createTransfer(
  transfer: Partial<Transfer>
) {
  const payload =
    mapToDatabase(transfer);

  console.log(
    "INSERT PAYLOAD:",
    payload
  );

  const { data, error } =
    await supabase
      .from("transfers")
      .insert(payload)
      .select();

  console.log(
    "INSERT DATA:",
    data
  );

  console.log(
    "INSERT ERROR:",
    error
  );

  if (error) {
    throw error;
  }
}

/*
 * UPDATE TRANSFER
 */
export async function updateTransfer(
  id: string,
  transfer: Partial<Transfer>
) {
  const { error } =
    await supabase
      .from("transfers")
      .update(
        mapToDatabase(transfer)
      )
      .eq("id", id);

  if (error) {
    throw error;
  }
}

/*
 * DELETE TRANSFER
 */
export async function deleteTransfer(
  id: string
) {
  const { error } =
    await supabase
      .from("transfers")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}

/*
 * ASSIGN DRIVER
 */
export async function assignDriver(
  transferId: string,
  driverId: string
) {
  const { data, error } =
    await supabase
      .from("transfers")
      .update({
        driver_id: driverId,
        status: "Assigned",
      })
      .eq("id", transferId)
      .select();

  console.log(
    "DRIVER ASSIGN DATA:",
    data
  );

  console.log(
    "DRIVER ASSIGN ERROR:",
    error
  );

  if (error) {
    throw error;
  }
}

/*
 * ASSIGN VEHICLE
 */
export async function assignVehicle(
  transferId: string,
  vehicleId: string
) {
  const { data, error } =
    await supabase
      .from("transfers")
      .update({
        vehicle_id: vehicleId,
      })
      .eq("id", transferId)
      .select();

  console.log(
    "VEHICLE DATA:",
    data
  );

  console.log(
    "VEHICLE ERROR:",
    error
  );

  if (error) {
    throw error;
  }
}

/*
 * UPDATE STATUS
 */
export async function updateTransferStatus(
  id: string,
  status: Transfer["status"]
) {
  const { error } =
    await supabase
      .from("transfers")
      .update({
        status,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

/*
 * COMPLETE TRANSFER
 *
 * Also writes the driver's final KM and
 * fuel information into the assigned vehicle.
 */
export async function completeTransfer(
  id: string,
  actualKilometers: number | null,
  driverNote: string,
  fuelLiters: number | null,
  fuelCost: number | null
) {
  /*
   * First get the transfer so we know which
   * vehicle was actually assigned.
   */
  const {
    data: transfer,
    error: transferError,
  } = await supabase
    .from("transfers")
    .select(`
      id,
      date,
      vehicle_id,
      vehicle,
      actual_kilometers,
      fuel_liters,
      fuel_cost
    `)
    .eq("id", id)
    .single();

  if (transferError) {
    throw transferError;
  }

  if (!transfer) {
    throw new Error(
      "Transfer not found."
    );
  }

  /*
   * Vehicle is required when the driver
   * provides vehicle-related information.
   */
  if (
    (actualKilometers !== null ||
      fuelLiters !== null) &&
    !transfer.vehicle_id
  ) {
    throw new Error(
      "This transfer has no vehicle assigned. Please assign a vehicle before completing the transfer."
    );
  }

  /*
   * Save KM into vehicle history.
   */
  if (
    actualKilometers !== null &&
    transfer.vehicle_id
  ) {
    await createVehicleKilometer(
      transfer.vehicle_id,
      transfer.date,
      actualKilometers,
      driverNote
    );
  }

  /*
   * Save fuel into vehicle history.
   *
   * The vehicle fuel system expects:
   * liters
   * price per liter
   * total cost
   * kilometers
   * station
   * note
   */
  if (
    fuelLiters !== null &&
    fuelLiters > 0 &&
    transfer.vehicle_id
  ) {
    const totalCost =
      fuelCost !== null
        ? Number(fuelCost.toFixed(2))
        : 0;

    const pricePerLiter =
      totalCost > 0
        ? Number(
            (
              totalCost /
              fuelLiters
            ).toFixed(3)
          )
        : 0;

    await createVehicleFuel(
      transfer.vehicle_id,
      transfer.date,
      fuelLiters,
      pricePerLiter,
      totalCost,
      actualKilometers,
      "",
      driverNote
    );
  }

  /*
   * Finally mark the transfer completed.
   */
  const { error } =
    await supabase
      .from("transfers")
      .update({
        status: "Completed",

        actual_kilometers:
          actualKilometers,

        driver_note:
          driverNote,

        fuel_liters:
          fuelLiters,

        fuel_cost:
          fuelCost,
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}

/*
 * GET DRIVER TRANSFERS
 */
export async function getDriverTransfers(
  driverId: string,
  date: string
): Promise<Transfer[]> {
  const { data, error } =
    await supabase
      .from("transfers")
      .select(`
        *,
        drivers:driver_id (
          name,
          phone
        ),
        vehicles:vehicle_id (
          name
        ),
        partners:partner_id (
          name
        )
      `)
      .eq(
        "driver_id",
        driverId
      )
      .eq(
        "date",
        date
      )
      .in("status", [
        "Confirmed",
        "Assigned",
        "In Progress",
      ])
      .order("time", {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    mapTransfer
  );
}