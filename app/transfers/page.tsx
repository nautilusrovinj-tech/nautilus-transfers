import AppLayout from "@/components/layout/AppLayout";
import TransferDialog from "@/components/transfers/TransferDialog";
import TransferTable from "@/components/transfers/TransferTable";
import { Transfer } from "@/types/transfer";

export default function TransfersPage() {
  const transfers: Transfer[] = [
    {
      id: "TR-2026-0001",

      clientName: "John Smith",
      phone: "+44 7700 900123",

      date: "2026-07-11",
      time: "14:30",

      pickup: "Pula Airport",
      dropoff: "Grand Park Hotel",

      flightNumber: "FR4587",

      adults: 2,
      children: 0,
      babySeats: 0,
      boosterSeats: 0,

      price: 120,

      driver: "Ivan",
      vehicle: "Mercedes V-Class",
      partner: "Direct",

      paymentStatus: "Pending",

      status: "Confirmed",

      notes: "",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transfers</h1>

            <p className="text-slate-500">
              Manage all airport transfers.
            </p>
          </div>

          <TransferDialog />
        </div>

        <TransferTable transfers={transfers} />
      </div>
    </AppLayout>
  );
}