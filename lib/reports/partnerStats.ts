import { Transfer } from "@/types/transfer";

export interface PartnerStats {
  partnerId: string;
  transfers: number;
  revenue: number;
}

export function calculatePartnerStats(
  transfers: Transfer[]
): PartnerStats[] {
  const map = new Map<string, PartnerStats>();

  transfers.forEach((transfer) => {
    if (!transfer.partnerId) return;

    const current =
      map.get(transfer.partnerId) ?? {
        partnerId: transfer.partnerId,
        transfers: 0,
        revenue: 0,
      };

    current.transfers += 1;
    current.revenue += transfer.price;

    map.set(
      transfer.partnerId,
      current
    );
  });

  return [...map.values()].sort(
    (a, b) => b.revenue - a.revenue
  );
}