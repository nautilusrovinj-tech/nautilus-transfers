export type TransferStatus =
  | "New"
  | "Confirmed"
  | "Assigned"
  | "Completed"
  | "Cancelled";

export type TransferType =
  | "Arrival"
  | "Departure"
  | "Tour"
  | "Local";

export interface Transfer {
  id: string;

  transferNumber: string;

  transferType: TransferType;

  clientName: string;
  phone: string;
  email: string;

  date: string;
  time: string;

  pickup: string;
  destination: string;
  flight: string;

  adults: number;
  children: number;
  babySeats: number;
  boosterSeats: number;

  driver: string;
  vehicle: string;
  partner: string;

  price: number;

  status: TransferStatus;

  notes: string;
}