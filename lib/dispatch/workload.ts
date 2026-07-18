import { Transfer } from "@/types/transfer";

export interface DriverWorkload {
  driverId: string;
  transfers: number;
  revenue: number;
}

export function calculateDriverWorkload(
  transfers: Transfer[]
): DriverWorkload[] {
  const map = new Map<string, DriverWorkload>();

  transfers.forEach((transfer) => {
    if (!transfer.driverId) return;
    if (transfer.status === "Cancelled") return;

    const current =
      map.get(transfer.driverId) ?? {
        driverId: transfer.driverId,
        transfers: 0,
        revenue: 0,
      };

    current.transfers += 1;
    current.revenue += transfer.price;

    map.set(transfer.driverId, current);
  });

  return [...map.values()].sort(
    (a, b) => b.transfers - a.transfers
  );
}