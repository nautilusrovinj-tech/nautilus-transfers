import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";
import { Transfer } from "@/types/transfer";

import {
  isDriverAvailable,
  isVehicleAvailable,
} from "./availability";

export function getAvailableDrivers(
  transfers: Transfer[],
  transfer: Transfer,
  drivers: Driver[]
) {
  return drivers.filter(
    (driver) =>
      driver.active &&
      isDriverAvailable(
        transfers,
        transfer,
        driver.id
      )
  );
}

export function getAvailableVehicles(
  transfers: Transfer[],
  transfer: Transfer,
  vehicles: Vehicle[]
) {
  return vehicles.filter(
    (vehicle) =>
      vehicle.active &&
      isVehicleAvailable(
        transfers,
        transfer,
        vehicle.id
      )
  );
}