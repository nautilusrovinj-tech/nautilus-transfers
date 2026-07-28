import { ExcelTransferRow } from "./excelReader";
import { Transfer } from "../types/transfer";

function normalizeDate(value: string): string {
  const raw = String(value).trim();

  // Excel serial date
  if (/^\d+$/.test(raw)) {
    const serial = Number(raw);

    const utcDays = serial - 25569;
    const utcValue = utcDays * 86400;

    const date = new Date(utcValue * 1000);

    return date.toISOString().split("T")[0];
  }

  // Croatian date (21.7. or 21.07.)
  const match = raw.match(/^(\d{1,2})\.(\d{1,2})\.?$/);

  if (match) {
    const [, day, month] = match;

    return `2026-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // ISO date
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  throw new Error(`Invalid date: ${raw}`);
}

function normalizeTime(value: string): string {
  const raw = String(value).trim();

  if (!raw) return "00:00";

  // Excel fractional time (0.75 = 18:00)
  const numeric = Number(raw.replace(",", "."));

  if (
    !isNaN(numeric) &&
    numeric >= 0 &&
    numeric < 1
  ) {
    const totalMinutes = Math.round(
      numeric * 24 * 60
    );

    const hours = Math.floor(
      totalMinutes / 60
    );

    const minutes =
      totalMinutes % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  // Formats:
  // 18,00
  // 20.05
  // 18:30
  const clean = raw
    .replace(",", ":")
    .replace(".", ":");

  const parts = clean.split(":");

  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    ) {
      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }
  }

  throw new Error(`Invalid time: ${raw}`);
}

function normalizePrice(value: string): number {
  const raw = String(value).trim();

  if (!raw) return 0;

  return (
    Number(
      raw
        .replace("€", "")
        .replace(",", ".")
        .trim()
    ) || 0
  );
}

function detectType(
  pickup: string,
  destination: string
): Transfer["transferType"] {
  const from = pickup.toLowerCase();
  const to = destination.toLowerCase();

  const airportWords = [
    "airport",
    "apt",
    "zračna",
    "aerodrom",
    "pula",
    "trst",
    "trieste",
    "venezia",
    "venice",
  ];

  const fromAirport = airportWords.some((w) =>
    from.includes(w)
  );

  const toAirport = airportWords.some((w) =>
    to.includes(w)
  );

  if (fromAirport && !toAirport) return "Arrival";

  if (!fromAirport && toAirport) return "Departure";

  return "Local";
}

export function mapTransfer(
  row: ExcelTransferRow,
  index: number
): Transfer {
  return {
    id: crypto.randomUUID(),

    transferNumber: `TR-${String(index + 1).padStart(6, "0")}`,

    transferType: detectType(
      row.pickup,
      row.destination
    ),

    clientName: row.client,

    phone: "",
    email: "",

    date: normalizeDate(row.date),

    time: normalizeTime(row.time),

    pickup: row.pickup,

    destination: row.destination,

    flight: row.flight,

    adults: 0,
    children: 0,
    babySeats: 0,
    boosterSeats: 0,

    driver: row.driver,
    vehicle: row.vehicle,
    partner: row.partner,

    driverId: "",
    vehicleId: "",
    partnerId: "",

    price: normalizePrice(row.price),

    status: "New",

    notes: "",
  };
}