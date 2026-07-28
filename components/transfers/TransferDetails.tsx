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
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold text-slate-700">
          Transfer Type
        </label>

        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Date
        </label>

        <input
          type="date"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.date}
          onChange={(e) =>
            updateField("date", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Time
        </label>

        <input
          type="time"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={transfer.time}
          onChange={(e) =>
            updateField("time", e.target.value)
          }
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold text-slate-700">
          Flight Number
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="e.g. FR5487"
          value={transfer.flight}
          onChange={(e) =>
            updateField("flight", e.target.value)
          }
        />
      </div>
    </TransferSection>
  );
}