interface Props {
    view: "cards" | "timeline";
    onChange: (
      view: "cards" | "timeline"
    ) => void;
  }
  
  export default function CalendarViewToggle({
    view,
    onChange,
  }: Props) {
    return (
      <div className="flex gap-2">
  
        <button
          onClick={() =>
            onChange("cards")
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            view === "cards"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-300"
          }`}
        >
          Cards
        </button>
  
        <button
          onClick={() =>
            onChange("timeline")
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            view === "timeline"
              ? "bg-slate-900 text-white"
              : "bg-white border border-slate-300"
          }`}
        >
          Timeline
        </button>
  
      </div>
    );
  }