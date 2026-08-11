import { createClient } from "@/lib/supabase/client";
import { VehicleService } from "@/types/vehicle-service";

const supabase = createClient();

function mapService(row: any): VehicleService {
  return {
    id: row.id,

    vehicleId:
      row.vehicle_id,

    serviceDate:
      row.date,

    serviceType:
      row.service_type ?? "",

    description:
      row.description ?? "",

    kilometers:
      row.kilometers !== null &&
      row.kilometers !== undefined
        ? Number(row.kilometers)
        : null,

    cost:
      Number(row.cost ?? 0),

    serviceProvider:
      row.provider ?? "",

    nextServiceDate:
      row.next_service_date ?? null,

    nextServiceKilometers:
      row.next_service_kilometers !==
        null &&
      row.next_service_kilometers !==
        undefined
        ? Number(
            row.next_service_kilometers
          )
        : null,

    notes:
      row.note ?? "",

    createdAt:
      row.created_at,
  };
}

export async function getVehicleServices(
  vehicleId: string
): Promise<VehicleService[]> {
  const { data, error } =
    await supabase
      .from("vehicle_services")
      .select("*")
      .eq(
        "vehicle_id",
        vehicleId
      )
      .order("date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "GET VEHICLE SERVICES ERROR MESSAGE:",
      error.message
    );

    console.error(
      "GET VEHICLE SERVICES ERROR DETAILS:",
      {
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw new Error(
      error.message ||
        "Failed to load vehicle services."
    );
  }

  return (data ?? []).map(
    mapService
  );
}

export async function createVehicleService(
  service: Partial<VehicleService>
) {
  const payload = {
    vehicle_id:
      service.vehicleId,

    date:
      service.serviceDate,

    kilometers:
      service.kilometers ?? null,

    service_type:
      service.serviceType,

    description:
      service.description || null,

    cost:
      service.cost ?? 0,

    provider:
      service.serviceProvider || null,

    note:
      service.notes || null,

    next_service_date:
      service.nextServiceDate || null,

    next_service_kilometers:
      service.nextServiceKilometers ??
      null,
  };

  const { data, error } =
    await supabase
      .from("vehicle_services")
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.error(
      "CREATE VEHICLE SERVICE ERROR MESSAGE:",
      error.message
    );

    console.error(
      "CREATE VEHICLE SERVICE ERROR DETAILS:",
      {
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw new Error(
      error.message ||
        "Failed to create vehicle service."
    );
  }

  return mapService(data);
}

export async function updateVehicleService(
  id: string,
  service: Partial<VehicleService>
) {
  const payload = {
    date:
      service.serviceDate,

    kilometers:
      service.kilometers ?? null,

    service_type:
      service.serviceType,

    description:
      service.description || null,

    cost:
      service.cost ?? 0,

    provider:
      service.serviceProvider || null,

    note:
      service.notes || null,

    next_service_date:
      service.nextServiceDate || null,

    next_service_kilometers:
      service.nextServiceKilometers ??
      null,
  };

  const { data, error } =
    await supabase
      .from("vehicle_services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    console.error(
      "UPDATE VEHICLE SERVICE ERROR MESSAGE:",
      error.message
    );

    console.error(
      "UPDATE VEHICLE SERVICE ERROR DETAILS:",
      {
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw new Error(
      error.message ||
        "Failed to update vehicle service."
    );
  }

  return mapService(data);
}

export async function deleteVehicleService(
  id: string
) {
  const { error } =
    await supabase
      .from("vehicle_services")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "DELETE VEHICLE SERVICE ERROR MESSAGE:",
      error.message
    );

    console.error(
      "DELETE VEHICLE SERVICE ERROR DETAILS:",
      {
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw new Error(
      error.message ||
        "Failed to delete vehicle service."
    );
  }
}