import { NextResponse } from "next/server";

import {
  getTransfersToNotify,
  markDriverNotified,
} from "@/services/notifications";

import { getDriverById } from "@/services/drivers";

import { sendWhatsAppTemplate } from "@/services/whatsapp";

export async function GET() {
  try {
    const transfers = await getTransfersToNotify();

    console.log("================================");
    console.log(
      "Transfers to notify:",
      transfers.length
    );
    console.log("================================");

    const sent: string[] = [];
    const failed: string[] = [];

    for (const transfer of transfers) {
      try {
        console.log("--------------------------------");
        console.log(
          "Transfer:",
          transfer.transfer_number
        );

        if (!transfer.driver_id) {
          console.log("No driver assigned");
          continue;
        }

        const driver = await getDriverById(
          transfer.driver_id
        );

        if (!driver) {
          console.log("Driver not found");
          continue;
        }

        if (!driver.phone) {
          console.log(
            "Driver has no phone"
          );
          continue;
        }

        let phone = driver.phone.replace(
          /\D/g,
          ""
        );

        // Convert Croatian local numbers:
        // 0912345678 -> 385912345678
        if (phone.startsWith("0")) {
          phone =
            "385" + phone.substring(1);
        }

        console.log(
          "Driver:",
          driver.name
        );

        console.log(
          "Phone:",
          phone
        );

        console.log(
          "Sending WhatsApp template..."
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
          "FAILED:",
          transfer.transfer_number
        );

        console.error(error);

        failed.push(
          transfer.transfer_number
        );
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
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