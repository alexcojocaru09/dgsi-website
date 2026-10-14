import fs from "node:fs/promises";
import path from "node:path";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outDir = "C:/Users/laure/dgsi-website/output/catalog-pini-elb";
await fs.mkdir(outDir, { recursive: true });

const round1 = n => Math.round(n * 10) / 10;
const range01 = (a, b) => Array.from({ length: Math.round((b-a)*10)+1 }, (_,i)=>round1(a+i/10));
const suffix = ref => ref.replace(/^\d{4}ZK/, "");
const dgsi = (family, ref) => `IT-${family}-${suffix(ref)}`;

const groups = [
  {group:"M4", page:22, pin:[4.5,6.0], hole:[4.6,6.1], pstarts:[11000,10000,10300], L:[26.5,31,31], D1:10},
  {group:"M5", page:23, pin:[5.5,7.0], hole:[5.6,7.1], pstarts:[11016,10016,10316], L:[26.5,31,31], D1:10},
  {group:"M6", page:24, pin:[6.5,8.5], hole:[6.6,8.6], pstarts:[11032,10032,10332], L:[27.5,34,34], D1:11.5},
  {group:"M8", page:25, pin:[8.5,11.0], hole:[8.6,11.1], pstarts:[11053,10053,10353], L:[29.8,35,35], D1:13.5},
  {group:"M10",page:26, pin:[11.0,13.0],hole:[11.1,13.1],pstarts:[11079,10079,10379],L:[32.3,40,40],D1:16},
  {group:"M12",page:27, pin:[13.0,15.0],hole:[13.1,15.1],pstarts:[11100,10100,10400],L:[34.1,43,43],D1:18},
  {group:'7/16-20 UNF',page:28,pin:[12.0,15.0],hole:[12.1,15.1],pstarts:[17189,17089,17389],L:[33.5,41.5,41.5],D1:18},
];

const electrodeSets = [
  {group:"M4", page:22, d:[4.5,6.5], configs:[
    {cooling:"Uncooled",G:"M14x1.5",SW:19,start:10000},
    {cooling:"Cooled",G:"M20x1.5",SW:30,start:20000}]},
  {group:"M5", page:23, d:[5.5,7.5], configs:[
    {cooling:"Uncooled",G:"M14x1.5",SW:19,start:10010},
    {cooling:"Uncooled",G:"M14x1.5",SW:24,start:10057},
    {cooling:"Cooled",G:"M20x1.5",SW:30,start:20010}]},
  {group:"M6", page:24, d:[6.5,9.0], configs:[
    {cooling:"Uncooled",G:"M16x1.5",SW:19,start:10031},
    {cooling:"Uncooled",G:"M16x1.5",SW:24,start:10078},
    {cooling:"Cooled",G:"M20x1.5",SW:30,start:20031}]},
  {group:"M8", page:25, d:[8.5,11.5], configs:[
    {cooling:"Uncooled",G:"M18x1.5",SW:24,start:10104},
    {cooling:"Uncooled",G:"M18x1.5",SW:30,start:10135},
    {cooling:"Cooled",G:"M20x1.5",SW:30,start:20104}]},
  {group:"M10",page:26,d:[11.0,13.5],configs:[
    {cooling:"Uncooled",G:"M20x1.5",SW:30,start:10166},
    {cooling:"Cooled",G:"M26x1.5",SW:36,start:20166}]},
  {group:"M12",page:27,d:[13.0,15.5],configs:[
    {cooling:"Uncooled",G:"M22x1.5",SW:30,start:10192},
    {cooling:"Cooled",G:"M26x1.5",SW:36,start:20192}]},
];

const products = [];
const productSeen = new Set();
const addProduct = p => {
  if (!productSeen.has(p.reference)) { productSeen.add(p.reference); products.push(p); }
};

const pinByGroupDType = new Map();
for (const g of groups) {
  const types = ["Short","Long","Collar"];
  range01(...g.pin).forEach((D,i)=>types.forEach((type,t)=>{
    const ref = `8228ZK${g.pstarts[t]+i}`;
    const p = {family:"CP",product_type:"Ceramic centering pin",variant:type,diameter_D_mm:D,D1_mm:g.D1,L_mm:g.L[t],cooling:"",thread_G:"",SW_mm:"",dgsi_code:dgsi("CP",ref),reference:ref,source_page:g.page,source_group:g.group};
    addProduct(p); pinByGroupDType.set(`${g.group}|${D}|${type}`,p);
  }));
}

