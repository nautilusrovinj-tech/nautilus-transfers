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

function normalizePhone(
  phone: string
) {
  let normalized =
    phone.replace(/\D/g, "");

  // Croatian local number:
  // 0912345678
  //
  // becomes:
  // 385912345678

  if (normalized.startsWith("0")) {
    normalized =
      "385" +
      normalized.substring(1);
  }

  return normalized;
}

/**
 * Convert a database date + time into a Date.
 *
 * IMPORTANT:
 * Your transfers are based in Croatia.
 *
 * This uses the Europe/Zagreb timezone
 * when calculating the reminder.
 */
function getTransferDate(
  date: string,
  time: string
) {
  const cleanTime =
    time.length === 5
      ? `${time}:00`
      : time;

  const iso =
    `${date}T${cleanTime}`;

  return new Date(
    new Date(iso).toLocaleString(
      "en-US",
      {
        timeZone:
          "Europe/Zagreb",
      }
    )
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
          "Minutes until transfer:",
          minutesUntilTransfer
        );

        /*
         * Send when the transfer is approximately
         * 2 hours away.
         *
         * Window:
         * 1 hour 45 minutes
         * through
         * 2 hours 15 minutes
         *
         * This gives the hourly cron enough room
         * to catch the transfer.
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