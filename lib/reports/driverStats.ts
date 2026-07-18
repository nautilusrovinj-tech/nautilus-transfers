import { Transfer } from "@/types/transfer";

export interface DriverStats {
  driverId: string;
  transfers: number;
  completed: number;
  revenue: number;
}

export function calculateDriverStats(
  transfers: Transfer[]
): DriverStats[] {
  const map = new Map<string, DriverStats>();

  transfers.forEach((transfer) => {
    if (!transfer.driverId) return;

    const current =
      map.get(transfer.driverId) ?? {
        driverId: transfer.driverId,
        transfers: 0,
        completed: 0,
        revenue: 0,
      };

    current.transfers += 1;

    if (transfer.status === "Completed") {
      current.completed += 1;
    }

    current.revenue += transfer.price;

    map.set(transfer.driverId, current);
  });

  return [...map.values()].sort(
    (a, b) => b.revenue - a.revenue
  );
}