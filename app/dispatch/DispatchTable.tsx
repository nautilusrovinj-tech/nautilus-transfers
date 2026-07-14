import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function DispatchTable({
  transfers,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Vehicle</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-slate-500"
              >
                No transfers scheduled today.
              </td>
            </tr>
          ) : (
            transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {transfer.time}
                </td>

                <td className="p-4">
                  {transfer.clientName}
                </td>

                <td className="p-4">
                  {transfer.pickup} → {transfer.destination}
                </td>

                <td className="p-4">
                  {transfer.driver || "-"}
                </td>

                <td className="p-4">
                  {transfer.vehicle || "-"}
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