import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { createClient } from "@supabase/supabase-js";

import { readExcel } from "./excelReader";
import { mapTransfer } from "./mapper";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("Reading Excel...");

  const rows = readExcel("TRANSFERI2026 Copy.xlsx");

  console.log(`Found ${rows.length} rows`);

  const transfers = rows.map(mapTransfer);

  console.log("Importing...");

  const batchSize = 100;
  let imported = 0;

  for (let i = 0; i < transfers.length; i += batchSize) {
    const batch = transfers.slice(i, i + batchSize);

    const { error } = await supabase
      .from("transfers")
      .insert(
        batch.map((t) => ({
          id: t.id,

          transfer_number: t.transferNumber,
          transfer_type: t.transferType,

          client_name: t.clientName,

          phone: t.phone,
          email: t.email,

          date: t.date,
          time: t.time,

          pickup: t.pickup,
          destination: t.destination,

          flight: t.flight,

          adults: t.adults,
          children: t.children,
          baby_seats: t.babySeats,
          booster_seats: t.boosterSeats,

          driver: t.driver,
          vehicle: t.vehicle,
          partner: t.partner,

          driver_id: null,
          vehicle_id: null,
          partner_id: null,

          price: t.price,

          status: t.status,

          notes: t.notes,
        }))
      );

    if (error) {
      console.error("Import failed:");
      console.error(error);
      process.exit(1);
    }

    imported += batch.length;

    console.log(
      `${imported}/${transfers.length} imported`
    );
  }

  console.log("✅ Import completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});