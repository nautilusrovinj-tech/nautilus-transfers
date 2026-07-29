"use client";

import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";
import { Partner } from "@/types/partner";
import { Transfer } from "@/types/transfer";

import TransferSection from "./TransferSection";
import AvailabilityBadge from "./AvailabilityBadge";
import ConflictAlert from "./ConflictAlert";
import AssignmentSuggestions from "./AssignmentSuggestions";

import {
  isDriverAvailable,
  isVehicleAvailable,
} from "@/lib/dispatch/availability";

import {
  getAvailableDrivers,
  getAvailableVehicles,
} from "@/lib/dispatch/suggestions";

interface Props {
  transfer: Transfer;
  transfers: Transfer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  partners: Partner[];
  updateField: <K extends keyof Transfer>(
    field: K,
    value: Transfer[K]
  ) => void;
}

export default function AssignmentSection({
  transfer,
  transfers,
  drivers,
  vehicles,
  partners,
  updateField,
}: Props) {
  const driverAvailable = transfer.driverId
    ? isDriverAvailable(
        transfers,
        transfer,
        transfer.driverId
      )
    : true;

  const vehicleAvailable = transfer.vehicleId
    ? isVehicleAvailable(
        transfers,
        transfer,
        transfer.vehicleId
      )
    : true;

  const availableDrivers = getAvailableDrivers(
    transfers,
    transfer,
    drivers
  );

  const availableVehicles = getAvailableVehicles(
    transfers,
    transfer,
    vehicles
  );

  function updateDriver(driverId: string) {
    updateField("driverId", driverId);

    if (driverId && transfer.vehicleId) {
      updateField("status", "Assigned");
    } else {
      updateField("status", "New");
    }
  }

  function updateVehicle(vehicleId: string) {
    updateField("vehicleId", vehicleId);

    if (vehicleId && transfer.driverId) {
      updateField("status", "Assigned");
    } else {
      updateField("status", "New");
    }
  }

  return (
    <TransferSection title="Assignment">
      <div className="space-y-5">

        <ConflictAlert
          show={!driverAvailable}
          message="Selected driver already has another transfer within 90 minutes."
        />

        <ConflictAlert
          show={!vehicleAvailable}
          message="Selected vehicle is already assigned within 90 minutes."
        />

        {/* Driver */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Driver
          </label>

          <select
            className="w-full rounded-xl border bg-white px-3 py-3"
            value={transfer.driverId}
            onChange={(e) => updateDriver(e.target.value)}
          >
            <option value="">
              Select Driver
            </option>

            {drivers
              .filter((d) => d.active)
              .map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.name}
                </option>
              ))}
          </select>

          <AvailabilityBadge
            available={driverAvailable}
            text="Driver unavailable"
          />
        </div>

        {/* Vehicle */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Vehicle
          </label>

          <select
            className="w-full rounded-xl border bg-white px-3 py-3"
            value={transfer.vehicleId}
            onChange={(e) => updateVehicle(e.target.value)}
          >
            <option value="">
              Select Vehicle
            </option>

            {vehicles
              .filter((v) => v.active)
              .map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.name}
                </option>
              ))}
          </select>

          <AvailabilityBadge
            available={vehicleAvailable}
            text="Vehicle unavailable"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Partner */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Partner
            </label>

            <select
              className="w-full rounded-xl border bg-white px-3 py-3"
              value={transfer.partnerId}
              onChange={(e) =>
                updateField(
                  "partnerId",
                  e.target.value
                )
              }
            >
              <option value="">
                Select Partner
              </option>

              {partners
                .filter((p) => p.active)
                .map((partner) => (
                  <option
                    key={partner.id}
                    value={partner.id}
                  >
                    {partner.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              className="w-full rounded-xl border bg-white px-3 py-3"
              value={transfer.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as Transfer["status"]
                )
              }
            >
              <option value="New">New</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        <div className="border-t pt-5">
          <AssignmentSuggestions
            drivers={availableDrivers}
            vehicles={availableVehicles}
          />
        </div>

      </div>
    </TransferSection>
  );
}