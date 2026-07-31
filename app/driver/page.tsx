"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import DriverLayout from "@/components/layout/DriverLayout";
import DriverHeader from "@/components/driver/DriverHeader";
import DriverTransferCard from "@/components/driver/DriverTransferCard";

import { createClient } from "@/lib/supabase/client";
import { getDriverByEmail } from "@/services/drivers";
import { getDriverTransfers } from "@/services/transfers";

import { Transfer } from "@/types/transfer";

export default function DriverPage() {
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadTransfers = useCallback(
    async (date: string = selectedDate) => {
      try {
        setLoading(true);

        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.email) return;

        const driver = await getDriverByEmail(user.email);

        if (!driver) return;

        setDriverName(driver.name);

        const data = await getDriverTransfers(
          driver.id,
          date
        );

        data.sort((a, b) =>
          a.time.localeCompare(b.time)
        );

        setTransfers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    const supabase = createClient();

    void loadTransfers(selectedDate);

    const channel = supabase
      .channel("driver-transfers")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transfers",
        },
        () => {
          void loadTransfers(selectedDate);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTransfers, selectedDate]);

  function goToday() {
    const date =
      new Date().toISOString().split("T")[0];

    setSelectedDate(date);

    void loadTransfers(date);
  }

  function goTomorrow() {
    const d = new Date();

    d.setDate(d.getDate() + 1);

    const date =
      d.toISOString().split("T")[0];

    setSelectedDate(date);

    void loadTransfers(date);
  }

  const currentTransfer = useMemo(() => {
    return (
      transfers.find(
        (t) => t.status === "In Progress"
      ) ?? null
    );
  }, [transfers]);


  const completed = useMemo(() => {
    return transfers.filter(
      (t) => t.status === "Completed"
    ).length;
  }, [transfers]);

  const remaining = useMemo(() => {
    return transfers.filter(
      (t) =>
        t.status !== "Completed" &&
        t.status !== "Cancelled"
    ).length;
  }, [transfers]);

  const upcoming = useMemo(() => {
    return transfers.filter(
      (t) =>
        (t.status === "Assigned" ||
          t.status === "Confirmed") &&
        t.id !== currentTransfer?.id
    );
  }, [transfers, currentTransfer]);

  return (
        <DriverLayout>
      <div className="space-y-6">

        <DriverHeader
          name={driverName}
          count={transfers.length}
        />

        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow">

          <button
            onClick={goToday}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-white"
          >
            Today
          </button>

          <button
            onClick={goTomorrow}
            className="rounded-xl bg-slate-200 px-5 py-2.5"
          >
            Tomorrow
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              void loadTransfers(e.target.value);
            }}
            className="rounded-xl border border-slate-300 px-4 py-2.5"
          />

        </div>

        {/* Daily Summary */}

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-3xl bg-white p-5 shadow">

            <div className="text-sm text-slate-500">
              Completed
            </div>

            <div className="mt-2 text-4xl font-bold">
              {completed}
            </div>

          </div>

          <div className="rounded-3xl bg-white p-5 shadow">

            <div className="text-sm text-slate-500">
              Remaining
            </div>

            <div className="mt-2 text-4xl font-bold">
              {remaining}
            </div>

          </div>

        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            Loading...
          </div>
        )}

        {!loading &&
          transfers.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center shadow">

              <h2 className="text-3xl font-bold">
                No Transfers
              </h2>

              <p className="mt-3 text-slate-500">
                No transfers scheduled for this date.
              </p>

            </div>
          )}

{currentTransfer && (
  <div className="rounded-3xl border-2 border-blue-600 bg-blue-50/40 p-4 shadow-lg">

    <div className="mb-4 rounded-xl bg-blue-700 py-3 text-center text-base font-bold tracking-wider text-white">
      CURRENT TRANSFER
    </div>

    <DriverTransferCard
      transfer={currentTransfer}
      onComplete={loadTransfers}
    />

  </div>
)}


{upcoming.length > 0 && (
  <div className="space-y-4">

    <div className="rounded-xl bg-slate-900 py-2 text-center text-sm font-bold tracking-wide text-white">
      UPCOMING TRANSFERS
    </div>

    {upcoming.map((transfer) => (
      <DriverTransferCard
        key={transfer.id}
        transfer={transfer}
        onComplete={() =>
          loadTransfers(selectedDate)
        }
      />
    ))}

  </div>
)}

{completed > 0 && (
  <div className="space-y-4">

    <div className="rounded-xl bg-green-700 py-2 text-center text-sm font-bold tracking-wide text-white">
      COMPLETED TODAY
    </div>

    {transfers
      .filter((t) => t.status === "Completed")
      .map((transfer) => (
        <DriverTransferCard
          key={transfer.id}
          transfer={transfer}
        />
      ))}

  </div>
)}

      </div>
    </DriverLayout>
     );
    }