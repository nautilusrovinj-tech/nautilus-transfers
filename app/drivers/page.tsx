"use client";

import AppLayout from "@/components/layout/AppLayout";
import DriverTable from "@/components/drivers/DriverTable";

import { drivers } from "@/data/drivers";

export default function DriversPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Drivers
          </h1>

          <p className="text-slate-500">
            Manage your drivers.
          </p>
        </div>

        <DriverTable drivers={drivers} />
      </div>
    </AppLayout>
  );
}