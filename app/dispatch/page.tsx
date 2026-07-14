"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import DispatchTable from "@/components/dispatch/DispatchTable";

import { Transfer } from "@/types/transfer";
import { getTodaysTransfers } from "@/lib/transferService";

export default function DispatchPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      const data = await getTodaysTransfers();
      setTransfers(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Dispatch Board
          </h1>

          <p className="text-slate-500">
            Today's transfers and assignments.
          </p>
        </div>

        <DispatchTable transfers={transfers} />
      </div>
    </AppLayout>
  );
}