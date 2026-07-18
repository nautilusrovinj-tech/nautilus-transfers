import PageCard from "@/components/ui/PageCard";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function AttentionPanel({
  transfers,
}: Props) {
  const noDriver = transfers.filter(
    (t) => !t.driverId
  ).length;

  const noVehicle = transfers.filter(
    (t) => !t.vehicleId
  ).length;

  const noPhone = transfers.filter(
    (t) => !t.phone
  ).length;

  const upcoming = transfers.filter((t) => {
    if (!t.date || !t.time) return false;

    const transferTime = new Date(
      `${t.date}T${t.time}`
    );

    const now = new Date();

    const diff =
      (transferTime.getTime() -
        now.getTime()) /
      1000 /
      60;

    return diff >= 0 && diff <= 30;
  }).length;

  const items = [
    {
      label: "Without driver",
      value: noDriver,
      color: "text-red-600",
    },
    {
      label: "Without vehicle",
      value: noVehicle,
      color: "text-orange-600",
    },
    {
      label: "Starting within 30 min",
      value: upcoming,
      color: "text-blue-600",
    },
    {
      label: "Missing guest phone",
      value: noPhone,
      color: "text-yellow-600",
    },
  ];

  return (
    <PageCard className="p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Needs Attention
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-slate-600">
              {item.label}
            </span>

            <span
              className={`text-lg font-semibold ${item.color}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </PageCard>
  );
}