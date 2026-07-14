"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import DriverForm from "./DriverForm";

import { Driver } from "@/types/driver";

interface Props {
  onSave: (driver: Driver) => void;
}

const emptyDriver: Driver = {
  id: "",
  name: "",
  phone: "",
  email: "",
  languages: "",
  active: true,
};

export default function DriverDialog({ onSave }: Props) {
  const [open, setOpen] = useState(false);

  const [driver, setDriver] =
    useState<Driver>(emptyDriver);

  function handleSave() {
    onSave({
      ...driver,
      id: crypto.randomUUID(),
    });

    setDriver(emptyDriver);

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        + New Driver
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            New Driver
          </DialogTitle>
        </DialogHeader>

        <DriverForm
          driver={driver}
          setDriver={setDriver}
        />

        <Button
          className="mt-6 w-full"
          onClick={handleSave}
        >
          Save Driver
        </Button>
      </DialogContent>
    </Dialog>
  );
}