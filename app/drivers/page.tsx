"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DriverTable from "@/components/drivers/DriverTable";
import DriverDialog from "@/components/drivers/DriverDialog";

import { Driver } from "@/types/driver";
import { drivers as initialDrivers } from "@/data/drivers";

export default function DriversPage() {
  const [drivers, setDrivers] =
    useState<Driver[]>(initialDrivers);

  function handleSave(driver: Driver) {
    setDrivers((prev) => [...prev, driver]);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Drivers
            </h1>

            <p className="text-slate-500">
              Manage your drivers.
            </p>
          </div>

          <DriverDialog onSave={handleSave} />
        </div>

        <DriverTable drivers={drivers} />
      </div>
    </AppLayout>
  );
}