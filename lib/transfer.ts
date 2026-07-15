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

    transferType: "Arrival",

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

    driver: "",
    vehicle: "",
    partner: "",

    price: 0,

    status: "New",

    notes: "",
  };
}