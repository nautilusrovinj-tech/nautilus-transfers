"use client";

export default function CalendarStatusLegend() {
  const items = [
    {
      label: "New",
      color: "bg-slate-400",
    },
    {
      label: "Confirmed",
      color: "bg-blue-500",
    },
    {
      label: "Assigned",
      color: "bg-amber-500",
    },
    {
      label: "Completed",
      color: "bg-green-500",
    },
    {
      label: "Cancelled",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            <span
              className={`h-3 w-3 rounded-full ${item.color}`}
            />

            <span className="text-sm text-slate-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}