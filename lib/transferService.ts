import { supabase } from "@/lib/supabase";
import { mapTransfer } from "@/lib/transferMapper";
import { Transfer } from "@/types/transfer";

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .order("date")
    .order("time");

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}

export async function getTodaysTransfers(): Promise<Transfer[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transfers")
    .select("*")
    .eq("date", today)
    .order("time");

  if (error) throw error;

  return (data ?? []).map(mapTransfer);
}

export async function deleteTransfer(id: string) {
  const { error } = await supabase
    .from("transfers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}