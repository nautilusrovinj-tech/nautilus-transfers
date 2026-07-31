/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import AIBookingImport from "./AIBookingImport";

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
  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const [currentTransfer, setCurrentTransfer] =
    useState<Transfer>(createEmptyTransfer());

  const editing = !!transfer;

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
  
      const transferToSave: Transfer = {
        ...currentTransfer,
        status:
  currentTransfer.status === "Completed" ||
  currentTransfer.status === "In Progress" ||
  currentTransfer.status === "Cancelled"
    ? currentTransfer.status
    : currentTransfer.driverId &&
      currentTransfer.vehicleId
    ? "Assigned"
    : "New",
      };
  
      console.log("TRANSFER TO SAVE:", transferToSave);
  
      await onSave(transferToSave);
  
      setOpen(false);
      setCurrentTransfer(createEmptyTransfer());
    } catch (error) {
      console.error("SAVE ERROR:", error);
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    console.log("DELETE BUTTON CLICKED");
    console.log("Transfer ID:", currentTransfer.id);
    console.log("onDelete:", onDelete);
  
    if (!onDelete) {
      console.log("❌ onDelete is undefined");
      return;
    }
  
    try {
      setSaving(true);
  
      console.log("Calling onDelete...");
  
      await onDelete(currentTransfer.id);
  
      console.log("✅ Delete finished");
  
      setConfirmDelete(false);
      setOpen(false);
  
      setCurrentTransfer(createEmptyTransfer());
    } catch (error) {
      console.error("DELETE ERROR:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleDuplicate() {
    setCurrentTransfer({
      ...currentTransfer,
      id: crypto.randomUUID(),
      transferNumber:
        generateTransferNumber(),
      status: "New",
    });
  }

  return (
    <>
      {!hideTrigger && (
        <Button
          onClick={() => {
            setCurrentTransfer(
              createEmptyTransfer()
            );
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
        <DialogContent
          style={{
            width: "95vw",
            maxWidth: "1600px",
            height: "94vh",
          }}
          className="overflow-hidden rounded-2xl bg-white p-0"
        >
          <div className="flex h-full flex-col">

            <DialogHeader className="border-b px-8 py-6">
              <DialogTitle className="text-3xl font-bold">
                {editing
                  ? "Edit Transfer"
                  : "New Transfer"}
              </DialogTitle>

              <p className="text-slate-500">
                Manage transfer details,
                assignment and pricing.
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-8 py-8">

<AIBookingImport
  onImport={(booking) =>
    setCurrentTransfer((prev) => ({
      ...prev,

      transferType:
        booking.transferType ??
        prev.transferType,

      date:
        booking.date ??
        prev.date,

      time:
        booking.time ??
        prev.time,

      pickup:
        booking.pickup ??
        prev.pickup,

      destination:
        booking.destination ??
        prev.destination,

      clientName:
        booking.clientName ??
        prev.clientName,

      phone:
        booking.phone ??
        prev.phone,

      email:
        booking.email ??
        prev.email,

      flight:
        booking.flight ??
        prev.flight,

      adults:
        booking.adults ??
        prev.adults,

      children:
        booking.children ??
        prev.children,

      babySeats:
        booking.babySeats ??
        prev.babySeats,

      boosterSeats:
        booking.boosterSeats ??
        prev.boosterSeats,

      vehicle:
        booking.vehicle ??
        prev.vehicle,

      partner:
        booking.partner ??
        prev.partner,

      price:
        booking.price ??
        prev.price,

      notes:
        booking.notes ??
        prev.notes,
    }))
  }
/>

<TransferForm
  transfer={currentTransfer}
  setTransfer={setCurrentTransfer}
/>

</div>

            <div className="flex items-center justify-between border-t bg-slate-50 px-8 py-5">

              <div className="flex gap-3">

                {editing && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={
                        handleDuplicate
                      }
                    >
                      Duplicate
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() =>
                        setConfirmDelete(
                          true
                        )
                      }
                    >
                      Delete
                    </Button>
                  </>
                )}

              </div>

              <div className="flex gap-3">

                <Button
                  variant="outline"
                  onClick={() =>
                    setOpen(false)
                  }
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
                    ? "Update Transfer"
                    : "Save Transfer"}
                </Button>

              </div>

            </div>

          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={
          setConfirmDelete
        }
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Transfer?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be
              undone.
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