import { NextResponse } from "next/server";

import {
  getTransfersToNotify,
  markDriverNotified,
} from "@/services/notifications";

import { getDriverById } from "@/services/drivers";

import { driverWhatsAppMessage } from "@/lib/helpers/driverWhatsApp";

import { sendWhatsApp } from "@/services/whatsapp";

export async function GET() {
  try {
    const transfers = await getTransfersToNotify();

    const sent: string[] = [];
    const failed: string[] = [];

    for (const transfer of transfers) {
      try {
        if (!transfer.driver_id) {
          console.log(
            `${transfer.transfer_number} - no driver assigned`
          );
          continue;
        }

        const driver = await getDriverById(
          transfer.driver_id
        );

        if (!driver) {
          console.log(
            `${transfer.transfer_number} - driver not found`
          );
          continue;
        }

        if (!driver.phone) {
          console.log(
            `${transfer.transfer_number} - driver has no phone`
          );
          continue;
        }

        const phone = driver.phone.replace(/\D/g, "");

        const message = driverWhatsAppMessage({
          id: transfer.id,
          transferNumber: transfer.transfer_number,
          transferType: transfer.transfer_type,
          clientName: transfer.client_name,
          phone: transfer.phone,
          email: transfer.email,
          date: transfer.date,
          time: transfer.time,
          pickup: transfer.pickup,
          destination: transfer.destination,
          flight: transfer.flight,
          adults: transfer.adults,
          children: transfer.children,
          babySeats: transfer.baby_seats,
          boosterSeats: transfer.booster_seats,
          driver: driver.name,
          vehicle: transfer.vehicle,
          partner: transfer.partner,
          price: transfer.price,
          status: transfer.status,
          notes: transfer.notes,
          driverId: transfer.driver_id,
          vehicleId: transfer.vehicle_id,
          partnerId: transfer.partner_id,
        } as any);

        await sendWhatsApp(
          phone,
          message
        );

        await markDriverNotified(
          transfer.id
        );

        sent.push(
          `${transfer.transfer_number} → ${driver.name}`
        );

        console.log(
          `✓ ${transfer.transfer_number} sent to ${driver.name}`
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
  } catch (error) {
    console.error(error);

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