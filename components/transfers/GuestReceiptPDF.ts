import jsPDF from "jspdf";

import { Transfer } from "@/types/transfer";

const COLORS = {
  navy: [20, 35, 55] as [number, number, number],
  dark: [35, 42, 50] as [number, number, number],
  gray: [105, 112, 120] as [number, number, number],
  lightGray: [242, 244, 247] as [number, number, number],
  border: [218, 222, 227] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [27, 110, 72] as [number, number, number],
  greenLight: [232, 247, 238] as [number, number, number],
};

const COMPANY = {
  name: "NAUTILUS GROUP d.o.o.",
  address: "Kurili 27, 52352 Kanfanar, Hrvatska",
  oib: "OIB: 32229554548",
};

function value(value: unknown): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value);
}

function money(value: unknown): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "€0.00";
  }

  return `€${amount.toFixed(2)}`;
}

function drawLabel(
  doc: jsPDF,
  label: string,
  x: number,
  y: number
) {
  doc.setTextColor(...COLORS.gray);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  doc.text(
    label.toUpperCase(),
    x,
    y
  );
}

function drawValue(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width?: number,
  fontSize = 9
) {
  doc.setTextColor(...COLORS.dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  const lines = width
    ? doc.splitTextToSize(text, width)
    : [text];

  doc.text(lines, x, y);

  return lines.length;
}

function drawSectionTitle(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  width: number
) {
  doc.setFillColor(...COLORS.navy);

  doc.roundedRect(
    x,
    y,
    width,
    7,
    1.5,
    1.5,
    "F"
  );

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  doc.text(
    title.toUpperCase(),
    x + 4,
    y + 4.8
  );
}

export function generateGuestReceiptPDF(
  transfer: Transfer
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const margin = 15;

  const contentWidth =
    pageWidth - margin * 2;

  /*
   * HEADER
   */

  doc.setFillColor(...COLORS.navy);

  doc.rect(
    0,
    0,
    pageWidth,
    40,
    "F"
  );

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);

  doc.text(
    COMPANY.name,
    margin,
    11
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  doc.text(
    COMPANY.address,
    margin,
    18
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    COMPANY.oib,
    margin,
    24
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(
    "RECEIPT",
    pageWidth - margin,
    13,
    {
      align: "right",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `No. ${value(
      transfer.transferNumber
    )}`,
    pageWidth - margin,
    21,
    {
      align: "right",
    }
  );

  doc.text(
    `Date: ${value(
      transfer.date
    )}`,
    pageWidth - margin,
    27,
    {
      align: "right",
    }
  );

  doc.setFontSize(7);

  doc.text(
    "TRANSPORT SERVICE",
    pageWidth - margin,
    34,
    {
      align: "right",
    }
  );

  /*
   * PAYMENT STATUS
   */

  let y = 48;

  doc.setFillColor(
    ...COLORS.greenLight
  );

  doc.setDrawColor(
    ...COLORS.green
  );

  doc.setLineWidth(0.5);

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    28,
    2,
    2,
    "FD"
  );

  doc.setTextColor(
    ...COLORS.green
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.text(
    "TRANSFER ALREADY PAID",
    pageWidth / 2,
    y + 10,
    {
      align: "center",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8.5);

  doc.text(
    "Payment confirmed",
    pageWidth / 2,
    y + 17,
    {
      align: "center",
    }
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(13);

  doc.text(
    money(transfer.price),
    pageWidth / 2,
    y + 24,
    {
      align: "center",
    }
  );

  doc.setTextColor(
    ...COLORS.dark
  );

  y += 38;

  /*
   * GUEST
   */

  drawSectionTitle(
    doc,
    "Guest",
    margin,
    y,
    contentWidth
  );

  y += 13;

  const half =
    contentWidth / 2 - 5;

  drawLabel(
    doc,
    "Guest Name",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.clientName
    ),
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Phone",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.phone
    ),
    margin + half + 10,
    y + 5,
    half
  );

  y += 18;

  drawLabel(
    doc,
    "Email",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.email
    ),
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Transfer Number",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.transferNumber
    ),
    margin + half + 10,
    y + 5,
    half
  );

  y += 22;

  /*
   * TRANSFER
   */

  drawSectionTitle(
    doc,
    "Transfer Details",
    margin,
    y,
    contentWidth
  );

  y += 13;

  drawLabel(
    doc,
    "Transfer Type",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.transferType
    ),
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Date & Time",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    `${value(
      transfer.date
    )}  ${value(
      transfer.time
    )}`,
    margin + half + 10,
    y + 5,
    half
  );

  y += 18;

  drawLabel(
    doc,
    "Passengers",
    margin,
    y
  );

  const adults =
    Number(
      transfer.adults ?? 0
    );

  const children =
    Number(
      transfer.children ?? 0
    );

  drawValue(
    doc,
    `${adults} Adult${
      adults !== 1 ? "s" : ""
    }${
      children > 0
        ? `, ${children} Child${
            children !== 1
              ? "ren"
              : ""
          }`
        : ""
    }`,
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Payment Method",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.paymentMethod
    ),
    margin + half + 10,
    y + 5,
    half
  );

  y += 22;

  /*
   * ROUTE
   */

  drawSectionTitle(
    doc,
    "Journey",
    margin,
    y,
    contentWidth
  );

  y += 13;

  drawLabel(
    doc,
    "Pickup",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.pickup
    ),
    margin,
    y + 5,
    half,
    9.5
  );

  drawLabel(
    doc,
    "Destination",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.destination
    ),
    margin + half + 10,
    y + 5,
    half,
    9.5
  );

  y += 24;

  /*
   * DRIVER / VEHICLE
   */

  drawSectionTitle(
    doc,
    "Service Information",
    margin,
    y,
    contentWidth
  );

  y += 13;

  drawLabel(
    doc,
    "Driver",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.driver
    ),
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Vehicle",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.vehicle
    ),
    margin + half + 10,
    y + 5,
    half
  );

  y += 18;

  drawLabel(
    doc,
    "Partner",
    margin,
    y
  );

  drawValue(
    doc,
    value(
      transfer.partner || "Direct"
    ),
    margin,
    y + 5,
    half
  );

  drawLabel(
    doc,
    "Flight",
    margin + half + 10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.flight
    ),
    margin + half + 10,
    y + 5,
    half
  );

  y += 25;

  /*
   * TOTAL
   */

  doc.setFillColor(
    ...COLORS.lightGray
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    24,
    2,
    2,
    "F"
  );

  doc.setTextColor(
    ...COLORS.gray
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.text(
    "TOTAL PAID",
    margin + 6,
    y + 8
  );

  doc.setTextColor(
    ...COLORS.dark
  );

  doc.setFontSize(18);

  doc.text(
    money(transfer.price),
    pageWidth - margin - 6,
    y + 11,
    {
      align: "right",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.text(
    "EUR",
    pageWidth - margin - 6,
    y + 18,
    {
      align: "right",
    }
  );

  /*
   * SIGNATURE / STAMP
   */

  const signatureY =
    pageHeight - 43;

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.setLineWidth(0.3);

  doc.line(
    margin,
    signatureY,
    margin + 65,
    signatureY
  );

  doc.line(
    pageWidth - margin - 65,
    signatureY,
    pageWidth - margin,
    signatureY
  );

  doc.setTextColor(
    ...COLORS.gray
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.text(
    "AUTHORIZED SIGNATURE",
    margin,
    signatureY + 5
  );

  doc.text(
    "COMPANY STAMP",
    pageWidth - margin - 65,
    signatureY + 5
  );

  /*
   * FOOTER
   */

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.line(
    margin,
    pageHeight - 18,
    pageWidth - margin,
    pageHeight - 18
  );

  doc.setTextColor(
    ...COLORS.gray
  );

  doc.setFontSize(7);

  doc.text(
    COMPANY.name,
    margin,
    pageHeight - 12
  );

  doc.text(
    COMPANY.oib,
    pageWidth - margin,
    pageHeight - 12,
    {
      align: "right",
    }
  );

  /*
   * DOWNLOAD
   */

  const filename =
    `Receipt-${value(
      transfer.transferNumber
    )}.pdf`;

  doc.save(filename);
}