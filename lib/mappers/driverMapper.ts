import { Driver } from "@/types/driver";

export function mapDriver(row: any): Driver {
  return {
    id: row.id,

    name: row.name,

    phone: row.phone ?? "",

    email: row.email ?? "",

    languages: row.languages ?? "",

    role: row.role ?? "driver",

    active: row.active ?? true,

    baseLocation: row.base_location ?? row.baseLocation ?? "",

    maxPassengers:
      row.max_passengers ??
      row.maxPassengers ??
      4,

    vehicleId:
      row.vehicle_id ??
      row.vehicleId ??
      "",

    priority: row.priority ?? 1,
  };
}