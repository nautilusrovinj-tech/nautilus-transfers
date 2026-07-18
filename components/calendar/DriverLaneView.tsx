"use client";

import { useLookups } from "@/hooks/useLookups";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function DriverLaneView({
  transfers,
}: Props) {
  const { getDriverName } = useLookups();

  const grouped = transfers.reduce(
    (acc, transfer) => {
      const driver =
        getDriverName(transfer.driverId);

      if (!acc[driver]) {
        acc[driver] = [];
      }

      acc[driver].push(transfer);

      return acc;
    },
    {} as Record<string, Transfer[]>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Driver Lanes
        </h2>
      </div>

      <div className="space-y-4 p-6">

        {Object.entries(grouped).map(
          ([driver, items]) => (

            <div
              key={driver}
              className="rounded-lg border border-slate-200"
            >

              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold">
                {driver}
              </div>

              <div className="flex gap-3 overflow-x-auto p-4">

                {items
                  .sort((a, b) =>
                    a.time.localeCompare(b.time)
                  )
                  .map((transfer) => (

                    <div
                      key={transfer.id}
                      className="min-w-[220px] rounded-lg border border-slate-200 bg-white p-4"
                    >

                      <div className="font-bold">
                        {transfer.time}
                      </div>

                      <div className="mt-2">
                        {transfer.clientName}
                      </div>

                      <div className="mt-2 text-sm text-slate-500">
                        {transfer.pickup}
                      </div>

                      <div className="text-center text-slate-400">
                        →
                      </div>

                      <div className="text-sm text-slate-500">
                        {transfer.destination}
                      </div>

                    </div>

                  ))}

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}