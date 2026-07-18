"use client";

import { Transfer } from "@/types/transfer";
import TimelineTransferCard from "./TimelineTransferCard";

interface Props {
  transfers: Transfer[];
}

export default function CalendarTimeline({
  transfers,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold">
          Transfer Timeline
        </h2>
      </div>

      {transfers.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          No transfers scheduled.
        </div>
      ) : (
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">

          {transfers.map((transfer) => (
            <TimelineTransferCard
              key={transfer.id}
              transfer={transfer}
            />
          ))}

        </div>
      )}

    </div>
  );
}