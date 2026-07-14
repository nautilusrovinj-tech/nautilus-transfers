"use client";

import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicle: Vehicle;
  setVehicle: React.Dispatch<React.SetStateAction<Vehicle>>;
}

export default function VehicleForm({
  vehicle,
  setVehicle,
}: Props) {
  function updateField<K extends keyof Vehicle>(
    field: K,
    value: Vehicle[K]
  ) {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <input
        className="border rounded-lg p-2"
        placeholder="Vehicle Name"
        value={vehicle.name}
        onChange={(e) =>
          updateField("name", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Registration"
        value={vehicle.registration}
        onChange={(e) =>
          updateField("registration", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Seats"
        value={vehicle.seats}
        onChange={(e) =>
          updateField("seats", Number(e.target.value))
        }
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={vehicle.active}
          onChange={(e) =>
            updateField("active", e.target.checked)
          }
        />

        Active
      </label>
    </div>
  );
}