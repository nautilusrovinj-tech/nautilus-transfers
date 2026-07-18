import { Vehicle } from "@/types/vehicle";

export function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? "",
    model: row.model ?? "",
    plate: row.plate ?? row.registration ?? "",
    seats: row.seats ?? 0,
    active: row.active ?? true,
  };
}