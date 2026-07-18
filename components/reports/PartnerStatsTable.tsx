"use client";

import { Transfer } from "@/types/transfer";
import { calculatePartnerStats } from "@/lib/reports/partnerStats";
import { useLookups } from "@/hooks/useLookups";

interface Props {
  transfers: Transfer[];
}

export default function PartnerStatsTable({
  transfers,
}: Props) {
  const { getPartnerName } = useLookups();

  const stats =
    calculatePartnerStats(transfers);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Partner Performance
        </h2>
      </div>

      {stats.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No partner data.
        </div>
      ) : (
        <table className="min-w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Partner
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

            {stats.map((partner) => (
              <tr
                key={partner.partnerId}
                className="border-t border-slate-100"
              >
                <td className="px-6 py-4">
                  {getPartnerName(
                    partner.partnerId
                  )}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {partner.transfers}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  €
                  {partner.revenue.toFixed(2)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}