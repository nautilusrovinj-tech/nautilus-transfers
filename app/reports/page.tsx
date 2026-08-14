"use client";

import { useMemo, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/ui/PageHeader";
import DateRangeFilter from "@/components/ui/DateRangeFilter";

import { useTransfers } from "@/hooks/useTransfers";
import { useLookups } from "@/hooks/useLookups";

import { Transfer } from "@/types/transfer";

const TODAY = new Date()
  .toISOString()
  .split("T")[0];

const STATUS_OPTIONS = [
  "All",
  "New",
  "Confirmed",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

const TYPE_OPTIONS = [
  "All",
  "Arrival",
  "Departure",
  "Tour",
  "Local",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(
    value
  );
}

function formatDate(date: string) {
  if (!date) return "-";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function percentage(
  value: number,
  total: number
) {
  if (!total) return "0%";

  return `${(
    (value / total) *
    100
  ).toFixed(1)}%`;
}

function getPassengers(
  transfer: Transfer
) {
  return (
    Number(transfer.adults || 0) +
    Number(transfer.children || 0)
  );
}

function getTransferRevenue(
  transfer: Transfer
) {
  return Number(transfer.price || 0);
}

function getTransferFuelCost(
  transfer: Transfer
) {
  return Number(
    transfer.fuelCost || 0
  );
}

function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
) {
  const result: Record<string, T[]> = {};

  for (const item of items) {
    const key =
      getKey(item) || "Unknown";

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

function escapeCSV(value: unknown) {
  const text = String(
    value ?? ""
  );

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
}

export default function ReportsPage() {
  const {
    transfers,
    loading,
  } = useTransfers();

  const {
    getDriverName,
    getVehicleName,
    getPartnerName,
  } = useLookups();

  const [fromDate, setFromDate] =
    useState(TODAY);

  const [toDate, setToDate] =
    useState(TODAY);

  const [driverFilter, setDriverFilter] =
    useState("All");

  const [vehicleFilter, setVehicleFilter] =
    useState("All");

  const [partnerFilter, setPartnerFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const filteredTransfers =
    useMemo(() => {
      return transfers.filter(
        (transfer) => {
          if (
            fromDate &&
            transfer.date < fromDate
          ) {
            return false;
          }

          if (
            toDate &&
            transfer.date > toDate
          ) {
            return false;
          }

          if (
            driverFilter !== "All" &&
            transfer.driverId !==
              driverFilter
          ) {
            return false;
          }

          if (
            vehicleFilter !== "All" &&
            transfer.vehicleId !==
              vehicleFilter
          ) {
            return false;
          }

          if (
            partnerFilter !== "All" &&
            transfer.partnerId !==
              partnerFilter
          ) {
            return false;
          }

          if (
            statusFilter !== "All" &&
            transfer.status !==
              statusFilter
          ) {
            return false;
          }

          if (
            typeFilter !== "All" &&
            transfer.transferType !==
              typeFilter
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      transfers,
      fromDate,
      toDate,
      driverFilter,
      vehicleFilter,
      partnerFilter,
      statusFilter,
      typeFilter,
    ]);

  const driverOptions = useMemo(() => {
    const map = new Map<
      string,
      string
    >();

    transfers.forEach(
      (transfer) => {
        if (transfer.driverId) {
          map.set(
            transfer.driverId,
            getDriverName(
              transfer.driverId
            )
          );
        }
      }
    );

    return Array.from(
      map.entries()
    ).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [
    transfers,
    getDriverName,
  ]);

  const vehicleOptions = useMemo(() => {
    const map = new Map<
      string,
      string
    >();

    transfers.forEach(
      (transfer) => {
        if (transfer.vehicleId) {
          map.set(
            transfer.vehicleId,
            getVehicleName(
              transfer.vehicleId
            )
          );
        }
      }
    );

    return Array.from(
      map.entries()
    ).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [
    transfers,
    getVehicleName,
  ]);

  const partnerOptions = useMemo(() => {
    const map = new Map<
      string,
      string
    >();

    transfers.forEach(
      (transfer) => {
        if (transfer.partnerId) {
          map.set(
            transfer.partnerId,
            getPartnerName(
              transfer.partnerId
            )
          );
        }
      }
    );

    return Array.from(
      map.entries()
    ).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [
    transfers,
    getPartnerName,
  ]);

  const stats = useMemo(() => {
    const total =
      filteredTransfers.length;

    const completed =
      filteredTransfers.filter(
        (transfer) =>
          transfer.status ===
          "Completed"
      ).length;

    const cancelled =
      filteredTransfers.filter(
        (transfer) =>
          transfer.status ===
          "Cancelled"
      ).length;

    const pending =
      filteredTransfers.filter(
        (transfer) =>
          transfer.status !==
            "Completed" &&
          transfer.status !==
            "Cancelled"
      ).length;

    const adults =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          Number(
            transfer.adults || 0
          ),
        0
      );

    const children =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          Number(
            transfer.children || 0
          ),
        0
      );

    const passengers =
      adults + children;

    const revenue =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          getTransferRevenue(
            transfer
          ),
        0
      );

    const completedRevenue =
      filteredTransfers
        .filter(
          (transfer) =>
            transfer.status ===
            "Completed"
        )
        .reduce(
          (sum, transfer) =>
            sum +
            getTransferRevenue(
              transfer
            ),
          0
        );

    const kilometres =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          Number(
            transfer.actualKilometers ||
              0
          ),
        0
      );

    const fuelLiters =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          Number(
            transfer.fuelLiters || 0
          ),
        0
      );

    const fuelCost =
      filteredTransfers.reduce(
        (sum, transfer) =>
          sum +
          getTransferFuelCost(
            transfer
          ),
        0
      );

    const netRevenue =
      revenue - fuelCost;

    const averageTransfer =
      total > 0
        ? revenue / total
        : 0;

    const revenuePerKm =
      kilometres > 0
        ? revenue / kilometres
        : 0;

    const fuelCostPerKm =
      kilometres > 0
        ? fuelCost / kilometres
        : 0;

    const fuelPer100Km =
      kilometres > 0
        ? (fuelLiters /
            kilometres) *
          100
        : 0;

    const whatsappSent =
      filteredTransfers.filter(
        (transfer) =>
          transfer.guestWhatsappSent
      ).length;

    const emailSent =
      filteredTransfers.filter(
        (transfer) =>
          transfer.guestEmailSent
      ).length;

    return {
      total,
      completed,
      cancelled,
      pending,
      adults,
      children,
      passengers,
      revenue,
      completedRevenue,
      kilometres,
      fuelLiters,
      fuelCost,
      netRevenue,
      averageTransfer,
      revenuePerKm,
      fuelCostPerKm,
      fuelPer100Km,
      whatsappSent,
      emailSent,
    };
  }, [filteredTransfers]);

  const driverReport = useMemo(() => {
    const groups = groupBy(
      filteredTransfers,
      (transfer) =>
        transfer.driverId ||
        "unassigned"
    );

    return Object.entries(groups)
      .map(
        ([id, items]) => {
          const completed =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Completed"
            ).length;

          const cancelled =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Cancelled"
            ).length;

          const passengers =
            items.reduce(
              (sum, transfer) =>
                sum +
                getPassengers(
                  transfer
                ),
              0
            );

          const revenue =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferRevenue(
                  transfer
                ),
              0
            );

          const kilometres =
            items.reduce(
              (sum, transfer) =>
                sum +
                Number(
                  transfer.actualKilometers ||
                    0
                ),
              0
            );

          return {
            id,
            name:
              id === "unassigned"
                ? "Unassigned"
                : getDriverName(id),
            transfers:
              items.length,
            completed,
            cancelled,
            passengers,
            revenue,
            kilometres,
            average:
              items.length > 0
                ? revenue /
                  items.length
                : 0,
          };
        }
      )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );
  }, [
    filteredTransfers,
    getDriverName,
  ]);

  const vehicleReport = useMemo(() => {
    const groups = groupBy(
      filteredTransfers,
      (transfer) =>
        transfer.vehicleId ||
        "unassigned"
    );

    return Object.entries(groups)
      .map(
        ([id, items]) => {
          const revenue =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferRevenue(
                  transfer
                ),
              0
            );

          const kilometres =
            items.reduce(
              (sum, transfer) =>
                sum +
                Number(
                  transfer.actualKilometers ||
                    0
                ),
              0
            );

          const fuelLiters =
            items.reduce(
              (sum, transfer) =>
                sum +
                Number(
                  transfer.fuelLiters ||
                    0
                ),
              0
            );

          const fuelCost =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferFuelCost(
                  transfer
                ),
              0
            );

          return {
            id,
            name:
              id === "unassigned"
                ? "Unassigned"
                : getVehicleName(id),
            transfers:
              items.length,
            revenue,
            kilometres,
            fuelLiters,
            fuelCost,
            fuelPer100Km:
              kilometres > 0
                ? (fuelLiters /
                    kilometres) *
                  100
                : 0,
            netRevenue:
              revenue -
              fuelCost,
          };
        }
      )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );
  }, [
    filteredTransfers,
    getVehicleName,
  ]);

  const partnerReport = useMemo(() => {
    const groups = groupBy(
      filteredTransfers,
      (transfer) =>
        transfer.partnerId ||
        "direct"
    );

    return Object.entries(groups)
      .map(
        ([id, items]) => {
          const completed =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Completed"
            ).length;

          const cancelled =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Cancelled"
            ).length;

          const passengers =
            items.reduce(
              (sum, transfer) =>
                sum +
                getPassengers(
                  transfer
                ),
              0
            );

          const revenue =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferRevenue(
                  transfer
                ),
              0
            );

          return {
            id,
            name:
              id === "direct"
                ? "Direct"
                : getPartnerName(id),
            transfers:
              items.length,
            completed,
            cancelled,
            passengers,
            revenue,
            average:
              items.length > 0
                ? revenue /
                  items.length
                : 0,
          };
        }
      )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );
  }, [
    filteredTransfers,
    getPartnerName,
  ]);

  const transferTypeReport =
    useMemo(() => {
      const groups = groupBy(
        filteredTransfers,
        (transfer) =>
          transfer.transferType
      );

      return Object.entries(groups)
        .map(
          ([type, items]) => {
            const revenue =
              items.reduce(
                (sum, transfer) =>
                  sum +
                  getTransferRevenue(
                    transfer
                  ),
                0
              );

            const passengers =
              items.reduce(
                (sum, transfer) =>
                  sum +
                  getPassengers(
                    transfer
                  ),
                0
              );

            const completed =
              items.filter(
                (transfer) =>
                  transfer.status ===
                  "Completed"
              ).length;

            return {
              type,
              transfers:
                items.length,
              completed,
              passengers,
              revenue,
              average:
                items.length > 0
                  ? revenue /
                    items.length
                  : 0,
            };
          }
        )
        .sort(
          (a, b) =>
            b.revenue - a.revenue
        );
    }, [filteredTransfers]);

  const monthlyReport = useMemo(() => {
    const groups = groupBy(
      filteredTransfers,
      (transfer) =>
        transfer.date.slice(0, 7)
    );

    return Object.entries(groups)
      .map(
        ([month, items]) => {
          const revenue =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferRevenue(
                  transfer
                ),
              0
            );

          const completed =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Completed"
            ).length;

          const cancelled =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Cancelled"
            ).length;

          const passengers =
            items.reduce(
              (sum, transfer) =>
                sum +
                getPassengers(
                  transfer
                ),
              0
            );

          const fuelCost =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferFuelCost(
                  transfer
                ),
              0
            );

          return {
            month,
            transfers:
              items.length,
            completed,
            cancelled,
            passengers,
            revenue,
            fuelCost,
            netRevenue:
              revenue -
              fuelCost,
          };
        }
      )
      .sort((a, b) =>
        a.month.localeCompare(
          b.month
        )
      );
  }, [filteredTransfers]);

  const dailyReport = useMemo(() => {
    const groups = groupBy(
      filteredTransfers,
      (transfer) =>
        transfer.date
    );

    return Object.entries(groups)
      .map(
        ([date, items]) => {
          const revenue =
            items.reduce(
              (sum, transfer) =>
                sum +
                getTransferRevenue(
                  transfer
                ),
              0
            );

          const completed =
            items.filter(
              (transfer) =>
                transfer.status ===
                "Completed"
            ).length;

          const passengers =
            items.reduce(
              (sum, transfer) =>
                sum +
                getPassengers(
                  transfer
                ),
              0
            );

          return {
            date,
            transfers:
              items.length,
            completed,
            passengers,
            revenue,
          };
        }
      )
      .sort((a, b) =>
        a.date.localeCompare(
          b.date
        )
      );
  }, [filteredTransfers]);

  function resetFilters() {
    setFromDate(TODAY);
    setToDate(TODAY);
    setDriverFilter("All");
    setVehicleFilter("All");
    setPartnerFilter("All");
    setStatusFilter("All");
    setTypeFilter("All");
  }

  function getExportRows() {
    return filteredTransfers
      .slice()
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .map((transfer) => ({
        transferNumber: transfer.transferNumber,
        date: transfer.date,
        time: transfer.time,
        type: transfer.transferType,
        guest: transfer.clientName,
        phone: transfer.phone,
        email: transfer.email,
        pickup: transfer.pickup,
        destination: transfer.destination,
        flight: transfer.flight,
        adults: transfer.adults,
        children: transfer.children,
        passengers: getPassengers(transfer),
        driver: getDriverName(transfer.driverId),
        vehicle: getVehicleName(transfer.vehicleId),
        partner: getPartnerName(transfer.partnerId),
        price: getTransferRevenue(transfer),
        paymentMethod: transfer.paymentMethod,
        status: transfer.status,
        kilometres: transfer.actualKilometers ?? "",
        fuelLiters: transfer.fuelLiters ?? "",
        fuelCost: transfer.fuelCost ?? "",
        whatsappSent: transfer.guestWhatsappSent ? "Yes" : "No",
        emailSent: transfer.guestEmailSent ? "Yes" : "No",
        notes: transfer.notes ?? "",
      }));
  }

  function exportExcel() {
    if (filteredTransfers.length === 0) return;

    const headers = [
      "Transfer Number", "Date", "Time", "Type", "Guest", "Phone", "Email",
      "Pickup", "Destination", "Flight", "Adults", "Children", "Passengers",
      "Driver", "Vehicle", "Partner", "Price (€)", "Payment Method", "Status",
      "Kilometres", "Fuel Liters", "Fuel Cost (€)", "WhatsApp Sent", "Email Sent", "Notes",
    ];

    const rows = getExportRows().map((row) => [
      row.transferNumber, row.date, row.time, row.type, row.guest, row.phone, row.email,
      row.pickup, row.destination, row.flight, row.adults, row.children, row.passengers,
      row.driver, row.vehicle, row.partner, row.price, row.paymentMethod, row.status,
      row.kilometres, row.fuelLiters, row.fuelCost, row.whatsappSent, row.emailSent, row.notes,
    ]);

    const xmlEscape = (value: unknown) => String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const xmlRow = (cells: unknown[], header = false) =>
      `<Row>${cells.map((cell) => `<Cell${header ? ' ss:StyleID="Header"' : ''}><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`).join("")}</Row>`;

    const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#E5E7EB" ss:Pattern="Solid"/></Style>
  </Styles>
  <Worksheet ss:Name="Transfers">
    <Table>
      ${xmlRow(headers, true)}
      ${rows.map((row) => xmlRow(row)).join("\n      ")}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Nautilus_Reports_${fromDate}_${toDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    if (filteredTransfers.length === 0) return;

    const rows = getExportRows();
    const selectedDriver = driverFilter === "All" ? "All drivers" : getDriverName(driverFilter);
    const selectedVehicle = vehicleFilter === "All" ? "All vehicles" : getVehicleName(vehicleFilter);
    const selectedPartner = partnerFilter === "All" ? "All partners" : partnerFilter === "Direct" ? "Direct" : getPartnerName(partnerFilter);

    const escapeHTML = (value: unknown) => String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    const reportRows = rows.map((row) => `
      <tr>
        <td>${escapeHTML(row.transferNumber)}</td>
        <td>${escapeHTML(formatDate(row.date))}</td>
        <td>${escapeHTML(row.time)}</td>
        <td>${escapeHTML(row.guest)}</td>
        <td>${escapeHTML(row.pickup)}</td>
        <td>${escapeHTML(row.destination)}</td>
        <td>${escapeHTML(row.driver)}</td>
        <td>${escapeHTML(row.vehicle)}</td>
        <td class="number">${escapeHTML(row.passengers)}</td>
        <td class="number">${escapeHTML(formatCurrency(row.price))}</td>
        <td>${escapeHTML(row.status)}</td>
        <td class="number">${escapeHTML(row.kilometres)}</td>
        <td class="number">${escapeHTML(row.fuelLiters)}</td>
      </tr>`).join("");

    const monthlyRows = monthlyReport.map((row) => `
      <tr><td>${escapeHTML(row.month)}</td><td class="number">${row.transfers}</td><td class="number">${row.completed}</td><td class="number">${row.cancelled}</td><td class="number">${row.passengers}</td><td class="number">${escapeHTML(formatCurrency(row.revenue))}</td><td class="number">${escapeHTML(formatCurrency(row.fuelCost))}</td><td class="number">${escapeHTML(formatCurrency(row.netRevenue))}</td></tr>`).join("");

    const driverRows = driverReport.map((row) => `
      <tr><td>${escapeHTML(row.name)}</td><td class="number">${row.transfers}</td><td class="number">${row.completed}</td><td class="number">${escapeHTML(formatCurrency(row.revenue))}</td><td class="number">${row.kilometres}</td><td class="number">${escapeHTML(formatCurrency(row.average))}</td></tr>`).join("");

    const vehicleRows = vehicleReport.map((row) => `
      <tr><td>${escapeHTML(row.name)}</td><td class="number">${row.transfers}</td><td class="number">${row.kilometres}</td><td class="number">${row.fuelLiters.toFixed(1)}</td><td class="number">${escapeHTML(formatCurrency(row.fuelCost))}</td><td class="number">${row.fuelPer100Km.toFixed(2)}</td><td class="number">${escapeHTML(formatCurrency(row.revenue))}</td></tr>`).join("");

    const partnerRows = partnerReport.map((row) => `
      <tr><td>${escapeHTML(row.name)}</td><td class="number">${row.transfers}</td><td class="number">${row.passengers}</td><td class="number">${escapeHTML(formatCurrency(row.revenue))}</td><td class="number">${escapeHTML(formatCurrency(row.average))}</td></tr>`).join("");

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) {
      alert("Please allow pop-ups to export the PDF report.");
      return;
    }

    printWindow.document.write(`<!doctype html>
<html><head><title>Nautilus Transfers Report</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111827; font-size: 9px; margin: 0; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 13px; margin: 18px 0 7px; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; }
  .subtitle { color: #6b7280; margin-bottom: 12px; }
  .filters { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 12px; }
  .filter { border: 1px solid #e5e7eb; padding: 6px; border-radius: 4px; }
  .filter strong { display: block; font-size: 7px; text-transform: uppercase; color: #6b7280; margin-bottom: 2px; }
  .stats { display: grid; grid-template-columns: repeat(8, 1fr); gap: 7px; }
  .stat { border: 1px solid #e5e7eb; padding: 7px; border-radius: 4px; }
  .stat strong { display: block; font-size: 7px; color: #6b7280; text-transform: uppercase; }
  .stat span { display: block; font-size: 13px; font-weight: bold; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
  th, td { border: 1px solid #d1d5db; padding: 4px 5px; text-align: left; vertical-align: top; }
  th { background: #f3f4f6; font-weight: bold; }
  .number { text-align: right; }
  .page-break { page-break-before: always; }
  .footer { margin-top: 16px; color: #6b7280; font-size: 8px; }
</style></head><body>
<h1>Nautilus Transfers — Management Report</h1>
<div class="subtitle">Period: ${escapeHTML(formatDate(fromDate))} – ${escapeHTML(formatDate(toDate))} · Generated ${escapeHTML(new Date().toLocaleString("en-GB"))}</div>
<div class="filters">
  <div class="filter"><strong>Status</strong>${escapeHTML(statusFilter === "All" ? "All statuses" : statusFilter)}</div>
  <div class="filter"><strong>Transfer Type</strong>${escapeHTML(typeFilter === "All" ? "All types" : typeFilter)}</div>
  <div class="filter"><strong>Driver</strong>${escapeHTML(selectedDriver)}</div>
  <div class="filter"><strong>Vehicle</strong>${escapeHTML(selectedVehicle)}</div>
  <div class="filter"><strong>Partner</strong>${escapeHTML(selectedPartner)}</div>
</div>
<div class="stats">
  <div class="stat"><strong>Transfers</strong><span>${stats.total}</span></div>
  <div class="stat"><strong>Completed</strong><span>${stats.completed}</span></div>
  <div class="stat"><strong>Cancelled</strong><span>${stats.cancelled}</span></div>
  <div class="stat"><strong>Passengers</strong><span>${stats.passengers}</span></div>
  <div class="stat"><strong>Revenue</strong><span>${escapeHTML(formatCurrency(stats.revenue))}</span></div>
  <div class="stat"><strong>Fuel Cost</strong><span>${escapeHTML(formatCurrency(stats.fuelCost))}</span></div>
  <div class="stat"><strong>Net After Fuel</strong><span>${escapeHTML(formatCurrency(stats.netRevenue))}</span></div>
  <div class="stat"><strong>Kilometres</strong><span>${stats.kilometres}</span></div>
</div>
<h2>Driver Performance</h2>
<table><thead><tr><th>Driver</th><th>Transfers</th><th>Completed</th><th>Revenue</th><th>KM</th><th>Avg. / Transfer</th></tr></thead><tbody>${driverRows || '<tr><td colspan="6">No data</td></tr>'}</tbody></table>
<h2>Vehicle Performance</h2>
<table><thead><tr><th>Vehicle</th><th>Transfers</th><th>KM</th><th>Fuel L</th><th>Fuel Cost</th><th>L/100 KM</th><th>Revenue</th></tr></thead><tbody>${vehicleRows || '<tr><td colspan="7">No data</td></tr>'}</tbody></table>
<h2>Partner Performance</h2>
<table><thead><tr><th>Partner</th><th>Transfers</th><th>Passengers</th><th>Revenue</th><th>Average Booking</th></tr></thead><tbody>${partnerRows || '<tr><td colspan="5">No data</td></tr>'}</tbody></table>
<div class="page-break"></div>
<h2>Monthly Analysis</h2>
<table><thead><tr><th>Month</th><th>Transfers</th><th>Completed</th><th>Cancelled</th><th>Passengers</th><th>Revenue</th><th>Fuel Cost</th><th>Net</th></tr></thead><tbody>${monthlyRows || '<tr><td colspan="8">No data</td></tr>'}</tbody></table>
<h2>Transfer Details</h2>
<table><thead><tr><th>Transfer</th><th>Date</th><th>Time</th><th>Guest</th><th>Pickup</th><th>Destination</th><th>Driver</th><th>Vehicle</th><th>Passengers</th><th>Price</th><th>Status</th><th>KM</th><th>Fuel L</th></tr></thead><tbody>${reportRows || '<tr><td colspan="13">No transfers</td></tr>'}</tbody></table>
<div class="footer">Nautilus Transfers · This report contains only transfers matching the selected filters.</div>
</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">

        <PageHeader
          title="Reports"
          subtitle={`${filteredTransfers.length} transfer(s) • ${fromDate} → ${toDate}`}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportExcel}
                disabled={filteredTransfers.length === 0}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export Excel
              </button>
              <button
                type="button"
                onClick={exportPDF}
                disabled={filteredTransfers.length === 0}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export PDF
              </button>
            </div>
          }
        />

        {/* FILTERS */}

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Report Filters
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All report sections use these filters.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reset filters
            </button>
          </div>

          <div className="mb-5">
            <DateRangeFilter
              from={fromDate}
              to={toDate}
              onFromChange={
                setFromDate
              }
              onToChange={
                setToDate
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Driver
              </label>

              <select
                value={driverFilter}
                onChange={(event) =>
                  setDriverFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                <option value="All">
                  All drivers
                </option>

                {driverOptions.map(
                  ([id, name]) => (
                    <option
                      key={id}
                      value={id}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Vehicle
              </label>

              <select
                value={vehicleFilter}
                onChange={(event) =>
                  setVehicleFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                <option value="All">
                  All vehicles
                </option>

                {vehicleOptions.map(
                  ([id, name]) => (
                    <option
                      key={id}
                      value={id}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Partner
              </label>

              <select
                value={partnerFilter}
                onChange={(event) =>
                  setPartnerFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                <option value="All">
                  All partners
                </option>

                <option value="Direct">
                  Direct
                </option>

                {partnerOptions.map(
                  ([id, name]) => (
                    <option
                      key={id}
                      value={id}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                {STATUS_OPTIONS.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Transfer Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
              >
                {TYPE_OPTIONS.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>
        </section>

        {loading ? (
          <section className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            Loading reports...
          </section>
        ) : (
          <>
            {/* OVERVIEW */}

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Operational and financial summary for the selected period.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                  label="Total Transfers"
                  value={formatNumber(
                    stats.total
                  )}
                  detail={`${stats.pending} pending`}
                />

                <StatCard
                  label="Completed"
                  value={formatNumber(
                    stats.completed
                  )}
                  detail={percentage(
                    stats.completed,
                    stats.total
                  )}
                />

                <StatCard
                  label="Cancelled"
                  value={formatNumber(
                    stats.cancelled
                  )}
                  detail={percentage(
                    stats.cancelled,
                    stats.total
                  )}
                />

                <StatCard
                  label="Passengers"
                  value={formatNumber(
                    stats.passengers
                  )}
                  detail={`${stats.adults} adults • ${stats.children} children`}
                />

                <StatCard
                  label="Revenue"
                  value={formatCurrency(
                    stats.revenue
                  )}
                  detail={`${formatCurrency(stats.averageTransfer)} average`}
                />

                <StatCard
                  label="Completed Revenue"
                  value={formatCurrency(
                    stats.completedRevenue
                  )}
                  detail={percentage(
                    stats.completedRevenue,
                    stats.revenue
                  )}
                />

                <StatCard
                  label="Kilometres"
                  value={formatNumber(
                    stats.kilometres
                  )}
                  detail="Recorded actual KM"
                />

                <StatCard
                  label="Net After Fuel"
                  value={formatCurrency(
                    stats.netRevenue
                  )}
                  detail={`${formatCurrency(stats.fuelCost)} fuel cost`}
                />

              </div>
            </section>

            {/* OPERATIONS */}

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Operations & Profitability
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <MetricCard
                  label="Fuel"
                  value={`${stats.fuelLiters.toFixed(1)} L`}
                />

                <MetricCard
                  label="Fuel Cost"
                  value={formatCurrency(
                    stats.fuelCost
                  )}
                />

                <MetricCard
                  label="Revenue / KM"
                  value={formatCurrency(
                    stats.revenuePerKm
                  )}
                />

                <MetricCard
                  label="Fuel Cost / KM"
                  value={formatCurrency(
                    stats.fuelCostPerKm
                  )}
                />

                <MetricCard
                  label="Fuel / 100 KM"
                  value={`${stats.fuelPer100Km.toFixed(2)} L`}
                />

              </div>
            </section>

            {/* COMMUNICATION */}

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Guest Communication
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <StatCard
                  label="WhatsApp Confirmations"
                  value={formatNumber(
                    stats.whatsappSent
                  )}
                  detail={percentage(
                    stats.whatsappSent,
                    stats.total
                  )}
                />

                <StatCard
                  label="Email Confirmations"
                  value={formatNumber(
                    stats.emailSent
                  )}
                  detail={percentage(
                    stats.emailSent,
                    stats.total
                  )}
                />

              </div>
            </section>

            {/* DRIVERS */}

            <ReportTableSection
              title="Driver Performance"
              subtitle="Transfers, completion, passengers, revenue and kilometres."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Driver
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right">
                      Cancelled
                    </th>
                    <th className="px-4 py-3 text-right">
                      Passengers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right">
                      Avg.
                    </th>
                    <th className="px-4 py-3 text-right">
                      KM
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {driverReport.map(
                    (row) => (
                      <tr
                        key={row.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.name}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.completed}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.cancelled}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.passengers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(
                            row.average
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatNumber(
                            row.kilometres
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {driverReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={8}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* VEHICLES */}

            <ReportTableSection
              title="Vehicle Performance"
              subtitle="Usage, fuel consumption and revenue by vehicle."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right">
                      KM
                    </th>
                    <th className="px-4 py-3 text-right">
                      Fuel
                    </th>
                    <th className="px-4 py-3 text-right">
                      Fuel Cost
                    </th>
                    <th className="px-4 py-3 text-right">
                      L/100 KM
                    </th>
                    <th className="px-4 py-3 text-right">
                      Net
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vehicleReport.map(
                    (row) => (
                      <tr
                        key={row.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.name}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatNumber(
                            row.kilometres
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.fuelLiters.toFixed(
                            1
                          )}{" "}
                          L
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(
                            row.fuelCost
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.fuelPer100Km.toFixed(
                            2
                          )}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.netRevenue
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {vehicleReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={8}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* PARTNERS */}

            <ReportTableSection
              title="Partner Performance"
              subtitle="Business generated by partner and direct bookings."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Partner
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right">
                      Cancelled
                    </th>
                    <th className="px-4 py-3 text-right">
                      Passengers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right">
                      Average
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {partnerReport.map(
                    (row) => (
                      <tr
                        key={row.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.name}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.completed}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.cancelled}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.passengers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(
                            row.average
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {partnerReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={7}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* TRANSFER TYPES */}

            <ReportTableSection
              title="Transfer Type Analysis"
              subtitle="Performance by transfer category."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right">
                      Passengers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right">
                      Average
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transferTypeReport.map(
                    (row) => (
                      <tr
                        key={row.type}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.type}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.completed}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.passengers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(
                            row.average
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {transferTypeReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={6}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* MONTHLY */}

            <ReportTableSection
              title="Monthly Analysis"
              subtitle="Monthly transfer volume, revenue and fuel performance."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Month
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right">
                      Cancelled
                    </th>
                    <th className="px-4 py-3 text-right">
                      Passengers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-right">
                      Fuel Cost
                    </th>
                    <th className="px-4 py-3 text-right">
                      Net
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyReport.map(
                    (row) => (
                      <tr
                        key={row.month}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.month}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.completed}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.cancelled}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.passengers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(
                            row.fuelCost
                          )}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.netRevenue
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {monthlyReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={8}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* DAILY */}

            <ReportTableSection
              title="Daily Analysis"
              subtitle="Daily activity for the selected date range."
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-right">
                      Passengers
                    </th>
                    <th className="px-4 py-3 text-right">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dailyReport.map(
                    (row) => (
                      <tr
                        key={row.date}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {formatDate(
                            row.date
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.transfers}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.completed}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {row.passengers}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(
                            row.revenue
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {dailyReport.length ===
                    0 && (
                    <EmptyTableRow
                      columns={5}
                    />
                  )}
                </tbody>
              </table>
            </ReportTableSection>

            {/* DETAIL */}

            <ReportTableSection
              title="Transfer Details"
              subtitle={`${filteredTransfers.length} transfer(s) included in this report.`}
            >
              <div className="overflow-x-auto">
                <table className="min-w-[1500px] text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3">
                        Transfer
                      </th>

                      <th className="px-4 py-3">
                        Date
                      </th>

                      <th className="px-4 py-3">
                        Time
                      </th>

                      <th className="px-4 py-3">
                        Guest
                      </th>

                      <th className="px-4 py-3">
                        Pickup
                      </th>

                      <th className="px-4 py-3">
                        Destination
                      </th>

                      <th className="px-4 py-3">
                        Driver
                      </th>

                      <th className="px-4 py-3">
                        Vehicle
                      </th>

                      <th className="px-4 py-3 text-right">
                        Passengers
                      </th>

                      <th className="px-4 py-3 text-right">
                        Price
                      </th>

                      <th className="px-4 py-3">
                        Status
                      </th>

                      <th className="px-4 py-3 text-right">
                        KM
                      </th>

                      <th className="px-4 py-3 text-right">
                        Fuel
                      </th>

                      <th className="px-4 py-3">
                        WhatsApp
                      </th>

                      <th className="px-4 py-3">
                        Email
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransfers
                      .slice()
                      .sort(
                        (a, b) => {
                          const first =
                            `${a.date} ${a.time}`;

                          const second =
                            `${b.date} ${b.time}`;

                          return first.localeCompare(
                            second
                          );
                        }
                      )
                      .map(
                        (transfer) => (
                          <tr
                            key={
                              transfer.id
                            }
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {
                                transfer.transferNumber
                              }
                            </td>

                            <td className="px-4 py-3">
                              {formatDate(
                                transfer.date
                              )}
                            </td>

                            <td className="px-4 py-3">
                              {transfer.time}
                            </td>

                            <td className="px-4 py-3">
                              {
                                transfer.clientName
                              }
                            </td>

                            <td className="max-w-[220px] truncate px-4 py-3">
                              {
                                transfer.pickup
                              }
                            </td>

                            <td className="max-w-[220px] truncate px-4 py-3">
                              {
                                transfer.destination
                              }
                            </td>

                            <td className="px-4 py-3">
                              {getDriverName(
                                transfer.driverId
                              )}
                            </td>

                            <td className="px-4 py-3">
                              {getVehicleName(
                                transfer.vehicleId
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {getPassengers(
                                transfer
                              )}
                            </td>

                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(
                                getTransferRevenue(
                                  transfer
                                )
                              )}
                            </td>

                            <td className="px-4 py-3">
                              <StatusBadge
                                status={
                                  transfer.status
                                }
                              />
                            </td>

                            <td className="px-4 py-3 text-right">
                              {transfer.actualKilometers ??
                                "-"}
                            </td>

                            <td className="px-4 py-3 text-right">
                              {transfer.fuelLiters !==
                              null
                                ? `${transfer.fuelLiters} L`
                                : "-"}
                            </td>

                            <td className="px-4 py-3">
                              {transfer.guestWhatsappSent
                                ? "Sent"
                                : "Not sent"}
                            </td>

                            <td className="px-4 py-3">
                              {transfer.guestEmailSent
                                ? "Sent"
                                : "Not sent"}
                            </td>
                          </tr>
                        )
                      )}

                    {filteredTransfers.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={15}
                          className="px-4 py-10 text-center text-sm text-gray-500"
                        >
                          No transfers match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ReportTableSection>

          </>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-gray-500">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>

      {detail && (
        <div className="mt-1 text-xs text-gray-500">
          {detail}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-gray-500">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}

function ReportTableSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

function EmptyTableRow({
  columns,
}: {
  columns: number;
}) {
  return (
    <tr>
      <td
        colSpan={columns}
        className="px-4 py-10 text-center text-sm text-gray-500"
      >
        No data available for the selected filters.
      </td>
    </tr>
  );
}

function StatusBadge({
  status,
}: {
  status: Transfer["status"];
}) {
  const classes: Record<
    Transfer["status"],
    string
  > = {
    New:
      "bg-gray-100 text-gray-700",
    Confirmed:
      "bg-blue-100 text-blue-700",
    Assigned:
      "bg-purple-100 text-purple-700",
    "In Progress":
      "bg-yellow-100 text-yellow-700",
    Completed:
      "bg-green-100 text-green-700",
    Cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  );
}