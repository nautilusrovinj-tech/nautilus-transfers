"use client";

import { calculateRevenue } from "@/lib/dispatch/revenue";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function RevenueSummaryCard({
  transfers,
}: Props) {
  const revenue =
    calculateRevenue(transfers);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">

      <h2 className="text-lg font-semibold">
        Revenue Summary
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Total Revenue
          </div>

          <div className="mt-1 text-2xl font-bold">
            €{revenue.total.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <div className="text-sm text-green-700">
            Completed
          </div>

          <div className="mt-1 text-2xl font-bold text-green-700">
            €{revenue.completed.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <div className="text-sm text-blue-700">
            Pending
          </div>

          <div className="mt-1 text-2xl font-bold text-blue-700">
            €{revenue.pending.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg bg-red-50 p-4">
          <div className="text-sm text-red-700">
            Cancelled
          </div>

          <div className="mt-1 text-2xl font-bold text-red-700">
            €{revenue.cancelled.toFixed(2)}
          </div>
        </div>

      </div>

    </div>
  );
}