import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const pinZip = "C:\\Users\\laure\\OneDrive\\Work\\Website\\welding\\ZK\\dwg\\pini\\pini w41.3.zip";
const electrodeZip = "C:\\Users\\laure\\OneDrive\\Work\\Website\\welding\\ZK\\dwg\\electrozi\\inferior\\electrozi w41.3.zip";
const htmlPath = "C:\\Users\\laure\\OneDrive\\Work\\Website\\welding\\ZK\\dwg\\catallog\\prompt catalog pini + electrozi w41\\Catalog Pini Ceramici + Electrozi - RO EN DE FR.html";
const outputDir = "C:\\Users\\laure\\dgsi-website\\outputs\\inventar-referinte";
const outputPath = path.join(outputDir, "Inventar_referinte_pini_electrozi_DGSI.xlsx");

function readZipReferences(zipPath, prefix) {
  const escaped = zipPath.replaceAll("'", "''");
  const ps = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z=[IO.Compression.ZipFile]::OpenRead('${escaped}')
$r=$z.Entries | Where-Object {$_.FullName -match '\\.dwg$' -and $_.FullName -match '(${prefix}\\d{5})'} | ForEach-Object {$Matches[1]} | Sort-Object -Unique
$z.Dispose()
ConvertTo-Json -Compress -InputObject @($r)
`;
  const raw = execFileSync("powershell.exe", ["-NoProfile", "-Command", ps], { encoding: "utf8" }).trim();
  return JSON.parse(raw || "[]");
}

function loadCatalogData(html) {
  const manifestMatch = html.match(/<script type="__bundler\/manifest">\s*(\{[\s\S]*?\})\s*<\/script>/);
  const resourcesMatch = html.match(/<script type="__bundler\/ext_resources">\s*([\s\S]*?)\s*<\/script>/);
  if (!manifestMatch || !resourcesMatch) throw new Error("Datele interne ale catalogului HTML nu au fost găsite.");

  const manifest = JSON.parse(manifestMatch[1]);
  const resources = JSON.parse(resourcesMatch[1]);
  const catalogResource = resources.find((r) => r.id === "catalogData");
  if (!catalogResource) throw new Error("Resursa catalogData lipsește din HTML.");
  const entry = manifest[catalogResource.uuid];
  if (!entry) throw new Error("Conținutul catalogData lipsește din manifest.");

  let bytes = Buffer.from(entry.data, "base64");
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);
  return JSON.parse(bytes.toString("utf8"));
}

function buildMapping(catalog) {
  const mapping = new Map();
  const pairs = [
    ["short_reference", "short_dgsi"],
    ["long_reference", "long_dgsi"],
    ["collar_reference", "collar_dgsi"],
    ["uncooled_1_reference", "uncooled_1_dgsi"],
    ["uncooled_2_reference", "uncooled_2_dgsi"],
    ["cooled_reference", "cooled_dgsi"],
  ];
  for (const rows of Object.values(catalog.rows)) {
    for (const row of rows) {
      for (const [referenceKey, dgsiKey] of pairs) {
        if (row[referenceKey] && row[dgsiKey]) mapping.set(row[referenceKey], row[dgsiKey]);
      }
    }
  }
  return mapping;
}

const pinRefs = readZipReferences(pinZip, "8228ZK");
const electrodeRefs = readZipReferences(electrodeZip, "1111ZK");
const catalog = loadCatalogData(await fs.readFile(htmlPath, "utf8"));
const mapping = buildMapping(catalog);
const dgsiCode = (reference) => mapping.get(reference) ||
  (reference.startsWith("8228ZK") ? `IT-CP-${reference.slice(-5)}` : `IT-ELB-${reference.slice(-5)}`);

const rows = [];
for (const ref of pinRefs) {
  rows.push(["Pin ceramic", ref, dgsiCode(ref), mapping.has(ref) ? "" : "Cod derivat conform regulii din catalog"]);
}
for (const ref of electrodeRefs) {
  rows.push(["Electrod inferior", ref, dgsiCode(ref), mapping.has(ref) ? "" : "Cod derivat conform regulii din catalog"]);
}

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Inventar");
sheet.showGridLines = false;

sheet.getRange("A1:D1").merge();
sheet.getRange("A1").values = [["Inventar referințe pini și electrozi"]];
sheet.getRange("A2:D2").merge();
sheet.getRange("A2").values = [[`${pinRefs.length} pini și ${electrodeRefs.length} electrozi DWG distincți; codurile DGSI sunt preluate din catalogul HTML.`]];
sheet.getRange("A4:D4").values = [["Categorie", "Referință Doceram", "Cod DGSI", "Observație"]];
sheet.getRange(`A5:D${rows.length + 4}`).values = rows;

sheet.getRange("A1:D1").format = {
  font: { name: "Arial", size: 15, bold: true, color: "#173D3B" },
};
sheet.getRange("A2:D2").format = {
  font: { name: "Arial", size: 10, italic: true, color: "#5B6666" },
};
sheet.getRange("A4:D4").format = {
  fill: "#173D3B",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange(`A5:D${rows.length + 4}`).format.font = { name: "Arial", size: 10, color: "#1F2929" };
sheet.getRange(`A4:D${rows.length + 4}`).format.borders = {
  insideHorizontal: { style: "thin", color: "#D9E2E1" },
  bottom: { style: "thin", color: "#A8B8B7" },
};
sheet.getRange(`A5:D${rows.length + 4}`).format.verticalAlignment = "center";
sheet.getRange(`A5:D${rows.length + 4}`).format.wrapText = false;
sheet.getRange("A:A").format.columnWidth = 21;
sheet.getRange("B:B").format.columnWidth = 23;
sheet.getRange("C:C").format.columnWidth = 21;
sheet.getRange("D:D").format.columnWidth = 48;
sheet.getRange("1:1").format.rowHeight = 25;
sheet.getRange("4:4").format.rowHeight = 23;
sheet.freezePanes.freezeRows(4);

const table = sheet.tables.add(`A4:D${rows.length + 4}`, true, "InventarProduse");
table.style = "TableStyleMedium2";
table.showFilterButton = true;

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "Inventar", range: "A1:D24", scale: 1.4, format: "png" });
await fs.writeFile(path.join(outputDir, "preview.png"), new Uint8Array(await preview.arrayBuffer()));

const check = await workbook.inspect({
  kind: "table",
  range: "Inventar!A1:D15",
  include: "values,formulas",
  tableMaxRows: 15,
  tableMaxCols: 4,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, pinRefs: pinRefs.length, electrodeRefs: electrodeRefs.length, withDgsiCode: rows.filter((r) => r[2]).length, missingDgsiCode: rows.filter((r) => !r[2]).length }));
