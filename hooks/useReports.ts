import { useMemo } from "react";
import { useTransfers } from "@/hooks/useTransfers";

export function useReports() {
  const { transfers, loading } = useTransfers();

  const report = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const month = today.slice(0, 7);

    const todayTransfers = transfers.filter(
      (t) => t.date === today
    );

    const monthTransfers = transfers.filter((t) =>
      t.date.startsWith(month)
    );

    const todayRevenue = todayTransfers.reduce(
      (sum, t) => sum + t.price,
      0
    );

    const monthRevenue = monthTransfers.reduce(
      (sum, t) => sum + t.price,
      0
    );

    const averageTransfer =
      transfers.length === 0
        ? 0
        : transfers.reduce(
            (sum, t) => sum + t.price,
            0
          ) / transfers.length;

    return {
      todayTransfers: todayTransfers.length,
      todayRevenue,
      monthRevenue,
      averageTransfer,
    };
  }, [transfers]);

  return {
    loading,
    report,
  };
}