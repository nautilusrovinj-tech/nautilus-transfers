import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Transfer } from "@/types/transfer";

export function exportTransfers(
  transfers: Transfer[],
  filename = "Transfers"
) {
  const rows = transfers.map((t) => ({
    "Transfer No": t.transferNumber,
    Date: t.date,
    Time: t.time,
    Client: t.clientName,
    Phone: t.phone,
    Flight: t.flight,
    Pickup: t.pickup,
    Destination: t.destination,
    Driver: t.driver,
    Vehicle: t.vehicle,
    Partner: t.partner,
    Adults: t.adults,
    Children: t.children,
    Price: t.price,
    Status: t.status,
    Notes: t.notes,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Transfers"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(
    file,
    `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}