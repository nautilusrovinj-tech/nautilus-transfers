"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Driver } from "@/types/driver";

interface Props {
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export function getDriverColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Driver>[] {
  return [
    {
      accessorKey: "name",
      header: "Driver",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) =>
        row.original.email || "-",
    },
    {
      accessorKey: "languages",
      header: "Languages",
      cell: ({ row }) =>
        row.original.languages || "-",
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