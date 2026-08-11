import { createClient } from "@/lib/supabase/client";
import { Driver } from "@/types/driver";

const supabase = createClient();

function mapDriver(row: any): Driver {
  return {
    id: row.id,
    name: row.name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    languages: row.languages ?? "",
    role: row.role ?? "driver",
    active: row.active ?? true,

    baseLocation:
      row.base_location ?? "",

    maxPassengers:
      row.max_passengers ?? 0,

    vehicleId:
      row.vehicle_id ?? "",

    priority:
      row.priority ?? 0,
  };
}

function mapDriverToDatabase(
  driver: Driver
) {
  return {
    name: driver.name,
    phone: driver.phone,
    email: driver.email,
    languages: driver.languages,
    role: driver.role,
    active: driver.active,

    base_location:
      driver.baseLocation,

    max_passengers:
      driver.maxPassengers,

    vehicle_id:
      driver.vehicleId || null,

    priority:
      driver.priority,
  };
}

export async function getDrivers(): Promise<
  Driver[]
> {
  const { data, error } =
    await supabase
      .from("drivers")
      .select("*")
      .order("name");

  if (error) throw error;

  return (data ?? []).map(
    mapDriver
  );
}

export async function getDriverByEmail(
  email: string
) {
  const { data, error } =
    await supabase
      .from("drivers")
      .select("*")
      .eq("email", email)
      .single();

  if (error) throw error;

  return mapDriver(data);
}

export async function getDriverById(
  id: string
) {
  const { data, error } =
    await supabase
      .from("drivers")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return mapDriver(data);
}

export async function getDriverPhone(
  id: string
): Promise<string | null> {
  const { data, error } =
    await supabase
      .from("drivers")
      .select("phone")
      .eq("id", id)
      .single();

  if (error || !data) {
    return null;
  }

  return (
    data.phone
      ?.replace(/\D/g, "") ?? null
  );
}

export async function createDriver(
  driver: Driver
) {
  const payload =
    mapDriverToDatabase(driver);

  console.log(
    "CREATE DRIVER PAYLOAD:",
    payload
  );

  const { error } =
    await supabase
      .from("drivers")
      .insert(payload);

  if (error) {
    console.error(
      "CREATE DRIVER ERROR:",
      error
    );

    throw error;
  }
}

export async function updateDriver(
  id: string,
  driver: Driver
) {
  const payload =
    mapDriverToDatabase(driver);

  console.log(
    "UPDATE DRIVER PAYLOAD:",
    payload
  );

  const { error } =
    await supabase
      .from("drivers")
      .update(payload)
      .eq("id", id);

  if (error) {
    console.error(
      "UPDATE DRIVER ERROR:",
      error
    );

    throw error;
  }
}

export async function deleteDriver(
  id: string
) {
  const { error } =
    await supabase
      .from("drivers")
      .delete()
      .eq("id", id);

  if (error) throw error;
}