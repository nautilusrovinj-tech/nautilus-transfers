"use client";

import Link from "next/link";
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

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  useEffect(() => {
    const sorted = [...transfers]
      .sort((a, b) => {
        return (
          `${b.date}${b.time}`.localeCompare(
            `${a.date}${a.time}`
          )
        );
      })
      .slice(0, 10);

    setRecent(sorted);
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

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

        <div>
          <h2 className="text-lg font-semibold">
            Recent Transfers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            New partner bookings require confirmation.
          </p>
        </div>

        <Link
          href="/transfers"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>

      </div>

      {recent.length === 0 ? (
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
                  Date
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

              {recent.map(
                (transfer) => {
                  const isNew =
                    transfer.status ===
                    "New";

                  const processing =
                    processingId ===
                    transfer.id;

                  return (
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
                          <span className="font-medium text-slate-900">
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            transfer.status ===
                            "New"
                              ? "bg-yellow-100 text-yellow-700"
                              : transfer.status ===
                                "Confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : transfer.status ===
                                "Assigned"
                              ? "bg-purple-100 text-purple-700"
                              : transfer.status ===
                                "In Progress"
                              ? "bg-orange-100 text-orange-700"
                              : transfer.status ===
                                "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
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

                      <td className="px-6 py-4">

                        {isNew ? (
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              disabled={processing}
                              onClick={() =>
                                handleConfirm(
                                  transfer
                                )
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {processing
                                ? "..."
                                : "Confirm"}
                            </button>

                            <button
                              type="button"
                              disabled={processing}
                              onClick={() =>
                                handleDecline(
                                  transfer
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {processing
                                ? "..."
                                : "Decline"}
                            </button>

                          </div>
                        ) : (
                          <Link
                            href={`/transfers/${transfer.id}`}
                            className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </Link>
                        )}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </>
  );
}