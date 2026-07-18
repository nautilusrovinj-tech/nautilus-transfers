"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";

import PartnerDialog from "@/components/partners/PartnerDialog";
import PartnerTable from "@/components/partners/PartnerTable";
import SearchInput from "@/components/common/SearchInput";

import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from "@/services/partners";

import { Partner } from "@/types/partner";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedPartner, setSelectedPartner] =
    useState<Partner | null>(null);

  async function loadPartners() {
    try {
      const data = await getPartners();
      setPartners(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  const filteredPartners = useMemo(() => {
    const q = search.toLowerCase();

    return partners.filter((partner) =>
      [
        partner.name,
        partner.phone,
        partner.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [partners, search]);

  async function handleSave(partner: Partner) {
    const exists = partners.some(
      (p) => p.id === partner.id
    );

    if (exists) {
      await updatePartner(partner.id, partner);
    } else {
      await createPartner(partner);
    }

    setSelectedPartner(null);

    await loadPartners();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete partner?")) return;

    await deletePartner(id);

    setSelectedPartner(null);

    await loadPartners();
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <PageHeader
          title="Partners"
          subtitle={`${filteredPartners.length} partner(s)`}
          action={
            <PartnerDialog
              onSave={handleSave}
            />
          }
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            Loading...
          </div>
        ) : (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
            />

            <PartnerTable
              partners={filteredPartners}
              onEdit={setSelectedPartner}
              onDelete={handleDelete}
            />
          </>
        )}

        <PartnerDialog
          hideTrigger
          partner={selectedPartner}
          onSave={handleSave}
        />

      </div>
    </AppLayout>
  );
}