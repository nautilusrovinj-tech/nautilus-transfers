"use client";

import { useEffect, useState } from "react";

import {
  assignDriver,
  assignVehicle,
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
} from "@/services/transfers";

import { checkDriverConflict } from "@/lib/dispatch/conflicts";

import { Transfer } from "@/types/transfer";

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      setLoading(true);

      console.log("Loading transfers...");

      const data = await getTransfers();

      console.log("Transfers loaded:", data);

      setTransfers(data);
    } catch (error) {
      console.error(
        "LOAD TRANSFERS ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveTransfer(
    transfer: Transfer
  ) {
    try {
      const exists = transfers.some(
        (t) => t.id === transfer.id
      );

      if (exists) {
        await updateTransfer(
          transfer.id,
          transfer
        );
      } else {
        await createTransfer(transfer);
      }

      await loadTransfers();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      );
    }
  }

  async function removeTransfer(id: string) {
    try {
      await deleteTransfer(id);

      await loadTransfers();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      );
    }
  }

  async function updateDriver(
    transferId: string,
    driverId: string
  ) {
    const transfer = transfers.find(
      (t) => t.id === transferId
    );

    if (!transfer) return;

    const conflict = checkDriverConflict(
      transfers,
      transfer.id,
      driverId,
      transfer.date,
      transfer.time
    );

    if (conflict) {
      alert(
        [
          "Driver is already assigned.",
          "",
          `Transfer: ${conflict.transferNumber}`,
          `Time: ${conflict.time}`,
          `Client: ${conflict.clientName}`,
        ].join("\n")
      );

      return;
    }

    try {
      await assignDriver(
        transferId,
        driverId
      );

      await loadTransfers();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      );
    }
  }

  async function updateVehicle(
    transferId: string,
    vehicleId: string
  ) {
    try {
      await assignVehicle(
        transferId,
        vehicleId
      );

      await loadTransfers();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : JSON.stringify(error)
      );
    }
  }

  return {
    loading,
    transfers,
    loadTransfers,
    saveTransfer,
    removeTransfer,
    updateDriver,
    updateVehicle,
  };
}