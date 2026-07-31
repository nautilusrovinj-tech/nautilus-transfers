import { normalizeBooking } from "./normalizeBooking";

export interface ExtractedBooking {
  clientName: string;
  phone: string;
  email: string;

  date: string;
  time: string;

  pickup: string;
  destination: string;

  flight: string;
  transferType: string;

  adults: number;
  children: number;
  babySeats: number;
  boosterSeats: number;

  vehicle: string;
  partner: string;

  price: number;

  notes: string;
}

export async function extractBooking(
  bookingText: string
): Promise<ExtractedBooking> {
  const response = await fetch("/api/ai/extract-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: bookingText,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.error ??
        "Failed to extract booking."
    );
  }

  const data: ExtractedBooking =
    await response.json();

  return normalizeBooking(data);
}