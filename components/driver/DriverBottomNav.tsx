"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DriverBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/driver",
      icon: "🏠",
      label: "Today",
    },
    {
      href: "/driver/history",
      icon: "📋",
      label: "History",
    },
    {
      href: "/driver/profile",
      icon: "👤",
      label: "Profile",
    },
  ];

  return (
    <nav className="border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-md">

        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center py-3"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-500"
                }`}
              >
                <span className="text-2xl">
                  {item.icon}
                </span>
              </div>

              <span
                className={`mt-2 text-xs font-semibold ${
                  active
                    ? "text-blue-600"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}