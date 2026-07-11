interface StatsCardProps {
    title: string;
    value: string;
  }
  
  export default function StatsCard({
    title,
    value,
  }: StatsCardProps) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          {title}
        </p>
  
        <h2 className="mt-3 text-3xl font-bold">
          {value}
        </h2>
      </div>
    );
  }