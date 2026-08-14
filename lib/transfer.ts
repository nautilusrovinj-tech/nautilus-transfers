import { Transfer } from "@/types/transfer";

export function generateTransferNumber(): string {
  const year = new Date().getFullYear();

  const randomNumber = Math.floor(
    100000 + Math.random() * 900000
  );

  return `NT-${year}-${randomNumber}`;
}

export function createEmptyTransfer(): Transfer {
  return {
    id: crypto.randomUUID(),

    transferNumber:
      generateTransferNumber(),

    transferType: "Arrival",

    clientName: "",
    phone: "",
    email: "",

    date:
      new Date()
        .toISOString()
        .split("T")[0],

    time: "12:00",

    pickup: "",
    destination: "",
    flight: "",

    adults: 1,
    children: 0,

    childSeats: 0,
    babySeats: 0,
    boosterSeats: 0,

    // Legacy fields
    driver: "",
    vehicle: "",
    partner: "",

    // Relational fields
    driverId: "",
    vehicleId: "",
    partnerId: "",

    price: 0,

    paymentMethod: "Cash",

    status: "New",

    notes: "",

    // Guest WhatsApp confirmation
    guestWhatsappSent: false,
    guestWhatsappSentAt: null,

    // Guest email confirmation
    guestEmailSent: false,
    guestEmailSentAt: null,

    // Driver completion information
    actualKilometers: null,
    driverNote: "",

    fuelLiters: null,
    fuelCost: null,
  };
}