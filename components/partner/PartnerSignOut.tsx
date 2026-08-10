"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function PartnerSignOut() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSignOut() {
    try {
      setLoading(true);

      const supabase =
        createClient();

      await supabase.auth.signOut();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Sign out error:",
        error
      );

      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
    >
      {loading
        ? "Signing out..."
        : "Sign Out"}
    </button>
  );
}