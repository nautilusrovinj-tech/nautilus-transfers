"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";

interface Props {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export function getVehicleColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Vehicle>[] {
  return [
    {
      accessorKey: "name",
      header: "Vehicle",
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "plate",
      header: "Registration",
    },
    {
      accessorKey: "seats",
      header: "Seats",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.original.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.active
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onEdit(row.original)
            }
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(row.original.id)
            }
          >
            Delete
          </Button>

        </div>
      ),
    },
  ];
}