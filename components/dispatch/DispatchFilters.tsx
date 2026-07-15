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
  "Completed",
  "Cancelled",
];

export default function DispatchFilters({
  filter,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            filter === item
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}