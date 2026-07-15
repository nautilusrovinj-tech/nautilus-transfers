"use client";

import { drivers } from "@/data/drivers";
import { vehicles } from "@/data/vehicles";
import { partners } from "@/data/partners";
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

  const fromLabel =
    transfer.transferType === "Departure"
      ? "From (Hotel / Villa)"
      : "From (Airport)";

  const toLabel =
    transfer.transferType === "Departure"
      ? "To (Airport)"
      : "To (Hotel / Villa)";

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Transfer Type */}

      <select
        className="col-span-2 border rounded-lg p-2"
        value={transfer.transferType}
        onChange={(e) =>
          updateField(
            "transferType",
            e.target.value as Transfer["transferType"]
          )
        }
      >
        <option value="Arrival">🛬 Arrival</option>
        <option value="Departure">🛫 Departure</option>
        <option value="Tour">🌿 Tour</option>
        <option value="Local">🚖 Local Transfer</option>
      </select>

      {/* Date / Time */}

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

      {/* Flight */}

      <input
        className="col-span-2 border rounded-lg p-2"
        placeholder="Flight Number"
        value={transfer.flight}
        onChange={(e) => updateField("flight", e.target.value)}
      />

      {/* Route */}

      <input
        className="border rounded-lg p-2"
        placeholder={fromLabel}
        value={transfer.pickup}
        onChange={(e) => updateField("pickup", e.target.value)}
      />

      <input
        className="border rounded-lg p-2"
        placeholder={toLabel}
        value={transfer.destination}
        onChange={(e) => updateField("destination", e.target.value)}
      />

      {/* Client */}

      <input
        className="border rounded-lg p-2"
        placeholder="Client Name"
        value={transfer.clientName}
        onChange={(e) =>
          updateField("clientName", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Phone"
        value={transfer.phone}
        onChange={(e) =>
          updateField("phone", e.target.value)
        }
      />

      <input
        className="col-span-2 border rounded-lg p-2"
        placeholder="Email"
        value={transfer.email}
        onChange={(e) =>
          updateField("email", e.target.value)
        }
      />

      {/* Passengers */}

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

      {/* Driver */}

      <select
        className="border rounded-lg p-2"
        value={transfer.driver}
        onChange={(e) =>
          updateField("driver", e.target.value)
        }
      >
        <option value="">Select Driver</option>

        {drivers
          .filter((d) => d.active)
          .map((driver) => (
            <option
              key={driver.id}
              value={driver.name}
            >
              {driver.name}
            </option>
          ))}
      </select>

      {/* Vehicle */}

      <select
        className="border rounded-lg p-2"
        value={transfer.vehicle}
        onChange={(e) =>
          updateField("vehicle", e.target.value)
        }
      >
        <option value="">Select Vehicle</option>

        {vehicles
          .filter((v) => v.active)
          .map((vehicle) => (
            <option
              key={vehicle.id}
              value={vehicle.name}
            >
              {vehicle.name}
            </option>
          ))}
      </select>

      {/* Partner */}

      <select
        className="border rounded-lg p-2"
        value={transfer.partner}
        onChange={(e) =>
          updateField("partner", e.target.value)
        }
      >
        <option value="">Select Partner</option>

        {partners
          .filter((p) => p.active)
          .map((partner) => (
            <option
              key={partner.id}
              value={partner.name}
            >
              {partner.name}
            </option>
          ))}
      </select>

      {/* Status */}

      <select
        className="border rounded-lg p-2"
        value={transfer.status}
        onChange={(e) =>
          updateField(
            "status",
            e.target.value as Transfer["status"]
          )
        }
      >
        <option value="New">New</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Assigned">Assigned</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {/* Price */}

      <input
        className="col-span-2 border rounded-lg p-2"
        type="number"
        placeholder="Price (€)"
        value={transfer.price}
        onChange={(e) =>
          updateField("price", Number(e.target.value))
        }
      />

      {/* Notes */}

      <textarea
        className="col-span-2 border rounded-lg p-2"
        rows={4}
        placeholder="Notes"
        value={transfer.notes}
        onChange={(e) =>
          updateField("notes", e.target.value)
        }
      />

    </div>
  );
}