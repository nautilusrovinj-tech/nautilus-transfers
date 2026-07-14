import { Transfer } from "@/types/transfer";

export function mapTransfer(row: any): Transfer {
  return {
    id: row.id,

    transferNumber: row.transfer_number,

    clientName: row.client_name,
    phone: row.phone ?? "",
    email: row.email ?? "",

    date: row.date,
    time: row.time,

    pickup: row.pickup,
    destination: row.destination,
    flight: row.flight ?? "",

    adults: row.adults,
    children: row.children,
    babySeats: row.baby_seats ?? 0,
    boosterSeats: row.booster_seats ?? 0,

    driver: row.driver ?? "",
    vehicle: row.vehicle ?? "",
    partner: row.partner ?? "",

    price: Number(row.price),

    status: row.status,

    notes: row.notes ?? "",
  };
}