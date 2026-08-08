import { NextResponse } from "next/server";

import { sendWhatsAppTemplate } from "@/services/whatsapp";

export async function GET() {
  try {
    const result = await sendWhatsAppTemplate(
      "385918833706",
      "TEST-2026-000001",
      "09 Aug 2026",
      "07:30",
      "Hotel Lone, Rovinj",
      "Pula Airport",
      "Test Passenger"
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error(
      "TEST WHATSAPP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.response?.data ??
          error.message ??
          "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}