"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import TransferTable from "@/components/transfers/TransferTable";
import TransferDialog from "@/components/transfers/TransferDialog";
import TransferSearchBar from "@/components/transfers/TransferSearchBar";

import DateRangeFilter from "@/components/ui/DateRangeFilter";
import PartnerFilter from "@/components/ui/PartnerFilter";

import {
  getTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
} from "@/services/transfers";

import { getPartners } from "@/services/partners";

import { Transfer } from "@/types/transfer";
import { Partner } from "@/types/partner";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [partnerFilter, setPartnerFilter] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [selectedTransfer, setSelectedTransfer] =
    useState<Transfer | null>(null);

  async function loadTransfers() {
    try {
      const [transferData, partnerData] =
        await Promise.all([
          getTransfers(),
          getPartners(),
        ]);

      setTransfers(transferData);
      setPartners(partnerData);
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
        status === "" ||
        t.status === status;

      const matchesPartner =
        partnerFilter === "" ||
        (partnerFilter === "DIRECT"
          ? !t.partnerId
          : t.partnerId === partnerFilter);

      const matchesDate =
        (!fromDate ||
          t.date >= fromDate) &&
        (!toDate ||
          t.date <= toDate);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPartner &&
        matchesDate
      );
    });
  }, [
    transfers,
    search,
    status,
    partnerFilter,
    fromDate,
    toDate,
  ]);

  async function handleSave(
    transfer: Transfer
  ) {
    try {
      const transferToSave: Transfer = {
        ...transfer,
  
        status:
          transfer.status === "Completed" ||
          transfer.status === "In Progress" ||
          transfer.status === "Cancelled"
            ? transfer.status
            : transfer.driverId &&
              transfer.vehicleId
            ? "Assigned"
            : "New",
      };
  
      console.log(
        "TRANSFER TO SAVE:",
        transferToSave
      );
  
      const exists = transfers.some(
        (t) => t.id === transferToSave.id
      );
  
      if (exists) {
        await updateTransfer(
          transferToSave.id,
          transferToSave
        );
      } else {
        await createTransfer(
          transferToSave
        );
      }
  
      setSelectedTransfer(null);
  
      await loadTransfers();
    } catch (error) {
      console.error(error);
      alert("Failed to save transfer.");
    }
  }

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete transfer?"
      )
    )
      return;

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
          action={
            <TransferDialog
              onSave={handleSave}
            />
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">

          <TransferSearchBar
            value={search}
            status={status}
            date=""
            onChange={setSearch}
            onStatusChange={
              setStatus
            }
            onDateChange={() => {}}
          />

          <PartnerFilter
            partners={partners}
            value={partnerFilter}
            onChange={
              setPartnerFilter
            }
          />

        </div>

        <DateRangeFilter
          from={fromDate}
          to={toDate}
          onFromChange={
            setFromDate
          }
          onToChange={setToDate}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            Loading...
          </div>
        ) : (
          <TransferTable
            transfers={
              filteredTransfers
            }
            onEdit={
              setSelectedTransfer
            }
            onDelete={
              handleDelete
            }
          />
        )}

        <TransferDialog
          hideTrigger
          transfer={
            selectedTransfer
          }
          onSave={handleSave}
          onDelete={
            handleDelete
          }
        />

      </div>
    </AppLayout>
  );
}