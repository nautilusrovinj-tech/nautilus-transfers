interface Props {
    transfers: number;
    arrivals: number;
    departures: number;
    revenue: number;
  }
  
  export default function CalendarStats({
    transfers,
    arrivals,
    departures,
    revenue,
  }: Props) {
    const cards = [
      {
        title: "Transfers",
        value: transfers,
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
      <div className="grid gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="text-sm text-slate-500">
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