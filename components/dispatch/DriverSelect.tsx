"use client";

import { useEffect, useState } from "react";

import { getDrivers } from "@/services/drivers";
import { Driver } from "@/types/driver";

interface Props {
  transferId: string;
  value: string;
  onAssigned: (driverId: string) => Promise<void>;
}

export default function DriverSelect({
  transferId,
  value,
  onAssigned,
}: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  async function loadDrivers() {
    try {
      const data = await getDrivers();
      setDrivers(data.filter((d) => d.active));
    } catch (err) {
      console.error(err);
    }
  }
  async function handleChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const driverId = e.target.value;
  
    console.log("========== DriverSelect ==========");
    console.log("Transfer ID:", transferId);
    console.log("Selected Driver:", driverId);
  
    setSelected(driverId);
    setSaving(true);
  
    try {
      await onAssigned(driverId);
  
      console.log("✅ onAssigned finished");
    } catch (err) {
      console.error(err);
      alert("Unable to assign driver.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      disabled={saving}
      value={selected}
      onChange={handleChange}
    >
      <option value="">Unassigned</option>

      {drivers.map((driver) => (
        <option
          key={driver.id}
          value={driver.id}
        >
          {driver.name}
        </option>
      ))}
    </select>
  );
}