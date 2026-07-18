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
    <TransferSection title="Notes">

      <textarea
        rows={5}
        className="col-span-2 rounded-lg border p-2"
        placeholder="Internal notes..."
        value={transfer.notes}
        onChange={(e) =>
          updateField("notes", e.target.value)
        }
      />

    </TransferSection>
  );
}