const electrodeByGroupD = new Map();
for (const s of electrodeSets) {
  range01(...s.d).forEach((D,i)=>s.configs.forEach(c=>{
    const ref=`1111ZK${c.start+i}`;
    const p={family:"ELB",product_type:"Threaded base electrode",variant:"",diameter_D_mm:D,D1_mm:"",L_mm:"",cooling:c.cooling,thread_G:c.G,SW_mm:c.SW,dgsi_code:dgsi("ELB",ref),reference:ref,source_page:s.page,source_group:s.group};
    addProduct(p);
    const key=`${s.group}|${D}`; if(!electrodeByGroupD.has(key)) electrodeByGroupD.set(key,[]); electrodeByGroupD.get(key).push(p);
  }));
}

// Page 28 shares M12 electrode references from D=13.0 upward, with a dedicated sequence below 13.0.
for (const cooling of ["Uncooled","Cooled"]) {
  const G = cooling === "Uncooled" ? "M22x1.5" : "M26x1.5";
  const SW = cooling === "Uncooled" ? 30 : 36;
  range01(12.0,15.3).forEach((D,i)=>{
    let n;
    if (D < 13.0) n = (cooling === "Uncooled" ? 12182 : 20176) + i;
    else n = (cooling === "Uncooled" ? 10192 : 20192) + Math.round((D-13.0)*10);
    const ref=`1111ZK${n}`;
    const p={family:"ELB",product_type:"Threaded base electrode",variant:"",diameter_D_mm:D,D1_mm:"",L_mm:"",cooling,thread_G:G,SW_mm:SW,dgsi_code:dgsi("ELB",ref),reference:ref,source_page:28,source_group:'7/16-20 UNF'};
    addProduct(p); const key=`7/16-20 UNF|${D}`; if(!electrodeByGroupD.has(key)) electrodeByGroupD.set(key,[]); electrodeByGroupD.get(key).push(p);
  });
}

const compatibility=[];
const catalogView=[];
for(const g of groups){
  range01(...g.hole).forEach(hole=>{
    const pinD=round1(hole-0.1), electrodeD=round1(hole+0.1);
    const pins=Object.fromEntries(["Short","Long","Collar"].map(type=>[type,pinByGroupDType.get(`${g.group}|${pinD}|${type}`)]));
    const els=(electrodeByGroupD.get(`${g.group}|${electrodeD}`)||[]);
    const unc=els.filter(x=>x.cooling==="Uncooled").sort((a,b)=>a.SW_mm-b.SW_mm);
    const cool=els.find(x=>x.cooling==="Cooled");
    catalogView.push({group:g.group,sheet_hole_mm:hole,pin_D_mm:pinD,
      short_dgsi:pins.Short.dgsi_code,short_reference:pins.Short.reference,long_dgsi:pins.Long.dgsi_code,long_reference:pins.Long.reference,collar_dgsi:pins.Collar.dgsi_code,collar_reference:pins.Collar.reference,
      electrode_D_mm:electrodeD,uncooled_1_G:unc[0]?.thread_G||"",uncooled_1_SW_mm:unc[0]?.SW_mm||"",uncooled_1_dgsi:unc[0]?.dgsi_code||"",uncooled_1_reference:unc[0]?.reference||"",
      uncooled_2_G:unc[1]?.thread_G||"",uncooled_2_SW_mm:unc[1]?.SW_mm||"",uncooled_2_dgsi:unc[1]?.dgsi_code||"",uncooled_2_reference:unc[1]?.reference||"",
      cooled_G:cool?.thread_G||"",cooled_SW_mm:cool?.SW_mm||"",cooled_dgsi:cool?.dgsi_code||"",cooled_reference:cool?.reference||"",source_page:g.page});
    for(const type of ["Short","Long","Collar"]){
      const pin=pinByGroupDType.get(`${g.group}|${pinD}|${type}`);
      for(const el of (electrodeByGroupD.get(`${g.group}|${electrodeD}`)||[])){
        compatibility.push({group:g.group,sheet_hole_mm:hole,pin_D_mm:pinD,pin_variant:type,pin_dgsi:pin.dgsi_code,pin_reference:pin.reference,electrode_D_mm:electrodeD,electrode_cooling:el.cooling,electrode_G:el.thread_G,electrode_SW_mm:el.SW_mm,electrode_dgsi:el.dgsi_code,electrode_reference:el.reference,rule:"hole - 0.1 = pin; pin + 0.2 = electrode",source_page:g.page});
      }
    }
  });
}

