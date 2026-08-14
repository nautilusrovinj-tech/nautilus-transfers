"use client";

import { Transfer } from "@/types/transfer";
import { useLookups } from "@/hooks/useLookups";

interface Props {
  transfer: Transfer;
  getDriverPhone?: (
    driverId?: string | null
  ) => string;
  onEdit?: (transfer: Transfer) => void;
  onAssignDriver?: (
    transferId: string,
    driverId: string
  ) => Promise<void>;
  onAssignVehicle?: (
    transferId: string,
    vehicleId: string
  ) => Promise<void>;
}

export default function TimelineTransferCard({
  transfer,
  getDriverPhone,
  onEdit,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  const {
    getDriverName,
    getVehicleName,
  } = useLookups();

  const statusColor = {
    New: "bg-slate-100 text-slate-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Assigned: "bg-purple-100 text-purple-700",
    "In Progress":
      "bg-amber-100 text-amber-700",
    Completed:
      "bg-green-100 text-green-700",
    Cancelled:
      "bg-red-100 text-red-700",
  };

  const typeColor = {
    Arrival:
      "bg-sky-100 text-sky-700",
    Departure:
      "bg-emerald-100 text-emerald-700",
    Tour:
      "bg-violet-100 text-violet-700",
    Local:
      "bg-orange-100 text-orange-700",
  };

  const driverPhone =
    getDriverPhone?.(
      transfer.driverId
    ) ?? "";

  const passengerCount =
    Number(transfer.adults ?? 0) +
    Number(transfer.children ?? 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>
          <div className="text-2xl font-bold">
            {transfer.time}
          </div>

          <div className="mt-1 text-lg font-semibold text-slate-900">
            {transfer.clientName}
          </div>
        </div>

        <div className="space-y-2 text-right">

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              statusColor[transfer.status]
            }`}
          >
            {transfer.status}
          </span>

          <br />

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              typeColor[
                transfer.transferType
              ]
            }`}
          >
            {transfer.transferType}
          </span>

        </div>

      </div>

      <div className="my-5 rounded-xl bg-slate-50 p-4">

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pickup
        </div>

        <div className="mt-1 font-medium">
          {transfer.pickup}
        </div>

        <div className="my-3 border-t border-dashed border-slate-300" />

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Destination
        </div>

        <div className="mt-1 font-medium">
          {transfer.destination}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Passengers
          </div>

          <div className="mt-1 font-semibold">
            {passengerCount}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Price
          </div>

          <div className="mt-1 font-semibold">
            €{Number(transfer.price ?? 0).toFixed(2)}
          </div>
        </div>

      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Child Seats
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-sm">

          {transfer.children > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Children: {transfer.children}
            </span>
          )}

          {transfer.babySeats > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Baby seats: {transfer.babySeats}
            </span>
          )}

          {transfer.boosterSeats > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Booster seats:{" "}
              {transfer.boosterSeats}
            </span>
          )}

          {transfer.children === 0 &&
            transfer.babySeats === 0 &&
            transfer.boosterSeats === 0 && (
              <span className="text-slate-500">
                None
              </span>
            )}

        </div>

      </div>

      {(transfer.driverId ||
        transfer.vehicleId ||
        transfer.partner) && (
        <div className="mt-4 flex flex-wrap gap-2">

          {transfer.driverId && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              Driver:{" "}
              {getDriverName(
                transfer.driverId
              )}
            </span>
          )}

          {transfer.vehicleId && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              Vehicle:{" "}
              {getVehicleName(
                transfer.vehicleId
              )}
            </span>
          )}

          {transfer.partner && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              Partner:{" "}
              {transfer.partner}
            </span>
          )}

        </div>
      )}

      {transfer.notes && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Notes
          </div>

          <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
            {transfer.notes}
          </div>

        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t pt-4">

        <div className="text-sm text-slate-500">
          {transfer.transferNumber}
        </div>

        <div className="text-xl font-bold">
          €{Number(
            transfer.price ?? 0
          ).toFixed(2)}
        </div>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">

        <button
          type="button"
          onClick={() =>
            onEdit?.(transfer)
          }
          className="rounded-xl bg-slate-900 py-3 font-medium text-white hover:bg-slate-800"
        >
          Edit
        </button>

        {transfer.phone && (
          <button
            type="button"
            onClick={() =>
              window.open(
                `tel:${transfer.phone}`
              )
            }
            className="rounded-xl bg-slate-100 py-3 font-medium hover:bg-slate-200"
          >
            Call Guest
          </button>
        )}

        {driverPhone && (
          <button
            type="button"
            onClick={() =>
              window.open(
                `https://wa.me/${driverPhone.replace(
                  /\D/g,
                  ""
                )}`,
                "_blank"
              )
            }
            className="col-span-2 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
          >
            Driver WhatsApp
          </button>
        )}

      </div>

    </div>
  );
}