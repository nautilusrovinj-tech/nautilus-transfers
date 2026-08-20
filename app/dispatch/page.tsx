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

const TODAY = new Date().toISOString().split("T")[0];

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

  const [sendingNotifications, setSendingNotifications] =
    useState(false);

  const [notificationResult, setNotificationResult] =
    useState<string | null>(null);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      /*
       * NEW PARTNER REQUESTS
       *
       * These remain visible even when outside
       * the selected date range, as in the
       * existing Dispatch behaviour.
       */
      const isNewPartnerRequest =
        t.status === "New" && !!t.partnerId;

      if (isNewPartnerRequest) {
        if (search.trim()) {
          const value = search.toLowerCase();

          const found = [
            t.transferNumber,
            t.clientName,
            t.phone,
            t.flight,
            t.pickup,
            t.destination,
            getDriverName(t.driverId),
            getVehicleName(t.vehicleId),
            getPartnerName(t.partnerId),
          ]
            .join(" ")
            .toLowerCase()
            .includes(value);

          if (!found) {
            return false;
          }
        }

        return true;
      }

      /*
       * NORMAL TRANSFERS
       */
      if (
        (fromDate && t.date < fromDate) ||
        (toDate && t.date > toDate)
      ) {
        return false;
      }

      if (
        statusFilter !== "All" &&
        t.status !== statusFilter
      ) {
        return false;
      }

      if (search.trim()) {
        const value = search.toLowerCase();

        const found = [
          t.transferNumber,
          t.clientName,
          t.phone,
          t.flight,
          t.pickup,
          t.destination,
          getDriverName(t.driverId),
          getVehicleName(t.vehicleId),
          getPartnerName(t.partnerId),
        ]
          .join(" ")
          .toLowerCase()
          .includes(value);

        if (!found) {
          return false;
        }
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

  /*
   * =====================================================
   * DRIVER SCHEDULE
   * =====================================================
   *
   * Uses the same filtered transfers as Dispatch.
   * Transfers are grouped by assigned driver and
   * sorted chronologically.
   */
  const driverSchedule = useMemo(() => {
    const grouped = new Map<string, Transfer[]>();

    filteredTransfers.forEach((transfer) => {
      if (!transfer.driverId) {
        return;
      }

      const existing =
        grouped.get(transfer.driverId) ?? [];

      existing.push(transfer);

      grouped.set(
        transfer.driverId,
        existing
      );
    });

    return Array.from(grouped.entries())
      .map(([driverId, driverTransfers]) => {
        const sortedTransfers =
          [...driverTransfers].sort((a, b) => {
            const timeA = a.time || "";
            const timeB = b.time || "";

            return timeA.localeCompare(timeB);
          });

        return {
          driverId,
          driverName:
            getDriverName(driverId) ||
            "Unknown Driver",
          transfers: sortedTransfers,
        };
      })
      .sort((a, b) =>
        a.driverName.localeCompare(
          b.driverName
        )
      );
  }, [
    filteredTransfers,
    getDriverName,
  ]);

  function formatScheduleTime(
    time: string
  ) {
    if (!time) {
      return "-";
    }

    const parts = time.split(":");

    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }

    return time;
  }

  async function handleSendNotifications() {
    try {
      setSendingNotifications(true);
      setNotificationResult(null);

      const response = await fetch(
        "/api/notifications/run",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Failed to send notifications"
        );
      }

      const sentCount =
        data.sent?.length ?? 0;

      const reminderCount =
        data.remindersSent?.length ?? 0;

      const failedCount =
        data.failed?.length ?? 0;

      const reminderFailedCount =
        data.remindersFailed?.length ?? 0;

      setNotificationResult(
        `Done: ${sentCount} new notification(s), ${reminderCount} reminder(s), ${
          failedCount + reminderFailedCount
        } failed.`
      );
    } catch (error) {
      console.error(
        "Manual notification error:",
        error
      );

      setNotificationResult(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error sending notifications."
      );
    } finally {
      setSendingNotifications(false);
    }
  }

  /*
   * Persistent guest confirmation message.
   */
  const guestConfirmationTransfers =
    transfers.filter(
      (transfer) =>
        transfer.guestWhatsappSent ||
        transfer.guestEmailSent
    );

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dispatch"
          subtitle={`${filteredTransfers.length} transfer(s) • ${fromDate} → ${toDate}`}
          action={
            <TransferDialog
              onSave={saveTransfer}
            />
          }
        />

        {/* DRIVER NOTIFICATIONS */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={
              handleSendNotifications
            }
            disabled={
              sendingNotifications
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingNotifications
              ? "Sending notifications..."
              : "Send Driver Notifications"}
          </button>

          {notificationResult && (
            <div className="text-sm text-gray-700">
              {notificationResult}
            </div>
          )}
        </div>

        {/* PERSISTENT GUEST CONFIRMATION */}
        {guestConfirmationTransfers.length >
          0 && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Guest WhatsApp and email
            confirmations sent.
          </div>
        )}

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

        {/* =================================================
            DRIVER SCHEDULE
            ================================================= */}
        {driverSchedule.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-900">
                Driver Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Transfers scheduled for the
                selected date range
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {driverSchedule.map(
                (driver) => (
                  <div
                    key={driver.driverId}
                    className="px-6 py-6"
                  >
                    <div className="mb-4 text-lg font-bold text-slate-900">
                      {driver.driverName}
                    </div>

                    <div className="space-y-3">
                      {driver.transfers.map(
                        (transfer) => (
                          <div
                            key={transfer.id}
                            className="grid grid-cols-[82px_minmax(140px,1fr)_minmax(220px,2fr)_100px] items-center gap-5 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            {/* TIME */}
                            <div className="font-bold text-slate-900">
                              {formatScheduleTime(
                                transfer.time
                              )}
                            </div>

                            {/* CLIENT */}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-slate-900">
                                {transfer.clientName ||
                                  "-"}
                              </div>

                              {transfer.flight && (
                                <div className="mt-1 text-xs text-slate-500">
                                  {transfer.flight}
                                </div>
                              )}
                            </div>

                            {/* ROUTE */}
                            <div className="min-w-0 truncate text-slate-700">
                              {transfer.pickup ||
                                "-"}{" "}
                              <span className="mx-1 text-slate-400">
                                →
                              </span>
                              {transfer.destination ||
                                "-"}
                            </div>

                            {/* PRICE */}
                            <div className="text-right font-medium text-slate-900">
                              €
                              {Number(
                                transfer.price ??
                                  0
                              ).toFixed(2)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {driverSchedule.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 shadow-sm">
            No assigned driver transfers
            for the selected date range.
          </div>
        )}

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