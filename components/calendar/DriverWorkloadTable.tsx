"use client";

import { calculateDriverWorkload } from "@/lib/dispatch/workload";
import { useLookups } from "@/hooks/useLookups";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function DriverWorkloadTable({
  transfers,
}: Props) {
  const { getDriverName } = useLookups();

  const workload =
    calculateDriverWorkload(transfers);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Driver Workload
        </h2>
      </div>

      {workload.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No assigned drivers.
        </div>
      ) : (
        <table className="min-w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Driver
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Transfers
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody>

            {workload.map((item) => (
              <tr
                key={item.driverId}
                className="border-t border-slate-100"
              >
                <td className="px-6 py-4">
                  {getDriverName(item.driverId)}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {item.transfers}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  €
                  {item.revenue.toFixed(2)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}