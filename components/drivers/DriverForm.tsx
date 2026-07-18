"use client";

import { Driver } from "@/types/driver";

interface Props {
  driver: Driver;
  setDriver: React.Dispatch<React.SetStateAction<Driver>>;
}

export default function DriverForm({
  driver,
  setDriver,
}: Props) {
  function update<K extends keyof Driver>(
    field: K,
    value: Driver[K]
  ) {
    setDriver((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-4">

      <input
        className="border rounded-lg p-2"
        placeholder="Driver name"
        value={driver.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Phone"
        value={driver.phone}
        onChange={(e) =>
          update("phone", e.target.value)
        }
      />

      <input
        className="col-span-2 border rounded-lg p-2"
        placeholder="Email"
        value={driver.email}
        onChange={(e) =>
          update("email", e.target.value)
        }
      />

      <input
        className="col-span-2 border rounded-lg p-2"
        placeholder="Languages"
        value={driver.languages}
        onChange={(e) =>
          update("languages", e.target.value)
        }
      />

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={driver.active}
          onChange={(e) =>
            update("active", e.target.checked)
          }
        />

        Active Driver

      </label>

    </div>
  );
}