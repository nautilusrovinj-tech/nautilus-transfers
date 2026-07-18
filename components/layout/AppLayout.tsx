"use client";

import AuthGuard from "@/components/auth/AuthGuard";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-100">

        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <Header />

          <main className="flex-1 overflow-auto p-8">
            {children}
          </main>

        </div>

      </div>
    </AuthGuard>
  );
}