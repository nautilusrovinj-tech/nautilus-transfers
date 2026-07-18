"use client";

import { Transfer } from "@/types/transfer";

import { useLookups } from "@/hooks/useLookups";

import EmptyState from "@/components/ui/EmptyState";
import { DataTable } from "@/components/table/DataTable";
import { getTransferColumns } from "./TransferColumns";

interface Props {
  transfers: Transfer[];
  onDelete: (id: string) => void;
  onEdit: (transfer: Transfer) => void;
}

export default function TransferTable({
  transfers,
  onDelete,
  onEdit,
}: Props) {
  const {
    getDriverName,
    getVehicleName,
  } = useLookups();

  const columns = getTransferColumns({
    onDelete,
    onEdit,
    getDriverName,
    getVehicleName,
  });

  if (transfers.length === 0) {
    return (
      <EmptyState
        title="No transfers found"
        description="Create your first transfer or adjust your search filters."
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={transfers}
    />
  );
}