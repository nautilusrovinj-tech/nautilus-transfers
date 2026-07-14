"use client";

import AppLayout from "@/components/layout/AppLayout";
import DispatchTable from "@/components/dispatch/DispatchTable";

import { transfers } from "@/data/transfers";

export default function DispatchPage() {
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