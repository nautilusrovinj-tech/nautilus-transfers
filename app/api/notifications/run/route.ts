import { NextResponse } from "next/server";

import {
  getTransfersToNotify,
  markDriverNotified,
} from "@/services/notifications";

import { getDriverPhone } from "@/services/drivers";

import { driverWhatsAppMessage } from "@/lib/helpers/driverWhatsApp";
import { sendWhatsApp } from "@/services/whatsapp";

export async function GET() {
  const sent: string[] = [];
  const failed: string[] = [];

  try {
    const transfers =
      await getTransfersToNotify();

    for (const transfer of transfers) {
      try {
        if (!transfer.driver_id) {
          failed.push(
            `${transfer.transfer_number} - No driver`
          );
          continue;
        }

        const phone =
          await getDriverPhone(
            transfer.driver_id
          );

        if (!phone) {
          failed.push(
            `${transfer.transfer_number} - Driver has no phone`
          );
          continue;
        }

        const message =
          driverWhatsAppMessage({
            id: transfer.id,
            transferNumber:
              transfer.transfer_number,
            transferType:
              transfer.transfer_type,
            clientName:
              transfer.client_name,
            phone: transfer.phone,
            email: transfer.email,
            date: transfer.date,
            time: transfer.time,
            pickup: transfer.pickup,
            destination:
              transfer.destination,
            flight: transfer.flight,
            adults: transfer.adults,
            children:
              transfer.children,
            babySeats:
              transfer.baby_seats,
            boosterSeats:
              transfer.booster_seats,
            driver:
              transfer.driver,
            vehicle:
              transfer.vehicle,
            partner:
              transfer.partner,
            price: transfer.price,
            status: transfer.status,
            notes: transfer.notes,
            driverId:
              transfer.driver_id,
            vehicleId:
              transfer.vehicle_id,
            partnerId:
              transfer.partner_id,
          } as any);

        await sendWhatsApp(
          phone,
          message
        );

        await markDriverNotified(
          transfer.id
        );

        sent.push(
          transfer.transfer_number
        );
      } catch (err) {
        console.error(err);

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
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}