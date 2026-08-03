"use client";

import DateRangeFilter from "@/components/ui/DateRangeFilter";
import PartnerFilter from "@/components/ui/PartnerFilter";

import { Partner } from "@/types/partner";

interface Props {
  search: string;
  status: string;
  partner: string;

  fromDate: string;
  toDate: string;

  partners: Partner[];

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPartnerChange: (value: string) => void;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export default function TransferFilters({
  search,
  status,
  partner,
  fromDate,
  toDate,
  partners,
  onSearchChange,
  onStatusChange,
  onPartnerChange,
  onFromDateChange,
  onToDateChange,
}: Props) {
  return (
    <div className="space-y-5">

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-[1fr_220px_260px]">

          <div className="flex flex-col">

            <label className="mb-2 text-sm font-semibold text-slate-600">
              Search
            </label>

            <input
              type="text"
              value={search}
              placeholder="Client, phone, flight, pickup..."
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              className="rounded-xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

          <div className="flex flex-col">

            <label className="mb-2 text-sm font-semibold text-slate-600">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                onStatusChange(e.target.value)
              }
              className="rounded-xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                All Statuses
              </option>

              <option value="New">
                New
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <PartnerFilter
            partners={partners}
            value={partner}
            onChange={onPartnerChange}
          />

        </div>

      </div>

      <DateRangeFilter
        from={fromDate}
        to={toDate}
        onFromChange={onFromDateChange}
        onToChange={onToDateChange}
      />

    </div>
  );
}