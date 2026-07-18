const hours = Array.from(
    { length: 24 },
    (_, i) =>
      `${String(i).padStart(2, "0")}:00`
  );
  
  export default function HourTimeline() {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
  
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold">
            Daily Timeline
          </h2>
        </div>
  
        <div>
  
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex h-16 border-b border-slate-100 last:border-b-0"
            >
  
              <div className="flex w-24 items-start justify-end border-r border-slate-200 pr-4 pt-2 text-sm font-medium text-slate-500">
                {hour}
              </div>
  
              <div className="flex-1" />
  
            </div>
          ))}
  
        </div>
  
      </div>
    );
  }