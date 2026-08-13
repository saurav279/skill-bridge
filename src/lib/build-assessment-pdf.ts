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
import {
  potentialFromScore,
  starRatingFromScore,
  type Assessment,
  type ScoreBreakdownItem,
} from "@/types";

const PAGE: [number, number] = [595.28, 841.89]; // A4
const MARGIN = 44;
const CONTENT_WIDTH = PAGE[0] - MARGIN * 2;
const TARGET_SCORE = 75;

const brand = rgb(0.0706, 0.0039, 0.9961); // #1201FE
const ink = rgb(0.09, 0.09, 0.09);
const muted = rgb(0.38, 0.38, 0.4);
const soft = rgb(0.96, 0.96, 0.97);
const white = rgb(1, 1, 1);
const rule = rgb(0.9, 0.9, 0.91);
const success = rgb(0.09, 0.64, 0.29);
const warning = rgb(0.96, 0.62, 0.04);
const danger = rgb(0.86, 0.15, 0.15);

const RADAR_LABELS: Record<string, string[]> = {
  leadership: ["Leadership"],
  innovation: ["Innovation"],
  impact: ["Impact"],
  recognition: ["Recognition"],
  publicProfile: ["Public", "Profile"],
  evidence: ["Evidence"],
  recommendationLetters: ["Recommend.", "Letters"],
  futurePlans: ["Future", "Plans"],
};

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = sanitizePdfText(text).split(/\s+/);
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

/** Helvetica/WinAnsi-safe text for pdf-lib standard fonts */
function sanitizePdfText(text: string) {
  return text
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x00-\x7E\u00A0-\u00FF]/g, "");
}

function discoveryCallUrl() {


  const base = (
     company.website
  ).replace(/\/$/, "");
  return `${base}/consultations/paid-strategy-call`;
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

function priorityLabel(priority: string) {
  if (priority === "high") return { label: "High Priority", color: danger };
  if (priority === "medium") return { label: "Medium", color: warning };
  return { label: "Easy Win", color: success };
}

function radarPoint(
  cx: number,
  cy: number,
  radius: number,
  i: number,
  n: number,
  value: number
) {
  // Same angles as the SVG UI; negate sin because PDF Y grows upward
  const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return {
    x: cx + Math.cos(angle) * radius * value,
    y: cy - Math.sin(angle) * radius * value,
  };
}

function drawRadar(
  page: PDFPage,
  font: PDFFont,
  items: ScoreBreakdownItem[],
  cx: number,
  cy: number,
  radius: number
) {
  const n = items.length;
  const levels = [0.25, 0.5, 0.75, 1];

  for (const level of levels) {
    for (let i = 0; i < n; i++) {
      const a = radarPoint(cx, cy, radius, i, n, level);
      const b = radarPoint(cx, cy, radius, (i + 1) % n, n, level);
      page.drawLine({
        start: a,
        end: b,
        thickness: 0.6,
        color: rule,
      });
    }
  }

  for (let i = 0; i < n; i++) {
    const tip = radarPoint(cx, cy, radius, i, n, 1);
    page.drawLine({
      start: { x: cx, y: cy },
      end: tip,
      thickness: 0.6,
      color: rule,
    });
  }

  // Data outline
  for (let i = 0; i < n; i++) {
    const a = radarPoint(cx, cy, radius, i, n, items[i].score / 100);
    const b = radarPoint(
      cx,
      cy,
      radius,
      (i + 1) % n,
      n,
      items[(i + 1) % n].score / 100
    );
    page.drawLine({
      start: a,
      end: b,
      thickness: 1.6,
      color: brand,
    });
    page.drawCircle({
      x: a.x,
      y: a.y,
      size: 2.2,
      color: brand,
    });
  }

  // Labels
  for (let i = 0; i < n; i++) {
    const lines =
      RADAR_LABELS[items[i].id] ??
      items[i].label.split(/\s+/).slice(0, 2);
    const tip = radarPoint(cx, cy, radius + 22, i, n, 1);
    const lineH = 9;
    // PDF Y grows up — stack wrapped label lines downward on the page
    const startY = tip.y + ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, li) => {
      const safe = sanitizePdfText(line);
      const w = font.widthOfTextAtSize(safe, 7);
      page.drawText(safe, {
        x: tip.x - w / 2,
        y: startY - li * lineH,
        size: 7,
        font,
        color: muted,
      });
    });
  }
}

