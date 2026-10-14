// src/data/weldingCatalog.js
// Catalog consumabile RPW · v4.5 — +DGSI-RPW-PIN-0049 (EZ2) · 0033 lipsă
// Structură: 3 piloni (Electrozi | Bucșe | Pini) → familii → piese.
//
// ⚠️ ATENȚIE — CONFLICT DE CODIFICARE NEREZOLVAT (vezi DGSI_codificare_toate_
// componentele_pini.xlsx vs cartuș PDF). Cele 2 surse aleg diametrul principal
// diferit:
//   • PDF cartuș (desen tehnic)  → Ø CORPULUI mare      (12,7 / 13,5)
//   • Excel codificare (41 piese) → Ø GÂTULUI superior   (8,2 / 8,3) — regulă
//     explicită: "diametrul principal selectat din cota superioară"
// Piesa 6555406 are și o a 2-a discrepanță: lungime 31mm (cotă explicită pe
// desen) vs 30,31mm (Excel — probabil citire aproximativă pre-cotare).
// dgsiCode rămâne NULL până la decizia lui Alex — vezi ambele variante în
// comentariul fiecărei piese. tempCode (DGSI-RPW-PIN-xxxx, din cartușul PDF)
// e identificatorul stabil folosit acum.
export const PILLARS = [
  { key: 'electrozi', label: 'Electrozi' },
  { key: 'bucse',     label: 'Bucșe' },
  { key: 'pini',      label: 'Pini' },
];
export const FAMILIES = [
  { key: 'els', pillar: 'electrozi', label: 'Electrod superior (ELS)' },
  { key: 'elb', pillar: 'electrozi', label: 'Electrod bază (ELB)' },
  { key: 'biz', pillar: 'bucse',     label: 'Bucșă izolantă (BIZ)' },
  { key: 'pcp', pillar: 'pini',      label: 'Pin ceramic poziționare (PCP)' },
];
export const PARTS = [
  {
    tempCode: 'DGSI-RPW-PIN-0002',
    dgsiCode: null,                       // PENDING — vezi conflict codificare mai sus
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.7-31-01',        // Ø corp (12,7mm) · L=31mm (cotă explicită desen)
      excelTabel: 'PIN-8.2-30.31-01',     // Ø gât (8,2mm) · L=30,31mm (citire Excel)
    },
    docerawEquivalent: '6555406 / 6548273',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,7 · L31',
    specs: [
      ['Ø corp',        '12,7 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,45 mm'],
      ['Ø gât',         '8,2 mm  (+0 / -0,05)'],
      ['Ø bază dom',    '2,58 mm'],
      ['Rază dom',      'R1,5 mm'],
      ['L (total)',     '31 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/6555406 6548273.png',
      pdf: '/welding-drawings/PIN-12.7-31-01__6555406-6548273__R00_BW.pdf',
      cad: null,
    },
    // Secțiune CONFIRMATĂ prin DOUĂ metode independente convergente:
    //   1) vectorizare pixel-precisă din desenul raster (Hough line detection,
    //      calibrată pe 6 cote verticale cunoscute — eroare sub 0,02mm)
    //   2) calcul geometric exact (centru arc, unghiuri, tangență verificată
    //      cu eroare 0°) — extras de ChatGPT direct din cotele desenului
    // Cele două metode converg la aceleași puncte pentru frustum + dom
    // (diferențe sub 0,01mm) — geometria e considerată finală/validată.
    // Notă: baza (Y 0→4mm) folosește valorile din pixel-extracție, mai
    // precise decât un unghi de șamfren asumat (desenul nu cotă explicit
    // acest unghi pentru piesa 1).
    //
    // STRUCTURA (Y=0 bază → Y=31 vârf):
    //   • bază cilindrică Ø14,45           Y ∈ [0.000,  2.545]
    //   • șamfren Ø14,45→Ø12,7             Y ∈ [2.545,  4.000]
    //   • corp cilindric Ø12,7             Y ∈ [4.000, 20.545]
    //   • umăr (frustum) Ø12,7→Ø8,2        Y ∈ [20.545, 22.500]
    //   • gât cilindric Ø8,2               Y ∈ [22.500, 25.500]
    //   • frustum tangent la dom (eroare 0°) Ø8,2→Ø2,584  Y ∈ [25.500, 30.262]
    //   • dom (arc R1,5, tangent verificat) Y ∈ [30.262, 31.000]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
                                 // culoarea/finisajul vin din preset (PartViewer3D)
      lathePoints: [
        [7.225, 0.0],
        [7.225, 2.545],
        [6.35,  4.0],
        [6.35,  20.545],
        [4.1,   22.5],
        [4.1,   25.5],
        [1.293, 30.26],
        [1.184, 30.421],
        [1.055, 30.567],
        [0.907, 30.694],
        [0.745, 30.802],
        [0.57,  30.887],
        [0.385, 30.95],
        [0.194, 30.987],
        [0.0,   31.0],
      ],
      height: 31.0,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 85 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/6555406 6548273.png',
      pdf: '/welding-drawings/PIN-12.7-31-01__6555406-6548273__R00_BW.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1,     r: 7.225, lineY: -4,   label: 'Ø14,45', radial: true  },
          { type: 'diameter', y: 12,    r: 6.35,  lineY: 34.5, label: 'Ø12,7',  radial: true  },
          { type: 'diameter', y: 24,    r: 4.1,   lineY: 37,   label: 'Ø8,2',   radial: false },
          { type: 'diameter', y: 30.26, r: 1.293, lineY: 39,   label: 'Ø2,58',  radial: false },
          { type: 'length', x: 12,  y1: 0, y2: 31,    edgeR1: 7.225, edgeR2: 0,     label: 'L 31',   radial: false },
          { type: 'length', x: 10,  y1: 0, y2: 30.26, edgeR1: 7.225, edgeR2: 1.293, label: '30,26',  radial: false },
          { type: 'length', x: 8.5, y1: 0, y2: 25.5,  edgeR1: 7.225, edgeR2: 4.1,   label: '25,5',   radial: false },
          { type: 'length', x: 7,   y1: 0, y2: 22.5,  edgeR1: 7.225, edgeR2: 4.1,   label: '22,5',   radial: false },
          { type: 'length', x: 9,   y1: 0, y2: 4,     edgeR1: 7.225, edgeR2: 6.35,  label: '4',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0001',
    dgsiCode: null,                       // PENDING — vezi conflict codificare mai sus
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-13.5-29.4-01',      // Ø corp (13,5mm) · L=29,4mm
      excelTabel: 'PIN-8.3-29.4-01',      // Ø gât (8,3mm) · L=29,4mm (lungime identică aici)
    },
    docerawEquivalent: '5145548 mod 1',
    family: 'pcp',
    name: 'Ceramic centering pin Ø13,5 · L29,4',
    specs: [
      ['Ø corp',        '13,5 mm  (+0 / -0,05)'],
      ['Ø bază',        '16 mm'],
      ['Ø gât',         '8,3 mm  (+0 / -0,1)'],
      ['Ø bază dom',    '3,59 mm'],
      ['Rază dom',      'R2 mm'],
      ['Filet bază',    'șamfren 60°'],
      ['L (total)',     '29,4 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/5145548 mod 1.png',
      pdf: '/welding-drawings/PIN-13.5-29.4-01__5145548-MOD1__R00_ISO_v3.pdf',
      cad: null,
    },
    // Secțiune CONFIRMATĂ prin DOUĂ metode independente convergente:
    //   1) vectorizare pixel-precisă din desenul raster (metoda inițială)
    //   2) calcul geometric exact (centru arc, unghiuri, verificare tangență
    //      — toate joncțiunile tangente au eroare 0,0°) — extras de ChatGPT
    //      direct din cotele desenului tehnic
    // Cele două metode converg la aceleași puncte (diferențe sub 0,01mm) —
    // geometria e considerată finală/validată.
    //
    // STRUCTURA (Y=0 bază → Y=29,4 vârf):
    //   • bază cilindrică Ø16                Y ∈ [0.00,  1.335]
    //   • șamfren 60° Ø16→Ø13,5              Y ∈ [1.335, 3.50]
    //   • corp cilindric Ø13,5               Y ∈ [3.50, 20.50]
    //   • umăr PLAT (disc orizontal) Ø13,5→Ø8,9  Y = 20.50 (r: 6,75→4,45)
    //   • fileu R0,3 (tangent verificat, eroare 0°)  Y ∈ [20.50, 20.80]
    //   • gât cilindric drept Ø8,3           Y ∈ [20.80, 23.50]
    //   • frustum tangent la dom (eroare 0°) Ø8,3→Ø3,588  Y ∈ [23.50, 28.2836]
    //   • dom (arc R2, tangent verificat, eroare 0°)  Y ∈ [28.2836, 29.40]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
                                 // culoarea/finisajul vin din preset (PartViewer3D)
      lathePoints: [
        [8.0,          0.0],
        [8.0,          1.334936490539],
        [6.75,         3.5],
        [6.75,         20.5],
        [4.45,         20.5],
        [4.3352,       20.5228],
        [4.2379,       20.5879],
        [4.1728,       20.6852],
        [4.15,         20.8],
        [4.15,         23.5],
        [1.794226923853, 28.283600444613],
        [1.6317,       28.5566],
        [1.4279,       28.8004],
        [1.1881,       29.0088],
        [0.9184,       29.1767],
        [0.6254,       29.2997],
        [0.3167,       29.3748],
        [0.0,          29.4],
      ],
      height: 29.4,
      footprint: 22,
      camera: { theta: 0.6, phi: 1.15, radius: 82 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/5145548 mod 1.png',
      pdf: '/welding-drawings/PIN-13.5-29.4-01__5145548-MOD1__R00_ISO_v3.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 0.7,   r: 8.0,   lineY: -4,   label: 'Ø16',    radial: true  },
          { type: 'diameter', y: 12,    r: 6.75,  lineY: 33,   label: 'Ø13,5',  radial: true  },
          { type: 'diameter', y: 22,    r: 4.15,  lineY: 35.5, label: 'Ø8,3',   radial: false },
          { type: 'diameter', y: 28.284,r: 1.794, lineY: 37.5, label: 'Ø3,59',  radial: false },
          { type: 'length', x: 11,  y1: 0, y2: 29.4,    edgeR1: 8.0, edgeR2: 0,     label: 'L 29,4', radial: false },
          { type: 'length', x: 9.5, y1: 0, y2: 28.284,  edgeR1: 8.0, edgeR2: 1.794, label: '28,28',  radial: false },
          { type: 'length', x: 8,   y1: 0, y2: 23.5,    edgeR1: 8.0, edgeR2: 4.15,  label: '23,5',   radial: false },
          { type: 'length', x: 6.5, y1: 0, y2: 20.5,  edgeR1: 8.0, edgeR2: 6.75,  label: '20,5',   radial: false },
          { type: 'length', x: 10,  y1: 0, y2: 3.5,   edgeR1: 8.0, edgeR2: 6.75,  label: '3,5',    radial: false },
          { type: 'length', x: 11.5,y1: 0, y2: 1.33,  edgeR1: 8.0, edgeR2: 8.0,   label: '1,33',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0003',
    dgsiCode: null,                       // PENDING — vezi conflict codificare (mesaj anterior)
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.5-34.1-01',      // Ø corp (12,5mm) · L=34,1mm
    },
    docerawEquivalent: 'ENDR0040914',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,5 · L34,1',
    specs: [
      ['Ø corp',        '12,5 mm  (+0 / -0,05)'],
      ['Ø bază',        '15 mm'],
      ['Ø pinten',      '7,6 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,1)'],
      ['Ø ref. con',    '4,77 mm'],
      ['Unghi con',     '38°'],
      ['Rază coroană',  'R2,5 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '34,1 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0040914.png',
      pdf: '/welding-drawings/PIN-12.5-34.1-01__ENDR0040914__R00_v2.pdf',
      cad: null,
    },
    // Secțiune CORECTATĂ (v2) — versiunea inițială unea tranziția direct cu
    // conul superior, omițând tronsonul cilindric Ø8,5 (vizibil clar în
    // desen). Acum: gât cilindric real Ø8,5 între Y=23,5 și Y=27, apoi con
    // 38° tangent la coroană (eroare tangență 0°, punct exact recomandat
    // de ChatGPT: prioritizează R2,5 exact + înălțime totală exactă + unghi
    // con exact — diametrul rezultat la tangență iese 4,727mm, ușor diferit
    // de nominalul 4,77mm — sistem supra-determinat, diferență acceptată).
    // Restul joncțiunilor (tranziție, gât) sunt muchii ascuțite reale (sharp
    // edge), nu tangente — normal pentru un umăr/tranziție dreaptă.
    //
    // STRUCTURA (Y=0 bază pinten → Y=34,1 vârf):
    //   • pinten cilindric Ø7,6              Y ∈ [0.00,  2.00]
    //   • salt orizontal spre bază Ø15       Y = 2.00
    //   • bază cilindrică Ø15                Y ∈ [2.00,  4.33]
    //   • șamfren 60° Ø15→Ø12,5              Y ∈ [4.33,  6.4951]
    //   • corp cilindric Ø12,5               Y ∈ [6.4951, 22.00]
    //   • tranziție (sharp edge) Ø12,5→Ø8,5  Y ∈ [22.00, 23.50]
    //   • gât cilindric drept Ø8,5           Y ∈ [23.50, 27.00]  ← vizibil acum
    //   • con 38° tangent la coroană         Y ∈ [27.00, 32.4139]
    //   • coroană (arc R2,5, tangent 0°)     Y ∈ [32.4139, 34.10]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
                                 // culoarea/finisajul vin din preset (PartViewer3D)
      lathePoints: [
        [3.8,              0.0],
        [3.8,              2.0],
        [7.5,              2.0],
        [7.5,              4.33],
        [6.25,             6.495063509461],
        [6.25,             22.0],
        [4.25,             23.5],
        [4.25,             27.0],
        [2.36358737817,    32.413920756632],
        [2.1835,           32.8175],
        [1.935,            33.183],
        [1.626,            33.499],
        [1.2662,           33.7557],
        [0.8668,           33.9449],
        [0.4403,           34.0609],
        [0.0,              34.1],
      ],
      height: 34.1,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/ENDR0040914.png',
      pdf: '/welding-drawings/PIN-12.5-34.1-01__ENDR0040914__R00_v2.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 0.7,   r: 7.5,   lineY: -4,   label: 'Ø15',    radial: true  },
          { type: 'diameter', y: 14,    r: 6.25,  lineY: 38,   label: 'Ø12,5',  radial: true  },
          { type: 'diameter', y: 25.25, r: 4.25,  lineY: 40,   label: 'Ø8,5',   radial: false },
          { type: 'diameter', y: 32.42, r: 2.36,  lineY: 42,   label: 'Ø4,77',  radial: false },
          { type: 'length', x: 12,  y1: 0, y2: 34.1,   edgeR1: 7.5, edgeR2: 0,     label: 'L 34,1', radial: false },
          { type: 'length', x: 10.5,y1: 0, y2: 32.41,  edgeR1: 7.5, edgeR2: 2.36,  label: '32,41',  radial: false },
          { type: 'length', x: 9,   y1: 0, y2: 27,     edgeR1: 7.5, edgeR2: 4.25,  label: '27',     radial: false },
          { type: 'length', x: 7.6, y1: 0, y2: 22,     edgeR1: 7.5, edgeR2: 6.25,  label: '22',     radial: false },
          { type: 'length', x: 8.3, y1: 0, y2: 4.33,   edgeR1: 7.5, edgeR2: 7.5,   label: '4,33',   radial: false },
          { type: 'length', x: 5,   y1: 0, y2: 2,      edgeR1: 3.8, edgeR2: 3.8,   label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0004',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.7-31.9-01',       // Ø corp (8,7mm) · L=31,9mm
    },
    docerawEquivalent: 'ENDR0040916',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,7 · L31,9',
    specs: [
      ['Ø corp',        '8,7 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '7,6 mm'],
      ['Ø gât',         '6,7 mm  (+0 / -0,1)'],
      ['Ø ref. con',    '3,72 mm'],
      ['Rază coroană',  'R1,9 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '31,9 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0040916.png',
      pdf: '/welding-drawings/PIN-8.7-31.9-01__ENDR0040916__R00_v2.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE față de JSON-ul primit: analiza inițială OMITEA cota Ø7,6
    // (nicio rază 3,8mm în segmente) și forța tranziția bazei la un unghi de
    // 56,06° în loc de 60° cotat. Structura corectă — identică cu piesa
    // ENDR0040914, care are același tipar de bază — folosește Ø7,6 ca pinten
    // inferior, iar șamfrenul de 60° iese EXACT (eroare 0°).
    //
    // Restul (con superior + coroană R1,9) preluat din JSON, tangență
    // verificată cu eroare 0°. Umărul Ø8,7→Ø6,7 e o asumpție (45°) —
    // desenul nu cotă înălțimea capătului umărului, doar diferența radială
    // de exact 1mm.
    //
    // STRUCTURA (Y=0 bază pinten → Y=31,9 vârf):
    //   • pinten cilindric Ø7,6              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  4.08]
    //   • șamfren 60° Ø11,5→Ø8,7 (exact)     Y ∈ [4.08,  6.5049]
    //   • corp cilindric Ø8,7                Y ∈ [6.5049, 21.50]
    //   • umăr 45° Ø8,7→Ø6,7 (asumpție)      Y ∈ [21.50, 22.50]
    //   • gât cilindric Ø6,7                 Y ∈ [22.50, 26.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [26.00, 30.6057]
    //   • coroană (arc R1,9, tangent 0°)     Y ∈ [30.6057, 31.90]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [3.8,              0.0],
        [3.8,              2.0],
        [5.75,             2.0],
        [5.75,             4.08],
        [4.35,             6.5049],
        [4.35,             21.5],
        [3.35,             22.5],
        [3.35,             26.0],
        [1.800861351545,   30.605721381919],
        [1.6651,           30.9151],
        [1.4767,           31.1955],
        [1.2416,           31.4382],
        [0.9673,           31.6353],
        [0.6624,           31.7808],
        [0.3365,           31.87],
        [0.0,              31.9],
      ],
      height: 31.9,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ENDR0040916.png',
      pdf: '/welding-drawings/PIN-8.7-31.9-01__ENDR0040916__R00_v2.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 3,     r: 5.75, lineY: -4,   label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 3.8,  lineY: -8,   label: 'Ø7,6',  radial: true  },
          { type: 'diameter', y: 14,    r: 4.35, lineY: 35.5, label: 'Ø8,7',  radial: true  },
          { type: 'diameter', y: 24.25, r: 3.35, lineY: 37.5, label: 'Ø6,7',  radial: false },
          { type: 'diameter', y: 30.61, r: 1.8,  lineY: 39.5, label: 'Ø3,72', radial: false },
          { type: 'length', x: 10,  y1: 0, y2: 31.9,  edgeR1: 5.75, edgeR2: 0,    label: 'L 31,9', radial: false },
          { type: 'length', x: 8.7, y1: 0, y2: 30.59, edgeR1: 5.75, edgeR2: 1.8,  label: '30,59',  radial: false },
          { type: 'length', x: 7.5, y1: 0, y2: 26,    edgeR1: 5.75, edgeR2: 3.35, label: '26',     radial: false },
          { type: 'length', x: 6.4, y1: 0, y2: 21.5,  edgeR1: 5.75, edgeR2: 4.35, label: '21,5',   radial: false },
          { type: 'length', x: 7.2, y1: 0, y2: 4.08,  edgeR1: 5.75, edgeR2: 5.75, label: '4,08',   radial: false },
          { type: 'length', x: 5,   y1: 0, y2: 2,     edgeR1: 3.8,  edgeR2: 3.8,  label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0005',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.05-30-01',        // Ø corp (8,05mm) · L=30mm
    },
    docerawEquivalent: 'ENDR0042409',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,05 · L30',
    specs: [
      ['Ø corp',        '8,05 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11 mm'],
      ['Ø pinten',      '7,5 mm'],
      ['Ø start con',   '4,9 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '1,94 mm'],
      ['Rază coroană',  'R1 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '30 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0042409.png',
      pdf: '/welding-drawings/PIN-8.05-30-01__ENDR0042409__R00_v2.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE față de JSON-ul primit — două erori de interpretare la bază:
    //   1. JSON excludea complet pintenul Ø7,5 (îl declara „sub planul Y=0,
    //      lungime necotată"). În realitate pintenul E în interiorul cotei
    //      totale de 30mm: baza lui coincide cu datumul desenului.
    //   2. JSON trata cota „4,4" drept CAPĂTUL șamfrenului. În realitate e
    //      START-ul lui (vârful flanșei) — la fel ca la ENDR0040916.
    //
    // Structura de mai jos a fost verificată prin măsurătoare pe pixeli din
    // desen, calibrată pe cotele cunoscute (30 / 29,36 / 25,5 / 23,5 / 4,4)
    // — toate cad la ±0,03mm. Cele trei muchii orizontale ale bazei detectate
    // la Y = 0,00 / 1,91 / 4,38 confirmă structura. Șamfrenul teoretic de 60°
    // (4,4 + 1,475·tan60 = 6,955) coincide cu muchia măsurată la 6,93 (Δ 0,025).
    //
    // Notă: înălțimea pintenului (1,91mm) NU e cotată în desen — e valoarea
    // măsurată din geometria desenului. Dacă ai cota exactă, se corectează
    // doar punctul [3.75, 1.91] și fața radială următoare.
    //
    // Partea superioară (con + coroană R1) preluată din JSON — tangență
    // verificată, eroare 0°.
    //
    // STRUCTURA (Y=0 bază pinten → Y=30 vârf):
    //   • pinten cilindric Ø7,5              Y ∈ [0.00,  1.91]
    //   • față radială spre flanșă Ø11       Y = 1.91
    //   • flanșă cilindrică Ø11              Y ∈ [1.91,  4.40]
    //   • șamfren 60° Ø11→Ø8,05 (exact)      Y ∈ [4.40,  6.9548]
    //   • corp cilindric Ø8,05               Y ∈ [6.9548, 21.925]
    //   • umăr 45° Ø8,05→Ø4,9                Y ∈ [21.925, 23.50]
    //   • gât cilindric Ø4,9 (2 mm)          Y ∈ [23.50, 25.50]
    //   • con tangent la coroană (eroare 0°) Y ∈ [25.50, 29.3658]
    //   • coroană (arc R1, tangent 0°)       Y ∈ [29.3658, 30.00]
    //
    // Zona superioară verificată prin măsurătoare pe pixeli, separând muchiile
    // piesei de liniile de cotă (în zona gâtului apar 4 pixeli/rând: 2 linii
    // de extensie Ø4,9 + 2 muchii reale). Rezultat: cotele 23,5 și 25,5
    // ÎNCADREAZĂ gâtul cilindric de 2mm. Unghiul umărului măsurat 44,89°
    // (= 45° nominal); la 45° exact umărul începe la Y=21,925, iar măsurătoarea
    // dă 21,98 (Δ 0,055mm).
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [3.75,             0.0],
        [3.75,             1.91],
        [5.5,              1.91],
        [5.5,              4.4],
        [4.025,            6.9548],
        [4.025,            21.925],
        [2.45,             23.5],
        [2.45,             25.5],
        [0.930702374916,   29.365777376727],
        [0.8554,           29.518],
        [0.7547,           29.656],
        [0.632,            29.7749],
        [0.4909,           29.8712],
        [0.3355,           29.9421],
        [0.1702,           29.9854],
        [0.0,              30.0],
      ],
      height: 30.0,
      footprint: 15,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/ENDR0042409.png',
      pdf: '/welding-drawings/PIN-8.05-30-01__ENDR0042409__R00_v2.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 3,     r: 5.5,   lineY: -4,   label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 1,     r: 3.75,  lineY: -8,   label: 'Ø7,5',  radial: true  },
          { type: 'diameter', y: 15,    r: 4.025, lineY: 33.5, label: 'Ø8,05', radial: true  },
          { type: 'diameter', y: 24.5,  r: 2.45,  lineY: 35.5, label: 'Ø4,9',  radial: false },
          { type: 'diameter', y: 29.37, r: 0.93,  lineY: 37.5, label: 'Ø1,94', radial: false },
          { type: 'length', x: 9.5, y1: 0, y2: 30,     edgeR1: 5.5, edgeR2: 0,     label: 'L 30',   radial: false },
          { type: 'length', x: 8.3, y1: 0, y2: 29.36,  edgeR1: 5.5, edgeR2: 0.93,  label: '29,36',  radial: false },
          { type: 'length', x: 7.2, y1: 0, y2: 25.5,   edgeR1: 5.5, edgeR2: 2.45,  label: '25,5',   radial: false },
          { type: 'length', x: 6.2, y1: 0, y2: 23.5,   edgeR1: 5.5, edgeR2: 2.45,  label: '23,5',   radial: false },
          { type: 'length', x: 7,   y1: 0, y2: 4.4,    edgeR1: 5.5, edgeR2: 5.5,   label: '4,4',    radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0006',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-14.8-40.8-01',      // Ø corp (14,8mm) · L=40,8mm
    },
    docerawEquivalent: 'ENDR0042411',
    family: 'pcp',
    name: 'Ceramic centering pin Ø14,8 · L40,8',
    specs: [
      ['Ø corp',        '14,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '16,5 mm'],
      ['Ø gât',         '10,1 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,97 mm'],
      ['Rază coroană',  'R2,1 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '40,8 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0042411.png',
      pdf: '/welding-drawings/PIN-14.8-40.8-01__ENDR0042411__R00.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE față de JSON-ul primit: acesta presupunea
    // `constant_D10.1_neck_segment: 0.0_length` — adică tranziția mergea
    // direct de la (7,4 / 25,5) la (5,05 / 31,0), fără gât cilindric.
    // Măsurătoarea pe pixeli arată clar un GÂT Ø10,1 de ~3mm: raza rămâne
    // constantă la 5,05 pe 16 rânduri consecutive (Y ≈ 28,04 → 31,0).
    // Aceeași eroare apăruse și la ENDR0042409.
    //
    // Capătul tranziției (Y=28,04) nu e cotat în desen — a fost determinat
    // prin regresie liniară pe 11 puncte măsurate de pe generatoarea
    // tranziției. Validare: aceeași dreaptă dă r=7,409 la Y=25,5 (valoarea
    // cotată e 7,40 → eroare 0,009mm), deci panta e corectă.
    //
    // Restul profilului verificat punct cu punct față de desen:
    //   • con: 11 puncte, Δ max 0,06mm
    //   • bază Ø16,5: Δ 0,008mm | șamfren 60°: Δ 0,030mm
    //   • tangența con↔coroană R2,1: eroare 0° (din JSON)
    //
    // STRUCTURA (Y=0 bază → Y=40,8 vârf):
    //   • bază cilindrică Ø16,5              Y ∈ [0.00,  2.5278]
    //   • șamfren 60° Ø16,5→Ø14,8            Y ∈ [2.5278, 4.00]
    //   • corp cilindric Ø14,8               Y ∈ [4.00,  25.50]
    //   • tranziție Ø14,8→Ø10,1              Y ∈ [25.50, 28.04]
    //   • gât cilindric Ø10,1 (~3 mm)        Y ∈ [28.04, 31.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [31.00, 39.4206]
    //   • coroană (arc R2,1, tangent 0°)     Y ∈ [39.4206, 40.80]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.25,             0.0],
        [8.25,             2.5278],
        [7.4,              4.0],
        [7.4,              25.5],
        [5.05,             28.04],
        [5.05,             31.0],
        [1.972416683391,   39.420634816418],
        [1.84,             39.7122],
        [1.6648,           39.98],
        [1.4509,           40.2182],
        [1.2034,           40.421],
        [0.9279,           40.5839],
        [0.6308,           40.703],
        [0.3191,           40.7756],
        [0.0,              40.8],
      ],
      height: 40.8,
      footprint: 22,
      camera: { theta: 0.6, phi: 1.15, radius: 110 },
      orthoSize: 28,
      drawing2d: '/welding-drawings/ENDR0042411.png',
      pdf: '/welding-drawings/PIN-14.8-40.8-01__ENDR0042411__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 8.25, lineY: -5,   label: 'Ø16,5', radial: true  },
          { type: 'diameter', y: 15,    r: 7.4,  lineY: 45,   label: 'Ø14,8', radial: true  },
          { type: 'diameter', y: 29.5,  r: 5.05, lineY: 47.5, label: 'Ø10,1', radial: false },
          { type: 'diameter', y: 39.42, r: 1.97, lineY: 50,   label: 'Ø3,97', radial: false },
          { type: 'length', x: 13,   y1: 0, y2: 40.8,  edgeR1: 8.25, edgeR2: 0,    label: 'L 40,8', radial: false },
          { type: 'length', x: 11.6, y1: 0, y2: 39.42, edgeR1: 8.25, edgeR2: 1.97, label: '39,42',  radial: false },
          { type: 'length', x: 10.3, y1: 0, y2: 31,    edgeR1: 8.25, edgeR2: 5.05, label: '31',     radial: false },
          { type: 'length', x: 9,    y1: 0, y2: 25.5,  edgeR1: 8.25, edgeR2: 7.4,  label: '25,5',   radial: false },
          { type: 'length', x: 10.6, y1: 0, y2: 4,     edgeR1: 8.25, edgeR2: 7.4,  label: '4',      radial: false },
          { type: 'length', x: 12,   y1: 0, y2: 2.53,  edgeR1: 8.25, edgeR2: 8.25, label: '2,53',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0007',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.09-30-01',        // Ø corp (8,09mm) · L=30mm
    },
    // ⚠️ Codul echivalent diferă între surse: desenul scrie „ENDR0040978",
    // dar numele fișierelor (PNG + PDF) folosesc „ENDR0045978". Am păstrat
    // varianta din fișiere, ca link-urile să funcționeze — de confirmat care
    // e cea corectă și de aliniat desenul/fișierele.
    docerawEquivalent: 'ENDR0045978',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,09 · L30',
    specs: [
      ['Ø corp',        '8,09 mm'],
      ['Ø bază',        '10,8 mm'],
      ['Ø gât',         '4,85 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '1,99 mm'],
      ['Rază coroană',  'R1 mm'],
      ['Șamfren bază',  '59,1°'],
      ['L (total)',     '30 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0045978.png',
      pdf: '/welding-drawings/PIN-8.09-30-01__ENDR0045978__R00.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE față de JSON-ul primit: presupunea din nou
    // `constant_D4.85_neck_segment: 0.0_length`, tratând intervalul
    // 23,8 → 25,8 drept tranziție. Măsurătoarea arată că acel interval este
    // GÂTUL cilindric Ø4,85 (rază constantă 2,42 pe 11 rânduri), iar
    // tranziția Ø8→Ø4,85 e sub el (Y ≈ 21,96 → 23,8). Aceeași eroare ca la
    // ENDR0042409 și ENDR0042411 — cotele încadrează gâtul, nu tranziția.
    //
    // Capătul inferior al tranziției nu e cotat; determinat prin regresie pe
    // 10 puncte măsurate (r = -0,8965·Y + 23,734). Validare: dreapta dă
    // r=2,397 la Y=23,8, față de 2,425 cotat (Δ 0,028mm).
    //
    // ⚠️ Ø CORP: desenul are cota „Ø8 (-0,05/-0,1)", dar adnotarea roșie de
    // pe desen, cartușul PDF și codul piesei indică toate 8,09mm. Am folosit
    // 8,09 (geometria desenului e trasată la 8,0 — diferență 0,045mm pe rază,
    // nesemnificativă vizual, dar valoarea din cartuș e cea oficială).
    //
    // Restul verificat: bază Ø10,8 (Δ 0,08mm), șamfren 59,11° — identic cu
    // valoarea din JSON, tangența con↔coroană R1 cu eroare 0°.
    //
    // STRUCTURA (Y=0 bază → Y=30 vârf):
    //   • bază cilindrică Ø10,8              Y ∈ [0.00,  2.66]
    //   • șamfren 59,1° Ø10,8→Ø8,09          Y ∈ [2.66,  5.00]
    //   • corp cilindric Ø8,09               Y ∈ [5.00, 21.962]
    //   • tranziție Ø8,09→Ø4,85              Y ∈ [21.962, 23.80]
    //   • gât cilindric Ø4,85 (2 mm)         Y ∈ [23.80, 25.80]
    //   • con tangent la coroană (eroare 0°) Y ∈ [25.80, 29.3864]
    //   • coroană (arc R1, tangent 0°)       Y ∈ [29.3864, 30.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.4,              0.0],
        [5.4,              2.66],
        [4.045,            5.0],
        [4.045,            21.962],
        [2.425,            23.8],
        [2.425,            25.8],
        [0.922315918064,   29.386444108729],
        [0.8449,           29.5349],
        [0.7438,           29.6685],
        [0.6217,           29.7832],
        [0.4822,           29.876],
        [0.3292,           29.9443],
        [0.1669,           29.986],
        [0.0,              30.0],
      ],
      height: 30.0,
      footprint: 15,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/ENDR0045978.png',
      pdf: '/welding-drawings/PIN-8.09-30-01__ENDR0045978__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.3,   r: 5.4,   lineY: -4,   label: 'Ø10,8', radial: true  },
          { type: 'diameter', y: 13,    r: 4.045, lineY: 33.5, label: 'Ø8,09', radial: true  },
          { type: 'diameter', y: 24.8,  r: 2.425, lineY: 35.5, label: 'Ø4,85', radial: false },
          { type: 'diameter', y: 29.37, r: 0.92,  lineY: 37.5, label: 'Ø1,99', radial: false },
          { type: 'length', x: 9.5, y1: 0, y2: 30,     edgeR1: 5.4, edgeR2: 0,     label: 'L 30',   radial: false },
          { type: 'length', x: 8.3, y1: 0, y2: 29.37,  edgeR1: 5.4, edgeR2: 0.92,  label: '29,37',  radial: false },
          { type: 'length', x: 7.2, y1: 0, y2: 25.8,   edgeR1: 5.4, edgeR2: 2.425, label: '25,8',   radial: false },
          { type: 'length', x: 6.2, y1: 0, y2: 23.8,   edgeR1: 5.4, edgeR2: 2.425, label: '23,8',   radial: false },
          { type: 'length', x: 7,   y1: 0, y2: 5,      edgeR1: 5.4, edgeR2: 4.045, label: '5',      radial: false },
          { type: 'length', x: 8,   y1: 0, y2: 2.66,   edgeR1: 5.4, edgeR2: 5.4,   label: '2,66',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0008',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.8-36.88-01',     // Ø corp (12,8mm) · L=36,88mm
    },
    docerawEquivalent: 'ENDR0045979',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,8 · L36,88',
    specs: [
      ['Ø corp',        '12,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '15,5 mm'],
      ['Ø gât',         '8,3 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,44 mm'],
      ['Rază coroană',  'R1,3 mm  (derivată)'],
      ['Șamfren bază',  '59,5°'],
      ['L (total)',     '36,88 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0045979.png',
      pdf: '/welding-drawings/PIN-12.8-36.88-01__ENDR0045979__R00.pdf',
      cad: null,
    },
    // JSON-ul primit a fost în mare parte CORECT — include gâtul cilindric
    // Ø8,3 (25,5 → 28,0), confirmat prin măsurătoare: rază 4,143 constantă pe
    // 13 rânduri de pixeli. Conul și coroana verificate punct cu punct față de
    // desen (Δ max 0,06mm). Singura corecție: unghiul umărului.
    //
    // ⚠️ UMĂR: JSON presupunea 45° (început la Y=23,25). Regresia pe 12 puncte
    // măsurate dă 47,92°, deci începutul real e la Y=23,01. Validarea regresiei:
    // aceeași dreaptă dă r=4,155 la Y=25,5, față de 4,15 cotat (Δ 0,005mm).
    //
    // ⚠️ RAZA COROANEI nu e cotată în desen. Valoarea R=1,2987 a fost derivată
    // de ChatGPT ca să satisfacă simultan Ø2,44 la tangență + vârf la 36,88 +
    // tangență perfectă cu conul. Măsurătoarea o confirmă (Δ 0,011 / 0,027mm).
    //
    // ⚠️ L TOTAL: cota tipărită pe desen e „36,8", corectată cu roșu la 36,88
    // (valoare confirmată de cartuș și de codul piesei). Calibrarea pe pixeli
    // favorizează tot 36,88 (Δ max 0,047mm vs 0,058mm pentru 36,8).
    //
    // STRUCTURA (Y=0 bază → Y=36,88 vârf):
    //   • bază cilindrică Ø15,5              Y ∈ [0.00,  2.71]
    //   • șamfren 59,5° Ø15,5→Ø12,8          Y ∈ [2.71,  5.00]
    //   • corp cilindric Ø12,8               Y ∈ [5.00, 23.01]
    //   • umăr 47,9° Ø12,8→Ø8,3              Y ∈ [23.01, 25.50]
    //   • gât cilindric Ø8,3 (2,5 mm)        Y ∈ [25.50, 28.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [28.00, 36.0266]
    //   • coroană (arc R1,3, tangent 0°)     Y ∈ [36.0266, 36.88]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.75,    0.0],
        [7.75,    2.71],
        [6.4,     5.0],
        [6.4,     23.01],
        [4.15,    25.5],
        [4.15,    28.0],
        [1.22,    36.026601891587],
        [1.1242,  36.2315],
        [0.9943,  36.4167],
        [0.8343,  36.5766],
        [0.6489,  36.7063],
        [0.4439,  36.8018],
        [0.2254,  36.8603],
        [0.0,     36.88],
      ],
      height: 36.88,
      footprint: 21,
      camera: { theta: 0.6, phi: 1.15, radius: 100 },
      orthoSize: 26,
      drawing2d: '/welding-drawings/ENDR0045979.png',
      pdf: '/welding-drawings/PIN-12.8-36.88-01__ENDR0045979__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.3,   r: 7.75, lineY: -4, label: 'Ø15,5', radial: true  },
          { type: 'diameter', y: 14,    r: 6.4,  lineY: 40, label: 'Ø12,8', radial: true  },
          { type: 'diameter', y: 26.8,  r: 4.15, lineY: 43, label: 'Ø8,3',  radial: false },
          { type: 'diameter', y: 36.03, r: 1.22, lineY: 46, label: 'Ø2,44', radial: false },
          { type: 'length', y1: 0, y2: 36.88,  edgeR1: 7.75, edgeR2: 0,    label: 'L 36,88', radial: false },
          { type: 'length', y1: 0, y2: 36.04,  edgeR1: 7.75, edgeR2: 1.22, label: '36,04',  radial: false },
          { type: 'length', y1: 0, y2: 28,     edgeR1: 7.75, edgeR2: 4.15, label: '28',     radial: false },
          { type: 'length', y1: 0, y2: 25.5,   edgeR1: 7.75, edgeR2: 4.15, label: '25,5',   radial: false },
          { type: 'length', y1: 0, y2: 5,      edgeR1: 7.75, edgeR2: 6.4,  label: '5',      radial: false },
          { type: 'length', y1: 0, y2: 2.71,   edgeR1: 7.75, edgeR2: 7.75, label: '2,71',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0009',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-14.9-37.4-01',      // Ø corp (14,9mm) · L=37,4mm
    },
    docerawEquivalent: 'ENDR0045980',
    family: 'pcp',
    name: 'Ceramic centering pin Ø14,9 · L37,4',
    specs: [
      ['Ø corp',        '14,9 mm  (+0 / -0,05)'],
      ['Ø bază',        '17,7 mm'],
      ['Ø gât',         '10 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,8 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '37,4 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0045980.png',
      pdf: '/welding-drawings/PIN-14.9-37.4-01__ENDR0045980__R00.pdf',
      cad: null,
    },
    // ✅ JSON-ul primit e CORECT integral — nicio corecție necesară.
    // Verificat prin măsurătoare pe pixeli (calibrare pe 6 cote, Δ max 0,064mm):
    //   • gât cilindric Ø10 (25,5→28,0): rază 5,005 constantă pe 12 rânduri ✓
    //   • umăr: măsurat 45,25° — presupunerea de 45° din JSON e corectă
    //     (începutul umărului diferă cu 0,07mm între măsurat și calculat)
    //   • con: verificat în 2 puncte, Δ max 0,033mm
    //   • șamfren bază 60°: calculul dă exact 2,5751 — identic cu JSON
    //
    // STRUCTURA (Y=0 bază → Y=37,4 vârf):
    //   • bază cilindrică Ø17,7              Y ∈ [0.00,  2.5751]
    //   • șamfren 60° Ø17,7→Ø14,9            Y ∈ [2.5751, 5.00]
    //   • corp cilindric Ø14,9               Y ∈ [5.00, 23.05]
    //   • umăr 45° Ø14,9→Ø10                 Y ∈ [23.05, 25.50]
    //   • gât cilindric Ø10 (2,5 mm)         Y ∈ [25.50, 28.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [28.00, 36.4885]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [36.4885, 37.40]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.85,    0.0],
        [8.85,    2.5751],
        [7.45,    5.0],
        [7.45,    23.05],
        [5.0,     25.5],
        [5.0,     28.0],
        [1.379754930937, 36.488452487935],
        [1.2629,  36.7094],
        [1.111,   36.9078],
        [0.9282,  37.0783],
        [0.7197,  37.2161],
        [0.4912,  37.3173],
        [0.2491,  37.3792],
        [0.0,     37.4],
      ],
      height: 37.4,
      footprint: 23,
      camera: { theta: 0.6, phi: 1.15, radius: 102 },
      orthoSize: 26,
      drawing2d: '/welding-drawings/ENDR0045980.png',
      pdf: '/welding-drawings/PIN-14.9-37.4-01__ENDR0045980__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 8.85, lineY: -4, label: 'Ø17,7', radial: true  },
          { type: 'diameter', y: 14,    r: 7.45, lineY: 41, label: 'Ø14,9', radial: true  },
          { type: 'diameter', y: 26.8,  r: 5.0,  lineY: 44, label: 'Ø10',   radial: false },
          { type: 'diameter', y: 36.49, r: 1.38, lineY: 47, label: 'Ø2,8',  radial: false },
          { type: 'length', y1: 0, y2: 37.4,   edgeR1: 8.85, edgeR2: 0,    label: 'L 37,4', radial: false },
          { type: 'length', y1: 0, y2: 36.49,  edgeR1: 8.85, edgeR2: 1.38, label: '36,49',  radial: false },
          { type: 'length', y1: 0, y2: 28,     edgeR1: 8.85, edgeR2: 5.0,  label: '28',     radial: false },
          { type: 'length', y1: 0, y2: 25.5,   edgeR1: 8.85, edgeR2: 5.0,  label: '25,5',   radial: false },
          { type: 'length', y1: 0, y2: 5,      edgeR1: 8.85, edgeR2: 7.45, label: '5',      radial: false },
          { type: 'length', y1: 0, y2: 2.59,   edgeR1: 8.85, edgeR2: 8.85, label: '2,59',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0010',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.65-31.75-01',     // Ø corp (8,65mm) · L=31,75mm
    },
    docerawEquivalent: 'ENDR0062219',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,65 · L31,75',
    specs: [
      ['Ø corp',        '8,65 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '7,5 mm'],
      ['Ø gât',         '6,55 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,85 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Unghi con',     '36°'],
      ['Unghi tranziție','93°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '31,75 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0062219.png',
      pdf: '/welding-drawings/PIN-8.65-31.75-01__ENDR0062219__R00.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE — JSON-ul raporta un CONFLICT ireductibil: unghiul de 93°
    // „nu e compatibil cu Ø8,65, Ø6,55, Y=22,5 și Y=25". Conflictul dispare
    // complet cu interpretarea corectă: intervalul 22,5 → 25 NU e tranziția,
    // ci GÂTUL cilindric Ø6,55 (rază 3,32 constantă pe 12 rânduri măsurate).
    // Tranziția de 93° e SUB Y=22,5, pe doar ~1mm.
    //
    // Măsurătoarea confirmă (calibrare pe 7 cote, Δ max 0,04mm):
    //   • tranziție măsurată: Y 21,495 → 22,545, unghi 90° ± 7° (incertitudine
    //     pe 5 puncte) — cei 93° cotați cad în interval, deci i-am folosit
    //   • gât Ø6,55: 22,5 → 25,02 ✓
    //   • con 36°: verificat, panta măsurată dă 36,8° (Δ 0,03mm pe rază)
    //   • coroană R1,5: verificată la Y=30,63 (Δ 0,001mm)
    //   • bază: unghi inclus 59,96° calculat / 59,5° măsurat = 60° cotat ✓
    //
    // Nota JSON despre „nominal_drawing_angle 62°" la tranziția inferioară e
    // greșită — desenul cotează 60°, iar geometria confirmă 60°.
    //
    // Startul conului (25,0247 în loc de 25,0 cotat) e valoarea exactă care
    // păstrează simultan conul de 36°, R1,5, vârful la 31,75 și tangența 0°.
    //
    // STRUCTURA (Y=0 bază pinten → Y=31,75 vârf):
    //   • pinten cilindric Ø7,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  4.00]
    //   • tranziție 60° Ø11,5→Ø8,65          Y ∈ [4.00,  6.47]
    //   • corp cilindric Ø8,65               Y ∈ [6.47, 21.5036]
    //   • tranziție 93° Ø8,65→Ø6,55          Y ∈ [21.5036, 22.50]
    //   • gât cilindric Ø6,55 (2,5 mm)       Y ∈ [22.50, 25.0247]
    //   • con 36° tangent la coroană         Y ∈ [25.0247, 30.7135]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [30.7135, 31.75]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [3.75,    0.0],
        [3.75,    2.0],
        [5.75,    2.0],
        [5.75,    4.0],
        [4.325,   6.47],
        [4.325,   21.5036],
        [3.275,   22.5],
        [3.275,   25.024688382001],
        [1.426584774443, 30.713525491562],
        [1.3365,  30.931],
        [1.2135,  31.1317],
        [1.0607,  31.3107],
        [0.8817,  31.4635],
        [0.681,   31.5865],
        [0.4635,  31.6766],
        [0.2347,  31.7315],
        [0.0,     31.75],
      ],
      height: 31.75,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ENDR0062219.png',
      pdf: '/welding-drawings/PIN-8.65-31.75-01__ENDR0062219__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 3,     r: 5.75,  lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 3.75,  lineY: -8, label: 'Ø7,5',  radial: true  },
          { type: 'diameter', y: 14,    r: 4.325, lineY: 35, label: 'Ø8,65', radial: true  },
          { type: 'diameter', y: 23.8,  r: 3.275, lineY: 38, label: 'Ø6,55', radial: false },
          { type: 'diameter', y: 30.71, r: 1.43,  lineY: 41, label: 'Ø2,85', radial: false },
          { type: 'length', y1: 0, y2: 31.75, edgeR1: 5.75, edgeR2: 0,     label: 'L 31,75', radial: false },
          { type: 'length', y1: 0, y2: 30.71, edgeR1: 5.75, edgeR2: 1.43,  label: '30,71',  radial: false },
          { type: 'length', y1: 0, y2: 25,    edgeR1: 5.75, edgeR2: 3.275, label: '25',     radial: false },
          { type: 'length', y1: 0, y2: 22.5,  edgeR1: 5.75, edgeR2: 3.275, label: '22,5',   radial: false },
          { type: 'length', y1: 0, y2: 6.47,  edgeR1: 5.75, edgeR2: 4.325, label: '6,47',   radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 5.75, edgeR2: 5.75,  label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 2,     edgeR1: 3.75, edgeR2: 3.75,  label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0011',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-7.3-35-01',         // Ø corp (7,3mm) · L=35mm
    },
    docerawEquivalent: 'FD 02',
    family: 'pcp',
    name: 'Ceramic centering pin Ø7,3 · L35',
    specs: [
      ['Ø corp',        '7,3 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø gât',         '4,9 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,96 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Tranziție bază','90°'],
      ['L (total)',     '35 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/FD 02.png',
      pdf: '/welding-drawings/PIN-7.3-35-01__FD-02__R00.pdf',
      cad: null,
    },
    // ⚠️ ATENȚIE: JSON-ul primit pentru această piesă („FD1_M8") era pentru
    // ALTĂ piesă — înălțime totală 27,5 vs 35, corp Ø8 vs Ø7,3, gât Ø4,7 vs
    // Ø4,9, vârf plat Ø0,7+R2 vs Ø2,96+R1,5. Geometria de mai jos e derivată
    // INTEGRAL din măsurarea desenului FD_02, nu din acel JSON.
    // De trimis JSON-ul corect pentru validare încrucișată.
    //
    // Măsurătoare calibrată pe 7 cote (Δ max 0,075mm). Verificări:
    //   • tranziție bază: Δr=2,1 / ΔY=2,1 -> 90° inclus = exact cota din desen ✓
    //   • gât Ø4,9: rază 2,465 constantă (25,0 → 28,0) ✓
    //   • umăr: regresie dă r=3,65 la Y=24,036 și r=2,45 la Y=25,036
    //     -> umăr 24,0 → 25,0 (unghi inclus 100,4°, NEcotat în desen)
    //   • coroană R1,5: centrul pe axă la Y=33,5; punctul (1,48 / 33,75) e la
    //     1,5010 de centru (Δ 0,001mm), iar tangenta exactă cu conul pornit
    //     din (2,45 / 28) cade la (1,4791 / 33,7498) — Δ 0,001mm față de
    //     nominalul din desen. Geometrie complet determinată, fără presupuneri.
    //
    // STRUCTURA (Y=0 bază pinten → Y=35 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  3.40]
    //   • tranziție 90° Ø11,5→Ø7,3           Y ∈ [3.40,  5.50]
    //   • corp cilindric Ø7,3                Y ∈ [5.50, 24.00]
    //   • umăr Ø7,3→Ø4,9                     Y ∈ [24.00, 25.00]
    //   • gât cilindric Ø4,9 (3 mm)          Y ∈ [25.00, 28.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [28.00, 33.7498]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [33.7498, 35.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [5.75,    2.0],
        [5.75,    3.4],
        [3.65,    5.5],
        [3.65,    24.0],
        [2.45,    25.0],
        [2.45,    28.0],
        [1.4791,  33.7498],
        [1.4128,  34.0041],
        [1.3031,  34.2429],
        [1.1534,  34.459],
        [0.9683,  34.6456],
        [0.7535,  34.797],
        [0.5156,  34.9086],
        [0.2618,  34.977],
        [0.0,     35.0],
      ],
      height: 35.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/FD 02.png',
      pdf: '/welding-drawings/PIN-7.3-35-01__FD-02__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.7,   r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 15,    r: 3.65, lineY: 39, label: 'Ø7,3',  radial: true  },
          { type: 'diameter', y: 26.5,  r: 2.45, lineY: 42, label: 'Ø4,9',  radial: false },
          { type: 'diameter', y: 33.75, r: 1.48, lineY: 45, label: 'Ø2,96', radial: false },
          { type: 'length', y1: 0, y2: 35,    edgeR1: 5.75, edgeR2: 0,    label: 'L 35',   radial: false },
          { type: 'length', y1: 0, y2: 33.75, edgeR1: 5.75, edgeR2: 1.48, label: '33,75',  radial: false },
          { type: 'length', y1: 0, y2: 28,    edgeR1: 5.75, edgeR2: 2.45, label: '28',     radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 5.75, edgeR2: 3.65, label: '24',     radial: false },
          { type: 'length', y1: 0, y2: 5.5,   edgeR1: 5.75, edgeR2: 3.65, label: '5,5',    radial: false },
          { type: 'length', y1: 0, y2: 3.4,   edgeR1: 5.75, edgeR2: 5.75, label: '3,4',    radial: false },
          { type: 'length', y1: 0, y2: 2,     edgeR1: 2.75, edgeR2: 2.75, label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0012',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8-27.5-01',         // Ø corp (8mm) · L=27,5mm
    },
    docerawEquivalent: 'FD1 M8',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8 · L27,5',
    specs: [
      ['Ø corp',        '8 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø gât',         '4,7 mm  (+0 / -0,05)'],
      ['Ø platou vârf', '0,7 mm'],
      ['Rază coroană',  'R2 mm'],
      ['Tranziție bază','45°'],
      ['L (total)',     '27,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/FD1 M8.png',
      pdf: '/welding-drawings/PIN-8-27.5-01__FD1-M8__R00.pdf',
      cad: null,
    },
    // Piesă cu vârf DIFERIT de restul familiei: nu are con + coroană, ci un
    // sfert de cerc R2 tangent la gâtul vertical Ø4,7 și la un PLATOU plat
    // Ø0,7 la vârf (nu se termină în punct).
    //
    // Măsurătoare calibrată pe 6 cote (Δ max 0,07mm). Verificări:
    //   • coroană R2: 4 puncte verificate față de arcul cu centrul (0,35 /
    //     25,5) — Δ max 0,037mm ✓ (JSON corect)
    //   • gât Ø4,7: rază 2,37 constantă (24,0 → 25,5) ✓
    //   • tranziție bază: Δr=1,75 / ΔY=1,75 -> 45° exact ✓ (JSON corect)
    //   • platou vârf Ø0,7 confirmat ✓
    //
    // ⚠️ UMĂR: JSON presupunea 45° (capăt la Y=24,15). Regresia pe 7 puncte
    // dă panta 1,1031 (42,2°), deci capătul real e la Y=24,006. Validarea
    // regresiei: aceeași dreaptă dă r=4,0 la Y=22,510, față de 22,5 cotat
    // (Δ 0,01mm). Am folosit Y=24,0. Diferența față de varianta 45° e 0,14mm.
    //
    // STRUCTURA (Y=0 bază pinten → Y=27,5 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  3.75]
    //   • tranziție 45° Ø11,5→Ø8             Y ∈ [3.75,  5.50]
    //   • corp cilindric Ø8                  Y ∈ [5.50, 22.50]
    //   • umăr 42,2° Ø8→Ø4,7                 Y ∈ [22.50, 24.00]
    //   • gât cilindric Ø4,7 (1,5 mm)        Y ∈ [24.00, 25.50]
    //   • sfert de cerc R2 (tangent 0°)      Y ∈ [25.50, 27.50]
    //   • platou plat Ø0,7 la vârf           Y = 27.50
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [5.75,    2.0],
        [5.75,    3.75],
        [4.0,     5.5],
        [4.0,     22.5],
        [2.35,    24.0],
        [2.35,    25.5],
        [2.3196,  25.8473],
        [2.2294,  26.184],
        [2.0821,  26.5],
        [1.8821,  26.7856],
        [1.6356,  27.0321],
        [1.35,    27.2321],
        [1.034,   27.3794],
        [0.6973,  27.4696],
        [0.35,    27.5],
        [0.0,     27.5],
      ],
      height: 27.5,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/FD1 M8.png',
      pdf: '/welding-drawings/PIN-8-27.5-01__FD1-M8__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.8,   r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 14,    r: 4.0,  lineY: 31, label: 'Ø8',    radial: true  },
          { type: 'diameter', y: 24.75, r: 2.35, lineY: 34, label: 'Ø4,7',  radial: false },
          { type: 'diameter', y: 27.5,  r: 0.35, lineY: 37, label: 'Ø0,7',  radial: false },
          { type: 'length', y1: 0, y2: 27.5, edgeR1: 5.75, edgeR2: 0.35, label: 'L 27,5', radial: false },
          { type: 'length', y1: 0, y2: 25.5, edgeR1: 5.75, edgeR2: 2.35, label: '25,5',   radial: false },
          { type: 'length', y1: 0, y2: 22.5, edgeR1: 5.75, edgeR2: 4.0,  label: '22,5',   radial: false },
          { type: 'length', y1: 0, y2: 5.5,  edgeR1: 5.75, edgeR2: 4.0,  label: '5,5',    radial: false },
          { type: 'length', y1: 0, y2: 3.75, edgeR1: 5.75, edgeR2: 5.75, label: '3,75',   radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 2.75, edgeR2: 2.75, label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0013',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.7-27.4-01',       // Ø corp (8,7mm) · L=27,4mm
    },
    docerawEquivalent: 'M10 8.7K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,7 · L27,4',
    specs: [
      ['Ø corp',        '8,7 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '6,5 mm  (+0 / -0,1)'],
      ['Ø ref. vârf',   '2,59 mm'],
      ['Rază coroană',  'R1,4 mm'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '27,4 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 8.7K.png',
      pdf: '/welding-drawings/PIN-8.7-27.4-01__M10-8.7K__R00.pdf',
      cad: null,
    },
    // JSON-ul primit e corect aproape integral. Măsurătoare calibrată pe 6
    // cote (Δ max 0,025mm). Verificări:
    //   • con: 3 puncte față de dreapta din JSON — Δ 0,006 / 0,022 / 0,007mm ✓
    //   • coroană R1,4 la Y=26,76: calc 1,176 / măsurat 1,183 (Δ 0,007mm) ✓
    //   • gât Ø6,5: rază 3,232 constantă (20,0 → 22,5) ✓
    //   • șamfren bază: unghi inclus calculat 60,00° = cota din desen ✓
    //
    // ⚠️ UMĂR: JSON presupunea 45° (capăt la Y=20,10). Regresia pe 9 puncte
    // dă panta 1,1167 → capăt la Y=19,994, deci Y=20,0 (valoare rotundă).
    // Validarea regresiei: aceeași dreaptă dă r=4,35 la Y=19,009, față de
    // 19,0 cotat (Δ 0,009mm). Am folosit 20,0; diferența față de 45° e 0,1mm.
    //
    // STRUCTURA (Y=0 bază → Y=27,4 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  2.0081]
    //   • șamfren 60° Ø11→Ø8,7               Y ∈ [2.0081, 4.00]
    //   • corp cilindric Ø8,7                Y ∈ [4.00, 19.00]
    //   • umăr 41,9° Ø8,7→Ø6,5               Y ∈ [19.00, 20.00]
    //   • gât cilindric Ø6,5 (2,5 mm)        Y ∈ [20.00, 22.50]
    //   • con tangent la coroană (eroare 0°) Y ∈ [22.50, 26.6101]
    //   • coroană (arc R1,4, tangent 0°)     Y ∈ [26.6101, 27.40]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     2.0081],
        [4.35,    4.0],
        [4.35,    19.0],
        [3.25,    20.0],
        [3.25,    22.5],
        [1.260082124055, 26.610076258051],
        [1.1468,  26.803],
        [1.0042,  26.9755],
        [0.836,   27.123],
        [0.6464,  27.2418],
        [0.4404,  27.3289],
        [0.223,   27.3821],
        [0.0,     27.4],
      ],
      height: 27.4,
      footprint: 15,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/M10 8.7K.png',
      pdf: '/welding-drawings/PIN-8.7-27.4-01__M10-8.7K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1,     r: 5.5,  lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 11,    r: 4.35, lineY: 31, label: 'Ø8,7',  radial: true  },
          { type: 'diameter', y: 21.25, r: 3.25, lineY: 34, label: 'Ø6,5',  radial: false },
          { type: 'diameter', y: 26.6,  r: 1.26, lineY: 37, label: 'Ø2,59', radial: false },
          { type: 'length', y1: 0, y2: 27.4, edgeR1: 5.5, edgeR2: 0,    label: 'L 27,4', radial: false },
          { type: 'length', y1: 0, y2: 26.6, edgeR1: 5.5, edgeR2: 1.26, label: '26,6',   radial: false },
          { type: 'length', y1: 0, y2: 22.5, edgeR1: 5.5, edgeR2: 3.25, label: '22,5',   radial: false },
          { type: 'length', y1: 0, y2: 19,   edgeR1: 5.5, edgeR2: 4.35, label: '19',     radial: false },
          { type: 'length', y1: 0, y2: 4,    edgeR1: 5.5, edgeR2: 4.35, label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 2.01, edgeR1: 5.5, edgeR2: 5.5,  label: '2,01',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0014',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-9.9-29.07-01',      // Ø corp (9,9mm) · L=29,07mm
    },
    docerawEquivalent: 'M10 9.8K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø9,9 · L29,07',
    specs: [
      ['Ø corp',         '9,9 mm  (-0,05 / -0,1)'],
      ['Ø bază',         '13,02 mm'],
      ['Ø gât',          '6,6 mm  (-0,05 / -0,1)'],
      ['Ø ref. vârf',    '2,74 mm'],
      ['Rază coroană',   'R1,5 mm'],
      ['Unghi tranziție','81°'],
      ['Șamfren bază',   '60°'],
      ['L (total)',      '29,07 mm'],
      ['Material',       'ZrO2 (Cerazur®)'],
      ['Rev.',           'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 9.8K.png',
      pdf: '/welding-drawings/PIN-9.9-29.07-01__M10-9.8K__R00.pdf',
      cad: null,
    },
    // ✅ JSON-ul primit e CORECT — include gâtul și folosește unghiul cotat
    // de 81°. Nicio corecție structurală necesară.
    //
    // Măsurătoare (calibrare pe 5 cote, Δ max 0,06mm). Verificări:
    //   • con: 10 puncte față de dreapta din JSON — Δ max 0,063mm ✓
    //   • gât Ø6,6: rază 3,24 constantă (≈22,0 → 24,0) ✓
    //   • tranziție: pantă măsurată 0,8848 -> 83,0° ± 4° — unghiul cotat de
    //     81° cade în interval, deci l-am folosit
    //   • bază: Ø13,04 măsurat vs 13,02 corectat ✓; șamfren 60,00° exact ✓
    //
    // Notă: desenul cotează atât unghiul 81° cât și înălțimea „22", care sunt
    // ușor inconsistente între ele — cu 81° exact, gâtul începe la 21,9319
    // (deci „22" e valoarea rotunjită). Am prioritizat unghiul, ca JSON-ul.
    // Diferența e 0,07mm.
    //
    // Două cote corectate cu roșu pe desen: Ø13 → 13,02 și L 29 → 29,07.
    // Ambele confirmate de cartuș; calibrarea pe pixeli nu le poate distinge
    // (diferență sub 0,25%), deci am folosit valorile oficiale din cartuș.
    //
    // STRUCTURA (Y=0 bază → Y=29,07 vârf):
    //   • bază cilindrică Ø13,02             Y ∈ [0.00,  2.368]
    //   • șamfren 60° Ø13,02→Ø9,9            Y ∈ [2.368, 5.07]
    //   • corp cilindric Ø9,9                Y ∈ [5.07, 20.00]
    //   • tranziție 81° Ø9,9→Ø6,6            Y ∈ [20.00, 21.9319]
    //   • gât cilindric Ø6,6 (2,07 mm)       Y ∈ [21.9319, 24.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.00, 28.1987]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [28.1987, 29.07]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.51,    0.0],
        [6.51,    2.368],
        [4.95,    5.07],
        [4.95,    20.0],
        [3.3,     21.9319],
        [3.3,     24.0],
        [1.361908045619, 28.19865449595],
        [1.2422,  28.4109],
        [1.0896,  28.6009],
        [0.9084,  28.7637],
        [0.7031,  28.895],
        [0.4793,  28.9914],
        [0.2429,  29.0502],
        [0.0,     29.07],
      ],
      height: 29.07,
      footprint: 17,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/M10 9.8K.png',
      pdf: '/welding-drawings/PIN-9.9-29.07-01__M10-9.8K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 6.51, lineY: -4, label: 'Ø13,02', radial: true  },
          { type: 'diameter', y: 12,    r: 4.95, lineY: 33, label: 'Ø9,9',   radial: true  },
          { type: 'diameter', y: 23,    r: 3.3,  lineY: 36, label: 'Ø6,6',   radial: false },
          { type: 'diameter', y: 28.12, r: 1.36, lineY: 39, label: 'Ø2,74',  radial: false },
          { type: 'length', y1: 0, y2: 29.07, edgeR1: 6.51, edgeR2: 0,    label: 'L 29,07', radial: false },
          { type: 'length', y1: 0, y2: 28.12, edgeR1: 6.51, edgeR2: 1.36, label: '28,12',  radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 6.51, edgeR2: 3.3,  label: '24',     radial: false },
          { type: 'length', y1: 0, y2: 22,    edgeR1: 6.51, edgeR2: 3.3,  label: '22',     radial: false },
          { type: 'length', y1: 0, y2: 5.07,  edgeR1: 6.51, edgeR2: 4.95, label: '5,07',   radial: false },
          { type: 'length', y1: 0, y2: 2.3,   edgeR1: 6.51, edgeR2: 6.51, label: '2,3',    radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0015',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-10.8-28.57-01',     // Ø corp (10,8mm) · L=28,57mm
    },
    docerawEquivalent: 'M10 10.8K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø10,8 · L28,57',
    specs: [
      ['Ø corp',        '10,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '13 mm'],
      ['Ø gât',         '6,5 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,74 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Umăr',          '45°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '28,57 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 10.8K.png',
      pdf: '/welding-drawings/PIN-10.8-28.57-01__M10-10.8K__R00.pdf',
      cad: null,
    },
    // ✅ JSON-ul primit e CORECT integral — nicio corecție necesară.
    // Măsurătoare calibrată pe 5 cote (Δ max 0,057mm). Verificări:
    //   • UMĂR: regresia pe 14 puncte dă panta EXACT -1,0000 -> 45,00°,
    //     confirmând presupunerea din JSON. Începutul umărului măsurat la
    //     Y=18,985 vs 18,95 calculat (Δ 0,035mm, offset uniform de calibrare).
    //   • gât Ø6,5: rază 3,276 constantă (21,1 → 23,6) ✓
    //   • con: 9 puncte față de dreapta din JSON — Δ max 0,042mm ✓
    //   • șamfren bază: unghi inclus 60,00° exact = cota din desen ✓
    //
    // Cotă corectată cu roșu pe desen: L 28,5 → 28,57 (confirmată de cartuș).
    //
    // STRUCTURA (Y=0 bază → Y=28,57 vârf):
    //   • bază cilindrică Ø13                Y ∈ [0.00,  2.0947]
    //   • șamfren 60° Ø13→Ø10,8              Y ∈ [2.0947, 4.00]
    //   • corp cilindric Ø10,8               Y ∈ [4.00, 18.95]
    //   • umăr 45° Ø10,8→Ø6,5                Y ∈ [18.95, 21.10]
    //   • gât cilindric Ø6,5 (2,5 mm)        Y ∈ [21.10, 23.60]
    //   • con tangent la coroană (eroare 0°) Y ∈ [23.60, 27.6976]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [27.6976, 28.57]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.5,     0.0],
        [6.5,     2.0947],
        [5.4,     4.0],
        [5.4,     18.95],
        [3.25,    21.1],
        [3.25,    23.6],
        [1.362393424179, 27.697601910254],
        [1.2427,  27.91],
        [1.0902,  28.1003],
        [0.9089,  28.2633],
        [0.7035,  28.3948],
        [0.4796,  28.4913],
        [0.243,   28.5502],
        [0.0,     28.57],
      ],
      height: 28.57,
      footprint: 17,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/M10 10.8K.png',
      pdf: '/welding-drawings/PIN-10.8-28.57-01__M10-10.8K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 6.5,  lineY: -4, label: 'Ø13',   radial: true  },
          { type: 'diameter', y: 11,    r: 5.4,  lineY: 32, label: 'Ø10,8', radial: true  },
          { type: 'diameter', y: 22.35, r: 3.25, lineY: 35, label: 'Ø6,5',  radial: false },
          { type: 'diameter', y: 27.63, r: 1.36, lineY: 38, label: 'Ø2,74', radial: false },
          { type: 'length', y1: 0, y2: 28.57, edgeR1: 6.5, edgeR2: 0,    label: 'L 28,57', radial: false },
          { type: 'length', y1: 0, y2: 27.63, edgeR1: 6.5, edgeR2: 1.36, label: '27,63',  radial: false },
          { type: 'length', y1: 0, y2: 23.6,  edgeR1: 6.5, edgeR2: 3.25, label: '23,6',   radial: false },
          { type: 'length', y1: 0, y2: 21.1,  edgeR1: 6.5, edgeR2: 3.25, label: '21,1',   radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 6.5, edgeR2: 5.4,  label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 2.09,  edgeR1: 6.5, edgeR2: 6.5,  label: '2,09',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0016',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.9-29.66-01',     // Ø corp (12,9mm) · L=29,66mm
    },
    docerawEquivalent: 'M10 12.9K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,9 · L29,66',
    specs: [
      ['Ø corp',        '12,9 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,7 mm'],
      ['Rază coroană',  'R2 mm'],
      ['Umăr',          '45°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '29,66 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 12.9K.png',
      pdf: '/welding-drawings/PIN-12.9-29.66-01__M10-12.9K__R00.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE — JSON-ul plasa greșit umărul: susținea corp până la Y=21,
    // umăr 21→23,2 și gât 23,2→24 (doar 0,8mm). Măsurătoarea arată că
    // cotele 21 și 24 ÎNCADREAZĂ GÂTUL (3mm), iar umărul e sub ele.
    // Aceeași eroare ca la piesele 0005 / 0007 / 0010.
    //
    // Măsurătoare calibrată pe 5 cote (Δ max 0,025mm). Verificări:
    //   • UMĂR: regresia pe 20 puncte dă panta EXACT -1,0000 -> 45,00°
    //     (unghiul din JSON e corect, doar poziția era greșită).
    //     r=6,45 la Y=18,807 și r=4,25 la Y=21,007; la 45° exact din 21,0
    //     rezultă 18,8 -> Δ 0,007mm ✓
    //   • gât Ø8,5: rază 4,25 constantă (21,0 → 24,0) ✓
    //   • con: panta măsurată 0,4995 extrapolează la r=4,25 la Y=23,93 ≈ 24 ✓
    //   • șamfren bază: unghi inclus 60,00° exact ✓
    //
    // Notă: calibrarea pe pixeli arată că desenul e TRASAT la L=29,8
    // (potrivire Δ max 0,025mm) în timp ce 29,66 e corecția roșie confirmată
    // de cartuș. Am folosit 29,66 (valoarea oficială) pentru con + coroană,
    // ca JSON-ul. Cotele nominale Ø3,7 și Y=28,71 nu sunt simultan exacte cu
    // R2 + vârf la 29,66 (reziduuri 0,18 / 0,10mm) — sistem supra-determinat.
    //
    // STRUCTURA (Y=0 bază → Y=29,66 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.6144]
    //   • șamfren 60° Ø14,5→Ø12,9            Y ∈ [2.6144, 4.00]
    //   • corp cilindric Ø12,9               Y ∈ [4.00, 18.80]
    //   • umăr 45° Ø12,9→Ø8,5                Y ∈ [18.80, 21.00]
    //   • gât cilindric Ø8,5 (3 mm)          Y ∈ [21.00, 24.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.00, 28.6105]
    //   • coroană (arc R2, tangent 0°)       Y ∈ [28.6105, 29.66]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.6144],
        [6.45,    4.0],
        [6.45,    18.8],
        [4.25,    21.0],
        [4.25,    24.0],
        [1.759710511285, 28.610483517202],
        [1.5935,  28.8686],
        [1.3898,  29.0982],
        [1.1533,  29.294],
        [0.8896,  29.4513],
        [0.605,   29.5663],
        [0.3061,  29.6364],
        [0.0,     29.66],
      ],
      height: 29.66,
      footprint: 19,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/M10 12.9K.png',
      pdf: '/welding-drawings/PIN-12.9-29.66-01__M10-12.9K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.3,   r: 7.25, lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 11,    r: 6.45, lineY: 33, label: 'Ø12,9', radial: true  },
          { type: 'diameter', y: 22.5,  r: 4.25, lineY: 36, label: 'Ø8,5',  radial: false },
          { type: 'diameter', y: 28.71, r: 1.85, lineY: 39, label: 'Ø3,7',  radial: false },
          { type: 'length', y1: 0, y2: 29.66, edgeR1: 7.25, edgeR2: 0,    label: 'L 29,66', radial: false },
          { type: 'length', y1: 0, y2: 28.71, edgeR1: 7.25, edgeR2: 1.85, label: '28,71',  radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 7.25, edgeR2: 4.25, label: '24',     radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 7.25, edgeR2: 4.25, label: '21',     radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 7.25, edgeR2: 6.45, label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 2.61,  edgeR1: 7.25, edgeR2: 7.25, label: '2,61',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0017',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.3-29.9-01',      // Ø corp (12,3mm) · L=29,9mm
    },
    docerawEquivalent: 'M10 FI12.3K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,3 · L29,9',
    specs: [
      ['Ø corp',        '12,3 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,6 mm'],
      ['Rază coroană',  'R2 mm'],
      ['Umăr',          '46,5°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '29,9 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 FI12.3K.png',
      pdf: '/welding-drawings/PIN-12.3-29.9-01__M10-FI12.3K__R00.pdf',
      cad: null,
    },
    // JSON-ul primit plasează CORECT gâtul (21 → 24) și umărul sub el —
    // structura e bună. Măsurătoare calibrată pe 6 cote (Δ max 0,041mm).
    //   • con: 6 puncte față de dreapta din JSON — Δ max 0,031mm ✓
    //   • gât Ø8,5: rază 4,271 constantă (21,0 → 24,0) ✓
    //   • bază Ø14,5: r măsurat 7,226 vs 7,25 ✓
    //   • șamfren: pantă măsurată -> unghi inclus 59,75° (cotat 60°) ✓
    //
    // ⚠️ UMĂR: JSON presupunea 45° (început la Y=19,10). Regresia pe 10 puncte
    // dă panta 0,9379 -> 46,84°, cu începutul la Y=18,994. Am folosit 19,0
    // (Δr=1,9 / ΔY=2,0 -> 46,5°). Verificare la Y=19,18: varianta 45° prezice
    // r=6,09, varianta 46,5° prezice 5,98, iar măsurătoarea dă 5,998 — deci
    // 46,5° se potrivește. Regresia e ancorată bine sus (r=4,25 la Y=21,020
    // față de 21,0 cotat).
    //
    // ⚠️ COTA „2,14" pare o mică eroare de cotare. Cu șamfren 60° exact și
    // corpul pornind de la Y=4, rezultă 2,0947 (Δ 0,045 față de 2,14). La
    // celelalte trei piese M10 potrivirea a fost exactă (2,008 / 2,095 /
    // 2,614 față de 2,01 / 2,09 / 2,61 cotate). Am folosit 2,0947.
    //
    // STRUCTURA (Y=0 bază → Y=29,9 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.0947]
    //   • șamfren 60° Ø14,5→Ø12,3            Y ∈ [2.0947, 4.00]
    //   • corp cilindric Ø12,3               Y ∈ [4.00, 19.00]
    //   • umăr 46,5° Ø12,3→Ø8,5              Y ∈ [19.00, 21.00]
    //   • gât cilindric Ø8,5 (3 mm)          Y ∈ [21.00, 24.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.00, 28.8133]
    //   • coroană (arc R2, tangent 0°)       Y ∈ [28.8133, 29.90]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.0947],
        [6.15,    4.0],
        [6.15,    19.0],
        [4.25,    21.0],
        [4.25,    24.0],
        [1.779282343818, 28.813320502878],
        [1.615,   29.0797],
        [1.4112,  29.3172],
        [1.1728,  29.52],
        [0.9057,  29.6832],
        [0.6164,  29.8026],
        [0.312,   29.8755],
        [0.0,     29.9],
      ],
      height: 29.9,
      footprint: 19,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/M10 FI12.3K.png',
      pdf: '/welding-drawings/PIN-12.3-29.9-01__M10-FI12.3K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.0,   r: 7.25, lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 11,    r: 6.15, lineY: 33, label: 'Ø12,3', radial: true  },
          { type: 'diameter', y: 22.5,  r: 4.25, lineY: 36, label: 'Ø8,5',  radial: false },
          { type: 'diameter', y: 28.81, r: 1.78, lineY: 39, label: 'Ø3,6',  radial: false },
          { type: 'length', y1: 0, y2: 29.9,  edgeR1: 7.25, edgeR2: 0,    label: 'L 29,9', radial: false },
          { type: 'length', y1: 0, y2: 28.81, edgeR1: 7.25, edgeR2: 1.78, label: '28,81', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 7.25, edgeR2: 4.25, label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 7.25, edgeR2: 4.25, label: '21',    radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 7.25, edgeR2: 6.15, label: '4',     radial: false },
          { type: 'length', y1: 0, y2: 2.14,  edgeR1: 7.25, edgeR2: 7.25, label: '2,14',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0018',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.5-29.87-01',     // Ø corp (12,5mm) · L=29,87mm
    },
    docerawEquivalent: 'M10 FI12.5K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,5 · L29,87',
    specs: [
      ['Ø corp',        '12,5 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '4,07 mm'],
      ['Rază coroană',  'R2,25 mm'],
      ['Umăr',          '90°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '29,87 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 FI12.5K.png',
      pdf: '/welding-drawings/PIN-12.5-29.87-01__M10-FI12.5K__R00.pdf',
      cad: null,
    },
    // ⚠️ CORECȚIE — JSON-ul plasa greșit umărul: susținea umăr 21→23 și gât
    // 23→24 (doar 1mm). Măsurătoarea arată că cotele 21 și 24 ÎNCADREAZĂ
    // GÂTUL (3mm), iar umărul e sub ele. Aceeași eroare ca la piesa 0016.
    //
    // Măsurătoare calibrată pe 5 cote (Δ max 0,075mm). Verificări:
    //   • UMĂR: regresia pe 10 puncte dă panta -1,0016 -> unghi inclus 90,09°,
    //     confirmând cei 90° cotați. Poziția reală: r=6,25 la Y=19,041 și
    //     r=4,25 la Y=21,037 -> umăr 19,0 → 21,0.
    //   • gât Ø8,5: rază 4,24 constantă (21,0 → 24,0) ✓
    //   • con: 11 puncte față de dreapta din JSON — Δ max 0,039mm ✓
    //   • șamfren bază 60°: 4,0 - 1,0·tan60 = 2,268 (cotat 2,27) ✓
    //
    // Notă: JSON raporta un conflict mare la cota de tangență („28,94",
    // reziduu -0,34mm). Desenul arată însă 28,54 — JSON a citit greșit.
    // Reziduul real față de valoarea calculată (28,5996) e doar +0,060mm.
    //
    // Desenul e trasat la L=29,8 (calibrare Δ max 0,075mm); 29,87 e corecția
    // roșie confirmată de cartuș, folosită pentru con + coroană.
    //
    // STRUCTURA (Y=0 bază → Y=29,87 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.2679]
    //   • șamfren 60° Ø14,5→Ø12,5            Y ∈ [2.2679, 4.00]
    //   • corp cilindric Ø12,5               Y ∈ [4.00, 19.00]
    //   • umăr 90° Ø12,5→Ø8,5                Y ∈ [19.00, 21.00]
    //   • gât cilindric Ø8,5 (3 mm)          Y ∈ [21.00, 24.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.00, 28.5996]
    //   • coroană (arc R2,25, tangent 0°)    Y ∈ [28.5996, 29.87]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.2679],
        [6.25,    4.0],
        [6.25,    19.0],
        [4.25,    21.0],
        [4.25,    24.0],
        [2.025560383089, 28.599594372411],
        [1.8436,  28.9099],
        [1.6144,  29.1872],
        [1.344,   29.4245],
        [1.0393,  29.6156],
        [0.708,   29.7557],
        [0.3586,  29.8412],
        [0.0,     29.87],
      ],
      height: 29.87,
      footprint: 19,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/M10 FI12.5K.png',
      pdf: '/welding-drawings/PIN-12.5-29.87-01__M10-FI12.5K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 7.25, lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 11,    r: 6.25, lineY: 33, label: 'Ø12,5', radial: true  },
          { type: 'diameter', y: 22.5,  r: 4.25, lineY: 36, label: 'Ø8,5',  radial: false },
          { type: 'diameter', y: 28.54, r: 2.03, lineY: 39, label: 'Ø4,07', radial: false },
          { type: 'length', y1: 0, y2: 29.87, edgeR1: 7.25, edgeR2: 0,    label: 'L 29,87', radial: false },
          { type: 'length', y1: 0, y2: 28.54, edgeR1: 7.25, edgeR2: 2.03, label: '28,54',  radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 7.25, edgeR2: 4.25, label: '24',     radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 7.25, edgeR2: 4.25, label: '21',     radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 7.25, edgeR2: 6.25, label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 2.27,  edgeR1: 7.25, edgeR2: 7.25, label: '2,27',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0019',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.8-29.7-01',      // Ø corp (12,8mm) · L=29,7mm
    },
    docerawEquivalent: 'M10 FI12.8K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,8 · L29,7',
    specs: [
      ['Ø corp',        '12,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,8 mm'],
      ['Rază coroană',  'R2 mm'],
      ['Umăr',          '47,1°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '29,7 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 FI12.8K.png',
      pdf: '/welding-drawings/PIN-12.8-29.7-01__M10-FI12.8K__R00.pdf',
      cad: null,
    },
    // JSON-ul plasează CORECT gâtul (21 → 24). Măsurătoare calibrată pe 6 cote
    // (Δ max 0,052mm). Verificări:
    //   • gât Ø8,5: rază 4,24 constantă (21,0 → 24,0) ✓
    //   • con: regresia dă r=4,25 la Y=24,033 (cotat 24,0) ✓
    //   • șamfren bază 60°: 4,0 - 0,85·tan60 = 2,528 (cotat 2,53) ✓
    //
    // ⚠️ UMĂR: JSON presupunea 45° (început la Y=18,85). Măsurătoarea dă
    // 19,03 → 21,02, deci Δr=2,15 pe ΔY=2,0 -> 47,1°. Am folosit 19,0 → 21,0.
    //
    // ⚠️ CONFLICT DE COTARE la vârf: R2 + Ø3,8 + Y=28,61 + vârf 29,7 nu sunt
    // simultan compatibile. Cu R2 exact și tangență 0°, diametrul la tangență
    // iese Ø3,53 (reziduu -0,27mm față de Ø3,8 cotat). Analiza arată că:
    //   – R=2,15 ar da exact Ø3,82 la tangență
    //   – regresia pe conul desenat atinge Ø3,8 la Y=28,665 (cotat 28,61)
    // Deci conul desenat e auto-consistent cu Ø3,8, dar raza R2 forțează un
    // vârf mai îngust. Am prioritizat R2 (cotat explicit) + tangență 0°, ca
    // JSON-ul. Diferența vizuală e sub 0,3mm pe diametru, la vârf.
    // De verificat în CAD dacă raza reală e R2 sau ~R2,15.
    //
    // STRUCTURA (Y=0 bază → Y=29,7 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.5278]
    //   • șamfren 60° Ø14,5→Ø12,8            Y ∈ [2.5278, 4.00]
    //   • corp cilindric Ø12,8               Y ∈ [4.00, 19.00]
    //   • umăr 47,1° Ø12,8→Ø8,5              Y ∈ [19.00, 21.00]
    //   • gât cilindric Ø8,5 (3 mm)          Y ∈ [21.00, 24.00]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.00, 28.6441]
    //   • coroană (arc R2, tangent 0°)       Y ∈ [28.6441, 29.70]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.5278],
        [6.4,     4.0],
        [6.4,     19.0],
        [4.25,    21.0],
        [4.25,    24.0],
        [1.763126518803, 28.644131812139],
        [1.5972,  28.9037],
        [1.3935,  29.1347],
        [1.1566,  29.3316],
        [0.8924,  29.4899],
        [0.6069,  29.6057],
        [0.3071,  29.6763],
        [0.0,     29.7],
      ],
      height: 29.7,
      footprint: 19,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/M10 FI12.8K.png',
      pdf: '/welding-drawings/PIN-12.8-29.7-01__M10-FI12.8K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 7.25, lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 11,    r: 6.4,  lineY: 33, label: 'Ø12,8', radial: true  },
          { type: 'diameter', y: 22.5,  r: 4.25, lineY: 36, label: 'Ø8,5',  radial: false },
          { type: 'diameter', y: 28.61, r: 1.9,  lineY: 39, label: 'Ø3,8',  radial: false },
          { type: 'length', y1: 0, y2: 29.7,  edgeR1: 7.25, edgeR2: 0,    label: 'L 29,7', radial: false },
          { type: 'length', y1: 0, y2: 28.61, edgeR1: 7.25, edgeR2: 1.9,  label: '28,61', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 7.25, edgeR2: 4.25, label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 7.25, edgeR2: 4.25, label: '21',    radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 7.25, edgeR2: 6.4,  label: '4',     radial: false },
          { type: 'length', y1: 0, y2: 2.53,  edgeR1: 7.25, edgeR2: 7.25, label: '2,53',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0020',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.9-29.8-01',      // Ø corp (12,9mm) · L=29,8mm
    },
    docerawEquivalent: 'M10 FI12.9K',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,9 · L29,8',
    specs: [
      ['Ø corp',        '12,9 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,5 mm  (+0 / -0,1)'],
      ['Ø ref. vârf',   '3,49 mm'],
      ['Rază coroană',  'R1,9 mm'],
      ['Umăr',          '45°'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '29,8 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/M10 FI12.9K.png',
      pdf: '/welding-drawings/PIN-12.9-29.8-01__M10-FI12.9K__R00.pdf',
      cad: null,
    },
    // ⚠️ DOUĂ CORECȚII față de JSON-ul primit.
    // Măsurătoare calibrată pe 5 cote (Δ max 0,064mm).
    //
    // 1. BAZĂ: JSON presupunea un umăr de 45° (tranziție 2,8 → 3,6), ignorând
    //    cota 2,21 de pe desen. În realitate e un ȘAMFREN 60°, ca la restul
    //    familiei M10: 3,6 - 0,8·tan60 = 2,2144, adică exact cota 2,21 ✓
    //    Măsurătoarea confirmă (tranziție 2,30 → 3,63).
    //
    // 2. ZONA SUPERIOARĂ: JSON plasa tranziția 20,7 → 22,1 și gâtul 22,1 →
    //    23,7 (1,6mm), introducând o cotă „22,1" care NU există pe desen.
    //    Cotele 20,7 și 23,7 ÎNCADREAZĂ GÂTUL (3mm), tranziția e sub ele:
    //    regresia pe 8 puncte dă panta -1,0000 -> 45° exact, deci umărul e
    //    18,5 → 20,7. Gâtul măsurat: rază constantă de la Y=20,92 la 23,83 ✓
    //
    // Con verificat: 16 puncte față de dreapta din JSON — Δ max 0,026mm ✓
    // Regresia conului dă r=4,25 la Y=23,708 (cotat 23,7) ✓
    //
    // Desenul e trasat la L=29,65 (calibrare Δ max 0,064mm); 29,8 e corecția
    // roșie confirmată de cartuș, folosită pentru con + coroană.
    //
    // STRUCTURA (Y=0 bază → Y=29,8 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.214]
    //   • șamfren 60° Ø14,5→Ø12,9            Y ∈ [2.214, 3.60]
    //   • corp cilindric Ø12,9               Y ∈ [3.60, 18.50]
    //   • umăr 45° Ø12,9→Ø8,5                Y ∈ [18.50, 20.70]
    //   • gât cilindric Ø8,5 (3 mm)          Y ∈ [20.70, 23.70]
    //   • con tangent la coroană (eroare 0°) Y ∈ [23.70, 28.7566]
    //   • coroană (arc R1,9, tangent 0°)     Y ∈ [28.7566, 29.80]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.214],
        [6.45,    3.6],
        [6.45,    18.5],
        [4.25,    20.7],
        [4.25,    23.7],
        [1.695942684375, 28.756608668713],
        [1.5405,  29.0121],
        [1.3469,  29.2401],
        [1.1199,  29.4349],
        [0.8651,  29.5916],
        [0.589,   29.7064],
        [0.2982,  29.7765],
        [0.0,     29.8],
      ],
      height: 29.8,
      footprint: 19,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/M10 FI12.9K.png',
      pdf: '/welding-drawings/PIN-12.9-29.8-01__M10-FI12.9K__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.0,   r: 7.25, lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 11,    r: 6.45, lineY: 33, label: 'Ø12,9', radial: true  },
          { type: 'diameter', y: 22.2,  r: 4.25, lineY: 36, label: 'Ø8,5',  radial: false },
          { type: 'diameter', y: 28.61, r: 1.745,lineY: 39, label: 'Ø3,49', radial: false },
          { type: 'length', y1: 0, y2: 29.8,  edgeR1: 7.25, edgeR2: 0,     label: 'L 29,8', radial: false },
          { type: 'length', y1: 0, y2: 28.61, edgeR1: 7.25, edgeR2: 1.745, label: '28,61', radial: false },
          { type: 'length', y1: 0, y2: 23.7,  edgeR1: 7.25, edgeR2: 4.25,  label: '23,7',  radial: false },
          { type: 'length', y1: 0, y2: 20.7,  edgeR1: 7.25, edgeR2: 4.25,  label: '20,7',  radial: false },
          { type: 'length', y1: 0, y2: 3.6,   edgeR1: 7.25, edgeR2: 6.45,  label: '3,6',   radial: false },
          { type: 'length', y1: 0, y2: 2.21,  edgeR1: 7.25, edgeR2: 7.25,  label: '2,21',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0021',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-6.1-28-01',         // Ø corp (6,1mm) · L=28mm
    },
    docerawEquivalent: 'PK6-610-110',
    family: 'pcp',
    name: 'Ceramic centering pin Ø6,1 · L28',
    specs: [
      ['Ø corp',        '6,1 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '4,8 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '1,74 mm'],
      ['Rază coroană',  'R1 mm'],
      ['Umăr',          '45,5° (inclus)'],
      ['Șamfren bază',  '60°'],
      ['L (total)',     '28 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/Pk6-610-110.png',
      pdf: '/welding-drawings/PIN-6.1-28-01__PK6-610-110__R00.pdf',
      cad: null,
    },
    // Măsurătoare calibrată pe 5 cote — scară exact 11,0 px/mm, Δ max 0,045mm.
    // Baza, conul și coroana din JSON sunt CORECTE:
    //   • șamfren bază: 60,85° măsurat; r=5,5 la Y=2,296 (cotat 2,26) și
    //     r=3,05 la Y=6,468 (cotat 6,5) ✓
    //   • con + coroană R1: reziduuri sub 0,004mm în JSON, confirmate ✓
    //
    // ⚠️ UMĂR — diferență de interpretare a unghiului. JSON a tratat „45°"
    // ca linie la 45° față de axe (pantă 1,0), rezultând umăr 21,5 → 22,15.
    // Măsurătoarea dă panta 0,4196, adică un unghi INCLUS de 45,53°
    // (tan 22,5° = 0,4142 pentru 45° inclus exact). Rezultă umăr 21,5 → 23,0:
    //   r=3,05 la Y=21,468 (cotat 21,5 ✓) și r=2,40 la Y=23,017.
    // Consecință: gâtul e 23,0 → 24,8 (1,8mm), nu 22,15 → 24,8 (2,65mm).
    //
    // STRUCTURA (Y=0 bază → Y=28 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  2.2565]
    //   • șamfren 60° Ø11→Ø6,1               Y ∈ [2.2565, 6.50]
    //   • corp cilindric Ø6,1                Y ∈ [6.50, 21.50]
    //   • umăr 45,5° inclus Ø6,1→Ø4,8        Y ∈ [21.50, 23.00]
    //   • gât cilindric Ø4,8 (1,8 mm)        Y ∈ [23.00, 24.80]
    //   • con tangent la coroană (eroare 0°) Y ∈ [24.80, 27.4940]
    //   • coroană (arc R1, tangent 0°)       Y ∈ [27.4940, 28.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     2.2565],
        [3.05,    6.5],
        [3.05,    21.5],
        [2.4,     23.0],
        [2.4,     24.8],
        [0.869476480125, 27.493974341955],
        [0.7855,  27.6188],
        [0.6838,  27.7297],
        [0.5666,  27.824],
        [0.4366,  27.8997],
        [0.2967,  27.955],
        [0.15,    27.9887],
        [0.0,     28.0],
      ],
      height: 28.0,
      footprint: 15,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/Pk6-610-110.png',
      pdf: '/welding-drawings/PIN-6.1-28-01__PK6-610-110__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 5.5,  lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 14,    r: 3.05, lineY: 31, label: 'Ø6,1',  radial: true  },
          { type: 'diameter', y: 23.9,  r: 2.4,  lineY: 34, label: 'Ø4,8',  radial: false },
          { type: 'diameter', y: 27.49, r: 0.87, lineY: 37, label: 'Ø1,74', radial: false },
          { type: 'length', y1: 0, y2: 28,    edgeR1: 5.5, edgeR2: 0,    label: 'L 28',   radial: false },
          { type: 'length', y1: 0, y2: 27.49, edgeR1: 5.5, edgeR2: 0.87, label: '27,49', radial: false },
          { type: 'length', y1: 0, y2: 24.8,  edgeR1: 5.5, edgeR2: 2.4,  label: '24,8',  radial: false },
          { type: 'length', y1: 0, y2: 21.5,  edgeR1: 5.5, edgeR2: 3.05, label: '21,5',  radial: false },
          { type: 'length', y1: 0, y2: 6.5,   edgeR1: 5.5, edgeR2: 3.05, label: '6,5',   radial: false },
          { type: 'length', y1: 0, y2: 2.26,  edgeR1: 5.5, edgeR2: 5.5,  label: '2,26',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0022',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-7.3-31-01',         // Ø corp (7,3mm) · L=31mm
    },
    docerawEquivalent: 'ST M6 1',
    family: 'pcp',
    name: 'Ceramic centering pin Ø7,3 · L31',
    specs: [
      ['Ø corp',        '7,3 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø gât',         '5,2 mm  (+0 / -0,05)'],
      ['Ø vârf plat',   '2 mm'],
      ['Umăr',          '90° (inclus)'],
      ['Tranziție bază','90°'],
      ['L (total)',     '31 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ST M6 1.png',
      pdf: '/welding-drawings/PIN-7.3-31-01__ST-M6-1__R00.pdf',
      cad: null,
    },
    // Piesă cu vârf PLAT (fără coroană radiusată): conul se termină direct
    // într-o față plană Ø2.
    //
    // Măsurătoare calibrată pe 6 cote (Δ max 0,030mm). Verificări:
    //   • pinten Ø5,5 + flanșă Ø11,5 + tranziție 90° (Δr=ΔY=2,1) ✓
    //   • UMĂR: regresia dă panta -1,0750 și r=3,65 la Y=24,510 (cotat 24,5) ✓
    //     Presupunerea de 45° din JSON e corectă aici (capăt la 25,55;
    //     măsurat 25,487 — Δ 0,06mm, în limita erorii de măsurare).
    //
    // ⚠️ CORECȚIE LA VÂRF: JSON presupunea conul 28 → 30 urmat de un cilindru
    // Ø2 de 1mm (30 → 31). Măsurătoarea arată că nu există cilindru: conul
    // merge direct de la Y=28 la Y=31, unde se termină cu o față plată Ø2.
    // Dovezi: regresia pe 6 puncte dă r=1,0 la Y=30,990 (nu la 30,0), iar
    // unghiul măsurat 55,65° coincide cu cel teoretic pentru un con 28→31
    // (56,14°). La Y=30,90 muchia e deja la r=1,01, deci conul continuă.
    //
    // STRUCTURA (Y=0 bază pinten → Y=31 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  3.40]
    //   • tranziție 90° Ø11,5→Ø7,3           Y ∈ [3.40,  5.50]
    //   • corp cilindric Ø7,3                Y ∈ [5.50, 24.50]
    //   • umăr 90° Ø7,3→Ø5,2                 Y ∈ [24.50, 25.55]
    //   • gât cilindric Ø5,2 (2,45 mm)       Y ∈ [25.55, 28.00]
    //   • con Ø5,2→Ø2 (56,1° inclus)         Y ∈ [28.00, 31.00]
    //   • față plată Ø2 la vârf              Y = 31.00
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [5.75,    2.0],
        [5.75,    3.4],
        [3.65,    5.5],
        [3.65,    24.5],
        [2.6,     25.55],
        [2.6,     28.0],
        [1.0,     31.0],
        [0.0,     31.0],
      ],
      height: 31.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ST M6 1.png',
      pdf: '/welding-drawings/PIN-7.3-31-01__ST-M6-1__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.7,   r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 15,    r: 3.65, lineY: 35, label: 'Ø7,3',  radial: true  },
          { type: 'diameter', y: 26.8,  r: 2.6,  lineY: 38, label: 'Ø5,2',  radial: false },
          { type: 'diameter', y: 31,    r: 1.0,  lineY: 41, label: 'Ø2',    radial: false },
          { type: 'length', y1: 0, y2: 31,   edgeR1: 5.75, edgeR2: 1.0,  label: 'L 31',  radial: false },
          { type: 'length', y1: 0, y2: 28,   edgeR1: 5.75, edgeR2: 2.6,  label: '28',    radial: false },
          { type: 'length', y1: 0, y2: 24.5, edgeR1: 5.75, edgeR2: 3.65, label: '24,5',  radial: false },
          { type: 'length', y1: 0, y2: 5.5,  edgeR1: 5.75, edgeR2: 3.65, label: '5,5',   radial: false },
          { type: 'length', y1: 0, y2: 3.4,  edgeR1: 5.75, edgeR2: 5.75, label: '3,4',   radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 2.75, edgeR2: 2.75, label: '2',     radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0023',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-7.5-31-01',         // Ø corp (7,5mm) · L=31mm
    },
    docerawEquivalent: 'ST2 M6.2',
    family: 'pcp',
    name: 'Ceramic centering pin Ø7,5 · L31',
    specs: [
      ['Ø corp',        '7,5 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø ref. vârf',   '3,37 mm'],
      ['Rază coroană',  'R1,75 mm'],
      ['Unghi con',     '31,9° (inclus)'],
      ['Tranziție bază','90°'],
      ['L (total)',     '31 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ST2 M6.2.png',
      pdf: '/welding-drawings/PIN-7.5-31-01__ST2-M6.2__R00.pdf',
      cad: null,
    },
    // ✅ JSON-ul primit e CORECT integral — nicio corecție necesară.
    // Prima piesă din serie fără gât și fără umăr: conul pornește DIRECT din
    // corpul Ø7,5 la Y=22,5 (confirmat prin măsurătoare — corpul e constant
    // până la Y=22,40, apoi raza scade imediat).
    //
    // Măsurătoare calibrată pe 5 cote (Δ max 0,028mm). Verificări:
    //   • con: 18 puncte față de dreapta din JSON — Δ max 0,038mm ✓
    //   • regresia conului: unghi inclus 31,81° (JSON 31,91°); r=3,75 la
    //     Y=22,489 (cotat 22,5) și r=1,685 la Y=29,736 față de tangența
    //     calculată la 29,731 — Δ 0,005mm ✓
    //   • pinten Ø5,5 + flanșă Ø11,5 + tranziție 90° (Δr=ΔY=2,0) ✓
    //
    // STRUCTURA (Y=0 bază pinten → Y=31 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø11,5     Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  3.50]
    //   • tranziție 90° Ø11,5→Ø7,5           Y ∈ [3.50,  5.50]
    //   • corp cilindric Ø7,5                Y ∈ [5.50, 22.50]
    //   • con 31,9° tangent la coroană (0°)  Y ∈ [22.50, 29.7311]
    //   • coroană (arc R1,75, tangent 0°)    Y ∈ [29.7311, 31.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [5.75,    2.0],
        [5.75,    3.5],
        [3.75,    5.5],
        [3.75,    22.5],
        [1.682580761413, 29.73106338597],
        [1.5833,  29.9954],
        [1.4428,  30.2404],
        [1.2647,  30.4595],
        [1.0537,  30.6472],
        [0.8153,  30.7985],
        [0.5556,  30.9095],
        [0.2815,  30.9772],
        [0.0,     31.0],
      ],
      height: 31.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ST2 M6.2.png',
      pdf: '/welding-drawings/PIN-7.5-31-01__ST2-M6.2__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.7,   r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 14,    r: 3.75, lineY: 35, label: 'Ø7,5',  radial: true  },
          { type: 'diameter', y: 29.73, r: 1.68, lineY: 38, label: 'Ø3,37', radial: false },
          { type: 'length', y1: 0, y2: 31,   edgeR1: 5.75, edgeR2: 0,    label: 'L 31',  radial: false },
          { type: 'length', y1: 0, y2: 22.5, edgeR1: 5.75, edgeR2: 3.75, label: '22,5',  radial: false },
          { type: 'length', y1: 0, y2: 5.5,  edgeR1: 5.75, edgeR2: 3.75, label: '5,5',   radial: false },
          { type: 'length', y1: 0, y2: 3.5,  edgeR1: 5.75, edgeR2: 5.75, label: '3,5',   radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 2.75, edgeR2: 2.75, label: '2',     radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0024',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-6.6-29.9-01',       // Ø corp (6,6mm) · L=29,9mm
    },
    docerawEquivalent: 'ST3 M6',
    family: 'pcp',
    name: 'Ceramic centering pin Ø6,6 · L29,9',
    specs: [
      ['Ø corp',        '6,6 mm  (+0 / -0,05)'],
      ['Ø flanșă',      '13,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø la Y=27',     '4 mm'],
      ['Ø ref. vârf',   '1,81 mm'],
      ['Rază fileu',    'R0,5 mm'],
      ['Rază coroană',  'R1 mm'],
      ['Tranziție bază','90°'],
      ['L (total)',     '29,9 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ST3 M6.png',
      pdf: '/welding-drawings/PIN-6.6-29.9-01__ST3-M6__R00.pdf',
      cad: null,
    },
    // Măsurătoare calibrată pe 6 cote (Δ max 0,038mm). Baza și vârful din
    // JSON sunt corecte:
    //   • pinten Ø5,5 + flanșă Ø13,5 + tranziție 90° (Δr=ΔY=3,45) ✓
    //   • sistemul R0,5 → con → R1 e unic determinat, tangențe 0° ✓
    //
    // ⚠️ ZONA CORP→VÂRF: JSON presupunea umăr 45° (23,5 → 24,8) urmat de gât
    // drept Ø4 (24,8 → 27). Harta de pixeli arată altceva:
    //   – la Y=23,54 există o FAȚĂ RADIALĂ (linie orizontală continuă în
    //     desen, muchiile trec brusc de la r=3,29 la r=2,39 într-un singur px)
    //   – între Y=23,5 și 27 profilul e o CONICITATE FOARTE LENTĂ, nu un
    //     cilindru: r scade de la 2,39 (Y=23,64) la 2,01 (Y=26,72),
    //     pantă -0,120 (muchiile migrează progresiv x=365→368 / 410→406)
    // Verificare la Y=24,8: JSON prezice r=2,00, măsurat 2,28 (Δ 0,28mm).
    // Am folosit profilul măsurat.
    //
    // STRUCTURA (Y=0 bază pinten → Y=29,9 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø13,5     Y = 2.00
    //   • flanșă cilindrică Ø13,5            Y ∈ [2.00,  4.05]
    //   • tranziție 90° Ø13,5→Ø6,6           Y ∈ [4.05,  7.50]
    //   • corp cilindric Ø6,6                Y ∈ [7.50, 23.50]
    //   • față radială Ø6,6→Ø4,84            Y = 23.50
    //   • con lent Ø4,84→Ø4                  Y ∈ [23.50, 27.00]
    //   • fileu R0,5 (tangent)               Y ∈ [27.00, 27.2221]
    //   • con tangent la R0,5 și R1 (0°)     Y ∈ [27.2221, 29.3442]
    //   • coroană (arc R1, tangent 0°)       Y ∈ [29.3442, 29.90]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [6.75,    2.0],
        [6.75,    4.05],
        [3.3,     7.5],
        [3.3,     23.5],
        [2.42,    23.5],
        [2.0,     27.0],
        [1.9941,  27.0764],
        [1.9766,  27.151],
        [1.948,   27.2221],
        [0.895944253803, 29.34416651616],
        [0.8145,  29.4801],
        [0.7126,  29.6015],
        [0.5929,  29.7053],
        [0.4582,  29.7889],
        [0.312,   29.8501],
        [0.158,   29.8874],
        [0.0,     29.9],
      ],
      height: 29.9,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ST3 M6.png',
      pdf: '/welding-drawings/PIN-6.6-29.9-01__ST3-M6__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 3,     r: 6.75, lineY: -4, label: 'Ø13,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 15,    r: 3.3,  lineY: 34, label: 'Ø6,6',  radial: true  },
          { type: 'diameter', y: 27,    r: 2.0,  lineY: 37, label: 'Ø4',    radial: false },
          { type: 'diameter', y: 29.34, r: 0.9,  lineY: 40, label: 'Ø1,81', radial: false },
          { type: 'length', y1: 0, y2: 29.9, edgeR1: 6.75, edgeR2: 0,    label: 'L 29,9', radial: false },
          { type: 'length', y1: 0, y2: 27,   edgeR1: 6.75, edgeR2: 2.0,  label: '27',     radial: false },
          { type: 'length', y1: 0, y2: 23.5, edgeR1: 6.75, edgeR2: 3.3,  label: '23,5',   radial: false },
          { type: 'length', y1: 0, y2: 7.5,  edgeR1: 6.75, edgeR2: 3.3,  label: '7,5',    radial: false },
          { type: 'length', y1: 0, y2: 4.05, edgeR1: 6.75, edgeR2: 6.75, label: '4,05',   radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 2.75, edgeR2: 2.75, label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0025',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8-34-01',           // Ø corp (8mm) · L=34mm
    },
    docerawEquivalent: 'Stift M6 D 8',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8 · L34',
    specs: [
      ['Ø corp',        '8 mm  (-0,05 / -0,1)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø gât',         '4,9 mm  (+0 / -0,1)'],
      ['Ø ref. vârf',   '3 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Fileu bază',    'R0,3 mm'],
      ['Umăr superior', '60° (inclus)'],
      ['Umăr inferior', '90° (inclus)'],
      ['L (total)',     '34 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/Stift M6 D 8.png',
      pdf: '/welding-drawings/PIN-8-34-01__Stift-M6-D-8__R00.pdf',
      cad: null,
    },
    // Măsurătoare calibrată pe 7 cote (Δ max 0,069mm). Baza din JSON e
    // corectă: pinten Ø5,5 + fileu R0,3 + flanșă Ø11,5 + umăr 90° inclus
    // (regresia dă panta -1,0036, cu r=5,75 la Y=3,48 și r=4,0 la Y=5,22,
    // față de 3,5 și 5,25 cotate) ✓
    //
    // ⚠️ DE REVERIFICAT (deschis la 2026-07-24): pe piesa-soră 0026
    // („Stift M6 scurt D 8.1") leader-ul R0,3 țintește PICIORUL PINTENULUI,
    // iar pixelii confirmă un racord CONCAV acolo + muchie ascuțită pe OD-ul
    // flanșei. Aici R0,3 e modelat invers — rotunjire CONVEXĂ pe OD-ul
    // flanșei (punctele [5.45, 2.0] … [5.75, 2.3]). Dacă desenul 0025 are
    // aceeași cotare, trebuie inversat la fel ca la 0026. Nu l-am schimbat
    // fără remăsurare — trimite PNG-ul „Stift M6 D 8.png" și îl verific.
    //
    // ⚠️ CORECȚIE — UMĂR SUPERIOR: JSON îl plasa la 27,0 → 28,55 (45°), cu
    // gât de doar 0,95mm. Măsurătoarea arată că umărul e SUB Y=27, iar
    // cotele 27 și 29,5 încadrează GÂTUL (2,5mm). Unghiul real e 60° INCLUS,
    // nu 45°: verificat în 3 puncte independente (Δ 0,004 / 0,007 / 0,009mm).
    // Umărul pornește de la Y = 27 - 1,55/tan30° = 24,315.
    //
    // Notă asupra ambiguităților semnalate de JSON:
    //   • „R17,5" — profilul flancului măsurat pare ușor curbat (panta scade
    //     de la -0,348 la -0,247), dar peste incertitudinea de cuantizare
    //     (±0,047mm pe rază) diferența nu e concludentă. Conul drept al
    //     JSON-ului se potrivește cu Δ max 0,07mm, deci l-am păstrat.
    //   • „R1" la umărul inferior — nu poate fi plasat unic din cote; am
    //     modelat colțul ascuțit, ca JSON-ul. Efect vizual sub 0,1mm.
    //
    // STRUCTURA (Y=0 bază pinten → Y=34 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  2.00]
    //   • față radială + fileu R0,3          Y ∈ [2.00,  2.30]
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.30,  3.50]
    //   • umăr 90° Ø11,5→Ø8                  Y ∈ [3.50,  5.25]
    //   • corp cilindric Ø8                  Y ∈ [5.25, 24.315]
    //   • umăr 60° Ø8→Ø4,9                   Y ∈ [24.315, 27.00]
    //   • gât cilindric Ø4,9 (2,5 mm)        Y ∈ [27.00, 29.50]
    //   • con tangent la coroană (eroare 0°) Y ∈ [29.50, 32.9248]
    //   • coroană (arc R1,5, tangent 0°)     Y ∈ [32.9248, 34.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    2.0],
        [5.45,    2.0],
        [5.6,     2.0402],
        [5.7098,  2.15],
        [5.75,    2.3],
        [5.75,    3.5],
        [4.0,     5.25],
        [4.0,     24.315],
        [2.45,    27.0],
        [2.45,    29.5],
        [1.438579516887, 32.924839938791],
        [1.337,   33.1801],
        [1.1905,  33.4125],
        [1.0042,  33.6143],
        [0.7842,  33.7787],
        [0.5379,  33.9003],
        [0.2735,  33.9749],
        [0.0,     34.0],
      ],
      height: 34.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/Stift M6 D 8.png',
      pdf: '/welding-drawings/PIN-8-34-01__Stift-M6-D-8__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.9,   r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 1,     r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 15,    r: 4.0,  lineY: 38, label: 'Ø8',    radial: true  },
          { type: 'diameter', y: 28.2,  r: 2.45, lineY: 41, label: 'Ø4,9',  radial: false },
          { type: 'diameter', y: 32.5,  r: 1.5,  lineY: 44, label: 'Ø3',    radial: false },
          { type: 'length', y1: 0, y2: 34,   edgeR1: 5.75, edgeR2: 0,    label: 'L 34',  radial: false },
          { type: 'length', y1: 0, y2: 32.5, edgeR1: 5.75, edgeR2: 1.5,  label: '32,5',  radial: false },
          { type: 'length', y1: 0, y2: 29.5, edgeR1: 5.75, edgeR2: 2.45, label: '29,5',  radial: false },
          { type: 'length', y1: 0, y2: 27,   edgeR1: 5.75, edgeR2: 2.45, label: '27',    radial: false },
          { type: 'length', y1: 0, y2: 5.25, edgeR1: 5.75, edgeR2: 4.0,  label: '5,25',  radial: false },
          { type: 'length', y1: 0, y2: 3.5,  edgeR1: 5.75, edgeR2: 5.75, label: '3,5',   radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 2.75, edgeR2: 2.75, label: '2',     radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0026',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.1-27.5-01',       // Ø corp (8,1mm) · L=27,5mm
    },
    docerawEquivalent: 'Stift M6 scurt D 8.1',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,1 · L27,5',
    specs: [
      ['Ø corp',        '8,1 mm  (-0,05 / -0,1)'],
      ['Ø flanșă',      '11,5 mm'],
      ['Ø pinten',      '5,5 mm'],
      ['Ø gât',         '4,5 mm'],
      ['Ø platou vârf', '1,14 mm'],
      ['Rază coroană',  'R1,5 mm'],
      ['Fileu picior',  'R0,3 mm  (concav)'],
      ['Racord gât',    'R1 mm  (concav)'],
      ['Umăr superior', '60° (inclus)'],
      ['Umăr inferior', '90° (inclus)'],
      ['L (total)',     '27,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/Stift M6 scurt D 8.1.png',
      pdf: '/welding-drawings/PIN-8.1-27.5-01__Stift-M6-scurt-D-8.1__R00.pdf',
      cad: null,
    },
    // Calibrare: scale = 10,70171 px/mm, y0 = 477,638 px, AX = 398,5 px.
    // Regresie pe 7 datum-uri de înălțime (27,5 / 26,08 / 20,89 / 5,2 / 3,5 /
    // 2,0 / 0) → Δ max 0,043mm. Model de rasterizare confirmat: px = floor(true);
    // cu el se reproduc EXACT toate cele 6 diametre cotate + axa
    // (Ø11,5 / Ø8,1 / Ø5,5 / Ø4,5 / Ø4,29 / Ø1,14).
    // Validare forward-raster a profilului final: 279 rânduri, 0 nepotriviri >1px.
    //
    // ⚠️ CORECȚIE 1 — R0,3 e CONCAV la piciorul pintenului, nu convex pe OD.
    // JSON îl punea ca rotunjire convexă pe OD-ul flanșei Ø11,5 (2,75→5,45 la
    // Y=2,0, apoi arc spre 5,75 la Y=2,3) și lăsa piciorul ascuțit. Leader-ul
    // „R0,3" de pe desen țintește (r≈2,85 / Y≈1,74) — adică suprafața
    // pintenului chiar sub flanșă. Pixelii confirmă fără echivoc:
    //   y=457 (Y=1,93): măsurat r=2,855 | concav 2,855 ✓ | JSON 2,750 (Δ 0,105)
    //   y=458 (Y=1,84): măsurat r=2,782 | concav 2,785 ✓ | JSON 2,750
    //   y=454/455:      OD-ul flanșei stă la 5,75 până la Y=2,02 ✓ |
    //                   JSON prezice 5,736 / 5,686 (muchie rotunjită) ✗
    // → arc centrat (3,05 / 1,7), de la (2,75 / 1,7) la (3,05 / 2,0);
    //   muchie ASCUȚITĂ pe OD-ul Ø11,5 la Y=2,0.
    // Vezi și nota de reverificare de la piesa 0025 (modelată invers).
    //
    // ⚠️ CORECȚIE 2 — șamfrenul inferior: JSON îl etichetează „45deg".
    // Pixelii dau pantă 1:1 EXACT (1 px x per 1 px y) → 45° față de axă =
    // 90° INCLUS. Ancorare: r=5,75 la Y=3,514 (cotat 3,5, Δ 0,014) și
    // r=4,05 la Y=5,213 (cotat 5,2, Δ 0,013). Valorile numerice din JSON
    // erau corecte, doar eticheta e ambiguă.
    //
    // ✅ CONFIRMAT (nu presupus) — umărul superior 60° INCLUS: modelul
    // r = 4,05 − tan30°·(Y−20,89) reproduce exact x_stânga ȘI x_dreapta pe
    // tot intervalul y=224…253, 0 px eroare.
    //
    // ✅ CONFIRMAT — R1 la gât: centru (3,25 / 24,275641), tangent la con în
    // (2,383975 / 23,775641) și la Ø4,5 în (2,25 / 24,275641), racord concav.
    // Nu există cotă pentru capătul umărului — rezultă din cei 60°.
    //
    // ⚠️ „CONFLICT" LA COROANĂ — nu e real. JSON raporta
    // „nominal_dimension_conflict" (tangențe 2,98° / 2,94°). Arcul R1,5 prin
    // punctele nominale (2,145 / 26,08) și (0,57 / 27,5), centru
    // (0,647030 / 26,001979), reproduce pixelii 1:1 pe tot y=184…198.
    // Ipoteza alternativă „arc tangent la gât" (centru r=0,75 / Y=26,011)
    // cade: la y=190 prezice x=419, măsurat 418; la y=195 prezice 421,
    // măsurat 420. → păstrăm construcția JSON, inclusiv treapta radială de
    // 0,105mm de la Ø4,5 la Ø4,29 la Y=26,08.
    //
    // ⚠️ CAPCANA LINIILOR DE COTĂ: coloanele x=374/422 (r=±2,243 → Ø4,5) sunt
    // SIMULTAN muchia gâtului și liniile de extensie ale cotei Ø4,5
    // (continue y=77…221). Coloanele x=375/421 (r=±2,149 → Ø4,29) sunt DOAR
    // linii de extensie — segmente asimetrice (y=113…192 + 197…210 pe stânga,
    // 113…192 + 196…208 pe dreapta), deci nu muchie de piesă.
    //
    // Presupunere rămasă: fața radială inferioară a flanșei (r 3,05 → 5,75 la
    // Y=2,0) e acoperită în raster de linia cotei „2"; dedusă din leader-ul
    // R0,3 + terminarea OD-ului la Y=2,02. O cotă de grosime a flanșei
    // măsurată de la Y=2 ar elimina-o.
    //
    // STRUCTURA (Y=0 bază pinten → Y=27,5 vârf):
    //   • pinten cilindric Ø5,5              Y ∈ [0.00,  1.70]
    //   • fileu R0,3 concav (centru 3,05/1,7) Y ∈ [1.70,  2.00]
    //   • față radială flanșă (r 3,05→5,75)  Y = 2.00
    //   • flanșă cilindrică Ø11,5            Y ∈ [2.00,  3.50]
    //   • umăr 90° inclus Ø11,5→Ø8,1         Y ∈ [3.50,  5.20]
    //   • corp cilindric Ø8,1                Y ∈ [5.20, 20.89]
    //   • umăr 60° inclus Ø8,1→Ø4,768        Y ∈ [20.89, 23.7756]
    //   • racord R1 concav (centru 3,25/24,2756) Y ∈ [23.7756, 24.2756]
    //   • gât cilindric Ø4,5                 Y ∈ [24.2756, 26.08]
    //   • treaptă radială Ø4,5 → Ø4,29       Y = 26.08
    //   • coroană R1,5 (centru 0,64703/26,001979) Y ∈ [26.08, 27.50]
    //   • platou plat Ø1,14 la vârf          Y = 27.50
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [2.75,    0.0],
        [2.75,    1.7],
        [2.7558,  1.7585],
        [2.7728,  1.8148],
        [2.8006,  1.8667],
        [2.8379,  1.9121],
        [2.8833,  1.9494],
        [2.9352,  1.9772],
        [2.9915,  1.9942],
        [3.05,    2.0],
        [5.75,    2.0],
        [5.75,    3.5],
        [4.05,    5.2],
        [4.05,    20.89],
        [2.384,   23.7756],
        [2.3261,  23.893],
        [2.2841,  24.0168],
        [2.2586,  24.1451],
        [2.25,    24.2756],
        [2.25,    26.08],
        [2.145,   26.08],
        [2.122,   26.2748],
        [2.0738,  26.4649],
        [2.0012,  26.6471],
        [1.9055,  26.8183],
        [1.7882,  26.9755],
        [1.6515,  27.116],
        [1.4975,  27.2376],
        [1.329,   27.338],
        [1.1489,  27.4155],
        [0.9602,  27.4689],
        [0.7661,  27.4972],
        [0.57,    27.5],
        [0.0,     27.5],
      ],
      height: 27.5,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/Stift M6 scurt D 8.1.png',
      pdf: '/welding-drawings/PIN-8.1-27.5-01__Stift-M6-scurt-D-8.1__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.75,  r: 5.75, lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 0.85,  r: 2.75, lineY: -8, label: 'Ø5,5',  radial: true  },
          { type: 'diameter', y: 13,    r: 4.05, lineY: 31, label: 'Ø8,1',  radial: true  },
          { type: 'diameter', y: 25.2,  r: 2.25, lineY: 34, label: 'Ø4,5',  radial: false },
          { type: 'diameter', y: 27.5,  r: 0.57, lineY: 37, label: 'Ø1,14', radial: false },
          { type: 'length', y1: 0, y2: 27.5,  edgeR1: 2.75, edgeR2: 0.57, label: 'L 27,5', radial: false },
          { type: 'length', y1: 0, y2: 26.08, edgeR1: 2.75, edgeR2: 2.25, label: '26,08', radial: false },
          { type: 'length', y1: 0, y2: 20.89, edgeR1: 2.75, edgeR2: 4.05, label: '20,89', radial: false },
          { type: 'length', y1: 0, y2: 5.2,   edgeR1: 2.75, edgeR2: 4.05, label: '5,2',   radial: false },
          { type: 'length', y1: 0, y2: 3.5,   edgeR1: 2.75, edgeR2: 5.75, label: '3,5',   radial: false },
          { type: 'length', y1: 0, y2: 2,     edgeR1: 2.75, edgeR2: 5.75, label: '2',     radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0027',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12-40-01',          // Ø corp (12mm) · L=40mm
    },
    docerawEquivalent: 'Stift M10 D 12',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12 · L40',
    specs: [
      ['Ø corp',        '12 mm  (-0,05 / -0,1)'],
      ['Ø flanșă',      '16 mm'],
      ['Ø pinten',      '9 mm'],
      ['Ø gât',         '8,3 mm  (+0 / -0,1)'],
      ['Ø ref. vârf',   '3,87 mm'],
      ['Rază coroană',  'R2 mm  (centrată pe axă)'],
      ['Fileu picior',  'R0,3 mm  (concav)'],
      ['Racord corp',   'R1 mm  (concav, umăr inferior)'],
      ['Umăr inferior', '90° (inclus)'],
      ['Umăr superior', '90° (inclus)'],
      ['Unghi con',     '29,19° (inclus)'],
      ['L (total)',     '40 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/Stift M10 D 12.png',
      pdf: '/welding-drawings/PIN-12-40-01__Stift-M10-D-12__R00.pdf',
      cad: null,
    },
    // Calibrare: scale = 10,70557 px/mm, y0 = 587,195 px, AX = 460,0 px.
    // Regresie pe 8 datum-uri (40 / 38,5 / 30 / 25,15 / 5,5 / 3,5 / 2 / 0) →
    // Δ max 0,029mm. Model de rasterizare px = floor(true), imagine pur B/W
    // (2 niveluri de gri, fără antialiasing) — deci pixelii sunt exacți.
    // Toate cele 5 diametre cotate se reproduc exact cu AX=460,0.
    // Validare forward-raster: 413 rânduri, 2 „nepotriviri" — ambele sunt
    // pixeli lipsă din desen (y=302 muchia dreaptă, y=524 muchia stângă),
    // nu erori de model.
    //
    // ⚠️ CORECȚIE 1 — R1 SUPERIOR E LA JONCȚIUNEA GREȘITĂ ÎN JSON.
    // JSON pune R1 între corpul Ø12 și umărul superior (centru 5,0 / 24,7358,
    // colț teoretic Y=25,15). Test strict pe pixeli, zona y=315…323:
    //   y=319 (Y=25,052): măsurat 395/524 | colț ascuțit 395/524 ✓✓ | JSON 396/523 ✗✗
    //   y=320 (Y=24,959): măsurat 395/524 | colț ascuțit 395/524 ✓✓ | JSON 396/523 ✗✗
    // Patru rateuri independente de 1px → la Y=25,15 colțul e ASCUȚIT.
    // Leader-ul „R1" superior are vârful săgeții la (r=4,62 / Y=27,01), adică
    // la joncțiunea UMĂR↔GÂT, nu la Y=25,15 (leader-ul R1 inferior are vârful
    // la (r=6,31 / Y=5,48) → joncțiunea corp↔umăr inferior, unde fileul chiar
    // există). Vezi nota despre Y=27 mai jos.
    //
    // ⚠️ CORECȚIE 2 — R0,3 e CONCAV la piciorul pintenului, nu convex pe OD.
    // JSON îl pune ca rotunjire convexă pe OD-ul flanșei Ø16 (4,5→7,7 la
    // Y=2,0, arc spre 8,0 la Y=2,3). Vârful săgeții „R0,3" e la
    // (r=4,62 / Y=1,89) — suprafața pintenului chiar sub flanșă. Test strict:
    //   y=565 (Y=2,073): măsurat 374/545 | OD ascuțit 374/545 ✓✓ | JSON 375/544 ✗✗
    // → arc centrat (4,8 / 1,7), de la (4,5 / 1,7) la (4,8 / 2,0); muchie
    // ASCUȚITĂ pe OD-ul Ø16 la Y=2,0. Identic cu piesa 0026 — al doilea caz
    // consecutiv, deci întărește și nota de reverificare de la piesa 0025.
    //
    // ✅ CONFIRMAT — R1 inferior (JSON corect): centru (7,0 / 5,914214),
    // tangent la umărul de 45° în (6,292893 / 5,207107) și la corpul Ø12 în
    // (6,0 / 5,914214). Colțul teoretic (6,0 / 5,5) = cota „5,5". Test strict
    // y=529…533: 5/5 potriviri exacte pe ambele muchii; varianta fără fileu
    // ratează la y=529 și y=530 pe ambele muchii.
    //
    // ✅ CONFIRMAT — conul superior nu are nicio presupunere: e complet
    // determinat de (4,15 / 30) + tangența la coroana R2 centrată pe axă în
    // (0 / 38). Rezultă tangența în (1,935451 / 38,504015) → Ø3,8709 față de
    // Ø3,87 cotat (Δ 0,0009mm) și Y=38,504 față de 38,5 cotat (Δ 0,0040mm).
    // Semiunghi 14,5963° → 29,1927° inclus. Verificat pe pixeli de la y=176
    // la y=265 (con) și y=169…174 (coroană).
    //
    // ⚠️ AMBIGUITATE RĂMASĂ — R1 la joncțiunea umăr superior ↔ gât (Y=27).
    // Leader-ul îl indică acolo, dar efectul geometric al unui R1 pe un colț
    // de 45° e de doar 0,0838mm (0,90 px) și cade EXCLUSIV pe rândul y=298,
    // care e ocupat de muchia proprie a piesei. Am modelat colț ASCUȚIT
    // pentru că exportul suprimă muchiile tangente — dovadă: la fileul R1
    // confirmat (Y=5,914) și la tangența con↔R2 (Y=38,504) NU există linie
    // orizontală peste piesă, în timp ce la Y=27,014 există una, exact pe
    // lățimea gâtului (x=415…503). În plus gâtul iese fix 3,000mm.
    // Diferența față de varianta cu fileu e sub 0,09mm — invizibilă în 3D.
    // O cotă de înălțime pentru punctul de tangență ar elimina ambiguitatea.
    //
    // STRUCTURA (Y=0 bază pinten → Y=40 vârf):
    //   • pinten cilindric Ø9                Y ∈ [0.00,  1.70]
    //   • fileu R0,3 concav (centru 4,8/1,7) Y ∈ [1.70,  2.00]
    //   • față radială flanșă (r 4,8→8,0)    Y = 2.00
    //   • flanșă cilindrică Ø16              Y ∈ [2.00,  3.50]
    //   • umăr inferior 90° inclus           Y ∈ [3.50,  5.2071]
    //   • racord R1 concav (centru 7,0/5,9142) Y ∈ [5.2071, 5.9142]
    //   • corp cilindric Ø12                 Y ∈ [5.9142, 25.15]
    //   • umăr superior 90° inclus Ø12→Ø8,3  Y ∈ [25.15, 27.00]
    //   • gât cilindric Ø8,3 (3,000 mm)      Y ∈ [27.00, 30.00]
    //   • con 29,19° tangent la coroană (0°) Y ∈ [30.00, 38.5040]
    //   • coroană R2 centrată pe axă (0/38)  Y ∈ [38.5040, 40.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [4.5,     0.0],
        [4.5,     1.7],
        [4.5058,  1.7585],
        [4.5228,  1.8148],
        [4.5506,  1.8667],
        [4.5879,  1.9121],
        [4.6333,  1.9494],
        [4.6852,  1.9772],
        [4.7415,  1.9942],
        [4.8,     2.0],
        [8.0,     2.0],
        [8.0,     3.5],
        [6.2929,  5.2071],
        [6.1685,  5.3586],
        [6.0761,  5.5315],
        [6.0192,  5.7191],
        [6.0,     5.9142],
        [6.0,     25.15],
        [4.15,    27.0],
        [4.15,    30.0],
        [1.9355,  38.504],
        [1.8526,  38.7536],
        [1.7377,  38.9902],
        [1.5927,  39.2097],
        [1.4202,  39.4082],
        [1.2231,  39.5824],
        [1.0049,  39.7292],
        [0.7693,  39.8461],
        [0.5204,  39.9311],
        [0.2624,  39.9827],
        [0.0,     40.0],
      ],
      height: 40.0,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 110 },
      orthoSize: 28,
      drawing2d: '/welding-drawings/Stift M10 D 12.png',
      pdf: '/welding-drawings/PIN-12-40-01__Stift-M10-D-12__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.75,  r: 8.0,   lineY: -4, label: 'Ø16',   radial: true  },
          { type: 'diameter', y: 0.85,  r: 4.5,   lineY: -8, label: 'Ø9',    radial: true  },
          { type: 'diameter', y: 15,    r: 6.0,   lineY: 44, label: 'Ø12',   radial: true  },
          { type: 'diameter', y: 28.5,  r: 4.15,  lineY: 47, label: 'Ø8,3',  radial: false },
          { type: 'diameter', y: 38.5,  r: 1.935, lineY: 50, label: 'Ø3,87', radial: false },
          { type: 'length', y1: 0, y2: 40,    edgeR1: 4.5, edgeR2: 0,     label: 'L 40',   radial: false },
          { type: 'length', y1: 0, y2: 38.5,  edgeR1: 4.5, edgeR2: 1.935, label: '38,5',   radial: false },
          { type: 'length', y1: 0, y2: 30,    edgeR1: 4.5, edgeR2: 4.15,  label: '30',     radial: false },
          { type: 'length', y1: 0, y2: 25.15, edgeR1: 4.5, edgeR2: 6.0,   label: '25,15',  radial: false },
          { type: 'length', y1: 0, y2: 5.5,   edgeR1: 4.5, edgeR2: 6.0,   label: '5,5',    radial: false },
          { type: 'length', y1: 0, y2: 3.5,   edgeR1: 4.5, edgeR2: 8.0,   label: '3,5',    radial: false },
          { type: 'length', y1: 0, y2: 2,     edgeR1: 4.5, edgeR2: 8.0,   label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0028',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-11.25-34.25-01',    // Ø corp (11,25mm) · L=34,25mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000091',
    family: 'pcp',
    name: 'Ceramic centering pin Ø11,25 · L34,25',
    specs: [
      ['Ø corp',        '11,25 mm  (+0 / -0,05)'],
      ['Ø bază',        '13,9 mm'],
      ['Ø gât',         '9,15 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,76 mm'],
      ['Rază coroană',  'R2 mm  (centrată pe axă)'],
      ['Unghi con',     '39,86° (inclus)'],
      ['Umăr superior', '70° (inclus)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '34,25 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000091.png',
      pdf: '/welding-drawings/PIN-11.25-34.25-01__YRD-W1PCNCNM000091__R00.pdf',
      cad: null,
    },
    // Calibrare: scale = 10,72702 px/mm, y0 = 515,458 px, AX = 402,25 px.
    // Regresie pe 7 datum-uri (34,25 / 32,93 / 25,5 / 23 / 4,8 / 2,5 / 0) →
    // Δ max 0,043mm. Model de rasterizare px = floor(true).
    // Validare forward-raster: 339 rânduri · 94,7% potrivire EXACTĂ (0 px) ·
    // 99,7% în ±1px. Singura abatere >1px (y=463) e un pixel lipsă din desen.
    // Pentru comparație, profilul din JSON: 66,4% exact / 70,8% în ±1px.
    //
    // ⚠️ CORECȚIE MAJORĂ — JSON a ignorat cota „23" și a inventat cota „28",
    // deplasând tot ansamblul umăr/gât/con cu 2,5mm în sus:
    //     JSON:     corp până la 25,5 · umăr 25,5→27 · gât 27→28 · con de la 28
    //     REAL:     corp până la 21,5 · umăr 21,5→23 · gât 23→25,5 · con de la 25,5
    // Cotele 23 și 25,5 ÎNCADREAZĂ GÂTUL Ø9,15 (2,5mm) — eroarea sistematică
    // nr. 1, a cincea oară în catalog. Test strict pe pixeli:
    //   y=243…249 (Y 24,84…25,40): măsurat 353/451 → REAL 353/451 ✓ | JSON 341/462 ✗
    //   y=264…268 (Y 23,07…23,44): măsurat 353/451 → REAL 353/451 ✓ | JSON 341/462 ✗
    //   19 potriviri exacte pentru modelul măsurat, 0 pentru JSON.
    // Diferența e de 1,05mm pe rază (11 px) — nu subtilitate, ci zonă greșită.
    //
    // ✅ CONFLICTUL RAPORTAT DE JSON DISPARE COMPLET. JSON declara
    // „not_simultaneously_compatible" pentru unghiul de 40° (îi ieșea 56,86°),
    // Y=32,93 (îi ieșea 33,20) și Ø3,76 (îi ieșea 3,52). Cu conul pornit din
    // (4,575 / 25,5) și tangent la coroana R2 centrată pe axă în (0 / 32,25),
    // toate trei cad simultan:
    //   unghi inclus  39,8617°  (cotat 40°     · Δ -0,138°)
    //   Ø la tangență  3,7604   (cotat 3,76    · Δ +0,0004)
    //   Y la tangență 32,9318   (cotat 32,93   · Δ +0,0018)
    // Exact soluția pe care JSON o listase ca „alternative_exact_40deg_solution"
    // dar o respinsese, pentru că îi ieșea Ø7,35 la Y=28 — un Y care nu există
    // pe desen. Conflictul era 100% artefact de interpretare.
    //
    // ✅ COTA LIPSĂ, MĂSURATĂ DIRECT: capătul superior al corpului Ø11,25.
    // Nu e cotată, dar desenul conține muchia reală a cercului de joncțiune
    // corp↔umăr — linie orizontală la y=285, x=341…461, fără vârfuri de
    // săgeată în rândurile vecine (linia de cotă Ø11,25 e la y=391, întreruptă
    // de etichetă). Y măsurat = 21,484; cu umărul de 70° exact ancorat în
    // Y=23 rezultă 21,5004 → Δ 0,016mm. Deci Y = 21,5, număr rotund — a
    // șasea oară când cota absentă a umărului superior iese rotundă.
    //
    // ✅ Restul confirmat: bază Ø13,9 cilindrică 0→2,505 (șamfren 60° exact
    // ancorat pe Y=4,8 → start 2,5050 față de 2,5 cotat, Δ 0,005), corp
    // Ø11,25 (341/462), umăr 70° (pantă măsurată 0,7006 vs tan35° = 0,70021),
    // gât Ø9,15 (353/451). Fără pinten și fără racorduri la bază — desenul nu
    // cotează niciun R acolo, iar muchia de la Y=2,505 e ascuțită în pixeli.
    //
    // STRUCTURA (Y=0 bază → Y=34,25 vârf):
    //   • bază cilindrică Ø13,9              Y ∈ [0.00,  2.5050]
    //   • șamfren 60° inclus Ø13,9→Ø11,25    Y ∈ [2.5050, 4.80]
    //   • corp cilindric Ø11,25              Y ∈ [4.80, 21.5004]
    //   • umăr 70° inclus Ø11,25→Ø9,15       Y ∈ [21.5004, 23.00]
    //   • gât cilindric Ø9,15 (2,5 mm)       Y ∈ [23.00, 25.50]
    //   • con 39,86° tangent la coroană (0°) Y ∈ [25.50, 32.9318]
    //   • coroană R2 centrată pe axă (0/32,25) Y ∈ [32.9318, 34.25]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.95,    0.0],
        [6.95,    2.505],
        [5.625,   4.8],
        [5.625,   21.5004],
        [4.575,   23.0],
        [4.575,   25.5],
        [1.8802,  32.9318],
        [1.783,   33.156],
        [1.6592,  33.3668],
        [1.5105,  33.5608],
        [1.3393,  33.7353],
        [1.1481,  33.8876],
        [0.9398,  34.0154],
        [0.7174,  34.1169],
        [0.4843,  34.1905],
        [0.244,   34.2351],
        [0.0,     34.25],
      ],
      height: 34.25,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000091.png',
      pdf: '/welding-drawings/PIN-11.25-34.25-01__YRD-W1PCNCNM000091__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 6.95,  lineY: -4, label: 'Ø13,9',  radial: true  },
          { type: 'diameter', y: 13,    r: 5.625, lineY: 38, label: 'Ø11,25', radial: true  },
          { type: 'diameter', y: 24.25, r: 4.575, lineY: 41, label: 'Ø9,15',  radial: false },
          { type: 'diameter', y: 32.93, r: 1.88,  lineY: 44, label: 'Ø3,76',  radial: false },
          { type: 'length', y1: 0, y2: 34.25, edgeR1: 6.95, edgeR2: 0,     label: 'L 34,25', radial: false },
          { type: 'length', y1: 0, y2: 32.93, edgeR1: 6.95, edgeR2: 1.88,  label: '32,93',  radial: false },
          { type: 'length', y1: 0, y2: 25.5,  edgeR1: 6.95, edgeR2: 4.575, label: '25,5',   radial: false },
          { type: 'length', y1: 0, y2: 23,    edgeR1: 6.95, edgeR2: 4.575, label: '23',     radial: false },
          { type: 'length', y1: 0, y2: 4.8,   edgeR1: 6.95, edgeR2: 5.625, label: '4,8',    radial: false },
          { type: 'length', y1: 0, y2: 2.5,   edgeR1: 6.95, edgeR2: 6.95,  label: '2,5',    radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0029',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-6.3-28-01',         // Ø corp (6,3mm) · L=28mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000095',
    family: 'pcp',
    name: 'Ceramic centering pin Ø6,3 · L28',
    specs: [
      ['Ø corp',        '6,3 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '4,85 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,33 mm'],
      ['Rază coroană',  'R1,25 mm  (centrată pe axă)'],
      ['Unghi con',     '42,95° (inclus)'],
      ['Umăr superior', '70° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '28 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000095.png',
      pdf: '/welding-drawings/PIN-6.3-28-01__YRD-W1PCNCNM000095__R00.pdf',
      cad: null,
    },
    // Desenul are fundal albastru închis + eticheta roșie „095", deci binarizarea
    // s-a făcut pe canale RGB (alb = R,G,B > 150), nu pe grayscale — altfel
    // textul roșu intra în mască.
    // Calibrare: scale = 11,21185 px/mm, y0 = 482,921 px, AX = 182,0 px.
    // Regresie pe 7 datum-uri (28 / 27,21 / 24 / 21 / 6 / 1,93 / 0) → Δ max
    // 0,042mm. Model de rasterizare px = floor(true).
    // Validare forward-raster: 288 rânduri · 90,3% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 84,0% exact · 93,8% în ±1px.
    // Pe zone, modelul măsurat dă 100% exact la bază Ø11, șamfren 60°,
    // corp Ø6,3 și gât Ø4,85; restul (umăr, con, coroană) sunt muchii
    // diagonale/curbe, unde rasterizarea are asimetria obișnuită de 1px.
    //
    // ⚠️ CORECȚIE — JSON a inventat cota „19,93". Pe desen nu există decât
    // „1,93" (înălțimea bazei cilindrice Ø11). JSON a folosit-o de două ori:
    // corect ca 1,9297 la bază și fabricat ca 19,93 pentru capătul corpului,
    // ceea ce a împins umărul la 19,93→21 și a umflat gâtul la 3mm.
    //     JSON:  corp până la 19,93 · umăr 19,93→21 · gât 21→24 (3 mm)
    //     REAL:  corp până la 21,00 · umăr 21→22,035 · gât 22,035→24 (1,96 mm)
    // Dovada directă: desenul conține muchia reală a cercului de joncțiune
    // gât↔umăr — linie orizontală la y=236, x=154…210, adică EXACT lățimea
    // gâtului (154…209), fără prelungire în afara piesei. Prin contrast,
    // linia de la y=247 (Y=21,0) merge până la x=380, deci e linie de extensie
    // a cotei „21" suprapusă peste muchia corpului.
    // Test strict pe pixeli, y=238…251: 12 potriviri exacte pentru modelul
    // măsurat, 0 pentru JSON (care prezice 154/209 unde desenul are 146/217 —
    // 0,7mm eroare pe rază).
    //
    // ⚠️ UNGHIUL UMĂRULUI nu e cotat pe desen. Ancorat pe Y=21 (cotat) și pe
    // muchia desenată de la Y=22,0232 rezultă 70,64° inclus; am folosit 70°
    // rotund (standardul familiei — piesa 0028, din aceeași serie
    // YRD-W1PCNCNM0000xx și aceeași dată, îl are cotat explicit 70°).
    // Cu 70° capătul umărului iese la Y=22,0354, adică muchia s-ar desena la
    // y=235,86 față de y=236 măsurat → Δ 0,14 px = 0,013mm.
    // Regresia brută pe cele 10 rânduri ale umărului dă 72,96°, dar ancorele
    // ei ratează cu 0,07mm (10 puncte pe 1mm de înălțime — nu e concludentă).
    // O cotă de unghi sau de înălțime a capătului umărului ar închide subiectul.
    // Diferența 70° vs 72° în model: 0,04mm pe înălțime.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø11 0→1,9297 + șamfren 60° până la Y=6 (ancorare exactă:
    //     6,0 − 2,35/tan30° = 1,92968 față de 1,93 cotat, Δ 0,0003) — 100% exact
    //   • corp Ø6,3 — 100% exact pe 160 de rânduri
    //   • con tangent la coroana R1,25 centrată pe axă în (0 / 26,75):
    //     tangența iese (1,163237 / 27,207581) → Ø2,3265 față de Ø2,33 cotat
    //     (Δ −0,0035) și Y=27,2076 față de 27,21 cotat (Δ −0,0024).
    //     Fără presupuneri — geometria e complet determinată.
    //
    // STRUCTURA (Y=0 bază → Y=28 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  1.9297]
    //   • șamfren 60° inclus Ø11→Ø6,3        Y ∈ [1.9297, 6.00]
    //   • corp cilindric Ø6,3                Y ∈ [6.00, 21.00]
    //   • umăr 70° inclus Ø6,3→Ø4,85         Y ∈ [21.00, 22.0354]
    //   • gât cilindric Ø4,85 (1,96 mm)      Y ∈ [22.0354, 24.00]
    //   • con 42,95° tangent la coroană (0°) Y ∈ [24.00, 27.2076]
    //   • coroană R1,25 centrată pe axă (0/26,75) Y ∈ [27.2076, 28.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     1.9297],
        [3.15,    6.0],
        [3.15,    21.0],
        [2.425,   22.0354],
        [2.425,   24.0],
        [1.1632,  27.2076],
        [1.1003,  27.3431],
        [1.0217,  27.4702],
        [0.9285,  27.5869],
        [0.822,   27.6917],
        [0.7037,  27.7831],
        [0.5755,  27.8597],
        [0.4389,  27.9204],
        [0.2962,  27.9644],
        [0.1491,  27.9911],
        [0.0,     28.0],
      ],
      height: 28.0,
      footprint: 14,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000095.png',
      pdf: '/welding-drawings/PIN-6.3-28-01__YRD-W1PCNCNM000095__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 0.95,  r: 5.5,   lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 13,    r: 3.15,  lineY: 31, label: 'Ø6,3',  radial: true  },
          { type: 'diameter', y: 23,    r: 2.425, lineY: 34, label: 'Ø4,85', radial: false },
          { type: 'diameter', y: 27.21, r: 1.165, lineY: 37, label: 'Ø2,33', radial: false },
          { type: 'length', y1: 0, y2: 28,    edgeR1: 5.5, edgeR2: 0,     label: 'L 28',  radial: false },
          { type: 'length', y1: 0, y2: 27.21, edgeR1: 5.5, edgeR2: 1.165, label: '27,21', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 5.5, edgeR2: 2.425, label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 5.5, edgeR2: 3.15,  label: '21',    radial: false },
          { type: 'length', y1: 0, y2: 6,     edgeR1: 5.5, edgeR2: 3.15,  label: '6',     radial: false },
          { type: 'length', y1: 0, y2: 1.93,  edgeR1: 5.5, edgeR2: 5.5,   label: '1,93',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0030',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-7.3-28.3-01',       // Ø corp (7,3mm) · L=28,3mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000096',
    family: 'pcp',
    name: 'Ceramic centering pin Ø7,3 · L28,3',
    specs: [
      ['Ø corp',        '7,3 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '4,95 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,34 mm'],
      ['Rază coroană',  'R1,25 mm  (centrată pe axă)'],
      ['Unghi con',     '41,00° (inclus)'],
      ['Umăr superior', '76,15° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '28,3 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000096.png',
      pdf: '/welding-drawings/PIN-7.3-28.3-01__YRD-W1PCNCNM000096__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (alb = R,G,B > 150) din cauza etichetei roșii „096".
    // Calibrare: scale = 11,34564 px/mm, y0 = 466,193 px, AX = 228,62 px
    // (axa rafinată prin sweep — 229,0 dădea doar 71% potriviri exacte).
    // Regresie pe 7 datum-uri (28,3 / 27,49 / 24 / 20,5 / 5,5 / 2,3 / 0) →
    // Δ max 0,035mm. Model de rasterizare px = floor(true).
    // Validare forward-raster: 297 rânduri · 97,6% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 88,9% exact · 93,3% în ±1px.
    // Pe zone modelul măsurat dă 100% exact la bază Ø11, corp Ø7,3, UMĂR și
    // gât Ø4,95; 97,4% pe con; restul (șamfren, coroană) sunt muchii
    // diagonale/curbe cu asimetria obișnuită de 1px.
    //
    // ⚠️ CORECȚIE — JSON a inventat cota „23". Pe desen cotele de înălțime
    // sunt doar 28,3 / 27,49 / 24 / 20,5 / 5,5 / 2,3 — nu există niciun 23.
    // JSON l-a folosit ca sfârșit de umăr / început de gât, umflând umărul la
    // 2,5mm și strângând gâtul la 1mm:
    //     JSON:  umăr 20,5→23 (50,3° inclus) · gât 23→24 (1,0 mm)
    //     REAL:  umăr 20,5→22,0 (76,15° inclus) · gât 22,0→24 (2,0 mm)
    // Dovada directă: muchia reală a cercului de joncțiune gât↔umăr e
    // desenată la y=217, x=200…257 — exact lățimea gâtului (200…256), fără
    // prelungire în afara piesei. Prin contrast, linia de la y=234 (Y=20,5)
    // merge până la x=453, deci e linie de extensie a cotei „20,5".
    // Test strict y=214…240: 25 potriviri exacte pentru modelul măsurat,
    // 7 pentru JSON (și acelea doar pe corp, unde cele două modele coincid).
    // A treia oară consecutiv (0028, 0029, 0030) când JSON pierde împărțirea
    // umăr/gât.
    //
    // ⚠️ UNGHIUL UMĂRULUI nu e cotat. Determinat prin căutare exhaustivă pe
    // rândurile umărului (y=218…233, AX=228,62): 76° dă 16/16 potriviri
    // exacte, cu maxim curat (77° → 13/16, 75° → 11/16, 74° → 7/16).
    // Capătul rezultat, Y=22,0039, e practic exact 22,0 — număr rotund, ca la
    // toate celelalte piese unde această cotă lipsește. Am ancorat modelul pe
    // Y=22,0 fix, ceea ce dă 76,146° inclus și păstrează 16/16.
    // Muchia desenată e la Y=21,9638 → Δ 0,036mm (0,41 px).
    // O cotă de unghi sau de înălțime a capătului umărului ar închide subiectul.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø11 0→2,2957 + șamfren 60° până la Y=5,5 (5,5 − 1,85/tan30° =
    //     2,29571 față de 2,3 cotat, Δ 0,0043) — 100% exact pe bază
    //   • corp Ø7,3 — 100% exact pe 163 de rânduri
    //   • con tangent la coroana R1,25 centrată pe axă în (0 / 27,05):
    //     tangența iese (1,170825 / 27,487800) → Ø2,3416 față de Ø2,34 cotat
    //     (Δ +0,0016) și Y=27,4878 față de 27,49 cotat (Δ −0,0022).
    //     Fără presupuneri — geometria e complet determinată.
    //
    // STRUCTURA (Y=0 bază → Y=28,3 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  2.2957]
    //   • șamfren 60° inclus Ø11→Ø7,3        Y ∈ [2.2957, 5.50]
    //   • corp cilindric Ø7,3                Y ∈ [5.50, 20.50]
    //   • umăr 76,15° inclus Ø7,3→Ø4,95      Y ∈ [20.50, 22.00]
    //   • gât cilindric Ø4,95 (2,0 mm)       Y ∈ [22.00, 24.00]
    //   • con 41,00° tangent la coroană (0°) Y ∈ [24.00, 27.4878]
    //   • coroană R1,25 centrată pe axă (0/27,05) Y ∈ [27.4878, 28.30]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     2.2957],
        [3.65,    5.5],
        [3.65,    20.5],
        [2.475,   22.0],
        [2.475,   24.0],
        [1.1708,  27.4878],
        [1.1092,  27.6263],
        [1.0314,  27.7562],
        [0.9383,  27.8758],
        [0.8315,  27.9833],
        [0.7125,  28.0771],
        [0.583,   28.1557],
        [0.4449,  28.2181],
        [0.3003,  28.2634],
        [0.1512,  28.2908],
        [0.0,     28.3],
      ],
      height: 28.3,
      footprint: 14,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000096.png',
      pdf: '/welding-drawings/PIN-7.3-28.3-01__YRD-W1PCNCNM000096__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 5.5,   lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 13,    r: 3.65,  lineY: 31, label: 'Ø7,3',  radial: true  },
          { type: 'diameter', y: 23,    r: 2.475, lineY: 34, label: 'Ø4,95', radial: false },
          { type: 'diameter', y: 27.49, r: 1.17,  lineY: 37, label: 'Ø2,34', radial: false },
          { type: 'length', y1: 0, y2: 28.3,  edgeR1: 5.5, edgeR2: 0,     label: 'L 28,3', radial: false },
          { type: 'length', y1: 0, y2: 27.49, edgeR1: 5.5, edgeR2: 1.17,  label: '27,49', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 5.5, edgeR2: 2.475, label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 20.5,  edgeR1: 5.5, edgeR2: 3.65,  label: '20,5',  radial: false },
          { type: 'length', y1: 0, y2: 5.5,   edgeR1: 5.5, edgeR2: 3.65,  label: '5,5',   radial: false },
          { type: 'length', y1: 0, y2: 2.3,   edgeR1: 5.5, edgeR2: 5.5,   label: '2,3',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0031',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-9.3-29.07-01',      // Ø corp (9,3mm) · L=29,07mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000097',
    family: 'pcp',
    name: 'Ceramic centering pin Ø9,3 · L29,07',
    specs: [
      ['Ø corp',        '9,3 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '7,2 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,79 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '42,84° (inclus)'],
      ['Umăr superior', '70° (inclus)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '29,07 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000097.png',
      pdf: '/welding-drawings/PIN-9.3-29.07-01__YRD-W1PCNCNM000097__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (etichetă roșie „097").
    // Calibrare pe 6 datum-uri (28,24 / 22,5 / 18,5 / 3,97 / 2,5 / 0) →
    // scale = 10,72438 px/mm, y0 = 476,157 px, AX = 370,75 px. Δ max 0,039mm.
    //
    // ⚠️ DESENUL E TRASAT MAI LUNG DECÂT COTA — DECIZIE: 29,07 (Alex, 2026-07-24).
    // Geometria trasată pe desen dă un vârf la 29,2024mm, nu 29,07:
    //   • rândurile y=163 și y=164 conțin pixeli de piesă (x=374, x=377),
    //     adică vârful desenat e deasupra nivelului Y=29,07
    //   • fit de cerc pe 8 puncte ale coroanei (independent de orice cotă de
    //     înălțime) → centru pe axă la Y=27,698, R=1,5087, vârf 29,206
    //   • construcția din cotele vârfului (con 42° + tangență Ø2,8 la Y=28,24
    //     + R1,5) plasează centrul coroanei exact pe axă și dă vârf 29,20245
    // Cartușul, codul piesei și textul cotei spun însă 29,07 — valoarea
    // oficială. Am ancorat modelul pe 29,07, la fel ca la piesele 0016 / 0018
    // / 0020, unde desenul era de asemenea trasat la altă lungime.
    // Consecință: coroana R1,5 are centrul la (0 / 27,57) și conul pornit din
    // (3,6 / 22,5) devine tangent la ea în (1,396414 / 28,117749). Cele două
    // cote de referință ale vârfului se abat:
    //     unghi con   42,8356°  (cotat 42°     · Δ +0,84°)
    //     Y tangență  28,1177   (cotat 28,24   · Δ −0,122mm)
    //     Ø tangență   2,7928   (cotat 2,8     · Δ −0,007mm)
    // Cotele „tari" rămân exacte: Ø7,2 la Y=22,5, R1,5, L=29,07.
    // Dacă vreodată se confirmă că lungimea reală e 29,20, trebuie readus
    // vârful pe construcția cu 42° exact (tangență la 1,4004 / 28,24, vârf
    // 29,2024) — restul profilului rămâne neschimbat.
    //
    // ✅ MĂSURAT ȘI CONFIRMAT — restul geometriei (identic în JSON):
    //   • bază Ø11 0→2,4978 + șamfren 60° până la Y=3,97 (3,97 − 0,85/tan30°
    //     = 2,49776 față de 2,5 cotat, Δ 0,0022) — 100% potrivire exactă
    //   • corp Ø9,3 — 100% exact pe 142 de rânduri
    //   • umăr 70° inclus (cotat explicit): 18,5 → 19,9996. Muchia reală a
    //     cercului de joncțiune umăr↔gât e desenată la y=262, x=332…410 —
    //     exact lățimea gâtului (332…409) — la Y=19,969, deci Δ 0,030mm față
    //     de modelul cu 70° exact. Testele cu 68° și 72° nu îl bat.
    //   • gât Ø7,2: 19,9996 → 22,5 — 100% exact
    //   Pe zona 0…28,1 (tot ce nu ține de vârf) modelul dă 96% potrivire
    //   exactă și 100% în ±1px.
    //
    // STRUCTURA (Y=0 bază → Y=29,07 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  2.4978]
    //   • șamfren 60° inclus Ø11→Ø9,3        Y ∈ [2.4978, 3.97]
    //   • corp cilindric Ø9,3                Y ∈ [3.97, 18.50]
    //   • umăr 70° inclus Ø9,3→Ø7,2          Y ∈ [18.50, 19.9996]
    //   • gât cilindric Ø7,2 (2,5 mm)        Y ∈ [19.9996, 22.50]
    //   • con 42,84° tangent la coroană (0°) Y ∈ [22.50, 28.1177]
    //   • coroană R1,5 centrată pe axă (0/27,57) Y ∈ [28.1177, 29.07]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     2.4978],
        [4.65,    3.97],
        [4.65,    18.5],
        [3.6,     19.9996],
        [3.6,     22.5],
        [1.3964,  28.1177],
        [1.321,   28.2806],
        [1.2267,  28.4332],
        [1.1148,  28.5735],
        [0.987,   28.6995],
        [0.8451,  28.8093],
        [0.6911,  28.9013],
        [0.5271,  28.9743],
        [0.3557,  29.0272],
        [0.1791,  29.0593],
        [0.0,     29.07],
      ],
      height: 29.07,
      footprint: 14,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000097.png',
      pdf: '/welding-drawings/PIN-9.3-29.07-01__YRD-W1PCNCNM000097__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 5.5,  lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 11,    r: 4.65, lineY: 33, label: 'Ø9,3',  radial: true  },
          { type: 'diameter', y: 21.2,  r: 3.6,  lineY: 36, label: 'Ø7,2',  radial: false },
          { type: 'diameter', y: 28.12, r: 1.4,  lineY: 39, label: 'Ø2,8',  radial: false },
          { type: 'length', y1: 0, y2: 29.07, edgeR1: 5.5, edgeR2: 0,    label: 'L 29,07', radial: false },
          { type: 'length', y1: 0, y2: 28.24, edgeR1: 5.5, edgeR2: 1.4,  label: '28,24',  radial: false },
          { type: 'length', y1: 0, y2: 22.5,  edgeR1: 5.5, edgeR2: 3.6,  label: '22,5',   radial: false },
          { type: 'length', y1: 0, y2: 18.5,  edgeR1: 5.5, edgeR2: 4.65, label: '18,5',   radial: false },
          { type: 'length', y1: 0, y2: 3.97,  edgeR1: 5.5, edgeR2: 4.65, label: '3,97',   radial: false },
          { type: 'length', y1: 0, y2: 2.5,   edgeR1: 5.5, edgeR2: 5.5,  label: '2,5',    radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0032',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-9.3-30-01',         // Ø corp (9,3mm) · L=30mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000098',
    family: 'pcp',
    name: 'Ceramic centering pin Ø9,3 · L30',
    specs: [
      ['Ø corp',        '9,3 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '6,6 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,81 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '41,32° (inclus)'],
      ['Umăr superior', '84° (inclus)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '30 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000098.png',
      pdf: '/welding-drawings/PIN-9.3-30-01__YRD-W1PCNCNM000098__R00.pdf',
      cad: null,
    },
    // PNG-ul sursă nu era disponibil — desenul a fost extras din PDF (imagine
    // încorporată, 511×503 px, alb-negru pur) și măsurat pe el.
    // Calibrare pe 7 datum-uri (30 / 29,03 / 24 / 21,5 / 3,47 / 2 / 0) →
    // scale = 10,73140 px/mm, y0 = 414,208 px, AX = 344,0 px. Δ max 0,045mm.
    // Validare forward-raster: 292 rânduri · 98,6% potrivire EXACTĂ ·
    // 100,0% în ±1px. Profilul din JSON: 90,4% exact · 92,1% în ±1px.
    // Pe zone modelul măsurat dă 100% exact la bază Ø11, corp Ø9,3, gât Ø6,6
    // și coroană; 93% la șamfren și umăr, 96% pe con.
    //
    // ⚠️ CORECȚIE — umărul plasat cu 1,5mm mai sus în JSON (eroarea sistematică
    // nr. 1, a patra oară în acest lot):
    //     JSON:  corp până la 21,5 · umăr 21,5→22,9993 · gât 22,9993→24 (1,0 mm)
    //     REAL:  corp până la 20,0007 · umăr 20,0007→21,5 · gât 21,5→24 (2,5 mm)
    // Cotele 21,5 și 24 ÎNCADREAZĂ GÂTUL Ø6,6, nu umărul. Dovada directă:
    // muchia reală a cercului de joncțiune corp↔umăr e desenată la y=200,
    // x=294…393 — exact lățimea corpului Ø9,3 (294…393, 100 px) — la
    // Y=19,961. Cu umărul de 84° ancorat în Y=21,5 rezultă 20,0007 → Δ 0,040mm.
    // În plus, profilul măsurat se lărgește ÎN JOS începând de la y=185
    // (Y=21,36), adică imediat sub cota 21,5, și atinge Ø9,3 la y=199.
    // Unghiul de 84° cotat pe desen se confirmă: pe intervalul măsurat
    // 19,96…21,45 panta dă ~92° dacă se ia capătul brut, dar ancorarea pe cele
    // două muchii desenate (21,5 și 19,961) dă 83,0°±1,5° — 84° cade înăuntru
    // și e valoarea cotată, deci a fost păstrată.
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF NU E AUTORITATIVĂ pentru împărțirea
    // umăr/gât. Vectorii ei (exacți, extrași cu pdfplumber) dau nivelurile
    // 0 / 2,0 / 3,47 / 21,5 / 22,8 / 24,0 / 29,03 — adică aceeași plasare
    // greșită a umărului ca în JSON, doar cu altă înălțime (1,3 mm în loc de
    // 1,4993). Pentru piesa 0031 aceiași vectori reproduc perfect desenul
    // sursă (0 / 2,5 / 3,97 / 18,5 / 20,0 / 22,5 / 28,24), deci generatorul
    // PDF e fidel când datele de intrare sunt corecte — dar moștenește
    // erorile lor. De folosit doar ca verificare încrucișată, nu ca sursă.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø11 0→1,9978 + șamfren 60° până la Y=3,47 (3,47 − 0,85/tan30°
    //     = 1,99776 față de 2 cotat, Δ 0,0022) — 100% exact pe bază
    //   • corp Ø9,3 — 100% exact pe 160 de rânduri
    //   • gât Ø6,6 — 100% exact
    //   • con tangent la coroana R1,5 centrată pe axă în (0 / 28,5), pornit
    //     din (3,3 / 24): tangența iese (1,403528 / 29,029254) → Ø2,8071 față
    //     de Ø2,81 cotat (Δ −0,0029) și Y=29,0293 față de 29,03 (Δ −0,0007);
    //     unghiul rezultat 41,3217° față de 41° cotat (Δ +0,32°). Toate trei
    //     cotele de referință ale vârfului cad simultan — spre deosebire de
    //     piesa 0031, aici nu există niciun conflict de lungime.
    //
    // STRUCTURA (Y=0 bază → Y=30 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  1.9978]
    //   • șamfren 60° inclus Ø11→Ø9,3        Y ∈ [1.9978, 3.47]
    //   • corp cilindric Ø9,3                Y ∈ [3.47, 20.0007]
    //   • umăr 84° inclus Ø9,3→Ø6,6          Y ∈ [20.0007, 21.50]
    //   • gât cilindric Ø6,6 (2,5 mm)        Y ∈ [21.50, 24.00]
    //   • con 41,32° tangent la coroană (0°) Y ∈ [24.00, 29.0293]
    //   • coroană R1,5 centrată pe axă (0/28,5) Y ∈ [29.0293, 30.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     1.9978],
        [4.65,    3.47],
        [4.65,    20.0007],
        [3.3,     21.5],
        [3.3,     24.0],
        [1.4035,  29.0293],
        [1.3294,  29.1948],
        [1.2358,  29.3502],
        [1.1241,  29.4932],
        [0.996,   29.6216],
        [0.8533,  29.7337],
        [0.6981,  29.8277],
        [0.5327,  29.9022],
        [0.3595,  29.9563],
        [0.1811,  29.989],
        [0.0,     30.0],
      ],
      height: 30.0,
      footprint: 14,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000098.png',
      pdf: '/welding-drawings/PIN-9.3-30-01__YRD-W1PCNCNM000098__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.0,   r: 5.5,   lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 12,    r: 4.65,  lineY: 34, label: 'Ø9,3',  radial: true  },
          { type: 'diameter', y: 22.7,  r: 3.3,   lineY: 37, label: 'Ø6,6',  radial: false },
          { type: 'diameter', y: 29.03, r: 1.405, lineY: 40, label: 'Ø2,81', radial: false },
          { type: 'length', y1: 0, y2: 30,    edgeR1: 5.5, edgeR2: 0,     label: 'L 30',   radial: false },
          { type: 'length', y1: 0, y2: 29.03, edgeR1: 5.5, edgeR2: 1.405, label: '29,03', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 5.5, edgeR2: 3.3,   label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 21.5,  edgeR1: 5.5, edgeR2: 3.3,   label: '21,5',  radial: false },
          { type: 'length', y1: 0, y2: 3.47,  edgeR1: 5.5, edgeR2: 4.65,  label: '3,47',  radial: false },
          { type: 'length', y1: 0, y2: 2,     edgeR1: 5.5, edgeR2: 5.5,   label: '2',     radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0034',        // ⚠️ 0033 (YRD-W1PCNCNM000122) lipsește încă din catalog
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-10-23.8-01',        // Ø corp (10mm) · L=23,8mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000123',
    family: 'pcp',
    name: 'Ceramic centering pin Ø10 · L23,8',
    specs: [
      ['Ø corp',        '10 mm  (+0 / -0,05)'],
      ['Ø bază',        '11,5 mm'],
      ['Ø gât',         '6,6 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,83 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '38,76° (inclus)'],
      ['Umăr superior', '90° (inclus)'],
      ['Tranziție bază','59,96° (inclus)'],
      ['L (total)',     '23,8 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000123.png',
      pdf: '/welding-drawings/PIN-10-23.8-01__YRD-W1PCNCNM000123__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (fundal albastru închis).
    // Calibrare pe 7 datum-uri (23,8 / 22,8 / 15,5 / 13,8 / 3,8 / 2,5 / 0) →
    // scale = 11,26668 px/mm, y0 = 493,017 px, AX = 400,5 px. Δ max 0,041mm.
    // Validare forward-raster: 254 rânduri · 94,1% potrivire EXACTĂ ·
    // 100,0% în ±1px. Pe zone: 100% exact la bază Ø11,5, corp Ø10 și gât Ø6,6;
    // 96,6% pe con; umărul iese 50% exact dar 100% în ±1px — e o diagonală de
    // 45° fix, unde rasterizarea are asimetria cunoscută de 1px pe muchie.
    //
    // ✅ PRIMA PIESĂ DIN LOT ÎN CARE JSON-UL E CORECT INTEGRAL. Nicio corecție.
    // Verificat punct cu punct, inclusiv capcanele care au picat la 0028-0032:
    //   • ÎMPĂRȚIREA UMĂR/GÂT E CORECTĂ: cotele 13,8 și 15,5 încadrează
    //     UMĂRUL (nu gâtul), iar desenul o confirmă direct — corpul Ø10 are
    //     muchia la y=339 (Y=13,67), profilul se îngustează continuu între
    //     y=337 și y=319, iar gâtul Ø6,6 (363…437) începe la y=317 (Y=15,62).
    //     Umărul: Δr=1,7 pe ΔY=1,7 → exact 90° inclus, complet determinat de
    //     cele două cote, fără presupuneri.
    //   • ÎNCEPUTUL CONULUI, singura valoare derivată din JSON (Y=17,4393,
    //     obținută din Ø6,6 + Ø2,83 la tangență + R1,5 + vârf 23,8), e
    //     CONFIRMAT de desen: muchia reală a cercului de joncțiune gât↔con e
    //     desenată la y=296, x=363…437 — exact lățimea gâtului (75 px) — la
    //     Y=17,4867 → Δ 0,047mm.
    //   • coroana R1,5 centrată pe axă în (0 / 22,3) trece exact prin
    //     Ø2,83 la Y=22,7978 (cotat 22,8 · Δ 0,0022) și are vârful la 23,8.
    //     Nu există niciun conflict de lungime, spre deosebire de 0031.
    //   • tranziția de la bază e determinată de cotele 2,5 și 3,8 (Δr=0,75 /
    //     ΔY=1,3 → 59,96° inclus, adică 60° în intenția de proiectare, dar
    //     desenul nu cotează unghiul, deci s-au păstrat înălțimile cotate).
    //
    // Notă: desenul nu cotează niciun unghi — toate unghiurile de mai sus
    // rezultă din perechi de cote de înălțime + diametre, deci geometria e
    // complet determinată fără nicio presupunere.
    //
    // STRUCTURA (Y=0 bază → Y=23,8 vârf):
    //   • bază cilindrică Ø11,5              Y ∈ [0.00,  2.50]
    //   • tranziție 59,96° Ø11,5→Ø10         Y ∈ [2.50,  3.80]
    //   • corp cilindric Ø10                 Y ∈ [3.80, 13.80]
    //   • umăr 90° inclus Ø10→Ø6,6           Y ∈ [13.80, 15.50]
    //   • gât cilindric Ø6,6 (1,94 mm)       Y ∈ [15.50, 17.4393]
    //   • con 38,76° tangent la coroană (0°) Y ∈ [17.4393, 22.7978]
    //   • coroană R1,5 centrată pe axă (0/22,3) Y ∈ [22.7978, 23.80]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.75,    0.0],
        [5.75,    2.5],
        [5.0,     3.8],
        [5.0,     13.8],
        [3.3,     15.5],
        [3.3,     17.4393],
        [1.415,   22.7978],
        [1.3431,  22.968],
        [1.2508,  23.128],
        [1.1395,  23.2755],
        [1.0109,  23.4082],
        [0.867,   23.5241],
        [0.7099,  23.6214],
        [0.5421,  23.6986],
        [0.366,   23.7547],
        [0.1844,  23.7886],
        [0.0,     23.8],
      ],
      height: 23.8,
      footprint: 15,
      camera: { theta: 0.6, phi: 1.15, radius: 70 },
      orthoSize: 17,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000123.png',
      pdf: '/welding-drawings/PIN-10-23.8-01__YRD-W1PCNCNM000123__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 5.75,  lineY: -4, label: 'Ø11,5', radial: true  },
          { type: 'diameter', y: 8,     r: 5.0,   lineY: 27, label: 'Ø10',   radial: true  },
          { type: 'diameter', y: 16.5,  r: 3.3,   lineY: 30, label: 'Ø6,6',  radial: false },
          { type: 'diameter', y: 22.8,  r: 1.415, lineY: 33, label: 'Ø2,83', radial: false },
          { type: 'length', y1: 0, y2: 23.8, edgeR1: 5.75, edgeR2: 0,     label: 'L 23,8', radial: false },
          { type: 'length', y1: 0, y2: 22.8, edgeR1: 5.75, edgeR2: 1.415, label: '22,8',  radial: false },
          { type: 'length', y1: 0, y2: 15.5, edgeR1: 5.75, edgeR2: 3.3,   label: '15,5',  radial: false },
          { type: 'length', y1: 0, y2: 13.8, edgeR1: 5.75, edgeR2: 5.0,   label: '13,8',  radial: false },
          { type: 'length', y1: 0, y2: 3.8,  edgeR1: 5.75, edgeR2: 5.0,   label: '3,8',   radial: false },
          { type: 'length', y1: 0, y2: 2.5,  edgeR1: 5.75, edgeR2: 5.75,  label: '2,5',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0035',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-11.8-30.8-01',      // Ø corp (11,8mm) · L=30,8mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000124',
    family: 'pcp',
    name: 'Ceramic centering pin Ø11,8 · L30,8',
    specs: [
      ['Ø corp',        '11,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,45 mm'],
      ['Ø gât',         '6,6 mm  (+0 / -0,1)'],
      ['Ø ref. vârf',   '2,79 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '42,88° (inclus)'],
      ['Umăr superior', '94° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '30,8 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000124.png',
      pdf: '/welding-drawings/PIN-11.8-30.8-01__YRD-W1PCNCNM000124__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (fundal albastru închis, etichetă „124").
    // Calibrare pe 7 datum-uri (30,8 / 29,85 / 25 / 19,8 / 4,8 / 2,51 / 0) →
    // scale = 11,23463 px/mm, y0 = 529,688 px, AX = 449,5 px. Δ max 0,044mm.
    // Validare forward-raster: 331 rânduri · 94,9% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 89,1% exact · 98,2% în ±1px.
    // Pe zone: 100% exact la bază Ø14,45, corp Ø11,8 și gât Ø6,6; 96,2% pe
    // umăr; restul sunt muchii diagonale/curbe cu asimetria obișnuită de 1px.
    //
    // ⚠️ CORECȚIE — UNGHIUL UMĂRULUI: 94°, nu 90°.
    // JSON marchează explicit unghiul ca presupunere („upper_shoulder_frustum_
    // 45deg_assumed", adică 90° inclus, capăt la Y=22,4). Măsurătoarea îl
    // infirmă. Desenul conține muchia reală a cercului de joncțiune umăr↔gât:
    // linie orizontală la y=280, x=412…487 — exact lățimea gâtului Ø6,6
    // (412…486, 75 px), fără prelungire în afara piesei — la Y=22,2249.
    // Ancorarea pe această muchie și pe cota 19,8 dă 93,99° inclus, adică 94°.
    // Căutare exhaustivă pe cele 26 de rânduri ale umărului (sweep AX × unghi):
    //     90° →  7/26 potriviri exacte      94° → 25/26  ✓ maxim curat
    //     92° → 12/26                       95° → 20/26
    //     93° → 18/26                       96° → 12/26
    // Cu 94° capătul umărului iese la Y=22,2245, adică muchia s-ar desena la
    // y=280,00 față de y=280 măsurat → Δ 0,0003mm. Cu 90° (JSON) ar cădea la
    // y=278,03, cu 2 px mai sus — vizibil greșit.
    // Consecință: gâtul Ø6,6 e 22,2245 → 25,0 (2,78 mm), nu 22,4 → 25,0 (2,6).
    // Notă: 94° nu e o valoare „rotundă" de familie și nici capătul (22,2245)
    // nu e rotund — dar măsurătoarea e neechivocă. O cotă de unghi sau de
    // înălțime a capătului umărului ar închide subiectul.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • ÎMPĂRȚIREA UMĂR/GÂT E CORECTĂ în JSON: cotele 19,8 și 25 încadrează
    //     umărul + gâtul, iar corpul Ø11,8 (383…515) se termină exact la
    //     y=307/308, adică Y=19,8. Doar unghiul era greșit.
    //   • bază Ø14,45 0→2,505 + șamfren 60° până la Y=4,8 (4,8 − 1,325/tan30°
    //     = 2,50503 față de 2,51 cotat, Δ 0,005) — 100% exact pe bază
    //   • corp Ø11,8 — 100% exact pe 161 de rânduri
    //   • gât Ø6,6 — 100% exact
    //   • con tangent la coroana R1,5 centrată pe axă în (0 / 29,3), pornit
    //     din (3,3 / 25): tangența iese (1,396214 / 29,848257) → Ø2,7924 față
    //     de Ø2,79 cotat (Δ +0,0024) și Y=29,8483 față de 29,85 (Δ −0,0017).
    //     Fără conflict de lungime — vârful cade exact la 30,8.
    //
    // STRUCTURA (Y=0 bază → Y=30,8 vârf):
    //   • bază cilindrică Ø14,45             Y ∈ [0.00,  2.5050]
    //   • șamfren 60° inclus Ø14,45→Ø11,8    Y ∈ [2.5050, 4.80]
    //   • corp cilindric Ø11,8               Y ∈ [4.80, 19.80]
    //   • umăr 94° inclus Ø11,8→Ø6,6         Y ∈ [19.80, 22.2245]
    //   • gât cilindric Ø6,6 (2,78 mm)       Y ∈ [22.2245, 25.00]
    //   • con 42,88° tangent la coroană (0°) Y ∈ [25.00, 29.8483]
    //   • coroană R1,5 centrată pe axă (0/29,3) Y ∈ [29.8483, 30.80]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.225,   0.0],
        [7.225,   2.505],
        [5.9,     4.8],
        [5.9,     19.8],
        [3.3,     22.2245],
        [3.3,     25.0],
        [1.3962,  29.8483],
        [1.3208,  30.011],
        [1.2265,  30.1636],
        [1.1146,  30.3038],
        [0.9868,  30.4297],
        [0.8449,  30.5394],
        [0.6909,  30.6314],
        [0.527,   30.7044],
        [0.3556,  30.7572],
        [0.1791,  30.7893],
        [0.0,     30.8],
      ],
      height: 30.8,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000124.png',
      pdf: '/welding-drawings/PIN-11.8-30.8-01__YRD-W1PCNCNM000124__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 7.225, lineY: -4, label: 'Ø14,45', radial: true  },
          { type: 'diameter', y: 12,    r: 5.9,   lineY: 35, label: 'Ø11,8',  radial: true  },
          { type: 'diameter', y: 23.6,  r: 3.3,   lineY: 38, label: 'Ø6,6',   radial: false },
          { type: 'diameter', y: 29.85, r: 1.396, lineY: 41, label: 'Ø2,79',  radial: false },
          { type: 'length', y1: 0, y2: 30.8,  edgeR1: 7.225, edgeR2: 0,     label: 'L 30,8', radial: false },
          { type: 'length', y1: 0, y2: 29.85, edgeR1: 7.225, edgeR2: 1.396, label: '29,85', radial: false },
          { type: 'length', y1: 0, y2: 25,    edgeR1: 7.225, edgeR2: 3.3,   label: '25',    radial: false },
          { type: 'length', y1: 0, y2: 19.8,  edgeR1: 7.225, edgeR2: 5.9,   label: '19,8',  radial: false },
          { type: 'length', y1: 0, y2: 4.8,   edgeR1: 7.225, edgeR2: 5.9,   label: '4,8',   radial: false },
          { type: 'length', y1: 0, y2: 2.51,  edgeR1: 7.225, edgeR2: 7.225, label: '2,51',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0036',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-14.25-34.5-01',     // Ø corp (14,25mm) · L=34,5mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000125',
    family: 'pcp',
    name: 'Ceramic centering pin Ø14,25 · L34,5',
    specs: [
      ['Ø corp',        '14,25 mm  (+0 / -0,05)'],
      ['Ø bază',        '16 mm'],
      ['Ø gât',         '10,1 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '5,63 mm'],
      ['Rază coroană',  'R3 mm  (centrată pe axă)'],
      ['Unghi con',     '40,45° (inclus)'],
      ['Umăr superior', '92,11° (inclus)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '34,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000125.png',
      pdf: '/welding-drawings/PIN-14.25-34.5-01__YRD-W1PCNCNM000125__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (fundal albastru închis, etichetă „125").
    // Calibrare pe 7 datum-uri (34,5 / 32,54 / 23 / 21 / 4 / 2,48 / 0) →
    // scale = 11,24659 px/mm, y0 = 523,957 px, AX = 205,5 px. Δ max 0,025mm —
    // cea mai bună calibrare din tot lotul.
    // Validare forward-raster: 361 rânduri · 93,1% potrivire EXACTĂ ·
    // 100,0% în ±1px. Pe zone: 100% exact la bază Ø16, șamfren 60°, corp
    // Ø14,25 și gât Ø10,1; 90% pe coroană; umărul iese 50% exact dar 100% în
    // ±1px — diagonală de ~46°, unde rasterizarea are asimetria cunoscută.
    //
    // ✅ JSON CORECT INTEGRAL — a doua oară consecutiv (după 0034).
    // Verificat punct cu punct, inclusiv capcanele care au picat la 0028-0032
    // și 0035:
    //   • ÎMPĂRȚIREA UMĂR/GÂT E CORECTĂ: cotele 21 și 23 încadrează UMĂRUL.
    //     Corpul Ø14,25 (125…285) se termină la y=289 (Y=20,89), profilul se
    //     îngustează continuu între y=287 și y=266, iar gâtul Ø10,1 (148…262)
    //     începe la y=264 (Y=23,11). Ambele capete fiind cotate, unghiul
    //     rezultă exact: Δr=2,075 pe ΔY=2,0 → 92,11° inclus, fără presupuneri.
    //     (JSON scrie 92,0848° — mică eroare de rotunjire în calculul lui;
    //     valoarea corectă din cele două cote e 92,1088°.)
    //   • ÎNCEPUTUL CONULUI, singura valoare derivată (Y=26,4713, obținută din
    //     Ø10,1 + Ø5,63 la tangență + R3 + vârf 34,5), e CONFIRMAT de desen:
    //     muchia reală a cercului de joncțiune gât↔con e desenată la y=226,
    //     x=148…263 — exact lățimea gâtului (115 px) — la Y=26,4931 →
    //     Δ 0,022mm.
    //   • coroana R3 centrată pe axă în (0 / 31,5) trece exact prin Ø5,63 la
    //     Y=32,5372 (cotat 32,54 · Δ 0,0028) și are vârful fix la 34,5.
    //     Fără conflict de lungime.
    //   • bază Ø16 0→2,4845 + șamfren 60° până la Y=4 (4 − 0,875/tan30° =
    //     2,48446 față de 2,48 cotat, Δ 0,0045) — 100% exact pe ambele zone.
    //
    // Notă: singurul unghi cotat pe desen e cel de la bază (60°); umărul și
    // conul rezultă din perechi de cote de înălțime și diametre.
    // Coroana R3 e cea mai mare din catalog — arcul are 12 segmente pentru a
    // ține pasul unghiular sub pragul de 13° al EdgesGeometry.
    //
    // STRUCTURA (Y=0 bază → Y=34,5 vârf):
    //   • bază cilindrică Ø16                Y ∈ [0.00,  2.4845]
    //   • șamfren 60° inclus Ø16→Ø14,25      Y ∈ [2.4845, 4.00]
    //   • corp cilindric Ø14,25              Y ∈ [4.00, 21.00]
    //   • umăr 92,11° inclus Ø14,25→Ø10,1    Y ∈ [21.00, 23.00]
    //   • gât cilindric Ø10,1 (3,47 mm)      Y ∈ [23.00, 26.4713]
    //   • con 40,45° tangent la coroană (0°) Y ∈ [26.4713, 32.5372]
    //   • coroană R3 centrată pe axă (0/31,5) Y ∈ [32.5372, 34.50]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.0,     0.0],
        [8.0,     2.4845],
        [7.125,   4.0],
        [7.125,   21.0],
        [5.05,    23.0],
        [5.05,    26.4713],
        [2.815,   32.5372],
        [2.6954,  32.817],
        [2.5481,  33.0833],
        [2.3746,  33.3333],
        [2.1767,  33.5645],
        [1.9563,  33.7744],
        [1.7159,  33.9609],
        [1.4577,  34.122],
        [1.1846,  34.2562],
        [0.8993,  34.362],
        [0.6047,  34.4384],
        [0.3039,  34.4846],
        [0.0,     34.5],
      ],
      height: 34.5,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 100 },
      orthoSize: 25,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000125.png',
      pdf: '/welding-drawings/PIN-14.25-34.5-01__YRD-W1PCNCNM000125__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 8.0,   lineY: -4, label: 'Ø16',    radial: true  },
          { type: 'diameter', y: 12,    r: 7.125, lineY: 39, label: 'Ø14,25', radial: true  },
          { type: 'diameter', y: 24.7,  r: 5.05,  lineY: 42, label: 'Ø10,1',  radial: false },
          { type: 'diameter', y: 32.54, r: 2.815, lineY: 45, label: 'Ø5,63',  radial: false },
          { type: 'length', y1: 0, y2: 34.5,  edgeR1: 8.0, edgeR2: 0,     label: 'L 34,5', radial: false },
          { type: 'length', y1: 0, y2: 32.54, edgeR1: 8.0, edgeR2: 2.815, label: '32,54', radial: false },
          { type: 'length', y1: 0, y2: 23,    edgeR1: 8.0, edgeR2: 5.05,  label: '23',    radial: false },
          { type: 'length', y1: 0, y2: 21,    edgeR1: 8.0, edgeR2: 7.125, label: '21',    radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 8.0, edgeR2: 7.125, label: '4',     radial: false },
          { type: 'length', y1: 0, y2: 2.48,  edgeR1: 8.0, edgeR2: 8.0,   label: '2,48',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0037',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12-34.3-01',        // Ø corp (12mm) · L=34,3mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000126',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12 · L34,3',
    specs: [
      ['Ø corp',        '12 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø intermediar', '10 mm  (+0 / -0,05)'],
      ['Ø gât',         '8,4 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '5,18 mm'],
      ['Rază coroană',  'R2,75 mm  (centrată pe axă)'],
      ['Unghi con',     '39,58° (inclus)'],
      ['Umăr 1 / 2',    '88° (inclus, necotate)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '34,3 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000126.png',
      pdf: '/welding-drawings/PIN-12-34.3-01__YRD-W1PCNCNM000126__R00.pdf',
      cad: null,
    },
    // PRIMA PIESĂ CU PROFIL ÎN DOUĂ TREPTE: Ø12 → Ø10 → Ø8,4, deci două umere
    // și două tronsoane cilindrice intermediare.
    // Binarizare pe canale RGB (fundal albastru închis, etichetă „126").
    // Calibrare pe 8 datum-uri (34,3 / 32,48 / 28 / 25 / 20,5 / 4,5 / 2,33 / 0)
    // → scale = 11,23381 px/mm, y0 = 525,576 px, AX = 536,17 px. Δ max 0,038mm.
    // Validare forward-raster: 349 rânduri · 86,0% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 81,7% exact · 96,0% în ±1px.
    // Toate cele patru zone cilindrice (Ø14,5 / Ø12 / Ø10 / Ø8,4) ies 100%
    // exact; zonele diagonale și curbe ies mai jos pe potrivire exactă dar
    // 100% în ±1px — desenul ăsta pare trasat cu un mic decalaj subpixel pe
    // muchiile înclinate, deci potrivirea exactă nu e un criteriu util aici.
    //
    // ⚠️ CORECȚIE 1 — AL DOILEA UMĂR E PLASAT GREȘIT ÎN JSON (eroarea
    // sistematică nr. 1, a cincea oară în lot):
    //     JSON:  Ø10 20,5→25,0 (4,5 mm) · umăr2 25,0→25,8 · Ø8,4 25,8→28 (2,2 mm)
    //     REAL:  Ø10 20,5→24,17 (3,67 mm) · umăr2 24,17→25,0 · Ø8,4 25,0→28 (3,0 mm)
    // Trei dovezi independente:
    //   a) muchia reală a cercului de joncțiune Ø10↔umăr2 e desenată la
    //      y=254, x=480…592 — exact lățimea cilindrului Ø10 (113 px) — la
    //      Y=24,1749;
    //   b) linia de extensie a cotei „25" (y=245) se termină la x=583, adică
    //      pe muchia Ø8,4, NU la x=592 (muchia Ø10). Liniile de extensie se
    //      opresc pe muchia piesei de la înălțimea respectivă → la Y=25
    //      piesa e deja Ø8,4;
    //   c) cilindrul Ø8,4 (488/583) apare neîntrerupt de la y=244 în sus,
    //      iar pixelii umărului sunt la y=246…253.
    //
    // ⚠️ CORECȚIE 2 — UNGHIUL UMERILOR: 88°, nu 90°.
    // JSON marchează ambele unghiuri ca presupuneri („45deg_assumed", adică
    // 90° inclus). Ancorarea pe cele două muchii desenate dă:
    //   umăr1 (Ø12→Ø10): muchie la Y=19,4570, capăt cotat 20,5 → 87,59°
    //   umăr2 (Ø10→Ø8,4): muchie la Y=24,1749, capăt cotat 25,0 → 88,23°
    // Ambele converg la ~88°, valoare pe care am folosit-o pentru amândouă.
    // Cu 90° muchiile ar cădea la y=306,5 și y=253,7 — adică 1 px mai sus
    // decât cele măsurate (307 și 254), sistematic în aceeași direcție.
    // Testul pe rândurile umerilor confirmă (AX=536,17): umăr1 88° → 7/11
    // potriviri exacte vs 90° → 5/11; umăr2 88° → 5/8 vs 90° → 4/8.
    // Marja e însă mică (umerii au doar 11 și 8 rânduri): 90° nu poate fi
    // exclus categoric, diferența pe model fiind 0,035mm pe începutul
    // umărului. O cotă de unghi ar închide subiectul.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • PLASAREA primului umăr e corectă în JSON (19,5 → 20,5); doar
    //     unghiul era presupus. Muchia corpului Ø12 e desenată la y=307,
    //     x=468…603 — exact lățimea corpului (136 px).
    //   • bază Ø14,5 0→2,3349 + șamfren 60° până la Y=4,5 (4,5 − 1,25/tan30°
    //     = 2,33494 față de 2,33 cotat, Δ 0,0049) — 100% exact pe bază
    //   • corp Ø12 (147 rânduri), cilindru Ø10 (34) și gât Ø8,4 (33) —
    //     toate 100% exact
    //   • con tangent la coroana R2,75 centrată pe axă în (0 / 31,55), pornit
    //     din (4,2 / 28): tangența iese (2,587583 / 32,481084) → Ø5,1752 față
    //     de Ø5,18 cotat (Δ −0,0048) și Y=32,4811 față de 32,48 (Δ +0,0011).
    //     Fără conflict de lungime — vârful cade exact la 34,3.
    //
    // STRUCTURA (Y=0 bază → Y=34,3 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.3349]
    //   • șamfren 60° inclus Ø14,5→Ø12       Y ∈ [2.3349, 4.50]
    //   • corp cilindric Ø12                 Y ∈ [4.50, 19.4645]
    //   • umăr 1, 88° inclus Ø12→Ø10         Y ∈ [19.4645, 20.50]
    //   • cilindru intermediar Ø10 (3,67 mm) Y ∈ [20.50, 24.1716]
    //   • umăr 2, 88° inclus Ø10→Ø8,4        Y ∈ [24.1716, 25.00]
    //   • gât cilindric Ø8,4 (3,0 mm)        Y ∈ [25.00, 28.00]
    //   • con 39,58° tangent la coroană (0°) Y ∈ [28.00, 32.4811]
    //   • coroană R2,75 centrată pe axă (0/31,55) Y ∈ [32.4811, 34.30]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.3349],
        [6.0,     4.5],
        [6.0,     19.4645],
        [5.0,     20.5],
        [5.0,     24.1716],
        [4.2,     25.0],
        [4.2,     28.0],
        [2.5876,  32.4811],
        [2.4792,  32.74],
        [2.345,   32.9865],
        [2.1863,  33.2181],
        [2.0049,  33.4323],
        [1.8026,  33.6268],
        [1.5815,  33.7998],
        [1.3439,  33.9493],
        [1.0923,  34.0738],
        [0.8293,  34.172],
        [0.5577,  34.2428],
        [0.2803,  34.2857],
        [0.0,     34.3],
      ],
      height: 34.3,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 98 },
      orthoSize: 25,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000126.png',
      pdf: '/welding-drawings/PIN-12-34.3-01__YRD-W1PCNCNM000126__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 7.25,  lineY: -4, label: 'Ø14,5', radial: true  },
          { type: 'diameter', y: 12,    r: 6.0,   lineY: 39, label: 'Ø12',   radial: true  },
          { type: 'diameter', y: 22.3,  r: 5.0,   lineY: 42, label: 'Ø10',   radial: false },
          { type: 'diameter', y: 26.5,  r: 4.2,   lineY: 45, label: 'Ø8,4',  radial: false },
          { type: 'diameter', y: 32.48, r: 2.588, lineY: 48, label: 'Ø5,18', radial: false },
          { type: 'length', y1: 0, y2: 34.3,  edgeR1: 7.25, edgeR2: 0,     label: 'L 34,3', radial: false },
          { type: 'length', y1: 0, y2: 32.48, edgeR1: 7.25, edgeR2: 2.588, label: '32,48', radial: false },
          { type: 'length', y1: 0, y2: 28,    edgeR1: 7.25, edgeR2: 4.2,   label: '28',    radial: false },
          { type: 'length', y1: 0, y2: 25,    edgeR1: 7.25, edgeR2: 4.2,   label: '25',    radial: false },
          { type: 'length', y1: 0, y2: 20.5,  edgeR1: 7.25, edgeR2: 5.0,   label: '20,5',  radial: false },
          { type: 'length', y1: 0, y2: 4.5,   edgeR1: 7.25, edgeR2: 6.0,   label: '4,5',   radial: false },
          { type: 'length', y1: 0, y2: 2.33,  edgeR1: 7.25, edgeR2: 7.25,  label: '2,33',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0038',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-13.8-35.3-01',      // Ø corp (13,8mm) · L=35,3mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000127',
    family: 'pcp',
    name: 'Ceramic centering pin Ø13,8 · L35,3',
    specs: [
      ['Ø corp',        '13,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '16 mm'],
      ['Ø intermediar', '10 mm  (+0 / -0,05)'],
      ['Ø gât',         '8,35 mm'],
      ['Ø ref. vârf',   '4,68 mm'],
      ['Rază coroană',  'R2,5 mm  (centrată pe axă)'],
      ['Unghi con',     '41,45° (inclus)'],
      ['Umăr 1',        '91° (inclus, necotat)'],
      ['Umăr 2',        '88° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '35,3 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000127.png',
      pdf: '/welding-drawings/PIN-13.8-35.3-01__YRD-W1PCNCNM000127__R00.pdf',
      cad: null,
    },
    // A doua piesă cu profil în două trepte (după 0037): Ø13,8 → Ø10 → Ø8,35.
    // Binarizare pe canale RGB (fundal albastru; cercul ROȘU din jurul cotei
    // Ø8,35 e automat exclus din mască).
    // Calibrare pe 8 datum-uri (35,3 / 33,68 / 28,83 / 25,83 / 21,5 / 4,6 /
    // 2,69 / 0) → scale = 11,23877 px/mm, y0 = 517,641 px, AX = 177,55 px.
    // Δ max 0,036mm.
    // Validare forward-raster: 361 rânduri · 91,7% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 68,1% exact · 74,5% în ±1px —
    // cea mai mare diferență din tot lotul. Toate cele patru zone cilindrice
    // (Ø16 / Ø13,8 / Ø10 / Ø8,35) ies 100% exact.
    //
    // ⚠️ CORECȚIE MAJORĂ — ÎNTREAGA ZONĂ DE MIJLOC ERA DEPLASATĂ ÎN JSON:
    //     JSON:  corp 4,6→21,5 · tranziție lungă 21,5→25,83 (47,4°) ·
    //            Ø10 25,83→28,83 · TREAPTĂ RADIALĂ Ø10→Ø8,35 la Y=28,83 ·
    //            con de la 28,83
    //     REAL:  corp 4,6→19,633 · umăr1 19,633→21,5 (91°) ·
    //            Ø10 21,5→24,976 · umăr2 24,976→25,83 (88°) ·
    //            Ø8,35 25,83→28,83 · con de la 28,83
    // Nu există nicio treaptă radială — JSON a inventat-o ca să reconcilieze
    // plasarea greșită. Dovezi directe:
    //   a) la Y=27,0 (y=214) muchiile măsurate sunt 130/224, adică Ø8,35
    //      (94 px), NU Ø10 (112 px) — deci Ø10 nu ajunge până la 28,83;
    //   b) liniile de extensie ale cotelor „25,83" (y=227) și „28,83" (y=194)
    //      pornesc AMBELE de la x=130, adică de pe muchia Ø8,35 — la ambele
    //      înălțimi piesa e deja Ø8,35;
    //   c) muchia reală a cercului corp↔umăr1 e desenată la y=297, x=100…255
    //      — exact lățimea corpului Ø13,8 (156 px) — la Y=19,632;
    //   d) muchia reală a cercului Ø10↔umăr2 e desenată la y=237, x=121…234
    //      — exact lățimea Ø10 (114 px) — la Y=24,971. (A doua linie de
    //      aceeași lățime, y=263, e linia de cotă Ø10 — același tipar ca la
    //      piesa 0037.)
    //
    // ⚠️ UNGHIURILE UMERILOR, necotate, măsurate separat:
    //   • umăr1 = 91° — sweep pe cele 20 de rânduri (AX × unghi) dă maxim
    //     curat: 91° → 19/20 potriviri exacte, față de 88°/90° → 9/20 și
    //     86°/92° → 8-9/20. Ancorarea pe muchia desenată (Y=19,6321) și pe
    //     cota 21,5 dă 90,98°. Interval de încredere ~±1,2°.
    //   • umăr2 = 88° — ancorarea pe muchia desenată (Y=24,9708) și pe cota
    //     25,83 dă 87,67°. Umărul are doar 9 rânduri, deci testul exact e
    //     plat (84…90° dau 4-5/9); incertitudinea e ~±2,5°, adică 90° nu
    //     poate fi exclus. Sweep-ul pe profilul întreg preferă totuși 88°.
    //   Cele două umere NU au același unghi — spre deosebire de piesa 0037,
    //   unde ambele au ieșit 88°.
    //
    // ✅ CONFIRMAT (JSON corect) — vârful:
    //   • con tangent la coroana R2,5 centrată pe axă în (0 / 32,8), pornit
    //     din (4,175 / 28,83): tangența iese (2,338238 / 33,684671) →
    //     Ø4,6765 față de Ø4,68 cotat (Δ −0,0035) și Y=33,6847 față de 33,68
    //     (Δ +0,0047). Vârful cade exact la 35,3, fără conflict de lungime.
    //   • bază Ø16 0→2,6947 + șamfren 60° până la Y=4,6 (4,6 − 1,1/tan30° =
    //     2,69474 față de 2,69 cotat, Δ 0,0047) — 100% exact pe bază.
    //
    // Notă: cota Ø8,35 e ÎNCERCUITĂ CU ROȘU pe desen. Măsurătoarea o confirmă
    // exact (muchiile 130/224 → Ø8,35), deci cercul pare a fi doar un marcaj
    // de verificare, nu o corecție. De confirmat cu furnizorul.
    //
    // STRUCTURA (Y=0 bază → Y=35,3 vârf):
    //   • bază cilindrică Ø16                Y ∈ [0.00,  2.6947]
    //   • șamfren 60° inclus Ø16→Ø13,8       Y ∈ [2.6947, 4.60]
    //   • corp cilindric Ø13,8               Y ∈ [4.60, 19.6329]
    //   • umăr 1, 91° inclus Ø13,8→Ø10       Y ∈ [19.6329, 21.50]
    //   • cilindru intermediar Ø10 (3,48 mm) Y ∈ [21.50, 24.9757]
    //   • umăr 2, 88° inclus Ø10→Ø8,35       Y ∈ [24.9757, 25.83]
    //   • gât cilindric Ø8,35 (3,0 mm)       Y ∈ [25.83, 28.83]
    //   • con 41,45° tangent la coroană (0°) Y ∈ [28.83, 33.6847]
    //   • coroană R2,5 centrată pe axă (0/32,8) Y ∈ [33.6847, 35.30]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.0,     0.0],
        [8.0,     2.6947],
        [6.9,     4.6],
        [6.9,     19.6329],
        [5.0,     21.5],
        [5.0,     24.9757],
        [4.175,   25.83],
        [4.175,   28.83],
        [2.3382,  33.6847],
        [2.2374,  33.9154],
        [2.1139,  34.1348],
        [1.9689,  34.3406],
        [1.8039,  34.5309],
        [1.6207,  34.7035],
        [1.421,   34.8569],
        [1.2069,  34.9894],
        [0.9805,  35.0997],
        [0.7442,  35.1867],
        [0.5004,  35.2494],
        [0.2515,  35.2873],
        [0.0,     35.3],
      ],
      height: 35.3,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 102 },
      orthoSize: 26,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000127.png',
      pdf: '/welding-drawings/PIN-13.8-35.3-01__YRD-W1PCNCNM000127__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.3,   r: 8.0,   lineY: -4, label: 'Ø16',   radial: true  },
          { type: 'diameter', y: 12,    r: 6.9,   lineY: 40, label: 'Ø13,8', radial: true  },
          { type: 'diameter', y: 23.2,  r: 5.0,   lineY: 43, label: 'Ø10',   radial: false },
          { type: 'diameter', y: 27.3,  r: 4.175, lineY: 46, label: 'Ø8,35', radial: false },
          { type: 'diameter', y: 33.68, r: 2.338, lineY: 49, label: 'Ø4,68', radial: false },
          { type: 'length', y1: 0, y2: 35.3,  edgeR1: 8.0, edgeR2: 0,     label: 'L 35,3', radial: false },
          { type: 'length', y1: 0, y2: 33.68, edgeR1: 8.0, edgeR2: 2.338, label: '33,68', radial: false },
          { type: 'length', y1: 0, y2: 28.83, edgeR1: 8.0, edgeR2: 4.175, label: '28,83', radial: false },
          { type: 'length', y1: 0, y2: 25.83, edgeR1: 8.0, edgeR2: 4.175, label: '25,83', radial: false },
          { type: 'length', y1: 0, y2: 21.5,  edgeR1: 8.0, edgeR2: 5.0,   label: '21,5',  radial: false },
          { type: 'length', y1: 0, y2: 4.6,   edgeR1: 8.0, edgeR2: 6.9,   label: '4,6',   radial: false },
          { type: 'length', y1: 0, y2: 2.69,  edgeR1: 8.0, edgeR2: 8.0,   label: '2,69',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0039',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-9.8-30.3-01',       // Ø corp (9,8mm) · L=30,3mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000128',
    family: 'pcp',
    name: 'Ceramic centering pin Ø9,8 · L30,3',
    specs: [
      ['Ø corp',        '9,8 mm  (+0 / -0,05)'],
      ['Ø bază',        '13 mm'],
      ['Ø gât',         '6,6 mm'],
      ['Ø ref. vârf',   '2,79 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '42,88° (inclus)'],
      ['Umăr superior', '82° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '30,3 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000128.png',
      pdf: '/welding-drawings/PIN-9.8-30.3-01__YRD-W1PCNCNM000128__R00.pdf',
      cad: null,
    },
    // Vârful e identic cu al piesei 0035 (gât Ø6,6 · R1,5 · Ø2,79 · con
    // 42,88°); diferă corpul, baza și unghiul umărului.
    // Binarizare pe canale RGB (fundal albastru; cercul ROȘU din jurul cotei
    // Ø6,6 e exclus automat din mască).
    // Calibrare pe 7 datum-uri (30,3 / 29,35 / 24,5 / 21,8 / 5 / 2,23 / 0) →
    // scale = 11,24418 px/mm, y0 = 493,802 px, AX = 402,55 px. Δ max 0,052mm.
    // Validare forward-raster: 310 rânduri · 93,9% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 83,5% exact · 89,0% în ±1px.
    //
    // ⚠️ CORECȚIE — UMĂRUL DEPLASAT CU 1,8 mm ÎN JSON (eroarea sistematică
    // nr. 1, a șasea oară în lot):
    //     JSON:  corp 5→21,8 · umăr 21,8→23,4 (90°) · gât Ø6,6 23,4→24,5 (1,1 mm)
    //     REAL:  corp 5→19,96 · umăr 19,96→21,8 (82°) · gât Ø6,6 21,8→24,5 (2,7 mm)
    // Cotele 21,8 și 24,5 ÎNCADREAZĂ GÂTUL Ø6,6, nu umărul. Trei dovezi:
    //   a) muchia reală a cercului corp↔umăr e desenată la y=269, x=347…457
    //      — exact lățimea corpului Ø9,8 (111 px) — la Y=19,9928;
    //   b) linia de extensie a cotei „21,8" (y=249) se termină la x=439,
    //      adică pe muchia Ø6,6, NU pe muchia corpului (x=457). Idem linia
    //      cotei „24,5" (y=218), tot la x=439 → la ambele înălțimi piesa e
    //      deja Ø6,6;
    //   c) la Y=23,0 muchiile măsurate sunt 365/439 → Ø6,6 ✓
    //
    // ⚠️ UNGHIUL UMĂRULUI: 82°, nu 90°. JSON îl marchează explicit ca
    // presupunere („45deg_assumed"). Sweep AX × unghi pe cele 19 rânduri ale
    // umărului: 82° → 15/19 potriviri exacte, 83° → 13/19, 80° → 12/19,
    // 84° → 9/19, 86° → 4/19, 90° → 4/19. Pe profilul întreg: 82° → 93,9%,
    // 83° → 93,2%, 90° → 83,5%.
    // Ancorarea pe muchia desenată (Y=19,9928) și pe cota 21,8 dă 83,04°;
    // am folosit 82° (scorul global cel mai bun), diferența față de 83° fiind
    // 0,033mm pe începutul umărului. Cu 90° (JSON) muchia ar cădea la
    // y=266,7 — cu 2,3 px mai sus decât cea măsurată, clar greșit.
    // Notă: unghiurile umerilor din acest lot nu au nicio constantă de
    // familie (70° / 76° / 82° / 88° / 91° / 94° pe piese consecutive).
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø13 0→2,2287 + șamfren 60° până la Y=5 (5 − 1,6/tan30° =
    //     2,22872 față de 2,23 cotat, Δ 0,0013) — 100% exact pe bază
    //   • corp Ø9,8 — 100% exact pe 157 de rânduri
    //   • gât Ø6,6 — 100% exact pe 30 de rânduri
    //   • con tangent la coroana R1,5 centrată pe axă în (0 / 28,8), pornit
    //     din (3,3 / 24,5): tangența iese (1,396214 / 29,348257) → Ø2,7924
    //     față de Ø2,79 cotat (Δ +0,0024) și Y=29,3483 față de 29,35
    //     (Δ −0,0017). Vârful cade exact la 30,3, fără conflict de lungime.
    //
    // Notă: cota Ø6,6 e ÎNCERCUITĂ CU ROȘU pe desen, la fel ca Ø8,35 la piesa
    // 0038. Măsurătoarea o confirmă exact (muchii 365/439 → Ø6,6), deci pare
    // marcaj de verificare, nu corecție. De confirmat cu furnizorul.
    //
    // STRUCTURA (Y=0 bază → Y=30,3 vârf):
    //   • bază cilindrică Ø13                Y ∈ [0.00,  2.2287]
    //   • șamfren 60° inclus Ø13→Ø9,8        Y ∈ [2.2287, 5.00]
    //   • corp cilindric Ø9,8                Y ∈ [5.00, 19.9594]
    //   • umăr 82° inclus Ø9,8→Ø6,6          Y ∈ [19.9594, 21.80]
    //   • gât cilindric Ø6,6 (2,7 mm)        Y ∈ [21.80, 24.50]
    //   • con 42,88° tangent la coroană (0°) Y ∈ [24.50, 29.3483]
    //   • coroană R1,5 centrată pe axă (0/28,8) Y ∈ [29.3483, 30.30]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.5,     0.0],
        [6.5,     2.2287],
        [4.9,     5.0],
        [4.9,     19.9594],
        [3.3,     21.8],
        [3.3,     24.5],
        [1.3962,  29.3483],
        [1.3208,  29.511],
        [1.2265,  29.6636],
        [1.1146,  29.8038],
        [0.9868,  29.9297],
        [0.8449,  30.0394],
        [0.6909,  30.1314],
        [0.527,   30.2044],
        [0.3556,  30.2572],
        [0.1791,  30.2893],
        [0.0,     30.3],
      ],
      height: 30.3,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 88 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000128.png',
      pdf: '/welding-drawings/PIN-9.8-30.3-01__YRD-W1PCNCNM000128__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 6.5,   lineY: -4, label: 'Ø13',   radial: true  },
          { type: 'diameter', y: 12,    r: 4.9,   lineY: 34, label: 'Ø9,8',  radial: true  },
          { type: 'diameter', y: 23.1,  r: 3.3,   lineY: 37, label: 'Ø6,6',  radial: false },
          { type: 'diameter', y: 29.35, r: 1.396, lineY: 40, label: 'Ø2,79', radial: false },
          { type: 'length', y1: 0, y2: 30.3,  edgeR1: 6.5, edgeR2: 0,     label: 'L 30,3', radial: false },
          { type: 'length', y1: 0, y2: 29.35, edgeR1: 6.5, edgeR2: 1.396, label: '29,35', radial: false },
          { type: 'length', y1: 0, y2: 24.5,  edgeR1: 6.5, edgeR2: 3.3,   label: '24,5',  radial: false },
          { type: 'length', y1: 0, y2: 21.8,  edgeR1: 6.5, edgeR2: 3.3,   label: '21,8',  radial: false },
          { type: 'length', y1: 0, y2: 5,     edgeR1: 6.5, edgeR2: 4.9,   label: '5',     radial: false },
          { type: 'length', y1: 0, y2: 2.23,  edgeR1: 6.5, edgeR2: 6.5,   label: '2,23',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0040',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-14.25-32-01',       // Ø corp (14,25mm) · L=32mm
    },
    docerawEquivalent: 'YRD-W1PCNCNM000129',
    family: 'pcp',
    name: 'Ceramic centering pin Ø14,25 · L32',
    specs: [
      ['Ø corp',        '14,25 mm  (+0 / -0,05)'],
      ['Ø bază',        '16 mm'],
      ['Ø gât',         '8,35 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '3,66 mm'],
      ['Rază coroană',  'R2 mm  (centrată pe axă)'],
      ['Unghi con',     '47,68° (inclus)'],
      ['Umăr superior', '126,1° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '32 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000129.png',
      pdf: '/welding-drawings/PIN-14.25-32-01__YRD-W1PCNCNM000129__R00.pdf',
      cad: null,
    },
    // Aceeași bază ca piesa 0036 (Ø16 · șamfren 60° · corp Ø14,25 de la Y=4),
    // dar piesă mult mai scurtă (32 vs 34,5), cu gât Ø8,35 în loc de Ø10,1 și
    // coroană R2 în loc de R3.
    // Binarizare pe canale RGB (fundal albastru închis, eticheta „129").
    // Calibrare pe 7 datum-uri (32 / 30,81 / 25,5 / 22,5 / 4 / 2,48 / 0) →
    // scale = 11,253702 px/mm, y0 = 513,992 px, AX = 425,0 px. Δ max 0,024mm
    // — cea mai bună calibrare din lot, la egalitate cu 0036.
    //
    // ⚠️ MODEL DE RASTERIZARE DIFERIT DE RESTUL LOTULUI: aici e px = ROUND(true),
    // nu floor. Dovada: toate cele trei zone cilindrice ies perfect simetrice
    // față de AX=425,0 — bază 335…515 (180 px = Ø16), corp 345…505 (160 px =
    // Ø14,25), gât 378…472 (94 px = Ø8,35) — ceea ce cu floor ar fi imposibil
    // (floor(425−80,19)=344, dar desenul are 345). Cu floor scorul de
    // potrivire exactă cade la 0%. Am folosit round pentru toată validarea.
    //
    // Validare forward-raster: 342 rânduri · 89,8% potrivire EXACTĂ ·
    // 100,0% în ±1px.  Profilul din JSON: 76,0% exact · 86,3% în ±1px.
    // Pe zone (măsurat): bază Ø16 100% · corp Ø14,25 100% (187 rânduri) ·
    // gât Ø8,35 100% (33 rânduri) · umăr 93,8% · șamfren 87,5% ·
    // con 54,9% și coroană 25% (dar 100% în ±1px — muchii diagonale/curbe cu
    // asimetria obișnuită de rasterizare; conul e identic în ambele modele,
    // deci nu influențează comparația).
    // Pe zona umărului: JSON dă 0,0% exact ȘI 0,0% în ±1px; pe gât 3,0% /
    // 6,1%. Acolo e toată diferența.
    //
    // ⚠️ CORECȚIE — UMĂRUL ȘI GÂTUL, exact eroarea sistematică nr. 1
    // (a șaptea oară în lot). JSON a citit cotele 22,5 și 25,5 ca margini ale
    // umărului și a fost forțat să inventeze un „gât" de 0,05 mm:
    //     JSON:  corp 4→22,5 · umăr 22,5→25,45 (90° presupus) · gât Ø8,35
    //            25,45→25,5 (0,05 mm — fizic absurd)
    //     REAL:  corp 4→21,0 · umăr 21,0→22,5 (126,1°) · gât Ø8,35
    //            22,5→25,5 (3,0 mm)
    // Cotele 22,5 și 25,5 ÎNCADREAZĂ GÂTUL. Trei dovezi independente:
    //   a) muchia reală a cercului de joncțiune corp↔umăr e desenată la
    //      y=278, x=347…505 — lățimea corpului Ø14,25 (345…505), nu a
    //      gâtului — la Y=20,97. Cu umărul ancorat în 22,5 și capătul rotund
    //      Y=21,0, linia s-ar rasteriza la round(277,66)=278, adică EXACT
    //      rândul măsurat;
    //   b) liniile de extensie ale cotei Ø8,35 (coloanele x=378 și x=472)
    //      coboară până la y=261, adică fix până la Y=22,5 — la înălțimea
    //      aceea piesa e deja Ø8,35. Dacă gâtul ar începe la 25,45, ele s-ar
    //      opri la y=227;
    //   c) liniile de extensie ale cotelor „22,5" (y=261) și „25,5" (y=227)
    //      se termină AMBELE la x=472, adică pe muchia Ø8,35, nu pe muchia
    //      corpului (x=505).
    //   Între y=262 și y=277 profilul e o diagonală curată (runuri de exact
    //   2 px pe rând, 376/377 → 347), deci umărul e o generatoare dreaptă.
    //
    // ⚠️ UNGHIUL UMĂRULUI: 126,1° INCLUS — cel mai obtuz din tot catalogul,
    // și marcat explicit ca presupunere de 45° (=90° inclus) în JSON.
    // Nu e cotat pe desen; rezultă din cota 22,5 (capăt) + capătul rotund
    // Y=21,0: Δr=2,95 pe ΔY=1,5 → 2·atan(2,95/1,5) = 126,096°.
    // Panta măsurată pe pixeli e EXACT 2 px x per 1 px y pe toate cele 16
    // rânduri ale umărului (2·atan(2,0) = 126,87°), iar sweep-ul pe capătul
    // umărului preferă intervalul Y ∈ [20,95 … 21,03] (90,1% potrivire, față
    // de 84,4% la 21,05 și 83,8% la 21,10). Am ancorat pe Y=21,0 fix, pentru
    // că e singura valoare care reproduce muchia desenată de la y=278 (cu
    // 21,0249 ar cădea pe y=277). Diferența dintre 126,1° și 126,87° e
    // 0,025 mm pe începutul umărului — sub pragul vizibil.
    // Notă: unghiurile umerilor din lotul YRD nu au nicio constantă de
    // familie (70° / 76° / 82° / 88° / 91° / 92° / 94° / 126° pe piese
    // consecutive) — de aceea se măsoară de fiecare dată.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei, fără nicio presupunere:
    //   • bază Ø16 0→2,4845 + șamfren 60° ancorat pe Y=4 (4 − 0,875/tan30° =
    //     2,48446 față de 2,48 cotat, Δ 0,0045) — identic cu piesa 0036
    //   • corp Ø14,25 — 100% exact pe 187 de rânduri
    //   • gât Ø8,35 — 100% exact
    //   • con tangent la coroana R2 centrată pe axă în (0 / 30), pornit din
    //     (4,175 / 25,5): tangența iese (1,829362 / 30,808353) → Ø3,6587 față
    //     de Ø3,66 cotat (Δ −0,0013) și Y=30,8084 față de 30,81 (Δ −0,0016);
    //     unghiul rezultat 47,679° inclus. Toate cele trei cote de referință
    //     ale vârfului cad simultan, iar centrul coroanei iese exact pe axă —
    //     semnul că sistemul e consistent. Fără conflict de lungime: vârful
    //     cade fix la 32.
    //
    // Notă: cota Ø8,35 e ÎNCERCUITĂ CU ROȘU pe desen, la fel ca Ø8,35 la
    // piesa 0038 și Ø6,6 la 0039. Măsurătoarea o confirmă exact (muchii
    // 378/472 → 94 px → Ø8,353), deci pare marcaj de verificare, nu
    // corecție. De confirmat cu furnizorul.
    //
    // STRUCTURA (Y=0 bază → Y=32 vârf):
    //   • bază cilindrică Ø16                Y ∈ [0.00,  2.4845]
    //   • șamfren 60° inclus Ø16→Ø14,25      Y ∈ [2.4845, 4.00]
    //   • corp cilindric Ø14,25              Y ∈ [4.00, 21.00]
    //   • umăr 126,1° inclus Ø14,25→Ø8,35    Y ∈ [21.00, 22.50]
    //   • gât cilindric Ø8,35 (3,0 mm)       Y ∈ [22.50, 25.50]
    //   • con 47,68° tangent la coroană (0°) Y ∈ [25.50, 30.8084]
    //   • coroană R2 centrată pe axă (0/30)  Y ∈ [30.8084, 32.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.0,     0.0],
        [8.0,     2.484455543377],
        [7.125,   4.0],
        [7.125,   21.0],
        [4.175,   22.5],
        [4.175,   25.5],
        [1.829362, 30.808353],
        [1.724,   31.0137],
        [1.5958,  31.2056],
        [1.4462,  31.3815],
        [1.2774,  31.5389],
        [1.0916,  31.6758],
        [0.8913,  31.7904],
        [0.6791,  31.8812],
        [0.4578,  31.9469],
        [0.2304,  31.9867],
        [0.0,     32.0],
      ],
      height: 32.0,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM000129.png',
      pdf: '/welding-drawings/PIN-14.25-32-01__YRD-W1PCNCNM000129__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 8.0,   lineY: -4, label: 'Ø16',    radial: true  },
          { type: 'diameter', y: 12,    r: 7.125, lineY: 36, label: 'Ø14,25', radial: true  },
          { type: 'diameter', y: 24,    r: 4.175, lineY: 39, label: 'Ø8,35',  radial: false },
          { type: 'diameter', y: 30.81, r: 1.829, lineY: 42, label: 'Ø3,66',  radial: false },
          { type: 'length', y1: 0, y2: 32,    edgeR1: 8.0, edgeR2: 0,     label: 'L 32',   radial: false },
          { type: 'length', y1: 0, y2: 30.81, edgeR1: 8.0, edgeR2: 1.829, label: '30,81', radial: false },
          { type: 'length', y1: 0, y2: 25.5,  edgeR1: 8.0, edgeR2: 4.175, label: '25,5',  radial: false },
          { type: 'length', y1: 0, y2: 22.5,  edgeR1: 8.0, edgeR2: 4.175, label: '22,5',  radial: false },
          { type: 'length', y1: 0, y2: 4,     edgeR1: 8.0, edgeR2: 7.125, label: '4',     radial: false },
          { type: 'length', y1: 0, y2: 2.48,  edgeR1: 8.0, edgeR2: 8.0,   label: '2,48',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0041',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-10-30-01',          // Ø corp (10mm) · L=30mm
    },
    // ⚠️ NUMELE FIȘIERELOR au un zero lipsă față de restul seriei:
    // pe disc sunt „YRD-W1PCNCNM00130" (5 cifre), în timp ce 0128/0129 și tot
    // restul seriei folosesc 6 cifre („YRD-W1PCNCNM000128"). Am pus în assets
    // numele REALE de pe disc, ca link-urile să funcționeze, dar codul de
    // furnizor corect e cel de mai jos. De redenumit fișierele la
    // „YRD-W1PCNCNM000130" (și de actualizat cele două căi) când se face
    // curățenie în public/welding-drawings/.
    docerawEquivalent: 'YRD-W1PCNCNM000130',
    family: 'pcp',
    name: 'Ceramic centering pin Ø10 · L30',
    specs: [
      ['Ø corp',        '10 mm  (+0 / -0,05)'],
      ['Ø bază',        '13 mm'],
      ['Ø gât',         '6,6 mm  (+0 / -0,05)'],
      ['Ø ref. vârf',   '2,81 mm'],
      ['Rază coroană',  'R1,5 mm  (centrată pe axă)'],
      ['Unghi con',     '41,32° (inclus)'],
      ['Umăr superior', '88,5° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '30 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM00130.png',
      pdf: '/welding-drawings/PIN-10-30-01__YRD-W1PCNCNM00130__R00.pdf',
      cad: null,
    },
    // VÂRFUL E IDENTIC CU AL PIESEI 0032 (YRD-W1PCNCNM000098): gât Ø6,6 până
    // la Y=24 · con 41,32° · tangență (1,403528 / 29,029254) · coroană R1,5
    // centrată pe axă în (0 / 28,5) · vârf la 30. Aceleași numere până la a
    // șasea zecimală — verificare încrucișată gratuită, 0032 fiind validată
    // la 98,6% potrivire exactă. Diferă baza (Ø13 vs Ø11), corpul (Ø10 vs
    // Ø9,3) și unghiul umărului.
    //
    // Binarizare pe canale RGB (fundal albastru închis, eticheta „130").
    // Calibrare pe 7 datum-uri (30 / 29,03 / 24 / 20 / 5 / 2,4 / 0) →
    // scale = 11,240345 px/mm, y0 = 463,753 px, AX = 447,0. Δ max 0,049mm.
    // Model de rasterizare px = ROUND(true), ca la piesa 0040: cele trei zone
    // cilindrice ies perfect simetrice față de AX=447,0 — bază 374…520
    // (146 px = Ø13), corp 391…503 (112 px = Ø10), gât 410…484 (74 px = Ø6,6).
    //
    // Validare forward-raster: 313 rânduri · 90,7% potrivire EXACTĂ ·
    // 99,7% în ±1px.  Profilul din JSON: 78,3% exact · 88,2% în ±1px.
    // Pe zone (măsurat): bază Ø13 100% · corp Ø10 100% (165 rânduri) ·
    // gât Ø6,6 100% · umăr 89,5% · șamfren 86,2% (100% în ±1px) ·
    // con 54,0% dar 100% în ±1px (diagonală, asimetria obișnuită; identică în
    // ambele modele, deci nu influențează comparația).
    // Rândurile 120…143 au fost excluse din scor — eticheta și leader-ul
    // „R1,5" traversează profilul acolo. Coroana e validată în schimb direct
    // pe cote (vezi mai jos, Δ 0,003 / 0,0007 mm).
    //
    // ⚠️ CORECȚIE 1 — Ø GÂT: 6,6 mm, nu 6,5. JSON scrie peste tot „D6.5",
    // dar desenul cotează clar „Ø6,6 +0/−0,05". Pixelii decid fără echivoc:
    //   Ø6,6 → round(447−37,125)=410 și round(447+37,125)=484 ✓✓ (măsurat 410/484)
    //   Ø6,5 → round(447−36,563)=410 dar round(447+36,563)=483 ✗
    // Eroarea de 0,05mm pe rază se propagă în tot vârful (vezi corecția 3).
    //
    // ⚠️ CORECȚIE 2 — UMĂRUL ȘI GÂTUL, eroarea sistematică nr. 1 (a opta oară
    // în lot). JSON a citit cotele 20 și 24 ca margini ale unei tranziții
    // unice de 4 mm și a fost forțat să inventeze un gât de 0,09 mm:
    //     JSON:  corp 5→20 · tranziție 20→24 (47,26°) · gât Ø6,5
    //            24→24,0909 (0,09 mm) · con de la 24,0909
    //     REAL:  corp 5→20 · umăr 20→21,745 (88,5°) · gât Ø6,6
    //            21,745→24 (2,25 mm) · con de la 24,0 fix
    // Dovezi directe:
    //   a) muchia reală a cercului de joncțiune umăr↔gât e desenată la y=219,
    //      x=410…484 — EXACT lățimea gâtului Ø6,6 (410…484, 74 px), fără
    //      prelungire în afara piesei — la Y=21,7455. Cu umărul de 88,5°
    //      ancorat în cota 20 rezultă capăt la Y=21,7451, adică linia s-ar
    //      rasteriza la round(219,00)=219 → Δ 0,0004mm;
    //   b) liniile de extensie ale cotei Ø6,6 (coloanele x=410 și x=484)
    //      coboară exact până la y=219 și se opresc acolo — dacă gâtul ar
    //      începe la 24, s-ar opri la y=194;
    //   c) rândurile 195…218 au muchiile fix la 410/484 (gât Ø6,6 pe 24
    //      rânduri, 100% potrivire exactă), iar rândurile 220…238 sunt o
    //      diagonală curată (umărul). JSON prezice pe zona asta 0,0% exact
    //      și 10,5% în ±1px.
    //
    // ⚠️ UNGHIUL UMĂRULUI: 88,5° inclus, necotat. Căutare exhaustivă pe cele
    // 19 rânduri ale umărului (sweep AX × unghi, ancorat pe corp Ø10 la
    // Y=20 și pe gât Ø6,6):
    //     88,5° → 17/19 potriviri exacte  ✓ maxim curat
    //     88,0° → 15/19      89,0° → 14/19 (și ratează linia de la y=219)
    //     87,5° → 13/19      86,5° → 12/19      94,0° → 10/19
    // AX=447,0 confirmat (446,9 și 447,1 dau 12/19 la același unghi).
    // Capătul rezultat, Y=21,7451, e practic 21,75 — varianta rotundă dă
    // 88,34° și 16/19, deci diferența (0,005 mm) e sub prag; am păstrat
    // valoarea din sweep. Incertitudine ~±1°.
    //
    // ✅ „CONFLICTUL IREDUCTIBIL" DIN JSON DISPARE COMPLET. JSON declara
    // `not_simultaneously_compatible` pentru cota 24 (îi ieșea 24,0909,
    // reziduu +0,091mm) și era nevoit să accepte un gât de 0,09 mm ca să
    // salveze Ø2,81. Cauza era exclusiv Ø6,5 în loc de Ø6,6. Cu Ø6,6 și
    // conul pornit din (3,3 / 24,0) EXACT, tangent la coroana R1,5 centrată
    // pe axă în (0 / 28,5), toate cotele vârfului cad simultan:
    //     Ø la tangență  2,8071   (cotat 2,81   · Δ −0,0029)
    //     Y la tangență 29,0293   (cotat 29,03  · Δ −0,0007)
    //     vârf          30,0000   (cotat 30     · exact)
    //     unghi con     41,3217°  (necotat)
    // Pentru comparație, varianta JSON (Ø6,5 + start 24,0909) dă Ø2,8162
    // (Δ +0,0062) și Y=29,0170 (Δ −0,0130) — de 4…20 ori mai prost.
    // Centrul coroanei iese exact pe axă, semnul că sistemul e consistent.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø13 0→2,4019 + șamfren 60° ancorat pe Y=5 (5 − 1,5/tan30° =
    //     2,401924 față de 2,4 cotat, Δ 0,0019) — 100% exact pe bază
    //   • corp Ø10 — 100% exact pe 165 de rânduri
    //
    // STRUCTURA (Y=0 bază → Y=30 vârf):
    //   • bază cilindrică Ø13                Y ∈ [0.00,  2.4019]
    //   • șamfren 60° inclus Ø13→Ø10         Y ∈ [2.4019, 5.00]
    //   • corp cilindric Ø10                 Y ∈ [5.00, 20.00]
    //   • umăr 88,5° inclus Ø10→Ø6,6         Y ∈ [20.00, 21.7451]
    //   • gât cilindric Ø6,6 (2,25 mm)       Y ∈ [21.7451, 24.00]
    //   • con 41,32° tangent la coroană (0°) Y ∈ [24.00, 29.0293]
    //   • coroană R1,5 centrată pe axă (0/28,5) Y ∈ [29.0293, 30.00]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.5,     0.0],
        [6.5,     2.401923788647],
        [5.0,     5.0],
        [5.0,     20.0],
        [3.3,     21.7451],
        [3.3,     24.0],
        [1.403528, 29.029254],
        [1.3294,  29.1948],
        [1.2358,  29.3502],
        [1.1241,  29.4932],
        [0.996,   29.6216],
        [0.8533,  29.7337],
        [0.6981,  29.8277],
        [0.5327,  29.9022],
        [0.3595,  29.9563],
        [0.1811,  29.989],
        [0.0,     30.0],
      ],
      height: 30.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM00130.png',
      pdf: '/welding-drawings/PIN-10-30-01__YRD-W1PCNCNM00130__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 6.5,   lineY: -4, label: 'Ø13',   radial: true  },
          { type: 'diameter', y: 12,    r: 5.0,   lineY: 34, label: 'Ø10',   radial: true  },
          { type: 'diameter', y: 22.9,  r: 3.3,   lineY: 37, label: 'Ø6,6',  radial: false },
          { type: 'diameter', y: 29.03, r: 1.404, lineY: 40, label: 'Ø2,81', radial: false },
          { type: 'length', y1: 0, y2: 30,    edgeR1: 6.5, edgeR2: 0,     label: 'L 30',   radial: false },
          { type: 'length', y1: 0, y2: 29.03, edgeR1: 6.5, edgeR2: 1.404, label: '29,03', radial: false },
          { type: 'length', y1: 0, y2: 24,    edgeR1: 6.5, edgeR2: 3.3,   label: '24',    radial: false },
          { type: 'length', y1: 0, y2: 20,    edgeR1: 6.5, edgeR2: 5.0,   label: '20',    radial: false },
          { type: 'length', y1: 0, y2: 5,     edgeR1: 6.5, edgeR2: 5.0,   label: '5',     radial: false },
          { type: 'length', y1: 0, y2: 2.4,   edgeR1: 6.5, edgeR2: 6.5,   label: '2,4',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0042',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8-28.5-01',         // Ø corp (8mm) · L=28,5mm
    },
    // ⚠️ Ca și la 0041, numele fișierelor au un zero lipsă față de restul
    // seriei: pe disc „YRD-W1PCNCNM00131" (5 cifre) vs „YRD-W1PCNCNM000128"
    // (6 cifre) la piesele anterioare. În assets sunt numele REALE de pe disc.
    docerawEquivalent: 'YRD-W1PCNCNM000131',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8 · L28,5',
    specs: [
      ['Ø corp',        '8 mm  (+0 / -0,05)'],
      ['Ø bază',        '11 mm'],
      ['Ø gât',         '4,9 mm  (+0 / -0,05)'],
      ['Ø ref. con',    '1,97 mm  (la Y=27,68 · pe con)'],
      ['Ø la tangență', '1,89 mm  (la Y=27,83)'],
      ['Rază coroană',  'R1 mm  (centrată pe axă)'],
      ['Unghi con',     '38,36° (inclus)'],
      ['Umăr superior', '90,5° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '28,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/YRD-W1PCNCNM00131.png',
      pdf: '/welding-drawings/PIN-8-28.5-01__YRD-W1PCNCNM00131__R00.pdf',
      cad: null,
    },
    // Binarizare pe canale RGB (fundal albastru închis, eticheta „131").
    // Calibrare pe 7 datum-uri (28,5 / 27,68 / 23,5 / 20 / 5 / 2,4 / 0) →
    // scale = 11,238303 px/mm, y0 = 457,771 px, AX = 457,62. Δ max 0,052mm.
    // Model de rasterizare px = ROUND(true), ca la 0040 și 0041.
    // AX nu e semi-întreg aici: intersecția constrângerilor celor patru cote
    // de diametru (Ø11 → 396/519, Ø8 → 413/503, Ø4,9 → 430/485,
    // Ø1,97 → 447/469) lasă exact fereastra AX ∈ [457,547 · 457,689).
    //
    // Validare forward-raster: 284 rânduri · 86,6% potrivire EXACTĂ ·
    // 99,6% în ±1px.  Profilul din JSON: 84,2% exact · 99,6% în ±1px —
    // cea mai mică diferență din tot lotul, pentru că JSON a nimerit de data
    // asta STRUCTURA corect (vezi mai jos). Pe zone (măsurat): corp Ø8 100%
    // (164 rânduri) · gât Ø4,9 100% · UMĂR 100% (JSON: 53,3%) · șamfren
    // 48,3% și con 57,8% (ambele 100% în ±1px — muchii diagonale, desen
    // trasat cu decalaj subpixel, ca la 0037).
    // Rândurile 434…457 sunt excluse din scor: leader-ele cotei „60°" ies în
    // afara conturului bazei. Baza e validată în schimb pe coloane —
    // x=396 și x=519 au runuri verticale continue y=431…458, adică exact
    // Ø11 pe Y ∈ [0 · 2,40].
    //
    // ✅ ÎMPĂRȚIREA UMĂR/GÂT E CORECTĂ ÎN JSON — prima oară după 0036.
    // Cotele 20 și 23,5 încadrează umărul + gâtul, iar desenul o confirmă:
    // muchia reală a cercului de joncțiune umăr↔gât e desenată la y=216,
    // x=430…485 — exact lățimea gâtului Ø4,9 (430…485, 55 px) — la
    // Y=21,5127. Gâtul Ø4,9 ocupă rândurile 195…215 (100% potrivire exactă),
    // iar umărul rândurile 217…232 (diagonală de 1 px/rând).
    //
    // ⚠️ CORECȚIE — UNGHIUL UMĂRULUI: 90,5°, nu 90°. JSON îl marchează ca
    // presupunere („45deg_assumed"). Sweep exhaustiv AX × unghi pe cele 16
    // rânduri ale umărului:
    //     90,5° → 15/16 potriviri exacte  ✓ maxim curat (AX=457,62)
    //     91,0° → 11/16      92,0° → 9/16
    //     90,0° →  8/16 (JSON)   89,0° → 8/16   88,0° → 5/16
    // Capătul umărului iese Y=21,5365 în loc de 21,55 — Δ 0,013mm, deci
    // presupunerea JSON era practic corectă, doar 0,5° pe lângă. Ambele
    // variante rasterizează linia de joncțiune la y=216, ca desenul.
    //
    // ⚠️ „CONFLICTUL IREDUCTIBIL" DIN JSON LA VÂRF — cauza e altă
    // interpretare, nu geometria. JSON declară `not_simultaneously_compatible`
    // pentru Ø1,97 (reziduu −0,081) și Y=27,68 (reziduu +0,149), presupunând
    // că perechea cotată marchează PUNCTUL DE TANGENȚĂ con↔coroană (așa cum
    // e la toate celelalte piese din lot). Aici NU e așa.
    // Două fituri independente, făcute FĂRĂ nicio cotă, pe pixelii desenului:
    //   • fit de cerc cu centrul pe axă, pe 8 puncte ale coroanei (y=138…146):
    //     centru (0 / 27,5138), R = 0,9936, vârf la Y=28,5074
    //     → confirmă coroana R1 centrată în (0 / 27,5) și vârful la 28,5;
    //   • fit de dreaptă pe 43 de puncte ale conului (y=150…192):
    //     r = −0,344609·Y + 10,532432. Distanța de la centrul coroanei
    //     (0 / 27,5) la această dreaptă este 0,9981 — adică EXACT raza R=1.
    //     → conul desenat E TANGENT la coroană (eroare 0,002mm).
    //     Aceeași dreaptă dă r=2,45 la Y=23,4539 (cotat 23,5 · Δ 0,046).
    // Deci geometria desenată e construcția tangentă standard, cu tangența în
    // (0,944501 / 27,828507) → Ø1,8890, necotat.
    // Perechea cotată Ø1,97 / 27,68 nu e tangența, dar cade PE CON:
    //     Ø pe con la Y=27,68  = 1,9923  (cotat 1,97  · Δ +0,022)
    //     Y pe con unde Ø=1,97 = 27,7121 (cotat 27,68 · Δ +0,032)
    // adică un punct de referință pe generatoarea conului, respectat la
    // 0,02…0,03mm. De semnalat furnizorului: în restul seriei aceeași pereche
    // de cote marchează tangența, aici marchează un punct de pe con.
    // Ipoteza alternativă (forțarea cotelor ca punct de tangență) a fost
    // testată explicit: ar introduce un KINK de 8,96° între con și coroană și
    // ar da o pantă de 0,3506, mai departe de cea măsurată (0,3446) decât
    // varianta tangentă (0,3478). Pe raster cele două sunt indistinctibile
    // (51/53 vs 50/53 pe muchia dreaptă), dar fitul de cerc + distanța
    // exactă la R=1 decid clar în favoarea tangenței. Respinsă.
    //
    // ✅ CONFIRMAT (JSON corect) — restul geometriei:
    //   • bază Ø11 0→2,4019 + șamfren 60° ancorat pe Y=5 (5 − 1,5/tan30° =
    //     2,401924 față de 2,4 cotat, Δ 0,0019) — identic cu piesa 0041
    //   • corp Ø8 — 100% exact pe 164 de rânduri
    //   • gât Ø4,9 — 100% exact
    //
    // STRUCTURA (Y=0 bază → Y=28,5 vârf):
    //   • bază cilindrică Ø11                Y ∈ [0.00,  2.4019]
    //   • șamfren 60° inclus Ø11→Ø8          Y ∈ [2.4019, 5.00]
    //   • corp cilindric Ø8                  Y ∈ [5.00, 20.00]
    //   • umăr 90,5° inclus Ø8→Ø4,9          Y ∈ [20.00, 21.5365]
    //   • gât cilindric Ø4,9 (1,96 mm)       Y ∈ [21.5365, 23.50]
    //   • con 38,36° tangent la coroană (0°) Y ∈ [23.50, 27.8285]
    //   • coroană R1 centrată pe axă (0/27,5) Y ∈ [27.8285, 28.50]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [5.5,     0.0],
        [5.5,     2.401923788647],
        [4.0,     5.0],
        [4.0,     20.0],
        [2.45,    21.536532],
        [2.45,    23.5],
        [0.944501, 27.828507],
        [0.8968,  27.9425],
        [0.8354,  28.0496],
        [0.7613,  28.1484],
        [0.6755,  28.2374],
        [0.5794,  28.315],
        [0.4745,  28.3802],
        [0.3624,  28.432],
        [0.2447,  28.4696],
        [0.1233,  28.4924],
        [0.0,     28.5],
      ],
      height: 28.5,
      footprint: 14,
      camera: { theta: 0.6, phi: 1.15, radius: 80 },
      orthoSize: 20,
      drawing2d: '/welding-drawings/YRD-W1PCNCNM00131.png',
      pdf: '/welding-drawings/PIN-8-28.5-01__YRD-W1PCNCNM00131__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 5.5,   lineY: -4, label: 'Ø11',   radial: true  },
          { type: 'diameter', y: 12,    r: 4.0,   lineY: 32, label: 'Ø8',    radial: true  },
          { type: 'diameter', y: 22.5,  r: 2.45,  lineY: 35, label: 'Ø4,9',  radial: false },
          { type: 'diameter', y: 27.68, r: 0.996, lineY: 38, label: 'Ø1,97', radial: false },
          { type: 'length', y1: 0, y2: 28.5,  edgeR1: 5.5, edgeR2: 0,     label: 'L 28,5', radial: false },
          { type: 'length', y1: 0, y2: 27.68, edgeR1: 5.5, edgeR2: 0.996, label: '27,68', radial: false },
          { type: 'length', y1: 0, y2: 23.5,  edgeR1: 5.5, edgeR2: 2.45,  label: '23,5',  radial: false },
          { type: 'length', y1: 0, y2: 20,    edgeR1: 5.5, edgeR2: 4.0,   label: '20',    radial: false },
          { type: 'length', y1: 0, y2: 5,     edgeR1: 5.5, edgeR2: 4.0,   label: '5',     radial: false },
          { type: 'length', y1: 0, y2: 2.4,   edgeR1: 5.5, edgeR2: 5.5,   label: '2,4',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0043',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.8-32.6-01',      // Ø corp (12,8mm) · L=32,6mm
    },
    docerawEquivalent: '17270',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,8 · L32,6',
    specs: [
      ['Ø corp',        '12,8 mm  (+0 / -0,05)'],
      ['Ø cap',         '8,15 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,4 mm'],
      ['Ø pinten',      '6 mm'],
      ['Vârf',          'plat Ø8,15 (fără con / coroană)'],
      ['Umăr superior', '180° (față radială plană)'],
      ['Șamfren bază',  '90° (inclus)'],
      ['L (total)',     '32,6 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/17270.png',
      pdf: '/welding-drawings/PIN-12.8-32.6-01__17270__R00.pdf',
      cad: null,
    },
    // PIESĂ ATIPICĂ PENTRU CATALOG — cea mai simplă de până acum: patru
    // tronsoane cilindrice + un singur șamfren. NU are con, NU are coroană
    // și NU are gât în sensul obișnuit: capul Ø8,15 se termină cu o FAȚĂ
    // PLANĂ la Y=32,6, iar trecerea Ø12,8 → Ø8,15 e o față radială plană
    // (disc orizontal), nu un umăr conic. Desenul nu cotează nicio rază.
    //
    // Desen sursă alb pe fundal negru (17270.png, 582×572, antialiasat) →
    // binarizare pe canale RGB (R,G,B > 150). Desenul e trasat în CONTUR
    // (doar muchii), nu umplut, deci validarea compară poziția coloanelor de
    // muchie, nu runuri pline.
    // Calibrare pe 4 datum-uri de înălțime (32,6 / 22 / 3,2 / 0) →
    // scale = 9,437440 px/mm, y0 = 367,6210 px, AX = 302,145 px.
    // Δ max 0,045 mm (la Y=3,2). Model de rasterizare px = ROUND(true), ca la
    // piesele 0040–0042: cu round, toate cele 4 cote de înălțime cad pe
    // rândul desenat (60 / 160 / 337 / 368), iar cu floor doar una din patru.
    //
    // Toate cele PATRU diametre cotate se reproduc EXACT, 8/8 muchii:
    //     Ø8,15 → 264 / 341 ✓✓    Ø12,8 → 242 / 363 ✓✓
    //     Ø14,4 → 234 / 370 ✓✓    Ø6    → 274 / 330 ✓✓
    // Validare forward-raster: 616 muchii pe 308 rânduri ·
    // 99,7% potrivire EXACTĂ (0 px) · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: pinten Ø6 100% · bază Ø14,4 100% · șamfren 90° 100% ·
    // corp Ø12,8 99,7% · cap Ø8,15 99,5%. Cele două rânduri non-exacte
    // (y=60 și y=160) sunt capete de linie orizontală care se opresc cu 1 px
    // înainte de muchia verticală — artefact de desen, nu eroare de model.
    // (Nu am primit JSON de la ChatGPT pentru piesa asta, deci nu există
    // coloană de comparație JSON vs măsurat.)
    //
    // ⚠️ Ø6 E UN PINTEN (protuberanță), NU O GAURĂ. Asta e singura decizie
    // de interpretare a piesei și e demonstrată direct de raster:
    //   a) la Y=0 (y=368) linia orizontală desenată e x=274…330 — EXACT
    //      lățimea Ø6 (56 px). Dacă Ø6 ar fi o gaură borgită de jos, fața
    //      de jos a piesei ar fi desenată pe toată lățimea bazei (234…370);
    //   b) la Y=2,0 (y=349) linia orizontală e x=234…370 — EXACT lățimea
    //      Ø14,4. Asta e fața inelară de dedesubtul flanșei, adică exact ce
    //      apare când un pinten mai subțire iese din bază. Dacă ar fi gaură,
    //      fundul ei s-ar desena doar pe 274…330;
    //   c) liniile de extensie confirmă: cota „22" / „32,6" / „3,2" pleacă
    //      din stânga și se opresc la x=268 pe rândul y=368, adică fix
    //      înaintea muchiei pintenului (274) — cu spațiul standard de
    //      extensie. Coloanele x=234/370 sub y=349 și x=274/330 sub y=368
    //      sunt liniile de extensie ale cotelor Ø14,4 (dim la y=428) și Ø6
    //      (dim la y=393), cu depășirea obișnuită de ~11 px.
    // Structura rezultată e identică cu tiparul „pinten 2,00 mm + flanșă" de
    // la piesele 0003 / 0004 / 0005 / 0010 / 0011 / 0012 / 0022 / 0023 /
    // 0024 — a zecea oară în catalog, mereu cu pinten de exact 2 mm.
    //
    // ✅ ÎNĂLȚIMEA PINTENULUI = 2,00 mm, necotată dar determinată strict:
    // muchia de la y=349 admite Y ∈ [1,9200 · 2,0260] cu modelul round, iar
    // 2,00 e singurul număr rotund din fereastră (și valoarea de familie).
    // Consecință: flanșa Ø14,4 are doar 1,2 mm grosime (2,0 → 3,2).
    //
    // ✅ ȘAMFRENUL DE 90° (singurul unghi cotat) e confirmat independent:
    //   • capătul lui de sus nu e cotat, dar desenul conține muchia reală a
    //     cercului de joncțiune corp↔șamfren — linie orizontală la y=330,
    //     x=242…363, EXACT lățimea corpului Ø12,8 — la Y=3,986. Cu 90°
    //     inclus și baza la Y=3,2 rezultă 3,2 + 0,8 = 4,00, care se
    //     rasterizează la round(329,87) = 330 → Δ 0,014 mm;
    //   • panta măsurată pe cele 7 rânduri ale șamfrenului e EXACT 1 px x
    //     per 1 px y pe ambele muchii (242→235 și 363→370), adică 45° față
    //     de axă = 90° inclus. Nicio presupunere.
    //
    // ✅ FAȚA RADIALĂ DE LA Y=22 e plană, nu conică: la y=160 muchiile trec
    // de la 264/341 (Ø8,15) la 242/363 (Ø12,8) într-UN SINGUR rând, iar
    // linia orizontală de la y=160 are lățimea corpului (242…362). Un umăr
    // conic ar ocupa minim 2-3 rânduri.
    //
    // ✅ VÂRF PLAT: la y=60 există linia orizontală a feței de sus (segmentul
    // 264…341 din runul 113…340, contopit cu linia de extensie a cotei 32,6),
    // iar coloanele 264/341 merg neîntrerupt de la y=61 la y=160 — deci
    // capul e cilindric până sus. Nu există nicio rază cotată și niciun pixel
    // deasupra lui y=60.
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF NU E CORECTĂ (a doua oară după 0032).
    // Vectorii ei (extrași cu pdfplumber, scală 4,8 pt/mm) dau nivelurile
    // 0 / 3,2 / 4,1 / 22 / 32,6 și pun Ø6 pe TOT intervalul 0…3,2, adică:
    //   – modelează Ø6 ca inel interior (gaură), nu ca pinten;
    //   – ratează complet muchia de la Y=2,0;
    //   – trasează șamfrenul pe 0,9 mm (3,2 → 4,1) în loc de 0,8 mm, ceea ce
    //     ar da 83,3° inclus în loc de cei 90° cotați pe desen.
    // Generatorul PDF e fidel când datele de intrare sunt corecte, deci
    // înseamnă că sursa lui (JSON-ul / intrarea de catalog folosită la
    // generare) are aceleași două erori. Modelul de mai jos, măsurat pe
    // desenul furnizorului, e cel corect — de regenerat PDF-ul din el.
    //
    // Notă: fără cote de toleranță pe Ø14,4 și Ø6 în desen; Ø12,8 și Ø8,15
    // au ambele +0/−0,05.
    //
    // STRUCTURA (Y=0 bază pinten → Y=32,6 vârf):
    //   • pinten cilindric Ø6                Y ∈ [0.00,  2.00]
    //   • față radială spre flanșă Ø14,4     Y = 2.00
    //   • flanșă/bază cilindrică Ø14,4       Y ∈ [2.00,  3.20]
    //   • șamfren 90° inclus Ø14,4→Ø12,8     Y ∈ [3.20,  4.00]
    //   • corp cilindric Ø12,8               Y ∈ [4.00, 22.00]
    //   • față radială plană Ø12,8→Ø8,15     Y = 22.00
    //   • cap cilindric Ø8,15                Y ∈ [22.00, 32.60]
    //   • față plată Ø8,15 la vârf           Y = 32.60
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [3.0,     0.0],
        [3.0,     2.0],
        [7.2,     2.0],
        [7.2,     3.2],
        [6.4,     4.0],
        [6.4,     22.0],
        [4.075,   22.0],
        [4.075,   32.6],
        [0.0,     32.6],
      ],
      height: 32.6,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/17270.png',
      pdf: '/welding-drawings/PIN-12.8-32.6-01__17270__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 2.6,   r: 7.2,   lineY: -4, label: 'Ø14,4', radial: true  },
          { type: 'diameter', y: 1,     r: 3.0,   lineY: -8, label: 'Ø6',    radial: true  },
          { type: 'diameter', y: 13,    r: 6.4,   lineY: 36, label: 'Ø12,8', radial: true  },
          { type: 'diameter', y: 27,    r: 4.075, lineY: 39, label: 'Ø8,15', radial: false },
          { type: 'length', y1: 0, y2: 32.6, edgeR1: 3.0, edgeR2: 4.075, label: 'L 32,6', radial: false },
          { type: 'length', y1: 0, y2: 22,   edgeR1: 3.0, edgeR2: 6.4,   label: '22',     radial: false },
          { type: 'length', y1: 0, y2: 4,    edgeR1: 3.0, edgeR2: 6.4,   label: '4',      radial: false },
          { type: 'length', y1: 0, y2: 3.2,  edgeR1: 3.0, edgeR2: 7.2,   label: '3,2',    radial: false },
          { type: 'length', y1: 0, y2: 2,    edgeR1: 3.0, edgeR2: 7.2,   label: '2',      radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0044',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-15-32.5-01',        // Ø corp (15mm) · L=32,5mm
    },
    docerawEquivalent: '6564860',
    family: 'pcp',
    name: 'Ceramic centering pin Ø15 · L32,5',
    specs: [
      ['Ø corp',        '15 mm  (+0 / -0,05)'],
      ['Ø bază',        '16,5 mm'],
      ['Ø gât',         '10 mm  (+0 / -0,05)'],
      ['Rază coroană',  'R5 mm  (emisferă, centrată pe axă)'],
      ['Umăr superior', '90° (inclus)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '32,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/6564860.png',
      pdf: '/welding-drawings/PIN-15-32.5-01__6564860__R00.pdf',
      cad: null,
    },
    // ✅ PRIMA PIESĂ DIN LOT CU JSON COMPLET CORECT. Nicio corecție de
    // geometrie — nici măcar la unghiul umărului, marcat în JSON ca
    // presupunere („45deg_assumed"), care aici chiar IESE exact 90° inclus.
    // Piesă „cu capăt emisferic": coroana R5 e exact jumătate din Ø10 al
    // gâtului, deci e o EMISFERĂ perfectă așezată pe cilindru — nu există
    // con intermediar, iar tangența e exactă prin construcție (0,00°), fără
    // niciun calcul de racordare. Prima de acest tip din catalog.
    //
    // Desen sursă alb pe fundal negru (6564860.png, 599×596), BINAR PUR —
    // exact două culori, zero antialiasing, deci muchiile sunt neambigue.
    // Calibrare pe 5 datum-uri de înălțime (32,5 / 27,5 / 19,5 / 3,5 / 0) →
    // scale = 11,000010 px/mm, y0 = 440,2503 px, AX = 180,0000 px.
    // Δ max 0,0228 mm — cea mai bună calibrare din tot catalogul.
    // Scara iese practic exact 11 px/mm, iar fereastra admisibilă pentru AX
    // se strânge la [179,9999 · 180,0001] — adică axa cade pe un pixel
    // întreg, la 180,000.
    //
    // Model de rasterizare px = ROUND(true). Aici floor și round sunt
    // echivalente (diferă doar printr-un offset de 0,5 în y0 și AX, ambii
    // parametri liberi): floor dă y0=440,7503 / AX=180,5000 cu aceleași
    // reziduuri. Am păstrat round, ca la piesele 0040–0043.
    //
    // Toate cele TREI diametre cotate se reproduc EXACT, 6/6 muchii:
    //     Ø16,5 → 89 / 271 ✓✓    Ø15 → 97 / 263 ✓✓    Ø10 → 125 / 235 ✓✓
    // (Ø15 e la limită: muchiile cad la 97,4999 și 262,5001, adică la o
    // miime de pixel de pragul de rotunjire — de aici fereastra îngustă
    // de scară, s ∈ [11,0000 · 11,0154].)
    //
    // Validare forward-raster: 648 muchii pe 324 rânduri ·
    // 98,6% potrivire EXACTĂ (0 px) · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: bază Ø16,5 100% · corp Ø15 100% · umăr 90° 100% ·
    // gât Ø10 100% · șamfren 60° 95,8% · coroană R5 91,8% (toate 100%
    // în ±1px — abaterile de 1px sunt doar pe muchiile înclinate/curbe).
    //
    // ✅ UMĂRUL Ø15→Ø10: 90° INCLUS, Y ∈ [19,50 · 22,00]. Necotat ca unghi,
    // dar determinat fără nicio presupunere:
    //   a) panta desenată e EXACT 1 px x per 1 px y pe toate cele 27 de
    //      rânduri ale diagonalei, pe ambele muchii (125→97 pe y=198→226,
    //      și simetric 235→263) → 45° față de axă = 90° inclus;
    //   b) Δr = (15−10)/2 = 2,5 mm, deci cu 90° inclus ΔY = 2,5 mm, iar
    //      capătul de sus iese la 19,5 + 2,5 = 22,00 — valoare rotundă;
    //   c) muchia reală a cercului de joncțiune umăr↔gât e desenată la
    //      y=198, iar Y=22,00 se rasterizează la round(198,250) = 198,
    //      EXACT rândul desenat.
    //   Cotele 19,5 și 27,5 NU încadrează umărul (cum s-a întâmplat la
    //   0037–0041): 19,5 e piciorul umărului, iar 27,5 e centrul coroanei.
    //
    // ✅ COROANA R5: emisferă centrată pe axă în (0 / 27,5). Verificări:
    //   • R5 = Ø10/2 exact → tangentă la cilindrul gâtului prin construcție,
    //     eroare de tangență 0,00°, fără con intermediar;
    //   • apexul cade la 27,5 + 5 = 32,50 = lungimea totală cotată, iar
    //     round(82,750) = 83 = rândul liniei orizontale de sus din desen;
    //   • linia de cotă R5 (leader diagonal din stânga-sus) are vârful
    //     săgeții pe arc la (135 / 103) și continuă exact până la (180 / 138)
    //     — adică fix la centrul (AX / Y=27,5) dedus independent. Confirmare
    //     directă a poziției centrului.
    //   Discretizată în 12 segmente de 7,5° (săgeată max 0,011 mm).
    //
    // ✅ ȘAMFRENUL DE 60° (singurul unghi cotat) confirmat pe raster:
    //   piciorul lui iese la 3,5 − 0,75/tan(30°) = 2,200962, care se
    //   rasterizează la round(416,04) = 416 — exact rândul liniei orizontale
    //   desenate pe toată lățimea bazei (x=89…271, cu întreruperea de la
    //   x=180 unde trece leader-ul cotei „60°").
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF — o singură abatere, minoră. Vectorii
    // ei (pdfplumber, scală 4,8 pt/mm, centru x=682, Y=0 la top=351,28) dau
    // nivelurile 0 / 2,100 / 3,500 / 19,500 / 22,000 / 27,500 / 32,500.
    // Toate corecte, INCLUSIV umărul la 22,00 — cu excepția piciorului
    // șamfrenului: 2,100 în loc de 2,200962, ceea ce ar da 56,4° inclus în
    // loc de cei 60° cotați. Pe raster diferența se vede: cu 2,100 linia ar
    // cădea la round(417,15) = 417, dar desenul o are la 416. Δ 0,101 mm —
    // vizibil doar la lupă, dar de corectat la regenerarea PDF-ului.
    //
    // STRUCTURA (Y=0 bază → Y=32,5 vârf):
    //   • bază cilindrică Ø16,5              Y ∈ [0.00,  2.2010]
    //   • șamfren 60° inclus Ø16,5→Ø15       Y ∈ [2.2010, 3.50]
    //   • corp cilindric Ø15                 Y ∈ [3.50, 19.50]
    //   • umăr 90° inclus Ø15→Ø10            Y ∈ [19.50, 22.00]
    //   • gât cilindric Ø10 (5,5 mm)         Y ∈ [22.00, 27.50]
    //   • coroană emisferică R5 (0/27,5)     Y ∈ [27.50, 32.50]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.25,    0.0],
        [8.25,    2.200961894323],
        [7.5,     3.5],
        [7.5,     19.5],
        [5.0,     22.0],
        [5.0,     27.5],
        [4.9572,  28.1526],
        [4.8296,  28.7941],
        [4.6194,  29.4134],
        [4.3301,  30.0],
        [3.9668,  30.5438],
        [3.5355,  31.0355],
        [3.0438,  31.4668],
        [2.5,     31.8301],
        [1.9134,  32.1194],
        [1.2941,  32.3296],
        [0.6526,  32.4572],
        [0.0,     32.5],
      ],
      height: 32.5,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 95 },
      orthoSize: 24,
      drawing2d: '/welding-drawings/6564860.png',
      pdf: '/welding-drawings/PIN-15-32.5-01__6564860__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 8.25, lineY: -4, label: 'Ø16,5', radial: true  },
          { type: 'diameter', y: 11,    r: 7.5,  lineY: 36, label: 'Ø15',   radial: true  },
          { type: 'diameter', y: 24.8,  r: 5.0,  lineY: 39, label: 'Ø10',   radial: false },
          { type: 'radius',   y: 27.5,  r: 5.0,  lineY: 42, label: 'R5',    radial: false },
          { type: 'length', y1: 0, y2: 32.5, edgeR1: 8.25, edgeR2: 0,    label: 'L 32,5', radial: false },
          { type: 'length', y1: 0, y2: 27.5, edgeR1: 8.25, edgeR2: 5.0,  label: '27,5',  radial: false },
          { type: 'length', y1: 0, y2: 19.5, edgeR1: 8.25, edgeR2: 7.5,  label: '19,5',  radial: false },
          { type: 'length', y1: 0, y2: 3.5,  edgeR1: 8.25, edgeR2: 7.5,  label: '3,5',   radial: false },
          { type: 'length', y1: 0, y2: 2.2,  edgeR1: 8.25, edgeR2: 8.25, label: '2,2',   radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0045',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-12.45-27.8-01',     // Ø corp (12,45mm) · L=27,8mm
    },
    docerawEquivalent: '7073683',
    family: 'pcp',
    name: 'Ceramic centering pin Ø12,45 · L27,8',
    specs: [
      ['Ø corp',        '12,45 mm  (+0 / -0,05)'],
      ['Ø bază',        '14,5 mm'],
      ['Ø gât',         '8,4 mm  (+0 / -0,05)'],
      ['Ø ref. racord', '10,3 mm  (la Y=21,3)'],
      ['Ø vârf plat',   '3,4 mm'],
      ['Rază coroană',  'R2,5 mm  (toroidală, centru pe Ø3,4)'],
      ['Rază racordare','R1,9 mm  (necotată · interval 1,79…2,01)'],
      ['Con inferior',  '148,7° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '27,8 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/7073683.png',
      pdf: '/welding-drawings/PIN-12.45-27.8-01__7073683__R00.pdf',
      cad: null,
    },
    // ⚠️ JSON-UL DECLARA GEOMETRIA NEDETERMINABILA (`geometry_is_uniquely_
    // determined: false`, 5 cote „lipsă", 2 conflicte). NU E CAZUL: desenul
    // e complet determinat, iar toate cele 11 cote se închid simultan.
    // Singurul parametru cu adevărat necotat e raza racordării de la mijloc,
    // strânsă de raster la un interval de 0,22 mm.
    //
    // Desen binar pur (7073683.png, 639×672, două culori, zero antialiasing).
    // Calibrare pe 5 datum-uri de înălțime (27,8 / 25,3 / 21,3 / 21 / 0) →
    // scale = 11,030750 px/mm, y0 = 470,3048 px, AX = 419,5000 px
    // (fereastră AX [419,473 · 419,527]). Δ max 0,0317 mm. Model round.
    //
    // TOATE cele CINCI diametre cotate se reproduc EXACT, 10/10 muchii:
    //     Ø14,5 → 340/499 ✓✓   Ø12,45 → 351/488 ✓✓   Ø10,3 → 363/476 ✓✓
    //     Ø8,4  → 373/466 ✓✓   Ø3,4   → 401/438 ✓✓
    //
    // Validare forward-raster: 552 muchii pe 276 rânduri ·
    // 96,7% potrivire EXACTĂ · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: bază Ø14,5 100% · corp Ø12,45 100% · gât Ø8,4 100% ·
    // arc racordare 91,7% · coroană R2,5 88,5% · șamfren 60° 85,7% ·
    // con 21→21,3 0% exact dar 100% în ±1px (doar 6 muchii, toate la 1px).
    //
    // ✅ COROANA E UN SFERT DE TOR PERFECT — R2,5 centrat în (1,7 / 25,3).
    // JSON a inventat „R1.7" (nicio rază nu e cotată pe desen!) și a raportat
    // apoi două conflicte inexistente („dimension_conflict" pe Ø3,4 și
    // „height_conflict" pe 27,8). Construcția reală închide TOATE cele patru
    // cote fără reziduu:
    //   • R = (Ø8,4 − Ø3,4)/2 = 2,5 exact;
    //   • centrul la r = Ø3,4/2 = 1,7 și Y = 25,3 (cotă de pe desen);
    //   • punctul cel mai din dreapta al cercului cade în (4,2 / 25,3) →
    //     tangentă VERTICALĂ, deci racordare perfectă la gâtul Ø8,4;
    //   • punctul cel mai de sus cade în (1,7 / 25,3+2,5 = 27,8) → tangentă
    //     ORIZONTALĂ, deci racordare perfectă la fața plată Ø3,4, iar 27,8
    //     iese exact lungimea totală cotată.
    // Fit de cerc independent pe 20 de pixeli ai coroanei (fără nicio cotă)
    // dă centrul în (r=1,771 / Y=25,383) — la 0,07/0,08 mm de (1,7 / 25,3),
    // adică sub un pixel. Confirmare directă.
    //
    // ✅ RACORDAREA INFERIOARĂ = ARC + CON, cu vertexul exact pe cotele
    // Ø10,3 / 21,3. Asta e cheia piesei, și e vizibilă direct în raster:
    // desenul are TREI linii de joncțiune orizontale în zonă, la
    // y=222 (lățime = Ø8,4), y=235 (lățime = Ø10,3) și y=239 (lățime =
    // Ø12,45) — adică Y = 22,50 · 21,30 · 21,00, toate trei cotate.
    // Segmentul de jos (21,0 → 21,3) e o dreaptă: panta măsurată
    // 3,58 px/rând reproduce rândurile 236/237/238 la 478/481/485, exact
    // ca desenul, în timp ce orice arc care ar continua acolo rămâne cu
    // 2-3 px în urmă. Con de 148,7° inclus (necotat).
    // Segmentul de sus (21,3 → 22,5) e curbat: o dreaptă ar da 472 la
    // y=230 față de 470 măsurat, deci profilul e concav.
    //
    // ⚠️ RAZA RACORDĂRII: R1,9 — SINGURUL parametru necotat al piesei.
    // Sweep exhaustiv al cercului prin cele două puncte cotate (4,2 / 22,5)
    // și (5,15 / 21,3): potrivire 12/12 EXACTĂ pe toate rândurile arcului
    // pentru R ∈ [1,791 · 2,014] mm. Am ales 1,9 (mijlocul intervalului,
    // valoare rotundă); 1,8 / 1,85 / 1,95 / 2,0 sunt la fel de compatibile.
    // Diferența pe model între capetele intervalului e 0,05 mm.
    // Două ipoteze „elegante" au fost testate și RESPINSE de raster:
    //   • arc tangent la gâtul Ø8,4 (ar impune R = 1,2329): scor 9/15 exact,
    //     12/15 în ±1px — profilul iese cu 2 px prea spre interior la mijloc;
    //   • arc tangent la conul de jos (ar impune R = 1,3004): în afara
    //     intervalului admis.
    // Deci profilul are colțuri reale la ambele capete ale arcului:
    // ~16° față de generatoarea gâtului la Y=22,5 și ~13° față de con la
    // Y=21,3 — ceea ce explică de ce desenul trasează linii de joncțiune
    // acolo. Discretizat în 6 segmente de 7,9°.
    //
    // ✅ CONFIRMAT (JSON corect) — partea de jos:
    //   • bază Ø14,5 0→2,2249 + șamfren 60° ancorat pe Y=4 (4 − 1,025/tan30°
    //     = 2,224873, cotat 2,22 ✓) — 100% exact pe bază
    //   • corp Ø12,45 — 100% exact pe 171 de rânduri
    //   Notă: linia de joncțiune de la piciorul șamfrenului e desenată la
    //   y=445, iar modelul o pune la 445,76 (Δ 0,76 px). Alternativa
    //   Y=2,294 ar reproduce pixelul exact, dar s-ar cota „2,29", nu „2,22" —
    //   deci cota decide, nu pixelul.
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF ARE DOUĂ ERORI (a treia piesă la rând).
    // Vectorii ei (pdfplumber, scală 5,2993 pt/mm, centru x=682, Y=0 la
    // top=351,28) dau nivelurile 0 / 2,221 / 4,100 / 21,300 / 21,600 /
    // 22,500 / 25,300 / 27,800:
    //   a) toată zona de racordare e URCATĂ cu 0,3 mm — pune capătul
    //      corpului Ø12,45 la 21,3 (în loc de 21,0) și Ø10,3 la 21,6 (în loc
    //      de 21,3), adică folosește cota 21,3 pentru muchia greșită;
    //   b) trasează racordarea ca DOUĂ DREPTE (6,225/21,3 → 5,15/21,6 →
    //      4,2/22,5), fără arc — pe raster o astfel de poliliniune ratează
    //      14 din 15 rânduri (6,7% exact, 20,0% în ±1px);
    //   c) în plus, piciorul șamfrenului de bază e la 4,100 în loc de 4,000
    //      — exact aceeași abatere de +0,1 mm ca la piesa 0044.
    // Coroana e însă corectă în ISO (25,3 → 27,8, capăt r=1,7).
    // De regenerat PDF-ul din intrarea de mai jos.
    //
    // STRUCTURA (Y=0 bază → Y=27,8 vârf):
    //   • bază cilindrică Ø14,5              Y ∈ [0.00,  2.2249]
    //   • șamfren 60° inclus Ø14,5→Ø12,45    Y ∈ [2.2249, 4.00]
    //   • corp cilindric Ø12,45              Y ∈ [4.00, 21.00]
    //   • con 148,7° inclus Ø12,45→Ø10,3     Y ∈ [21.00, 21.30]
    //   • arc concav R1,9 Ø10,3→Ø8,4         Y ∈ [21.30, 22.50]
    //   • gât cilindric Ø8,4 (2,8 mm)        Y ∈ [22.50, 25.30]
    //   • coroană torică R2,5, centru (1,7/25,3)  Y ∈ [25.30, 27.80]
    //   • față plată Ø3,4 la vârf            Y = 27.80
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.25,    0.0],
        [7.25,    2.224872981078],
        [6.225,   4.0],
        [6.225,   21.0],
        [5.15,    21.3],
        [4.9271,  21.4384],
        [4.7255,  21.6062],
        [4.5488,  21.8001],
        [4.4006,  22.0165],
        [4.2836,  22.2513],
        [4.2,     22.5],
        [4.2,     25.3],
        [4.1786,  25.6263],
        [4.1148,  25.947],
        [4.0097,  26.2567],
        [3.8651,  26.55],
        [3.6834,  26.8219],
        [3.4678,  27.0678],
        [3.2219,  27.2834],
        [2.95,    27.4651],
        [2.6567,  27.6097],
        [2.347,   27.7148],
        [2.0263,  27.7786],
        [1.7,     27.8],
        [0.0,     27.8],
      ],
      height: 27.8,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 84 },
      orthoSize: 21,
      drawing2d: '/welding-drawings/7073683.png',
      pdf: '/welding-drawings/PIN-12.45-27.8-01__7073683__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.1,   r: 7.25,  lineY: -4, label: 'Ø14,5',  radial: true  },
          { type: 'diameter', y: 12,    r: 6.225, lineY: 33, label: 'Ø12,45', radial: true  },
          { type: 'diameter', y: 21.3,  r: 5.15,  lineY: 36, label: 'Ø10,3',  radial: false },
          { type: 'diameter', y: 23.9,  r: 4.2,   lineY: 39, label: 'Ø8,4',   radial: false },
          { type: 'diameter', y: 27.8,  r: 1.7,   lineY: 42, label: 'Ø3,4',   radial: false },
          { type: 'length', y1: 0, y2: 27.8, edgeR1: 7.25, edgeR2: 1.7,   label: 'L 27,8', radial: false },
          { type: 'length', y1: 0, y2: 25.3, edgeR1: 7.25, edgeR2: 4.2,   label: '25,3',  radial: false },
          { type: 'length', y1: 0, y2: 21.3, edgeR1: 7.25, edgeR2: 5.15,  label: '21,3',  radial: false },
          { type: 'length', y1: 0, y2: 21,   edgeR1: 7.25, edgeR2: 6.225, label: '21',    radial: false },
          { type: 'length', y1: 0, y2: 2.22, edgeR1: 7.25, edgeR2: 7.25,  label: '2,22',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0046',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-13.45-28.3-01',     // Ø corp (13,45mm) · L=28,3mm
    },
    docerawEquivalent: '7073665 / 7073679',
    family: 'pcp',
    name: 'Ceramic centering pin Ø13,45 · L28,3',
    specs: [
      ['Ø corp',        '13,45 mm  (+0 / -0,05)'],
      ['Ø bază',        '16,1 mm'],
      ['Ø gât',         '8,4 mm  (+0 / -0,05)'],
      ['Ø ref. umăr',   '10,8 mm  (la Y=21,8)'],
      ['Ø vârf plat',   '3,4 mm'],
      ['Rază coroană',  'R2,5 mm  (toroidală, centru pe Ø3,4)'],
      ['Rază umăr',     'R2 mm  (tangentă la con)'],
      ['Con umăr',      '138,7° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '28,3 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/707366579.png',
      pdf: '/welding-drawings/PIN-13.45-28.3-01__707366579__R00.pdf',
      cad: null,
    },
    // SORĂ GEOMETRICĂ CU PIESA 0045: aceeași arhitectură de vârf (coroană
    // torică + față plată Ø3,4) și aceeași arhitectură de umăr (arc + con,
    // cu un Ø de referință măsurat pe curbă). Diferă toate cotele, iar aici
    // AMBELE raze sunt cotate pe desen (R2 și R2,5), deci umărul e complet
    // determinat — spre deosebire de 0045, unde raza a trebuit dedusă.
    //
    // ⚠️ JSON-UL DECLARĂ DIN NOU GEOMETRIA NEDETERMINABILĂ
    // (`geometry_is_uniquely_determined_without_assumptions: false`, patru
    // „unresolved_regions", cinci cote „lipsă"). Nu e cazul — desenul e
    // complet determinat, iar toate cele 14 cote se închid simultan.
    // Greșeala de fond: JSON a presupus un CILINDRU Ø10,8 între Y=23 și
    // Y=25,8, plus o treaptă radială Ø10,8→Ø8,4 la Y=25,8. Rasterul îl
    // contrazice direct: pe tot intervalul y=149…181 (Y = 22,89 … 25,80)
    // muchiile sunt fix 356/449, adică Ø8,4 — nu Ø10,8. Extensiile cotei
    // Ø10,8 (coloanele x=343 și x=462) trăiesc între y=199 și 251, adică
    // INTERIORUL siluetei corpului Ø13,45; feretele lor se opresc la 7 px
    // sub linia y=193, exact tiparul de gap al desenului. Deci Ø10,8 nu e
    // un cilindru, ci un diametru de referință măsurat PE curbă, la Y=21,8.
    //
    // Desen binar pur (707366579.png, 570×675, două culori, zero antialias).
    // Calibrare pe 7 datum-uri (28,3 / 25,8 / 23 / 21,8 / 21,3 / 4,8 / 0) →
    // scale = 11,021800 px/mm, y0 = 433,3343 px, AX = 402,5000 px
    // (fereastră AX [402,378 · 402,622]). Δ max 0,039 mm. Model round.
    //
    // TOATE cele CINCI diametre cotate se reproduc EXACT, 10/10 muchii:
    //     Ø16,1 → 314/491 ✓✓   Ø13,45 → 328/477 ✓✓   Ø10,8 → 343/462 ✓✓
    //     Ø8,4  → 356/449 ✓✓   Ø3,4   → 384/421 ✓✓
    //
    // Validare forward-raster: 538 muchii pe 269 rânduri ·
    // 96,7% potrivire EXACTĂ · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: bază Ø16,1 100% · corp Ø13,45 100% · gât Ø8,4 100% ·
    // șamfren 60° 93,3% · arc R2 91,7% · coroană R2,5 77,8% ·
    // con 21,3→21,8 40% exact (10 muchii) — toate 100% în ±1px.
    //
    // ✅ COROANA — sfert de tor R2,5 centrat în (1,7 / 25,8), identic ca
    // schemă cu 0045. Aici R2,5 e COTAT pe desen, iar valoarea confirmă
    // regula de familie: R = (Ø8,4 − Ø3,4)/2 = 2,5. Se închid simultan:
    //   • centrul la r = Ø3,4/2 = 1,7, Y = 25,8 (cotat);
    //   • punctul din dreapta în (4,2 / 25,8) → tangentă verticală la gât;
    //   • punctul de sus în (1,7 / 28,3) → tangentă orizontală la fața plată,
    //     iar 28,3 iese exact lungimea totală cotată.
    //
    // ✅ UMĂRUL = ARC R2 + CON, cu vertexul exact pe cotele Ø10,8 / 21,8.
    //   • Segmentul 21,3 → 21,8 e o DREAPTĂ: panta măsurată e 2,50 px/rând
    //     constant pe toate cele 6 rânduri (328→343), iar predicția liniară
    //     reproduce y=194…198 la ±0,5 px. Con de 138,7° inclus (necotat).
    //   • Segmentul 21,8 → 23,0 e CURBAT: o dreaptă ar cădea cu până la
    //     2,1 px spre interior (săgeata arcului R2 pe coarda de 1,697 mm e
    //     0,1889 mm = 2,08 px), iar pe raster coarda ratează 11 rânduri din
    //     11 (0% exact, 18% în ±1px). Arcul R2 cotat dă 10/11 exact,
    //     11/11 în ±1px.
    //   • Centrul arcului iese în (r=6,0806 / Y=23,6806) — determinat de
    //     cele două puncte cotate + raza cotată, fără nicio presupunere.
    //   • Sweep-ul de rază pe rândurile arcului dă 11/11 exact pentru
    //     R ∈ [2,018 · 2,224]; R=2,000 (valoarea cotată) dă 10/11 exact și
    //     11/11 în ±1px, deci cota e confirmată, nu doar plauzibilă.
    //   • Racordare la con: arcul e TANGENT la conul de dedesubt în
    //     (5,4 / 21,8) — kink de doar 0,78°, adică zero în limita
    //     desenului. La capătul de sus însă arcul întâlnește gâtul Ø8,4 cu
    //     un COLȚ real de 19,9° (nu e tangent). Rasterul o confirmă: de la
    //     y=181 (x=356, cilindru) la y=182 (x=355) profilul sare imediat
    //     1 px, în loc să rămână lipit de generatoare 4-5 rânduri cum ar
    //     face o racordare tangentă. Ipoteza „tangent și la Ø8,4" (care ar
    //     muta punctul la Y=23,64) ratează y=181 cu 1 px.
    //
    // ✅ CONFIRMAT (JSON corect) — partea de jos:
    //   • bază Ø16,1 0→2,505 + șamfren 60° ancorat pe Y=4,8
    //     (4,8 − 1,325/tan30° = 2,505033, cotat 2,51 ✓)
    //   • corp Ø13,45 — 100% exact pe 166 de rânduri
    //   Ca la 0045, linia de joncțiune de la piciorul șamfrenului e desenată
    //   la y=405 iar modelul o pune la 405,73 (Δ 0,73 px) — cota 2,51 decide.
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF — o singură eroare, dar exact în
    // zona critică. Vectorii (pdfplumber, scală 5,2 pt/mm, centru x=682,
    // Y=0 la top=351,28) redau CORECT toate nivelurile: 0 / 2,500 / 4,800 /
    // 21,300 / 21,800 / 23,000 / 25,800 / 28,300 — inclusiv conul
    // (6,725/21,3)→(5,4/21,8), care apare ca dreaptă și acolo. Însă
    // segmentul (5,4/21,8)→(4,2/23,0) e trasat tot ca DREAPTĂ, adică R2 e
    // pierdut complet: coarda în loc de arc. Pe raster varianta asta ratează
    // 11 rânduri din 11. Coroana R2,5 e corectă în ISO.
    // De regenerat PDF-ul din intrarea de mai jos.
    //
    // STRUCTURA (Y=0 bază → Y=28,3 vârf):
    //   • bază cilindrică Ø16,1              Y ∈ [0.00,  2.5050]
    //   • șamfren 60° inclus Ø16,1→Ø13,45    Y ∈ [2.5050, 4.80]
    //   • corp cilindric Ø13,45              Y ∈ [4.80, 21.30]
    //   • con 138,7° inclus Ø13,45→Ø10,8     Y ∈ [21.30, 21.80]
    //   • arc concav R2 Ø10,8→Ø8,4           Y ∈ [21.80, 23.00]
    //   • gât cilindric Ø8,4 (2,8 mm)        Y ∈ [23.00, 25.80]
    //   • coroană torică R2,5, centru (1,7/25,8)  Y ∈ [25.80, 28.30]
    //   • față plată Ø3,4 la vârf            Y = 28.30
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [8.05,    0.0],
        [8.05,    2.505032706815],
        [6.725,   4.8],
        [6.725,   21.3],
        [5.4,     21.8],
        [5.1336,  21.9191],
        [4.8873,  22.0757],
        [4.6664,  22.2664],
        [4.4757,  22.4873],
        [4.3191,  22.7336],
        [4.2,     23.0],
        [4.2,     25.8],
        [4.1786,  26.1263],
        [4.1148,  26.447],
        [4.0097,  26.7567],
        [3.8651,  27.05],
        [3.6834,  27.3219],
        [3.4678,  27.5678],
        [3.2219,  27.7834],
        [2.95,    27.9651],
        [2.6567,  28.1097],
        [2.347,   28.2148],
        [2.0263,  28.2786],
        [1.7,     28.3],
        [0.0,     28.3],
      ],
      height: 28.3,
      footprint: 20,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/707366579.png',
      pdf: '/welding-drawings/PIN-13.45-28.3-01__707366579__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 8.05,  lineY: -4, label: 'Ø16,1',  radial: true  },
          { type: 'diameter', y: 12,    r: 6.725, lineY: 34, label: 'Ø13,45', radial: true  },
          { type: 'diameter', y: 21.8,  r: 5.4,   lineY: 37, label: 'Ø10,8',  radial: false },
          { type: 'diameter', y: 24.4,  r: 4.2,   lineY: 40, label: 'Ø8,4',   radial: false },
          { type: 'diameter', y: 28.3,  r: 1.7,   lineY: 43, label: 'Ø3,4',   radial: false },
          { type: 'length', y1: 0, y2: 28.3, edgeR1: 8.05, edgeR2: 1.7,   label: 'L 28,3', radial: false },
          { type: 'length', y1: 0, y2: 25.8, edgeR1: 8.05, edgeR2: 4.2,   label: '25,8',  radial: false },
          { type: 'length', y1: 0, y2: 23,   edgeR1: 8.05, edgeR2: 4.2,   label: '23',    radial: false },
          { type: 'length', y1: 0, y2: 21.8, edgeR1: 8.05, edgeR2: 5.4,   label: '21,8',  radial: false },
          { type: 'length', y1: 0, y2: 21.3, edgeR1: 8.05, edgeR2: 6.725, label: '21,3',  radial: false },
          { type: 'length', y1: 0, y2: 4.8,  edgeR1: 8.05, edgeR2: 6.725, label: '4,8',   radial: false },
          { type: 'length', y1: 0, y2: 2.51, edgeR1: 8.05, edgeR2: 8.05,  label: '2,51',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0047',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-13-28.5-01',        // Ø corp (13mm) · L=28,5mm
    },
    docerawEquivalent: 'ENDR0040926',
    family: 'pcp',
    name: 'Ceramic centering pin Ø13 · L28,5',
    specs: [
      ['Ø corp',        '13 mm  (+0 / -0,05)'],
      ['Ø bază',        '15 mm'],
      ['Ø gât',         '10,1 mm  (+0 / -0,05)'],
      ['Ø ref. umăr',   '11 mm  (la Y=19,2)'],
      ['Ø ref. vârf',   '9,3 mm  (la Y=28,09)'],
      ['Rază racordări','R0,5 mm  (umăr + vârf)'],
      ['Rază calotă',   'R26,57 mm  (cotat R20 — vezi notă)'],
      ['Con umăr',      '141,2° (inclus, necotat)'],
      ['Șamfren bază',  '60° (inclus)'],
      ['L (total)',     '28,5 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/ENDR0040926.png',
      pdf: '/welding-drawings/PIN-13-28.5-01__ENDR0040926__R00.pdf',
      cad: null,
    },
    // ⚠️ JSON DECLARĂ IARĂȘI NEDETERMINARE + un „dimension_conflict" pe R0,5.
    // Piesa e determinată; conflictul dispare complet odată ce R0,5 e pus
    // unde îl cer cotele. Vezi mai jos — e cel mai frumos rezultat din lot.
    //
    // Desen alb pe fundal negru (ENDR0040926.png, 655×691), cu eticheta
    // ROȘIE „ENDR0040926" exclusă automat prin mască pe canale (R,G,B>127).
    // Calibrare pe 7 datum-uri de înălțime (28,5 / 28,09 / 27,6 / 20,5 /
    // 18,7 / 4,3 / 0) → scale = 11,000420 px/mm, y0 = 448,6518 px,
    // AX = 458,7999 px. Δ max 0,032 mm. Model round.
    //
    // TOATE cele CINCI diametre cotate se reproduc EXACT, 10/10 muchii:
    //     Ø15 → 376/541 ✓✓   Ø13 → 387/530 ✓✓   Ø11 → 398/519 ✓✓
    //     Ø10,1 → 403/514 ✓✓ Ø9,3 → 408/510 ✓✓
    //
    // Validare forward-raster: 515 muchii pe 258 rânduri ·
    // 97,5% potrivire EXACTĂ · 99,2% în ±1px · 4 abateri de 2px (toate în
    // calotă, unde arcul e aproape orizontal și un rând de rotunjire
    // înseamnă 2-3 px pe orizontală).
    // Pe zone: bază Ø15 100% · corp Ø13 100% · gât Ø10,1 100% ·
    // R0,5 umăr 90% · R0,5 vârf 87,5% · șamfren 60° 88% · con 84,6%.
    //
    // ✅✅ DESCOPERIREA CHEIE — R0,5 E RACORDAREA DE LA VÂRFUL GÂTULUI,
    // și iese EXACT din cote, fără nicio presupunere. Un arc tangent la
    // cilindrul Ø10,1 în (5,05 / 27,6) și care trece prin Ø9,3 la Y=28,09
    // are raza:
    //     R = (0,4² + 0,49²) / (2 × 0,4) = 0,500125 mm
    // adică R0,5 la a patra zecimală. Cele patru cote (Ø10,1 · 27,6 ·
    // Ø9,3 · 28,09) sunt exact cele care definesc racordarea. JSON a mutat
    // R0,5 la umărul de jos, unde apoi i-a ieșit „conflictul" Ø11 vs Ø11,1 —
    // conflict care nu există în locul corect.
    //
    // ✅ AL DOILEA R0,5 — la umăr, tot convex, tot confirmat pe raster.
    // Muchia orizontală desenată la y=237 se termină în dreapta la x=525,
    // adică EXACT r = 6,0 = 6,5 − 0,5. Deci: corp Ø13 până la Y=18,7
    // (cotat, tangența racordării), arc R0,5 convex până la (6,0 / 19,2),
    // apoi fața radială Ø12 → Ø11 la Y=19,2. Consecință directă:
    // 19,2 = 18,7 + 0,5, ceea ce reproduce rândul desenat la round(237,44)
    // = 237 ✓ și explică de ce e cotat 18,7 (piciorul racordării, nu
    // muchia teoretică).
    //
    // ⚠️ Ø11 NU E CILINDRU, ci diametrul feței radiale de la Y=19,2.
    // Extensiile cotei Ø11 (x=398 și 519) trăiesc între y=245 și 291, adică
    // în interiorul siluetei corpului Ø13, și se opresc la 8 px sub linia
    // y=237 — tiparul de gap al desenului. Pe rândurile 224…236 profilul
    // urcă lent de la Ø10,1 la Ø10,91 (0,375 px/rând), deci acolo e un con,
    // nu un cilindru Ø11.
    //
    // ⚠️ CONUL 19,2 → 20,5 e necotat ca unghi: Ø11 → Ø10,1 pe 1,3 mm →
    // 141,2° inclus. Panta măsurată (0,375 px/rând pe 12 rânduri) confirmă
    // 0,346 teoretic la 0,03 px/rând.
    //
    // ⚠️⚠️ R20 NU SE ÎNCHIDE — de confirmat cu furnizorul.
    // Calota de sus e cotată R20, dar niciun arc R20 nu reproduce desenul:
    //   • R20 pe axă cu vârful la 28,5 (cota de lungime): trece prin Ø10,1
    //     la Y=27,85 și prin Ø9,3 la Y=27,95, adică ratează AMBELE cote de
    //     nivel (27,6 și 28,09) cu 0,25 și 0,14 mm; pe raster nimerește
    //     2 rânduri din 8;
    //   • R20 pe axă prin Ø9,3 la 28,09: vârful iese la Y=28,638, cu
    //     0,138 mm PESTE lungimea totală cotată de 28,5;
    //   • R20 pe axă prin Ø10,1 la 27,6: vârful iese la 28,248, cu 0,25 mm
    //     SUB 28,5, și nu atinge niciun rând desenat.
    // Arcul efectiv desenat, ancorat pe cotele care se închid (vârf pe axă
    // la 28,5 + racordul R0,5 care se termină în Ø9,3 la 28,09), are
    //     centru (0 / 1,9261) · R = 26,5739 mm
    // și trece prin toate rândurile măsurate (abaterile rămase sunt de
    // maximum 2 px, pe porțiunea cvasi-orizontală de lângă vârf).
    // Am modelat R26,57 pentru că închide lungimea totală și racordarea;
    // dacă furnizorul confirmă R20 ca fiind cota corectă, atunci una dintre
    // cotele 27,6 / 28,09 / 28,5 trebuie revizuită.
    //
    // ✅ CONFIRMAT — partea de jos (JSON greșit și aici):
    //   • JSON pune piciorul șamfrenului la 2,835 și corpul de la 4,567;
    //     desenul cotează 4,3 pentru corp, deci piciorul iese
    //     4,3 − 1/tan30° = 2,567949, care se rasterizează la round(420,4)
    //     = 420 — EXACT linia orizontală desenată pe toată lățimea bazei.
    //     Varianta JSON ar cădea la rândul 417.
    //   • bază Ø15 și corp Ø13 — 100% exact (28 + 272 de muchii).
    //
    // ⚠️ VEDEREA ISO DIN PDF — trei erori. Vectorii (5,2 pt/mm, centru
    // x=682, Y=0 la top=351,28) dau nivelurile 0 / 2,500 / 4,300 / 18,700 /
    // 20,500 / 20,900 / 27,600 / 28,090:
    //   a) piciorul șamfrenului la 2,500 în loc de 2,568;
    //   b) zona umărului e modelată ca două conuri drepte
    //      (6,5/18,7 → 5,5/20,5 → 5,05/20,9), fără cele două R0,5 și cu
    //      Ø11 mutat de la Y=19,2 la Y=20,5, iar capătul gâtului de la
    //      20,5 la 20,9;
    //   c) CALOTA LIPSEȘTE COMPLET — piesa se termină plat la Y=28,09 cu
    //      Ø9,3, deci vederea ISO e cu 0,41 mm mai scurtă decât cota de
    //      lungime 28,5 pe care o scrie chiar cartușul ei.
    // De regenerat PDF-ul din intrarea de mai jos.
    //
    // STRUCTURA (Y=0 bază → Y=28,5 vârf):
    //   • bază cilindrică Ø15                Y ∈ [0.00,  2.5679]
    //   • șamfren 60° inclus Ø15→Ø13         Y ∈ [2.5679, 4.30]
    //   • corp cilindric Ø13                 Y ∈ [4.30, 18.70]
    //   • racordare R0,5 convexă Ø13→Ø12     Y ∈ [18.70, 19.20]
    //   • față radială Ø12→Ø11               Y = 19.20
    //   • con 141,2° inclus Ø11→Ø10,1        Y ∈ [19.20, 20.50]
    //   • gât cilindric Ø10,1 (7,1 mm)       Y ∈ [20.50, 27.60]
    //   • racordare R0,5 convexă Ø10,1→Ø9,3  Y ∈ [27.60, 28.09]
    //   • calotă R26,57 pe axă (0/1,926)     Y ∈ [28.09, 28.50]
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [7.5,     0.0],
        [7.5,     2.567949],
        [6.5,     4.3],
        [6.5,     18.7],
        [6.4904,  18.7975],
        [6.4619,  18.8913],
        [6.4157,  18.9778],
        [6.3536,  19.0536],
        [6.2778,  19.1157],
        [6.1913,  19.1619],
        [6.0975,  19.1904],
        [6.0,     19.2],
        [5.5,     19.2],
        [5.05,    20.5],
        [5.05,    27.6],
        [5.0405,  27.6972],
        [5.0122,  27.7907],
        [4.9663,  27.8769],
        [4.9046,  27.9525],
        [4.8293,  28.0147],
        [4.7433,  28.0611],
        [4.65,    28.0899],
        [4.0737,  28.1859],
        [3.4954,  28.2691],
        [2.9154,  28.3396],
        [2.334,   28.3973],
        [1.7515,  28.4422],
        [1.1681,  28.4743],
        [0.5842,  28.4936],
        [0.0,     28.5],
      ],
      height: 28.5,
      footprint: 18,
      camera: { theta: 0.6, phi: 1.15, radius: 86 },
      orthoSize: 22,
      drawing2d: '/welding-drawings/ENDR0040926.png',
      pdf: '/welding-drawings/PIN-13-28.5-01__ENDR0040926__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 1.2,   r: 7.5,  lineY: -4, label: 'Ø15',   radial: true  },
          { type: 'diameter', y: 11,    r: 6.5,  lineY: 34, label: 'Ø13',   radial: true  },
          { type: 'diameter', y: 19.2,  r: 5.5,  lineY: 37, label: 'Ø11',   radial: false },
          { type: 'diameter', y: 24,    r: 5.05, lineY: 40, label: 'Ø10,1', radial: false },
          { type: 'diameter', y: 28.09, r: 4.65, lineY: 43, label: 'Ø9,3',  radial: false },
          { type: 'length', y1: 0, y2: 28.5,  edgeR1: 7.5, edgeR2: 0,    label: 'L 28,5', radial: false },
          { type: 'length', y1: 0, y2: 28.09, edgeR1: 7.5, edgeR2: 4.65, label: '28,09', radial: false },
          { type: 'length', y1: 0, y2: 27.6,  edgeR1: 7.5, edgeR2: 5.05, label: '27,6',  radial: false },
          { type: 'length', y1: 0, y2: 20.5,  edgeR1: 7.5, edgeR2: 5.05, label: '20,5',  radial: false },
          { type: 'length', y1: 0, y2: 18.7,  edgeR1: 7.5, edgeR2: 6.5,  label: '18,7',  radial: false },
          { type: 'length', y1: 0, y2: 4.3,   edgeR1: 7.5, edgeR2: 6.5,  label: '4,3',   radial: false },
          { type: 'length', y1: 0, y2: 2.51,  edgeR1: 7.5, edgeR2: 7.5,  label: '2,51',  radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0048',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-8.8-52.1-01',       // Ø corp (8,8mm) · L=52,1mm
    },
    docerawEquivalent: 'EZ1',
    family: 'pcp',
    name: 'Ceramic centering pin Ø8,8 · L52,1 · M8',
    specs: [
      ['Ø corp',        '8,8 mm  (+0 / -0,05)'],
      ['Ø cap',         '6,7 mm  (+0 / -0,05)'],
      ['Ø bloc bază',   '12 mm  (+0,1 / -0)'],
      ['Lăsări plane',  '10,8 mm între fețe  (Y 11…21)'],
      ['Filet interior','M8 · adâncime 15 mm  (orb, din bază)'],
      ['Ø față vârf',   '5,7 mm  (plată)'],
      ['Rază muchie',   'R0,5 mm  (doar muchia superioară)'],
      ['Trunchi con',   '92,79° (inclus, necotat)'],
      ['L (total)',     '52,1 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/EZ1.png',
      pdf: '/welding-drawings/PIN-8.8-52.1-01__EZ1__R00.pdf',
      cad: null,
    },
    // ⚠️ PRIMA PIESĂ DIN CATALOG CARE NU E CORP DE REVOLUȚIE PUR ȘI PRIMA
    // CU FILET INTERIOR. `lathePoints` de mai jos descrie DOAR conturul de
    // revoluție; cele două lăsări plane și gaura filetată M8 nu pot fi
    // reprezentate în modelul de strung și sunt documentate aici + în specs.
    // Randarea 3D va arăta blocul de bază ca cilindru Ø12 plin — corect ca
    // siluetă exterioară, dar fără fețele plane și fără filet.
    //
    // ✅ JSON-UL E CORECT PE TOATĂ GEOMETRIA DE REVOLUȚIE — a doua oară în
    // lot, după 0044. Inclusiv unghiul trunchiului (92,794°, necotat) și
    // regula explicită „do_not_replace_top_R0.5_with_domed_crown", care e
    // exactă: aici R0,5 rotunjește doar muchia, nu formează coroană.
    // Singurul lucru pe care nu îl prinde e natura cotei „10,8".
    //
    // ⚠️ COTA „扁位10,8" NU E DIAMETRU, CI DESCHIDEREA ÎNTRE DOUĂ LĂSĂRI
    // PLANE. Dovada e comparația celor două vederi ale desenului:
    //   • vederea din stânga (privire paralelă cu fețele) dă silueta 251/353
    //     = 102 px = 10,8 mm pe Y ∈ [11,04 · 21,00];
    //   • vederea din dreapta (privire perpendiculară pe fețe) dă pe EXACT
    //     aceleași rânduri silueta 591/704 = 113 px = Ø12 — neîntreruptă de
    //     la Y=0 la Y=21.
    //   Dacă ar fi fost un tronson strunjit la Ø10,8, ambele vederi ar fi
    //   arătat 10,8. Confirmare cantitativă: dreptunghiul desenat în vederea
    //   din dreapta (x 623…672 = 49 px) e fața plană văzută frontal, iar
    //   coarda teoretică a unei lăsări de 10,8 pe Ø12 e
    //   2·√(6² − 5,4²) = 5,2307 mm = 49,4 px. Potrivire la 0,4 px.
    //   Capătul de jos al lăsării: Y=11,04 în vederea din stânga (planul
    //   propriu-zis) și Y=10,20 în cea din dreapta (curba de ieșire de pe
    //   cilindru) — diferența de 0,85 mm e degajarea sculei. Lungimea
    //   lăsării nu e cotată; de confirmat cu furnizorul dacă e 10 mm exact.
    //
    // Desen alb pe fundal negru (EZ1.png, 768×804), cu DOUĂ vederi.
    // Calibrare pe 5 datum-uri de înălțime (52,1 / 48,5 / 47,5 / 21 / 0) →
    // scale = 9,443360 px/mm, y0 = 581,2796 px, AX = 301,6728 px (vederea
    // din stânga) și AX = 647,5 px (vederea din dreapta). Δ max 0,030 mm.
    //
    // Toate cele PATRU lățimi cotate se reproduc EXACT, 8/8 muchii:
    //     Ø12 → 245/358 ✓✓   10,8 → 251/353 ✓✓
    //     Ø8,8 → 260/343 ✓✓  Ø6,7 → 270/333 ✓✓
    //
    // Validare forward-raster pe VEDEREA DIN DREAPTA (singura în care tot
    // profilul e de revoluție): 966 muchii pe 483 rânduri ·
    // 99,7% potrivire EXACTĂ · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: bloc Ø12 100% · corp Ø8,8 100% · cap Ø6,7 100% ·
    // trunchi 88,9% · R0,5 87,5% (ambele 100% în ±1px).
    // Pe vederea din stânga aceleași zone dau tot 100% exact, cu excepția
    // zonei lăsării plane, unde modelul de revoluție se abate sistematic
    // cu 5-6 px — exact adâncimea lăsării, deci confirmarea ei.
    //
    // ✅ VÂRFUL — plat, cu muchia ruptă R0,5, fără coroană:
    //   • fața plată are r = 3,35 − 0,5 = 2,85 → Ø5,7, iar linia de cotă
    //     52,1 se termină la x=329, adică EXACT round(301,673 + 9,4434×2,85)
    //     = 329 ✓;
    //   • tangența arcului la cilindrul Ø6,7 iese la Y = 52,1 − 0,5 = 51,6,
    //     care se rasterizează la round(94,0) = 94 — EXACT linia orizontală
    //     desenată pe lățimea Ø6,7 ✓.
    //
    // ✅ FILETUL M8 × 15 adâncime confirmat pe raster: linia întreruptă a
    // fundului găurii e desenată la y=439 → Y = 15,067 (cotat 15, Δ 0,067).
    // Liniile laterale ale filetului (perechile 264/339 și 269/335) dau
    // 75 px = 7,94 mm și 66 px = 6,99 mm — adică Ø nominal M8 și Ø de fund
    // ≈ 6,8 (burghiu standard pentru M8×1,25). Nu sunt cotate pe desen.
    //
    // ✅ TRUNCHIUL Ø8,8 → Ø6,7 e o dreaptă pe exact 1 mm (Y 47,5 → 48,5,
    // ambele cotate) → Δr = 1,05 ⇒ 92,79° inclus. Necotat, dar determinat
    // fără nicio presupunere. 100% exact pe raster.
    //
    // STRUCTURA (Y=0 bază → Y=52,1 vârf):
    //   • bloc cilindric Ø12                 Y ∈ [0.00, 21.00]
    //     (cu două lăsări plane 10,8 pe Y ∈ [11.04, 21.00] — nemodelate)
    //     (cu filet interior M8, orb, adâncime 15 din bază — nemodelat)
    //   • treaptă radială Ø12→Ø8,8           Y = 21.00
    //   • corp cilindric Ø8,8                Y ∈ [21.00, 47.50]
    //   • trunchi 92,79° inclus Ø8,8→Ø6,7    Y ∈ [47.50, 48.50]
    //   • cap cilindric Ø6,7                 Y ∈ [48.50, 51.60]
    //   • muchie ruptă R0,5                  Y ∈ [51.60, 52.10]
    //   • față plată Ø5,7 la vârf            Y = 52.10
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF — DOUĂ ERORI, ambele în blocul de bază.
    // (Notă de extracție: aici vederea ISO e la x ∈ [665 · 699], centru
    // x=682, scală 2,85 pt/mm identică pe orizontală și verticală, Y=0 la
    // top=351,28. Liniile de la x=586/663/708/726/762 sunt chenarul
    // cartușului, nu geometrie — la prima extracție le luasem drept piesă.)
    // Silhuetele verticale extrase dau:
    //     Ø12   → Y ∈ [0,00 ·  1,00]   (1,0 mm!)
    //     Ø8    → Y ∈ [0,00 · 15,00]   (filetul M8, corect ✓)
    //     Ø10,8 → Y ∈ [2,00 · 21,00]
    //     Ø8,8  → Y ∈ [21,00 · 47,50]  ✓
    //     Ø6,7  → Y ∈ [48,50 · 51,60]  ✓
    //   a) tratează cei 10,8 ca DIAMETRU STRUNJIT (corp de revoluție), nu ca
    //      deschidere între două lăsări plane — exact confuzia demontată mai
    //      sus prin compararea celor două vederi ale desenului;
    //   b) pune treapta Ø12→Ø10,8 la Y=2,00, în timp ce desenul o dă la
    //      Y≈11,04 (planul propriu-zis) / Y=10,20 (ieșirea de sculă).
    //      Diferență de ~9 mm: în ISO blocul Ø12 are doar 1 mm înălțime, pe
    //      desen are 11.
    // Restul vederii (filet M8×15, corp Ø8,8, cap Ø6,7, trunchi, R0,5) e
    // corect. De regenerat PDF-ul — și de reținut că lăsările plane nu pot
    // fi redate de un generator pur de revoluție, deci ISO-ul va rămâne
    // aproximativ până când se trece pe un model solid.
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.0,     0.0],
        [6.0,     21.0],
        [4.4,     21.0],
        [4.4,     47.5],
        [3.35,    48.5],
        [3.35,    51.6],
        [3.3404,  51.6975],
        [3.3119,  51.7913],
        [3.2657,  51.8778],
        [3.2036,  51.9536],
        [3.1278,  52.0157],
        [3.0413,  52.0619],
        [2.9475,  52.0904],
        [2.85,    52.1],
        [0.0,     52.1],
      ],
      height: 52.1,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 140 },
      orthoSize: 36,
      drawing2d: '/welding-drawings/EZ1.png',
      pdf: '/welding-drawings/PIN-8.8-52.1-01__EZ1__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 10,   r: 6.0,  lineY: -4, label: 'Ø12',   radial: true  },
          { type: 'diameter', y: 34,   r: 4.4,  lineY: 30, label: 'Ø8,8',  radial: true  },
          { type: 'diameter', y: 50,   r: 3.35, lineY: 33, label: 'Ø6,7',  radial: false },
          { type: 'length', y1: 0, y2: 52.1, edgeR1: 6.0, edgeR2: 2.85, label: 'L 52,1', radial: false },
          { type: 'length', y1: 0, y2: 48.5, edgeR1: 6.0, edgeR2: 3.35, label: '48,5',  radial: false },
          { type: 'length', y1: 0, y2: 47.5, edgeR1: 6.0, edgeR2: 4.4,  label: '47,5',  radial: false },
          { type: 'length', y1: 0, y2: 21,   edgeR1: 6.0, edgeR2: 6.0,  label: '21',    radial: false },
        ],
      },
    },
  },
  {
    tempCode: 'DGSI-RPW-PIN-0049',
    dgsiCode: null,                       // PENDING — vezi conflict codificare
    dgsiCodeCandidates: {
      cartusPdf: 'PIN-10.8-52-01',        // Ø corp (10,8mm) · L=52mm
    },
    docerawEquivalent: 'EZ2',
    family: 'pcp',
    name: 'Ceramic centering pin Ø10,8 · L52 · M8',
    specs: [
      ['Ø corp',        '10,8 mm  (+0 / -0,05)'],
      ['Ø cap',         '8,4 mm  (+0 / -0,05)'],
      ['Ø bloc bază',   '12 mm  (+0,1 / -0)'],
      ['Lăsări plane',  '10,8 mm între fețe  (Y 11…21)'],
      ['Filet interior','M8 · adâncime 15 mm  (orb, din bază)'],
      ['Ø față vârf',   '7,4 mm  (plată)'],
      ['Rază muchie',   'R0,5 mm  (doar muchia superioară)'],
      ['Trunchi con',   '77,32° (inclus, necotat)'],
      ['L (total)',     '52 mm'],
      ['Material',      'ZrO2 (Cerazur®)'],
      ['Rev.',          'R00 · DRAFT'],
    ],
    assets: {
      drawing2d: '/welding-drawings/EZ2.png',
      pdf: '/welding-drawings/PIN-10.8-52-01__EZ2__R00.pdf',
      cad: null,
    },
    // SORĂ DE FAMILIE CU 0048 (EZ1): aceeași arhitectură — bloc Ø12 cu două
    // lăsări plane și filet M8 orb, corp cilindric, trunchi de con, cap
    // cilindric, muchie ruptă R0,5, față plată. Toate cotele diferă însă.
    //
    // ⚠️⚠️ ATENȚIE LA JSON — „EZ2_corrected" A DISTRUS PIESA.
    // JSON-ul primit se prezenta ca o corectură (`correction_status:
    // "dimensions_repaired_from_original_drawing"`) și declara patru valori
    // drept greșite, înlocuindu-le cu valorile de pe desenul piesei 0048:
    //     L 52,0 → „52,1"    Ø corp 10,8 → „8,8"
    //     Ø cap 8,4 → „6,7"  capăt corp 47,0 → „47,5"
    // Măsurătoarea arată că TOATE CELE PATRU VALORI ORIGINALE ERAU CORECTE
    // și cartușul PDF le confirmă („PIN-10.8-52-01 · body diameter 10.8 mm ·
    // overall length 52 mm"). Profilul „corectat" era identic bit cu bit cu
    // al lui 0048 — o copie, nu o corecție. Cauza probabilă: JSON-ul inițial
    // al lui EZ2 fusese generat citind desenul EZ1 și confundând cota
    // „扁位10,8" (lăsările plane) cu diametrul corpului — eroarea R5 din
    // ghidul de prompt. „Corectura" a mers mai departe pe desenul greșit.
    // Concluzie de proces: o secțiune `dimension_validation` plină de
    // `"error": 0.0` NU e o verificare — compară cota cu ea însăși.
    //
    // Desen alb pe fundal negru (EZ2.png, 752×854), cu DOUĂ vederi.
    // Calibrare pe 5 datum-uri de înălțime (52 / 48,5 / 47 / 21 / 0) →
    // scale = 9,443400 px/mm, y0 = 591,4198 px; AX = 317,5000 (vederea din
    // stânga, fereastră [317,494 · 317,506] — cea mai strânsă din catalog)
    // și AX = 642,6717 (vederea din dreapta). Δ max 0,045 mm.
    //
    // Toate cele TREI lățimi cotate se reproduc EXACT, 6/6 muchii:
    //     Ø12 → 261/374 ✓✓   Ø10,8 → 267/368 ✓✓   Ø8,4 → 278/357 ✓✓
    //
    // Validare forward-raster pe VEDEREA DIN DREAPTA (singura în care tot
    // profilul e de revoluție): 968 muchii pe 484 rânduri ·
    // 99,9% potrivire EXACTĂ · 100,0% în ±1px · 0 abateri > 1px.
    // Pe zone: bloc Ø12 100% · corp Ø10,8 100% · trunchi 100% ·
    // cap Ø8,4 100% · R0,5 87,5% (100% în ±1px).
    //
    // ⚠️ LĂSĂRILE PLANE — deschidere 10,8 mm, IDENTICĂ cu Ø corpului.
    // Coincidența asta face silueta din vederea din stânga CONTINUĂ de la
    // Y=11 până la Y=47 (267/368 neîntrerupt), ceea ce poate induce în
    // eroare: pare un singur cilindru Ø10,8 de 36 mm. Nu e. Dovada, ca la
    // 0048, e comparația celor două vederi pe ACELEAȘI rânduri:
    //     vederea din stânga,  Y ∈ [11 · 21] → 267/368 = 10,8 mm
    //     vederea din dreapta, Y ∈ [11 · 21] → 586/699 = Ø12
    // Pe vederea din stânga modelul de revoluție se abate exact 6 px pe
    // ambele muchii în tot intervalul (174 muchii) — adică 0,635 mm, față
    // de adâncimea teoretică (12 − 10,8)/2 = 0,6 mm. Confirmare directă.
    // Capătul de jos al lăsării: Y = 11,004 (măsurat, necotat pe desen).
    // Lăsarea urcă până la Y=21, unde începe corpul strunjit Ø10,8.
    //
    // ✅ VÂRFUL — plat, cu muchia ruptă R0,5, fără coroană (ca la 0048):
    //   • fața plată are r = 4,2 − 0,5 = 3,7 → Ø7,4, iar linia de cotă 52
    //     se termină la x=352, adică EXACT round(317,5 + 9,4434×3,7) = 352 ✓
    //   • tangența arcului la cilindrul Ø8,4 iese la Y = 52 − 0,5 = 51,5,
    //     care se rasterizează la round(105,0) = 105 — EXACT linia
    //     orizontală desenată pe lățimea Ø8,4 ✓
    //
    // ✅ TRUNCHIUL Ø10,8 → Ø8,4 pe 1,5 mm (Y 47 → 48,5, ambele cotate) →
    // Δr = 1,2 ⇒ 77,32° inclus. Necotat, dar determinat fără presupuneri.
    // 100% exact pe raster. (La 0048 același tip de trunchi are 92,79°, pe
    // 1,0 mm — încă o confirmare că unghiurile nu au constantă de familie.)
    //
    // ✅ FILETUL M8 × 15 adâncime: linia întreruptă a fundului găurii e
    // desenată la y=449 → Y = 15,081 (cotat 15, Δ 0,081). Liniile laterale
    // (280/355 și 284/350) dau 7,942 mm și 6,989 mm — Ø nominal M8 și Ø de
    // fund ≈ 7,0. Necotate pe desen.
    //
    // ⚠️ VEDEREA ISO DIN CARTUȘUL PDF — aceeași eroare ca la 0048.
    // (centru x=682, scală 2,85 pt/mm, Y=0 la top=351,28; liniile de la
    // x=663 sunt chenarul cartușului, nu geometrie.) Siluetele dau:
    //     Ø12   → Y ∈ [0,00 ·  1,00]   ✗ (desenul: 0 → 21)
    //     Ø8    → Y ∈ [0,00 · 15,00]   ✓ filet M8
    //     Ø10,8 → Y ∈ [2,00 · 47,00]   ✗ jos (desenul: strunjit doar de la 21)
    //     Ø8,4  → Y ∈ [48,50 · 51,50]  ✓
    // Modelează lăsările ca diametru strunjit și pune treapta la Y=2,00 în
    // loc de Y≈11. Ca la 0048, eroarea NU se repară doar prin regenerare:
    // un generator pur de revoluție nu poate reda fețele plane.
    //
    // STRUCTURA (Y=0 bază → Y=52 vârf):
    //   • bloc cilindric Ø12                 Y ∈ [0.00, 21.00]
    //     (cu două lăsări plane 10,8 pe Y ∈ [11.00, 21.00] — nemodelate)
    //     (cu filet interior M8, orb, adâncime 15 din bază — nemodelat)
    //   • treaptă radială Ø12→Ø10,8          Y = 21.00
    //   • corp cilindric Ø10,8               Y ∈ [21.00, 47.00]
    //   • trunchi 77,32° inclus Ø10,8→Ø8,4   Y ∈ [47.00, 48.50]
    //   • cap cilindric Ø8,4                 Y ∈ [48.50, 51.50]
    //   • muchie ruptă R0,5                  Y ∈ [51.50, 52.00]
    //   • față plată Ø7,4 la vârf            Y = 52.00
    profile3d: {
      material3d: 'zro2',        // preset material: 'zro2' | 'kcf' | 'cupru'
      lathePoints: [
        [6.0,     0.0],
        [6.0,     21.0],
        [5.4,     21.0],
        [5.4,     47.0],
        [4.2,     48.5],
        [4.2,     51.5],
        [4.1904,  51.5975],
        [4.1619,  51.6913],
        [4.1157,  51.7778],
        [4.0536,  51.8536],
        [3.9778,  51.9157],
        [3.8913,  51.9619],
        [3.7975,  51.9904],
        [3.7,     52.0],
        [0.0,     52.0],
      ],
      height: 52.0,
      footprint: 16,
      camera: { theta: 0.6, phi: 1.15, radius: 140 },
      orthoSize: 36,
      drawing2d: '/welding-drawings/EZ2.png',
      pdf: '/welding-drawings/PIN-10.8-52-01__EZ2__R00.pdf',
      dims3d: {
        items: [
          { type: 'diameter', y: 10,   r: 6.0,  lineY: -4, label: 'Ø12',   radial: true  },
          { type: 'diameter', y: 34,   r: 5.4,  lineY: 30, label: 'Ø10,8', radial: true  },
          { type: 'diameter', y: 50,   r: 4.2,  lineY: 33, label: 'Ø8,4',  radial: false },
          { type: 'length', y1: 0, y2: 52,   edgeR1: 6.0, edgeR2: 3.7, label: 'L 52', radial: false },
          { type: 'length', y1: 0, y2: 48.5, edgeR1: 6.0, edgeR2: 4.2, label: '48,5', radial: false },
          { type: 'length', y1: 0, y2: 47,   edgeR1: 6.0, edgeR2: 5.4, label: '47',   radial: false },
          { type: 'length', y1: 0, y2: 21,   edgeR1: 6.0, edgeR2: 6.0, label: '21',   radial: false },
        ],
      },
    },
  },
];  