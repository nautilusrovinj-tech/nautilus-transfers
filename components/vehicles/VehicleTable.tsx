"use client";

import { Vehicle } from "@/types/vehicle";

import EmptyState from "@/components/ui/EmptyState";

import { DataTable } from "@/components/table/DataTable";

import {
  getVehicleColumns,
} from "./VehicleColumns";

interface Props {
  vehicles: Vehicle[];

  onEdit: (
    vehicle: Vehicle
  ) => void;

  onDelete: (
    id: string
  ) => void;
}

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
}: Props) {
  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="No vehicles found"
        description="Create your first vehicle."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <DataTable
        columns={getVehicleColumns({
          onEdit,
          onDelete,
        })}
        data={vehicles}
      />

    </div>
  );
}