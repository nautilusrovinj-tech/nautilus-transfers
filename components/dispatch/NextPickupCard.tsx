import { Transfer } from "@/types/transfer";

interface Props {
  transfer?: Transfer;
  onEdit?: (transfer: Transfer) => void;
}

export default function NextPickupCard({
  transfer,
  onEdit,
}: Props) {
  if (!transfer) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          ✈️ Next Pickup
        </h2>

        <p className="text-slate-500">
          No upcoming transfers.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold">
        ✈️ Next Pickup
      </h2>

      <div className="space-y-3">

        <div className="text-4xl font-bold text-blue-700">
          {transfer.time}
        </div>

        <div className="text-2xl font-semibold">
          {transfer.clientName}
        </div>

        <div>
          ✈️ <strong>{transfer.flight || "-"}</strong>
        </div>

        <div>
          📍 {transfer.pickup}
        </div>

        <div className="text-center text-slate-500 text-xl">
          ↓
        </div>

        <div>
          🏨 {transfer.destination}
        </div>

        <hr className="my-4" />

        <div>
          👥{" "}
          <strong>
            {transfer.adults} Adult{transfer.adults !== 1 ? "s" : ""}
            {transfer.children > 0 &&
              ` • ${transfer.children} Child${transfer.children !== 1 ? "ren" : ""}`}
          </strong>
        </div>

        <div>
          👤 <strong>{transfer.driver || "Not Assigned"}</strong>
        </div>

        <div>
          🚐 <strong>{transfer.vehicle || "Not Assigned"}</strong>
        </div>

        <div>
          🤝 <strong>{transfer.partner || "Direct"}</strong>
        </div>

        <div>
          💶 <strong>€{transfer.price.toFixed(2)}</strong>
        </div>

        <div>
          📞 <strong>{transfer.phone || "-"}</strong>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">

        <button
          onClick={() => onEdit?.(transfer)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          ✏️ Edit
        </button>

        <button
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          ✅ Complete
        </button>

      </div>

    </div>
  );
}