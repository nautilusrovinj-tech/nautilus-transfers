"use client";

import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-max">

          <thead className="border-b border-slate-200 bg-slate-50">

            {table.getHeaderGroups().map(
              (headerGroup) => (
                <tr key={headerGroup.id}>

                  {headerGroup.headers.map(
                    (header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:bg-slate-100"
                      >
                        <div className="flex items-center gap-2">

                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef
                                  .header,
                                header.getContext()
                              )}

                          {{
                            asc: "▲",
                            desc: "▼",
                          }[
                            header.column.getIsSorted() as string
                          ] ?? ""}

                        </div>
                      </th>
                    )
                  )}

                </tr>
              )
            )}

          </thead>

          <tbody>

            {table.getRowModel().rows.map(
              (row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >

                  {row
                    .getVisibleCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-6 py-4 text-sm text-slate-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}