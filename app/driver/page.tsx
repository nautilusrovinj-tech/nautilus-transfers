"use client";

import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    const supabase = createClient();

    loadTransfers();

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
          loadTransfers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadTransfers() {
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

      const today = new Date().toISOString().split("T")[0];

      const data = await getDriverTransfers(
        driver.id,
        today
      );

      data.sort((a, b) => a.time.localeCompare(b.time));

      setTransfers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const currentTransfer = useMemo(() => {
    return (
      transfers.find(
        (t) => t.status === "In Progress"
      ) ?? null
    );
  }, [transfers]);

  const nextTransfer = useMemo(() => {
    return (
      transfers.find(
        (t) =>
          t.status === "Assigned" ||
          t.status === "Confirmed"
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
        t.status === "Assigned" ||
        t.status === "Confirmed"
    );
  }, [transfers]);

  return (
    <DriverLayout>
      <div className="space-y-6">

        <DriverHeader
          name={driverName}
          count={transfers.length}
        />

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
                All Transfers Completed
              </h2>

              <p className="mt-3 text-slate-500">
                Excellent work today.
              </p>

            </div>
          )}

        {currentTransfer && (
          <div className="sticky top-4 z-20">

            <div className="mb-3 rounded-xl bg-blue-600 py-2 text-center text-sm font-bold tracking-wide text-white">
              CURRENT TRANSFER
            </div>

            <DriverTransferCard
              transfer={currentTransfer}
              onComplete={loadTransfers}
            />

          </div>
        )}

        {!currentTransfer &&
          nextTransfer && (
            <>
              <div className="rounded-xl bg-slate-900 py-2 text-center text-sm font-bold tracking-wide text-white">
                NEXT TRANSFER
              </div>

              <DriverTransferCard
                transfer={nextTransfer}
                onComplete={loadTransfers}
              />
            </>
          )}

        {upcoming.length > 1 && (
          <div className="rounded-3xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              Upcoming Transfers
            </h2>

            <div className="space-y-3">

              {upcoming.slice(1).map((transfer) => (
                <div
                  key={transfer.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">

                    <div>

                      <div className="text-xl font-bold">
                        {transfer.time}
                      </div>

                      <div className="mt-1 font-medium">
                        {transfer.clientName}
                      </div>

                    </div>

                    <div className="text-right text-sm text-slate-500">
                      {transfer.pickup}
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>
        )}

      </div>
    </DriverLayout>
  );
}