/** Build PDF that mirrors the /assessment/[id] report UI */
export async function buildAssessmentPdf(
  data: Assessment
): Promise<Uint8Array> {
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

  function newPage() {
    drawFooter(page, font);
    page = doc.addPage(PAGE);
    y = PAGE[1] - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN + 56) newPage();
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

  function sectionTitle(title: string) {
    ensureSpace(28);
    drawLines(title, { size: 12, bold: true, gap: 8 });
  }

  // ——— Header ———
  page.drawRectangle({
    x: 0,
    y: PAGE[1] - 96,
    width: PAGE[0],
    height: 96,
    color: soft,
  });
  page.drawRectangle({
    x: 0,
    y: PAGE[1] - 99,
    width: PAGE[0],
    height: 3,
    color: brand,
  });

  if (logo) {
    const logoH = 24;
    const logoW = (logo.width / logo.height) * logoH;
    page.drawImage(logo, {
      x: MARGIN,
      y: PAGE[1] - 44,
      width: logoW,
      height: logoH,
    });
  } else {
    page.drawText(company.name, {
      x: MARGIN,
      y: PAGE[1] - 38,
      size: 16,
      font: fontBold,
      color: ink,
    });
  }

  page.drawText("Global Talent Report", {
    x: MARGIN,
    y: PAGE[1] - 62,
    size: 9,
    font: fontBold,
    color: brand,
  });
  page.drawText("Assessment", {
    x: MARGIN,
    y: PAGE[1] - 76,
    size: 11,
    font: fontBold,
    color: ink,
  });

  const contactLines = [company.phone, company.email, company.address];
  let cy = PAGE[1] - 34;
  for (const line of contactLines) {
    const w = font.widthOfTextAtSize(line, 8);
    page.drawText(line, {
      x: PAGE[0] - MARGIN - w,
      y: cy,
      size: 8,
      font,
      color: muted,
    });
    cy -= 11;
  }

  y = PAGE[1] - 122;

  drawLines("Prepared for candidate", { size: 11, bold: true, gap: 2 });
  drawLines(`Assessment ID  ·  ${data.id}`, {
    size: 8.5,
    color: muted,
    gap: 14,
  });

  const { label: potentialLabel, probability } = potentialFromScore(
    data.confidenceScore
  );
  const starRating = starRatingFromScore(data.confidenceScore);

  // ——— Score card (matches readiness score UI) ———
  const scoreCardH = 92;
  ensureSpace(scoreCardH + 12);
  const scoreTop = y + 12;
  page.drawRectangle({
    x: MARGIN,
    y: scoreTop - scoreCardH,
    width: CONTENT_WIDTH,
    height: scoreCardH,
    color: soft,
    borderColor: rule,
    borderWidth: 1,
  });
  page.drawRectangle({
    x: MARGIN,
    y: scoreTop - scoreCardH,
    width: 4,
    height: scoreCardH,
    color: brand,
  });

  page.drawText("READINESS SCORE", {
    x: MARGIN + 18,
    y: scoreTop - 22,
    size: 8,
    font: fontBold,
    color: brand,
  });
  page.drawText(`${data.confidenceScore}%`, {
    x: MARGIN + 18,
    y: scoreTop - 52,
    size: 32,
    font: fontBold,
    color: ink,
  });
  page.drawText(sanitizePdfText(potentialLabel), {
    x: MARGIN + 18,
    y: scoreTop - 70,
    size: 10,
    font,
    color: muted,
  });

  // progress bar
  const barX = MARGIN + 200;
  const barW = CONTENT_WIDTH - 220;
  const barY = scoreTop - 48;
  page.drawRectangle({
    x: barX,
    y: barY,
    width: barW,
    height: 8,
    color: rule,
  });
  page.drawRectangle({
    x: barX,
    y: barY,
    width: Math.max(4, (barW * data.confidenceScore) / 100),
    height: 8,
    color: brand,
  });
  page.drawText(`Target ${TARGET_SCORE}+`, {
    x: barX,
    y: barY - 16,
    size: 8.5,
    font,
    color: muted,
  });
  const stage = `Stage 1 · ${probability}`;
  page.drawText(stage, {
    x: barX + barW - font.widthOfTextAtSize(stage, 8.5),
    y: barY - 16,
    size: 8.5,
    font,
    color: muted,
  });

  y = scoreTop - scoreCardH - 18;

  // ——— Assessment Breakdown (radar) ———
  sectionTitle("Assessment Breakdown");
  const radarSize = 200;
  ensureSpace(radarSize + 16);
  drawRadar(
    page,
    font,
    data.breakdown,
    MARGIN + CONTENT_WIDTH / 2,
    y - radarSize / 2 + 4,
    68
  );
  y -= radarSize + 8;

  // ——— AI Assessment Summary (matches page UI) ———
  sectionTitle("AI Assessment Summary");

  // Star rating (drawn as shapes — Helvetica cannot encode ★)
  ensureSpace(20);
  const starSize = 7;
  const starGap = 4;
  for (let i = 0; i < 5; i++) {
    const sx = MARGIN + i * (starSize + starGap);
    page.drawCircle({
      x: sx + starSize / 2,
      y: y + 1,
      size: starSize / 2,
      color: i < starRating ? warning : rule,
    });
  }
  page.drawText(`${starRating} / 5`, {
    x: MARGIN + 5 * (starSize + starGap) + 6,
    y,
    size: 9,
    font,
    color: muted,
  });
  y -= 16;

  drawLines(data.headline, {
    size: 10.5,
    color: ink,
    gap: 14,
    lineHeight: 15,
  });

  // Strongest / Improvements — two columns
  ensureSpace(120);
  const colGap = 16;
  const colW = (CONTENT_WIDTH - colGap) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + colGap;
  const colStartY = y;

  function drawBulletColumn(
    title: string,
    items: string[],
    x: number,
    startY: number,
    accent: RGB
  ) {
    let localY = startY;
    page.drawText(title.toUpperCase(), {
      x,
      y: localY,
      size: 8,
      font: fontBold,
      color: muted,
    });
    localY -= 14;

    for (const item of items) {
      const lines = wrapText(item, font, 9, colW - 12);
      // bullet
      page.drawCircle({
        x: x + 3,
        y: localY + 2,
        size: 2.2,
        color: accent,
      });
      for (const line of lines) {
        if (localY < MARGIN + 60) {
          // can't easily split columns across pages — flatten remaining
          break;
        }
        page.drawText(line, {
          x: x + 10,
          y: localY,
          size: 9,
          font,
          color: muted,
        });
        localY -= 12;
      }
      localY -= 6;
    }
    return localY;
  }

  const leftEnd = drawBulletColumn(
    "Strongest",
    data.strengths,
    leftX,
    colStartY,
    success
  );
  const rightEnd = drawBulletColumn(
    "Improvements",
    data.improvements,
    rightX,
    colStartY,
    warning
  );
  y = Math.min(leftEnd, rightEnd) - 8;

  // Overall recommendation box
  const recLines = wrapText(
    data.overallRecommendation,
    fontBold,
    10,
    CONTENT_WIDTH - 28
  );
  const recPad = 12;
  const recH = recPad + 12 + recLines.length * 14 + recPad;
  ensureSpace(recH + 12);
  const recBottom = y - recH;
  page.drawRectangle({
    x: MARGIN,
    y: recBottom,
    width: CONTENT_WIDTH,
    height: recH,
    color: rgb(0.94, 0.96, 1),
    borderColor: rgb(0.75, 0.84, 0.98),
    borderWidth: 1,
  });
  page.drawText("OVERALL RECOMMENDATION", {
    x: MARGIN + recPad,
    y: y - recPad - 2,
    size: 7.5,
    font: fontBold,
    color: brand,
  });
  let ry = y - recPad - 18;
  for (const line of recLines) {
    page.drawText(line, {
      x: MARGIN + recPad,
      y: ry,
      size: 10,
      font: fontBold,
      color: ink,
    });
    ry -= 14;
  }
  y = recBottom - 16;

  // ——— Priority Improvements ———
  sectionTitle("Priority Improvements");
  for (const item of data.priorityImprovements) {
    const meta = priorityLabel(item.priority);
    const descLines = wrapText(item.description, font, 9.5, CONTENT_WIDTH - 28);
    const padX = 14;
    const padY = 12;
    const badgeH = 12;
    const titleH = 16;
    const gapAfterTitle = 8;
    const lineH = 13;
    const blockH =
      padY + badgeH + titleH + gapAfterTitle + descLines.length * lineH + padY;

    ensureSpace(blockH + 10);
    const boxBottom = y - blockH;

    page.drawRectangle({
      x: MARGIN,
      y: boxBottom,
      width: CONTENT_WIDTH,
      height: blockH,
      color: white,
      borderColor: rule,
      borderWidth: 1,
    });

    // Priority marker — same filled circle language as UI badges
    const markerY = y - padY - 3;
    page.drawCircle({
      x: MARGIN + padX + 2,
      y: markerY,
      size: 3,
      color: meta.color,
    });
    page.drawText(sanitizePdfText(meta.label.toUpperCase()), {
      x: MARGIN + padX + 12,
      y: markerY - 3,
      size: 7.5,
      font: fontBold,
      color: meta.color,
    });

    page.drawText(sanitizePdfText(item.title), {
      x: MARGIN + padX,
      y: y - padY - badgeH - 10,
      size: 10.5,
      font: fontBold,
      color: ink,
    });

    let dy = y - padY - badgeH - titleH - gapAfterTitle;
    for (const line of descLines) {
      page.drawText(line, {
        x: MARGIN + padX,
        y: dy,
        size: 9.5,
        font,
        color: muted,
      });
      dy -= lineH;
    }
    y = boxBottom - 10;
  }

  // ——— CTA ———
  y -= 10;
  const btnLabel = "Book a discovery call";
  const btnH = 34;
  const btnTextW = fontBold.widthOfTextAtSize(btnLabel, 11);
  const btnW = Math.min(CONTENT_WIDTH, btnTextW + 44);
  ensureSpace(btnH + 36);
  const btnY = y - btnH + 8;
  page.drawRectangle({
    x: MARGIN,
    y: btnY,
    width: btnW,
    height: btnH,
    color: brand,
  });
  page.drawText(btnLabel, {
    x: MARGIN + (btnW - btnTextW) / 2,
    y: btnY + (btnH - 11) / 2 - 1,
    size: 11,
    font: fontBold,
    color: white,
  });
  addLink(doc, page, MARGIN, btnY, btnW, btnH, discoveryCallUrl());
  y = btnY - 16;
  drawLines(
    "Free strategy call · Review your score, evidence plan, and next steps",
    { size: 8, color: muted, gap: 0 }
  );

  drawFooter(page, font);
  return doc.save();
}

function drawFooter(page: PDFPage, font: PDFFont) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE[0],
    height: 48,
    color: soft,
  });
  page.drawRectangle({
    x: 0,
    y: 48,
    width: PAGE[0],
    height: 2,
    color: brand,
  });
  const left = sanitizePdfText(
    `${company.name}  ·  ${company.phone}  ·  ${company.address}`
  );
  page.drawText(left, {
    x: MARGIN,
    y: 26,
    size: 7.5,
    font,
    color: muted,
  });
  page.drawText(
    "Indicative consultancy guidance — not immigration advice.",
    {
      x: MARGIN,
      y: 14,
      size: 7,
      font,
      color: muted,
    }
  );
}
