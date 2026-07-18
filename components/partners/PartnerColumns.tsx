"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Partner } from "@/types/partner";

interface Props {
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

export function getPartnerColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Partner>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "commission",
      header: "Commission",
    },
    {
      accessorKey: "active",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">

          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original)}
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