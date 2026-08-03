"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import TransferTable from "@/components/transfers/TransferTable";
import TransferDialog from "@/components/transfers/TransferDialog";
import TransferSearchBar from "@/components/transfers/TransferSearchBar";
import DateRangeFilter from "@/components/ui/DateRangeFilter";
import {
  getTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from "@/services/transfers";

import { Transfer } from "@/types/transfer";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  const [selectedTransfer, setSelectedTransfer] =
    useState<Transfer | null>(null);

  async function loadTransfers() {
    try {
      const data = await getTransfers();
      setTransfers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load transfers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  const filteredTransfers = useMemo(() => {
    const q = search.toLowerCase();

    return transfers.filter((t) => {
      const matchesSearch = [
        t.transferNumber,
        t.clientName,
        t.phone,
        t.pickup,
        t.destination,
        t.flight,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);

      const matchesStatus =
        status === "" || t.status === status;

        const matchesDate =
        (!fromDate || t.date >= fromDate) &&
        (!toDate || t.date <= toDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [search, status, date, transfers]);

  async function handleSave(transfer: Transfer) {
    try {
      const transferToSave: Transfer = {
        ...transfer,
        status:
          transfer.driverId && transfer.vehicleId
            ? "Assigned"
            : "New",
      };

      console.log("TRANSFER TO SAVE:", {
        driverId: transfer.driverId,
        vehicleId: transfer.vehicleId,
        partnerId: transfer.partnerId,
        status: transferToSave.status,
        transfer: transferToSave,
      });

      const exists = transfers.some(
        (t) => t.id === transferToSave.id
      );

      if (exists) {
        await updateTransfer(
          transferToSave.id,
          transferToSave
        );
      } else {
        await createTransfer(transferToSave);
      }

      setSelectedTransfer(null);

      await loadTransfers();
    } catch (error) {
      console.error(error);
      alert("Failed to save transfer.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete transfer?")) return;

    try {
      await deleteTransfer(id);

      setSelectedTransfer(null);

      await loadTransfers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete transfer.");
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Transfers"
          subtitle={`${filteredTransfers.length} transfer(s)`}
          action={<TransferDialog onSave={handleSave} />}
        />

<div className="space-y-4">

<TransferSearchBar
  value={search}
  status={status}
  date=""
  onChange={setSearch}
  onStatusChange={setStatus}
  onDateChange={() => {}}
/>

<DateRangeFilter
  from={fromDate}
  to={toDate}
  onFromChange={setFromDate}
  onToChange={setToDate}
/>

</div>

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            Loading...
          </div>
        ) : (
          <TransferTable
            transfers={filteredTransfers}
            onEdit={setSelectedTransfer}
            onDelete={handleDelete}
          />
        )}

        <TransferDialog
          hideTrigger
          transfer={selectedTransfer}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>
    </AppLayout>
  );
}