"use client";

import { useMemo, useState } from "react";

import DispatchCard from "./DispatchCard";

import { Transfer } from "@/types/transfer";
import { updateTransferStatus } from "@/services/transfers";

interface Props {
  transfers: Transfer[];
  onEdit?: (transfer: Transfer) => void;
  getDriverPhone?: (
    driverId: string
  ) => string;
  onAssignDriver?: (
    transferId: string,
    driverId: string
  ) => Promise<void>;
  onAssignVehicle?: (
    transferId: string,
    vehicleId: string
  ) => Promise<void>;
}

export default function DispatchBoard({
  transfers,
  onEdit,
  getDriverPhone,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  const [selectedRequest, setSelectedRequest] =
    useState<Transfer | null>(null);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  /*
   * New partner bookings waiting
   * for confirmation.
   */
  const partnerRequests = useMemo(() => {
    return transfers
      .filter(
        (transfer) =>
          transfer.status === "New" &&
          !!transfer.partnerId
      )
      .sort((a, b) =>
        `${a.date}${a.time}`.localeCompare(
          `${b.date}${b.time}`
        )
      );
  }, [transfers]);

  /*
   * Normal dispatch transfers.
   *
   * New partner requests are removed
   * from this list so they don't appear
   * twice.
   */
  const dispatchTransfers = useMemo(() => {
    return transfers.filter(
      (transfer) =>
        !(
          transfer.status === "New" &&
          !!transfer.partnerId
        )
    );
  }, [transfers]);

  async function handleConfirm(
    transfer: Transfer
  ) {
    const confirmed =
      window.confirm(
        `Confirm transfer ${transfer.transferNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        transfer.id
      );

      await updateTransferStatus(
        transfer.id,
        "Confirmed"
      );

      setSelectedRequest(null);

      /*
       * Refresh the page so the transfer
       * immediately moves into the normal
       * Dispatch list.
       */
      window.location.reload();
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
    const confirmed =
      window.confirm(
        `Decline transfer ${transfer.transferNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        transfer.id
      );

      await updateTransferStatus(
        transfer.id,
        "Cancelled"
      );

      setSelectedRequest(null);

      window.location.reload();
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

  if (
    transfers.length === 0 &&
    partnerRequests.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        No transfers found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* ================================================= */}
        {/* NEW PARTNER REQUESTS                              */}
        {/* ================================================= */}

        {partnerRequests.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-yellow-200 bg-yellow-50 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  New Partner Requests
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Transfers waiting for your confirmation.
                </p>
              </div>

              <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-semibold text-yellow-800">
                {partnerRequests.length}
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

                  {partnerRequests.map(
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

                          <div className="mt-1 text-xs font-semibold text-yellow-700">
                            NEW
                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <div className="font-medium text-slate-900">
                            {transfer.clientName}
                          </div>

                          {transfer.phone && (
                            <div className="mt-1 text-sm text-slate-500">
                              {transfer.phone}
                            </div>
                          )}

                        </td>

                        <td className="whitespace-nowrap px-6 py-4">

                          <div className="font-medium text-slate-900">
                            {transfer.date}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {transfer.time}
                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <div className="max-w-[280px]">

                            <div className="font-medium text-slate-900">
                              {transfer.pickup}
                            </div>

                            <div className="my-1 text-xs text-slate-400">
                              ↓
                            </div>

                            <div className="font-medium text-slate-700">
                              {transfer.destination}
                            </div>

                          </div>

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                          €
                          {transfer.price.toFixed(
                            2
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRequest(
                                transfer
                              )
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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

        {/* ================================================= */}
        {/* NORMAL DISPATCH BOARD                            */}
        {/* ================================================= */}

        {dispatchTransfers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No confirmed transfers for the selected period.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">

            {dispatchTransfers.map(
              (transfer) => (
                <DispatchCard
                  key={transfer.id}
                  transfer={transfer}
                  driverPhone={
                    getDriverPhone?.(
                      transfer.driverId
                    ) ?? ""
                  }
                  onEdit={onEdit}
                  onAssignDriver={
                    onAssignDriver
                  }
                  onAssignVehicle={
                    onAssignVehicle
                  }
                />
              )
            )}

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* PARTNER REQUEST DETAILS MODAL                     */}
      {/* ================================================= */}

      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedRequest(null)
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

                <p className="text-sm font-medium text-slate-500">
                  Partner Transfer Request
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedRequest.transferNumber}
                </h2>

                <div className="mt-2">

                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Waiting for confirmation
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* DETAILS */}

            <div className="grid gap-6 p-6 md:grid-cols-2">

              {/* PARTNER */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Partner
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Partner"
                    value={
                      selectedRequest.partner ||
                      "Partner"
                    }
                  />

                </div>

              </div>

              {/* CLIENT */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Client
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Name"
                    value={
                      selectedRequest.clientName
                    }
                  />

                  <Detail
                    label="Phone"
                    value={
                      selectedRequest.phone ||
                      "-"
                    }
                  />

                  <Detail
                    label="Email"
                    value={
                      selectedRequest.email ||
                      "-"
                    }
                  />

                </div>

              </div>

              {/* TRANSFER */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Transfer
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Type"
                    value={
                      selectedRequest.transferType
                    }
                  />

                  <Detail
                    label="Date"
                    value={
                      selectedRequest.date
                    }
                  />

                  <Detail
                    label="Time"
                    value={
                      selectedRequest.time
                    }
                  />

                  <Detail
                    label="Pickup"
                    value={
                      selectedRequest.pickup
                    }
                  />

                  <Detail
                    label="Destination"
                    value={
                      selectedRequest.destination
                    }
                  />

                  <Detail
                    label="Flight"
                    value={
                      selectedRequest.flight ||
                      "-"
                    }
                  />

                </div>

              </div>

              {/* PASSENGERS */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Passengers
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Adults"
                    value={String(
                      selectedRequest.adults
                    )}
                  />

                  <Detail
                    label="Children"
                    value={String(
                      selectedRequest.children
                    )}
                  />

                  <Detail
                    label="Child seats"
                    value={String(
                      selectedRequest.childSeats
                    )}
                  />

                  <Detail
                    label="Baby seats"
                    value={String(
                      selectedRequest.babySeats
                    )}
                  />

                  <Detail
                    label="Booster seats"
                    value={String(
                      selectedRequest.boosterSeats
                    )}
                  />

                </div>

              </div>

              {/* PAYMENT */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Price"
                    value={`€${selectedRequest.price.toFixed(
                      2
                    )}`}
                  />

                  <Detail
                    label="Payment"
                    value={
                      selectedRequest.paymentMethod
                    }
                  />

                </div>

              </div>

              {/* ASSIGNMENT */}

              <div>

                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Assignment
                </h3>

                <div className="space-y-3">

                  <Detail
                    label="Driver"
                    value={
                      selectedRequest.driver ||
                      "Not assigned"
                    }
                  />

                  <Detail
                    label="Vehicle"
                    value={
                      selectedRequest.vehicle ||
                      "Not assigned"
                    }
                  />

                </div>

              </div>

              {/* NOTES */}

              {selectedRequest.notes && (
                <div className="md:col-span-2">

                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Notes
                  </h3>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    {selectedRequest.notes}
                  </div>

                </div>
              )}

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <div className="flex gap-3">

                <button
                  type="button"
                  disabled={
                    processingId ===
                    selectedRequest.id
                  }
                  onClick={() =>
                    handleDecline(
                      selectedRequest
                    )
                  }
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId ===
                  selectedRequest.id
                    ? "..."
                    : "Decline"}
                </button>

                <button
                  type="button"
                  disabled={
                    processingId ===
                    selectedRequest.id
                  }
                  onClick={() =>
                    handleConfirm(
                      selectedRequest
                    )
                  }
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId ===
                  selectedRequest.id
                    ? "..."
                    : "Confirm"}
                </button>

              </div>

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