import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured",
        },
        { status: 500 }
      );
    }

    const result = await resend.emails.send({
      from: "Nautilus Transfers <info@contact.rovinjtaxitransfers.com>",
      to: ["info@rovinjtaxitransfers.com"],
      subject: "Nautilus Transfers Email Test",
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            color: #1e293b;
          "
        >
          <h2 style="margin-bottom: 20px;">
            Nautilus Transfers
          </h2>

          <p>
            This is a test email from the
            Nautilus Transfers application.
          </p>

          <p>
            Resend email integration is working correctly.
          </p>

          <hr
            style="
              margin: 25px 0;
              border: 0;
              border-top: 1px solid #e2e8f0;
            "
          />

          <p
            style="
              font-size: 13px;
              color: #64748b;
            "
          >
            Sent from rovinjtaxitransfers.com
          </p>
        </div>
      `,
    });

    console.log("RESEND TEST RESULT:", result);

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result,
    });
  } catch (error: unknown) {
    console.error("RESEND TEST EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send test email",
      },
      { status: 500 }
    );
  }
}