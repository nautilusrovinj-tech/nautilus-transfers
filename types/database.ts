export type TransferStatus =
  | "New"
  | "Confirmed"
  | "Assigned"
  | "On Route"
  | "Completed"
  | "Cancelled";

export interface Transfer {
  id: string;

  transfer_date: string;
  pickup_time: string | null;

  customer_name: string;
  passengers: number;

  pickup_location: string;
 dropoff_location: string;

  flight_number: string | null;

  price: number | null;

  driver_id: string | null;
  vehicle_id: string | null;
  partner_id: string | null;

  notes: string | null;

  status: TransferStatus;

  created_at: string;
}