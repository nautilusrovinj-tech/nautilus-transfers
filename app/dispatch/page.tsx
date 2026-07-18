"use client";

import { useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import DispatchStats from "@/components/dispatch/DispatchStats";
import DispatchTable from "@/components/dispatch/DispatchTable";
import NextPickupCard from "@/components/dispatch/NextPickupCard";
import AttentionPanel from "@/components/dispatch/AttentionPanel";
import DispatchSearch from "@/components/dispatch/DispatchSearch";
import DispatchFilters from "@/components/dispatch/DispatchFilters";
import TransferDialog from "@/components/transfers/TransferDialog";

import { useTransfers } from "@/hooks/useTransfers";
import { useLookups } from "@/hooks/useLookups";

import { Transfer } from "@/types/transfer";

type DayFilter = "today" | "tomorrow" | "all";

export default function DispatchPage() {
  const {
    transfers,
    saveTransfer,
    updateDriver,
    updateVehicle,
  } = useTransfers();

  const {
    getDriverPhone,
    getDriverName,
    getVehicleName,
    getPartnerName,
  } = useLookups();

  const [editingTransfer, setEditingTransfer] =
    useState<Transfer | null>(null);

  const [dayFilter, setDayFilter] =
    useState<DayFilter>("today");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [search, setSearch] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const tomorrow = tomorrowDate
    .toISOString()
    .split("T")[0];

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (
        dayFilter === "today" &&
        t.date !== today
      )
        return false;

      if (
        dayFilter === "tomorrow" &&
        t.date !== tomorrow
      )
        return false;

      if (
        statusFilter !== "All" &&
        t.status !== statusFilter
      )
        return false;

      if (search.trim() !== "") {
        const value = search.toLowerCase();

        const found = [
          t.transferNumber,
          t.clientName,
          t.phone,
          t.flight,
          t.pickup,
          t.destination,
          getDriverName(t.driverId),
          getVehicleName(t.vehicleId),
          getPartnerName(t.partnerId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(value);

        if (!found) return false;
      }

      return true;
    });
  }, [
    transfers,
    dayFilter,
    statusFilter,
    search,
    today,
    tomorrow,
    getDriverName,
    getVehicleName,
    getPartnerName,
  ]);

  const stats = useMemo(() => {
    return {
      total: filteredTransfers.length,

      arrivals: filteredTransfers.filter(
        (t) => t.transferType === "Arrival"
      ).length,

      departures: filteredTransfers.filter(
        (t) => t.transferType === "Departure"
      ).length,

      revenue: filteredTransfers.reduce(
        (sum, t) => sum + t.price,
        0
      ),
    };
  }, [filteredTransfers]);

  const nextPickup = useMemo(() => {
    if (!filteredTransfers.length)
      return undefined;

    return [...filteredTransfers].sort(
      (a, b) =>
        new Date(
          `${a.date}T${a.time}`
        ).getTime() -
        new Date(
          `${b.date}T${b.time}`
        ).getTime()
    )[0];
  }, [filteredTransfers]);

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Dispatch Board"
          subtitle="Daily Operations Center"
        />

        <DispatchStats
          total={stats.total}
          arrivals={stats.arrivals}
          departures={stats.departures}
          revenue={stats.revenue}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <NextPickupCard
            transfer={nextPickup}
            onEdit={setEditingTransfer}
          />

          <AttentionPanel
            transfers={filteredTransfers}
          />
        </div>

        <DispatchSearch
          value={search}
          onChange={setSearch}
        />

        <DispatchFilters
          filter={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="flex gap-3">
          <button
            onClick={() =>
              setDayFilter("today")
            }
            className={`rounded-lg px-4 py-2 ${
              dayFilter === "today"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Today
          </button>

          <button
            onClick={() =>
              setDayFilter("tomorrow")
            }
            className={`rounded-lg px-4 py-2 ${
              dayFilter === "tomorrow"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Tomorrow
          </button>

          <button
            onClick={() =>
              setDayFilter("all")
            }
            className={`rounded-lg px-4 py-2 ${
              dayFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            All
          </button>
        </div>

        <DispatchTable
          transfers={filteredTransfers}
          onEdit={setEditingTransfer}
          getDriverPhone={getDriverPhone}
          onAssignDriver={updateDriver}
          onAssignVehicle={updateVehicle}
        />

        <TransferDialog
          transfer={editingTransfer}
          onSave={saveTransfer}
          hideTrigger
        />

      </div>
    </AppLayout>
  );
}