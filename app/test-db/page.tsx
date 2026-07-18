"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function TestDbPage() {
  const [result, setResult] = useState("Connecting...");

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("transfers")
        .select("*");

      if (error) {
        setResult(error.message);
      } else {
        setResult(
          `✅ Connected! ${data.length} transfer(s) found.`
        );
      }
    }

    test();
  }, []);

  return (
    <AppLayout>
      <div className="rounded-xl border bg-white p-8 shadow">
        <h1 className="mb-4 text-2xl font-bold">
          Supabase Test
        </h1>

        <p>{result}</p>
      </div>
    </AppLayout>
  );
}