"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { Transfer } from "@/types/transfer";

interface Actions {
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  getDriverName: (id?: string) => string;
  getVehicleName: (id?: string) => string;
}

function StatusBadge({
  status,
}: {
  status: Transfer["status"];
}) {
  const colors = {
    New: "bg-slate-100 text-slate-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    "In Progress":
      "bg-amber-100 text-amber-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}

export function getTransferColumns({
  onEdit,
  onDelete,
  getDriverName,
  getVehicleName,
}: Actions): ColumnDef<Transfer>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      size: 110,
    },
    {
      accessorKey: "time",
      header: "Time",
      size: 90,
    },
    {
      accessorKey: "transferType",
      header: "Type",
      size: 110,
    },
    {
      accessorKey: "clientName",
      header: "Client",
      size: 200,
    },
    {
      accessorKey: "flight",
      header: "Flight",
      size: 120,
      cell: ({ row }) =>
        row.original.flight || "-",
    },
    {
      accessorKey: "pickup",
      header: "Pickup",
      size: 220,
    },
    {
      accessorKey: "destination",
      header: "Destination",
      size: 220,
    },
    {
      id: "driver",
      header: "Driver",
      size: 170,
      cell: ({ row }) =>
        getDriverName(
          row.original.driverId
        ) || "Unassigned",
    },
    {
      id: "vehicle",
      header: "Vehicle",
      size: 170,
      cell: ({ row }) =>
        getVehicleName(
          row.original.vehicleId
        ) || "Unassigned",
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 100,
      cell: ({ row }) =>
        `€${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 140,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      size: 170,
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
              onDelete(
                row.original.id
              )
            }
          >
            Delete
          </Button>

        </div>
      ),
    },
  ];
}