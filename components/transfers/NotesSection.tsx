import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function NotesSection({
  transfer,
  updateField,
}: Props) {
  return (
    <TransferSection
      title="Notes"
      columns={1}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Internal Notes
        </label>

        <textarea
          rows={6}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Add internal notes for drivers or dispatch..."
          value={transfer.notes}
          onChange={(e) =>
            updateField("notes", e.target.value)
          }
        />
      </div>
    </TransferSection>
  );
}