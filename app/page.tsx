"use client";

import AppLayout from "@/components/layout/AppLayout";
import StatsCard from "@/components/dashboard/StatsCard";

import { drivers } from "@/data/drivers";
import { vehicles } from "@/data/vehicles";
import { partners } from "@/data/partners";

export default function Home() {
  const activeDrivers = drivers.filter(
    (d) => d.active
  ).length;

  const activeVehicles = vehicles.filter(
    (v) => v.active
  ).length;

  const activePartners = partners.filter(
    (p) => p.active
  ).length;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Welcome back.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Today's Transfers"
            value={0}
          />

          <StatsCard
            title="Active Drivers"
            value={activeDrivers}
          />

          <StatsCard
            title="Active Vehicles"
            value={activeVehicles}
          />

          <StatsCard
            title="Active Partners"
            value={activePartners}
          />
        </div>
      </div>
    </AppLayout>
  );
}