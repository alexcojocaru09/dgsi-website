import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const file="C:/Users/laure/dgsi-website/output/catalog-pini-elb/catalog-feed-pini-elb.xlsx";
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(file));
for (const [sheetId,range] of [["Products","A1:M8"],["Catalog View","A1:W8"],["Compatibility","A1:N8"],["Dictionary","A1:B13"],["Read me","A1:B11"]]) {
  const x=await wb.inspect({kind:"table",sheetId,range,include:"values,formulas",tableMaxRows:15,tableMaxCols:15,maxChars:6000});
  console.log(`---${sheetId}---\n${x.ndjson}`);
}
const errors=await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",options:{useRegex:true,maxResults:300},summary:"final formula error scan"});
console.log(`---ERRORS---\n${errors.ndjson}`);
