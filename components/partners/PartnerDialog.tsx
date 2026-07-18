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
    useState(createEmptyPartner());

  const editing = !!partner;

  useEffect(() => {
    if (partner) {
      setCurrentPartner(partner);
      setOpen(true);
    } else {
      setCurrentPartner(createEmptyPartner());
    }
  }, [partner]);

  async function handleSave() {
    try {
      setSaving(true);
      await onSave(currentPartner);
      setOpen(false);
      setCurrentPartner(createEmptyPartner());
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
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-xl">

          <DialogHeader>

            <DialogTitle>
              {editing
                ? "Edit Partner"
                : "New Partner"}
            </DialogTitle>

          </DialogHeader>

          <PartnerForm
            partner={currentPartner}
            setPartner={setCurrentPartner}
          />

          <div className="mt-6 flex justify-end">

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