import { Transfer } from "@/types/transfer";

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function driverWhatsAppUrl(
  transfer: Transfer,
  driverPhone: string
) {
  const message = `🚗 TRANSFER ASSIGNMENT

Client: ${transfer.clientName}

Flight: ${transfer.flight || "-"}

Date: ${transfer.date}
Time: ${transfer.time}

Pickup:
${transfer.pickup}

Destination:
${transfer.destination}

Passengers:
${transfer.adults} Adult(s)${
    transfer.children > 0
      ? `\n${transfer.children} Child(ren)`
      : ""
  }

Partner:
${transfer.partner}

Price:
€${transfer.price}`;

  return `https://wa.me/${cleanPhone(
    driverPhone
  )}?text=${encodeURIComponent(message)}`;
}

export function guestWhatsAppUrl(
  transfer: Transfer
) {
  const message = `Dear ${transfer.clientName},

Your transfer has been confirmed.

Driver:
${transfer.driver}

Vehicle:
${transfer.vehicle}

Pickup:
${transfer.pickup}

Destination:
${transfer.destination}

Date:
${transfer.date}

Time:
${transfer.time}

Thank you for choosing Nautilus Transfers.`;

  return `https://wa.me/${cleanPhone(
    transfer.phone
  )}?text=${encodeURIComponent(message)}`;
}