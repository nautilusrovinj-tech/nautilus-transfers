"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getVehicles } from "@/services/vehicles";
import { getVehicleServices } from "@/services/vehicleServices";
import { getVehicleDocuments } from "@/services/vehicleDocuments";
import { getVehicleKilometers } from "@/services/vehicleKilometers";

interface VehicleAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  registration: string;
  type: "service" | "registration";
  severity: "expired" | "soon";
  title: string;
  detail: string;
}

const DAYS_WARNING = 30;

function getDaysUntil(
  date: string | null
): number | null {
  if (!date) {
    return null;
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const target = new Date(
    `${date}T00:00:00`
  );

  target.setHours(
    0,
    0,
    0,
    0
  );

  return Math.ceil(
    (
      target.getTime() -
      today.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );
}

function formatDate(
  date: string
): string {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    "en-GB"
  );
}

export default function VehicleAlerts() {
  const [alerts, setAlerts] =
    useState<VehicleAlert[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      try {
        setLoading(true);

        const vehicles =
          await getVehicles();

        const activeVehicles =
          vehicles.filter(
            (vehicle) =>
              vehicle.active
          );

        const allAlerts: VehicleAlert[] =
          [];

        await Promise.all(
          activeVehicles.map(
            async (vehicle) => {
              try {
                const [
                  services,
                  documents,
                  kilometers,
                ] =
                  await Promise.all([
                    getVehicleServices(
                      vehicle.id
                    ),

                    getVehicleDocuments(
                      vehicle.id
                    ),

                    getVehicleKilometers(
                      vehicle.id
                    ),
                  ]);

                /*
                 * CURRENT VEHICLE KM
                 */

                const currentKm =
                  kilometers.length >
                  0
                    ? Math.max(
                        ...kilometers.map(
                          (item: any) =>
                            Number(
                              item.kilometers
                            )
                        )
                      )
                    : null;

                /*
                 * SERVICE ALERT
                 */

                const serviceWithTarget =
                  services
                    .filter(
                      (service) =>
                        service.nextServiceDate ||
                        service.nextServiceKilometers !==
                          null
                    )
                    .sort(
                      (
                        a,
                        b
                      ) =>
                        new Date(
                          b.serviceDate
                        ).getTime() -
                        new Date(
                          a.serviceDate
                        ).getTime()
                    )[0];

                if (
                  serviceWithTarget
                ) {
                  const service =
                    serviceWithTarget;

                  /*
                   * SERVICE DATE
                   */

                  if (
                    service.nextServiceDate
                  ) {
                    const days =
                      getDaysUntil(
                        service.nextServiceDate
                      );

                    if (
                      days !== null &&
                      days < 0
                    ) {
                      allAlerts.push({
                        id:
                          `service-date-${vehicle.id}`,

                        vehicleId:
                          vehicle.id,

                        vehicleName:
                          vehicle.name,

                        registration:
                          vehicle.registration,

                        type:
                          "service",

                        severity:
                          "expired",

                        title:
                          "Service overdue",

                        detail:
                          `Service was due ${formatDate(
                            service.nextServiceDate
                          )}.`,
                      });
                    } else if (
                      days !== null &&
                      days <=
                        DAYS_WARNING
                    ) {
                      allAlerts.push({
                        id:
                          `service-date-${vehicle.id}`,

                        vehicleId:
                          vehicle.id,

                        vehicleName:
                          vehicle.name,

                        registration:
                          vehicle.registration,

                        type:
                          "service",

                        severity:
                          "soon",

                        title:
                          "Service due soon",

                        detail:
                          `Service due ${formatDate(
                            service.nextServiceDate
                          )}.`,
                      });
                    }
                  }

                  /*
                   * SERVICE KM
                   */

                  if (
                    service.nextServiceKilometers !==
                      null &&
                    service.nextServiceKilometers !==
                      undefined &&
                    currentKm !==
                      null
                  ) {
                    const nextKm =
                      Number(
                        service.nextServiceKilometers
                      );

                    if (
                      currentKm >=
                      nextKm
                    ) {
                      allAlerts.push({
                        id:
                          `service-km-${vehicle.id}`,

                        vehicleId:
                          vehicle.id,

                        vehicleName:
                          vehicle.name,

                        registration:
                          vehicle.registration,

                        type:
                          "service",

                        severity:
                          "expired",

                        title:
                          "Service KM reached",

                        detail:
                          `Service was due at ${nextKm.toLocaleString()} km. Current: ${currentKm.toLocaleString()} km.`,
                      });
                    }
                  }
                }

                /*
                 * REGISTRATION ALERT
                 */

                const registrations =
                  documents.filter(
                    (document) =>
                      document.documentType
                        ?.toLowerCase() ===
                        "registration" &&
                      document.expiryDate
                  );

                /*
                 * If multiple registration
                 * documents exist, use the
                 * one with the nearest expiry.
                 */

                const registration =
                  registrations.sort(
                    (
                      a,
                      b
                    ) =>
                      new Date(
                        a.expiryDate!
                      ).getTime() -
                      new Date(
                        b.expiryDate!
                      ).getTime()
                  )[0];

                if (
                  registration &&
                  registration.expiryDate
                ) {
                  const days =
                    getDaysUntil(
                      registration.expiryDate
                    );

                  if (
                    days !== null &&
                    days < 0
                  ) {
                    allAlerts.push({
                      id:
                        `registration-${vehicle.id}`,

                      vehicleId:
                        vehicle.id,

                      vehicleName:
                        vehicle.name,

                      registration:
                        vehicle.registration,

                      type:
                        "registration",

                      severity:
                        "expired",

                      title:
                        "Registration expired",

                      detail:
                        `Expired ${formatDate(
                          registration.expiryDate
                        )}.`,
                    });
                  } else if (
                    days !== null &&
                    days <=
                      DAYS_WARNING
                  ) {
                    allAlerts.push({
                      id:
                        `registration-${vehicle.id}`,

                      vehicleId:
                        vehicle.id,

                      vehicleName:
                        vehicle.name,

                      registration:
                        vehicle.registration,

                      type:
                        "registration",

                      severity:
                        "soon",

                      title:
                        "Registration expires soon",

                      detail:
                        `Expires ${formatDate(
                          registration.expiryDate
                        )}.`,
                    });
                  }
                }
              } catch (error) {
                console.error(
                  `Vehicle alert error for ${vehicle.id}:`,
                  error
                );
              }
            }
          )
        );

        /*
         * Expired alerts first,
         * then upcoming alerts.
         */

        allAlerts.sort(
          (a, b) => {
            if (
              a.severity !==
              b.severity
            ) {
              return a.severity ===
                "expired"
                ? -1
                : 1;
            }

            return a.vehicleName.localeCompare(
              b.vehicleName
            );
          }
        );

        if (!cancelled) {
          setAlerts(
            allAlerts
          );
        }
      } catch (error) {
        console.error(
          "LOAD VEHICLE ALERTS ERROR:",
          error
        );

        if (!cancelled) {
          setAlerts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAlerts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Vehicle Alerts
        </h2>

        <p className="mt-4 text-sm text-slate-500">
          Checking vehicle service and registration...
        </p>

      </div>
    );
  }

  /*
   * NO ALERTS
   */

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-green-900">
              Vehicle Alerts
            </h2>

            <p className="mt-1 text-sm text-green-700">
              No vehicle service or registration warnings.
            </p>

          </div>

          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            All OK
          </div>

        </div>

      </div>
    );
  }

  /*
   * ALERTS
   */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Vehicle Alerts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Service and registration requiring attention.
          </p>

        </div>

        <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
          {alerts.length} alert
          {alerts.length !== 1
            ? "s"
            : ""}
        </div>

      </div>

      <div className="divide-y divide-slate-100">

        {alerts.map(
          (alert) => (
            <Link
              key={alert.id}
              href={`/vehicles/${alert.vehicleId}`}
              className="block px-6 py-5 transition hover:bg-slate-50"
            >

              <div className="flex items-start gap-4">

                <div
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    alert.severity ===
                    "expired"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                />

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="font-semibold text-slate-900">
                      {alert.vehicleName}
                    </p>

                    {alert.registration && (
                      <span className="text-sm text-slate-400">
                        {alert.registration}
                      </span>
                    )}

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        alert.type ===
                        "service"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {alert.type ===
                      "service"
                        ? "Service"
                        : "Registration"}
                    </span>

                  </div>

                  <p
                    className={`mt-1 font-medium ${
                      alert.severity ===
                      "expired"
                        ? "text-red-700"
                        : "text-orange-700"
                    }`}
                  >
                    {alert.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {alert.detail}
                  </p>

                </div>

                <span className="shrink-0 text-sm font-medium text-slate-400">
                  View →
                </span>

              </div>

            </Link>
          )
        )}

      </div>

    </div>
  );
}