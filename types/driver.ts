export type DriverRole =
  | "admin"
  | "driver";

export interface Driver {
  id: string;

  name: string;

  phone: string;

  email: string;

  languages: string;

  active: boolean;
}