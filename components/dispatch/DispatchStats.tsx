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
        icon: "🚗",
      },
      {
        title: "Arrivals",
        value: arrivals,
        icon: "🛬",
      },
      {
        title: "Departures",
        value: departures,
        icon: "🛫",
      },
      {
        title: "Revenue",
        value: `€${revenue.toFixed(2)}`,
        icon: "💶",
      },
    ];
  
    return (
      <div className="grid gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="text-3xl">
              {card.icon}
            </div>
  
            <div className="mt-3 text-sm text-slate-500">
              {card.title}
            </div>
  
            <div className="mt-2 text-3xl font-bold">
              {card.value}
            </div>
          </div>
        ))}
      </div>
    );
  }
