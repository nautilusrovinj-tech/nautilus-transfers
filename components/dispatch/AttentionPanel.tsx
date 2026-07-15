import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function AttentionPanel({ transfers }: Props) {
  const noDriver = transfers.filter(
    (t) => !t.driver
  ).length;

  const noVehicle = transfers.filter(
    (t) => !t.vehicle
  ).length;

  const noPhone = transfers.filter(
    (t) => !t.phone
  ).length;

  const upcoming = transfers.filter((t) => {
    if (!t.date || !t.time) return false;

    const transferTime = new Date(`${t.date}T${t.time}`);
    const now = new Date();

    const diff =
      (transferTime.getTime() - now.getTime()) /
      1000 /
      60;

    return diff >= 0 && diff <= 30;
  }).length;

  const items = [
    {
      label: "Transfers without driver",
      value: noDriver,
      color: "text-red-600",
    },
    {
      label: "Transfers without vehicle",
      value: noVehicle,
      color: "text-orange-600",
    },
    {
      label: "Transfers starting within 30 min",
      value: upcoming,
      color: "text-blue-600",
    },
    {
      label: "Guests without phone",
      value: noPhone,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">
        ⚠️ Needs Attention
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between"
          >
            <span>{item.label}</span>

            <span
              className={`font-bold ${item.color}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}