import { Vehicle } from "@/types/vehicle";

export function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    name: row.name,
    registration: row.registration,
    seats: row.seats,
    active: row.active,
  };
}