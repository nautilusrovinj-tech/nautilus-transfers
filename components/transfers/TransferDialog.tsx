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

import TransferForm from "./TransferForm";

import { Transfer } from "@/types/transfer";
import { createEmptyTransfer } from "@/lib/transfer";

interface TransferDialogProps {
  transfer?: Transfer | null;
  onSave: (transfer: Transfer) => void;
  hideTrigger?: boolean;
}

export default function TransferDialog({
  transfer: editingTransfer,
  onSave,
  hideTrigger = false,
}: TransferDialogProps) {
  const [open, setOpen] = useState(false);

  const [transfer, setTransfer] = useState<Transfer>(
    createEmptyTransfer()
  );

  useEffect(() => {
    if (editingTransfer) {
      setTransfer(editingTransfer);
      setOpen(true);
    }
  }, [editingTransfer]);

  function handleSave() {
    onSave(transfer);

    setTransfer(createEmptyTransfer());

    setOpen(false);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setTransfer(createEmptyTransfer());
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>

      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button>
            + New Transfer
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editingTransfer
              ? "Edit Transfer"
              : "New Transfer"}
          </DialogTitle>
        </DialogHeader>

        <TransferForm
          transfer={transfer}
          setTransfer={setTransfer}
        />

        <Button
          className="mt-6 w-full"
          onClick={handleSave}
        >
          {editingTransfer
            ? "Update Transfer"
            : "Save Transfer"}
        </Button>
      </DialogContent>

    </Dialog>
  );
}