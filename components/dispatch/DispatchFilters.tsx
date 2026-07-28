"use client";

interface Props {
  filter: string;
  onChange: (value: string) => void;
}

const filters = [
  "All",
  "New",
  "Confirmed",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function DispatchFilters({
  filter,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              filter === item
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}