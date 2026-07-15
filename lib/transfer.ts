import { Transfer } from "@/types/transfer";

let sequence = 1;

export function generateTransferNumber() {
  const year = new Date().getFullYear();

  return `NT-${year}-${String(sequence++).padStart(6, "0")}`;
}

export function createEmptyTransfer(): Transfer {
  return {
    id: crypto.randomUUID(),

    transferNumber: generateTransferNumber(),

    clientName: "",
    phone: "",
    email: "",

    date: "",
    time: "",

    pickup: "",
    destination: "",
    flight: "",

    adults: 1,
    children: 0,
    babySeats: 0,
    boosterSeats: 0,

    // Legacy fields (kept during migration)
    driver: "",
    vehicle: "",
    partner: "",

    // New relational fields
    driverId: "",
    vehicleId: "",
    partnerId: "",

    price: 0,

    status: "New",

    notes: "",

    // Keep this if your project already uses it
    transferType: "Arrival",
  };
}