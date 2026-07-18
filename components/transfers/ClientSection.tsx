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

      <input
        className="col-span-2 rounded-lg border p-2"
        placeholder="Client Name"
        value={transfer.clientName}
        onChange={(e) =>
          updateField("clientName", e.target.value)
        }
      />

      <input
        className="rounded-lg border p-2"
        placeholder="Phone"
        value={transfer.phone}
        onChange={(e) =>
          updateField("phone", e.target.value)
        }
      />

      <input
        className="rounded-lg border p-2"
        placeholder="Email"
        value={transfer.email}
        onChange={(e) =>
          updateField("email", e.target.value)
        }
      />

    </TransferSection>
  );
}