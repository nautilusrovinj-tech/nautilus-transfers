interface SearchBarProps {
  value: string;
  status: string;
  date: string;
  onChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export default function TransferSearchBar({
  value,
  status,
  date,
  onChange,
  onStatusChange,
  onDateChange,
}: SearchBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-[1fr_180px_220px]">

        <input
          type="text"
          placeholder="Search client, flight, phone, pickup, destination..."
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            onDateChange(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
        >
          <option value="">
            All Statuses
          </option>

          <option value="New">
            New
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Assigned">
            Assigned
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>

    </div>
  );
}