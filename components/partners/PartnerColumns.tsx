"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Partner } from "@/types/partner";

interface Props {
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onCreateAccount: (
    partner: Partner
  ) => Promise<void>;
}

export function getPartnerColumns({
  onEdit,
  onDelete,
  onCreateAccount,
}: Props): ColumnDef<Partner>[] {
  return [
    {
      accessorKey: "name",
      header: "Partner",
    },

    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) =>
        row.original.phone || "-",
    },

    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) =>
        row.original.email || "-",
    },

    {
      accessorKey: "commission",
      header: "Commission",
      cell: ({ row }) =>
        `${row.original.commission}%`,
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
      id: "portal",
      header: "Portal",
      enableSorting: false,
      cell: ({ row }) => {
        const partner =
          row.original;

        if (partner.userId) {
          return (
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Account Active
            </span>
          );
        }

        return (
          <Button
            size="sm"
            variant="outline"
            disabled={
              !partner.email
            }
            onClick={() =>
              onCreateAccount(
                partner
              )
            }
          >
            Create Account
          </Button>
        );
      },
    },

    {
      id: "actions",
      header: "",
      enableSorting: false,

      cell: ({ row }) => (
        <div className="flex gap-2">

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