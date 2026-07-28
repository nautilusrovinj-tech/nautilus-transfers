"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DriverLayout from "@/components/layout/DriverLayout";

import { createClient } from "@/lib/supabase/client";
import { getDriverByEmail } from "@/services/drivers";

export default function DriverProfilePage() {
  const router = useRouter();

  const [driver, setDriver] = useState<any>(null);
  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) return;

      const data = await getDriverByEmail(
        user.email
      );

      setDriver(data);
    }

    void load();
  }, []);

  async function logout() {
    try {
      setLoggingOut(true);

      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <DriverLayout>
      <div className="space-y-6">

        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-center text-white">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl">
            👤
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            {driver?.name}
          </h1>

          <p className="mt-2 text-slate-300">
            Driver
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold">
            Contact
          </h2>

          <div className="space-y-5">

            <div>
              <div className="text-sm text-slate-500">
                Phone
              </div>

              <div className="mt-1 font-semibold">
                {driver?.phone || "-"}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-500">
                Email
              </div>

              <div className="mt-1 font-semibold break-all">
                {driver?.email || "-"}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-500">
                Languages
              </div>

              <div className="mt-1 font-semibold">
                {driver?.languages || "-"}
              </div>
            </div>

          </div>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold">
            App
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-slate-500">
                Version
              </span>

              <span className="font-semibold">
                1.0.0
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Company
              </span>

              <span className="font-semibold">
                Nautilus Transfers
              </span>
            </div>

          </div>

        </div>

        <button
          onClick={logout}
          disabled={loggingOut}
          className="w-full rounded-2xl bg-red-600 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {loggingOut
            ? "Signing Out..."
            : "🚪 Sign Out"}
        </button>

      </div>
    </DriverLayout>
  );
}