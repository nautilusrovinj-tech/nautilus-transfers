import * as XLSX from "xlsx";

export interface ExcelTransferRow {
  month: string;
  date: string;
  time: string;
  pax: string;
  client: string;
  pickup: string;
  destination: string;
  flight: string;
  price: string;
  vehicle: string;
  partner: string;
  driver: string;
}

export function readExcel(filePath: string): ExcelTransferRow[] {
  const workbook = XLSX.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    defval: "",
  });

  const transfers: ExcelTransferRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (!row || row.length === 0) continue;

    const client = String(row[6] ?? "").trim();

    if (!client) continue;

    transfers.push({
      month: String(row[0] ?? "").trim(),
      date: String(row[1] ?? "").trim(),
    
      time: String(row[4] ?? "").trim(),
      pax: String(row[5] ?? "").trim(),
    
      client: String(row[6] ?? "").trim(),
    
      pickup: String(row[7] ?? "").trim(),
      destination: String(row[8] ?? "").trim(),
    
      flight: String(row[9] ?? "").trim(),
    
      price: String(row[10] ?? "").trim(),
    
      vehicle: String(row[11] ?? "").trim(),
      partner: String(row[12] ?? "").trim(),
    
      driver: String(row[13] ?? "").trim(),
    });
  }

  return transfers;
}