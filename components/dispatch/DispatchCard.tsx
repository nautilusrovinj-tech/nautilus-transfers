"use client";

import { useState } from "react";

import { googleMapsUrl } from "@/lib/helpers/maps";
import {
  driverWhatsAppUrl,
  guestWhatsAppUrl,
} from "@/lib/helpers/whatsapp";

import DriverSelect from "./DriverSelect";
import VehicleSelect from "./VehicleSelect";

import { Transfer } from "@/types/transfer";

interface Props {
  transfer: Transfer;
  driverPhone: string;
  onEdit?: (transfer: Transfer) => void;
  onAssignDriver?: (
    transferId: string,
    driverId: string
  ) => Promise<void>;
  onAssignVehicle?: (
    transferId: string,
    vehicleId: string
  ) => Promise<void>;
}

type ConfirmationMethod =
  | "whatsapp"
  | "email"
  | "both"
  | null;

export default function DispatchCard({
  transfer,
  driverPhone,
  onEdit,
  onAssignDriver,
  onAssignVehicle,
}: Props) {
  const [
    sendingGuestConfirmation,
    setSendingGuestConfirmation,
  ] = useState<ConfirmationMethod>(null);

  /*
   * These states are initialized from the database.
   *
   * Therefore they survive a page refresh because
   * the transfer object is loaded again from Supabase.
   */
  const [
    whatsappSent,
    setWhatsappSent,
  ] = useState(
    transfer.guestWhatsappSent ?? false
  );

  const [
    emailSent,
    setEmailSent,
  ] = useState(
    transfer.guestEmailSent ?? false
  );

  const [
    guestConfirmationResult,
    setGuestConfirmationResult,
  ] = useState<string | null>(null);

  function statusClass(
    status: Transfer["status"]
  ) {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Assigned":
        return "bg-purple-100 text-purple-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "In Progress":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function typeClass(
    transferType: Transfer["transferType"]
  ) {
    switch (transferType) {
      case "Arrival":
        return "bg-sky-100 text-sky-700";

      case "Departure":
        return "bg-emerald-100 text-emerald-700";

      case "Tour":
        return "bg-violet-100 text-violet-700";

      case "Local":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  /*
   * =====================================================
   * SEND GUEST WHATSAPP
   * =====================================================
   */

  async function sendGuestWhatsApp() {
    if (!transfer.phone) {
      setGuestConfirmationResult(
        "Guest phone number is missing."
      );
      return;
    }

    if (!transfer.driverId) {
      setGuestConfirmationResult(
        "Please assign a driver first."
      );
      return;
    }

    try {
      setSendingGuestConfirmation("whatsapp");
      setGuestConfirmationResult(null);

      const response = await fetch(
        "/api/guest-confirmation/whatsapp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transferId: transfer.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error?.message
              ? data.error.message
              : data.error
                ? JSON.stringify(
                    data.error
                  )
                : "Failed to send WhatsApp confirmation.";

        throw new Error(errorMessage);
      }

      /*
       * WhatsApp API succeeded.
       *
       * The API route also saves the status
       * into Supabase.
       */
      setWhatsappSent(true);

      setGuestConfirmationResult(
        "Guest WhatsApp confirmation sent."
      );
    } catch (error) {
      console.error(
        "Guest WhatsApp confirmation error:",
        error
      );

      setGuestConfirmationResult(
        error instanceof Error
          ? error.message
          : "Failed to send WhatsApp confirmation."
      );
    } finally {
      setSendingGuestConfirmation(null);
    }
  }

  /*
   * =====================================================
   * SEND GUEST EMAIL
   * =====================================================
   */

  async function sendGuestEmail() {
    if (!transfer.email) {
      setGuestConfirmationResult(
        "Guest email address is missing."
      );
      return;
    }

    if (!transfer.driverId) {
      setGuestConfirmationResult(
        "Please assign a driver first."
      );
      return;
    }

    try {
      setSendingGuestConfirmation("email");
      setGuestConfirmationResult(null);

      const response = await fetch(
        "/api/guest-confirmation/email",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transferId: transfer.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error?.message
              ? data.error.message
              : data.error
                ? JSON.stringify(
                    data.error
                  )
                : "Failed to send email confirmation.";

        throw new Error(errorMessage);
      }

      /*
       * Email API succeeded.
       *
       * The API route must also save
       * guest_email_sent = true.
       */
      setEmailSent(true);

      setGuestConfirmationResult(
        "Guest email confirmation sent."
      );
    } catch (error) {
      console.error(
        "Guest email confirmation error:",
        error
      );

      setGuestConfirmationResult(
        error instanceof Error
          ? error.message
          : "Failed to send email confirmation."
      );
    } finally {
      setSendingGuestConfirmation(null);
    }
  }

  /*
   * =====================================================
   * SEND BOTH
   * =====================================================
   */

  async function sendGuestBoth() {
    if (!transfer.phone) {
      setGuestConfirmationResult(
        "Guest phone number is missing."
      );
      return;
    }

    if (!transfer.email) {
      setGuestConfirmationResult(
        "Guest email address is missing."
      );
      return;
    }

    if (!transfer.driverId) {
      setGuestConfirmationResult(
        "Please assign a driver first."
      );
      return;
    }

    try {
      setSendingGuestConfirmation("both");
      setGuestConfirmationResult(null);

      /*
       * -----------------------------------------------
       * WHATSAPP
       * -----------------------------------------------
       */

      const whatsappResponse =
        await fetch(
          "/api/guest-confirmation/whatsapp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              transferId: transfer.id,
            }),
          }
        );

      const whatsappData =
        await whatsappResponse.json();

      const whatsappSuccess =
        whatsappResponse.ok &&
        whatsappData.success;

      if (!whatsappSuccess) {
        const errorMessage =
          typeof whatsappData.error ===
          "string"
            ? whatsappData.error
            : whatsappData.error?.message
              ? whatsappData.error.message
              : whatsappData.error
                ? JSON.stringify(
                    whatsappData.error
                  )
                : "Failed to send WhatsApp confirmation.";

        throw new Error(
          errorMessage
        );
      }

      /*
       * WhatsApp succeeded.
       */
      setWhatsappSent(true);

      /*
       * -----------------------------------------------
       * EMAIL
       * -----------------------------------------------
       */

      const emailResponse =
        await fetch(
          "/api/guest-confirmation/email",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              transferId: transfer.id,
            }),
          }
        );

      const emailData =
        await emailResponse.json();

      const emailSuccess =
        emailResponse.ok &&
        emailData.success;

      if (!emailSuccess) {
        const errorMessage =
          typeof emailData.error ===
          "string"
            ? emailData.error
            : emailData.error?.message
              ? emailData.error.message
              : emailData.error
                ? JSON.stringify(
                    emailData.error
                  )
                : "Unknown email error.";

        throw new Error(
          `WhatsApp sent, but email failed: ${errorMessage}`
        );
      }

      /*
       * Email succeeded.
       */
      setEmailSent(true);

      /*
       * Both succeeded.
       */
      setGuestConfirmationResult(
        "Guest WhatsApp and email confirmations sent."
      );
    } catch (error) {
      console.error(
        "Guest WhatsApp + Email confirmation error:",
        error
      );

      setGuestConfirmationResult(
        error instanceof Error
          ? error.message
          : "Failed to send guest confirmation."
      );
    } finally {
      setSendingGuestConfirmation(null);
    }
  }

  const adults =
    Number(transfer.adults ?? 0);

  const children =
    Number(transfer.children ?? 0);

  const babySeats =
    Number(transfer.babySeats ?? 0);

  const boosterSeats =
    Number(transfer.boosterSeats ?? 0);

  const childSeats =
    Number(
      (transfer as any)
        .childSeats ?? 0
    );

  const passengerCount =
    adults + children;

  const price =
    Number(transfer.price ?? 0);

  /*
   * =====================================================
   * PERSISTENT CONFIRMATION MESSAGE
   * =====================================================
   */

  let persistentConfirmationMessage:
    string | null = null;

  if (
    whatsappSent &&
    emailSent
  ) {
    persistentConfirmationMessage =
      "Guest WhatsApp and email confirmations sent.";
  } else if (whatsappSent) {
    persistentConfirmationMessage =
      "Guest WhatsApp confirmation sent.";
  } else if (emailSent) {
    persistentConfirmationMessage =
      "Guest email confirmation sent.";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>
          <div className="text-2xl font-bold text-slate-900">
            {transfer.time}
          </div>

          <div className="mt-1 text-lg font-semibold text-slate-900">
            {transfer.clientName}
          </div>
        </div>

        <div className="space-y-2 text-right">

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
              transfer.status
            )}`}
          >
            {transfer.status}
          </span>

          <br />

          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${typeClass(
              transfer.transferType
            )}`}
          >
            {transfer.transferType}
          </span>

        </div>

      </div>

      {/* PICKUP / DESTINATION */}

      <div className="my-5 rounded-xl bg-slate-50 p-4">

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pickup
        </div>

        <div className="mt-1 font-medium text-slate-900">
          {transfer.pickup}
        </div>

        <div className="my-3 border-t border-dashed border-slate-300" />

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Destination
        </div>

        <div className="mt-1 font-medium text-slate-900">
          {transfer.destination}
        </div>

      </div>

      {/* PASSENGERS / PRICE */}

      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Passengers
          </div>

          <div className="mt-1 font-semibold text-slate-900">
            {passengerCount}
          </div>

          <div className="mt-1 text-xs text-slate-500">

            {adults} adult
            {adults !== 1
              ? "s"
              : ""}

            {children > 0 &&
              `, ${children} child${
                children !== 1
                  ? "ren"
                  : ""
              }`}

          </div>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Price
          </div>

          <div className="mt-1 font-semibold text-slate-900">
            {price > 0
              ? `€${price.toFixed(2)}`
              : "On request"}
          </div>

        </div>

      </div>

      {/* CHILD SEATS */}

      <div className="mt-4 rounded-xl bg-slate-50 p-4">

        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Child Seats
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-sm">

          {children > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Children: {children}
            </span>
          )}

          {babySeats > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Baby seats: {babySeats}
            </span>
          )}

          {childSeats > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Child seats: {childSeats}
            </span>
          )}

          {boosterSeats > 0 && (
            <span className="rounded-full bg-white px-3 py-1">
              Booster seats: {boosterSeats}
            </span>
          )}

          {children === 0 &&
            babySeats === 0 &&
            childSeats === 0 &&
            boosterSeats === 0 && (
              <span className="text-slate-500">
                None
              </span>
            )}

        </div>

      </div>

      {/* DRIVER / VEHICLE */}

      <div className="mt-4 grid gap-4 md:grid-cols-2">

        <div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Driver
          </div>

          <DriverSelect
            transferId={transfer.id}
            value={transfer.driverId}
            onAssigned={(driverId) =>
              onAssignDriver?.(
                transfer.id,
                driverId
              ) ??
              Promise.resolve()
            }
          />

        </div>

        <div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vehicle
          </div>

          <VehicleSelect
            value={transfer.vehicleId}
            onChange={(vehicleId) =>
              onAssignVehicle?.(
                transfer.id,
                vehicleId
              ) ??
              Promise.resolve()
            }
          />

        </div>

      </div>

      {/* PARTNER */}

      {transfer.partner && (
        <div className="mt-4 flex flex-wrap gap-2">

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            Partner: {transfer.partner}
          </span>

        </div>
      )}

      {/* NOTES */}

      {transfer.notes && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Notes
          </div>

          <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
            {transfer.notes}
          </div>

        </div>
      )}

      {/* FLIGHT */}

      {transfer.flight && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Flight
          </div>

          <div className="mt-1 font-medium">
            {transfer.flight}
          </div>

        </div>
      )}

      {/* TRANSFER NUMBER / PRICE */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">

        <div className="text-sm text-slate-500">
          {transfer.transferNumber}
        </div>

        <div className="text-xl font-bold text-slate-900">
          {price > 0
            ? `€${price.toFixed(2)}`
            : "On request"}
        </div>

      </div>

      {/* ACTIONS */}

      <div className="mt-4 flex flex-wrap gap-2">

        <button
          type="button"
          onClick={() =>
            onEdit?.(transfer)
          }
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            window.open(
              googleMapsUrl(
                transfer.pickup,
                transfer.destination
              ),
              "_blank"
            )
          }
          className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
        >
          Navigate
        </button>

        {transfer.phone && (
          <button
            type="button"
            onClick={() =>
              window.open(
                `tel:${transfer.phone}`
              )
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Call
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (!transfer.phone)
              return;

            window.open(
              guestWhatsAppUrl(
                transfer
              ),
              "_blank"
            );
          }}
          disabled={!transfer.phone}
          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guest
        </button>

        <button
          type="button"
          onClick={() => {
            if (!driverPhone)
              return;

            window.open(
              driverWhatsAppUrl(
                transfer,
                driverPhone
              ),
              "_blank"
            );
          }}
          disabled={!driverPhone}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Driver
        </button>

      </div>

      {/* GUEST CONFIRMATION */}

      <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">

        <button
          type="button"
          onClick={
            sendGuestWhatsApp
          }
          disabled={
            sendingGuestConfirmation !==
            null
          }
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
        >
          <span className="text-sm">
            ◯
          </span>

          {sendingGuestConfirmation ===
          "whatsapp"
            ? "Sending..."
            : "WhatsApp"}
        </button>

        <button
          type="button"
          onClick={
            sendGuestEmail
          }
          disabled={
            sendingGuestConfirmation !==
            null
          }
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
        >
          <span className="text-sm">
            ✉
          </span>

          {sendingGuestConfirmation ===
          "email"
            ? "Sending..."
            : "Email"}
        </button>

        <button
          type="button"
          onClick={
            sendGuestBoth
          }
          disabled={
            sendingGuestConfirmation !==
            null
          }
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        >
          <span className="text-sm">
            ➤
          </span>

          {sendingGuestConfirmation ===
          "both"
            ? "Sending..."
            : "Both"}
        </button>

      </div>

      {/* PERSISTENT SUCCESS MESSAGE */}

      {persistentConfirmationMessage && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          {persistentConfirmationMessage}
        </div>
      )}

      {/* CURRENT ERROR / IMMEDIATE RESULT */}

      {guestConfirmationResult &&
        !persistentConfirmationMessage && (
          <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {guestConfirmationResult}
          </div>
        )}

    </div>
  );
}