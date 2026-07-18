import { Partner } from "@/types/partner";

export function mapPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    commission: row.commission ?? 0,
    notes: row.notes ?? "",
    active: row.active ?? true,
  };
}