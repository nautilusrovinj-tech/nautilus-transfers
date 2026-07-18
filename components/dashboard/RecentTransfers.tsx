"use client";

import Link from "next/link";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function RecentTransfers({
  transfers,
}: Props) {
  const recent = [...transfers]
    .sort((a, b) =>
      `${b.date}${b.time}`.localeCompare(
        `${a.date}${a.time}`
      )
    )
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

        <h2 className="text-lg font-semibold">
          Recent Transfers
        </h2>

        <Link
          href="/transfers"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>

      </div>

      {recent.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No transfers found.
        </div>
      ) : (
        <table className="min-w-full">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                #
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>
            </tr>
          </thead>

          <tbody>

            {recent.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-t border-slate-100"
              >
                <td className="px-6 py-4 font-medium">
                  {transfer.transferNumber}
                </td>

                <td className="px-6 py-4">
                  {transfer.clientName}
                </td>

                <td className="px-6 py-4">
                  {transfer.date} {transfer.time}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  €{transfer.price.toFixed(2)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}