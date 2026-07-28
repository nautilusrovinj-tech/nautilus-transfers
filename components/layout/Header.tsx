"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dispatch": "Dispatch",
    "/calendar": "Calendar",
    "/calendar/month": "Operations Planner",
    "/transfers": "Transfers",
    "/drivers": "Drivers",
    "/vehicles": "Vehicles",
    "/partners": "Partners",
    "/reports": "Reports",
  };

  const pageTitle =
    Object.entries(titles).find(([route]) =>
      pathname.startsWith(route)
    )?.[1] ?? "Nautilus";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

      <div>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Nautilus Transfers
        </p>

        <h1 className="text-2xl font-bold text-slate-900">
          {pageTitle}
        </h1>

      </div>

      <div className="flex items-center gap-4">

        <div className="hidden text-right md:block">

          <p className="text-sm font-semibold text-slate-800">
            Dispatcher
          </p>

          <p className="text-xs text-slate-500">
            Welcome back
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          N
        </div>

      </div>

    </header>
  );
}