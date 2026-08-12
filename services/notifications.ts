import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Get today's date in Croatia.
 *
 * This avoids using UTC date directly, because the business
 * operates in Europe/Zagreb timezone.
 */
function getCroatiaDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Get a date N days from today in Croatia.
 */
function getCroatiaDatePlusDays(days: number): string {
  const now = new Date();

  const dateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zagreb",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

/**
 * =====================================================
 * FIRST DRIVER NOTIFICATION
 * =====================================================
 *
 * Finds transfers that:
 *
 * - are Assigned
 * - have a driver
 * - have NOT yet received the first notification
 * - are scheduled today through the next 2 days
 *
 * IMPORTANT:
 *
 * driver_notified can be FALSE or NULL.
 * Older transfers may have NULL instead of FALSE.
 */
export async function getTransfersToNotify() {
  const startDate =
    getCroatiaDate();

  const endDate =
    getCroatiaDatePlusDays(2);

  console.log(
    "================================"
  );

  console.log(
    "GET TRANSFERS TO NOTIFY"
  );

  console.log(
    "Date range:",
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
    .or(
      "driver_notified.eq.false,driver_notified.is.null"
    )
    .not("driver_id", "is", null)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", {
      ascending: true,
    })
    .order("time", {
      ascending: true,
    });

  if (error) {
    console.error(
      "GET TRANSFERS TO NOTIFY ERROR:",
      error.message
    );

    throw error;
  }

  console.log(
    "Transfers found:",
    data?.length ?? 0
  );

  if (data) {
    for (const transfer of data) {
      console.log(
        "Transfer:",
        transfer.transfer_number,
        "| status:",
        transfer.status,
        "| driver:",
        transfer.driver_id,
        "| notified:",
        transfer.driver_notified
      );
    }
  }

  console.log(
    "================================"
  );

  return data ?? [];
}

/**
 * =====================================================
 * 2-HOUR REMINDER
 * =====================================================
 *
 * Finds transfers that:
 *
 * - are Assigned
 * - have a driver
 * - already received the first notification
 * - have NOT received the reminder
 * - are scheduled today or tomorrow
 *
 * The actual 2-hour calculation is handled
 * inside /api/notifications/run.
 */
export async function getTransfersForReminder() {
  const startDate =
    getCroatiaDate();

  const endDate =
    getCroatiaDatePlusDays(1);

  console.log(
    "================================"
  );

  console.log(
    "GET TRANSFERS FOR REMINDER"
  );

  console.log(
    "Date range:",
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
    .eq("driver_notified", true)
    .or(
      "driver_reminder_notified.eq.false,driver_reminder_notified.is.null"
    )
    .not("driver_id", "is", null)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", {
      ascending: true,
    })
    .order("time", {
      ascending: true,
    });

  if (error) {
    console.error(
      "GET TRANSFERS FOR REMINDER ERROR:",
      error.message
    );

    throw error;
  }

  console.log(
    "Potential reminders:",
    data?.length ?? 0
  );

  if (data) {
    for (const transfer of data) {
      console.log(
        "Reminder candidate:",
        transfer.transfer_number,
        "|",
        transfer.date,
        transfer.time,
        "| notified:",
        transfer.driver_notified,
        "| reminder:",
        transfer.driver_reminder_notified
      );
    }
  }

  console.log(
    "================================"
  );

  return data ?? [];
}

/**
 * =====================================================
 * MARK FIRST DRIVER NOTIFICATION
 * =====================================================
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
    console.error(
      "MARK DRIVER NOTIFIED ERROR:",
      error.message
    );

    throw error;
  }

  console.log(
    "Driver notification marked as sent:",
    id
  );
}

/**
 * =====================================================
 * MARK 2-HOUR REMINDER
 * =====================================================
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
    console.error(
      "MARK DRIVER REMINDER ERROR:",
      error.message
    );

    throw error;
  }

  console.log(
    "Driver reminder marked as sent:",
    id
  );
}