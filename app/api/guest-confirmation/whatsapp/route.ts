import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import {
  sendGuestTransferConfirmation,
} from "@/services/whatsapp";

function normalizePhone(phone: string) {
  let normalized = phone.replace(/\D/g, "");

  if (normalized.startsWith("0")) {
    normalized =
      "385" + normalized.substring(1);
  }

  return normalized;
}

function formatDisplayTime(time: string) {
  if (!time) {
    return "-";
  }

  const parts = time.split(":");

  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }

  return time;
}

function buildTransferDetails(
  transfer: {
    pickup?: string | null;
    destination?: string | null;
    flight?: string | null;
    baby_seats?: number | null;
    child_seats?: number | null;
    booster_seats?: number | null;
  },
  adults: number,
  children: number,
  passengers: number
) {
  const lines = [
    `Pickup: ${transfer.pickup ?? "-"}`,
    `Destination: ${transfer.destination ?? "-"}`,
  ];

  if (transfer.flight) {
    lines.push(
      `Flight: ${transfer.flight}`
    );
  }

  lines.push(
    `Passengers: ${passengers} (${adults} adult${
      adults !== 1 ? "s" : ""
    }${
      children > 0
        ? `, ${children} child${
            children !== 1 ? "ren" : ""
          }`
        : ""
    })`
  );

  const seatParts: string[] = [];

  const babySeats = Number(
    transfer.baby_seats ?? 0
  );

  const childSeats = Number(
    transfer.child_seats ?? 0
  );

  const boosterSeats = Number(
    transfer.booster_seats ?? 0
  );

  if (babySeats > 0) {
    seatParts.push(
      `${babySeats} baby seat${
        babySeats !== 1 ? "s" : ""
      }`
    );
  }

  if (childSeats > 0) {
    seatParts.push(
      `${childSeats} child seat${
        childSeats !== 1 ? "s" : ""
      }`
    );
  }

  if (boosterSeats > 0) {
    seatParts.push(
      `${boosterSeats} booster seat${
        boosterSeats !== 1 ? "s" : ""
      }`
    );
  }

  if (seatParts.length > 0) {
    lines.push(
      `Child seats: ${seatParts.join(", ")}`
    );
  }

  return lines.join("\n");
}

function buildDriverDetails(
  driver: {
    name?: string | null;
    phone?: string | null;
  },
  vehicle?: {
    name?: string | null;
  } | null
) {
  return [
    `Driver: ${driver.name ?? "-"}`,
    `Phone: ${driver.phone ?? "-"}`,
    `Vehicle: ${vehicle?.name ?? "-"}`,
  ].join("\n");
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const transferId = body.transferId;

    if (!transferId) {
      return NextResponse.json(
        {
          success: false,
          error: "transferId is required",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    /*
     * =====================================================
     * LOAD TRANSFER
     * =====================================================
     */

    const {
      data: transfer,
      error: transferError,
    } = await supabase
      .from("transfers")
      .select(`
        *,
        drivers:driver_id (
          name,
          phone
        ),
        vehicles:vehicle_id (
          name
        )
      `)
      .eq("id", transferId)
      .single();

    if (transferError) {
      console.error(
        "GET TRANSFER FOR GUEST CONFIRMATION ERROR:",
        transferError
      );

      return NextResponse.json(
        {
          success: false,
          error: transferError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!transfer) {
      return NextResponse.json(
        {
          success: false,
          error: "Transfer not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * =====================================================
     * CHECK GUEST PHONE
     * =====================================================
     */

    if (!transfer.phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Guest does not have a phone number",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * CHECK DRIVER
     * =====================================================
     */

    const driver = transfer.drivers;

    if (!driver) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No driver is assigned to this transfer",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * VEHICLE
     * =====================================================
     */

    const vehicle = transfer.vehicles;

    /*
     * =====================================================
     * NORMALIZE PHONE
     * =====================================================
     */

    const guestPhone =
      normalizePhone(transfer.phone);

    /*
     * =====================================================
     * PASSENGERS
     * =====================================================
     */

    const adults =
      Number(transfer.adults ?? 0);

    const children =
      Number(transfer.children ?? 0);

    const passengers =
      adults + children;

    /*
     * =====================================================
     * SEND WHATSAPP
     *
     * Template: guest_transfer_confirmation
     *
     * Body variables (in order):
     * {{1}} Guest name
     * {{2}} Transfer number
     * {{3}} Date + time
     * {{4}} Transfer details
     * {{5}} Driver details
     * =====================================================
     */

    const guestName =
      transfer.client_name ?? "Guest";

    const transferNumber =
      transfer.transfer_number ?? "-";

    const dateTime =
      `${transfer.date ?? "-"} ${formatDisplayTime(
        transfer.time ?? ""
      )}`.trim();

    const transferDetails =
      buildTransferDetails(
        transfer,
        adults,
        children,
        passengers
      );

    const driverDetails =
      buildDriverDetails(
        driver,
        vehicle
      );

    console.log(
      "================================"
    );

    console.log(
      "GUEST TRANSFER CONFIRMATION"
    );

    console.log(
      "Template:",
      "guest_transfer_confirmation"
    );

    console.log(
      "Transfer:",
      transferNumber
    );

    console.log(
      "Guest:",
      guestName
    );

    console.log(
      "Guest phone:",
      guestPhone
    );

    console.log(
      "Date/time:",
      dateTime
    );

    console.log(
      "Transfer details:",
      transferDetails
    );

    console.log(
      "Driver details:",
      driverDetails
    );

    console.log(
      "================================"
    );

    const result =
      await sendGuestTransferConfirmation(
        guestPhone,
        guestName,
        transferNumber,
        dateTime,
        transferDetails,
        driverDetails
      );

    /*
     * =====================================================
     * MARK AS SENT
     * =====================================================
     */

    const {
      error: updateError,
    } = await supabase
      .from("transfers")
      .update({
        guest_whatsapp_sent: true,
        guest_whatsapp_sent_at:
          new Date().toISOString(),
      })
      .eq("id", transferId);

    if (updateError) {
      console.error(
        "GUEST WHATSAPP STATUS UPDATE ERROR:",
        updateError
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Guest WhatsApp confirmation sent",
      transferId,
      transferNumber:
        transfer.transfer_number,
      guestPhone,
      result,
    });
  } catch (error: any) {
    console.error(
      "========== GUEST WHATSAPP CONFIRMATION ERROR =========="
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Response:",
      JSON.stringify(
        error.response?.data ?? null,
        null,
        2
      )
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data ??
          error.message ??
          "Failed to send guest WhatsApp confirmation",
      },
      {
        status: 500,
      }
    );
  }
}