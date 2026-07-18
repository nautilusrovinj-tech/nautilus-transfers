"use client";

import { Transfer } from "@/types/transfer";
import { calculateVehicleStats } from "@/lib/reports/vehicleStats";
import { useLookups } from "@/hooks/useLookups";

interface Props {
  transfers: Transfer[];
}

export default function VehicleStatsTable({
  transfers,
}: Props) {
  const { getVehicleName } = useLookups();

  const stats =
    calculateVehicleStats(transfers);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Vehicle Performance
        </h2>
      </div>

      {stats.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No vehicle data.
        </div>
      ) : (
        <table className="min-w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
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

            {stats.map((vehicle) => (
              <tr
                key={vehicle.vehicleId}
                className="border-t border-slate-100"
              >
                <td className="px-6 py-4">
                  {getVehicleName(
                    vehicle.vehicleId
                  )}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {vehicle.transfers}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  €
                  {vehicle.revenue.toFixed(2)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}