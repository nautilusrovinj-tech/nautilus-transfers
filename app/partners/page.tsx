"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PartnerTable from "@/components/partners/PartnerTable";

import { Partner } from "@/types/partner";
import { partners as initialPartners } from "@/data/partners";

export default function PartnersPage() {
  const [partners] =
    useState<Partner[]>(initialPartners);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Partners
          </h1>

          <p className="text-slate-500">
            Manage your business partners.
          </p>
        </div>

        <PartnerTable partners={partners} />
      </div>
    </AppLayout>
  );
}