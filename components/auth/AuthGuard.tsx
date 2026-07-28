"use client";

import { useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { getDriverByEmail } from "@/services/drivers";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      try {
        const driver =
          await getDriverByEmail(
            user.email!
          );

        const role =
          driver?.role ?? "driver";

        localStorage.setItem(
          "role",
          role
        );

        if (
          role === "driver" &&
          !pathname.startsWith("/driver")
        ) {
          router.replace("/driver");
          return;
        }

        if (
          role === "dispatcher" &&
          (pathname === "/" ||
            pathname === "/login")
        ) {
          router.replace("/dashboard");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    }

    void checkUser();
  }, [
    pathname,
    router,
    supabase,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}