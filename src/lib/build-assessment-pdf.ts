import { readFile } from "fs/promises";
import path from "path";
import {
  PDFArray,
  PDFDocument,
  PDFName,
  PDFString,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import { company } from "@/data/company";
import type { EligibilityAssessment } from "@/lib/eligibility-assessment";

type PdfInput = Pick<
  EligibilityAssessment,
  "id" | "confidenceScore" | "summary" | "improvements" | "nextSteps"
> & {
  contactName?: string;
};

const PAGE: [number, number] = [595.28, 841.89]; // A4
const MARGIN = 48;
const CONTENT_WIDTH = PAGE[0] - MARGIN * 2;

const brand = rgb(1, 0.333, 0); // #FF5500
const ink = rgb(0.09, 0.09, 0.09);
const muted = rgb(0.38, 0.38, 0.4);
const soft = rgb(0.96, 0.96, 0.97);
const white = rgb(1, 1, 1);
const rule = rgb(0.9, 0.9, 0.91);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function discoveryCallUrl() {
  if (process.env.NEXT_PUBLIC_CALENDLY_URL) {
    return process.env.NEXT_PUBLIC_CALENDLY_URL;
  }
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? company.website
  ).replace(/\/$/, "");
  return `${base}/consultation`;
}

function addLink(
  doc: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string
) {
  const annot = doc.context.register(
    doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    })
  );

  const annotsKey = PDFName.of("Annots");
  const existing = page.node.lookup(annotsKey);
  if (existing instanceof PDFArray) {
    existing.push(annot);
  } else {
    page.node.set(annotsKey, doc.context.obj([annot]));
  }
}

