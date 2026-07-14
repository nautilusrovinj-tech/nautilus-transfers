interface Props {
  title: string;
  value: string | number;
}

export default function StatsCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-4xl font-bold">
        {value}
      </div>
    </div>
  );
}