"use client";

import Card from "@/components/ui/Card";

import { Transfer } from "@/types/transfer";
import { calculateDashboardStats } from "@/lib/reports/dashboardStats";

interface Props {
  transfers: Transfer[];
}

export default function OperationsOverview({
  transfers,
}: Props) {
  const stats =
    calculateDashboardStats(transfers);

  const cards = [
    {
      title: "Transfers",
      value: stats.totalTransfers,
    },
    {
      title: "Pending",
      value: stats.pendingTransfers,
    },
    {
      title: "Completed",
      value: stats.completedTransfers,
    },
    {
      title: "Cancelled",
      value: stats.cancelledTransfers,
    },
    {
      title: "Revenue",
      value: `€${stats.totalRevenue.toFixed(2)}`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {cards.map((card) => (
        <Card
          key={card.title}
          className="h-full"
        >
          <div className="space-y-2">

            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {card.title}
            </p>

            <h2 className="text-4xl font-bold text-slate-900">
              {card.value}
            </h2>

          </div>
        </Card>
      ))}

    </div>
  );
}