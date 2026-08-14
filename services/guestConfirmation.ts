import { Transfer } from "@/types/transfer";

export async function sendGuestWhatsAppConfirmation(
  transfer: Transfer
) {
  const response = await fetch(
    "/api/guest-confirmation/whatsapp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transferId: transfer.id,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ||
        "Failed to send guest WhatsApp confirmation"
    );
  }

  return data;
}