/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import TransferForm from "./TransferForm";

import { Transfer } from "@/types/transfer";
import {
  createEmptyTransfer,
  generateTransferNumber,
} from "@/lib/transfer";

interface Props {
  transfer?: Transfer | null;
  onSave: (transfer: Transfer) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  hideTrigger?: boolean;
}

export default function TransferDialog({
  transfer,
  onSave,
  onDelete,
  hideTrigger = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [currentTransfer, setCurrentTransfer] =
    useState<Transfer>(createEmptyTransfer());

  const editing =
    transfer !== null &&
    transfer !== undefined;

  useEffect(() => {
    if (transfer) {
      setCurrentTransfer(transfer);
      setOpen(true);
    }
  }, [transfer]);

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setCurrentTransfer(createEmptyTransfer());
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      await onSave(currentTransfer);

      setOpen(false);

      setCurrentTransfer(createEmptyTransfer());
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;

    try {
      setSaving(true);

      await onDelete(currentTransfer.id);

      setConfirmDelete(false);

      setOpen(false);

      setCurrentTransfer(createEmptyTransfer());
    } finally {
      setSaving(false);
    }
  }

  function handleDuplicate() {
    setCurrentTransfer({
      ...currentTransfer,
      id: crypto.randomUUID(),
      transferNumber: generateTransferNumber(),
      status: "New",
    });
  }

  return (
    <>
      {!hideTrigger && (
        <Button
          onClick={() => {
            setCurrentTransfer(createEmptyTransfer());
            setOpen(true);
          }}
        >
          New Transfer
        </Button>
      )}

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <DialogContent className="max-h-[92vh] w-[96vw] max-w-7xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit Transfer"
                : "New Transfer"}
            </DialogTitle>
          </DialogHeader>

          <TransferForm
            transfer={currentTransfer}
            setTransfer={setCurrentTransfer}
          />

          <div className="mt-8 flex justify-between">
            <div className="flex gap-2">
              {editing && (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleDuplicate}
                  >
                    Duplicate
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      setConfirmDelete(true)
                    }
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Transfer"
                : "Save Transfer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Transfer?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}