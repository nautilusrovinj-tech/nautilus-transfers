import { supabase } from "@/lib/supabase";
import { mapPartner } from "@/lib/mappers/partnerMapper";
import { Partner } from "@/types/partner";

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapPartner);
}