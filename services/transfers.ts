import { createClient } from "@/lib/supabase/client";
import { Transfer } from "@/types/transfer";

const supabase = createClient();

function mapTransfer(row: any): Transfer {
  return {
    id: row.id,

    transferNumber: row.transfer_number,
    transferType: row.transfer_type,

    clientName: row.client_name,
    phone: row.phone ?? "",
    email: row.email ?? "",

    date: row.date,
    time: row.time,

    pickup: row.pickup,
    destination: row.destination,
    flight: row.flight ?? "",

    adults: row.adults ?? 0,
    children: row.children ?? 0,
    babySeats: row.baby_seats ?? 0,
    boosterSeats: row.booster_seats ?? 0,

    // Legacy fields (now populated from relations if available)
    driver: row.driver ?? "",
    vehicle: row.vehicles?.name ?? row.vehicle ?? "",
    partner: row.partners?.name ?? row.partner ?? "",

    // Relational fields
    driverId: row.driver_id ?? "",
    vehicleId: row.vehicle_id ?? "",
    partnerId: row.partner_id ?? "",

    price: Number(row.price ?? 0),

    status: row.status,

    notes: row.notes ?? "",
  };
}

function mapToDatabase(
  transfer: Partial<Transfer>
) {
  return {
    transfer_number: transfer.transferNumber,
    transfer_type: transfer.transferType,

    client_name: transfer.clientName,
    phone: transfer.phone,
    email: transfer.email,

    date: transfer.date,
    time: transfer.time,

    pickup: transfer.pickup,
    destination: transfer.destination,
    flight: transfer.flight,

    adults: transfer.adults,
    children: transfer.children,
    baby_seats: transfer.babySeats,
    booster_seats: transfer.boosterSeats,

    // Legacy fields
    driver: transfer.driver,
    vehicle: transfer.vehicle,
    partner: transfer.partner,

    // Relational fields
    driver_id: transfer.driverId,
    vehicle_id: transfer.vehicleId,
    partner_id: transfer.partnerId,

    price: transfer.price,

    status: transfer.status,

    notes: transfer.notes,
  };
}

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}

export async function createTransfer(
  transfer: Partial<Transfer>
) {
  const payload = mapToDatabase(transfer);

  console.log("INSERT PAYLOAD:", payload);

  const { data, error } = await supabase
    .from("transfers")
    .insert(payload)
    .select();

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);

  if (error) throw error;
}

export async function updateTransfer(
  id: string,
  transfer: Partial<Transfer>
) {
  const { error } = await supabase
    .from("transfers")
    .update(mapToDatabase(transfer))
    .eq("id", id);

  if (error) throw error;
}

export async function deleteTransfer(
  id: string
) {
  const { error } = await supabase
    .from("transfers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function assignDriver(
  transferId: string,
  driverId: string
) {
  console.log("Assigning:", transferId, driverId);

  const { data, error } = await supabase
    .from("transfers")
    .update({
      driver_id: driverId,
      status: "Assigned",
    })
    .eq("id", transferId)
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw error;
}

export async function assignVehicle(
  transferId: string,
  vehicleId: string
) {
  const { data, error } = await supabase
    .from("transfers")
    .update({
      vehicle_id: vehicleId,
    })
    .eq("id", transferId)
    .select();

  console.log("VEHICLE DATA:", data);
  console.log("VEHICLE ERROR:", error);

  if (error) throw error;
}

export async function updateTransferStatus(
  id: string,
  status: Transfer["status"]
) {
  const { error } = await supabase
    .from("transfers")
    .update({
      status,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getDriverTransfers(
  driverId: string,
  date: string
): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select(`
      *,
      vehicles:vehicle_id (
        name
      ),
      partners:partner_id (
        name
      )
    `)
    .eq("driver_id", driverId)
    .eq("date", date)
    .in("status", [
      "Confirmed",
      "Assigned",
      "In Progress",
    ])
    .order("time", {
      ascending: true,
    });

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}