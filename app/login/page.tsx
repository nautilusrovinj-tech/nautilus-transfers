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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login...");

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("LOGIN DATA:", data);
      console.log("LOGIN ERROR:", error);

      if (error) {
        console.error(error);
        alert(error.message);
        setError(error.message);
        return;
      }

      if (!data.user) {
        alert("Supabase did not return a user.");
        return;
      }

      const driver = await getDriverByEmail(
        data.user.email!
      );

      if (driver) {
        localStorage.setItem(
          "driver",
          JSON.stringify(driver)
        );

        localStorage.setItem(
          "role",
          driver.role ?? "driver"
        );

        if (driver.role === "dispatcher") {
          router.replace("/dashboard");
        } else {
          router.replace("/driver");
        }
      } else {
        localStorage.setItem("role", "driver");
        router.replace("/driver");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

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
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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