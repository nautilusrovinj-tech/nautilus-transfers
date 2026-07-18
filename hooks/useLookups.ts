import { useEffect, useState } from "react";

import { getDrivers } from "@/services/drivers";
import { getVehicles } from "@/services/vehicles";
import { getPartners } from "@/services/partners";

export function useLookups() {
  const [driverMap, setDriverMap] = useState<Record<string, string>>({});
  const [driverPhoneMap, setDriverPhoneMap] = useState<Record<string, string>>({});
  const [vehicleMap, setVehicleMap] = useState<Record<string, string>>({});
  const [partnerMap, setPartnerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const [drivers, vehicles, partners] =
          await Promise.all([
            getDrivers(),
            getVehicles(),
            getPartners(),
          ]);

        setDriverMap(
          Object.fromEntries(
            drivers.map((d) => [d.id, d.name])
          )
        );

        setDriverPhoneMap(
          Object.fromEntries(
            drivers.map((d) => [
              d.id,
              d.phone ?? "",
            ])
          )
        );

        setVehicleMap(
          Object.fromEntries(
            vehicles.map((v) => [v.id, v.name])
          )
        );

        setPartnerMap(
          Object.fromEntries(
            partners.map((p) => [p.id, p.name])
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return {
    driverMap,
    driverPhoneMap,
    vehicleMap,
    partnerMap,

    getDriverName: (id?: string) =>
      id
        ? driverMap[id] ?? "Not Assigned"
        : "Not Assigned",

    getDriverPhone: (id?: string) =>
      id
        ? driverPhoneMap[id] ?? ""
        : "",

    getVehicleName: (id?: string) =>
      id
        ? vehicleMap[id] ?? "Not Assigned"
        : "Not Assigned",

    getPartnerName: (id?: string) =>
      id
        ? partnerMap[id] ?? "Direct"
        : "Direct",
  };
}