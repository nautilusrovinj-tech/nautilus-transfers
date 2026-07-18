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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? "Edit Driver"
                : "New Driver"}
            </DialogTitle>
          </DialogHeader>

          <DriverForm
            driver={currentDriver}
            setDriver={setCurrentDriver}
          />

          <div className="mt-6 flex justify-end">
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