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
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">

          <div className="border-b bg-white px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editing
                  ? "Edit Vehicle"
                  : "New Vehicle"}
              </DialogTitle>

              <p className="mt-1 text-sm text-slate-500">
                Enter vehicle information.
              </p>
            </DialogHeader>
          </div>

          <div className="p-6">
            <VehicleForm
              vehicle={currentVehicle}
              setVehicle={setCurrentVehicle}
            />
          </div>

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
                ? "Update Vehicle"
                : "Save Vehicle"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}