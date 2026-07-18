import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function TransferDetails({
  transfer,
  updateField,
}: Props) {
  return (
    <TransferSection title="Transfer Details">

      <select
        className="col-span-2 rounded-lg border p-2"
        value={transfer.transferType}
        onChange={(e) =>
          updateField(
            "transferType",
            e.target.value as Transfer["transferType"]
          )
        }
      >
        <option value="Arrival">
          Arrival
        </option>

        <option value="Departure">
          Departure
        </option>

        <option value="Tour">
          Tour
        </option>

        <option value="Local">
          Local Transfer
        </option>
      </select>

      <input
        type="date"
        className="rounded-lg border p-2"
        value={transfer.date}
        onChange={(e) =>
          updateField("date", e.target.value)
        }
      />

      <input
        type="time"
        className="rounded-lg border p-2"
        value={transfer.time}
        onChange={(e) =>
          updateField("time", e.target.value)
        }
      />

      <input
        className="col-span-2 rounded-lg border p-2"
        placeholder="Flight Number"
        value={transfer.flight}
        onChange={(e) =>
          updateField("flight", e.target.value)
        }
      />

    </TransferSection>
  );
}