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
    <TransferSection title="Pricing">

      <input
        type="number"
        min={0}
        step="0.01"
        className="col-span-2 rounded-lg border p-2"
        placeholder="Price (€)"
        value={transfer.price}
        onChange={(e) =>
          updateField(
            "price",
            Number(e.target.value)
          )
        }
      />

    </TransferSection>
  );
}