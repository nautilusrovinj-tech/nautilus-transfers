"use client";

import { useEffect, useState } from "react";

import {
  getVehicleTires,
  createVehicleTire,
  deleteVehicleTire,
} from "@/services/vehicleTires";

import { VehicleTire } from "@/types/vehicle-tire";

interface Props {
  vehicleId: string;
}

const emptyForm = {
  date:
    new Date().toISOString().split("T")[0],

  kilometers: "",

  tireType: "",

  brand: "",

  size: "",

  cost: "",

  note: "",
};

export default function VehicleTireTab({
  vehicleId,
}: Props) {
  const [tires, setTires] =
    useState<VehicleTire[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);


  async function loadTires() {
    try {
      setLoading(true);

      const data =
        await getVehicleTires(
          vehicleId
        );

      setTires(data);
    } catch (error) {
      console.error(
        "LOAD VEHICLE TIRES ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load tire history."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    void loadTires();
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
    if (!form.tireType.trim()) {
      alert(
        "Tire type is required."
      );
      return;
    }

    try {
      setSaving(true);

      await createVehicleTire({
        vehicleId,

        date:
          form.date,

        kilometers:
          form.kilometers
            ? Number(form.kilometers)
            : null,

        tireType:
          form.tireType,

        brand:
          form.brand,

        size:
          form.size,

        cost:
          form.cost
            ? Number(form.cost)
            : 0,

        note:
          form.note,
      });

      setForm({
        ...emptyForm,

        date:
          new Date()
            .toISOString()
            .split("T")[0],
      });

      await loadTires();

    } catch (error) {
      console.error(
        "SAVE VEHICLE TIRE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save tire record."
      );
    } finally {
      setSaving(false);
    }
  }


  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete this tire record?"
      )
    ) {
      return;
    }

    try {
      await deleteVehicleTire(id);

      await loadTires();

    } catch (error) {
      console.error(
        "DELETE VEHICLE TIRE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete tire record."
      );
    }
  }


  return (
    <div className="space-y-6">

      {/* ADD TIRES */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Add Tire Record
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record tire changes and tire costs.
          </p>

        </div>


        <div className="grid gap-4 p-6 md:grid-cols-2">

          {/* DATE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Date
            </label>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                update(
                  "date",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
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


          {/* TIRE TYPE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Tire Type
            </label>

            <select
              value={form.tireType}
              onChange={(e) =>
                update(
                  "tireType",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select tire type
              </option>

              <option value="Summer">
                Summer
              </option>

              <option value="Winter">
                Winter
              </option>

              <option value="All-season">
                All-season
              </option>
            </select>
          </div>


          {/* BRAND */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Brand
            </label>

            <input
              value={form.brand}
              onChange={(e) =>
                update(
                  "brand",
                  e.target.value
                )
              }
              placeholder="Michelin"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>


          {/* SIZE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Tire Size
            </label>

            <input
              value={form.size}
              onChange={(e) =>
                update(
                  "size",
                  e.target.value
                )
              }
              placeholder="225/45 R17"
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


          {/* NOTE */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-medium">
              Notes
            </label>

            <textarea
              value={form.note}
              onChange={(e) =>
                update(
                  "note",
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
              : "Add Tire Record"}
          </button>

        </div>

      </div>


      {/* HISTORY */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Tire History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete tire history for this vehicle.
          </p>

        </div>


        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading tire history...
          </div>

        ) : tires.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No tire records yet.
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
                    Type
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Brand
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Size
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    KM
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

                {tires.map(
                  (tire) => (
                    <tr
                      key={tire.id}
                      className="border-t border-slate-100"
                    >

                      <td className="whitespace-nowrap px-6 py-4">
                        {tire.date}
                      </td>

                      <td className="px-6 py-4">

                        <div className="font-medium">
                          {tire.tireType}
                        </div>

                        {tire.note && (
                          <div className="mt-1 text-sm text-slate-500">
                            {tire.note}
                          </div>
                        )}

                      </td>

                      <td className="px-6 py-4">
                        {tire.brand || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {tire.size || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {tire.kilometers !== null
                          ? tire.kilometers.toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        €
                        {tire.cost.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              tire.id
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