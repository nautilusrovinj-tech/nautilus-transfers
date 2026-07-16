import { createClient } from "@/lib/supabase/client";
import { Transfer } from "@/types/transfer";

const supabase = createClient();

function mapTransfer(row: any): Transfer {
  return {
    id: row.id,

    transferNumber: row.transfer_number,
    transferType: row.transfer_type,

    clientName: row.client_name,
    phone: row.phone,
    email: row.email,

    date: row.date,
    time: row.time,

    pickup: row.pickup,
    destination: row.destination,
    flight: row.flight,

    adults: row.adults,
    children: row.children,
    babySeats: row.baby_seats,
    boosterSeats: row.booster_seats,

    driver: row.driver,
    vehicle: row.vehicle,
    partner: row.partner,

    driverId: row.driver_id,
    vehicleId: row.vehicle_id,
    partnerId: row.partner_id,

    price: row.price,

    status: row.status,

    notes: row.notes,
  };
}

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}