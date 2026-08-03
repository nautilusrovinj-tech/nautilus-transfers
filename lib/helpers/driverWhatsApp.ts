import { Transfer } from "@/types/transfer";

export function driverWhatsAppMessage(
  transfer: Transfer
) {
  return `🚖 *NAUTILUS TRANSFERS*

You have an upcoming transfer.

📅 Date:
${transfer.date}

🕒 Time:
${transfer.time.substring(0,5)}

👤 Client:
${transfer.clientName}

📍 Pickup:
${transfer.pickup}

🏁 Destination:
${transfer.destination}

✈️ Flight:
${transfer.flight || "-"}

👥 Passengers:
${transfer.adults} Adult(s)
${transfer.children > 0 ? `${transfer.children} Child(ren)` : ""}

🍼 Baby Seats:
${transfer.babySeats}

🪑 Booster Seats:
${transfer.boosterSeats}

🚐 Vehicle:
${transfer.vehicle || "-"}

📝 Notes:
${transfer.notes || "-"}

Driver App

https://YOURDOMAIN.com/driver`;
}