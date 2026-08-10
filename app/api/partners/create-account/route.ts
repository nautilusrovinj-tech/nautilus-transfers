import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { partnerId, password } = await request.json();

    if (!partnerId) {
      return NextResponse.json(
        {
          error: "Partner ID is required.",
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        {
          error: "Password is required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("CREATE / UPDATE PARTNER ACCOUNT");
    console.log("Partner ID:", partnerId);

    // Get partner
    const {
      data: partner,
      error: partnerError,
    } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .maybeSingle();

    if (partnerError) {
      return NextResponse.json(
        {
          error: partnerError.message,
          details: partnerError.details,
          hint: partnerError.hint,
          code: partnerError.code,
        },
        { status: 500 }
      );
    }

    if (!partner) {
      return NextResponse.json(
        {
          error: "Partner was not found.",
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

    const email = partner.email.trim();

    let userId: string;

    /*
     * EXISTING PARTNER ACCOUNT
     *
     * If the partner already has a user_id,
     * update the existing Supabase account
     * and set the new password.
     */
    if (partner.user_id) {
      console.log(
        "Updating existing auth user:",
        partner.user_id
      );

      const {
        data: updatedUser,
        error: updateUserError,
      } =
        await supabaseAdmin.auth.admin.updateUserById(
          partner.user_id,
          {
            password,
            email_confirm: true,
            user_metadata: {
              partner_id: partner.id,
              partner_name: partner.name,
            },
          }
        );

      if (updateUserError) {
        console.error(
          "Update auth user error:",
          updateUserError
        );

        return NextResponse.json(
          {
            error: updateUserError.message,
          },
          { status: 500 }
        );
      }

      if (!updatedUser.user) {
        return NextResponse.json(
          {
            error:
              "Supabase did not return the updated user.",
          },
          { status: 500 }
        );
      }

      userId = updatedUser.user.id;
    } else {
      /*
       * NEW PARTNER ACCOUNT
       *
       * Create the Supabase account directly.
       * No invitation email is sent.
       */
      console.log(
        "Creating new auth user:",
        email
      );

      const {
        data: createdUser,
        error: createUserError,
      } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            partner_id: partner.id,
            partner_name: partner.name,
          },
        });

      if (createUserError) {
        console.error(
          "Create auth user error:",
          createUserError
        );

        return NextResponse.json(
          {
            error: createUserError.message,
          },
          { status: 500 }
        );
      }

      if (!createdUser.user) {
        return NextResponse.json(
          {
            error:
              "Supabase did not return the created user.",
          },
          { status: 500 }
        );
      }

      userId = createdUser.user.id;

      /*
       * Connect Supabase user to partner
       */
      const {
        error: partnerUpdateError,
      } = await supabaseAdmin
        .from("partners")
        .update({
          user_id: userId,
        })
        .eq("id", partner.id);

      if (partnerUpdateError) {
        console.error(
          "Partner update error:",
          partnerUpdateError
        );

        return NextResponse.json(
          {
            error:
              partnerUpdateError.message,
            details:
              partnerUpdateError.details,
            hint:
              partnerUpdateError.hint,
            code:
              partnerUpdateError.code,
          },
          { status: 500 }
        );
      }
    }

    console.log(
      "Partner account ready:",
      userId
    );

    return NextResponse.json({
      success: true,
      userId,
      email,
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