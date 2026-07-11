"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TransferDialog() {
  const [clientName, setClientName] = useState("");

  return (
    <Dialog>
      <DialogTrigger
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        + New Transfer
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Transfer</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Input
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />

          <Input placeholder="Pickup Location" />

          <Input placeholder="Drop-off Location" />

          <Input placeholder="Flight Number" />

          <Input placeholder="Price (€)" />

          <Button className="w-full">
            Save Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}