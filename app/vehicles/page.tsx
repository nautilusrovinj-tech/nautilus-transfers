"use client";

import AppLayout from "@/components/layout/AppLayout";
import VehicleTable from "@/components/vehicles/VehicleTable";

import { vehicles } from "@/data/vehicles";

export default function VehiclesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Vehicles
          </h1>

          <p className="text-slate-500">
            Manage your vehicles.
          </p>
        </div>

        <VehicleTable vehicles={vehicles} />
      </div>
    </AppLayout>
  );
}