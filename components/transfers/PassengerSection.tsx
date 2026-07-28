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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Adults
        </label>

        <input
          type="number"
          min={0}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.adults}
          onChange={(e) =>
            updateField(
              "adults",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Children
        </label>

        <input
          type="number"
          min={0}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.children}
          onChange={(e) =>
            updateField(
              "children",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Baby Seats
        </label>

        <input
          type="number"
          min={0}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.babySeats}
          onChange={(e) =>
            updateField(
              "babySeats",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Booster Seats
        </label>

        <input
          type="number"
          min={0}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.boosterSeats}
          onChange={(e) =>
            updateField(
              "boosterSeats",
              Number(e.target.value)
            )
          }
        />
      </div>
    </TransferSection>
  );
}