const csvEscape=v=>{const s=String(v??""); return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;};
const toCsv=(rows,cols)=>[cols.join(','),...rows.map(r=>cols.map(c=>csvEscape(r[c])).join(','))].join('\r\n');
const productCols=["family","product_type","variant","diameter_D_mm","D1_mm","L_mm","cooling","thread_G","SW_mm","dgsi_code","reference","source_page","source_group"];
const compatibilityCols=["group","sheet_hole_mm","pin_D_mm","pin_variant","pin_dgsi","pin_reference","electrode_D_mm","electrode_cooling","electrode_G","electrode_SW_mm","electrode_dgsi","electrode_reference","rule","source_page"];
const catalogViewCols=["group","sheet_hole_mm","pin_D_mm","short_dgsi","short_reference","long_dgsi","long_reference","collar_dgsi","collar_reference","electrode_D_mm","uncooled_1_G","uncooled_1_SW_mm","uncooled_1_dgsi","uncooled_1_reference","uncooled_2_G","uncooled_2_SW_mm","uncooled_2_dgsi","uncooled_2_reference","cooled_G","cooled_SW_mm","cooled_dgsi","cooled_reference","source_page"];
await fs.writeFile(path.join(outDir,"products.csv"),toCsv(products,productCols),"utf8");
await fs.writeFile(path.join(outDir,"compatibility.csv"),toCsv(compatibility,compatibilityCols),"utf8");
await fs.writeFile(path.join(outDir,"catalog-view.csv"),toCsv(catalogView,catalogViewCols),"utf8");

const wb=Workbook.create();
const wsProducts=wb.worksheets.add("Products");
const wsCompat=wb.worksheets.add("Compatibility");
const wsCatalog=wb.worksheets.add("Catalog View");
const wsDict=wb.worksheets.add("Dictionary");
const wsReadme=wb.worksheets.add("Read me");
const writeTable=(ws,cols,rows,name)=>{
  ws.showGridLines=false;
  ws.getRangeByIndexes(0,0,rows.length+1,cols.length).values=[cols,...rows.map(r=>cols.map(c=>r[c]??""))];
  const head=ws.getRangeByIndexes(0,0,1,cols.length); head.format={fill:"#26343C",font:{name:"Arial",bold:true,color:"#FFFFFF",size:10},wrapText:true,verticalAlignment:"center",horizontalAlignment:"center"}; head.format.rowHeight=32;
  const body=ws.getRangeByIndexes(1,0,rows.length,cols.length); body.format.font={name:"Arial",size:9,color:"#1F2933"}; body.format.borders={insideHorizontal:{style:"thin",color:"#D9E1E5"}};
  ws.tables.add(`A1:${String.fromCharCode(64+cols.length)}${rows.length+1}`,true,name).style="TableStyleMedium2";
  ws.freezePanes.freezeRows(1); ws.getUsedRange().format.autofitColumns();
  for(let i=0;i<cols.length;i++) ws.getRangeByIndexes(0,i,rows.length+1,1).format.columnWidth=Math.min(ws.getRangeByIndexes(0,i,rows.length+1,1).format.columnWidth,24);
};
writeTable(wsProducts,productCols,products,"ProductsTable");
writeTable(wsCompat,compatibilityCols,compatibility,"CompatibilityTable");
writeTable(wsCatalog,catalogViewCols,catalogView,"CatalogViewTable");
wsProducts.getRange(`D2:G${products.length+1}`).format.numberFormat="0.0";
wsCompat.getRange(`B2:C${compatibility.length+1}`).format.numberFormat="0.0";
wsCompat.getRange(`G2:G${compatibility.length+1}`).format.numberFormat="0.0";
wsCompat.getRange(`M2:M${compatibility.length+1}`).format.wrapText=true; wsCompat.getRange("M:M").format.columnWidth=48;
wsCatalog.getRange(`B2:C${catalogView.length+1}`).format.numberFormat="0.0"; wsCatalog.getRange(`J2:J${catalogView.length+1}`).format.numberFormat="0.0";

