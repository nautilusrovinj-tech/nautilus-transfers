import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import PartnerDateFilter from "@/components/partner/PartnerDateFilter";
import PartnerSignOut from "@/components/partner/PartnerSignOut";

interface PartnerPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}

export default async function PartnerPage({
  searchParams,
}: PartnerPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  console.log(
    "PARTNER PORTAL USER:",
    user.id
  );

  console.log(
    "PARTNER PORTAL EMAIL:",
    user.email
  );

  console.log(
    "PARTNER USER METADATA:",
    user.user_metadata
  );

  const metadataPartnerId =
    user.user_metadata?.partner_id;

  let partner = null;

  /*
   * First try partner_id from
   * Supabase user metadata.
   */
  if (metadataPartnerId) {
    const {
      data,
      error,
    } = await supabase
      .from("partners")
      .select("*")
      .eq(
        "id",
        metadataPartnerId
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Partner metadata lookup error:",
        error
      );
    }

    partner = data;
  }

  /*
   * Fallback:
   * Find partner using user_id.
   */
  if (!partner) {
    const {
      data,
      error,
    } = await supabase
      .from("partners")
      .select("*")
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Partner user_id lookup error:",
        error
      );
    }

    partner = data;
  }

  /*
   * Partner account not connected.
   */
  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-6">

          <h1 className="text-xl font-bold text-amber-800">
            Partner account not connected
          </h1>

          <p className="mt-2 text-amber-700">
            Your login account has not been
            connected to a partner profile yet.
          </p>

          <div className="mt-5 rounded-xl border border-amber-200 bg-white p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Logged in as
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user.email}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              User ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {user.id}
            </p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Partner ID from account
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {metadataPartnerId ||
                "Not found"}
            </p>

          </div>

          <p className="mt-4 text-sm text-amber-700">
            Please contact Nautilus Dispatch if
            this account should have partner access.
          </p>

        </div>

      </div>
    );
  }

  /*
   * DATE FILTER
   */

  const {
    from = "",
    to = "",
  } = await searchParams;

  /*
   * LOAD PARTNER TRANSFERS
   */

  let transfersQuery = supabase
    .from("transfers")
    .select("*")
    .eq(
      "partner_id",
      partner.id
    );

  if (from) {
    transfersQuery =
      transfersQuery.gte(
        "date",
        from
      );
  }

  if (to) {
    transfersQuery =
      transfersQuery.lte(
        "date",
        to
      );
  }

  const {
    data: transfers,
    error: transfersError,
  } = await transfersQuery
    .order("date", {
      ascending: true,
    })
    .order("time", {
      ascending: true,
    });

  if (transfersError) {
    console.error(
      "Partner transfers error:",
      transfersError
    );

    return (
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-xl font-bold text-red-800">
            Could not load transfers
          </h1>

          <p className="mt-2 text-red-700">
            Please try again later.
          </p>

        </div>

      </div>
    );
  }

  /*
   * SUMMARY
   */

  const totalTransfers =
    transfers?.length ?? 0;

  const upcomingTransfers =
    (transfers ?? []).filter(
      (transfer) =>
        transfer.status !==
          "Completed" &&
        transfer.status !==
          "Cancelled"
    ).length;

  const completedTransfers =
    (transfers ?? []).filter(
      (transfer) =>
        transfer.status ===
        "Completed"
    ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Nautilus Transfers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Partner Portal
            </p>

          </div>

          <div className="flex items-center gap-4">

            <Link
              href="/partner/new-transfer"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              New Transfer
            </Link>

            <PartnerSignOut />

            <div className="hidden text-right sm:block">

              <p className="font-semibold text-slate-900">
                {partner.name}
              </p>

              <p className="text-sm text-slate-500">
                {user.email}
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">

        {/* WELCOME */}

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome,{" "}
            {partner.contact_person ||
              partner.name}
          </h2>

          <p className="mt-2 text-slate-500">
            Here you can view your transfers
            and booking information.
          </p>

        </div>

        {/* DATE FILTER */}

        <PartnerDateFilter
          fromDate={from}
          toDate={to}
        />

        {/* SUMMARY */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Transfers
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalTransfers}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Upcoming
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {upcomingTransfers}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedTransfers}
            </p>

          </div>

        </div>

        {/* TRANSFERS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b px-6 py-5">

            <h2 className="text-xl font-bold text-slate-900">
              My Transfers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Transfers associated with your
              partner account.
            </p>

            {(from || to) && (
              <p className="mt-2 text-xs font-medium text-blue-600">
                Filtered
                {from
                  ? ` from ${from}`
                  : ""}
                {to
                  ? ` to ${to}`
                  : ""}
              </p>
            )}

          </div>

          {transfers &&
          transfers.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Route
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Passengers
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {transfers.map(
                    (transfer) => (
                      <tr
                        key={transfer.id}
                        className="transition hover:bg-slate-50"
                      >

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                          {transfer.date}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {transfer.time}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-900">
                          {transfer.client_name}
                        </td>

                        <td className="min-w-[260px] px-6 py-4 text-sm">

                          <div className="font-medium text-slate-900">
                            {transfer.pickup}
                          </div>

                          <div className="my-1 text-xs text-slate-400">
                            ↓
                          </div>

                          <div className="text-slate-600">
                            {transfer.destination}
                          </div>

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">

                          {transfer.adults ?? 0}
                          {" "}
                          adult
                          {(transfer.adults ??
                            0) !== 1
                            ? "s"
                            : ""}

                          {(transfer.children ??
                            0) > 0 && (
                            <>
                              {" · "}
                              {transfer.children}
                              {" "}
                              child
                              {transfer.children !==
                              1
                                ? "ren"
                                : ""}
                            </>
                          )}

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          €
                          {Number(
                            transfer.price ??
                              0
                          ).toFixed(2)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              transfer.status ===
                              "Completed"
                                ? "bg-green-100 text-green-700"
                                : transfer.status ===
                                  "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : transfer.status ===
                                  "In Progress"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {transfer.status}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right">

                          <Link
                            href={`/partner/transfers/${transfer.id}`}
                            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </Link>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="p-12 text-center">

              <h3 className="text-lg font-semibold text-slate-900">
                No transfers found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No transfers match the selected
                date range.
              </p>

              <Link
                href="/partner/new-transfer"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Transfer
              </Link>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}