export async function buildAssessmentPdf(data: PdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  let page = doc.addPage(PAGE);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let logo;
  try {
    const logoBytes = await readFile(
      path.join(process.cwd(), "public", "logo.png")
    );
    logo = await doc.embedPng(logoBytes);
  } catch {
    logo = undefined;
  }

  let y = PAGE[1] - MARGIN;

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN + 56) {
      drawFooter(page, font);
      page = doc.addPage(PAGE);
      y = PAGE[1] - MARGIN;
    }
  }

  function drawLines(
    text: string,
    opts: {
      size?: number;
      bold?: boolean;
      color?: RGB;
      gap?: number;
      x?: number;
      maxWidth?: number;
      lineHeight?: number;
    } = {}
  ) {
    const size = opts.size ?? 11;
    const used = opts.bold ? fontBold : font;
    const color = opts.color ?? ink;
    const x = opts.x ?? MARGIN;
    const maxW = opts.maxWidth ?? CONTENT_WIDTH;
    const lh = opts.lineHeight ?? size * 1.45;
    const lines = wrapText(text, used, size, maxW);

    for (const line of lines) {
      ensureSpace(lh + 2);
      page.drawText(line, { x, y, size, font: used, color });
      y -= lh;
    }
    y -= opts.gap ?? 0;
  }

  // ——— Header band ———
  page.drawRectangle({
    x: 0,
    y: PAGE[1] - 108,
    width: PAGE[0],
    height: 108,
    color: soft,
  });
  page.drawRectangle({
    x: 0,
    y: PAGE[1] - 111,
    width: PAGE[0],
    height: 3,
    color: brand,
  });

  if (logo) {
    const logoH = 26;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE[1] - 48,
      width: logoW,
      height: logoH,
    });
  } else {
    page.drawText(company.name, {
      x: MARGIN,
      y: PAGE[1] - 42,
      size: 18,
      font: fontBold,
      color: ink,
    });
  }

  page.drawText("Eligibility Assessment Report", {
    x: MARGIN,
    y: PAGE[1] - 68,
    size: 10,
    font: fontBold,
    color: brand,
  });

  // Contact block — top right
  const contactLines = [
    company.phone,
    company.email,
    company.address,
  ];
  let cy = PAGE[1] - 36;
  for (const line of contactLines) {
    const w = font.widthOfTextAtSize(line, 8.5);
    page.drawText(line, {
      x: PAGE[0] - MARGIN - w,
      y: cy,
      size: 8.5,
      font,
      color: muted,
    });
    cy -= 12;
  }

  y = PAGE[1] - 140;

  // Meta
  drawLines(
    data.contactName
      ? `Prepared for ${data.contactName}`
      : "Prepared for candidate",
    { size: 12, bold: true, gap: 4 }
  );
  drawLines(`Assessment ID  ·  ${data.id}`, {
    size: 9,
    color: muted,
    gap: 18,
  });

  // Score card
  const cardH = 88;
  ensureSpace(cardH + 16);
  page.drawRectangle({
    x: MARGIN,
    y: y - cardH + 18,
    width: CONTENT_WIDTH,
    height: cardH,
    color: soft,
    borderColor: rule,
    borderWidth: 1,
  });
  // left accent
  page.drawRectangle({
    x: MARGIN,
    y: y - cardH + 18,
    width: 4,
    height: cardH,
    color: brand,
  });

  page.drawText("Confidence score", {
    x: MARGIN + 20,
    y: y - 8,
    size: 10,
    font: fontBold,
    color: muted,
  });
  page.drawText(`${data.confidenceScore}`, {
    x: MARGIN + 20,
    y: y - 48,
    size: 36,
    font: fontBold,
    color: brand,
  });
  const scoreW = fontBold.widthOfTextAtSize(`${data.confidenceScore}`, 36);
  page.drawText("/ 100", {
    x: MARGIN + 20 + scoreW + 6,
    y: y - 42,
    size: 14,
    font,
    color: muted,
  });

  page.drawText("Indicative readiness for Stage 1 endorsement", {
    x: MARGIN + 180,
    y: y - 36,
    size: 10,
    font,
    color: muted,
  });

  y -= cardH + 28;

  // Summary
  drawLines("Summary", { size: 13, bold: true, gap: 8 });
  drawLines(data.summary, {
    size: 10.5,
    color: muted,
    gap: 20,
    lineHeight: 15,
  });

  // Improvements
  drawLines("Improvements", { size: 13, bold: true, gap: 10 });
  for (const item of data.improvements) {
    ensureSpace(28);
    page.drawCircle({
      x: MARGIN + 4,
      y: y + 3,
      size: 2.5,
      color: brand,
    });
    drawLines(item, {
      size: 10.5,
      color: muted,
      x: MARGIN + 14,
      maxWidth: CONTENT_WIDTH - 14,
      gap: 8,
      lineHeight: 14.5,
    });
  }
  y -= 8;

  // Next steps (skip discovery-call bullet — shown as CTA)
  const steps = data.nextSteps.filter(
    (s) => !/discovery call/i.test(s) && !/book a free/i.test(s)
  );
  drawLines("Next steps", { size: 13, bold: true, gap: 10 });
  for (const item of steps) {
    ensureSpace(28);
    page.drawCircle({
      x: MARGIN + 4,
      y: y + 3,
      size: 2.5,
      color: brand,
    });
    drawLines(item, {
      size: 10.5,
      color: muted,
      x: MARGIN + 14,
      maxWidth: CONTENT_WIDTH - 14,
      gap: 8,
      lineHeight: 14.5,
    });
  }

  // Primary CTA button
  y -= 18;
  const btnLabel = "Book a discovery call";
  const btnPadX = 22;
  const btnH = 36;
  const btnTextSize = 11;
  const btnTextW = fontBold.widthOfTextAtSize(btnLabel, btnTextSize);
  const btnW = Math.min(CONTENT_WIDTH, btnTextW + btnPadX * 2);

  ensureSpace(btnH + 40);
  const btnX = MARGIN;
  const btnY = y - btnH + 10;

  page.drawRectangle({
    x: btnX,
    y: btnY,
    width: btnW,
    height: btnH,
    color: brand,
  });
  // soft corner illusion via overlapping — pdf-lib has no radius; keep sharp premium pill look approx
  page.drawText(btnLabel, {
    x: btnX + (btnW - btnTextW) / 2,
    y: btnY + (btnH - btnTextSize) / 2 - 1,
    size: btnTextSize,
    font: fontBold,
    color: white,
  });
  addLink(doc, page, btnX, btnY, btnW, btnH, discoveryCallUrl());

  y = btnY - 28;

  drawLines(
    "Free 15-minute call · Review your score and evidence plan with our team",
    { size: 8.5, color: muted, gap: 0 }
  );

  drawFooter(page, font);
  return doc.save();
}

function drawFooter(page: PDFPage, font: PDFFont) {
  const footerY = 28;
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE[0],
    height: 52,
    color: soft,
  });
  page.drawRectangle({
    x: 0,
    y: 52,
    width: PAGE[0],
    height: 2,
    color: brand,
  });

  const left = `${company.name}  ·  ${company.phone}  ·  ${company.address}`;
  page.drawText(left, {
    x: MARGIN,
    y: footerY + 8,
    size: 7.5,
    font,
    color: muted,
  });
  page.drawText(
    "Indicative consultancy guidance — not immigration advice.",
    {
      x: MARGIN,
      y: footerY - 4,
      size: 7,
      font,
      color: muted,
    }
  );
}
