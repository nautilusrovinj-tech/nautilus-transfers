"use client";

import { Button } from "@/components/ui/button";
import { exportTransfers } from "@/lib/export/exportTransfers";
import { useTransfers } from "@/hooks/useTransfers";

export default function ExportExcelButton() {
  const { transfers } = useTransfers();

  function handleExport() {
    exportTransfers(transfers, "Nautilus_Transfers");
  }

  return (
    <Button
      onClick={handleExport}
      className="bg-green-600 hover:bg-green-700"
    >
      📊 Export Excel
    </Button>
  );
}