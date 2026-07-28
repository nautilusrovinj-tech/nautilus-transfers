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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Pickup
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder={fromLabel}
          value={transfer.pickup}
          onChange={(e) =>
            updateField("pickup", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Destination
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder={toLabel}
          value={transfer.destination}
          onChange={(e) =>
            updateField(
              "destination",
              e.target.value
            )
          }
        />
      </div>
    </TransferSection>
  );
}