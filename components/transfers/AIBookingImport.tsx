"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { extractBooking } from "@/lib/ai/extractBooking";

interface Props {
  onImport: (booking: any) => void;
}

export default function AIBookingImport({
  onImport,
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const booking = await extractBooking(text);

      onImport(booking);
    } catch (error) {
      console.error(error);
      alert("AI could not extract the booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
          🤖
        </div>

        <div>
          <h2 className="text-lg font-bold">
            AI Booking Import
          </h2>

          <p className="text-sm text-slate-600">
            Paste an email or WhatsApp booking and let AI populate the transfer.
          </p>
        </div>

      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste booking email or WhatsApp message here..."
        className="min-h-[180px] w-full rounded-xl border border-slate-300 bg-white p-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="mt-4 flex justify-end">

        <Button
          onClick={handleExtract}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Booking"}
        </Button>

      </div>

    </div>
  );
}