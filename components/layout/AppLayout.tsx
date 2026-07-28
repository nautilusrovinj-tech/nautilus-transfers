"use client";

import AuthGuard from "@/components/auth/AuthGuard";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: Props) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100">

        <div className="flex min-h-screen">

          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">

            <Header />

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>

          </div>

        </div>

      </div>
    </AuthGuard>
  );
}