"use client";

import { useEffect, useState } from "react";

import {
  getVehicleServices,
  createVehicleService,
  deleteVehicleService,
} from "@/services/vehicleServices";

import { VehicleService } from "@/types/vehicle-service";

interface Props {
  vehicleId: string;
}

const emptyForm = {
  serviceDate: new Date()
    .toISOString()
    .split("T")[0],

  serviceType: "",

  description: "",

  kilometers: "",

  cost: "",

  serviceProvider: "",

  notes: "",

  nextServiceDate: "",

  nextServiceKilometers: "",
};

export default function VehicleServiceTab({
  vehicleId,
}: Props) {
  const [services, setServices] =
    useState<VehicleService[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  async function loadServices() {
    try {
      setLoading(true);

      const data =
        await getVehicleServices(
          vehicleId
        );

      setServices(data);
    } catch (error) {
      console.error(
        "LOAD VEHICLE SERVICES ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load service records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadServices();
  }, [vehicleId]);

  function update(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!form.serviceType.trim()) {
      alert(
        "Service type is required."
      );

      return;
    }

    try {
      setSaving(true);

      await createVehicleService({
        vehicleId,

        serviceDate:
          form.serviceDate,

        serviceType:
          form.serviceType,

        description:
          form.description,

        kilometers:
          form.kilometers
            ? Number(form.kilometers)
            : null,

        cost:
          form.cost
            ? Number(form.cost)
            : 0,

        serviceProvider:
          form.serviceProvider,

        notes:
          form.notes,

        nextServiceDate:
          form.nextServiceDate ||
          null,

        nextServiceKilometers:
          form.nextServiceKilometers
            ? Number(
                form.nextServiceKilometers
              )
            : null,
      });

      setForm({
        ...emptyForm,

        serviceDate:
          new Date()
            .toISOString()
            .split("T")[0],
      });

      await loadServices();
    } catch (error) {
      console.error(
        "SAVE VEHICLE SERVICE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this service record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicleService(id);

      await loadServices();
    } catch (error) {
      console.error(
        "DELETE VEHICLE SERVICE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete service."
      );
    }
  }

  return (
    <div className="space-y-6">

      {/* ADD SERVICE */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Add Service Record
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record maintenance and service work.
          </p>

        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">

          {/* DATE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Service Date
            </label>

            <input
              type="date"
              value={form.serviceDate}
              onChange={(e) =>
                update(
                  "serviceDate",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* SERVICE TYPE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Service Type
            </label>

            <select
              value={form.serviceType}
              onChange={(e) =>
                update(
                  "serviceType",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select service
              </option>

              <option value="Regular Service">
                Regular Service
              </option>

              <option value="Oil Change">
                Oil Change
              </option>

              <option value="Brake Service">
                Brake Service
              </option>

              <option value="Engine">
                Engine
              </option>

              <option value="Transmission">
                Transmission
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Repair">
                Repair
              </option>

              <option value="Inspection">
                Inspection
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* KILOMETERS */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Kilometers
            </label>

            <input
              type="number"
              min="0"
              value={form.kilometers}
              onChange={(e) =>
                update(
                  "kilometers",
                  e.target.value
                )
              }
              placeholder="Current KM"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* COST */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Cost (€)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={(e) =>
                update(
                  "cost",
                  e.target.value
                )
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* PROVIDER */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Service Provider
            </label>

            <input
              value={form.serviceProvider}
              onChange={(e) =>
                update(
                  "serviceProvider",
                  e.target.value
                )
              }
              placeholder="Garage / mechanic"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* NEXT SERVICE DATE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Next Service Date
            </label>

            <input
              type="date"
              value={form.nextServiceDate}
              onChange={(e) =>
                update(
                  "nextServiceDate",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* NEXT SERVICE KM */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Next Service KM
            </label>

            <input
              type="number"
              min="0"
              value={
                form.nextServiceKilometers
              }
              onChange={(e) =>
                update(
                  "nextServiceKilometers",
                  e.target.value
                )
              }
              placeholder="e.g. 150000"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <input
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
              placeholder="What was done?"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* NOTES */}

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                update(
                  "notes",
                  e.target.value
                )
              }
              rows={3}
              placeholder="Additional notes..."
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Add Service"}
          </button>

        </div>

      </div>

      {/* SERVICE HISTORY */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Service History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete maintenance history for this vehicle.
          </p>

        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading service history...
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No service records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    KM
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Provider
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Cost
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {services.map(
                  (service) => (
                    <tr
                      key={service.id}
                      className="border-t border-slate-100"
                    >

                      <td className="whitespace-nowrap px-6 py-4">
                        {service.serviceDate}
                      </td>

                      <td className="px-6 py-4">

                        <div className="font-medium">
                          {service.serviceType}
                        </div>

                        {service.description && (
                          <div className="mt-1 text-sm text-slate-500">
                            {service.description}
                          </div>
                        )}

                        {service.notes && (
                          <div className="mt-1 text-xs text-slate-400">
                            {service.notes}
                          </div>
                        )}

                        {(service.nextServiceDate ||
                          service.nextServiceKilometers !==
                            null) && (
                          <div className="mt-2 text-xs text-slate-400">
                            Next service:

                            {service.nextServiceDate &&
                              ` ${service.nextServiceDate}`}

                            {service.nextServiceKilometers !==
                              null &&
                              ` · ${service.nextServiceKilometers.toLocaleString()} km`}
                          </div>
                        )}

                      </td>

                      <td className="px-6 py-4">
                        {service.kilometers !==
                        null
                          ? service.kilometers.toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {service.serviceProvider ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        €
                        {service.cost.toFixed(
                          2
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              service.id
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}