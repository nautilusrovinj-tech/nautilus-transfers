"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getVehicleExpenses,
  createVehicleExpense,
  deleteVehicleExpense,
} from "@/services/vehicleExpenses";

import { VehicleExpense } from "@/types/vehicle-expense";

interface Props {
  vehicleId: string;
}

const getToday = () =>
  new Date()
    .toISOString()
    .split("T")[0];

const emptyForm = {
  date: getToday(),
  kilometers: "",
  category: "",
  description: "",
  amount: "",
  liters: "",
  pricePerLiter: "",
  provider: "",
  note: "",
};

export default function VehicleExpenseTab({
  vehicleId,
}: Props) {
  const [expenses, setExpenses] =
    useState<VehicleExpense[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  async function loadExpenses() {
    try {
      setLoading(true);

      const data =
        await getVehicleExpenses(
          vehicleId
        );

      setExpenses(data);
    } catch (error) {
      console.error(
        "LOAD VEHICLE EXPENSES ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load expenses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadExpenses();
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

  const calculatedFuelAmount =
    form.liters &&
    form.pricePerLiter
      ? Number(form.liters) *
        Number(form.pricePerLiter)
      : 0;

  const displayedAmount =
    form.category === "Fuel" &&
    calculatedFuelAmount > 0
      ? calculatedFuelAmount
      : Number(form.amount || 0);

  async function handleSave() {
    if (!form.category.trim()) {
      alert(
        "Expense category is required."
      );
      return;
    }

    if (!form.amount && displayedAmount <= 0) {
      alert(
        "Please enter an expense amount."
      );
      return;
    }

    try {
      setSaving(true);

      await createVehicleExpense({
        vehicleId,

        date:
          form.date,

        kilometers:
          form.kilometers
            ? Number(form.kilometers)
            : null,

        category:
          form.category,

        description:
          form.description,

        amount:
          displayedAmount,

        liters:
          form.liters
            ? Number(form.liters)
            : null,

        pricePerLiter:
          form.pricePerLiter
            ? Number(
                form.pricePerLiter
              )
            : null,

        provider:
          form.provider,

        note:
          form.note,
      });

      setForm({
        ...emptyForm,
        date: getToday(),
      });

      await loadExpenses();
    } catch (error) {
      console.error(
        "SAVE VEHICLE EXPENSE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save expense."
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
        "Delete this expense?"
      )
    ) {
      return;
    }

    try {
      await deleteVehicleExpense(id);

      await loadExpenses();
    } catch (error) {
      console.error(
        "DELETE VEHICLE EXPENSE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete expense."
      );
    }
  }

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      ),
    [expenses]
  );

  return (
    <div className="space-y-6">

      {/* ADD EXPENSE */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Add Expense
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record vehicle expenses, fuel and other operating costs.
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

          {/* KM */}

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

          {/* CATEGORY */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                update(
                  "category",
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select category
              </option>

              <option value="Fuel">
                Fuel
              </option>

              <option value="Service">
                Service
              </option>

              <option value="Repair">
                Repair
              </option>

              <option value="Insurance">
                Insurance
              </option>

              <option value="Registration">
                Registration
              </option>

              <option value="Cleaning">
                Cleaning
              </option>

              <option value="Parking">
                Parking
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
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
              placeholder="e.g. Diesel fuel"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* FUEL LITERS */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Liters
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.liters}
              onChange={(e) =>
                update(
                  "liters",
                  e.target.value
                )
              }
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* PRICE PER LITER */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Price / Liter (€)
            </label>

            <input
              type="number"
              min="0"
              step="0.001"
              value={form.pricePerLiter}
              onChange={(e) =>
                update(
                  "pricePerLiter",
                  e.target.value
                )
              }
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* AMOUNT */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount (€)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={
                form.category === "Fuel" &&
                calculatedFuelAmount > 0
                  ? calculatedFuelAmount.toFixed(2)
                  : form.amount
              }
              onChange={(e) =>
                update(
                  "amount",
                  e.target.value
                )
              }
              disabled={
                form.category === "Fuel" &&
                calculatedFuelAmount > 0
              }
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 p-3 disabled:bg-slate-100"
            />

            {form.category === "Fuel" &&
              calculatedFuelAmount > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Calculated from liters × price/liter.
                </p>
              )}
          </div>

          {/* PROVIDER */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Provider
            </label>

            <input
              value={form.provider}
              onChange={(e) =>
                update(
                  "provider",
                  e.target.value
                )
              }
              placeholder="Garage / Petrol station / Company"
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          {/* NOTE */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-sm font-medium">
              Note
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
              : "Add Expense"}
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Expenses
          </p>

          <p className="mt-2 text-2xl font-bold">
            €{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Records
          </p>

          <p className="mt-2 text-2xl font-bold">
            {expenses.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Fuel Expenses
          </p>

          <p className="mt-2 text-2xl font-bold">
            €
            {expenses
              .filter(
                (expense) =>
                  expense.category ===
                  "Fuel"
              )
              .reduce(
                (sum, expense) =>
                  sum + expense.amount,
                0
              )
              .toFixed(2)}
          </p>
        </div>

      </div>

      {/* HISTORY */}

      <div className="rounded-2xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold">
            Expense History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete expense history for this vehicle.
          </p>

        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No expenses recorded yet.
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
                    Category
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    KM
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Provider
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.map(
                  (expense) => (
                    <tr
                      key={expense.id}
                      className="border-t border-slate-100"
                    >

                      <td className="whitespace-nowrap px-6 py-4">
                        {expense.date}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium">
                          {expense.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          {expense.description ||
                            "-"}
                        </div>

                        {expense.note && (
                          <div className="mt-1 text-sm text-slate-500">
                            {expense.note}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {expense.kilometers !==
                        null
                          ? expense.kilometers.toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        {expense.provider ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        €
                        {expense.amount.toFixed(
                          2
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              expense.id
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