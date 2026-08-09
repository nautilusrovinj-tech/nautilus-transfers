import { Partner } from "@/types/partner";

export function mapPartner(
  row: any
): Partner {
  return {
    id: row.id,

    name: row.name,

    contactPerson:
      row.contact_person ??
      row.contactPerson ??
      "",

    phone:
      row.phone ?? "",

    email:
      row.email ?? "",

    commission:
      Number(row.commission ?? 0),

    notes:
      row.notes ?? "",

    active:
      row.active ?? true,

    userId:
      row.user_id ?? null,
  };
}