import { supabase } from "@/lib/supabase";
import { mapTransfer } from "@/lib/mappers/transferMapper";
import { Transfer } from "@/types/transfer";

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}

export async function getTodaysTransfers(): Promise<Transfer[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("date", today)
    .order("time", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}

export async function createTransfer(transfer: Transfer) {
  const { error } = await supabase
    .from("transfers")
    .insert({
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

      driver: transfer.driver,
      vehicle: transfer.vehicle,
      partner: transfer.partner,

      driver_id: transfer.driverId || null,
      vehicle_id: transfer.vehicleId || null,
      partner_id: transfer.partnerId || null,

      price: transfer.price,

      status: transfer.status,

      notes: transfer.notes,
    });

  if (error) throw error;
}

export async function updateTransfer(
  transfer: Transfer
) {
  const { error } = await supabase
    .from("transfers")
    .update({
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

      driver: transfer.driver,
      vehicle: transfer.vehicle,
      partner: transfer.partner,

      driver_id: transfer.driverId || null,
      vehicle_id: transfer.vehicleId || null,
      partner_id: transfer.partnerId || null,

      price: transfer.price,

      status: transfer.status,

      notes: transfer.notes,
    })
    .eq("id", transfer.id);

  if (error) throw error;
}

export async function deleteTransfer(id: string) {
  const { error } = await supabase
    .from("transfers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function assignDriver(
  transferId: string,
  driver: string
) {
  const { error } = await supabase
    .from("transfers")
    .update({
      driver,
      status: "Assigned",
    })
    .eq("id", transferId);

  if (error) throw error;
}

export async function assignVehicle(
  transferId: string,
  vehicle: string
) {
  const { error } = await supabase
    .from("transfers")
    .update({
      vehicle,
    })
    .eq("id", transferId);

  if (error) throw error;
}