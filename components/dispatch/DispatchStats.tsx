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
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      <Card>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">
            Today's Transfers
          </p>

          <h2 className="text-5xl font-bold text-slate-900">
            {total}
          </h2>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">
            Arrivals
          </p>

          <h2 className="text-5xl font-bold text-blue-600">
            {arrivals}
          </h2>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">
            Departures
          </p>

          <h2 className="text-5xl font-bold text-indigo-600">
            {departures}
          </h2>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">
            Revenue
          </p>

          <h2 className="text-5xl font-bold text-green-600">
            €{revenue.toFixed(2)}
          </h2>
        </div>
      </Card>

    </div>
  );
}