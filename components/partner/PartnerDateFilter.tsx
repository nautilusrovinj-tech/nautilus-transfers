"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  fromDate?: string;
  toDate?: string;
}

export default function PartnerDateFilter({
  fromDate = "",
  toDate = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(fromDate);
  const [to, setTo] = useState(toDate);

  function applyFilter() {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (from) {
      params.set("from", from);
    } else {
      params.delete("from");
    }

    if (to) {
      params.set("to", to);
    } else {
      params.delete("to");
    }

    const query = params.toString();

    router.push(
      query
        ? `/partner?${query}`
        : "/partner"
    );
  }

  function clearFilter() {
    setFrom("");
    setTo("");

    router.push("/partner");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        <div className="flex-1">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Date From
          </label>

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

        <div className="flex-1">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Date To
          </label>

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={applyFilter}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Filter
          </button>

          <button
            type="button"
            onClick={clearFilter}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>

        </div>

      </div>

    </div>
  );
}