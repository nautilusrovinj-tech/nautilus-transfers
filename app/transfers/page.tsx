"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import TransferDialog from "@/components/transfers/TransferDialog";
import TransferTable from "@/components/transfers/TransferTable";

import { Transfer } from "@/types/transfer";
import { createEmptyTransfer } from "@/lib/transfer";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      ...createEmptyTransfer(),

      transferNumber: "NT-2026-000001",

      clientName: "John Smith",
      phone: "+44 7700 900123",
      email: "john@example.com",

      date: "2026-07-11",
      time: "14:30",

      pickup: "Pula Airport",
      destination: "Grand Park Hotel",
      flight: "FR4587",

      adults: 2,
      children: 0,

      driver: "Ivan",
      vehicle: "Mercedes V-Class",
      partner: "Direct",

      price: 120,

      status: "Confirmed",

      notes: "",
    },
  ]);

  const [selectedTransfer, setSelectedTransfer] =
    useState<Transfer | null>(null);

  function handleSave(transfer: Transfer) {
    setTransfers((prev) => [...prev, transfer]);
  }

  function handleDelete(id: string) {
    setTransfers((prev) =>
      prev.filter((t) => t.id !== id)
    );
  }

  function handleEdit(transfer: Transfer) {
    setSelectedTransfer(transfer);

    console.log("Editing:", transfer);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Bookings
            </h1>

            <p className="text-slate-500">
              Manage all transfer bookings.
            </p>
          </div>

          <TransferDialog onSave={handleSave} />
        </div>

        <TransferTable
          transfers={transfers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </AppLayout>
  );
}