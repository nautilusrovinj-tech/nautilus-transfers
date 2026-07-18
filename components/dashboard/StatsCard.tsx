import Card from "@/components/ui/Card";

interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({
  title,
  value,
}: Props) {
  return (
    <Card className="h-full">
      <div className="space-y-2">

        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold text-slate-900">
          {value}
        </h2>

      </div>
    </Card>
  );
}