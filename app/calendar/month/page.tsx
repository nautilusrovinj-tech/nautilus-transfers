"use client";

import { useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import MonthlyCalendar from "@/components/calendar/MonthlyCalendar";

import { useTransfers } from "@/hooks/useTransfers";

export default function MonthlyCalendarPage() {
  const { transfers } = useTransfers();

  const today = new Date();

  const [month, setMonth] = useState(
    today.getMonth()
  );

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const monthName = useMemo(() => {
    return new Date(year, month).toLocaleString(
      "default",
      {
        month: "long",
      }
    );
  }, [month, year]);

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const monthTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const date = new Date(t.date);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    });
  }, [transfers, year, month]);

  const totalTransfers = monthTransfers.length;

  const totalRevenue = monthTransfers.reduce(
    (sum, t) => sum + t.price,
    0
  );

  const arrivals = monthTransfers.filter(
    (t) => t.transferType === "Arrival"
  ).length;

  const departures = monthTransfers.filter(
    (t) => t.transferType === "Departure"
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">

      <PageHeader
  title="Operations Planner"
  subtitle="Monthly overview of transfers"
/>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">

          <button
            onClick={previousMonth}
            className="rounded-lg border px-4 py-2 hover:bg-slate-100"
          >
            ← Previous
          </button>

          <h2 className="text-3xl font-bold capitalize">
            {monthName} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="rounded-lg border px-4 py-2 hover:bg-slate-100"
          >
            Next →
          </button>

        </div>

        <div className="grid gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Transfers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalTransfers}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Arrivals
            </p>

            <p className="mt-2 text-3xl font-bold">
              {arrivals}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Departures
            </p>

            <p className="mt-2 text-3xl font-bold">
              {departures}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-slate-500">
              Revenue
            </p>

            <p className="mt-2 text-3xl font-bold">
              €{totalRevenue.toFixed(2)}
            </p>
          </div>

        </div>

        <MonthlyCalendar
          year={year}
          month={month}
          transfers={transfers}
        />

      </div>
    </AppLayout>
  );
}