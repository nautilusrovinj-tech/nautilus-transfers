"use client";

import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicle: Vehicle;
  setVehicle: React.Dispatch<
    React.SetStateAction<Vehicle>
  >;
}

export default function VehicleForm({
  vehicle,
  setVehicle,
}: Props) {
  function update<K extends keyof Vehicle>(
    field: K,
    value: Vehicle[K]
  ) {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-5">

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Vehicle Name
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Mercedes V-Class"
          value={vehicle.name}
          onChange={(e) =>
            update("name", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Registration
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="PU123NO"
          value={vehicle.registration}
          onChange={(e) =>
            update(
              "registration",
              e.target.value
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Seats
        </label>

        <input
          type="number"
          min={1}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={vehicle.seats}
          onChange={(e) =>
            update(
              "seats",
              Number(e.target.value || 1)
            )
          }
        />
      </div>

      <div className="flex items-end pb-3">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">

          <input
            type="checkbox"
            className="h-4 w-4"
            checked={vehicle.active}
            onChange={(e) =>
              update(
                "active",
                e.target.checked
              )
            }
          />

          Active Vehicle

        </label>
      </div>

    </div>
  );
}