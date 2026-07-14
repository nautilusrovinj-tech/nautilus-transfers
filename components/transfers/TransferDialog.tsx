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
}

export default function TransferDialog({
  transfer: editingTransfer,
  onSave,
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
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  + New Transfer
</DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editingTransfer ? "Edit Transfer" : "New Transfer"}
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
          {editingTransfer ? "Update Transfer" : "Save Transfer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}