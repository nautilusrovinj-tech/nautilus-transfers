"use client";

import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";

interface Props {
  drivers: Driver[];
  vehicles: Vehicle[];
}

export default function AssignmentSuggestions({
  drivers,
  vehicles,
}: Props) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

      <div className="mb-4 flex items-center justify-between">

        <h3 className="text-base font-semibold text-blue-700">
          Suggested Resources
        </h3>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Available
        </span>

      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Drivers */}

        <div>

          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Drivers
          </h4>

          <div className="space-y-2">

            {drivers.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-center text-sm text-slate-500">
                No drivers available
              </div>
            ) : (
              drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:border-green-300"
                >
                  <div>

                    <div className="font-medium">
                      {driver.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      Ready
                    </div>

                  </div>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

        {/* Vehicles */}

        <div>

          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Vehicles
          </h4>

          <div className="space-y-2">

            {vehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-center text-sm text-slate-500">
                No vehicles available
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:border-blue-300"
                >
                  <div>

                    <div className="font-medium">
                      {vehicle.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      Ready
                    </div>

                  </div>

                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    Available
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}