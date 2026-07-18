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
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status]}`}
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
      accessorKey: "transferNumber",
      header: "Transfer",
      size: 120,
    },
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
      accessorKey: "clientName",
      header: "Client",
      size: 180,
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
      size: 160,
      cell: ({ row }) =>
        getDriverName(row.original.driverId),
    },
    {
      id: "vehicle",
      header: "Vehicle",
      size: 160,
      cell: ({ row }) =>
        getVehicleName(row.original.vehicleId),
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
      size: 130,
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      size: 180,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onEdit(row.original)
            }
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
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