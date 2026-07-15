"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DispatchStats from "@/components/dispatch/DispatchStats";
import DispatchTable from "@/components/dispatch/DispatchTable";
import NextPickupCard from "@/components/dispatch/NextPickupCard";
import AttentionPanel from "@/components/dispatch/AttentionPanel";
import TransferDialog from "@/components/transfers/TransferDialog";

import { Transfer } from "@/types/transfer";
import {
  getTransfers,
  updateTransfer,
} from "@/lib/services/transferService";

import { drivers } from "@/data/drivers";

type Filter = "today" | "tomorrow" | "all";

export default function DispatchPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filter, setFilter] = useState<Filter>("today");
  const [editingTransfer, setEditingTransfer] =
    useState<Transfer | null>(null);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      const data = await getTransfers();
      setTransfers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave(transfer: Transfer) {
    try {
      await updateTransfer(transfer);

      setEditingTransfer(null);

      await loadTransfers();
    } catch (error) {
      console.error(error);
      alert("Unable to save transfer.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const tomorrow = tomorrowDate
    .toISOString()
    .split("T")[0];

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (filter === "today") return t.date === today;
      if (filter === "tomorrow") return t.date === tomorrow;
      return true;
    });
  }, [transfers, filter, today, tomorrow]);

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
    if (!filteredTransfers.length) return undefined;

    return [...filteredTransfers].sort((a, b) => {
      return (
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
      );
    })[0];
  }, [filteredTransfers]);

  function getDriverPhone(driverName: string) {
    return (
      drivers.find((driver) => driver.name === driverName)
        ?.phone ?? ""
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Dispatch Board
          </h1>

          <p className="text-slate-500">
            Daily Operations Center
          </p>
        </div>

        <DispatchStats
          total={stats.total}
          arrivals={stats.arrivals}
          departures={stats.departures}
          revenue={stats.revenue}
        />

        <div className="grid gap-6 lg:grid-cols-2">

          <NextPickupCard
            transfer={nextPickup}
            onEdit={(transfer) =>
              setEditingTransfer(transfer)
            }
          />

          <AttentionPanel
            transfers={filteredTransfers}
          />

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setFilter("today")}
            className={`rounded-lg px-4 py-2 ${
              filter === "today"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setFilter("tomorrow")}
            className={`rounded-lg px-4 py-2 ${
              filter === "tomorrow"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            Tomorrow
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-100"
            }`}
          >
            All
          </button>

        </div>

        <DispatchTable
          transfers={filteredTransfers}
          onEdit={(transfer) =>
            setEditingTransfer(transfer)
          }
          getDriverPhone={getDriverPhone}
        />

        <TransferDialog
          transfer={editingTransfer}
          onSave={handleSave}
          hideTrigger
        />

      </div>
    </AppLayout>
  );
}