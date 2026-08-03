"use client";

import { Partner } from "@/types/partner";

interface Props {
  partners: Partner[];
  value: string;
  onChange: (value: string) => void;
}

export default function PartnerFilter({
  partners,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-semibold text-slate-600">
        Partner
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="">
          All Partners
        </option>

        <option value="DIRECT">
          Direct
        </option>

        {partners.map((partner) => (
          <option
            key={partner.id}
            value={partner.id}
          >
            {partner.name}
          </option>
        ))}
      </select>
    </div>
  );
}