interface Props {
    status: string;
    onStatusChange: (status: string) => void;
  }
  
  export default function CalendarFilters({
    status,
    onStatusChange,
  }: Props) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
  
        <div className="flex items-center gap-4">
  
          <label className="text-sm font-medium">
            Status
          </label>
  
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="All">
              All
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