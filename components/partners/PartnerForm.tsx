"use client";

import { Partner } from "@/types/partner";

interface Props {
  partner: Partner;
  setPartner: React.Dispatch<
    React.SetStateAction<Partner>
  >;
}

export default function PartnerForm({
  partner,
  setPartner,
}: Props) {
  function update<K extends keyof Partner>(
    field: K,
    value: Partner[K]
  ) {
    setPartner((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="grid grid-cols-2 gap-5">

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Partner Name
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Partner Name"
          value={partner.name}
          onChange={(e) =>
            update("name", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Contact Person
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Contact Person"
          value={partner.contactPerson}
          onChange={(e) =>
            update(
              "contactPerson",
              e.target.value
            )
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Phone
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Phone"
          value={partner.phone}
          onChange={(e) =>
            update("phone", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Email"
          value={partner.email}
          onChange={(e) =>
            update("email", e.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Commission (%)
        </label>

        <input
          type="number"
          min={0}
          step="0.1"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={partner.commission}
          onChange={(e) =>
            update(
              "commission",
              Number(e.target.value || 0)
            )
          }
        />
      </div>

      <div className="flex items-end pb-3">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">

          <input
            type="checkbox"
            className="h-4 w-4"
            checked={partner.active}
            onChange={(e) =>
              update(
                "active",
                e.target.checked
              )
            }
          />

          Active Partner

        </label>
      </div>

    </div>
  );
}