import { Driver } from "@/types/driver";

export function mapDriver(row: any): Driver {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    languages: row.languages ?? "",
    active: row.active,
  };
}