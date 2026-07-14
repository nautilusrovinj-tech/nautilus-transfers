"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DriverDialog from "@/components/drivers/DriverDialog";
import DriverTable from "@/components/drivers/DriverTable";

import { Driver } from "@/types/driver";
import { getDrivers } from "@/lib/services/driverService";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingDriver, setEditingDriver] =
    useState<Driver | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave(driver: Driver) {
    // We will connect Save to Supabase next.
    console.log(driver);

    setEditingDriver(null);
  }

  async function handleDelete(id: string) {
    // We will connect Delete to Supabase next.
    console.log(id);
  }

  function handleEdit(driver: Driver) {
    setEditingDriver(driver);
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

          <DriverDialog
            driver={editingDriver}
            onSave={handleSave}
          />
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