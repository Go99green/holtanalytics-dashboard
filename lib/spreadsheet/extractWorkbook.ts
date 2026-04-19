import { execFileSync } from "node:child_process";
import path from "node:path";

export interface RawWorkbookSheet {
  name: string;
  rows: string[][];
}

export interface RawWorkbook {
  filePath: string;
  sheets: RawWorkbookSheet[];
}

function unzipEntry(filePath: string, entryPath: string): string {
  return execFileSync("unzip", ["-p", filePath, entryPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function decodeXml(text: string): string {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function parseSharedStrings(xml: string): string[] {
  const siMatches = [...xml.matchAll(/<si>([\s\S]*?)<\/si>/g)];
  return siMatches.map((match) => {
    const part = match[1];
    const textNodes = [...part.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => decodeXml(t[1]));
    return textNodes.join("");
  });
}

function parseWorkbookSheets(workbookXml: string): Array<{ name: string; rId: string }> {
  const matches = [
    ...workbookXml.matchAll(
      /<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"[^>]*\/>/g
    ),
  ];

  return matches.map((m) => ({ name: decodeXml(m[1]), rId: m[2] }));
}

function parseWorkbookRels(relsXml: string): Record<string, string> {
  const relRegex = new RegExp(
    `<Relationship[^>]*Id=\"([^\"]+)\"[^>]*Target=\"([^\"]+)\"[^>]*(?:Type=\"[^\"]*\")?[^>]*\\/>`,
    "g"
  );
  const rels: Record<string, string> = {};

  for (const match of relsXml.matchAll(relRegex)) {
    rels[match[1]] = decodeXml(match[2]);
  }

  return rels;
}

function normalizeWorksheetPath(target: string): string {
  const trimmed = target.replace(/^\/+/, "");
  if (trimmed.startsWith("xl/")) {
    return trimmed;
  }
  return path.posix.join("xl", trimmed);
}

function parseCellValue(cellXml: string, sharedStrings: string[]): string {
  const typeMatch = cellXml.match(/\st="([^"]+)"/);
  const t = typeMatch?.[1];

  const inline = cellXml.match(/<is>\s*<t[^>]*>([\s\S]*?)<\/t>\s*<\/is>/);
  if (inline) {
    return decodeXml(inline[1]);
  }

  const v = cellXml.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
  if (t === "s") {
    const idx = Number(v);
    return Number.isFinite(idx) ? sharedStrings[idx] ?? "" : "";
  }

  return decodeXml(v);
}

function columnRefToIndex(ref: string): number {
  let result = 0;
  for (const char of ref.toUpperCase()) {
    if (char < "A" || char > "Z") continue;
    result = result * 26 + (char.charCodeAt(0) - 64);
  }
  return Math.max(1, result) - 1;
}

function parseWorksheetRows(xml: string, sharedStrings: string[]): string[][] {
  const rowMatches = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)];

  return rowMatches.map((rowMatch) => {
    const cellMatches = [...rowMatch[1].matchAll(/<c\b[^>]*>[\s\S]*?<\/c>/g)];
    const row: string[] = [];
    for (const cell of cellMatches) {
      const cellXml = cell[0];
      const cellRef = cellXml.match(/\sr=\"([A-Z]+)\d+\"/)?.[1] ?? "A";
      const colIndex = columnRefToIndex(cellRef);
      row[colIndex] = parseCellValue(cellXml, sharedStrings);
    }
    return row.map((value) => value ?? "");
  });
}

export function extractWorkbook(filePath: string): RawWorkbook {
  const workbookXml = unzipEntry(filePath, "xl/workbook.xml");
  const relsXml = unzipEntry(filePath, "xl/_rels/workbook.xml.rels");

  const sharedStringsXml = (() => {
    try {
      return unzipEntry(filePath, "xl/sharedStrings.xml");
    } catch {
      return "";
    }
  })();

  const sharedStrings = sharedStringsXml ? parseSharedStrings(sharedStringsXml) : [];
  const sheets = parseWorkbookSheets(workbookXml);
  const relMap = parseWorkbookRels(relsXml);

  const parsedSheets: RawWorkbookSheet[] = sheets.map((sheet) => {
    const target = relMap[sheet.rId];
    if (!target) {
      throw new Error(`Missing relationship target for ${sheet.rId} (${sheet.name})`);
    }

    const worksheetPath = normalizeWorksheetPath(target);
    const worksheetXml = unzipEntry(filePath, worksheetPath);
    return {
      name: sheet.name,
      rows: parseWorksheetRows(worksheetXml, sharedStrings),
    };
  });

  return { filePath, sheets: parsedSheets };
}

export function assertRequiredSheets(raw: RawWorkbook, requiredSheetNames: string[]): void {
  const have = new Set(raw.sheets.map((sheet) => sheet.name));
  const missing = requiredSheetNames.filter((sheet) => !have.has(sheet));
  if (missing.length > 0) {
    throw new Error(
      `Workbook ${raw.filePath} missing required sheets: ${missing.join(", ")}`
    );
  }
}
