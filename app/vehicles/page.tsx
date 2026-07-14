"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import VehicleDialog from "@/components/vehicles/VehicleDialog";
import VehicleTable from "@/components/vehicles/VehicleTable";

import { Vehicle } from "@/types/vehicle";
import { vehicles as initialVehicles } from "@/data/vehicles";

export default function VehiclesPage() {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>(initialVehicles);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  function handleSave(vehicle: Vehicle) {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id ? vehicle : v
        )
      );

      setEditingVehicle(null);
    } else {
      setVehicles((prev) => [...prev, vehicle]);
    }
  }

  function handleDelete(id: string) {
    setVehicles((prev) =>
      prev.filter((vehicle) => vehicle.id !== id)
    );
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Vehicles
            </h1>

            <p className="text-slate-500">
              Manage your vehicles.
            </p>
          </div>

          <VehicleDialog
            vehicle={editingVehicle}
            onSave={handleSave}
          />
        </div>

        <VehicleTable
          vehicles={vehicles}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </AppLayout>
  );
}