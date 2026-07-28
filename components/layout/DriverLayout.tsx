"use client";

import DriverBottomNav from "@/components/driver/DriverBottomNav";

interface Props {
  children: React.ReactNode;
}

export default function DriverLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <main className="mx-auto min-h-screen w-full max-w-md px-4 pt-safe pt-5 pb-28">
        {children}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50">
        <DriverBottomNav />
      </div>
    </div>
  );
}