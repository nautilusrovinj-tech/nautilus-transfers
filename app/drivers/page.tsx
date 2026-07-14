"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DriverDialog from "@/components/drivers/DriverDialog";
import DriverTable from "@/components/drivers/DriverTable";

import { Driver } from "@/types/driver";
import { drivers as initialDrivers } from "@/data/drivers";

export default function DriversPage() {
  const [drivers, setDrivers] =
    useState<Driver[]>(initialDrivers);

  function handleSave(driver: Driver) {
    setDrivers((prev) => [...prev, driver]);
  }

  function handleDelete(id: string) {
    setDrivers((prev) =>
      prev.filter((driver) => driver.id !== id)
    );
  }

  function handleEdit(driver: Driver) {
    console.log("Edit:", driver);
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

        <DriverTable
          drivers={drivers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </AppLayout>
  );
}