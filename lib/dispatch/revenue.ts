import { Transfer } from "@/types/transfer";

export interface RevenueSummary {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export function calculateRevenue(
  transfers: Transfer[]
): RevenueSummary {
  let total = 0;
  let completed = 0;
  let pending = 0;
  let cancelled = 0;

  transfers.forEach((transfer) => {
    total += transfer.price;

    switch (transfer.status) {
      case "Completed":
        completed += transfer.price;
        break;

      case "Cancelled":
        cancelled += transfer.price;
        break;

      default:
        pending += transfer.price;
        break;
    }
  });

  return {
    total,
    completed,
    pending,
    cancelled,
  };
}