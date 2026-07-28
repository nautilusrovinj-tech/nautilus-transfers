"use client";

import Link from "next/link";
import { Transfer } from "@/types/transfer";

interface Props {
  year: number;
  month: number;
  transfers: Transfer[];
}

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export default function MonthlyCalendar({
  year,
  month,
  transfers,
}: Props) {
  const firstDay = new Date(year, month, 1);

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const startDay =
    (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  while (cells.length % 7) {
    cells.push(null);
  }

  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <div className="mb-4 grid grid-cols-7 gap-2">

        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-slate-500"
          >
            {day}
          </div>
        ))}

      </div>

      <div className="grid grid-cols-7 gap-2">

        {cells.map((day, index) => {

          if (day === null) {
            return (
              <div
                key={index}
                className="aspect-square rounded-xl bg-slate-50"
              />
            );
          }

          const date = `${year}-${String(
            month + 1
          ).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const dayTransfers = transfers
            .filter((t) => t.date === date)
            .sort((a, b) =>
              a.time.localeCompare(b.time)
            );

          const todayCell =
            date === todayString;

          return (
            <Link
              key={date}
              href={`/dispatch?date=${date}`}
              className={`flex aspect-square flex-col overflow-hidden rounded-xl border p-2 transition hover:border-slate-400 hover:shadow ${
                todayCell
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >

              <div className="mb-2 flex items-center justify-between">

                <div className="text-lg font-bold">
                  {day}
                </div>

                {dayTransfers.length > 0 && (
                  <div className="rounded bg-slate-900 px-2 py-0.5 text-xs text-white">
                    {dayTransfers.length}
                  </div>
                )}

              </div>

              <div className="flex-1 overflow-hidden space-y-1">

                {dayTransfers
                  .slice(0, 4)
                  .map((transfer) => (
                    <div
                      key={transfer.id}
                      className="rounded bg-slate-100 px-2 py-1 text-xs"
                    >
                      <div className="font-semibold">
                        {transfer.time}
                      </div>

                      <div className="truncate">
                        {transfer.clientName}
                      </div>
                    </div>
                  ))}

                {dayTransfers.length > 4 && (
                  <div className="text-xs text-slate-500">
                    +{dayTransfers.length - 4} more...
                  </div>
                )}

              </div>

            </Link>
          );
        })}

      </div>

    </div>
  );
}