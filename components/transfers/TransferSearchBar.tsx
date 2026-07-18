interface SearchBarProps {
  value: string;
  status: string;
  date: string;
  onChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export default function SearchBar({
  value,
  status,
  date,
  onChange,
  onStatusChange,
  onDateChange,
}: SearchBarProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-4 py-2.5"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-4 py-2.5"
      >
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Assigned">Assigned</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
}