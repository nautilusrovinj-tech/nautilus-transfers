import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function ClientSection({
  transfer,
  updateField,
}: Props) {
  return (
    <TransferSection title="Client">
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold text-slate-700">
          Client Name
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Client Name"
          value={transfer.clientName}
          onChange={(e) =>
            updateField("clientName", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Phone
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="+385..."
          value={transfer.phone}
          onChange={(e) =>
            updateField("phone", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          type="email"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="guest@email.com"
          value={transfer.email}
          onChange={(e) =>
            updateField("email", e.target.value)
          }
        />
      </div>
    </TransferSection>
  );
}