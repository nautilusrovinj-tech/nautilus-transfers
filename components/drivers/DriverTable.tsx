"use client";

import { Driver } from "@/types/driver";

import EmptyState from "@/components/ui/EmptyState";
import { DataTable } from "@/components/table/DataTable";
import { getDriverColumns } from "./DriverColumns";

interface Props {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
}: Props) {
  if (drivers.length === 0) {
    return (
      <EmptyState
        title="No drivers found"
        description="Create your first driver or adjust your search."
      />
    );
  }

  return (
    <DataTable
      columns={getDriverColumns({
        onEdit,
        onDelete,
      })}
      data={drivers}
    />
  );
}