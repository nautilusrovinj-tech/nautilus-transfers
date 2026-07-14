"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/" },
    { name: "Transfers", href: "/transfers" },
    { name: "Drivers", href: "/drivers" },
    { name: "Vehicles", href: "/vehicles" },
    { name: "Partners", href: "/partners" },
    { name: "Reports", href: "/reports" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-8 py-8">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Nautilus
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Operations
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-4 py-3 transition ${
              pathname === item.href
                ? "bg-blue-600 font-medium text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-6">
        <div className="text-sm text-slate-500">
          Nautilus Operations
        </div>

        <div className="mt-1 text-xs text-slate-600">
          Version 1.0
        </div>
      </div>
    </aside>
  );
}