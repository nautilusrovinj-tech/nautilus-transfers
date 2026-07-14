import { Transfer } from "@/types/transfer";
import { createEmptyTransfer } from "@/lib/transfer";

export const transfers: Transfer[] = [
  {
    ...createEmptyTransfer(),

    transferNumber: "NT-2026-000001",

    clientName: "John Smith",
    phone: "+44 7700 900123",
    email: "john@example.com",

    date: "2026-07-11",
    time: "14:30",

    pickup: "Pula Airport",
    destination: "Grand Park Hotel",
    flight: "FR4587",

    adults: 2,
    children: 0,

    driver: "Ivan",
    vehicle: "Mercedes V-Class",
    partner: "Direct",

    price: 120,

    status: "Confirmed",

    notes: "",
  },
];