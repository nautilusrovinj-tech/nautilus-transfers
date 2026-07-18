import { createClient } from "@/lib/supabase/client";
import { Partner } from "@/types/partner";

const supabase = createClient();

export async function getPartners() {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("name");

  if (error) throw error;

  return data ?? [];
}

export async function createPartner(partner: Partner) {
  const { error } = await supabase
    .from("partners")
    .insert(partner);

  if (error) throw error;
}

export async function updatePartner(
  id: string,
  partner: Partner
) {
  const { error } = await supabase
    .from("partners")
    .update(partner)
    .eq("id", id);

  if (error) throw error;
}

export async function deletePartner(id: string) {
  const { error } = await supabase
    .from("partners")
    .delete()
    .eq("id", id);

  if (error) throw error;
}