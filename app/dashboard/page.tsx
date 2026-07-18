"use client";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import OperationsOverview from "@/components/dashboard/OperationsOverview";
import RecentTransfers from "@/components/dashboard/RecentTransfers";

import DispatchStats from "@/components/dispatch/DispatchStats";
import NextPickupCard from "@/components/dispatch/NextPickupCard";
import AttentionPanel from "@/components/dispatch/AttentionPanel";

import { useTransfers } from "@/hooks/useTransfers";

export default function DashboardPage() {
  const { transfers, loading } =
    useTransfers();

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          Loading...
        </div>
      </AppLayout>
    );
  }

  const today =
    new Date().toISOString().split("T")[0];

  const todayTransfers = transfers.filter(
    (t) => t.date === today
  );

  const nextPickup =
    [...todayTransfers].sort((a, b) =>
      a.time.localeCompare(b.time)
    )[0];

  const revenue = todayTransfers.reduce(
    (sum, t) => sum + t.price,
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Dashboard"
          subtitle="Operations overview"
        />

        <OperationsOverview
          transfers={transfers}
        />

        <DispatchStats
          total={todayTransfers.length}
          arrivals={
            todayTransfers.filter(
              (t) =>
                t.transferType === "Arrival"
            ).length
          }
          departures={
            todayTransfers.filter(
              (t) =>
                t.transferType === "Departure"
            ).length
          }
          revenue={revenue}
        />

        <div className="grid gap-6 lg:grid-cols-2">

          <NextPickupCard
            transfer={nextPickup}
            onEdit={() => {}}
          />

          <AttentionPanel
            transfers={todayTransfers}
          />

        </div>

        <RecentTransfers
          transfers={transfers}
        />

      </div>
    </AppLayout>
  );
}