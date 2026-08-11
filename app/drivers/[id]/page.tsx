"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import { getDriverById } from "@/services/drivers";
import { Driver } from "@/types/driver";

import DriverDocumentTab from "@/components/drivers/DriverDocumentTab";

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();

  const driverId = params.id as string;

  const [driver, setDriver] =
    useState<Driver | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDriver() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDriverById(driverId);

      setDriver(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load driver."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (driverId) {
      void loadDriver();
    }
  }, [driverId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            Loading driver...
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !driver) {
    return (
      <AppLayout>
        <div className="p-8">

          <button
            type="button"
            onClick={() =>
              router.push("/drivers")
            }
            className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Drivers
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error ||
              "Driver not found."}
          </div>

        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-8">

        {/* Header */}

        <div>

          <button
            type="button"
            onClick={() =>
              router.push("/drivers")
            }
            className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Drivers
          </button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Driver
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {driver.name}
              </h1>

              <p className="mt-1 text-slate-500">
                {driver.phone}
                {driver.email
                  ? ` · ${driver.email}`
                  : ""}
              </p>

            </div>

            <div
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                driver.active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {driver.active
                ? "Active"
                : "Inactive"}
            </div>

          </div>

        </div>

        {/* Driver Information */}

        <div className="grid gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Role
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {driver.role}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Languages
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {driver.languages ||
                "—"}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Base Location
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {driver.baseLocation ||
                "—"}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Max Passengers
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {driver.maxPassengers ||
                "—"}
            </p>

          </div>

        </div>

        {/* Documents */}

        <DriverDocumentTab
          driverId={driver.id}
        />

      </div>
    </AppLayout>
  );
}