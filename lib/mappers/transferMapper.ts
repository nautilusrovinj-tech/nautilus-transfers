import { Transfer } from "@/types/transfer";

export function mapTransfer(row: any): Transfer {
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

    // Legacy fields
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

    // Relational fields
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

    // Guest WhatsApp confirmation
    guestWhatsappSent:
      row.guest_whatsapp_sent ??
      false,

    guestWhatsappSentAt:
      row.guest_whatsapp_sent_at ??
      null,

    // Guest email confirmation
    guestEmailSent:
      row.guest_email_sent ??
      false,

    guestEmailSentAt:
      row.guest_email_sent_at ??
      null,

    // Driver completion information
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