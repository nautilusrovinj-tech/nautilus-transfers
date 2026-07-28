import TransferSection from "./TransferSection";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function PricingSection({
  transfer,
  updateField,
}: Props) {
  return (
    <TransferSection
      title="Pricing"
      columns={1}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Price (€)
        </label>

        <input
          type="number"
          min={0}
          step="0.01"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="0.00"
          value={transfer.price}
          onChange={(e) =>
            updateField(
              "price",
              Number(e.target.value)
            )
          }
        />
      </div>
    </TransferSection>
  );
}