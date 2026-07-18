"use client";

import { useEffect, useState } from "react";

import { getVehicles } from "@/services/vehicles";
import { Vehicle } from "@/types/vehicle";

interface Props {
  value: string;
  onChange: (vehicleId: string) => void;
}

export default function VehicleSelect({
  value,
  onChange,
}: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const data = await getVehicles();
      setVehicles(data.filter((v) => v.active));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <select
      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Unassigned</option>

      {vehicles.map((vehicle) => (
        <option
          key={vehicle.id}
          value={vehicle.id}
        >
          {vehicle.name}
        </option>
      ))}
    </select>
  );
}