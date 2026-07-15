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

    adults: row.adults ?? 1,
    children: row.children ?? 0,
    babySeats: row.baby_seats ?? 0,
    boosterSeats: row.booster_seats ?? 0,

    // Legacy fields (temporary)
    driver: row.driver ?? "",
    vehicle: row.vehicle ?? "",
    partner: row.partner ?? "",

    // New relational fields
    driverId: row.driver_id ?? "",
    vehicleId: row.vehicle_id ?? "",
    partnerId: row.partner_id ?? "",

    price: Number(row.price ?? 0),

    status: row.status,

    notes: row.notes ?? "",

    // Temporary default until we migrate transfer type
    transferType: row.transfer_type ?? "Arrival",
  };
}