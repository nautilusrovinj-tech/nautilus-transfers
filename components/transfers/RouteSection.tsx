import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function RouteSection({
  transfer,
  updateField,
}: Props) {
  const fromLabel =
    transfer.transferType === "Departure"
      ? "From (Hotel / Villa)"
      : "From (Airport)";

  const toLabel =
    transfer.transferType === "Departure"
      ? "To (Airport)"
      : "To (Hotel / Villa)";

  return (
    <TransferSection title="Route">

      <input
        className="rounded-lg border p-2"
        placeholder={fromLabel}
        value={transfer.pickup}
        onChange={(e) =>
          updateField("pickup", e.target.value)
        }
      />

      <input
        className="rounded-lg border p-2"
        placeholder={toLabel}
        value={transfer.destination}
        onChange={(e) =>
          updateField(
            "destination",
            e.target.value
          )
        }
      />

    </TransferSection>
  );
}