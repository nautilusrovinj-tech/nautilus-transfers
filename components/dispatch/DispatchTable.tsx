"use client";

import { Transfer } from "@/types/transfer";
import {
  driverWhatsAppUrl,
  guestWhatsAppUrl,
} from "@/lib/helpers/whatsapp";

interface Props {
  transfers: Transfer[];
  onEdit?: (transfer: Transfer) => void;
  getDriverPhone?: (driver: string) => string;
}

export default function DispatchTable({
  transfers,
  onEdit,
  getDriverPhone,
}: Props) {
  function statusColor(status: Transfer["status"]) {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";

      case "Confirmed":
        return "bg-blue-100 text-blue-800";

      case "Assigned":
        return "bg-purple-100 text-purple-800";

      case "Cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-yellow-100 text-yellow-800";
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4 text-left">Flight</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-left">Vehicle</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-slate-500"
              >
                No transfers scheduled.
              </td>
            </tr>
          ) : (
            transfers.map((transfer) => {
              const driverPhone =
                getDriverPhone?.(transfer.driver) ?? "";

              return (
                <tr
                  key={transfer.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-4 font-semibold">
                    {transfer.time}
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
                    {transfer.flight || "-"}
                  </td>

                  <td className="p-4">
                    <div>{transfer.pickup}</div>
                    <div className="text-xs text-slate-400">
                      ↓
                    </div>
                    <div>{transfer.destination}</div>
                  </td>

                  <td className="p-4">
                    {transfer.driver || "-"}
                  </td>

                  <td className="p-4">
                    {transfer.vehicle || "-"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                        transfer.status
                      )}`}
                    >
                      {transfer.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onEdit?.(transfer)}
                        className="rounded-md bg-blue-100 px-2 py-1 transition hover:bg-blue-200"
                        title="Edit Transfer"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => {
                          if (!driverPhone) {
                            alert("No phone number for this driver.");
                            return;
                          }

                          window.open(
                            driverWhatsAppUrl(
                              transfer,
                              driverPhone
                            ),
                            "_blank"
                          );
                        }}
                        className="rounded-md bg-green-100 px-2 py-1 transition hover:bg-green-200"
                        title="Send WhatsApp to Driver"
                      >
                        📱
                      </button>

                      <button
                        onClick={() => {
                          if (!transfer.phone) {
                            alert("Guest phone number is missing.");
                            return;
                          }

                          window.open(
                            guestWhatsAppUrl(transfer),
                            "_blank"
                          );
                        }}
                        className="rounded-md bg-sky-100 px-2 py-1 transition hover:bg-sky-200"
                        title="Send WhatsApp to Guest"
                      >
                        💬
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}