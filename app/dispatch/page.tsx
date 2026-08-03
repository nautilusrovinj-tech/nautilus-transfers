"use client";

import { useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import DateRangeFilter from "@/components/ui/DateRangeFilter";

import DispatchBoard from "@/components/dispatch/DispatchBoard";
import DispatchSearch from "@/components/dispatch/DispatchSearch";
import DispatchFilters from "@/components/dispatch/DispatchFilters";
import TransferDialog from "@/components/transfers/TransferDialog";

import { useTransfers } from "@/hooks/useTransfers";
import { useLookups } from "@/hooks/useLookups";

import { Transfer } from "@/types/transfer";

const TODAY = new Date()
  .toISOString()
  .split("T")[0];

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

  const [fromDate, setFromDate] =
    useState(TODAY);

  const [toDate, setToDate] =
    useState(TODAY);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      if (
        (fromDate && t.date < fromDate) ||
        (toDate && t.date > toDate)
      )
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
    fromDate,
    toDate,
    getDriverName,
    getVehicleName,
    getPartnerName,
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Dispatch"
          subtitle={`${filteredTransfers.length} transfer(s) • ${fromDate} → ${toDate}`}
        />

        <DispatchSearch
          value={search}
          onChange={setSearch}
        />

        <DispatchFilters
          filter={statusFilter}
          onChange={setStatusFilter}
        />

        <DateRangeFilter
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />

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