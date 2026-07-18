import { Transfer } from "@/types/transfer";

export interface VehicleStats {
  vehicleId: string;
  transfers: number;
  revenue: number;
}

export function calculateVehicleStats(
  transfers: Transfer[]
): VehicleStats[] {
  const map = new Map<string, VehicleStats>();

  transfers.forEach((transfer) => {
    if (!transfer.vehicleId) return;
    if (transfer.status === "Cancelled") return;

    const current =
      map.get(transfer.vehicleId) ?? {
        vehicleId: transfer.vehicleId,
        transfers: 0,
        revenue: 0,
      };

    current.transfers += 1;
    current.revenue += transfer.price;

    map.set(
      transfer.vehicleId,
      current
    );
  });

  return [...map.values()].sort(
    (a, b) => b.transfers - a.transfers
  );
}