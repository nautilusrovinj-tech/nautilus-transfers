export type TransferStatus =
  | "New"
  | "Confirmed"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type TransferType =
  | "Arrival"
  | "Departure"
  | "Tour"
  | "Local";

export type PaymentMethod =
  | "Cash"
  | "Invoice";

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

  // Child seat types
  childSeats: number;
  babySeats: number;
  boosterSeats: number;

  // Legacy fields (temporary during migration)
  driver: string;
  vehicle: string;
  partner: string;

  // Relational fields
  driverId: string;
  vehicleId: string;
  partnerId: string;

  price: number;

  paymentMethod: PaymentMethod;

  status: TransferStatus;

  notes: string;
}