const dict=[
  ["Element","Rule / meaning"],["IT-CP-xxxxx","dGSI code for ceramic centering pins"],["IT-ELB-xxxxx","dGSI code for lower/base threaded electrodes"],["IT-ELS-xxxxx","Reserved for upper electrodes; not included in this dataset"],["Reference / equivalence","Doceram identifier shown only as a technical cross-reference"],["ØD","Pin diameter or electrode central bore, according to section"],["ØD1","Pin body/base diameter"],["L","Pin length"],["G","Electrode external thread"],["SW","Width across flats"],["Selection rule","Sheet-hole diameter - 0.1 mm = pin ØD; pin ØD + 0.2 mm = electrode ØD"],["Source scope","Printed pages 22-28 of Docera electrozi.pdf; PDF file pages 12-15"],["Source note","Dimensions and references must be checked against individual technical drawings before publication or manufacture."]
];
wsDict.showGridLines=false; wsDict.getRange(`A1:B${dict.length}`).values=dict; wsDict.getRange("A1:B1").format={fill:"#26343C",font:{name:"Arial",bold:true,color:"#FFFFFF"}}; wsDict.getRange(`A2:A${dict.length}`).format.font={name:"Arial",bold:true,color:"#173B45"}; wsDict.getRange(`A1:B${dict.length}`).format.wrapText=true; wsDict.getRange("A:A").format.columnWidth=24; wsDict.getRange("B:B").format.columnWidth=78;
const readme=[
  ["Catalog feed - pins and base electrodes"],["Purpose","Product and compatibility feed for the dGSI catalogue and website."],["Primary identifiers","dGSI codes: IT-CP and IT-ELB."],["Third-party references","Doceram numbers are displayed only as Reference / equivalence Doceram."],["Products","One row per unique reference. Repeated references across metric groups are not duplicated."],["Catalog View","Compact source for brochure tables: one row per recommended sheet-hole selection."],["Compatibility","Normalized pin-electrode combinations derived from the explicit catalogue rule."],["Included groups","M4, M5, M6, M8, M10, M12, 7/16-20 UNF."],["Not included","Upper electrodes (ELS), studs and cooling rings from printed page 29."],["Source","Docera electrozi.pdf, printed pages 22-28 (file pages 12-15)."],["Validation","Review every final table against the individual DWG/PDF technical drawing before publication."]
];
wsReadme.showGridLines=false; wsReadme.getRange(`A1:B${readme.length}`).values=readme; wsReadme.mergeCells("A1:B1"); wsReadme.getRange("A1").format={font:{name:"Arial",bold:true,size:16,color:"#17242B"}}; wsReadme.getRange(`A2:A${readme.length}`).format.font={name:"Arial",bold:true,color:"#173B45"}; wsReadme.getRange(`A1:B${readme.length}`).format.wrapText=true; wsReadme.getRange("A:A").format.columnWidth=24; wsReadme.getRange("B:B").format.columnWidth=80;

for(const ws of [wsProducts,wsCatalog,wsCompat,wsDict,wsReadme]) ws.tabColor="#15C4C8";
const xlsx=await SpreadsheetFile.exportXlsx(wb); await xlsx.save(path.join(outDir,"catalog-feed-pini-elb.xlsx"));

const summary={productCount:products.length,catalogRows:catalogView.length,compatibilityCount:compatibility.length,uniqueReferences:productSeen.size,groups:groups.map(g=>g.group)};
await fs.writeFile(path.join(outDir,"build-summary.json"),JSON.stringify(summary,null,2),"utf8");

for(const [sheetName,range] of [["Read me","A1:B11"],["Dictionary","A1:B13"],["Products","A1:M20"],["Catalog View","A1:W15"],["Compatibility","A1:N20"]]){
  const preview=await wb.render({sheetName,range,scale:1.2,format:"png"});
  await fs.writeFile(path.join(outDir,`preview-${sheetName.replaceAll(' ','-').toLowerCase()}.png`),new Uint8Array(await preview.arrayBuffer()));
}

console.log(JSON.stringify(summary));
