import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const transferId = body.transferId;

    if (!transferId) {
      return NextResponse.json(
        {
          success: false,
          error: "transferId is required",
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not configured",
        },
        { status: 500 }
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
        "GET TRANSFER FOR GUEST EMAIL ERROR:",
        transferError
      );

      return NextResponse.json(
        {
          success: false,
          error: transferError.message,
        },
        { status: 500 }
      );
    }

    if (!transfer) {
      return NextResponse.json(
        {
          success: false,
          error: "Transfer not found",
        },
        { status: 404 }
      );
    }

    /*
     * =====================================================
     * CHECK GUEST EMAIL
     * =====================================================
     */

    if (!transfer.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Guest does not have an email address",
        },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * DRIVER / VEHICLE
     * =====================================================
     */

    const driver = transfer.drivers;
    const vehicle = transfer.vehicles;

    /*
     * =====================================================
     * PASSENGERS
     * =====================================================
     */

    const adults = Number(
      transfer.adults ?? 0
    );

    const children = Number(
      transfer.children ?? 0
    );

    const babySeats = Number(
      transfer.babySeats ?? 0
    );

    const childSeats = Number(
      transfer.childSeats ?? 0
    );

    const boosterSeats = Number(
      transfer.boosterSeats ?? 0
    );

    const passengers =
      adults + children;

    /*
     * =====================================================
     * CHILD SEATS
     * =====================================================
     */

    const seatParts: string[] = [];

    if (babySeats > 0) {
      seatParts.push(
        `${babySeats} Baby Seat${
          babySeats !== 1 ? "s" : ""
        }`
      );
    }

    if (childSeats > 0) {
      seatParts.push(
        `${childSeats} Child Seat${
          childSeats !== 1 ? "s" : ""
        }`
      );
    }

    if (boosterSeats > 0) {
      seatParts.push(
        `${boosterSeats} Booster Seat${
          boosterSeats !== 1 ? "s" : ""
        }`
      );
    }

    /*
     * =====================================================
     * PRICE
     * =====================================================
     */

    const price = Number(
      transfer.price ?? 0
    );

    /*
     * =====================================================
     * SEND EMAIL
     * =====================================================
     */

    console.log(
      "================================"
    );

    console.log(
      "GUEST EMAIL CONFIRMATION"
    );

    console.log(
      "Transfer:",
      transfer.transfer_number
    );

    console.log(
      "Guest:",
      transfer.client_name
    );

    console.log(
      "Email:",
      transfer.email
    );

    console.log(
      "From:",
      "Nautilus Transfers <info@rovinjtaxitransfers.com>"
    );

    console.log(
      "================================"
    );

    const { data, error } =
      await resend.emails.send({
        from:
          "Nautilus Transfers <info@contact.rovinjtaxitransfers.com>",

        to: [transfer.email],

        subject:
          `Transfer Confirmation - ${
            transfer.transfer_number ?? ""
          }`,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 700px;
              margin: 0 auto;
              padding: 30px;
              color: #1e293b;
            "
          >

            <h1
              style="
                font-size: 28px;
                margin-bottom: 8px;
              "
            >
              Transfer Confirmation
            </h1>

            <p
              style="
                font-size: 16px;
              "
            >
              Dear ${
                transfer.client_name ?? "Guest"
              },
            </p>

            <p
              style="
                font-size: 16px;
                line-height: 1.6;
              "
            >
              Thank you for booking your transfer
              with
              <strong>
                Nautilus Transfers
              </strong>.
              Please find your transfer details
              below.
            </p>

            <div
              style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                margin: 24px 0;
              "
            >

              <h2
                style="
                  font-size: 20px;
                  margin-top: 0;
                "
              >
                Transfer Details
              </h2>

              <p>
                <strong>Transfer:</strong>
                ${
                  transfer.transfer_number ??
                  "-"
                }
              </p>

              <p>
                <strong>Date:</strong>
                ${
                  transfer.date ??
                  "-"
                }
              </p>

              <p>
                <strong>Time:</strong>
                ${
                  transfer.time ??
                  "-"
                }
              </p>

              <p>
                <strong>Pickup:</strong>
                ${
                  transfer.pickup ??
                  "-"
                }
              </p>

              <p>
                <strong>Destination:</strong>
                ${
                  transfer.destination ??
                  "-"
                }
              </p>

              <p>
                <strong>Passengers:</strong>
                ${passengers}
                (${adults}
                adult${
                  adults !== 1
                    ? "s"
                    : ""
                }${
                  children > 0
                    ? `, ${children} child${
                        children !== 1
                          ? "ren"
                          : ""
                      }`
                    : ""
                })
              </p>

              ${
                seatParts.length > 0
                  ? `
                    <p>
                      <strong>
                        Child seats:
                      </strong>
                      ${seatParts.join(
                        ", "
                      )}
                    </p>
                  `
                  : ""
              }

              <p>
                <strong>Price:</strong>
                ${
                  price > 0
                    ? `€${price.toFixed(
                        2
                      )}`
                    : "On request"
                }
              </p>

            </div>

            <div
              style="
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                margin: 24px 0;
              "
            >

              <h2
                style="
                  font-size: 20px;
                  margin-top: 0;
                "
              >
                Driver & Vehicle
              </h2>

              <p>
                <strong>Driver:</strong>
                ${
                  driver?.name ??
                  "-"
                }
              </p>

              <p>
                <strong>Driver phone:</strong>
                ${
                  driver?.phone ??
                  "-"
                }
              </p>

              <p>
                <strong>Vehicle:</strong>
                ${
                  vehicle?.name ??
                  "-"
                }
              </p>

            </div>

            ${
              transfer.notes
                ? `
                  <div
                    style="
                      background: #fff7ed;
                      padding: 20px;
                      border-radius: 12px;
                      margin: 24px 0;
                    "
                  >

                    <h2
                      style="
                        font-size: 20px;
                        margin-top: 0;
                      "
                    >
                      Notes
                    </h2>

                    <p>
                      ${transfer.notes}
                    </p>

                  </div>
                `
                : ""
            }

            <p
              style="
                font-size: 16px;
                line-height: 1.6;
                margin-top: 30px;
              "
            >
              If you have any questions or need
              to make changes to your transfer,
              please contact us.
            </p>

            <p
              style="
                font-size: 16px;
                line-height: 1.6;
              "
            >
              We look forward to welcoming you.
            </p>

            <p
              style="
                font-size: 16px;
                line-height: 1.6;
              "
            >
              Best regards,<br />
              <strong>
                Nautilus Transfers
              </strong>
            </p>

            <hr
              style="
                margin: 30px 0;
                border: 0;
                border-top:
                  1px solid #e2e8f0;
              "
            />

            <p
              style="
                font-size: 12px;
                color: #64748b;
              "
            >
              Nautilus Transfers<br />
              Rovinj, Istria, Croatia
            </p>

          </div>
        `,
      });

    /*
     * =====================================================
     * RESEND ERROR
     * =====================================================
     */

    if (error) {
      console.error(
        "RESEND EMAIL ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    /*
     * =====================================================
     * MARK EMAIL AS SENT
     * =====================================================
     */

    const {
      error: updateError,
    } = await supabase
      .from("transfers")
      .update({
        guest_email_sent: true,
        guest_email_sent_at:
          new Date().toISOString(),
      })
      .eq("id", transferId);

    if (updateError) {
      console.error(
        "GUEST EMAIL STATUS UPDATE ERROR:",
        updateError
      );
    }

    /*
     * =====================================================
     * SUCCESS
     * =====================================================
     */

    return NextResponse.json({
      success: true,

      message:
        "Guest email confirmation sent",

      transferId,

      transferNumber:
        transfer.transfer_number,

      email:
        transfer.email,

      result: data,
    });
  } catch (error: unknown) {
    console.error(
      "========== GUEST EMAIL CONFIRMATION ERROR =========="
    );

    console.error(
      "Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to send guest email confirmation",
      },
      { status: 500 }
    );
  }
}