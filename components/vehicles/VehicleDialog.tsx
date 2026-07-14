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

import VehicleForm from "./VehicleForm";

import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicle?: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
}

const emptyVehicle: Vehicle = {
  id: "",
  name: "",
  registration: "",
  seats: 0,
  active: true,
};

export default function VehicleDialog({
  vehicle: editingVehicle,
  onSave,
}: Props) {
  const [open, setOpen] = useState(false);

  const [vehicle, setVehicle] =
    useState<Vehicle>(emptyVehicle);

  useEffect(() => {
    if (editingVehicle) {
      setVehicle(editingVehicle);
      setOpen(true);
    }
  }, [editingVehicle]);

  function handleSave() {
    onSave(
      vehicle.id
        ? vehicle
        : {
            ...vehicle,
            id: crypto.randomUUID(),
          }
    );

    setVehicle(emptyVehicle);
    setOpen(false);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setVehicle(emptyVehicle);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        + New Vehicle
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingVehicle ? "Edit Vehicle" : "New Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <VehicleForm
          vehicle={vehicle}
          setVehicle={setVehicle}
        />

        <Button
          className="mt-6 w-full"
          onClick={handleSave}
        >
          {editingVehicle ? "Update Vehicle" : "Save Vehicle"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}