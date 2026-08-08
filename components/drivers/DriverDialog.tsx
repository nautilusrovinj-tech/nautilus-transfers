"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DriverForm from "./DriverForm";

import { Driver } from "@/types/driver";
import { createEmptyDriver } from "@/lib/driver";

interface Props {
  driver?: Driver | null;
  onSave: (driver: Driver) => Promise<void>;
  hideTrigger?: boolean;
}

export default function DriverDialog({
  driver,
  onSave,
  hideTrigger = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentDriver, setCurrentDriver] =
    useState<Driver>(createEmptyDriver());

  const editing = !!driver;

  useEffect(() => {
    if (driver) {
      setCurrentDriver(driver);
      setOpen(true);
    } else {
      setCurrentDriver(createEmptyDriver());
    }
  }, [driver]);

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setCurrentDriver(createEmptyDriver());
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      await onSave(currentDriver);

      setOpen(false);

      setCurrentDriver(createEmptyDriver());
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
            setCurrentDriver(createEmptyDriver());
            setOpen(true);
          }}
        >
          New Driver
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
                  ? "Edit Driver"
                  : "New Driver"}
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500">
                Enter driver information.
              </p>
            </DialogHeader>
          </div>

          {/* Body */}

          <div className="p-6">
            <DriverForm
              driver={currentDriver}
              setDriver={setCurrentDriver}
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
                ? "Update Driver"
                : "Save Driver"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}