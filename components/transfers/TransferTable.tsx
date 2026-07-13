import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
  onDelete: (id: string) => void;
}

export default function TransferTable({
  transfers,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="p-6 text-center text-slate-500"
              >
                No transfers yet.
              </td>
            </tr>
          ) : (
            transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">{transfer.date}</td>

                <td className="p-4">{transfer.time}</td>

                <td className="p-4 font-medium">
                  {transfer.clientName}
                </td>

                <td className="p-4">
                  {transfer.pickup} → {transfer.destination}
                </td>

                <td className="p-4">{transfer.driver || "-"}</td>

                <td className="p-4">
                  €{transfer.price}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      transfer.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : transfer.status === "New"
                        ? "bg-yellow-100 text-yellow-700"
                        : transfer.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transfer.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(transfer.id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}