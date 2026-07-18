import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function PassengerSection({
  transfer,
  updateField,
}: Props) {
  return (
    <TransferSection title="Passengers">

      <input
        type="number"
        min={0}
        className="rounded-lg border p-2"
        placeholder="Adults"
        value={transfer.adults}
        onChange={(e) =>
          updateField(
            "adults",
            Number(e.target.value)
          )
        }
      />

      <input
        type="number"
        min={0}
        className="rounded-lg border p-2"
        placeholder="Children"
        value={transfer.children}
        onChange={(e) =>
          updateField(
            "children",
            Number(e.target.value)
          )
        }
      />

      <input
        type="number"
        min={0}
        className="rounded-lg border p-2"
        placeholder="Baby Seats"
        value={transfer.babySeats}
        onChange={(e) =>
          updateField(
            "babySeats",
            Number(e.target.value)
          )
        }
      />

      <input
        type="number"
        min={0}
        className="rounded-lg border p-2"
        placeholder="Booster Seats"
        value={transfer.boosterSeats}
        onChange={(e) =>
          updateField(
            "boosterSeats",
            Number(e.target.value)
          )
        }
      />

    </TransferSection>
  );
}