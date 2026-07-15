"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface TransferDialogProps {
  transfer?: Transfer | null;
  onSave: (transfer: Transfer) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  hideTrigger?: boolean;
}

export default function TransferDialog({
  transfer: editingTransfer,
  onSave,
  onDelete,
  hideTrigger = false,
}: TransferDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const [transfer, setTransfer] =
    useState<Transfer>(createEmptyTransfer());

  const isEditing =
    editingTransfer !== null &&
    editingTransfer !== undefined;

  useEffect(() => {
    if (editingTransfer) {
      setTransfer(editingTransfer);
      setOpen(true);
    }
  }, [editingTransfer]);

  async function handleSave() {
    try {
      setSaving(true);

      await onSave(transfer);

      setOpen(false);

      setTransfer(createEmptyTransfer());
    } finally {
      setSaving(false);
    }
  }

  function handleDuplicate() {
    setTransfer({
      ...transfer,

      id: crypto.randomUUID(),

      transferNumber: generateTransferNumber(),

      status: "New",
    });
  }

  async function handleDelete() {
    if (!onDelete) return;

    try {
      setSaving(true);

      await onDelete(transfer.id);

      setConfirmDelete(false);

      setOpen(false);

      setTransfer(createEmptyTransfer());
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setTransfer(createEmptyTransfer());
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        {!hideTrigger && (
  <DialogTrigger
    render={
      <Button>
        + New Transfer
      </Button>
    }
  />
)}

        <DialogContent className="max-w-5xl">

          <DialogHeader>

            <DialogTitle>

              {isEditing
                ? "Edit Transfer"
                : "New Transfer"}

            </DialogTitle>

          </DialogHeader>

          <TransferForm
            transfer={transfer}
            setTransfer={setTransfer}
          />

          <div className="mt-8 flex justify-between">

            <div className="flex gap-3">

              {isEditing && (
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
                : isEditing
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

              <br />
              <br />

              <strong>
                {transfer.clientName}
              </strong>

              <br />

              {transfer.pickup}

              <br />

              ↓

              <br />

              {transfer.destination}

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