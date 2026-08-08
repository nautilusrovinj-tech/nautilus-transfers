import TransferSection from "./TransferSection";
import {
  PaymentMethod,
  Transfer,
} from "@/types/transfer";

interface Props {
  transfer: Transfer;
  updateField: (
    field: keyof Transfer,
    value: Transfer[keyof Transfer]
  ) => void;
}

export default function PricingSection({
  transfer,
  updateField,
}: Props) {
  function handlePriceChange(value: string) {
    updateField(
      "price",
      (value === "" ? 0 : Number(value)) as Transfer["price"]
    );
  }

  function handlePaymentMethodChange(
    value: PaymentMethod
  ) {
    updateField(
      "paymentMethod",
      value
    );
  }

  return (
    <TransferSection title="Pricing">
      <div className="space-y-5">

        {/* Price */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price (€)
          </label>

          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="0.00"
            value={
              transfer.price === 0
                ? ""
                : transfer.price
            }
            onChange={(e) =>
              handlePriceChange(e.target.value)
            }
          />
        </div>

        {/* Payment Method */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Payment Method
          </label>

          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={transfer.paymentMethod}
            onChange={(e) =>
              handlePaymentMethodChange(
                e.target.value as PaymentMethod
              )
            }
          >
            <option value="Cash">
              Cash
            </option>

            <option value="Invoice">
              Invoice
            </option>
          </select>
        </div>

      </div>
    </TransferSection>
  );
}