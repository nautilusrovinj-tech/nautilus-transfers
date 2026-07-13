"use client";

import { Transfer } from "@/types/transfer";

interface TransferFormProps {
  transfer: Transfer;
  setTransfer: React.Dispatch<React.SetStateAction<Transfer>>;
}

export default function TransferForm({
  transfer,
  setTransfer,
}: TransferFormProps) {
  function updateField<K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) {
    setTransfer((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-4">

      <input
        className="border rounded-lg p-2"
        placeholder="Client Name"
        value={transfer.clientName}
        onChange={(e) => updateField("clientName", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Phone"
        value={transfer.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Email"
        value={transfer.email}
        onChange={(e) => updateField("email", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        type="date"
        value={transfer.date}
        onChange={(e) => updateField("date", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        type="time"
        value={transfer.time}
        onChange={(e) => updateField("time", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Pickup"
        value={transfer.pickup}
        onChange={(e) => updateField("pickup", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Destination"
        value={transfer.destination}
        onChange={(e) => updateField("destination", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Flight Number"
        value={transfer.flight}
        onChange={(e) => updateField("flight", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Adults"
        value={transfer.adults}
        onChange={(e) =>
          updateField("adults", Number(e.target.value))
        }
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Children"
        value={transfer.children}
        onChange={(e) =>
          updateField("children", Number(e.target.value))
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Driver"
        value={transfer.driver}
        onChange={(e) => updateField("driver", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Vehicle"
        value={transfer.vehicle}
        onChange={(e) => updateField("vehicle", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Partner"
        value={transfer.partner}
        onChange={(e) => updateField("partner", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Price"
        value={transfer.price}
        onChange={(e) =>
          updateField("price", Number(e.target.value))
        }
      />

      <textarea
        className="border rounded-lg p-2 col-span-2"
        rows={4}
        placeholder="Notes"
        value={transfer.notes}
        onChange={(e) => updateField("notes", e.target.value)}
      />

    </div>
  );
}