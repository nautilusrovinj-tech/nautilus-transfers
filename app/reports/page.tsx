"use client";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import RevenueSummaryCard from "@/components/reports/RevenueSummaryCard";
import PartnerStatsTable from "@/components/reports/PartnerStatsTable";
import MonthlyStatsTable from "@/components/reports/MonthlyStatsTable";
import VehicleStatsTable from "@/components/reports/VehicleStatsTable";

import { useTransfers } from "@/hooks/useTransfers";

export default function ReportsPage() {
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

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Reports"
          subtitle="Business analytics and revenue overview"
        />

        <RevenueSummaryCard
          transfers={transfers}
        />

        <div className="grid gap-6 xl:grid-cols-2">

          <PartnerStatsTable
            transfers={transfers}
          />

          <VehicleStatsTable
            transfers={transfers}
          />

        </div>

        <MonthlyStatsTable
          transfers={transfers}
        />

      </div>
    </AppLayout>
  );
}