import { useEffect, useState } from "react";

import {
  assignDriver,
  assignVehicle,
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
} from "@/lib/services/transferService";

import { Transfer } from "@/types/transfer";

export function useTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      setLoading(true);

      const data = await getTransfers();

      setTransfers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveTransfer(
    transfer: Transfer
  ) {
    const exists = transfers.some(
      (t) => t.id === transfer.id
    );

    if (exists) {
      await updateTransfer(transfer);
    } else {
      await createTransfer(transfer);
    }

    await loadTransfers();
  }

  async function removeTransfer(id: string) {
    await deleteTransfer(id);

    await loadTransfers();
  }

  async function updateDriver(
    transferId: string,
    driver: string
  ) {
    await assignDriver(
      transferId,
      driver
    );

    await loadTransfers();
  }

  async function updateVehicle(
    transferId: string,
    vehicle: string
  ) {
    await assignVehicle(
      transferId,
      vehicle
    );

    await loadTransfers();
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