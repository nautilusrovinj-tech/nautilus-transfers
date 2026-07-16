"use client";

import { useEffect, useState } from "react";
import { getTransfers } from "@/services/transfers";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransfers() {
      try {
        const data = await getTransfers();
        setTransfers(data ?? []);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          alert(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTransfers();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transfers</h1>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
          New Transfer
        </button>
      </div>

      {loading ? (
        <p>Loading transfers...</p>
      ) : (
        <>
          <p className="mb-4">
            Found <strong>{transfers.length}</strong> transfer(s)
          </p>

          <pre className="overflow-auto rounded-lg bg-slate-100 p-4 text-xs">
            {JSON.stringify(transfers, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}