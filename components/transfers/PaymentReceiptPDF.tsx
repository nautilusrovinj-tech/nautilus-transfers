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
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "-";
  }

  return `€${number.toFixed(2)}`;
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

  doc.setTextColor(...COLORS.dark);
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

  doc.setTextColor(...COLORS.dark);
}

function drawValue(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth?: number,
  fontSize = 9.5
) {
  doc.setTextColor(...COLORS.dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  const lines = maxWidth
    ? doc.splitTextToSize(
        text,
        maxWidth
      )
    : [text];

  doc.text(
    lines,
    x,
    y
  );

  return lines.length;
}

function drawField(
  doc: jsPDF,
  label: string,
  text: string,
  x: number,
  y: number,
  width: number
) {
  drawLabel(
    doc,
    label,
    x,
    y
  );

  const lines = drawValue(
    doc,
    text,
    x,
    y + 5,
    width,
    9
  );

  return (
    y +
    5 +
    lines * 4
  );
}

export function generatePaymentReceiptPDF(
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
    pageWidth -
    margin * 2;

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

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(17);

  doc.text(
    COMPANY.name,
    margin,
    11
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.text(
    COMPANY.address,
    margin,
    18
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(7.5);

  doc.text(
    COMPANY.oib,
    margin,
    24
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(16);

  doc.text(
    "PAYMENT RECEIPT",
    pageWidth - margin,
    13,
    {
      align: "right",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

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
    `${value(
      transfer.date
    )}  •  ${value(
      transfer.time
    )}`,
    pageWidth - margin,
    27,
    {
      align: "right",
    }
  );

  doc.setFontSize(7);

  doc.text(
    "PAYMENT CONFIRMATION",
    pageWidth - margin,
    34,
    {
      align: "right",
    }
  );

  doc.setTextColor(...COLORS.dark);

  let y = 47;

  /*
   * PAID STATUS
   */

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
    27,
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

  doc.setFontSize(17);

  doc.text(
    "PAID",
    margin + 7,
    y + 11
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8.5);

  doc.text(
    "Transfer already paid",
    margin + 7,
    y + 18
  );

  doc.setTextColor(...COLORS.dark);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(15);

  doc.text(
    money(transfer.price),
    pageWidth - margin - 7,
    y + 12,
    {
      align: "right",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  doc.text(
    value(
      transfer.paymentMethod
    ),
    pageWidth - margin - 7,
    y + 19,
    {
      align: "right",
    }
  );

  y += 36;

  /*
   * CUSTOMER
   */

  drawSectionTitle(
    doc,
    "Customer",
    margin,
    y,
    contentWidth
  );

  y += 13;

  const half =
    contentWidth / 2 - 5;

  drawField(
    doc,
    "Guest",
    value(
      transfer.clientName
    ),
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Phone",
    value(
      transfer.phone
    ),
    margin + half + 10,
    y,
    half
  );

  y += 18;

  drawField(
    doc,
    "Email",
    value(
      transfer.email
    ),
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Transfer Number",
    value(
      transfer.transferNumber
    ),
    margin + half + 10,
    y,
    half
  );

  y += 21;

  /*
   * TRANSFER
   */

  drawSectionTitle(
    doc,
    "Transfer",
    margin,
    y,
    contentWidth
  );

  y += 13;

  drawField(
    doc,
    "Transfer Type",
    value(
      transfer.transferType
    ),
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Date & Time",
    `${value(
      transfer.date
    )} ${value(
      transfer.time
    )}`,
    margin + half + 10,
    y,
    half
  );

  y += 18;

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
    y + 6,
    contentWidth / 2 - 12,
    9.5
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(16);

  doc.setTextColor(
    ...COLORS.navy
  );

  doc.text(
    "→",
    pageWidth / 2,
    y + 8,
    {
      align: "center",
    }
  );

  drawLabel(
    doc,
    "Destination",
    margin +
      contentWidth / 2 +
      10,
    y
  );

  drawValue(
    doc,
    value(
      transfer.destination
    ),
    margin +
      contentWidth / 2 +
      10,
    y + 6,
    contentWidth / 2 - 10,
    9.5
  );

  doc.setTextColor(...COLORS.dark);

  y += 25;

  /*
   * PASSENGERS
   */

  drawSectionTitle(
    doc,
    "Passengers",
    margin,
    y,
    contentWidth
  );

  y += 13;

  const adults =
    Number(
      transfer.adults
    ) || 0;

  const children =
    Number(
      transfer.children
    ) || 0;

  const passengers =
    adults + children;

  const childSeats =
    Number(
      transfer.childSeats
    ) || 0;

  const babySeats =
    Number(
      transfer.babySeats
    ) || 0;

  const boosterSeats =
    Number(
      transfer.boosterSeats
    ) || 0;

  drawField(
    doc,
    "Passengers",
    `${passengers} total  •  ${adults} Adults  •  ${children} Children`,
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Child Seats",
    `${childSeats} Child  •  ${babySeats} Baby  •  ${boosterSeats} Booster`,
    margin + half + 10,
    y,
    half
  );

  y += 21;

  /*
   * SERVICE DETAILS
   */

  drawSectionTitle(
    doc,
    "Service Details",
    margin,
    y,
    contentWidth
  );

  y += 13;

  drawField(
    doc,
    "Driver",
    value(
      transfer.driver
    ),
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Vehicle",
    value(
      transfer.vehicle
    ),
    margin + half + 10,
    y,
    half
  );

  y += 18;

  drawField(
    doc,
    "Partner",
    value(
      transfer.partner
    ),
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Actual Kilometres",
    transfer.actualKilometers
      ? `${transfer.actualKilometers} km`
      : "-",
    margin + half + 10,
    y,
    half
  );

  y += 24;

  /*
   * PAYMENT SUMMARY
   */

  drawSectionTitle(
    doc,
    "Payment Summary",
    margin,
    y,
    contentWidth
  );

  y += 13;

  doc.setFillColor(
    ...COLORS.lightGray
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    25,
    2,
    2,
    "F"
  );

  doc.setTextColor(...COLORS.gray);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8);

  doc.text(
    "PAYMENT METHOD",
    margin + 6,
    y + 8
  );

  doc.text(
    "TOTAL PAID",
    pageWidth - margin - 6,
    y + 8,
    {
      align: "right",
    }
  );

  doc.setTextColor(...COLORS.dark);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

  doc.text(
    value(
      transfer.paymentMethod
    ),
    margin + 6,
    y + 17
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
    money(transfer.price),
    pageWidth - margin - 6,
    y + 17,
    {
      align: "right",
    }
  );

  y += 35;

  /*
   * PAYMENT CONFIRMATION
   */

  doc.setFillColor(
    ...COLORS.greenLight
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    18,
    2,
    2,
    "F"
  );

  doc.setTextColor(
    ...COLORS.green
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9.5);

  doc.text(
    "PAYMENT RECEIVED IN FULL",
    pageWidth / 2,
    y + 7,
    {
      align: "center",
    }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.text(
    "This document confirms payment for the transfer service.",
    pageWidth / 2,
    y + 13,
    {
      align: "center",
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
    pageWidth -
      margin -
      65,
    signatureY,
    pageWidth -
      margin,
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
    pageWidth -
      margin -
      65,
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
    pageHeight - 20,
    pageWidth - margin,
    pageHeight - 20
  );

  doc.setTextColor(
    ...COLORS.gray
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(6.8);

  doc.text(
    `${COMPANY.name} • ${COMPANY.address}`,
    margin,
    pageHeight - 13
  );

  doc.text(
    COMPANY.oib,
    margin,
    pageHeight - 8
  );

  doc.text(
    `Receipt ${value(
      transfer.transferNumber
    )}`,
    pageWidth - margin,
    pageHeight - 13,
    {
      align: "right",
    }
  );

  /*
   * SAVE
   */

  const transferNumber =
    value(
      transfer.transferNumber
    ).replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    );

  doc.save(
    `Payment-Receipt-${transferNumber}.pdf`
  );
}