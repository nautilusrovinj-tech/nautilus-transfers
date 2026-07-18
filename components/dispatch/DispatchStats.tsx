import Card from "@/components/ui/Card";

interface Props {
  total: number;
  arrivals: number;
  departures: number;
  revenue: number;
}

export default function DispatchStats({
  total,
  arrivals,
  departures,
  revenue,
}: Props) {
  const cards = [
    {
      title: "Today's Transfers",
      value: total,
    },
    {
      title: "Arrivals",
      value: arrivals,
    },
    {
      title: "Departures",
      value: departures,
    },
    {
      title: "Revenue",
      value: `€${revenue.toFixed(2)}`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (
        <Card
          key={card.title}
          className="h-full"
        >
          <div className="space-y-2">

            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {card.title}
            </p>

            <h2 className="text-4xl font-bold text-slate-900">
              {card.value}
            </h2>

          </div>
        </Card>
      ))}

    </div>
  );
}