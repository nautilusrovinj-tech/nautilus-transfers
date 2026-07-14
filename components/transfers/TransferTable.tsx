import { Button } from "@/components/ui/button";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
  onDelete: (id: string) => void;
  onEdit: (transfer: Transfer) => void;
}

export default function TransferTable({
  transfers,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">No.</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Price</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-slate-500"
              >
                No transfers found.
              </td>
            </tr>
          ) : (
            transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-semibold text-blue-600">
                  {transfer.transferNumber}
                </td>

                <td className="p-4">
                  <div className="font-medium">
                    {transfer.clientName}
                  </div>
                  <div className="text-sm text-slate-500">
                    {transfer.phone}
                  </div>
                </td>

                <td className="p-4">
                  <div>{transfer.pickup}</div>
                  <div className="text-slate-400">↓</div>
                  <div>{transfer.destination}</div>
                </td>

                <td className="p-4">
                  {transfer.driver || "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      transfer.status === "New"
                        ? "bg-yellow-100 text-yellow-800"
                        : transfer.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : transfer.status === "Assigned"
                        ? "bg-purple-100 text-purple-800"
                        : transfer.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transfer.status}
                  </span>
                </td>

                <td className="p-4 text-right font-medium">
                  €{transfer.price}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(transfer)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(transfer.id)}
                    >
                      Delete
                    </Button>
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