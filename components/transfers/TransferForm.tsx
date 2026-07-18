"use client";

import { useEffect, useState } from "react";

import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";
import { Partner } from "@/types/partner";
import { Transfer } from "@/types/transfer";

import { getDrivers } from "@/services/drivers";
import { getVehicles } from "@/services/vehicles";
import { getPartners } from "@/services/partners";

import { useTransfers } from "@/hooks/useTransfers";

import TransferDetails from "./TransferDetails";
import RouteSection from "./RouteSection";
import ClientSection from "./ClientSection";
import PassengerSection from "./PassengerSection";
import AssignmentSection from "./AssignmentSection";
import PricingSection from "./PricingSection";
import NotesSection from "./NotesSection";

interface Props {
  transfer: Transfer;
  setTransfer: React.Dispatch<
    React.SetStateAction<Transfer>
  >;
}

export default function TransferForm({
  transfer,
  setTransfer,
}: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const { transfers } = useTransfers();

  useEffect(() => {
    async function load() {
      const [
        driversData,
        vehiclesData,
        partnersData,
      ] = await Promise.all([
        getDrivers(),
        getVehicles(),
        getPartners(),
      ]);

      setDrivers(driversData);
      setVehicles(vehiclesData);
      setPartners(partnersData);
    }

    load();
  }, []);

  function updateField<K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) {
    setTransfer((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="space-y-6">

        <TransferDetails
          transfer={transfer}
          updateField={updateField}
        />

        <RouteSection
          transfer={transfer}
          updateField={updateField}
        />

        <ClientSection
          transfer={transfer}
          updateField={updateField}
        />

        <PassengerSection
          transfer={transfer}
          updateField={updateField}
        />

      </div>

      <div className="space-y-6">

        <AssignmentSection
          transfer={transfer}
          transfers={transfers}
          drivers={drivers}
          vehicles={vehicles}
          partners={partners}
          updateField={updateField}
        />

        <PricingSection
          transfer={transfer}
          updateField={updateField}
        />

        <NotesSection
          transfer={transfer}
          updateField={updateField}
        />

      </div>

    </div>
  );
}