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
    New: "bg-slate-100 text-slate-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const typeColor = {
    Arrival: "bg-sky-100 text-sky-700",
    Departure: "bg-emerald-100 text-emerald-700",
    Tour: "bg-violet-100 text-violet-700",
    Local: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>
          <div className="text-2xl font-bold">
            {transfer.time}
          </div>

          <div className="mt-1 text-lg font-semibold text-slate-900">
            {transfer.clientName}
          </div>
        </div>

        <div className="text-right space-y-2">

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              statusColor[transfer.status]
            }`}
          >
            {transfer.status}
          </span>

          <br />

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              typeColor[transfer.transferType]
            }`}
          >
            {transfer.transferType}
          </span>

        </div>

      </div>

      {/* Route */}

      <div className="my-5 rounded-xl bg-slate-50 p-4">

        <div className="font-medium">
          {transfer.pickup}
        </div>

        <div className="my-2 border-t border-dashed border-slate-300" />

        <div className="font-medium">
          {transfer.destination}
        </div>

      </div>

      {/* Resources */}

      <div className="flex flex-wrap gap-2">

        {transfer.driverId && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {getDriverName(
              transfer.driverId
            )}
          </span>
        )}

        {transfer.vehicleId && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {getVehicleName(
              transfer.vehicleId
            )}
          </span>
        )}

        {transfer.partner && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {transfer.partner}
          </span>
        )}

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between border-t pt-4">

        <div className="text-sm text-slate-500">
          {transfer.transferNumber}
        </div>

        <div className="text-xl font-bold">
          €{transfer.price.toFixed(2)}
        </div>

      </div>

    </div>
  );
}