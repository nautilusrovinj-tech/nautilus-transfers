import { Vehicle } from "@/types/vehicle";

export function createEmptyVehicle(): Vehicle {
  return {
    id: crypto.randomUUID(),
    name: "",
    registration: "",
    seats: 4,
    active: true,
  };
}