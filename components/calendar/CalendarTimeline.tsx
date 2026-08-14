"use client";

import { Transfer } from "@/types/transfer";
import TimelineTransferCard from "./TimelineTransferCard";

interface Props {
  transfers: Transfer[];
  getDriverPhone?: (
    driverId?: string | null
  ) => string;
  onEdit?: (transfer: Transfer) => void;
  onAssignDriver?: (
    transferId: string,
    driverId: string
  ) => Promise<void>;
  onAssignVehicle?: (
    transferId: string,
    vehicleId: string
  ) => Promise<void>;
}

export default function CalendarTimeline({
  transfers,
  getDriverPhone,
  onEdit,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Daily Transfers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {transfers.length} scheduled transfer
            {transfers.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

      </div>

      {transfers.length === 0 ? (
        <div className="flex h-72 items-center justify-center">

          <div className="text-center">

            <h3 className="text-xl font-semibold text-slate-700">
              No Transfers
            </h3>

            <p className="mt-2 text-slate-500">
              Nothing scheduled for this day.
            </p>

          </div>

        </div>
      ) : (
        <div className="grid gap-5 p-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

          {transfers.map(
            (transfer) => (
              <TimelineTransferCard
                key={transfer.id}
                transfer={transfer}
                getDriverPhone={
                  getDriverPhone
                }
                onEdit={onEdit}
                onAssignDriver={
                  onAssignDriver
                }
                onAssignVehicle={
                  onAssignVehicle
                }
              />
            )
          )}

        </div>
      )}

    </section>
  );
}