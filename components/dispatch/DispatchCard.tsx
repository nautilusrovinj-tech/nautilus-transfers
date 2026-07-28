"use client";

import { googleMapsUrl } from "@/lib/helpers/maps";
import {
  driverWhatsAppUrl,
  guestWhatsAppUrl,
} from "@/lib/helpers/whatsapp";

import DriverSelect from "./DriverSelect";
import VehicleSelect from "./VehicleSelect";

import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  driverPhone: string;
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

export default function DispatchCard({
  transfer,
  driverPhone,
  onEdit,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  function statusClass(status: Transfer["status"]) {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Assigned":
        return "bg-indigo-100 text-indigo-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "In Progress":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

      <div className="border-b border-slate-200 p-5">

        <div className="flex items-start justify-between">

          <div>

            <div className="text-4xl font-bold text-slate-900">
              {transfer.time}
            </div>

            <div className="mt-2 text-2xl font-semibold">
              {transfer.clientName}
            </div>

          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(
              transfer.status
            )}`}
          >
            {transfer.status}
          </span>

        </div>

        <div className="mt-5 grid gap-4">

          <div>

            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Transfer Type
            </div>

            <div className="text-lg font-medium">
              {transfer.transferType}
            </div>

          </div>

          <div>

            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Flight
            </div>

            <div className="text-lg">
              {transfer.flight || "-"}
            </div>

          </div>

        </div>

      </div>

      <div className="space-y-5 p-5">

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pickup
          </div>

          <div className="mt-1 text-lg">
            {transfer.pickup}
          </div>

          <div className="my-4 border-t border-dashed border-slate-300"></div>

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Destination
          </div>

          <div className="mt-1 text-lg">
            {transfer.destination}
          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Driver
            </div>

            <DriverSelect
              transferId={transfer.id}
              value={transfer.driverId}
              onAssigned={(driverId) =>
                onAssignDriver?.(
                  transfer.id,
                  driverId
                ) ?? Promise.resolve()
              }
            />

          </div>

          <div>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vehicle
            </div>

            <VehicleSelect
              value={transfer.vehicleId}
              onChange={(vehicleId) =>
                onAssignVehicle?.(
                  transfer.id,
                  vehicleId
                ) ?? Promise.resolve()
              }
            />

          </div>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Passengers
          </div>

          <div className="mt-2 text-base">
            {transfer.adults} Adult{transfer.adults !== 1 ? "s" : ""}
            {transfer.children > 0 &&
              ` • ${transfer.children} Child${transfer.children !== 1 ? "ren" : ""}`}
            {transfer.babySeats > 0 &&
              ` • ${transfer.babySeats} Baby Seat${transfer.babySeats !== 1 ? "s" : ""}`}
          </div>

        </div>

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={() => onEdit?.(transfer)}
            className="rounded-xl bg-slate-900 py-3 font-medium text-white hover:bg-slate-800"
          >
            Edit
          </button>

          <button
            onClick={() =>
              window.open(
                googleMapsUrl(
                  transfer.pickup,
                  transfer.destination
                ),
                "_blank"
              )
            }
            className="rounded-xl bg-orange-500 py-3 font-medium text-white hover:bg-orange-600"
          >
            Navigate
          </button>

          <button
            onClick={() => {
              if (!transfer.phone) return;

              window.open(
                guestWhatsAppUrl(transfer),
                "_blank"
              );
            }}
            className="rounded-xl bg-green-600 py-3 font-medium text-white hover:bg-green-700"
          >
            Guest WhatsApp
          </button>

          <button
            onClick={() => {
              if (!driverPhone) return;

              window.open(
                driverWhatsAppUrl(
                  transfer,
                  driverPhone
                ),
                "_blank"
              );
            }}
            className="rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
          >
            Driver WhatsApp
          </button>

          <button
            onClick={() =>
              window.open(
                `tel:${transfer.phone}`
              )
            }
            className="col-span-2 rounded-xl bg-slate-100 py-3 font-medium hover:bg-slate-200"
          >
            Call Guest
          </button>

        </div>

      </div>

    </div>
  );
}