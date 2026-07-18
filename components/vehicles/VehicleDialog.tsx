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

import VehicleForm from "./VehicleForm";

import { Vehicle } from "@/types/vehicle";
import { createEmptyVehicle } from "@/lib/vehicle";

interface Props {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => Promise<void>;
  hideTrigger?: boolean;
}

export default function VehicleDialog({
  vehicle,
  onSave,
  hideTrigger = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentVehicle, setCurrentVehicle] =
    useState<Vehicle>(createEmptyVehicle());

  const editing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setCurrentVehicle(vehicle);
      setOpen(true);
    } else {
      setCurrentVehicle(createEmptyVehicle());
    }
  }, [vehicle]);

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setCurrentVehicle(createEmptyVehicle());
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      await onSave(currentVehicle);

      setOpen(false);

      setCurrentVehicle(createEmptyVehicle());
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {!hideTrigger && (
        <Button
          onClick={() => {
            setCurrentVehicle(createEmptyVehicle());
            setOpen(true);
          }}
        >
          New Vehicle
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
                ? "Edit Vehicle"
                : "New Vehicle"}
            </DialogTitle>

          </DialogHeader>

          <VehicleForm
            vehicle={currentVehicle}
            setVehicle={setCurrentVehicle}
          />

          <div className="mt-6 flex justify-end">

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Vehicle"
                : "Save Vehicle"}
            </Button>

          </div>

        </DialogContent>

      </Dialog>
    </>
  );
}