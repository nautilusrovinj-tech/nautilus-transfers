"use client";

import { useEffect, useState } from "react";

import { Driver } from "@/types/driver";

import EmptyState from "@/components/ui/EmptyState";
import { DataTable } from "@/components/table/DataTable";
import { getDriverColumns } from "./DriverColumns";

import { getDriverDocuments } from "@/services/driverDocuments";

interface Props {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

interface DriverDocumentStatus {
  total: number;
  expired: number;
  expiringSoon: number;
}

export default function DriversTable({
  drivers,
  onEdit,
  onDelete,
}: Props) {
  const [documentStatus, setDocumentStatus] =
    useState<Record<string, DriverDocumentStatus>>(
      {}
    );

  useEffect(() => {
    let cancelled = false;

    async function loadDocumentStatus() {
      const result: Record<
        string,
        DriverDocumentStatus
      > = {};

      await Promise.all(
        drivers.map(async (driver) => {
          try {
            const documents =
              await getDriverDocuments(
                driver.id
              );

            let expired = 0;
            let expiringSoon = 0;

            const today = new Date();

            today.setHours(
              0,
              0,
              0,
              0
            );

            documents.forEach(
              (document) => {
                if (!document.expiryDate) {
                  return;
                }

                const expiry =
                  new Date(
                    `${document.expiryDate}T00:00:00`
                  );

                expiry.setHours(
                  0,
                  0,
                  0,
                  0
                );

                const difference =
                  expiry.getTime() -
                  today.getTime();

                const daysRemaining =
                  Math.ceil(
                    difference /
                      (1000 *
                        60 *
                        60 *
                        24)
                  );

                if (
                  daysRemaining < 0
                ) {
                  expired++;
                } else if (
                  daysRemaining <= 30
                ) {
                  expiringSoon++;
                }
              }
            );

            result[driver.id] = {
              total:
                documents.length,
              expired,
              expiringSoon,
            };
          } catch (error) {
            console.error(
              `Failed to load documents for driver ${driver.id}:`,
              error
            );

            result[driver.id] = {
              total: 0,
              expired: 0,
              expiringSoon: 0,
            };
          }
        })
      );

      if (!cancelled) {
        setDocumentStatus(result);
      }
    }

    if (drivers.length > 0) {
      void loadDocumentStatus();
    } else {
      setDocumentStatus({});
    }

    return () => {
      cancelled = true;
    };
  }, [drivers]);

  if (drivers.length === 0) {
    return (
      <EmptyState
        title="No drivers found"
        description="Create your first driver."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <DataTable
        columns={getDriverColumns({
          onEdit,
          onDelete,
          documentStatus,
        })}
        data={drivers}
      />
    </div>
  );
}