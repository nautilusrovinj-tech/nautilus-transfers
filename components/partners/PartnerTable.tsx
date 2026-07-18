"use client";

import { Partner } from "@/types/partner";

import EmptyState from "@/components/ui/EmptyState";
import { DataTable } from "@/components/table/DataTable";
import { getPartnerColumns } from "./PartnerColumns";

interface Props {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

export default function PartnerTable({
  partners,
  onEdit,
  onDelete,
}: Props) {
  if (partners.length === 0) {
    return (
      <EmptyState
        title="No partners found"
        description="Create your first partner or adjust your search."
      />
    );
  }

  return (
    <DataTable
      columns={getPartnerColumns({
        onEdit,
        onDelete,
      })}
      data={partners}
    />
  );
}