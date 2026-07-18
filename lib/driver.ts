import { Driver } from "@/types/driver";

export function createEmptyDriver(): Driver {
  return {
    id: crypto.randomUUID(),
    name: "",
    phone: "",
    email: "",
    languages: "",
    active: true,
  };
}