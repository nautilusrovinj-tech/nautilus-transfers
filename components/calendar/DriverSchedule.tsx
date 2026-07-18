"use client";

import { useLookups } from "@/hooks/useLookups";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function DriverSchedule({
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
          Driver Schedule
        </h2>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No drivers assigned.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">

          {Object.entries(grouped).map(
            ([driver, items]) => (

              <div
                key={driver}
                className="p-6"
              >

                <h3 className="mb-4 text-lg font-semibold">
                  {driver}
                </h3>

                <div className="space-y-2">

                  {items
                    .sort((a, b) =>
                      a.time.localeCompare(b.time)
                    )
                    .map((transfer) => (

                      <div
                        key={transfer.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                      >

                        <div className="font-semibold">
                          {transfer.time}
                        </div>

                        <div className="flex-1 px-6">
                          {transfer.clientName}
                        </div>

                        <div className="flex-1">
                          {transfer.pickup} →{" "}
                          {transfer.destination}
                        </div>

                        <div className="font-medium">
                          €{transfer.price.toFixed(2)}
                        </div>

                      </div>

                    ))}

                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}