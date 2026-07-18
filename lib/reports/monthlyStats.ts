import { Transfer } from "@/types/transfer";

export interface MonthlyStat {
  month: string;
  transfers: number;
  revenue: number;
}

export function calculateMonthlyStats(
  transfers: Transfer[]
): MonthlyStat[] {
  const map = new Map<string, MonthlyStat>();

  transfers.forEach((transfer) => {
    const month = transfer.date.slice(0, 7);

    const current =
      map.get(month) ?? {
        month,
        transfers: 0,
        revenue: 0,
      };

    current.transfers += 1;
    current.revenue += transfer.price;

    map.set(month, current);
  });

  return [...map.values()].sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}