"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getDriverByEmail } from "@/services/drivers";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login...");

      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log(
        "LOGIN DATA:",
        data
      );

      console.log(
        "LOGIN ERROR:",
        loginError
      );

      if (loginError) {
        console.error(loginError);

        setError(
          loginError.message
        );

        return;
      }

      if (!data.user) {
        setError(
          "Supabase did not return a user."
        );

        return;
      }

      const user = data.user;

      console.log(
        "LOGGED IN USER:",
        user.id
      );

      console.log(
        "USER EMAIL:",
        user.email
      );

      console.log(
        "USER METADATA:",
        user.user_metadata
      );

      /*
       * PARTNER LOGIN
       *
       * Partner accounts created through
       * the Partner management page have
       * partner_id in user metadata.
       */

      const partnerId =
        user.user_metadata
          ?.partner_id;

      if (partnerId) {
        console.log(
          "PARTNER LOGIN:",
          partnerId
        );

        localStorage.setItem(
          "role",
          "partner"
        );

        localStorage.setItem(
          "partnerId",
          partnerId
        );

        router.replace(
          "/partner"
        );

        router.refresh();

        return;
      }

      /*
       * DRIVER / DISPATCHER LOGIN
       *
       * If there is no partner_id,
       * continue with the existing
       * driver/dispatcher logic.
       */

      if (!user.email) {
        setError(
          "User email is missing."
        );

        return;
      }

      const driver =
        await getDriverByEmail(
          user.email
        );

      if (driver) {
        localStorage.setItem(
          "driver",
          JSON.stringify(driver)
        );

        localStorage.setItem(
          "role",
          driver.role ??
            "driver"
        );

        if (
          driver.role ===
          "dispatcher"
        ) {
          router.replace(
            "/dashboard"
          );
        } else {
          router.replace(
            "/driver"
          );
        }

        router.refresh();

        return;
      }

      /*
       * Unknown account
       */

      setError(
        "Your account is not connected to a driver, dispatcher, or partner profile."
      );
    } catch (err) {
      console.error(
        "LOGIN UNEXPECTED ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h1 className="mb-2 text-3xl font-bold">
          Nautilus Dispatch
        </h1>

        <p className="mb-8 text-slate-500">
          Sign in to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
}