export interface Partner {
  id: string;

  name: string;

  contactPerson: string;

  phone: string;

  email: string;

  commission: number;

  notes: string;

  active: boolean;

  // Supabase Auth user connected to this partner
  userId: string | null;
}