import { NextResponse } from "next/server";

import {
  getTransfersToNotify,
  getTransfersForReminder,
  markDriverNotified,
  markDriverReminderNotified,
} from "@/services/notifications";

import { getDriverById } from "@/services/drivers";

import {
  sendWhatsAppTemplate,
  sendWhatsAppReminder,
} from "@/services/whatsapp";

function normalizePhone(phone: string) {
  let normalized = phone.replace(/\D/g, "");

  // Croatian local number:
  // 0912345678
  //
  // becomes:
  // 385912345678
  if (normalized.startsWith("0")) {
    normalized =
      "385" + normalized.substring(1);
  }

  return normalized;
}

/**
 * Convert a Croatian local date/time from the
 * database into the correct UTC Date.
 *
 * Database example:
 * date = "2026-08-10"
 * time = "12:30"
 *
 * The transfer time is interpreted as Europe/Zagreb time,
 * including daylight-saving time.
 */
function getTransferDate(
  date: string,
  time: string
): Date {
  const [year, month, day] =
    date.split("-").map(Number);

  const [hour, minute] =
    time.split(":").map(Number);

  // First treat the local Croatian time as if it were UTC.
  const assumedUtc = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute || 0,
      0
    )
  );

  // Ask Intl what the Zagreb clock shows for that instant.
  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "Europe/Zagreb",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }
  ).formatToParts(assumedUtc);

  const values: Record<string, number> =
    {};

  for (const part of parts) {
    if (
      part.type !== "literal"
    ) {
      values[part.type] =
        Number(part.value);
    }
  }

  const displayedAsUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
    values.second
  );

  // Difference between UTC and Zagreb.
  const offset =
    displayedAsUtc -
    assumedUtc.getTime();

  // Convert the original Croatian local
  // time into the actual UTC instant.
  return new Date(
    assumedUtc.getTime() - offset
  );
}

export async function GET() {
  try {
    const sent: string[] = [];
    const failed: string[] = [];

    const remindersSent: string[] = [];
    const remindersFailed: string[] = [];

    /*
     * =====================================================
     * FIRST NOTIFICATION
     * =====================================================
     */

    const transfers =
      await getTransfersToNotify();

    console.log(
      "================================"
    );

    console.log(
      "Transfers to notify:",
      transfers.length
    );

    console.log(
      "================================"
    );

    for (const transfer of transfers) {
      try {
        console.log(
          "--------------------------------"
        );

        console.log(
          "First notification:",
          transfer.transfer_number
        );

        if (!transfer.driver_id) {
          console.log(
            "No driver assigned"
          );

          continue;
        }

        const driver =
          await getDriverById(
            transfer.driver_id
          );

        if (!driver) {
          console.log(
            "Driver not found"
          );

          continue;
        }

        if (!driver.phone) {
          console.log(
            "Driver has no phone"
          );

          continue;
        }

        const phone =
          normalizePhone(
            driver.phone
          );

        console.log(
          "Driver:",
          driver.name
        );

        console.log(
          "Phone:",
          phone
        );

        const result =
          await sendWhatsAppTemplate(
            phone,
            transfer.transfer_number,
            transfer.date,
            transfer.time,
            transfer.pickup,
            transfer.destination,
            transfer.client_name
          );

        console.log(
          "WhatsApp response:",
          result
        );

        await markDriverNotified(
          transfer.id
        );

        sent.push(
          `${transfer.transfer_number} → ${driver.name}`
        );

        console.log(
          `✓ ${transfer.transfer_number} sent`
        );
      } catch (error) {
        console.error(
          "FIRST NOTIFICATION FAILED:",
          transfer.transfer_number
        );

        console.error(error);

        failed.push(
          transfer.transfer_number
        );
      }
    }

    /*
     * =====================================================
     * 2-HOUR REMINDER
     * =====================================================
     */

    const reminderTransfers =
      await getTransfersForReminder();

    console.log(
      "================================"
    );

    console.log(
      "Potential reminders:",
      reminderTransfers.length
    );

    console.log(
      "================================"
    );

    const now = new Date();

    for (
      const transfer of reminderTransfers
    ) {
      try {
        console.log(
          "--------------------------------"
        );

        console.log(
          "Checking reminder:",
          transfer.transfer_number
        );

        if (!transfer.driver_id) {
          console.log(
            "No driver assigned"
          );

          continue;
        }

        const driver =
          await getDriverById(
            transfer.driver_id
          );

        if (!driver) {
          console.log(
            "Driver not found"
          );

          continue;
        }

        if (!driver.phone) {
          console.log(
            "Driver has no phone"
          );

          continue;
        }

        const transferDate =
          getTransferDate(
            transfer.date,
            transfer.time
          );

        const millisecondsUntilTransfer =
          transferDate.getTime() -
          now.getTime();

        const minutesUntilTransfer =
          millisecondsUntilTransfer /
          (1000 * 60);

        console.log(
          "Transfer date:",
          transfer.date
        );

        console.log(
          "Transfer time:",
          transfer.time
        );

        console.log(
          "Transfer UTC:",
          transferDate.toISOString()
        );

        console.log(
          "Current UTC:",
          now.toISOString()
        );

        console.log(
          "Minutes until transfer:",
          minutesUntilTransfer
        );

        /*
         * Reminder window:
         *
         * 105 minutes = 1h 45m
         * 135 minutes = 2h 15m
         *
         * This gives a 30-minute window so that
         * an hourly cron can catch the reminder.
         */
        const shouldSendReminder =
          minutesUntilTransfer >= 105 &&
          minutesUntilTransfer <= 135;

        if (!shouldSendReminder) {
          console.log(
            "Not in 2-hour reminder window"
          );

          continue;
        }

        const phone =
          normalizePhone(
            driver.phone
          );

        console.log(
          "Sending 2-hour reminder to:",
          driver.name
        );

        console.log(
          "Phone:",
          phone
        );

        const result =
          await sendWhatsAppReminder(
            phone,
            transfer.transfer_number,
            transfer.date,
            transfer.time,
            transfer.pickup,
            transfer.destination,
            transfer.client_name
          );

        console.log(
          "Reminder WhatsApp response:",
          result
        );

        await markDriverReminderNotified(
          transfer.id
        );

        remindersSent.push(
          `${transfer.transfer_number} → ${driver.name}`
        );

        console.log(
          `✓ Reminder sent for ${transfer.transfer_number}`
        );
      } catch (error) {
        console.error(
          "REMINDER FAILED:",
          transfer.transfer_number
        );

        console.error(error);

        remindersFailed.push(
          transfer.transfer_number
        );
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      remindersSent,
      remindersFailed,
    });
  } catch (error) {
    console.error(
      "Notification route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}