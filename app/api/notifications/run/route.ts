import { NextResponse } from "next/server";

import {
  getTransfersToNotify,
  markDriverNotified,
} from "@/services/notifications";

import { driverWhatsAppMessage } from "@/lib/helpers/driverWhatsApp";

export async function GET() {
  try {
    const transfers =
      await getTransfersToNotify();

    for (const transfer of transfers) {
      console.log(
        "================================="
      );

      console.log(
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
        } as any)
      );

      console.log(
        "================================="
      );

      await markDriverNotified(
        transfer.id
      );
    }

    return NextResponse.json({
      success: true,
      notified: transfers.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}