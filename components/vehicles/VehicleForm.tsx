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
    <div className="grid grid-cols-2 gap-4">

      <input
        className="border rounded-lg p-2"
        placeholder="Vehicle Name"
        value={vehicle.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Brand"
        value={vehicle.brand}
        onChange={(e) =>
          update("brand", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Model"
        value={vehicle.model}
        onChange={(e) =>
          update("model", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Plate"
        value={vehicle.plate}
        onChange={(e) =>
          update("plate", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Seats"
        value={vehicle.seats}
        onChange={(e) =>
          update("seats", Number(e.target.value))
        }
      />

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={vehicle.active}
          onChange={(e) =>
            update("active", e.target.checked)
          }
        />

        Active Vehicle

      </label>

    </div>
  );
}