"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import DriverTable from "@/components/drivers/DriverTable";
import DriverDialog from "@/components/drivers/DriverDialog";
import SearchInput from "@/components/common/SearchInput";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "@/services/drivers";

import { Driver } from "@/types/driver";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedDriver, setSelectedDriver] =
    useState<Driver | null>(null);

  async function loadDrivers() {
    try {
      setLoading(true);

      const data = await getDrivers();

      setDrivers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    const q = search.toLowerCase();

    return drivers.filter((driver) =>
      [
        driver.name,
        driver.phone,
        driver.email,
        driver.languages,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [drivers, search]);

  async function handleSave(driver: Driver) {
    const exists = drivers.some(
      (d) => d.id === driver.id
    );

    if (exists) {
      await updateDriver(driver.id, driver);
    } else {
      await createDriver(driver);
    }

    setSelectedDriver(null);

    await loadDrivers();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete driver?"))
      return;

    await deleteDriver(id);

    setSelectedDriver(null);

    await loadDrivers();
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Drivers"
          subtitle={`${filteredDrivers.length} driver(s)`}
          action={
            <DriverDialog
              onSave={handleSave}
            />
          }
        />

        <SearchInput
          value={search}
          onChange={setSearch}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            Loading drivers...
          </div>
        ) : (
          <DriverTable
            drivers={filteredDrivers}
            onEdit={setSelectedDriver}
            onDelete={handleDelete}
          />
        )}

        <DriverDialog
          hideTrigger
          driver={selectedDriver}
          onSave={handleSave}
        />

      </div>
    </AppLayout>
  );
}