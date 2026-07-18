interface Props {
    date: string;
    onDateChange: (date: string) => void;
  }
  
  export default function CalendarToolbar({
    date,
    onDateChange,
  }: Props) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
  
        <div>
          <h2 className="text-lg font-semibold">
            Daily Schedule
          </h2>
  
          <p className="text-sm text-slate-500">
            Select a dispatch date
          </p>
        </div>
  
        <input
          type="date"
          value={date}
          onChange={(e) =>
            onDateChange(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
  
      </div>
    );
  }