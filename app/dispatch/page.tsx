"use client";

import { useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import DispatchBoard from "@/components/dispatch/DispatchBoard";
import DispatchSearch from "@/components/dispatch/DispatchSearch";
import DispatchFilters from "@/components/dispatch/DispatchFilters";
import TransferDialog from "@/components/transfers/TransferDialog";

import { useTransfers } from "@/hooks/useTransfers";
import { useLookups } from "@/hooks/useLookups";

import { Transfer } from "@/types/transfer";

export default function DispatchPage() {
  const {
    transfers,
    saveTransfer,
    removeTransfer,
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

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (t.date !== selectedDate)
        return false;

      if (
        statusFilter !== "All" &&
        t.status !== statusFilter
      )
        return false;

      if (search.trim()) {
        const value =
          search.toLowerCase();

        const found = [
          t.transferNumber,
          t.clientName,
          t.phone,
          t.flight,
          t.pickup,
          t.destination,
          getDriverName(
            t.driverId
          ),
          getVehicleName(
            t.vehicleId
          ),
          getPartnerName(
            t.partnerId
          ),
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
    statusFilter,
    search,
    selectedDate,
    getDriverName,
    getVehicleName,
    getPartnerName,
  ]);

  function today() {
    setSelectedDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );
  }

  function tomorrow() {
    const d = new Date();

    d.setDate(d.getDate() + 1);

    setSelectedDate(
      d.toISOString().split("T")[0]
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Dispatch"
          subtitle={selectedDate}
        />

        <DispatchSearch
          value={search}
          onChange={setSearch}
        />

        <DispatchFilters
          filter={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">

          <button
            onClick={today}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-white"
          >
            Today
          </button>

          <button
            onClick={tomorrow}
            className="rounded-xl bg-slate-200 px-5 py-2.5"
          >
            Tomorrow
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-2.5"
          />

        </div>

        <DispatchBoard
          transfers={filteredTransfers}
          onEdit={setEditingTransfer}
          getDriverPhone={
            getDriverPhone
          }
          onAssignDriver={
            updateDriver
          }
          onAssignVehicle={
            updateVehicle
          }
        />

        <TransferDialog
          transfer={editingTransfer}
          onSave={saveTransfer}
          onDelete={removeTransfer}
          hideTrigger
        />

      </div>
    </AppLayout>
  );
}