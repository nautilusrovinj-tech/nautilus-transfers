import { Partner } from "@/types/partner";

export function mapPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    commission: Number(row.commission),
    active: row.active,
  };
}