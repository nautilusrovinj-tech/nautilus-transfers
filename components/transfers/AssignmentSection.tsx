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

import { autoAssign } from "@/lib/dispatch/autoAssign";

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

  const availableDrivers =
    getAvailableDrivers(
      transfers,
      transfer,
      drivers
    );

  const availableVehicles =
    getAvailableVehicles(
      transfers,
      transfer,
      vehicles
    );

  const suggestion = autoAssign(
    transfers,
    transfer,
    drivers,
    vehicles
  );

  return (
    <TransferSection title="Assignment">

      <div className="col-span-2">

        <button
          type="button"
          onClick={() => {
            if (suggestion.driverId) {
              updateField(
                "driverId",
                suggestion.driverId
              );
            }

            if (suggestion.vehicleId) {
              updateField(
                "vehicleId",
                suggestion.vehicleId
              );
            }
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Auto Assign Driver & Vehicle
        </button>

      </div>

      <ConflictAlert
        show={!driverAvailable}
        message="Selected driver already has another transfer within 90 minutes."
      />

      <ConflictAlert
        show={!vehicleAvailable}
        message="Selected vehicle is already assigned within 90 minutes."
      />

      <AssignmentSuggestions
        drivers={availableDrivers}
        vehicles={availableVehicles}
      />

      <div>

        <select
          className="w-full rounded-lg border p-2"
          value={transfer.driverId}
          onChange={(e) =>
            updateField(
              "driverId",
              e.target.value
            )
          }
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

      <div>

        <select
          className="w-full rounded-lg border p-2"
          value={transfer.vehicleId}
          onChange={(e) =>
            updateField(
              "vehicleId",
              e.target.value
            )
          }
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

      <select
        className="rounded-lg border p-2"
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

      <select
        className="rounded-lg border p-2"
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
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    </TransferSection>
  );
}