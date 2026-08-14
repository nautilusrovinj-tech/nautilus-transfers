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
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Nautilus
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Transfer Management
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menu.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-6">
        <div className="text-sm font-semibold text-slate-800">
          Nautilus
        </div>

        <div className="text-xs text-slate-500">
          Version 1.0
        </div>
      </div>
    </aside>
  );
}