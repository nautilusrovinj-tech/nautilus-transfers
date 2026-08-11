"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<Vehicle | null>(
    null
  );

  async function loadVehicles() {
    try {
      setLoading(true);

      const data =
        await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(
        "Load vehicles error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  const filteredVehicles =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      if (!q) {
        return vehicles;
      }

      return vehicles.filter(
        (vehicle) =>
          [
            vehicle.name,
            vehicle.registration,
            String(
              vehicle.seats
            ),
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
      );
    }, [
      vehicles,
      search,
    ]);

  async function handleSave(
    vehicle: Vehicle
  ) {
    const exists =
      vehicles.some(
        (v) =>
          v.id === vehicle.id
      );

    try {
      if (exists) {
        await updateVehicle(
          vehicle.id,
          vehicle
        );
      } else {
        await createVehicle(
          vehicle
        );
      }

      setSelectedVehicle(null);

      await loadVehicles();
    } catch (error) {
      console.error(
        "Save vehicle error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save vehicle."
      );

      throw error;
    }
  }

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete vehicle?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicle(id);

      setSelectedVehicle(null);

      await loadVehicles();
    } catch (error) {
      console.error(
        "Delete vehicle error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete vehicle."
      );
    }
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
            vehicles={
              filteredVehicles
            }
            onEdit={
              setSelectedVehicle
            }
            onDelete={
              handleDelete
            }
          />
        )}

        <VehicleDialog
          hideTrigger
          vehicle={
            selectedVehicle
          }
          onSave={handleSave}
        />

      </div>

    </AppLayout>
  );
}