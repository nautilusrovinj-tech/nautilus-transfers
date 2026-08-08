import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/services/whatsapp";

export async function GET() {
  try {
    const result = await sendWhatsApp(
      "+385918833706", // <-- replace with YOUR phone number
      "Hello from Nautilus 🚤"
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data ?? error.message,
      },
      { status: 500 }
    );
  }
}