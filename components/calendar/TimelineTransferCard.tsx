"use client";

import { Transfer } from "@/types/transfer";
import { useLookups } from "@/hooks/useLookups";

interface Props {
  transfer: Transfer;
}

export default function TimelineTransferCard({
  transfer,
}: Props) {
  const {
    getDriverName,
    getVehicleName,
  } = useLookups();

  const statusColor = {
    New: "border-slate-300 bg-slate-50",
    Confirmed: "border-blue-300 bg-blue-50",
    Assigned: "border-purple-300 bg-purple-50",
    Completed: "border-green-300 bg-green-50",
    Cancelled: "border-red-300 bg-red-50",
  };

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm transition hover:shadow ${statusColor[transfer.status]}`}
    >
      <div className="flex items-center justify-between">

        <div className="text-lg font-bold">
          {transfer.time}
        </div>

        <div className="text-xs font-medium">
          {transfer.status}
        </div>

      </div>

      <div className="mt-3 font-semibold">
        {transfer.clientName}
      </div>

      <div className="mt-2 text-sm text-slate-600">
        {transfer.pickup}
      </div>

      <div className="text-center text-slate-400">
        ↓
      </div>

      <div className="text-sm text-slate-600">
        {transfer.destination}
      </div>

      <div className="mt-4 border-t pt-3 text-sm">

        <div>
          Driver:{" "}
          {getDriverName(
            transfer.driverId
          )}
        </div>

        <div>
          Vehicle:{" "}
          {getVehicleName(
            transfer.vehicleId
          )}
        </div>

        <div className="mt-2 font-semibold">
          €{transfer.price.toFixed(2)}
        </div>

      </div>

    </div>
  );
}