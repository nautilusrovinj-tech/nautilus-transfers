"use client";

import { useEffect, useState } from "react";

import { Transfer } from "@/types/transfer";
import { updateTransferStatus } from "@/services/transfers";

interface Props {
  transfers: Transfer[];
}

export default function RecentTransfers({
  transfers,
}: Props) {
  const [recent, setRecent] =
    useState<Transfer[]>([]);

  const [selectedTransfer, setSelectedTransfer] =
    useState<Transfer | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  useEffect(() => {
    const sorted = [...transfers].sort(
      (a, b) => {
        return `${b.date}${b.time}`.localeCompare(
          `${a.date}${a.time}`
        );
      }
    );

    setRecent(sorted);
  }, [transfers]);

  const newRequests = recent.filter(
    (transfer) =>
      transfer.status === "New" &&
      !!transfer.partnerId
  );

  const otherTransfers = recent
    .filter(
      (transfer) =>
        !(
          transfer.status === "New" &&
          !!transfer.partnerId
        )
    )
    .slice(0, 10);

  async function handleConfirm(
    transfer: Transfer
  ) {
    const confirmed = window.confirm(
      `Confirm transfer ${transfer.transferNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(transfer.id);

      await updateTransferStatus(
        transfer.id,
        "Confirmed"
      );

      setRecent((current) =>
        current.map((item) =>
          item.id === transfer.id
            ? {
                ...item,
                status: "Confirmed",
              }
            : item
        )
      );

      setSelectedTransfer(null);
    } catch (error) {
      console.error(
        "Confirm transfer error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to confirm transfer."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDecline(
    transfer: Transfer
  ) {
    const confirmed = window.confirm(
      `Decline transfer ${transfer.transferNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(transfer.id);

      await updateTransferStatus(
        transfer.id,
        "Cancelled"
      );

      setRecent((current) =>
        current.map((item) =>
          item.id === transfer.id
            ? {
                ...item,
                status: "Cancelled",
              }
            : item
        )
      );

      setSelectedTransfer(null);
    } catch (error) {
      console.error(
        "Decline transfer error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to decline transfer."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function getStatusClass(
    status: Transfer["status"]
  ) {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Assigned":
        return "bg-purple-100 text-purple-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <>
      <div className="space-y-6">

        {/* PARTNER REQUESTS */}

        {newRequests.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-yellow-200 bg-yellow-50 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  New Partner Requests
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  These bookings are waiting for your confirmation.
                </p>
              </div>

              <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-semibold text-yellow-800">
                {newRequests.length}{" "}
                {newRequests.length === 1
                  ? "request"
                  : "requests"}
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Partner
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date / Time
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Route
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {newRequests.map(
                    (transfer) => (
                      <tr
                        key={transfer.id}
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4">

                          <div className="font-semibold text-slate-900">
                            {transfer.partner ||
                              "Partner"}
                          </div>

                          <div className="mt-1 text-xs text-yellow-700">
                            NEW REQUEST
                          </div>

                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {transfer.clientName}
                          </div>

                          {transfer.phone && (
                            <div className="mt-1 text-sm text-slate-500">
                              {transfer.phone}
                            </div>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">

                          <div className="font-medium">
                            {transfer.date}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {transfer.time}
                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <div className="max-w-[240px]">
                            <div className="font-medium">
                              {transfer.pickup}
                            </div>

                            <div className="my-1 text-xs text-slate-400">
                              ↓
                            </div>

                            <div className="font-medium">
                              {transfer.destination}
                            </div>
                          </div>

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold">
                          €
                          {transfer.price.toFixed(
                            2
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTransfer(
                                transfer
                              )
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* RECENT TRANSFERS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div>
              <h2 className="text-lg font-semibold">
                Recent Transfers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest transfer activity.
              </p>
            </div>

          </div>

          {otherTransfers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No transfers found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      #
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date / Time
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Partner
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {otherTransfers.map(
                    (transfer) => (
                      <tr
                        key={transfer.id}
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4 font-medium">
                          {transfer.transferNumber}
                        </td>

                        <td className="px-6 py-4">
                          {transfer.clientName}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          {transfer.date}{" "}
                          {transfer.time}
                        </td>

                        <td className="px-6 py-4">

                          {transfer.partner ? (
                            <span className="font-medium">
                              {transfer.partner}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Direct
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              transfer.status
                            )}`}
                          >
                            {transfer.status}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold">
                          €
                          {transfer.price.toFixed(
                            2
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTransfer(
                                transfer
                              )
                            }
                            className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* TRANSFER DETAILS MODAL */}

      {selectedTransfer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedTransfer(null)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <div className="text-sm font-medium text-slate-500">
                  Transfer
                </div>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedTransfer.transferNumber}
                </h2>

                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      selectedTransfer.status
                    )}`}
                  >
                    {selectedTransfer.status}
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTransfer(null)
                }
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* DETAILS */}

            <div className="grid gap-6 p-6 md:grid-cols-2">

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Partner
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Partner"
                    value={
                      selectedTransfer.partner ||
                      "Direct"
                    }
                  />

                  <Detail
                    label="Transfer type"
                    value={
                      selectedTransfer.transferType
                    }
                  />

                </div>

              </div>

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Name"
                    value={
                      selectedTransfer.clientName
                    }
                  />

                  <Detail
                    label="Phone"
                    value={
                      selectedTransfer.phone ||
                      "-"
                    }
                  />

                  <Detail
                    label="Email"
                    value={
                      selectedTransfer.email ||
                      "-"
                    }
                  />

                </div>

              </div>

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Transfer
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Date"
                    value={
                      selectedTransfer.date
                    }
                  />

                  <Detail
                    label="Time"
                    value={
                      selectedTransfer.time
                    }
                  />

                  <Detail
                    label="Pickup"
                    value={
                      selectedTransfer.pickup
                    }
                  />

                  <Detail
                    label="Destination"
                    value={
                      selectedTransfer.destination
                    }
                  />

                  <Detail
                    label="Flight"
                    value={
                      selectedTransfer.flight ||
                      "-"
                    }
                  />

                </div>

              </div>

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Booking
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Adults"
                    value={String(
                      selectedTransfer.adults
                    )}
                  />

                  <Detail
                    label="Children"
                    value={String(
                      selectedTransfer.children
                    )}
                  />

                  <Detail
                    label="Child seats"
                    value={String(
                      selectedTransfer.childSeats
                    )}
                  />

                  <Detail
                    label="Baby seats"
                    value={String(
                      selectedTransfer.babySeats
                    )}
                  />

                  <Detail
                    label="Booster seats"
                    value={String(
                      selectedTransfer.boosterSeats
                    )}
                  />

                </div>

              </div>

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Price"
                    value={`€${selectedTransfer.price.toFixed(
                      2
                    )}`}
                  />

                  <Detail
                    label="Payment method"
                    value={
                      selectedTransfer.paymentMethod
                    }
                  />

                </div>

              </div>

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Assignment
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Driver"
                    value={
                      selectedTransfer.driver ||
                      "Not assigned"
                    }
                  />

                  <Detail
                    label="Vehicle"
                    value={
                      selectedTransfer.vehicle ||
                      "Not assigned"
                    }
                  />

                </div>

              </div>

              {selectedTransfer.notes && (
                <div className="md:col-span-2">

                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Notes
                  </h3>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {selectedTransfer.notes}
                  </div>

                </div>
              )}

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedTransfer(null)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              {selectedTransfer.status ===
                "New" &&
              selectedTransfer.partnerId ? (
                <div className="flex gap-3">

                  <button
                    type="button"
                    disabled={
                      processingId ===
                      selectedTransfer.id
                    }
                    onClick={() =>
                      handleDecline(
                        selectedTransfer
                      )
                    }
                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {processingId ===
                    selectedTransfer.id
                      ? "..."
                      : "Decline"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      processingId ===
                      selectedTransfer.id
                    }
                    onClick={() =>
                      handleConfirm(
                        selectedTransfer
                      )
                    }
                    className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {processingId ===
                    selectedTransfer.id
                      ? "..."
                      : "Confirm"}
                  </button>

                </div>
              ) : null}

            </div>

          </div>

        </div>
      )}
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-900">
        {value}
      </span>

    </div>
  );
}