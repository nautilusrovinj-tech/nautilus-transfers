"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Dispatch",
      href: "/dispatch",
    },
    {
      name: "Calendar",
      href: "/calendar",
    },
    {
      name: "Transfers",
      href: "/transfers",
    },
    {
      name: "Drivers",
      href: "/drivers",
    },
    {
      name: "Vehicles",
      href: "/vehicles",
    },
    {
      name: "Partners",
      href: "/partners",
    },
    {
      name: "Reports",
      href: "/reports",
    },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">

      <div className="border-b border-slate-200 px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Nautilus
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Operations
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">

        <div className="space-y-1">

          {menu.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(
                item.href + "/"
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

        </div>

      </nav>

      <div className="border-t border-slate-200 px-6 py-5">
        <p className="text-sm font-semibold text-slate-700">
          Nautilus Operations
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Version 1.0
        </p>
      </div>

    </aside>
  );
}