"use client";

import AppLayout from "@/components/layout/AppLayout";
import ExportExcelButton from "@/components/reports/ExportExcelButton";
import { useReports } from "@/hooks/useReports";

export default function ReportsPage() {
  const { loading, report } = useReports();

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6">
          Loading reports...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Reports
            </h1>

            <p className="text-slate-500">
              Business overview and analytics
            </p>
          </div>

          <ExportExcelButton />

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Today's Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              €{report.todayRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Today's Transfers
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {report.todayTransfers}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              This Month Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              €{report.monthRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Average Transfer
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              €{report.averageTransfer.toFixed(2)}
            </h2>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}