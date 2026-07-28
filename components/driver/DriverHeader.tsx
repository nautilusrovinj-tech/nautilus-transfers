"use client";

interface Props {
  name: string;
  count: number;
}

export default function DriverHeader({
  name,
  count,
}: Props) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white">
      <p className="text-slate-300">
        {greeting}
      </p>

      <h1 className="mt-1 text-3xl font-bold">
        {name}
      </h1>

      <p className="mt-4 text-lg">
        {count} transfer{count !== 1 ? "s" : ""} today
      </p>
    </div>
  );
}