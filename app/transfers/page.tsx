"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import TransferDialog from "@/components/transfers/TransferDialog";
import TransferTable from "@/components/transfers/TransferTable";
import SearchBar from "@/components/transfers/SearchBar";

import { Transfer } from "@/types/transfer";
import { supabase } from "@/lib/supabase";

export default function TransfersPage() {
  const [search, setSearch] = useState("");

  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const [editingTransfer, setEditingTransfer] =
    useState<Transfer | null>(null);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    const { data, error } = await supabase
      .from("transfers")
      .select("*")
      .order("date")
      .order("time");

    if (error) {
      console.error(error);
      return;
    }

    if (!data) return;

    const mapped: Transfer[] = data.map((t: any) => ({
      id: t.id,

      transferNumber: t.transfer_number,

      clientName: t.client_name,
      phone: t.phone ?? "",
      email: t.email ?? "",

      date: t.date,
      time: t.time,

      pickup: t.pickup,
      destination: t.destination,
      flight: t.flight ?? "",

      adults: t.adults,
      children: t.children,
      babySeats: t.baby_seats ?? 0,
      boosterSeats: t.booster_seats ?? 0,

      driver: t.driver ?? "",
      vehicle: t.vehicle ?? "",
      partner: t.partner ?? "",

      price: Number(t.price),

      status: t.status,

      notes: t.notes ?? "",
    }));

    setTransfers(mapped);
  }

  async function handleSave(transfer: Transfer) {
    if (editingTransfer) {
      const { error } = await supabase
        .from("transfers")
        .update({
          transfer_number: transfer.transferNumber,

          client_name: transfer.clientName,
          phone: transfer.phone,
          email: transfer.email,

          date: transfer.date,
          time: transfer.time,

          pickup: transfer.pickup,
          destination: transfer.destination,
          flight: transfer.flight,

          adults: transfer.adults,
          children: transfer.children,
          baby_seats: transfer.babySeats,
          booster_seats: transfer.boosterSeats,

          driver: transfer.driver,
          vehicle: transfer.vehicle,
          partner: transfer.partner,

          price: transfer.price,

          status: transfer.status,

          notes: transfer.notes,
        })
        .eq("id", transfer.id);

      if (error) {
        alert(error.message);
        return;
      }

      setEditingTransfer(null);
    } else {
      const { error } = await supabase
        .from("transfers")
        .insert({
          transfer_number: transfer.transferNumber,

          client_name: transfer.clientName,
          phone: transfer.phone,
          email: transfer.email,

          date: transfer.date,
          time: transfer.time,

          pickup: transfer.pickup,
          destination: transfer.destination,
          flight: transfer.flight,

          adults: transfer.adults,
          children: transfer.children,
          baby_seats: transfer.babySeats,
          booster_seats: transfer.boosterSeats,

          driver: transfer.driver,
          vehicle: transfer.vehicle,
          partner: transfer.partner,

          price: transfer.price,

          status: transfer.status,

          notes: transfer.notes,
        });

      if (error) {
        alert(error.message);
        return;
      }
    }

    await loadTransfers();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from("transfers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTransfers();
  }

  function handleEdit(transfer: Transfer) {
    setEditingTransfer(transfer);
  }

  const filteredTransfers = useMemo(() => {
    const q = search.toLowerCase();

    return transfers.filter((t) =>
      [
        t.transferNumber,
        t.clientName,
        t.phone,
        t.flight,
        t.pickup,
        t.destination,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search, transfers]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Transfers
            </h1>

            <p className="text-slate-500">
              Manage all airport transfers.
            </p>
          </div>

          <TransferDialog
            transfer={editingTransfer}
            onSave={handleSave}
          />
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <TransferTable
          transfers={filteredTransfers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </AppLayout>
  );
}