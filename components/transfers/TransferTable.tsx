import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function TransferTable({ transfers }: Props) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-slate-500">
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
                  {transfer.pickup} → {transfer.dropoff}
                </td>
                <td className="p-4">{transfer.driver}</td>
                <td className="p-4">
                  €{transfer.price}
                </td>
                <td className="p-4">
                  {transfer.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}