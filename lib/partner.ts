import { Partner } from "@/types/partner";

export function createEmptyPartner(): Partner {
  return {
    id: crypto.randomUUID(),

    name: "",

    contactPerson: "",

    phone: "",

    email: "",

    commission: 0,

    notes: "",

    active: true,
  };
}