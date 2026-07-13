export type TransferStatus =
  | "New"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface Transfer {
  id: string;

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