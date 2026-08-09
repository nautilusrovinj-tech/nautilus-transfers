"use client";

import { useMemo, useState } from "react";

import { Transfer } from "@/types/transfer";
import { googleMapsUrl } from "@/lib/helpers/maps";
import { guestWhatsAppUrl } from "@/lib/helpers/whatsapp";
import {
  completeTransfer,
  updateTransferStatus,
} from "@/services/transfers";

interface Props {
  transfer: Transfer;
  onComplete?: () => void;
}

export default function DriverTransferCard({
  transfer,
  onComplete,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [showCompletionForm, setShowCompletionForm] =
    useState(false);

  const [actualKilometers, setActualKilometers] =
    useState("");

  const [fuelLiters, setFuelLiters] =
    useState("");

  const [driverNote, setDriverNote] =
    useState("");

  const statusColour = useMemo(() => {
    switch (transfer.status) {
      case "Completed":
        return "bg-green-600";

      case "In Progress":
        return "bg-orange-500";

      case "Cancelled":
        return "bg-red-600";

      default:
        return "bg-blue-600";
    }
  }, [transfer.status]);

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

  function openCompletionForm() {
    setShowCompletionForm(true);
  }

  function cancelCompletion() {
    if (saving) return;

    setShowCompletionForm(false);
  }

  async function handleCompleteTransfer() {
    if (saving) return;

    try {
      setSaving(true);

      const kilometers =
        actualKilometers.trim() === ""
          ? null
          : Number(actualKilometers);

      const fuel =
        fuelLiters.trim() === ""
          ? null
          : Number(fuelLiters);

      if (
        kilometers !== null &&
        (!Number.isFinite(kilometers) ||
          kilometers < 0)
      ) {
        alert(
          "Please enter a valid kilometer value."
        );
        setSaving(false);
        return;
      }

      if (
        fuel !== null &&
        (!Number.isFinite(fuel) ||
          fuel < 0)
      ) {
        alert(
          "Please enter a valid fuel amount."
        );
        setSaving(false);
        return;
      }

      await completeTransfer(
        transfer.id,
        kilometers,
        driverNote.trim(),
        fuel
      );

      setShowCompletionForm(false);
      setActualKilometers("");
      setFuelLiters("");
      setDriverNote("");

      onComplete?.();
    } catch (err) {
      console.error(err);
      alert("Failed to complete transfer.");
    } finally {
      setSaving(false);
    }
  }

  const hasSeats =
    transfer.childSeats > 0 ||
    transfer.babySeats > 0 ||
    transfer.boosterSeats > 0;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">

      {/* Header */}

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-5xl font-bold tracking-tight">
              {transfer.time}
            </p>

            <p className="mt-3 text-lg font-semibold">
              {transfer.transferType}
            </p>

            <p className="mt-1 text-slate-300">
              {transfer.clientName}
            </p>

          </div>

          <div
            className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-md ${statusColour}`}
          >
            {transfer.status}
          </div>

        </div>

      </div>

      <div className="space-y-5 p-6">

        {/* Phone */}

        {transfer.phone && (
          <div>
            <p className="text-slate-500">
              {transfer.phone}
            </p>
          </div>
        )}

        {/* Route */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Route
          </div>

          {(transfer.flight ||
            transfer.adults > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">

              {transfer.flight && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Flight: {transfer.flight}
                </span>
              )}

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {transfer.adults} Adult
                {transfer.adults !== 1
                  ? "s"
                  : ""}
              </span>

              {transfer.children > 0 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {transfer.children} Child
                  {transfer.children !== 1
                    ? "ren"
                    : ""}
                </span>
              )}

            </div>
          )}

          <div className="mt-5 flex gap-4">

            <div className="flex flex-col items-center">

              <div className="h-3 w-3 rounded-full bg-blue-600" />

              <div className="my-2 h-16 w-0.5 bg-slate-300" />

              <div className="h-3 w-3 rounded-full bg-green-600" />

            </div>

            <div className="flex-1">

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Pickup
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.pickup}
                </p>

              </div>

              <div className="mt-6">

                <p className="text-xs uppercase text-slate-500">
                  Destination
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.destination}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Vehicle / Partner / Price / Payment */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

            {/* Vehicle */}

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Vehicle
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {transfer.vehicle}
              </p>

            </div>

            {/* Partner */}

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Partner
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {transfer.partner || "Direct"}
              </p>

            </div>

            {/* Price */}

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Price
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                €{Number(transfer.price).toFixed(2)}
              </p>

            </div>

            {/* Payment */}

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Payment
              </p>

              <p
                className={`mt-1 text-lg font-bold ${
                  transfer.paymentMethod ===
                  "Invoice"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {transfer.paymentMethod ||
                  "Cash"}
              </p>

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="space-y-3">

          {transfer.phone && (
            <>
              <button
                onClick={() =>
                  window.open(
                    guestWhatsAppUrl(
                      transfer
                    ),
                    "_blank"
                  )
                }
                className="w-full rounded-2xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
              >
                WhatsApp
              </button>

              <button
                onClick={() =>
                  window.open(
                    `tel:${transfer.phone}`,
                    "_self"
                  )
                }
                className="w-full rounded-2xl bg-sky-600 py-4 text-lg font-bold text-white transition hover:bg-sky-700"
              >
                Call
              </button>
            </>
          )}

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
            className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white transition hover:bg-orange-600"
          >
            Start Navigation
          </button>

          {/* Expand Button */}

          <button
            onClick={() =>
              setExpanded(!expanded)
            }
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:bg-slate-100"
          >
            <span className="font-semibold text-slate-900">
              {expanded
                ? "Hide Details"
                : "More Details"}
            </span>

            <span className="text-xl text-slate-500">
              {expanded ? "−" : "+"}
            </span>
          </button>

        </div>

        {/* Expanded Details */}

        {expanded && (
          <>

            {/* Passengers */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <h3 className="mb-4 text-lg font-bold">
                Passengers
              </h3>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-slate-100 p-4 text-center">

                  <div className="text-2xl font-bold">
                    {transfer.adults}
                  </div>

                  <div className="text-sm text-slate-500">
                    Adults
                  </div>

                </div>

                <div className="rounded-xl bg-slate-100 p-4 text-center">

                  <div className="text-2xl font-bold">
                    {transfer.children}
                  </div>

                  <div className="text-sm text-slate-500">
                    Children
                  </div>

                </div>

              </div>

            </div>

            {/* Seats */}

            {hasSeats && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <h3 className="mb-4 text-lg font-bold">
                  Seats
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {transfer.childSeats > 0 && (
                    <div className="rounded-xl bg-slate-100 p-4 text-center">

                      <div className="text-2xl font-bold">
                        {transfer.childSeats}
                      </div>

                      <div className="text-sm text-slate-500">
                        Child Seats
                      </div>

                    </div>
                  )}

                  {transfer.babySeats > 0 && (
                    <div className="rounded-xl bg-slate-100 p-4 text-center">

                      <div className="text-2xl font-bold">
                        {transfer.babySeats}
                      </div>

                      <div className="text-sm text-slate-500">
                        Baby Seats
                      </div>

                    </div>
                  )}

                  {transfer.boosterSeats > 0 && (
                    <div className="rounded-xl bg-slate-100 p-4 text-center">

                      <div className="text-2xl font-bold">
                        {transfer.boosterSeats}
                      </div>

                      <div className="text-sm text-slate-500">
                        Booster Seats
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Notes */}

            {transfer.notes && (
              <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-5">

                <h3 className="mb-2 text-lg font-bold">
                  Notes
                </h3>

                <p className="whitespace-pre-wrap text-slate-700">
                  {transfer.notes}
                </p>

              </div>
            )}

          </>
        )}

        {/* Completion Form */}

        {showCompletionForm && (
          <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">

            <h3 className="mb-1 text-lg font-bold text-slate-900">
              Complete Transfer
            </h3>

            <p className="mb-5 text-sm text-slate-600">
              All fields are optional.
            </p>

            <div className="space-y-4">

              {/* Real Kilometers */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Real Kilometers
                </label>

                <input
                  type="number"
                  min={0}
                  step="1"
                  inputMode="numeric"
                  placeholder="e.g. 125430"
                  value={actualKilometers}
                  onChange={(e) =>
                    setActualKilometers(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              {/* Fuel */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Fuel (liters)
                </label>

                <input
                  type="number"
                  min={0}
                  step="0.1"
                  inputMode="decimal"
                  placeholder="e.g. 42.5"
                  value={fuelLiters}
                  onChange={(e) =>
                    setFuelLiters(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              {/* Driver Note */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Note
                </label>

                <textarea
                  rows={3}
                  placeholder="Optional note..."
                  value={driverNote}
                  onChange={(e) =>
                    setDriverNote(
                      e.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              {/* Buttons */}

              <div className="grid grid-cols-2 gap-3 pt-2">

                <button
                  type="button"
                  disabled={saving}
                  onClick={cancelCompletion}
                  className="rounded-2xl border border-slate-300 bg-white py-4 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={
                    handleCompleteTransfer
                  }
                  className="rounded-2xl bg-green-700 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Completing..."
                    : "Complete Transfer"}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* Start Transfer */}

        {(transfer.status === "Assigned" ||
          transfer.status === "Confirmed") &&
          !showCompletionForm && (
            <button
              disabled={saving}
              onClick={startTransfer}
              className="w-full rounded-2xl bg-blue-600 py-5 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Starting..."
                : "Start Transfer"}
            </button>
          )}

        {/* Complete Transfer */}

        {transfer.status === "In Progress" &&
          !showCompletionForm && (
            <button
              disabled={saving}
              onClick={openCompletionForm}
              className="w-full rounded-2xl bg-green-700 py-5 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Complete Transfer
            </button>
          )}

      </div>

    </div>
  );
}