import { Driver } from "@/types/driver";

export function createEmptyDriver(): Driver {
  return {
    id: crypto.randomUUID(),

    name: "",

    phone: "",

    email: "",

    languages: "",

    role: "driver",

    active: true,

    baseLocation: "",

    maxPassengers: 4,

    vehicleId: "",

    priority: 1,
  };
}