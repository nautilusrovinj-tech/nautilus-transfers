import { Vehicle } from "@/types/vehicle";

export function createEmptyVehicle(): Vehicle {
  return {
    id: crypto.randomUUID(),
    name: "",
    brand: "",
    model: "",
    plate: "",
    seats: 4,
    active: true,
  };
}