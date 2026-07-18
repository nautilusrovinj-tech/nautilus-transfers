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
    <div className="grid grid-cols-2 gap-4">

      <input
        className="border rounded-lg p-2"
        placeholder="Partner Name"
        value={partner.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        placeholder="Phone"
        value={partner.phone}
        onChange={(e) =>
          update("phone", e.target.value)
        }
      />

      <input
        className="col-span-2 border rounded-lg p-2"
        placeholder="Email"
        value={partner.email}
        onChange={(e) =>
          update("email", e.target.value)
        }
      />

      <input
        className="border rounded-lg p-2"
        type="number"
        placeholder="Commission %"
        value={partner.commission}
        onChange={(e) =>
          update("commission", Number(e.target.value))
        }
      />

      <label className="flex items-center gap-2">

        <input
          type="checkbox"
          checked={partner.active}
          onChange={(e) =>
            update("active", e.target.checked)
          }
        />

        Active Partner

      </label>

    </div>
  );
}