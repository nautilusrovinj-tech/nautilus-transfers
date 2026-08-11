"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { Driver } from "@/types/driver";

interface DriverDocumentStatus {
  total: number;
  expired: number;
  expiringSoon: number;
}

interface Props {
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;

  documentStatus: Record<
    string,
    DriverDocumentStatus
  >;
}

export function getDriverColumns({
  onEdit,
  onDelete,
  documentStatus,
}: Props): ColumnDef<Driver>[] {
  return [
    {
      accessorKey: "name",
      header: "Driver",

      cell: ({ row }) => (
        <Link
          href={`/drivers/${row.original.id}`}
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          {row.original.name}
        </Link>
      ),
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
      id: "documents",
      header: "Documents",

      enableSorting: false,

      cell: ({ row }) => {
        const status =
          documentStatus[
            row.original.id
          ];

        if (!status) {
          return (
            <span className="text-sm text-slate-400">
              Checking...
            </span>
          );
        }

        if (status.total === 0) {
          return (
            <Link
              href={`/drivers/${row.original.id}`}
              className="text-sm font-medium text-slate-400 hover:text-slate-700"
            >
              No documents
            </Link>
          );
        }

        if (status.expired > 0) {
          return (
            <Link
              href={`/drivers/${row.original.id}`}
              className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
            >
              {status.expired} Expired
            </Link>
          );
        }

        if (status.expiringSoon > 0) {
          return (
            <Link
              href={`/drivers/${row.original.id}`}
              className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-200"
            >
              {status.expiringSoon} Expiring soon
            </Link>
          );
        }

        return (
          <Link
            href={`/drivers/${row.original.id}`}
            className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200"
          >
            Valid
          </Link>
        );
      },
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
        <div className="flex items-center justify-end gap-2">

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