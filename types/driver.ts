export type DriverRole =
  | "admin"
  | "driver";

export interface Driver {
  id: string;

  name: string;

  phone: string;

  email: string;

  languages: string;

  role: DriverRole;

  active: boolean;

  // New fields
  baseLocation: string;

  maxPassengers: number;

  vehicleId: string;

  priority: number;
}