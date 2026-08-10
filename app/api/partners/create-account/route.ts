import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  request: NextRequest
) {
  try {
    const { partnerId } =
      await request.json();

    if (!partnerId) {
      return NextResponse.json(
        {
          error:
            "Partner ID is required.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        },
        { status: 500 }
      );
    }

    if (!serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "SUPABASE_SERVICE_ROLE_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    console.log(
      "CREATE PARTNER ACCOUNT"
    );

    console.log(
      "Partner ID:",
      partnerId
    );

    // Get partner
    const {
      data: partner,
      error: partnerError,
    } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .maybeSingle();

    console.log(
      "Partner:",
      partner
    );

    console.log(
      "Partner error:",
      partnerError
    );

    if (partnerError) {
      return NextResponse.json(
        {
          error:
            partnerError.message,
          details:
            partnerError.details,
          hint:
            partnerError.hint,
          code:
            partnerError.code,
        },
        { status: 500 }
      );
    }

    if (!partner) {
      return NextResponse.json(
        {
          error:
            "Partner was not found.",
          partnerId,
        },
        { status: 404 }
      );
    }

    if (!partner.email?.trim()) {
      return NextResponse.json(
        {
          error:
            "Partner must have an email address.",
        },
        { status: 400 }
      );
    }

    if (partner.user_id) {
      return NextResponse.json(
        {
          error:
            "This partner already has a portal account.",
        },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ??
      new URL(request.url).origin;

    const redirectTo =
      `${origin}/partner`;

    console.log(
      "Sending invitation to:",
      partner.email
    );

    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin
        .inviteUserByEmail(
          partner.email.trim(),
          {
            data: {
              partner_id:
                partner.id,

              partner_name:
                partner.name,
            },

            redirectTo,
          }
        );

    if (error) {
      console.error(
        "Invite error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          error:
            "Supabase did not return the invited user.",
        },
        { status: 500 }
      );
    }

    console.log(
      "Auth user created:",
      data.user.id
    );

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("partners")
      .update({
        user_id:
          data.user.id,
      })
      .eq(
        "id",
        partner.id
      );

    if (updateError) {
      console.error(
        "Partner update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            updateError.message,
          details:
            updateError.details,
          hint:
            updateError.hint,
          code:
            updateError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId:
        data.user.id,
    });
  } catch (error) {
    console.error(
      "Create partner account error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create partner account.",
      },
      { status: 500 }
    );
  }
}