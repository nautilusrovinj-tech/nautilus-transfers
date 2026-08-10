"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function NewPartnerTransferPage() {
  const router = useRouter();
  const supabase = createClient();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date: "",
    time: "",

    clientName: "",
    phone: "",
    email: "",

    pickup: "",
    destination: "",
    flight: "",

    adults: "1",
    children: "0",

    childSeats: "0",
    babySeats: "0",
    boosterSeats: "0",

    transferType: "Arrival",

    price: "",

    paymentMethod: "Cash",

    notes: "",
  });

  function updateField(
    field: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const {
        data: partner,
        error: partnerError,
      } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (partnerError) {
        throw partnerError;
      }

      if (!partner) {
        throw new Error(
          "Partner account is not connected."
        );
      }

      const transferNumber =
        `TR-${Date.now()}`;

      const { error: insertError } =
        await supabase
          .from("transfers")
          .insert({
            transfer_number:
              transferNumber,

            transfer_type:
              form.transferType,

            client_name:
              form.clientName,

            phone:
              form.phone,

            email:
              form.email,

            date:
              form.date,

            time:
              form.time,

            pickup:
              form.pickup,

            destination:
              form.destination,

            flight:
              form.flight,

            adults:
              Number(form.adults || 0),

            children:
              Number(form.children || 0),

            child_seats:
              Number(
                form.childSeats || 0
              ),

            baby_seats:
              Number(
                form.babySeats || 0
              ),

            booster_seats:
              Number(
                form.boosterSeats || 0
              ),

            partner_id:
              partner.id,

            price:
              Number(form.price || 0),

            payment_method:
              form.paymentMethod,

            status:
              "New",

            notes:
              form.notes,
          });

      if (insertError) {
        throw insertError;
      }

      router.push("/partner");
      router.refresh();

    } catch (err: any) {
      console.error(
        "CREATE PARTNER TRANSFER ERROR:",
        err
      );

      setError(
        err?.message ??
          "Could not create transfer."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Nautilus Transfers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Partner Portal
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/partner")
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Transfers
          </button>

        </div>

      </header>

      {/* Content */}

      <main className="mx-auto max-w-5xl px-6 py-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            New Transfer
          </h2>

          <p className="mt-2 text-slate-500">
            Enter the transfer details below.
          </p>

        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Transfer */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Transfer
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) =>
                    updateField(
                      "date",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Time
                </label>

                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) =>
                    updateField(
                      "time",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transfer Type
                </label>

                <select
                  value={
                    form.transferType
                  }
                  onChange={(e) =>
                    updateField(
                      "transferType",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                >
                  <option value="Arrival">
                    Arrival
                  </option>

                  <option value="Departure">
                    Departure
                  </option>

                  <option value="Tour">
                    Tour
                  </option>

                  <option value="Local">
                    Local
                  </option>
                </select>
              </div>

            </div>

          </section>

          {/* Client */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Client
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Client Name
                </label>

                <input
                  required
                  value={
                    form.clientName
                  }
                  onChange={(e) =>
                    updateField(
                      "clientName",
                      e.target.value
                    )
                  }
                  placeholder="Client name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="Phone"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

            </div>

          </section>

          {/* Route */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Route
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pickup
                </label>

                <input
                  required
                  value={form.pickup}
                  onChange={(e) =>
                    updateField(
                      "pickup",
                      e.target.value
                    )
                  }
                  placeholder="Pickup location"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Destination
                </label>

                <input
                  required
                  value={
                    form.destination
                  }
                  onChange={(e) =>
                    updateField(
                      "destination",
                      e.target.value
                    )
                  }
                  placeholder="Destination"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Flight
                </label>

                <input
                  value={form.flight}
                  onChange={(e) =>
                    updateField(
                      "flight",
                      e.target.value
                    )
                  }
                  placeholder="Flight number"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

            </div>

          </section>

          {/* Passengers */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Passengers
            </h3>

            <div className="grid gap-5 md:grid-cols-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Adults
                </label>

                <input
                  type="number"
                  min={0}
                  value={form.adults}
                  onChange={(e) =>
                    updateField(
                      "adults",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Children
                </label>

                <input
                  type="number"
                  min={0}
                  value={form.children}
                  onChange={(e) =>
                    updateField(
                      "children",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Child Seats
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    form.childSeats
                  }
                  onChange={(e) =>
                    updateField(
                      "childSeats",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Baby Seats
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    form.babySeats
                  }
                  onChange={(e) =>
                    updateField(
                      "babySeats",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Booster Seats
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    form.boosterSeats
                  }
                  onChange={(e) =>
                    updateField(
                      "boosterSeats",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

            </div>

          </section>

          {/* Booking */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Booking
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Price */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price (€)
                </label>

                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    updateField(
                      "price",
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />
              </div>

              {/* Payment */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payment Method
                </label>

                <select
                  value={
                    form.paymentMethod
                  }
                  onChange={(e) =>
                    updateField(
                      "paymentMethod",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Credit Card">
                    Credit Card
                  </option>

                  <option value="Invoice">
                    Invoice
                  </option>

                </select>
              </div>

              {/* Notes */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    updateField(
                      "notes",
                      e.target.value
                    )
                  }
                  placeholder="Additional information..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-3"
                />

              </div>

            </div>

          </section>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pb-10">

            <button
              type="button"
              onClick={() =>
                router.push("/partner")
              }
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Transfer"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}