import { ExtractedBooking } from "./extractBooking";

export function normalizeBooking(
  booking: ExtractedBooking
): ExtractedBooking {
  return {
    ...booking,

    // Keep flight numbers short and standardized
    flight: normalizeFlight(booking.flight),

    transferType: normalizeTransferType(
      booking.transferType
    ),

    adults: Number(booking.adults ?? 0),

    children: Number(booking.children ?? 0),

    babySeats: Number(booking.babySeats ?? 0),

    boosterSeats: Number(booking.boosterSeats ?? 0),

    price: Number(booking.price ?? 0),
  };
}

function normalizeFlight(flight = "") {
  return flight.replace(/\s+/g, "").toUpperCase();
}

function normalizeTransferType(type = "") {
  const value = type.trim().toLowerCase();

  if (
    value.includes("arrival") ||
    value.includes("pick up") ||
    value.includes("pickup")
  ) {
    return "Arrival";
  }

  if (
    value.includes("departure") ||
    value.includes("drop off") ||
    value.includes("dropoff") ||
    value.includes("drop")
  ) {
    return "Departure";
  }

  if (value.includes("tour")) {
    return "Tour";
  }

  if (
    value.includes("local") ||
    value.includes("transfer")
  ) {
    return "Local";
  }

  return "";
}