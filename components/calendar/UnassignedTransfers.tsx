"use client";

import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function UnassignedTransfers({
  transfers,
}: Props) {
  const unassigned = transfers.filter(
    (t) => !t.driverId
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Unassigned Transfers
        </h2>
      </div>

      {unassigned.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          All transfers have drivers assigned.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">

          {unassigned.map((transfer) => (

            <div
              key={transfer.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
            >

              <div className="w-24 font-semibold">
                {transfer.time}
              </div>

              <div className="flex-1">
                {transfer.clientName}
              </div>

              <div className="flex-1">
                {transfer.pickup} → {transfer.destination}
              </div>

              <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Unassigned
              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}