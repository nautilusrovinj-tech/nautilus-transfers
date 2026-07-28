"use client";

import DispatchCard from "./DispatchCard";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
  onEdit?: (transfer: Transfer) => void;
  getDriverPhone?: (driverId: string) => string;
  onAssignDriver?: (
    transferId: string,
    driverId: string
  ) => Promise<void>;
  onAssignVehicle?: (
    transferId: string,
    vehicleId: string
  ) => Promise<void>;
}

export default function DispatchBoard({
  transfers,
  onEdit,
  getDriverPhone,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        No transfers found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {transfers.map((transfer) => (
        <DispatchCard
          key={transfer.id}
          transfer={transfer}
          driverPhone={
            getDriverPhone?.(transfer.driverId) ?? ""
          }
          onEdit={onEdit}
          onAssignDriver={onAssignDriver}
          onAssignVehicle={onAssignVehicle}
        />
      ))}
    </div>
  );
}