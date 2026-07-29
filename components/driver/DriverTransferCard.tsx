"use client";

import { useState } from "react";

import { Transfer } from "@/types/transfer";
import { googleMapsUrl } from "@/lib/helpers/maps";
import { guestWhatsAppUrl } from "@/lib/helpers/whatsapp";
import { updateTransferStatus } from "@/services/transfers";

interface Props {
  transfer: Transfer;
  onComplete?: () => void;
}

export default function DriverTransferCard({
  transfer,
  onComplete,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function startTransfer() {
    if (saving) return;

    try {
      setSaving(true);

      await updateTransferStatus(
        transfer.id,
        "In Progress"
      );

      onComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to start transfer.");
    } finally {
      setSaving(false);
    }
  }

  async function completeTransfer() {
    if (saving) return;

    try {
      setSaving(true);

      await updateTransferStatus(
        transfer.id,
        "Completed"
      );

      onComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to complete transfer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

      {/* Header */}

      <div className="bg-slate-900 p-6 text-white">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-slate-300">
              {transfer.date}
            </p>

            <h1 className="mt-1 text-5xl font-bold">
              {transfer.time}
            </h1>
          </div>

          <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
            {transfer.transferType}
          </span>

        </div>

      </div>

      <div className="space-y-5 p-6">

        {/* Client */}

        {/* Client */}

<div className="space-y-4">

<div>
<h2 className="text-3xl font-bold">
  {transfer.clientName}
</h2>

  {transfer.phone && (
    <p className="mt-2 text-slate-500">
      📞 {transfer.phone}
    </p>
  )}
</div>

<div className="grid grid-cols-1 gap-3 md:grid-cols-3">

<div className="rounded-2xl bg-slate-100 p-4">
  <div className="text-xs font-semibold uppercase text-slate-500">
    Vehicle
  </div>

  <div className="mt-2 text-lg font-bold">
    🚐 {transfer.vehicle}
  </div>
</div>

  <div className="rounded-2xl bg-slate-100 p-4">
    <div className="text-xs font-semibold uppercase text-slate-500">
      Partner
    </div>

    <div className="mt-2 text-lg font-bold">
      🤝 {transfer.partner || "Direct Booking"}
    </div>
  </div>

  <div className="rounded-2xl bg-green-100 p-4">
    <div className="text-xs font-semibold uppercase text-green-700">
      Price
    </div>

    <div className="mt-2 text-2xl font-bold text-green-700">
      £{transfer.price}
    </div>
  </div>

</div>

</div>

        {/* Flight */}

        {transfer.flight && (
          <div className="rounded-2xl bg-blue-50 p-5">

            <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Flight
            </div>

            <div className="mt-1 text-3xl font-bold text-blue-900">
              ✈️ {transfer.flight}
            </div>

          </div>
        )}

        {/* Route */}

        <div className="rounded-2xl bg-slate-100 p-5">

          <div>

            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pickup
            </div>

            <div className="mt-1 text-lg font-semibold">
              {transfer.pickup}
            </div>

          </div>

          <div className="py-4 text-center text-3xl">
            ↓
          </div>

          <div>

            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Destination
            </div>

            <div className="mt-1 text-lg font-semibold">
              {transfer.destination}
            </div>

          </div>

        </div>

        {/* Passengers */}

        {(transfer.adults > 0 ||
          transfer.children > 0 ||
          transfer.babySeats > 0 ||
          transfer.boosterSeats > 0) && (
          <div className="rounded-2xl border bg-white p-5">

            <h3 className="mb-4 text-lg font-bold">
              👥 Passengers
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl bg-slate-100 p-3 text-center">
                <div className="text-2xl font-bold">
                  {transfer.adults}
                </div>

                <div className="text-sm text-slate-500">
                  Adults
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-center">
                <div className="text-2xl font-bold">
                  {transfer.children}
                </div>

                <div className="text-sm text-slate-500">
                  Children
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-center">
                <div className="text-2xl font-bold">
                  {transfer.babySeats}
                </div>

                <div className="text-sm text-slate-500">
                  Baby Seats
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-center">
                <div className="text-2xl font-bold">
                  {transfer.boosterSeats}
                </div>

                <div className="text-sm text-slate-500">
                  Boosters
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Notes */}

        {transfer.notes && (
          <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5">

            <h3 className="mb-2 text-lg font-bold">
              ⚠️ Notes
            </h3>

            <p className="whitespace-pre-wrap text-slate-700">
              {transfer.notes}
            </p>

          </div>
        )}

        {/* Navigate */}

        <button
          onClick={() =>
            window.open(
              googleMapsUrl(
                transfer.pickup,
                transfer.destination
              ),
              "_blank"
            )
          }
          className="w-full rounded-2xl bg-orange-500 py-5 text-xl font-bold text-white active:scale-95"
        >
          🧭 START NAVIGATION
        </button>

        {/* Secondary Actions */}

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() =>
              window.open(
                guestWhatsAppUrl(
                  transfer
                ),
                "_blank"
              )
            }
            className="rounded-2xl bg-green-600 py-5 text-lg font-bold text-white active:scale-95"
          >
            💬 WhatsApp
          </button>

          <button
            onClick={() =>
              window.open(
                `tel:${transfer.phone}`
              )
            }
            className="rounded-2xl bg-sky-600 py-5 text-lg font-bold text-white active:scale-95"
          >
            📞 Call
          </button>

        </div>

        {/* Status Action */}

        {(transfer.status === "Assigned" ||
          transfer.status === "Confirmed") && (
          <button
            disabled={saving}
            onClick={startTransfer}
            className="w-full rounded-2xl bg-blue-600 py-5 text-xl font-bold text-white active:scale-95 disabled:opacity-50"
          >
            ▶ START TRANSFER
          </button>
        )}

        {transfer.status ===
          "In Progress" && (
          <button
            disabled={saving}
            onClick={
              completeTransfer
            }
            className="w-full rounded-2xl bg-green-700 py-5 text-xl font-bold text-white active:scale-95 disabled:opacity-50"
          >
            ✅ COMPLETE TRANSFER
          </button>
        )}

      </div>

    </div>
  );
}