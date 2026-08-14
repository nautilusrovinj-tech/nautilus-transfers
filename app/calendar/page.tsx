"use client";

import {
  Suspense,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import CalendarToolbar from "@/components/calendar/CalendarToolbar";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import CalendarViewToggle from "@/components/calendar/CalendarViewToggle";
import CalendarStats from "@/components/calendar/CalendarStats";
import CalendarStatusLegend from "@/components/calendar/CalendarStatusLegend";
import HourTimeline from "@/components/calendar/HourTimeline";
import CalendarTimeline from "@/components/calendar/CalendarTimeline";
import DriverLaneView from "@/components/calendar/DriverLaneView";
import DriverSchedule from "@/components/calendar/DriverSchedule";
import DriverWorkload from "@/components/calendar/DriverWorkload";
import UnassignedTransfers from "@/components/calendar/UnassignedTransfers";
import TransferDialog from "@/components/transfers/TransferDialog";

import { useTransfers } from "@/hooks/useTransfers";
import { useLookups } from "@/hooks/useLookups";

import { Transfer } from "@/types/transfer";

function CalendarContent() {
  const {
    transfers,
    saveTransfer,
    removeTransfer,
    updateDriver,
    updateVehicle,
  } = useTransfers();

  const {
    getDriverPhone,
  } = useLookups();

  const searchParams =
    useSearchParams();

  const initialDate =
    searchParams.get("date") ??
    new Date()
      .toISOString()
      .split("T")[0];

  const [date, setDate] =
    useState(initialDate);

  const [status, setStatus] =
    useState("All");

  const [view, setView] =
    useState<"cards" | "timeline">(
      "cards"
    );

  const [
    editingTransfer,
    setEditingTransfer,
  ] = useState<Transfer | null>(null);

  const dayTransfers = useMemo(() => {
    return transfers
      .filter((t) => {
        if (t.date !== date) {
          return false;
        }

        if (
          status !== "All" &&
          t.status !== status
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );
  }, [
    transfers,
    date,
    status,
  ]);

  const stats = useMemo(() => {
    return {
      transfers:
        dayTransfers.length,

      arrivals:
        dayTransfers.filter(
          (t) =>
            t.transferType ===
            "Arrival"
        ).length,

      departures:
        dayTransfers.filter(
          (t) =>
            t.transferType ===
            "Departure"
        ).length,

      revenue:
        dayTransfers.reduce(
          (sum, t) =>
            sum +
            Number(t.price ?? 0),
          0
        ),
    };
  }, [dayTransfers]);

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Daily Planner"
          subtitle="Daily planning and driver allocation"
          action={
            <TransferDialog
              onSave={saveTransfer}
            />
          }
        />

        <CalendarToolbar
          date={date}
          onDateChange={setDate}
        />

        <div className="flex items-center justify-between">

          <CalendarFilters
            status={status}
            onStatusChange={setStatus}
          />

          <CalendarViewToggle
            view={view}
            onChange={setView}
          />

        </div>

        <CalendarStats
          transfers={stats.transfers}
          arrivals={stats.arrivals}
          departures={stats.departures}
          revenue={stats.revenue}
        />

        <CalendarStatusLegend />

        {view === "timeline" ? (
          <>
            <HourTimeline />

            <DriverLaneView
              transfers={dayTransfers}
            />
          </>
        ) : (
          <CalendarTimeline
            transfers={dayTransfers}
            getDriverPhone={(driverId) =>
              getDriverPhone(
                driverId ?? undefined
              )
            }
            onEdit={
              setEditingTransfer
            }
            onAssignDriver={
              updateDriver
            }
            onAssignVehicle={
              updateVehicle
            }
          />
        )}

        <div className="grid gap-6 xl:grid-cols-2">

          <DriverSchedule
            transfers={dayTransfers}
          />

          <DriverWorkload
            transfers={dayTransfers}
          />

        </div>

        <UnassignedTransfers
          transfers={dayTransfers}
        />

        <TransferDialog
          transfer={
            editingTransfer
          }
          onSave={saveTransfer}
          onDelete={removeTransfer}
          hideTrigger
        />

      </div>
    </AppLayout>
  );
}

export default function CalendarPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="p-8">
            Loading...
          </div>
        </AppLayout>
      }
    >
      <CalendarContent />
    </Suspense>
  );
}