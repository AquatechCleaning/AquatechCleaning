import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { formatCurrency } from "./format";
import { IQuote } from "./models/Quote";
import { LineItem } from "./pricing";

type QuoteParty = {
  name: string;
  vatNumber?: string;
  regNumber?: string;
  postalAddress?: string;
  physicalAddress?: string;
};

type QuoteMeta = {
  quoteNumber: string;
  reference: string;
  date: Date;
  dueDate: Date;
  salesRep?: string;
  discountPercent?: number;
};

const formatTypeLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatPercent = (value: number) => `${value.toFixed(2)}%`;
const formatDate = (value: Date) => value.toLocaleDateString("en-ZA");

const splitAddress = (value?: string) => {
  if (!value) return [];
  if (value.includes("\n")) {
    return value.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  return value
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
};

const fallbackText = (value?: string, placeholder = "TBC") => (value && value.trim() ? value : placeholder);

const formatAddressInline = (value?: string) => {
  const lines = splitAddress(value);
  if (lines.length === 0) return fallbackText(value);
  return lines.join(", ");
};

const fetchImageBuffer = async (url?: string) => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
};

export async function generateQuotePdf({
  quote,
  lineItems,
  vatIncluded = false,
  vatAmount = 0,
  vatRate = 0.15,
  from,
  to,
  meta,
  logoPath,
}: {
  quote: IQuote;
  lineItems: LineItem[];
  vatIncluded?: boolean;
  vatAmount?: number;
  vatRate?: number;
  from: QuoteParty;
  to: QuoteParty;
  meta: QuoteMeta;
  logoPath?: string;
}) {
  const mapImageBuffer = await fetchImageBuffer(quote.mapImageUrl);
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const buffers: Uint8Array[] = [];

  doc.on("data", buffers.push.bind(buffers));

  const pageWidth = doc.page.width;
  const margin = doc.page.margins.left;
  const contentWidth = pageWidth - margin * 2;

  const logoFile =
    logoPath && fs.existsSync(logoPath)
      ? logoPath
      : path.join(process.cwd(), "public", "branding", "quote-logo.png");

  if (fs.existsSync(logoFile)) {
    doc.image(logoFile, margin, margin, { width: 110 });
  } else {
    doc.fontSize(16).text("Aquatech Cleaning", margin, margin + 10);
  }

  doc.font("Helvetica-Bold").fontSize(22).text("QUOTE", margin, margin + 10, {
    align: "right",
  });

  const metaStartY = margin + 50;
  const metaWidth = 200;
  const metaX = pageWidth - margin - metaWidth;
  const metaRowHeight = 16;
  const metaLabelWidth = 110;

  const metaRows: Array<[string, string]> = [
    ["NUMBER:", meta.quoteNumber],
    ["REFERENCE:", meta.reference],
    ["DATE:", formatDate(meta.date)],
    ["DUE DATE:", formatDate(meta.dueDate)],
    ["SALES REP:", fallbackText(meta.salesRep, "-")],
    ["OVERALL DISCOUNT %:", formatPercent(meta.discountPercent ?? 0)],
    ["PAGE:", "1/1"],
  ];
  metaRows.forEach(([label, value], index) => {
    const y = metaStartY + metaRowHeight * index;
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(label, metaX, y);
    doc.font("Helvetica-Bold").fillColor("#111827").text(value, metaX + metaLabelWidth, y, {
      width: metaWidth - metaLabelWidth,
      align: "right",
    });
  });

  const headerBottom = Math.max(margin + 115, metaStartY + metaRowHeight * metaRows.length) + 24;
  const columnGap = 30;
  const columnWidth = (contentWidth - columnGap) / 2;
  const leftX = margin;
  const rightX = margin + columnWidth + columnGap;
  let currentY = headerBottom;

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#9ca3af").text("FROM", leftX, currentY);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#9ca3af").text("TO", rightX, currentY);
  currentY += 14;

  doc.font("Helvetica-Bold").fontSize(14).fillColor("#111827").text(from.name, leftX, currentY, {
    width: columnWidth,
  });
  doc.font("Helvetica-Bold").fontSize(14).text(to.name, rightX, currentY, {
    width: columnWidth,
    underline: true,
  });
  currentY += 26;

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("VAT NO:", leftX, currentY);
  doc.font("Helvetica").fillColor("#111827").text(fallbackText(from.vatNumber, "-"), leftX + 60, currentY);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("CUSTOMER VAT NO:", rightX, currentY);
  doc
    .font("Helvetica")
    .fillColor("#111827")
    .text(fallbackText(to.vatNumber, "-"), rightX + 110, currentY);
  currentY += 18;

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("REG NO:", leftX, currentY);
  doc.font("Helvetica").fillColor("#111827").text(fallbackText(from.regNumber, "-"), leftX + 60, currentY);
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("CUSTOMER REG NO:", rightX, currentY);
  doc
    .font("Helvetica")
    .fillColor("#111827")
    .text(fallbackText(to.regNumber, "-"), rightX + 120, currentY);
  currentY += 22;

  const addressLabelY = currentY;
  const subColumnGap = 12;
  const subColumnWidth = (columnWidth - subColumnGap) / 2;

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("POSTAL ADDRESS:", leftX, addressLabelY);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#6b7280")
    .text("PHYSICAL ADDRESS:", leftX + subColumnWidth + subColumnGap, addressLabelY);

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6b7280").text("POSTAL ADDRESS:", rightX, addressLabelY);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#6b7280")
    .text("PHYSICAL ADDRESS:", rightX + subColumnWidth + subColumnGap, addressLabelY);

  const addressY = addressLabelY + 12;
  const fromPostalLines = splitAddress(from.postalAddress);
  const fromPhysicalLines = splitAddress(from.physicalAddress);
  const toPostalLines = splitAddress(to.postalAddress);
  const toPhysicalLines = splitAddress(to.physicalAddress);

  const drawAddress = (x: number, y: number, lines: string[], fallback: string) => {
    const text = lines.length ? lines.join("\n") : fallback;
    doc.font("Helvetica").fontSize(9).fillColor("#111827").text(text, x, y, {
      width: subColumnWidth,
    });
  };

  drawAddress(leftX, addressY, fromPostalLines, fallbackText(from.postalAddress));
  drawAddress(leftX + subColumnWidth + subColumnGap, addressY, fromPhysicalLines, fallbackText(from.physicalAddress));
  drawAddress(rightX, addressY, toPostalLines, fallbackText(to.postalAddress));
  drawAddress(rightX + subColumnWidth + subColumnGap, addressY, toPhysicalLines, fallbackText(to.physicalAddress));

  const addressBlockHeight = 70;
  currentY = addressY + addressBlockHeight;

  doc.moveTo(margin, currentY).lineTo(pageWidth - margin, currentY).strokeColor("#d1d5db").stroke();
  currentY += 12;

  const columns = [
    { label: "Description", width: 170, align: "left" as const },
    { label: "Quantity", width: 40, align: "right" as const },
    { label: "Unit Price", width: 70, align: "right" as const },
    { label: "Disc %", width: 45, align: "right" as const },
    { label: "VAT %", width: 45, align: "right" as const },
    { label: "Excl. Total", width: 70, align: "right" as const },
    { label: "Incl. Total", width: 75, align: "right" as const },
  ];

  doc.font("Helvetica-Oblique").fontSize(9).fillColor("#6b7280");
  let colX = margin;
  columns.forEach((col) => {
    doc.text(col.label, colX, currentY, { width: col.width, align: col.align });
    colX += col.width;
  });

  currentY += 16;
  doc.moveTo(margin, currentY).lineTo(pageWidth - margin, currentY).strokeColor("#e5e7eb").stroke();
  currentY += 12;

  doc.font("Helvetica").fontSize(10).fillColor("#111827");
  lineItems.forEach((item, index) => {
    const quantity = 1;
    const unitPrice = item.amount;
    const discountPercent = 0;
    const vatPercent = vatIncluded ? vatRate * 100 : 0;
    const exclTotal = item.amount;
    const inclTotal = vatIncluded ? item.amount + item.amount * vatRate : item.amount;

    colX = margin;
    const description = `${String(index + 1).padStart(3, "0")} - ${formatTypeLabel(item.type)}`;
    const rowValues = [
      { value: description, width: columns[0].width, align: "left" as const },
      { value: quantity.toString(), width: columns[1].width, align: "right" as const },
      { value: formatCurrency(unitPrice), width: columns[2].width, align: "right" as const },
      { value: formatPercent(discountPercent), width: columns[3].width, align: "right" as const },
      { value: formatPercent(vatPercent), width: columns[4].width, align: "right" as const },
      { value: formatCurrency(exclTotal), width: columns[5].width, align: "right" as const },
      { value: formatCurrency(inclTotal), width: columns[6].width, align: "right" as const },
    ];

    rowValues.forEach((cell) => {
      doc.text(cell.value, colX, currentY, { width: cell.width, align: cell.align });
      colX += cell.width;
    });

    currentY += 18;
    doc.moveTo(margin, currentY).lineTo(pageWidth - margin, currentY).strokeColor("#f3f4f6").stroke();
    currentY += 6;
  });

  if (mapImageBuffer) {
    currentY += 12;
    const mapHeight = 145;
    if (currentY + mapHeight + 32 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      currentY = doc.page.margins.top;
    }

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text("Property Map Snapshot", margin, currentY);
    currentY += 14;
    doc.image(mapImageBuffer, margin, currentY, {
      fit: [contentWidth, mapHeight],
      align: "center",
      valign: "center",
    });
    currentY += mapHeight + 8;
  }

  if (quote.notes) {
    currentY += 10;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text("Notes", margin, currentY);
    currentY += 12;
    doc.font("Helvetica").fontSize(9).fillColor("#4b5563").text(quote.notes, margin, currentY, {
      width: contentWidth,
    });
  }

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers.map((b) => Buffer.from(b)));
      resolve(pdfBuffer);
    });
  });
}


