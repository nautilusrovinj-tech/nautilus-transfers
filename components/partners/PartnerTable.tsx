"use client";

import { Partner } from "@/types/partner";

import EmptyState from "@/components/ui/EmptyState";
import { DataTable } from "@/components/table/DataTable";
import { getPartnerColumns } from "./PartnerColumns";

interface Props {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onCreateAccount: (
    partner: Partner
  ) => void;
}

export default function PartnerTable({
  partners,
  onEdit,
  onDelete,
  onCreateAccount,
}: Props) {
  if (partners.length === 0) {
    return (
      <EmptyState
        title="No partners found"
        description="Create your first partner."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        columns={getPartnerColumns({
          onEdit,
          onDelete,
          onCreateAccount,
        })}
        data={partners}
      />
    </div>
  );
}