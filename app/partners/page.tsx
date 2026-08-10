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
  const [partners, setPartners] =
    useState<Partner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedPartner, setSelectedPartner] =
    useState<Partner | null>(null);

  // Partner account dialog
  const [accountPartner, setAccountPartner] =
    useState<Partner | null>(null);

  const [accountPassword, setAccountPassword] =
    useState("");

  const [accountPasswordConfirm, setAccountPasswordConfirm] =
    useState("");

  const [accountSaving, setAccountSaving] =
    useState(false);

  async function loadPartners() {
    try {
      setLoading(true);

      const data =
        await getPartners();

      setPartners(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPartners();
  }, []);

  const filteredPartners =
    useMemo(() => {
      const q =
        search.toLowerCase();

      return partners.filter(
        (partner) =>
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

  async function handleSave(
    partner: Partner
  ) {
    const exists =
      partners.some(
        (p) => p.id === partner.id
      );

    if (exists) {
      await updatePartner(
        partner.id,
        partner
      );
    } else {
      await createPartner(
        partner
      );
    }

    setSelectedPartner(null);

    await loadPartners();
  }

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete partner?"
      )
    ) {
      return;
    }

    await deletePartner(id);

    setSelectedPartner(null);

    await loadPartners();
  }

  function handleCreateAccount(
    partner: Partner
  ) {
    if (!partner.email) {
      alert(
        "Partner must have an email address."
      );
      return;
    }

    setAccountPartner(partner);
    setAccountPassword("");
    setAccountPasswordConfirm("");
  }

  function closeAccountDialog() {
    if (accountSaving) {
      return;
    }

    setAccountPartner(null);
    setAccountPassword("");
    setAccountPasswordConfirm("");
  }

  async function submitCreateAccount() {
    if (!accountPartner) {
      return;
    }

    if (!accountPartner.email) {
      alert(
        "Partner must have an email address."
      );
      return;
    }

    if (!accountPassword) {
      alert(
        "Please enter a password."
      );
      return;
    }

    if (accountPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      accountPassword !==
      accountPasswordConfirm
    ) {
      alert(
        "Passwords do not match."
      );
      return;
    }

    try {
      setAccountSaving(true);

      const response =
        await fetch(
          "/api/partners/create-account",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              partnerId:
                accountPartner.id,
              password:
                accountPassword,
            }),
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Failed to create partner account."
        );
      }

      alert(
        accountPartner.userId
          ? `Password updated for ${accountPartner.email}.`
          : `Partner account created for ${accountPartner.email}.`
      );

      closeAccountDialog();

      await loadPartners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create partner account."
      );
    } finally {
      setAccountSaving(false);
    }
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

        <SearchInput
          value={search}
          onChange={setSearch}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            Loading partners...
          </div>
        ) : (
          <PartnerTable
            partners={
              filteredPartners
            }
            onEdit={
              setSelectedPartner
            }
            onDelete={
              handleDelete
            }
            onCreateAccount={
              handleCreateAccount
            }
          />
        )}

        <PartnerDialog
          hideTrigger
          partner={
            selectedPartner
          }
          onSave={handleSave}
        />

      </div>

      {/* Partner Account Dialog */}

      {accountPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="border-b px-6 py-5">

              <h2 className="text-xl font-bold text-slate-900">
                {accountPartner.userId
                  ? "Set Partner Password"
                  : "Create Partner Account"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {accountPartner.userId
                  ? "Set a new password for this existing partner account."
                  : "Create login credentials for this partner."}
              </p>

            </div>

            {/* Body */}

            <div className="space-y-5 p-6">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Partner
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <div className="font-semibold text-slate-900">
                    {accountPartner.name}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {accountPartner.email}
                  </div>

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={accountPassword}
                  onChange={(e) =>
                    setAccountPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Minimum 6 characters.
                </p>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={
                    accountPasswordConfirm
                  }
                  onChange={(e) =>
                    setAccountPasswordConfirm(
                      e.target.value
                    )
                  }
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

              </div>

            </div>

            {/* Footer */}

            <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={
                  closeAccountDialog
                }
                disabled={accountSaving}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  submitCreateAccount
                }
                disabled={
                  accountSaving
                }
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {accountSaving
                  ? "Saving..."
                  : accountPartner.userId
                  ? "Update Password"
                  : "Create Account"}
              </button>

            </div>

          </div>

        </div>
      )}

    </AppLayout>
  );
}