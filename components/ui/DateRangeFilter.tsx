"use client";

interface Props {
  from: string;
  to: string;

  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: Props) {
  function setToday() {
    const today = new Date();
    const value = formatDate(today);

    onFromChange(value);
    onToChange(value);
  }

  function setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const value = formatDate(tomorrow);

    onFromChange(value);
    onToChange(value);
  }

  function setNext7Days() {
    const start = new Date();
    const end = new Date();

    end.setDate(end.getDate() + 6);

    onFromChange(formatDate(start));
    onToChange(formatDate(end));
  }

  function setThisMonth() {
    const now = new Date();

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    onFromChange(formatDate(start));
    onToChange(formatDate(end));
  }

  function clear() {
    onFromChange("");
    onToChange("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-5">

        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Quick Range
        </p>

        <div className="flex flex-wrap gap-2">

          <button
            onClick={setToday}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Today
          </button>

          <button
            onClick={setTomorrow}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-200"
          >
            Tomorrow
          </button>

          <button
            onClick={setNext7Days}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-200"
          >
            Next 7 Days
          </button>

          <button
            onClick={setThisMonth}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-200"
          >
            This Month
          </button>

          <button
            onClick={clear}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Clear
          </button>

        </div>

      </div>

      <div className="border-t border-slate-200 pt-5">

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-600">
              From
            </label>

            <input
              type="date"
              value={from}
              onChange={(e) =>
                onFromChange(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-600">
              To
            </label>

            <input
              type="date"
              value={to}
              onChange={(e) =>
                onToChange(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

          </div>

        </div>

      </div>

    </div>
  );
}