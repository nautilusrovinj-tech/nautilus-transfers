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

/*
 * =====================================================
 * NAUTILUS COMPANY DATA
 * =====================================================
 */

const COMPANY = {
  name: "NAUTILUS GROUP d.o.o.",
  address:
    "Kurili 27, 52352 Kanfanar, Hrvatska",
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

  doc.setFont(
    "helvetica",
    "bold"
  );

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

  doc.setFont(
    "helvetica",
    "bold"
  );

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

  doc.setFont(
    "helvetica",
    "normal"
  );

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

export function generateTransferOrderPDF(
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
   * =====================================================
   * HEADER
   * =====================================================
   */

  doc.setFillColor(...COLORS.navy);

  doc.rect(
    0,
    0,
    pageWidth,
    40,
    "F"
  );

  /*
   * COMPANY NAME
   */

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

  /*
   * COMPANY ADDRESS
   */

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

  /*
   * OIB
   */

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

  /*
   * DOCUMENT TITLE
   */

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(16);

  doc.text(
    "TRANSFER ORDER",
    pageWidth - margin,
    13,
    {
      align: "right",
    }
  );

  /*
   * TRANSFER NUMBER
   */

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

  /*
   * DATE / TIME
   */

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

  /*
   * AGENCY LABEL
   */

  doc.setFontSize(7);

  doc.text(
    "PUTNIČKA AGENCIJA",
    pageWidth - margin,
    34,
    {
      align: "right",
    }
  );

  doc.setTextColor(...COLORS.dark);

  let y = 47;

  /*
   * =====================================================
   * STATUS / TYPE BAR
   * =====================================================
   */

  doc.setFillColor(
    ...COLORS.lightGray
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    15,
    2,
    2,
    "F"
  );

  const third =
    contentWidth / 3;

  drawLabel(
    doc,
    "Transfer Type",
    margin + 5,
    y + 5
  );

  drawValue(
    doc,
    value(
      transfer.transferType
    ),
    margin + 5,
    y + 10
  );

  drawLabel(
    doc,
    "Date & Time",
    margin +
      third +
      5,
    y + 5
  );

  drawValue(
    doc,
    `${value(
      transfer.date
    )}  ${value(
      transfer.time
    )}`,
    margin +
      third +
      5,
    y + 10
  );

  drawLabel(
    doc,
    "Status",
    margin +
      third * 2 +
      5,
    y + 5
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.text(
    value(transfer.status),
    margin +
      third * 2 +
      5,
    y + 10
  );

  y += 22;

  /*
   * =====================================================
   * PASSENGER
   * =====================================================
   */

  drawSectionTitle(
    doc,
    "Passenger",
    margin,
    y,
    contentWidth
  );

  y += 13;

  const half =
    contentWidth / 2 -
    5;

  drawField(
    doc,
    "Client",
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
    margin +
      half +
      10,
    y,
    half
  );

  y += 17;

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
    "Flight",
    value(
      transfer.flight
    ),
    margin +
      half +
      10,
    y,
    half
  );

  y += 17;

  const adults =
    Number(
      transfer.adults
    ) || 0;

  const children =
    Number(
      transfer.children
    ) || 0;

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
    `${adults} Adults  •  ${children} Children`,
    margin,
    y,
    half
  );

  drawField(
    doc,
    "Child Seats",
    `${childSeats} Child  •  ${babySeats} Baby  •  ${boosterSeats} Booster`,
    margin +
      half +
      10,
    y,
    half
  );

  y += 20;

  /*
   * =====================================================
   * JOURNEY
   * =====================================================
   */

  drawSectionTitle(
    doc,
    "Journey",
    margin,
    y,
    contentWidth
  );

  y += 13;

  const journeyWidth =
    contentWidth / 2 -
    10;

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
    journeyWidth,
    10
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
    journeyWidth,
    10
  );

  doc.setTextColor(
    ...COLORS.dark
  );

  y += 23;

  /*
   * =====================================================
   * DRIVER & VEHICLE
   * =====================================================
   */

  drawSectionTitle(
    doc,
    "Driver & Vehicle",
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
    margin +
      half +
      10,
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
    margin +
      half +
      10,
    y,
    half
  );

  y += 21;

  /*
   * =====================================================
   * PAYMENT
   * =====================================================
   */

  drawSectionTitle(
    doc,
    "Payment",
    margin,
    y,
    contentWidth
  );

  y += 11;

  const paymentHeight = 23;

  doc.setFillColor(
    ...COLORS.greenLight
  );

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    paymentHeight,
    2,
    2,
    "F"
  );

  doc.setDrawColor(
    ...COLORS.green
  );

  doc.setLineWidth(0.5);

  doc.roundedRect(
    margin,
    y,
    contentWidth,
    paymentHeight,
    2,
    2,
    "S"
  );

  doc.setTextColor(
    ...COLORS.green
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(12);

  doc.text(
    "TRANSFER ALREADY PAID",
    margin + 6,
    y + 9
  );

  doc.setTextColor(
    ...COLORS.dark
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  doc.text(
    "Payment confirmed",
    margin + 6,
    y + 16
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(11);

  doc.text(
    money(transfer.price),
    pageWidth -
      margin -
      6,
    y + 9,
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
    pageWidth -
      margin -
      6,
    y + 16,
    {
      align: "right",
    }
  );

  y +=
    paymentHeight +
    10;

  /*
   * =====================================================
   * NOTES
   * =====================================================
   */

  if (
    transfer.notes ||
    transfer.driverNote
  ) {
    drawSectionTitle(
      doc,
      "Notes",
      margin,
      y,
      contentWidth
    );

    y += 12;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8.5);

    if (transfer.notes) {
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Transfer:",
        margin,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      const lines =
        doc.splitTextToSize(
          value(
            transfer.notes
          ),
          contentWidth -
            23
        );

      doc.text(
        lines,
        margin + 22,
        y
      );

      y += Math.max(
        5,
        lines.length * 4
      );
    }

    if (
      transfer.driverNote
    ) {
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Driver:",
        margin,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      const lines =
        doc.splitTextToSize(
          value(
            transfer.driverNote
          ),
          contentWidth -
            20
        );

      doc.text(
        lines,
        margin + 19,
        y
      );

      y += Math.max(
        5,
        lines.length * 4
      );
    }
  }

  /*
   * =====================================================
   * SIGNATURE / STAMP
   * =====================================================
   *
   * Signature and stamp images will be inserted here.
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
   * =====================================================
   * FOOTER
   * =====================================================
   */

  doc.setDrawColor(
    ...COLORS.border
  );

  doc.line(
    margin,
    pageHeight - 20,
    pageWidth -
      margin,
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
    `Transfer ${value(
      transfer.transferNumber
    )}`,
    pageWidth -
      margin,
    pageHeight - 13,
    {
      align: "right",
    }
  );

  /*
   * =====================================================
   * SAVE
   * =====================================================
   */

  const transferNumber =
    value(
      transfer.transferNumber
    ).replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    );

  doc.save(
    `Transfer-Order-${transferNumber}.pdf`
  );
}