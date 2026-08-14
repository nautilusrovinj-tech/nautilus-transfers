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

const TODAY = new Date()
  .toISOString()
  .split("T")[0];

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

  const [
    editingTransfer,
    setEditingTransfer,
  ] = useState<Transfer | null>(null);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    fromDate,
    setFromDate,
  ] = useState(TODAY);

  const [
    toDate,
    setToDate,
  ] = useState(TODAY);

  const [
    sendingNotifications,
    setSendingNotifications,
  ] = useState(false);

  const [
    notificationResult,
    setNotificationResult,
  ] = useState<string | null>(null);

  const filteredTransfers =
    useMemo(() => {
      return transfers.filter((t) => {
        /*
         * NEW PARTNER REQUESTS
         */
        const isNewPartnerRequest =
          t.status === "New" &&
          !!t.partnerId;

        if (isNewPartnerRequest) {
          if (search.trim()) {
            const value =
              search.toLowerCase();

            const found = [
              t.transferNumber,
              t.clientName,
              t.phone,
              t.flight,
              t.pickup,
              t.destination,
              getDriverName(
                t.driverId
              ),
              getVehicleName(
                t.vehicleId
              ),
              getPartnerName(
                t.partnerId
              ),
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
          (fromDate &&
            t.date < fromDate) ||
          (toDate &&
            t.date > toDate)
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
          const value =
            search.toLowerCase();

          const found = [
            t.transferNumber,
            t.clientName,
            t.phone,
            t.flight,
            t.pickup,
            t.destination,
            getDriverName(
              t.driverId
            ),
            getVehicleName(
              t.vehicleId
            ),
            getPartnerName(
              t.partnerId
            ),
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

  async function handleSendNotifications() {
    try {
      setSendingNotifications(true);
      setNotificationResult(null);

      const response =
        await fetch(
          "/api/notifications/run",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

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
        data.remindersSent?.length ??
        0;

      const failedCount =
        data.failed?.length ?? 0;

      const reminderFailedCount =
        data.remindersFailed?.length ??
        0;

      setNotificationResult(
        `Done: ${sentCount} new notification(s), ${reminderCount} reminder(s), ${failedCount + reminderFailedCount} failed.`
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
   *
   * This is calculated directly from the
   * transfers loaded from Supabase.
   *
   * Therefore it survives page refresh.
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

        {/* Driver notifications */}

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

        {/*
         * PERSISTENT GUEST CONFIRMATION
         *
         * This message is based on data stored
         * in Supabase and therefore remains after
         * refreshing the page.
         */}

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

        <DispatchBoard
          transfers={filteredTransfers}
          onEdit={
            setEditingTransfer
          }
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
          transfer={
            editingTransfer
          }
          onSave={
            saveTransfer
          }
          onDelete={
            removeTransfer
          }
          hideTrigger
        />

      </div>

    </AppLayout>
  );
}