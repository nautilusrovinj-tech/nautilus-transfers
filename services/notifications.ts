import { createClient } from "@/lib/supabase/server";

/**
 * Transfers that need the first driver notification.
 *
 * Looks for:
 * - Assigned transfers
 * - driver_notified = false
 * - transfers within the next 48 hours
 */
export async function getTransfersToNotify() {
  const supabase = await createClient();

  const now = new Date();

  const end = new Date(
    now.getTime() +
      48 * 60 * 60 * 1000
  );

  const startDate =
    now.toISOString().slice(0, 10);

  const endDate =
    end.toISOString().slice(0, 10);

  console.log(
    "NOTIFICATION DATE RANGE:",
    startDate,
    "→",
    endDate
  );

  const {
    data,
    error,
  } = await supabase
    .from("transfers")
    .select("*")
    .eq("status", "Assigned")
    .eq("driver_notified", false)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error(
      "GET TRANSFERS TO NOTIFY ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "GET TRANSFERS TO NOTIFY RESULT:",
    data?.length ?? 0
  );

  return data ?? [];
}

/**
 * Transfers that need the 2-hour reminder.
 */
export async function getTransfersForReminder() {
  const supabase = await createClient();

  const now = new Date();

  const end = new Date(
    now.getTime() +
      24 * 60 * 60 * 1000
  );

  const startDate =
    now.toISOString().slice(0, 10);

  const endDate =
    end.toISOString().slice(0, 10);

  const {
    data,
    error,
  } = await supabase
    .from("transfers")
    .select("*")
    .eq("status", "Assigned")
    .eq("driver_notified", true)
    .eq(
      "driver_reminder_notified",
      false
    )
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error(
      "GET REMINDER TRANSFERS ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "GET REMINDER TRANSFERS RESULT:",
    data?.length ?? 0
  );

  return data ?? [];
}

/**
 * Mark the first driver notification as sent.
 */
export async function markDriverNotified(
  id: string
) {
  const supabase = await createClient();

  const {
    error,
  } = await supabase
    .from("transfers")
    .update({
      driver_notified: true,
      driver_notified_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * Mark the 2-hour reminder as sent.
 */
export async function markDriverReminderNotified(
  id: string
) {
  const supabase = await createClient();

  const {
    error,
  } = await supabase
    .from("transfers")
    .update({
      driver_reminder_notified: true,
      driver_reminder_notified_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}