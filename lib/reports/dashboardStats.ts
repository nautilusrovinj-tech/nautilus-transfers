import { Transfer } from "@/types/transfer";

export interface DashboardStats {
  totalTransfers: number;
  completedTransfers: number;
  cancelledTransfers: number;
  pendingTransfers: number;
  totalRevenue: number;
}

export function calculateDashboardStats(
  transfers: Transfer[]
): DashboardStats {
  return {
    totalTransfers: transfers.length,

    completedTransfers: transfers.filter(
      (t) => t.status === "Completed"
    ).length,

    cancelledTransfers: transfers.filter(
      (t) => t.status === "Cancelled"
    ).length,

    pendingTransfers: transfers.filter(
      (t) =>
        t.status === "New" ||
        t.status === "Confirmed" ||
        t.status === "Assigned"
    ).length,

    totalRevenue: transfers.reduce(
      (sum, t) => sum + t.price,
      0
    ),
  };
}