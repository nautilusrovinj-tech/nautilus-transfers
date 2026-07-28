"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import VehicleTable from "@/components/vehicles/VehicleTable";
import VehicleDialog from "@/components/vehicles/VehicleDialog";
import SearchInput from "@/components/common/SearchInput";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "@/services/vehicles";

import { Vehicle } from "@/types/vehicle";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  async function loadVehicles() {
    try {
      setLoading(true);

      const data = await getVehicles();

      setVehicles(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const q = search.toLowerCase();

    return vehicles.filter((vehicle) =>
      [
        vehicle.name,
        vehicle.brand,
        vehicle.model,
        vehicle.plate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [vehicles, search]);

  async function handleSave(vehicle: Vehicle) {
    const exists = vehicles.some(
      (v) => v.id === vehicle.id
    );

    if (exists) {
      await updateVehicle(
        vehicle.id,
        vehicle
      );
    } else {
      await createVehicle(vehicle);
    }

    setSelectedVehicle(null);

    await loadVehicles();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete vehicle?"))
      return;

    await deleteVehicle(id);

    setSelectedVehicle(null);

    await loadVehicles();
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Vehicles"
          subtitle={`${filteredVehicles.length} vehicle(s)`}
          action={
            <VehicleDialog
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
            Loading vehicles...
          </div>
        ) : (
          <VehicleTable
            vehicles={filteredVehicles}
            onEdit={setSelectedVehicle}
            onDelete={handleDelete}
          />
        )}

        <VehicleDialog
          hideTrigger
          vehicle={selectedVehicle}
          onSave={handleSave}
        />

      </div>
    </AppLayout>
  );
}