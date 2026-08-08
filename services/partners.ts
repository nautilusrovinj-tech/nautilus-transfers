import { createClient } from "@/lib/supabase/client";
import { Partner } from "@/types/partner";

const supabase = createClient();

function mapPartnerFromDb(data: any): Partner {
  return {
    id: data.id,
    name: data.name,
    contactPerson: data.contact_person,
    phone: data.phone,
    email: data.email,
    commission: data.commission,
    active: data.active,
  };
}

function mapPartnerToDb(partner: Partner) {
  return {
    id: partner.id,
    name: partner.name,
    contact_person: partner.contactPerson,
    phone: partner.phone,
    email: partner.email,
    commission: partner.commission,
    active: partner.active,
  };
}

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []).map(mapPartnerFromDb);
}

export async function createPartner(partner: Partner) {
  const { error } = await supabase
    .from("partners")
    .insert(mapPartnerToDb(partner));

  if (error) throw error;
}

export async function updatePartner(
  id: string,
  partner: Partner
) {
  const { error } = await supabase
    .from("partners")
    .update(mapPartnerToDb(partner))
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