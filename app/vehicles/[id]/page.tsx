"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import { getVehicleById } from "@/services/vehicles";

import {
  createVehicleKilometer,
  deleteVehicleKilometer,
  getVehicleKilometers,
} from "@/services/vehicleKilometers";

import {
  createVehicleFuel,
  deleteVehicleFuel,
  getVehicleFuel,
} from "@/services/vehicleFuel";

import VehicleServiceTab from "@/components/vehicles/VehicleServiceTab";
import VehicleTireTab from "@/components/vehicles/VehicleTireTab";
import VehicleExpenseTab from "@/components/vehicles/VehicleExpenseTab";
import VehicleDocumentTab from "@/components/vehicles/VehicleDocumentTab";

import { Vehicle } from "@/types/vehicle";
import { VehicleKilometer } from "@/types/vehicle-kilometer";
import { VehicleFuel } from "@/types/vehicle-fuel";

type Section =
  | "overview"
  | "fuel"
  | "service"
  | "tires"
  | "expenses"
  | "documents";

export default function VehicleDetailsPage() {
  const params = useParams();

  const vehicleId = params.id as string;

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [kilometers, setKilometers] =
    useState<VehicleKilometer[]>([]);

  const [fuelRecords, setFuelRecords] =
    useState<VehicleFuel[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingKilometers, setLoadingKilometers] =
    useState(true);

  const [loadingFuel, setLoadingFuel] =
    useState(true);

  const [savingKilometers, setSavingKilometers] =
    useState(false);

  const [savingFuel, setSavingFuel] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState<Section>("overview");

  // -----------------------------------------
  // Kilometer form
  // -----------------------------------------

  const [kilometerDate, setKilometerDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [kilometerValue, setKilometerValue] =
    useState("");

  const [kilometerNote, setKilometerNote] =
    useState("");

  // -----------------------------------------
  // Fuel form
  // -----------------------------------------

  const [fuelDate, setFuelDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [fuelLiters, setFuelLiters] =
    useState("");

  const [fuelPricePerLiter, setFuelPricePerLiter] =
    useState("");

  const [fuelKilometers, setFuelKilometers] =
    useState("");

  const [fuelStation, setFuelStation] =
    useState("");

  const [fuelNote, setFuelNote] =
    useState("");

  // -----------------------------------------
  // Load vehicle
  // -----------------------------------------

  async function loadVehicle() {
    try {
      setLoading(true);

      const data =
        await getVehicleById(vehicleId);

      setVehicle(data);
    } catch (error) {
      console.error(
        "Load vehicle error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load vehicle."
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------
  // Load kilometers
  // -----------------------------------------

  async function loadKilometers() {
    try {
      setLoadingKilometers(true);

      const data =
        await getVehicleKilometers(
          vehicleId
        );

      setKilometers(data);
    } catch (error) {
      console.error(
        "Load kilometers error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load kilometer history."
      );
    } finally {
      setLoadingKilometers(false);
    }
  }

  // -----------------------------------------
  // Load fuel
  // -----------------------------------------

  async function loadFuel() {
    try {
      setLoadingFuel(true);

      const data =
        await getVehicleFuel(
          vehicleId
        );

      setFuelRecords(data);
    } catch (error) {
      console.error(
        "Load fuel error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load fuel history."
      );
    } finally {
      setLoadingFuel(false);
    }
  }

  // -----------------------------------------
  // Initial load
  // -----------------------------------------

  useEffect(() => {
    if (!vehicleId) {
      return;
    }

    void loadVehicle();
    void loadKilometers();
    void loadFuel();
  }, [vehicleId]);

  // -----------------------------------------
  // Current kilometers
  // -----------------------------------------

  const currentKilometers =
    useMemo(() => {
      if (kilometers.length === 0) {
        return null;
      }

      return Math.max(
        ...kilometers.map(
          (item) =>
            item.kilometers
        )
      );
    }, [kilometers]);

  // -----------------------------------------
  // Fuel totals
  // -----------------------------------------

  const totalFuelLiters =
    useMemo(() => {
      return fuelRecords.reduce(
        (sum, item) =>
          sum + item.liters,
        0
      );
    }, [fuelRecords]);

  const totalFuelCost =
    useMemo(() => {
      return fuelRecords.reduce(
        (sum, item) =>
          sum + item.totalCost,
        0
      );
    }, [fuelRecords]);

  const averageFuelPrice =
    useMemo(() => {
      if (totalFuelLiters === 0) {
        return 0;
      }

      return (
        totalFuelCost /
        totalFuelLiters
      );
    }, [
      totalFuelCost,
      totalFuelLiters,
    ]);

  // -----------------------------------------
  // Add kilometers
  // -----------------------------------------

  async function handleAddKilometers() {
    const value =
      Number(kilometerValue);

    if (!kilometerDate) {
      alert(
        "Please select a date."
      );

      return;
    }

    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      alert(
        "Please enter valid kilometers."
      );

      return;
    }

    if (
      currentKilometers !== null &&
      value < currentKilometers
    ) {
      alert(
        `Kilometers cannot be lower than the current value of ${currentKilometers.toLocaleString()} km.`
      );

      return;
    }

    try {
      setSavingKilometers(true);

      await createVehicleKilometer(
        vehicleId,
        kilometerDate,
        value,
        kilometerNote
      );

      setKilometerValue("");
      setKilometerNote("");

      await loadKilometers();
    } catch (error) {
      console.error(
        "Save kilometers error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save kilometers."
      );
    } finally {
      setSavingKilometers(false);
    }
  }

  // -----------------------------------------
  // Delete kilometers
  // -----------------------------------------

  async function handleDeleteKilometers(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this kilometer record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicleKilometer(id);

      await loadKilometers();
    } catch (error) {
      console.error(
        "Delete kilometer error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete kilometer record."
      );
    }
  }

  // -----------------------------------------
  // Add fuel
  // -----------------------------------------

  async function handleAddFuel() {
    const liters =
      Number(fuelLiters);

    const pricePerLiter =
      Number(
        fuelPricePerLiter
      );

    const kilometers =
      fuelKilometers.trim()
        ? Number(fuelKilometers)
        : null;

    if (!fuelDate) {
      alert(
        "Please select a date."
      );

      return;
    }

    if (
      !Number.isFinite(liters) ||
      liters <= 0
    ) {
      alert(
        "Please enter valid fuel liters."
      );

      return;
    }

    if (
      !Number.isFinite(
        pricePerLiter
      ) ||
      pricePerLiter <= 0
    ) {
      alert(
        "Please enter a valid price per liter."
      );

      return;
    }

    if (
      kilometers !== null &&
      (!Number.isFinite(kilometers) ||
        kilometers < 0)
    ) {
      alert(
        "Please enter valid kilometers."
      );

      return;
    }

    const totalCost =
      Number(
        (
          liters *
          pricePerLiter
        ).toFixed(2)
      );

    try {
      setSavingFuel(true);

      await createVehicleFuel(
        vehicleId,
        fuelDate,
        liters,
        pricePerLiter,
        totalCost,
        kilometers,
        fuelStation,
        fuelNote
      );

      setFuelLiters("");
      setFuelPricePerLiter("");
      setFuelKilometers("");
      setFuelStation("");
      setFuelNote("");

      await loadFuel();
    } catch (error) {
      console.error(
        "Save fuel error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save fuel record."
      );
    } finally {
      setSavingFuel(false);
    }
  }

  // -----------------------------------------
  // Delete fuel
  // -----------------------------------------

  async function handleDeleteFuel(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this fuel record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicleFuel(id);

      await loadFuel();
    } catch (error) {
      console.error(
        "Delete fuel error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete fuel record."
      );
    }
  }

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading vehicle...
        </div>
      </AppLayout>
    );
  }

  // -----------------------------------------
  // Vehicle not found
  // -----------------------------------------

  if (!vehicle) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

          <h1 className="text-xl font-semibold">
            Vehicle not found
          </h1>

          <Link
            href="/vehicles"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Back to Vehicles
          </Link>

        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div className="space-y-6">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <Link
              href="/vehicles"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Back to Vehicles
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {vehicle.name}
            </h1>

            <p className="mt-1 text-slate-500">
              {vehicle.registration || "-"}
            </p>

          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              vehicle.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {vehicle.active
              ? "Active"
              : "Inactive"}
          </span>

        </div>

        {/* ====================================== */}
        {/* NAVIGATION */}
        {/* ====================================== */}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">

          <div className="flex min-w-max">

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "overview"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection ===
                "overview"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "fuel"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection === "fuel"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Fuel
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "service"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection ===
                "service"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Service
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "tires"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection ===
                "tires"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Tires
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "expenses"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection ===
                "expenses"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Expenses
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "documents"
                )
              }
              className={`px-6 py-4 text-sm font-semibold ${
                activeSection ===
                "documents"
                  ? "border-b-2 border-slate-900 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Documents
            </button>

          </div>

        </div>

        {/* ====================================== */}
        {/* OVERVIEW */}
        {/* ====================================== */}

        {activeSection ===
          "overview" && (
          <>

            <div className="grid gap-6 md:grid-cols-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Vehicle
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {vehicle.name}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Registration
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {vehicle.registration || "-"}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Seats
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {vehicle.seats}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Current KM
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {currentKilometers !==
                  null
                    ? `${currentKilometers.toLocaleString()} km`
                    : "-"}
                </p>

              </div>

            </div>

            {/* KILOMETERS */}

            <div className="rounded-2xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-xl font-semibold">
                  Kilometers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record vehicle odometer readings.
                </p>

              </div>

              <div className="border-b border-slate-200 bg-slate-50 p-6">

                <div className="grid gap-4 md:grid-cols-4">

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Date
                    </label>

                    <input
                      type="date"
                      value={
                        kilometerDate
                      }
                      onChange={(e) =>
                        setKilometerDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Kilometers
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        kilometerValue
                      }
                      onChange={(e) =>
                        setKilometerValue(
                          e.target.value
                        )
                      }
                      placeholder="127450"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Note
                    </label>

                    <input
                      type="text"
                      value={
                        kilometerNote
                      }
                      onChange={(e) =>
                        setKilometerNote(
                          e.target.value
                        )
                      }
                      placeholder="Optional"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div className="flex items-end">

                    <button
                      type="button"
                      onClick={
                        handleAddKilometers
                      }
                      disabled={
                        savingKilometers
                      }
                      className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      {savingKilometers
                        ? "Saving..."
                        : "Add KM"}
                    </button>

                  </div>

                </div>

              </div>

              {loadingKilometers ? (
                <div className="p-8 text-center text-slate-500">
                  Loading kilometer history...
                </div>
              ) : kilometers.length ===
                0 ? (
                <div className="p-8 text-center text-slate-500">
                  No kilometer records yet.
                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="min-w-full">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Kilometers
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Note
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {kilometers.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100"
                          >

                            <td className="px-6 py-4">
                              {item.date}
                            </td>

                            <td className="px-6 py-4 text-right font-semibold">
                              {item.kilometers.toLocaleString()}{" "}
                              km
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {item.note ||
                                "-"}
                            </td>

                            <td className="px-6 py-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteKilometers(
                                    item.id
                                  )
                                }
                                className="text-sm font-medium text-red-600 hover:text-red-700"
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

          </>
        )}

        {/* ====================================== */}
        {/* FUEL */}
        {/* ====================================== */}

        {activeSection ===
          "fuel" && (
          <>

            {/* SUMMARY */}

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Total Fuel
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {totalFuelLiters.toFixed(
                    2
                  )}{" "}
                  L
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Total Fuel Cost
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  €{totalFuelCost.toFixed(2)}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <p className="text-sm text-slate-500">
                  Average Price
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  €{averageFuelPrice.toFixed(
                    3
                  )}
                  /L
                </p>

              </div>

            </div>

            {/* ADD FUEL */}

            <div className="rounded-2xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-xl font-semibold">
                  Add Fuel
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record every refueling for this vehicle.
                </p>

              </div>

              <div className="bg-slate-50 p-6">

                <div className="grid gap-4 md:grid-cols-3">

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Date
                    </label>

                    <input
                      type="date"
                      value={fuelDate}
                      onChange={(e) =>
                        setFuelDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Liters
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        fuelLiters
                      }
                      onChange={(e) =>
                        setFuelLiters(
                          e.target.value
                        )
                      }
                      placeholder="50.00"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Price / Liter
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={
                        fuelPricePerLiter
                      }
                      onChange={(e) =>
                        setFuelPricePerLiter(
                          e.target.value
                        )
                      }
                      placeholder="1.650"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Kilometers
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        fuelKilometers
                      }
                      onChange={(e) =>
                        setFuelKilometers(
                          e.target.value
                        )
                      }
                      placeholder="127500"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Fuel Station
                    </label>

                    <input
                      type="text"
                      value={
                        fuelStation
                      }
                      onChange={(e) =>
                        setFuelStation(
                          e.target.value
                        )
                      }
                      placeholder="INA"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Note
                    </label>

                    <input
                      type="text"
                      value={
                        fuelNote
                      }
                      onChange={(e) =>
                        setFuelNote(
                          e.target.value
                        )
                      }
                      placeholder="Optional"
                      className="w-full rounded-lg border border-slate-300 bg-white p-3"
                    />

                  </div>

                </div>

                <div className="mt-4 flex items-center justify-between gap-4">

                  <div className="text-sm text-slate-500">

                    {fuelLiters &&
                    fuelPricePerLiter
                      ? `Total: €${(
                          Number(
                            fuelLiters
                          ) *
                          Number(
                            fuelPricePerLiter
                          )
                        ).toFixed(2)}`
                      : "Enter liters and price per liter."}

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleAddFuel
                    }
                    disabled={
                      savingFuel
                    }
                    className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {savingFuel
                      ? "Saving..."
                      : "Add Fuel"}
                  </button>

                </div>

              </div>

            </div>

            {/* FUEL HISTORY */}

            <div className="rounded-2xl border border-slate-200 bg-white">

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="text-xl font-semibold">
                  Fuel History
                </h2>

              </div>

              {loadingFuel ? (
                <div className="p-8 text-center text-slate-500">
                  Loading fuel history...
                </div>
              ) : fuelRecords.length ===
                0 ? (
                <div className="p-8 text-center text-slate-500">
                  No fuel records yet.
                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="min-w-full">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Liters
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Price/L
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Total
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          KM
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Station
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Note
                        </th>

                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {fuelRecords.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100"
                          >

                            <td className="px-6 py-4">
                              {item.date}
                            </td>

                            <td className="px-6 py-4 text-right font-semibold">
                              {item.liters.toFixed(
                                2
                              )}{" "}
                              L
                            </td>

                            <td className="px-6 py-4 text-right">
                              €
                              {item.pricePerLiter.toFixed(
                                3
                              )}
                            </td>

                            <td className="px-6 py-4 text-right font-semibold">
                              €
                              {item.totalCost.toFixed(
                                2
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {item.kilometers !==
                              null
                                ? item.kilometers.toLocaleString()
                                : "-"}
                            </td>

                            <td className="px-6 py-4">
                              {item.fuelStation ||
                                "-"}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {item.note ||
                                "-"}
                            </td>

                            <td className="px-6 py-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteFuel(
                                    item.id
                                  )
                                }
                                className="text-sm font-medium text-red-600 hover:text-red-700"
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

          </>
        )}

        {/* ====================================== */}
        {/* SERVICE */}
        {/* ====================================== */}

        {activeSection ===
          "service" && (
          <VehicleServiceTab
            vehicleId={
              vehicle.id
            }
          />
        )}

        {/* ====================================== */}
        {/* TIRES */}
        {/* ====================================== */}

        {activeSection ===
          "tires" && (
          <VehicleTireTab
            vehicleId={
              vehicle.id
            }
          />
        )}

        {/* ====================================== */}
        {/* EXPENSES */}
        {/* ====================================== */}

        {activeSection ===
          "expenses" && (
          <VehicleExpenseTab
            vehicleId={
              vehicle.id
            }
          />
        )}

        {/* ====================================== */}
        {/* DOCUMENTS */}
        {/* ====================================== */}

        {activeSection ===
          "documents" && (
          <VehicleDocumentTab
            vehicleId={
              vehicle.id
            }
          />
        )}

      </div>

    </AppLayout>
  );
}