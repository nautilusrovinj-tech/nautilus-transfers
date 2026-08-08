"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PartnerForm from "./PartnerForm";

import { Partner } from "@/types/partner";
import { createEmptyPartner } from "@/lib/partner";

interface Props {
  partner?: Partner | null;
  onSave: (partner: Partner) => Promise<void>;
  hideTrigger?: boolean;
}

export default function PartnerDialog({
  partner,
  onSave,
  hideTrigger = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPartner, setCurrentPartner] =
    useState<Partner>(createEmptyPartner());

  const editing = !!partner;

  useEffect(() => {
    if (partner) {
      setCurrentPartner(partner);
      setOpen(true);
    } else {
      setCurrentPartner(createEmptyPartner());
    }
  }, [partner]);

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setCurrentPartner(createEmptyPartner());
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      await onSave(currentPartner);

      setOpen(false);

      setCurrentPartner(createEmptyPartner());
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ??
          JSON.stringify(error, null, 2)
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {!hideTrigger && (
        <Button
          onClick={() => {
            setCurrentPartner(createEmptyPartner());
            setOpen(true);
          }}
        >
          New Partner
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">

          {/* Header */}

          <div className="border-b bg-white px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editing
                  ? "Edit Partner"
                  : "New Partner"}
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500">
                Enter partner information.
              </p>
            </DialogHeader>
          </div>

          {/* Body */}

          <div className="p-6">
            <PartnerForm
              partner={currentPartner}
              setPartner={setCurrentPartner}
            />
          </div>

          {/* Footer */}

          <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Partner"
                : "Save Partner"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}