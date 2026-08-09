import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Transfers that need the first driver notification.
 *
 * Looks for:
 * - Assigned transfers
 * - driver_notified = false
 * - transfers within the next 48 hours
 */
export async function getTransfersToNotify() {
  const now = new Date();

  const end = new Date(
    now.getTime() +
      48 * 60 * 60 * 1000
  );

  const {
    data,
    error,
  } = await supabase
    .from("transfers")
    .select("*")
    .eq("status", "Assigned")
    .eq("driver_notified", false)
    .gte(
      "date",
      now.toISOString().slice(0, 10)
    )
    .lte(
      "date",
      end.toISOString().slice(0, 10)
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Transfers that need the 2-hour reminder.
 *
 * We retrieve assigned transfers that:
 * - already received the first notification
 * - have NOT received the 2-hour reminder
 * - are scheduled for today or tomorrow
 *
 * The actual 2-hour calculation is done in the
 * notification route.
 */
export async function getTransfersForReminder() {
  const now = new Date();

  const end = new Date(
    now.getTime() +
      24 * 60 * 60 * 1000
  );

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
    .gte(
      "date",
      now.toISOString().slice(0, 10)
    )
    .lte(
      "date",
      end.toISOString().slice(0, 10)
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Mark the first driver notification as sent.
 */
export async function markDriverNotified(
  id: string
) {
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