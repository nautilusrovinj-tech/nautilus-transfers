import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";
import { Transfer } from "@/types/transfer";

import {
  getAvailableDrivers,
  getAvailableVehicles,
} from "./suggestions";

export function autoAssign(
  transfers: Transfer[],
  transfer: Transfer,
  drivers: Driver[],
  vehicles: Vehicle[]
) {
  const availableDrivers =
    getAvailableDrivers(
      transfers,
      transfer,
      drivers
    );

  const availableVehicles =
    getAvailableVehicles(
      transfers,
      transfer,
      vehicles
    );

  return {
    driverId:
      availableDrivers[0]?.id ?? "",

    vehicleId:
      availableVehicles[0]?.id ?? "",
  };
}