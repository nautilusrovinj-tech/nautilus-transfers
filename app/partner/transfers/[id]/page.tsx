import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusClass(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-orange-100 text-orange-700";

    case "Assigned":
      return "bg-blue-100 text-blue-700";

    case "Confirmed":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "New":
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function PartnerTransferDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: transfer, error } =
    await supabase
      .from("transfers")
      .select(`
        id,
        transfer_number,
        transfer_type,
        client_name,
        phone,
        email,
        date,
        time,
        pickup,
        destination,
        flight,
        adults,
        children,
        child_seats,
        baby_seats,
        booster_seats,
        price,
        payment_method,
        status,
        notes,
        driver_id,
        drivers:driver_id (
          name,
          phone
        )
      `)
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "PARTNER TRANSFER DETAILS ERROR:",
      error
    );

    notFound();
  }

  if (!transfer) {
    notFound();
  }

  const driver = Array.isArray(transfer.drivers)
    ? transfer.drivers[0]
    : transfer.drivers;

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

          <Link
            href="/partner"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Transfers
          </Link>

        </div>

      </header>

      {/* Content */}

      <main className="mx-auto max-w-5xl px-6 py-8">

        {/* Title */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Transfer{" "}
              {transfer.transfer_number ||
                transfer.id}
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Transfer Details
            </h2>

          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${getStatusClass(
              transfer.status
            )}`}
          >
            {transfer.status}
          </span>

        </div>

        <div className="space-y-6">

          {/* Transfer */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Transfer
            </h3>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.date}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Time
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.time}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.transfer_type ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Flight
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.flight || "-"}
                </p>
              </div>

            </div>

          </section>

          {/* Route */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Route
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pickup
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {transfer.pickup}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destination
                </p>

                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {transfer.destination}
                </p>

              </div>

            </div>

          </section>

          {/* Driver */}

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Driver
            </h3>

            {driver ? (
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Driver
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {driver.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </p>

                  <a
                    href={`tel:${driver.phone}`}
                    className="mt-1 block text-lg font-bold text-blue-700 hover:underline"
                  >
                    {driver.phone ||
                      "Phone not available"}
                  </a>
                </div>

              </div>
            ) : (
              <div>

                <p className="font-semibold text-slate-700">
                  Driver not assigned yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Driver information will appear here once the transfer is assigned.
                </p>

              </div>
            )}

          </section>

          {/* Client */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Client
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.client_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.phone || "-"}
                </p>
              </div>

              <div className="sm:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {transfer.email || "-"}
                </p>

              </div>

            </div>

          </section>

          {/* Passengers */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Passengers
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {transfer.adults ?? 0}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Adults
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {transfer.children ?? 0}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Children
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {transfer.child_seats ?? 0}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Child Seats
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {transfer.baby_seats ?? 0}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Baby Seats
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {transfer.booster_seats ?? 0}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  Boosters
                </div>
              </div>

            </div>

          </section>

          {/* Payment */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Booking
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  €{Number(
                    transfer.price ?? 0
                  ).toFixed(2)}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Method
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {transfer.payment_method ||
                    "Cash"}
                </p>

              </div>

            </div>

          </section>

          {/* Notes */}

          {transfer.notes && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Notes
              </h3>

              <p className="whitespace-pre-wrap text-slate-700">
                {transfer.notes}
              </p>

            </section>
          )}

          {/* Bottom */}

          <div className="flex justify-end pb-10">

            <Link
              href="/partner"
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Back to My Transfers
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}