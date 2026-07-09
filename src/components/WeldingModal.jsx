import React, { useState, useMemo } from 'react';
import { X, Zap, Search, Wrench, ChevronRight, ChevronLeft, Download, FileText, Check, Mail, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import PRODUCTS from '../data/weldingProducts.json';

// ═══════════════════════════════════════════════════════════════════════════
// _configurator_welding_7.7.26 · v6 — JSON-DRIVEN CATALOG
//   Data source: src/data/weldingProducts.json (generated from Catalog_v3)
//   Regenerate:  npm run catalog   (scripts/excel_to_json.py)
//   PATH 1: New System Wizard · PATH 2: Spare Parts Finder · RFQ mailto
// ═══════════════════════════════════════════════════════════════════════════

const RFQ_EMAIL = 'office@industrytools.ro';
const SCALE = 3.5;

// ─── CATALOG SLICES (by category) ────────────────────────────────────────────
const uppers = PRODUCTS.filter(p => p.category === 'Electrozi superiori');
const lowers = PRODUCTS.filter(p => p.category === 'Electrozi inferiori');
const pins   = PRODUCTS.filter(p => p.category && p.category.startsWith('Pini'));
const bushes = PRODUCTS.filter(p => p.category === 'Bucse');

// ─── DOMAIN LOGIC ────────────────────────────────────────────────────────────
// Nut → hole diameter (approx). Pin tip must be immediately smaller than hole.
const NUT_HOLE = { M6: 5.0, M8: 6.8, M10: 8.5, M12: 10.2, M14: 11.8, M16: 13.5, M18: 15.3 };
const NUT_SIZES = Object.keys(NUT_HOLE);

// Pins for a nut:
//   1) PRIMARY: explicit compat field from catalog (source of truth)
//   2) FALLBACK: tip diameter (dVarf) — or body (dCorp) if no tip — just under hole
function pinsForNut(nut) {
  const explicit = pins.filter(p => p.compat === nut);
  if (explicit.length > 0) {
    return [...explicit].sort((a, b) => (b.dVarf ?? b.dCorp) - (a.dVarf ?? a.dCorp));
  }
  const hole = NUT_HOLE[nut];
  if (!hole) return [];
  return pins
    .filter(p => {
      const d = p.dVarf ?? p.dCorp;
      return d != null && d < hole - 0.05;
    })
    .sort((a, b) => (b.dVarf ?? b.dCorp) - (a.dVarf ?? a.dCorp));
}

// Lowers compatible with a pin: body must exceed pin body + clearance
// (bore estimated — real bore data to be added in catalog later)
function lowersForPin(pin) {
  if (!pin) return lowers;
  return lowers
    .filter(l => l.dCorp >= (pin.dCorp ?? 0) + 4)
    .sort((a, b) => a.dCorp - b.dCorp);
}

// Life expectancy proxy for ranking (D² × L → material volume)
const lifeScore = p => (p.dCorp ?? 0) ** 2 * (p.L ?? 0);

// 3 system options: Economy / Recommended / Extended Life
function buildOptions(nut) {
  const pinList = pinsForNut(nut);
  if (pinList.length === 0) return null;
  const pin = pinList[0];
  const lowerList = lowersForPin(pin);
  const upperList = [...uppers].sort((a, b) => lifeScore(a) - lifeScore(b));
  if (lowerList.length === 0 || upperList.length === 0) return null;

  const pick = (arr, frac) => arr[Math.min(arr.length - 1, Math.round(frac * (arr.length - 1)))];
  const lowerSorted = [...lowerList].sort((a, b) => lifeScore(a) - lifeScore(b));

  return [
    { label: 'Economy',       tag: 'Lowest cost · shorter service life', upper: pick(upperList, 0.1), lower: pick(lowerSorted, 0.1), pin },
    { label: 'Recommended',   tag: 'Best life / cost balance',           upper: pick(upperList, 0.5), lower: pick(lowerSorted, 0.5), pin },
    { label: 'Extended Life', tag: 'Max service life · high volume',     upper: pick(upperList, 0.9), lower: pick(lowerSorted, 0.9), pin },
  ];
}

// Short display label per product (fallback if name missing)
function displayName(p) {
  return p.name || `${p.category || ''} · Ø${p.dCorp} × ${p.L} mm`;
}

// PDF drawing URL — SKU-based (URL-safe by design)
const drawingUrl = p => `/welding-docs/${p.sku}.pdf`;

// mailto RFQ builder
function sendRFQ(subject, lines) {
  const body = encodeURIComponent(lines.join('\n'));
  window.location.href = `mailto:${RFQ_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// PARAMETRIC SVG (real mm scale, driven by dCorp / L)
// ═══════════════════════════════════════════════════════════════════════════
function SvgDefs() {
  return (
    <defs>
      <linearGradient id="w4-cu" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a85f28"/><stop offset="50%" stopColor="#d68a4a"/><stop offset="100%" stopColor="#a85f28"/>
      </linearGradient>
      <linearGradient id="w4-brass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9a14a"/><stop offset="100%" stopColor="#9a7a2e"/>
      </linearGradient>
      <linearGradient id="w4-pin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e8e4dc"/><stop offset="50%" stopColor="#ffffff"/><stop offset="100%" stopColor="#d8d4cc"/>
      </linearGradient>
      <linearGradient id="w4-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a5258"/><stop offset="100%" stopColor="#2a3236"/>
      </linearGradient>
      <radialGradient id="w4-spark">
        <stop offset="0%" stopColor="#ffffff"/><stop offset="40%" stopColor="#5fffd9"/><stop offset="100%" stopColor="transparent"/>
      </radialGradient>
    </defs>
  );
}

function Assembly({ upper, lower, pin }) {
  const VW = 240, VH = 400, cx = VW / 2;
  const sheetH = 6, sheetY = VH / 2 + 20;
  const hasBoth = upper && lower;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full">
      <SvgDefs />
      <rect x={40} y={8} width={VW-80} height={12} rx="2" fill="url(#w4-brass)"/>
      <text x={cx} y={30} fill="#1de9b6" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">UPPER HEAD · FIXED</text>
      <rect x={40} y={VH-20} width={VW-80} height={12} rx="2" fill="url(#w4-brass)"/>
      <text x={cx} y={VH-26} fill="#1de9b6" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">LOWER HEAD · FIXED</text>

      <rect x={16} y={sheetY} width={VW-32} height={sheetH} fill="url(#w4-steel)"/>
      <text x={20} y={sheetY-4} fill="#778" fontSize="7" fontFamily="monospace">SHEET</text>

      {upper ? (() => {
        const d = upper.dCorp * SCALE, l = upper.L * SCALE, x = cx - d/2, y0 = 40;
        const shW = d*0.6, tip = d*0.3;
        return (
          <g>
            <rect x={cx-shW/2} y={y0} width={shW} height={10} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <line x1={cx-shW/2} y1={y0+3} x2={cx+shW/2} y2={y0+3} stroke="#6a3f1a" strokeWidth="0.5"/>
            <line x1={cx-shW/2} y1={y0+6} x2={cx+shW/2} y2={y0+6} stroke="#6a3f1a" strokeWidth="0.5"/>
            <rect x={x} y={y0+10} width={d} height={l-tip-10} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <path d={`M ${x} ${y0+l-tip} L ${x+d} ${y0+l-tip} L ${cx+d*0.25} ${y0+l} L ${cx-d*0.25} ${y0+l} Z`} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <text x={x+d+6} y={y0+l/2} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold">Ø{upper.dCorp}</text>
            <text x={x+d+6} y={y0+l/2+11} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold">L{upper.L}</text>
          </g>
        );
      })() : (
        <g><rect x={cx-18} y={40} width={36} height={70} fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="4 4"/>
        <text x={cx} y={80} fill="#1de9b6" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.7">UPPER</text></g>
      )}

      {pin ? (() => {
        const d = pin.dCorp * SCALE, l = pin.L * SCALE, x = cx - d/2;
        const yTop = sheetY - l * 0.45;
        const dTip = (pin.dVarf ?? pin.dCorp * 0.7) * SCALE;
        return (
          <g>
            {/* stepped tip if dVarf exists */}
            <rect x={cx-dTip/2} y={yTop} width={dTip} height={l*0.3} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
            <path d={`M ${cx-dTip/2} ${yTop} L ${cx+dTip/2} ${yTop} L ${cx} ${yTop-dTip*0.35} Z`} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
            <rect x={x} y={yTop+l*0.3} width={d} height={l*0.7} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
            <text x={x-6} y={yTop+l*0.4} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="end">Ø{pin.dVarf ?? pin.dCorp}</text>
            <text x={x-6} y={yTop+l*0.4+11} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="end">L{pin.L}</text>
          </g>
        );
      })() : (
        <rect x={cx-7} y={sheetY-30} width={14} height={60} fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="3 3"/>
      )}

      {lower ? (() => {
        const d = lower.dCorp * SCALE, l = lower.L * SCALE, x = cx - d/2;
        const yEnd = VH - 22, y0 = yEnd - l;
        return (
          <g>
            <rect x={x} y={y0} width={d} height={l} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <rect x={cx - (pin ? pin.dCorp*SCALE/2+1.5 : 6)} y={y0} width={pin ? pin.dCorp*SCALE+3 : 12} height={l} fill="#1a0f08" opacity="0.55"/>
            <text x={x+d+6} y={y0+l/2} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold">Ø{lower.dCorp}</text>
            <text x={x+d+6} y={y0+l/2+11} fill="#1de9b6" fontSize="9" fontFamily="monospace" fontWeight="bold">L{lower.L}</text>
          </g>
        );
      })() : (
        <g><rect x={cx-20} y={VH-95} width={40} height={70} fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="4 4"/>
        <text x={cx} y={VH-58} fill="#1de9b6" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.7">LOWER</text></g>
      )}

      {hasBoth && (
        <g>
          <circle cx={cx} cy={sheetY+sheetH/2} r="24" fill="url(#w4-spark)" opacity="0.35" className="weld-heat"/>
          <circle cx={cx} cy={sheetY+sheetH/2} r="12" fill="url(#w4-spark)" className="weld-spark"/>
          <circle cx={cx} cy={sheetY+sheetH/2} r="4" fill="#fff"/>
          <line x1={cx} y1={44} x2={cx} y2={sheetY} className="weld-current" stroke="#5fffd9" strokeWidth="1.4"/>
          <line x1={cx} y1={sheetY+sheetH} x2={cx} y2={VH-24} className="weld-current" stroke="#5fffd9" strokeWidth="1.4"/>
        </g>
      )}
    </svg>
  );
}

// Flagship banner preview (kept export for App.jsx — DO NOT REMOVE)
export function WeldingAnimation({ height = 240 }) {
  return (
    <div style={{ maxHeight: height }} className="w-full h-auto">
      <Assembly
        upper={{ dCorp: 23, L: 20 }}
        lower={{ dCorp: 20, L: 22 }}
        pin={{ dCorp: 9.8, dVarf: 7.5, L: 29 }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════════════════
function OptionButton({ label, sub, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-left px-4 py-3.5 border rounded-lg transition-all duration-200 ${
        disabled ? 'opacity-30 cursor-not-allowed border-white/10 text-[#666]' :
        active ? 'bg-[#1de9b6]/15 border-[#1de9b6] text-[#1de9b6]' :
        'bg-white/[0.03] border-white/15 text-[#C8C8C8] hover:border-[#1de9b6]/60 hover:text-[#1de9b6]'
      }`}
    >
      <div className="text-[14px] font-bold">{label}</div>
      {sub && <div className="text-[11px] mt-0.5 opacity-70">{sub}</div>}
    </button>
  );
}

function PartLine({ role, p }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 gap-2">
      <div className="min-w-0">
        <div className="text-[10px] font-mono text-[#888] uppercase">{role}</div>
        <div className="text-[12px] font-mono font-bold text-white truncate">{p.sku}</div>
        <div className="text-[11px] text-[#999] truncate">{displayName(p)}</div>
      </div>
      <a href={drawingUrl(p)} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1 text-[11px] font-mono text-[#1de9b6] hover:text-white px-2 py-1 border border-[#1de9b6]/30 hover:border-[#1de9b6] rounded transition shrink-0">
        <FileText size={11}/><span>2D</span>
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH 1: NEW SYSTEM WIZARD
// ═══════════════════════════════════════════════════════════════════════════
const WIZARD_STEPS = [
  { key:'app',       q:'What are you welding?',        opts:[
    { v:'Nut', sub:'Weld nut onto sheet' }, { v:'Stud', sub:'Threaded stud' },
    { v:'Projection', sub:'Embossed boss' }, { v:'Cross Wire', sub:'Wire intersection' }] },
  { key:'size',      q:'Nut size?',                    opts: NUT_SIZES.map(n => ({ v:n, sub:`hole ~Ø${NUT_HOLE[n]}mm` })) },
  { key:'material',  q:'Workpiece material?',          opts:[
    { v:'Steel (mild)' }, { v:'Steel (HSS)' }, { v:'Steel (UHSS/boron)' }, { v:'Stainless' }, { v:'Aluminum' }] },
  { key:'thickness', q:'Sheet thickness?',             opts:[
    { v:'0.8–1.0 mm' }, { v:'1.0–1.5 mm' }, { v:'1.5–2.0 mm' }, { v:'2.0–2.5 mm' }, { v:'2.5–3.5 mm' }] },
  { key:'machine',   q:'Machine type?',                opts:[
    { v:'Portable pneumatic' }, { v:'Workshop hydraulic' }, { v:'Robot-integrated' }, { v:'Manual press' }] },
  { key:'access',    q:'Access & orientation?',        opts:[
    { v:'Standard flat vertical' }, { v:'Angled 15–45°' }, { v:'Confined space' }] },
  { key:'volume',    q:'Production volume?',           opts:[
    { v:'Prototype' }, { v:'Low (<100/mo)' }, { v:'Medium (100–1000/mo)' }, { v:'High (>1000/mo)' }] },
  { key:'timeline',  q:'Timeline?',                    opts:[
    { v:'ASAP (<1 week)' }, { v:'Standard (1–2 weeks)' }, { v:'Flexible' }] },
];

function NewSystemWizard({ onBack, addToCart }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const step = WIZARD_STEPS[stepIdx];
  const isNut = answers.app === 'Nut';
  const visibleSteps = WIZARD_STEPS.filter(s => s.key !== 'size' || isNut);
  const vIdx = visibleSteps.findIndex(s => s.key === step.key);

  const options = useMemo(() => {
    if (!showResults) return null;
    if (answers.app !== 'Nut' || answers.size === 'custom') return null;
    return buildOptions(answers.size);
  }, [showResults, answers]);

  const pick = (v) => {
    const na = { ...answers, [step.key]: v };
    setAnswers(na);
    const vs = WIZARD_STEPS.filter(s => s.key !== 'size' || na.app === 'Nut');
    const cur = vs.findIndex(s => s.key === step.key);
    if (cur < vs.length - 1) {
      setStepIdx(WIZARD_STEPS.findIndex(s => s.key === vs[cur + 1].key));
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) { setShowResults(false); return; }
    const vs = visibleSteps;
    const cur = vs.findIndex(s => s.key === step.key);
    if (cur > 0) setStepIdx(WIZARD_STEPS.findIndex(s => s.key === vs[cur - 1].key));
    else onBack();
  };

  const previewOpts = answers.size && answers.size !== 'custom' ? buildOptions(answers.size) : null;
  const preview = previewOpts ? previewOpts[1] : null;

  if (showResults) {
    return (
      <div className="flex-1 overflow-y-auto p-5 md:p-7">
        <button onClick={goBack} className="flex items-center gap-1 text-[12px] font-mono text-[#888] hover:text-[#1de9b6] mb-5"><ChevronLeft size={14}/>Back</button>
        <h3 className="text-[20px] font-black uppercase tracking-wider text-white mb-1">Recommended Systems</h3>
        <p className="text-[13px] text-[#999] mb-6">Based on: {answers.app} {answers.size || ''} · {answers.material} · {answers.thickness} · {answers.volume}</p>

        {!options ? (
          <div className="p-6 bg-white/[0.03] border border-[#1de9b6]/30 rounded-xl">
            <p className="text-[15px] text-white mb-2">This application requires a custom technical review.</p>
            <p className="text-[13px] text-[#999] mb-4">Send us your requirements and an engineer will reply within 24h.</p>
            <button onClick={() => sendRFQ(`Custom welding solution request`, [
              `Application: ${answers.app}`, `Size: ${answers.size || '-'}`, `Material: ${answers.material}`, `Thickness: ${answers.thickness}`,
              `Machine: ${answers.machine}`, `Access: ${answers.access}`, `Volume: ${answers.volume}`, `Timeline: ${answers.timeline}`,
            ])} className="flex items-center gap-2 px-5 py-3 bg-[#1de9b6] text-black text-[12px] font-black uppercase tracking-widest rounded hover:bg-white transition">
              <Mail size={14}/>Contact engineering
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {options.map((opt, i) => (
              <div key={opt.label} className={`shimmer-hover p-5 rounded-xl border flex flex-col transition-all duration-300 hover:-translate-y-0.5 ${i===1 ? 'border-[#1de9b6]/60 bg-[#1de9b6]/[0.06] shadow-[0_0_24px_rgba(29,233,182,0.1)]' : 'border-white/10 bg-white/[0.02] hover:border-[#1de9b6]/40'}`}>
                {i===1 && <div className="text-[10px] font-black text-black bg-[#1de9b6] self-start px-2 py-0.5 rounded uppercase tracking-widest mb-3">Best match</div>}
                <div className="text-[17px] font-black uppercase tracking-wide text-white">{opt.label}</div>
                <div className="text-[11px] text-[#999] mb-4">{opt.tag}</div>
                <div className="flex-1">
                  <PartLine role="Upper electrode" p={opt.upper}/>
                  <PartLine role="Lower electrode" p={opt.lower}/>
                  <PartLine role="Centering pin" p={opt.pin}/>
                </div>
                <div className="text-[10px] text-[#777] font-mono mt-3 mb-3">Lower bore compatibility estimated — verify with 2D drawing.</div>
                <button onClick={() => { addToCart(opt.upper); addToCart(opt.lower); addToCart(opt.pin); }}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#1de9b6]/10 hover:bg-[#1de9b6] text-[#1de9b6] hover:text-black border border-[#1de9b6]/40 text-[11px] font-black uppercase tracking-widest rounded transition">
                  <ShoppingCart size={13}/>Add system to RFQ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 grid lg:grid-cols-[1fr_1.6fr] gap-5 p-5 md:p-7 overflow-hidden min-h-0">
      <div className="hidden lg:flex bg-gradient-to-b from-[#0a1714] to-[#060d0c] border border-[#1de9b6]/20 rounded-xl p-4 flex-col min-h-0">
        <span className="text-[11px] font-mono text-[#1de9b6] tracking-[0.3em] uppercase mb-2">Live preview · Real scale</span>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[260px]"><Assembly upper={preview?.upper} lower={preview?.lower} pin={preview?.pin}/></div>
        </div>
      </div>
      <div className="flex flex-col overflow-y-auto min-h-0">
        <div className="flex items-center justify-between mb-5">
          <button onClick={goBack} className="flex items-center gap-1 text-[12px] font-mono text-[#888] hover:text-[#1de9b6]"><ChevronLeft size={14}/>Back</button>
          <div className="text-[11px] font-mono text-[#888]">Step {vIdx + 1} / {visibleSteps.length}</div>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full mb-7 overflow-hidden">
          <div className="h-full bg-[#1de9b6] transition-all duration-300" style={{ width: `${((vIdx) / visibleSteps.length) * 100}%` }}/>
        </div>
        <h3 className="text-[22px] font-black text-white mb-6">{step.q}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {step.opts.map(o => (
            <OptionButton key={o.v} label={o.v} sub={o.sub} active={answers[step.key] === o.v} onClick={() => pick(o.v)}/>
          ))}
        </div>
        {step.key === 'size' && (
          <p className="text-[12px] text-[#888] mt-5 font-mono">Other size or special geometry? <button onClick={() => pick('custom')} className="text-[#1de9b6] underline">Request custom solution</button></p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH 2: SPARE PARTS FINDER (search: sku, ref, aliases, name, dims)
// ═══════════════════════════════════════════════════════════════════════════
const TYPE_FILTERS = [
  ['all',   'All'],
  ['ELS',   'Upper'],
  ['ELI',   'Lower'],
  ['PIN',   'Pins'],
  ['BCS',   'Bushings'],
];

function familyOf(p) {
  // derive family from SKU prefix: RPW-{FAM}-...
  const m = /^RPW-([A-Z]+)-/.exec(p.sku || '');
  return m ? m[1] : '';
}

function SparePartsFinder({ onBack, addToCart }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const results = useMemo(() => {
    let list = PRODUCTS;
    if (typeFilter !== 'all') {
      list = list.filter(p => {
        const fam = familyOf(p);
        if (typeFilter === 'PIN') return fam.startsWith('PIN'); // PIN, PINF, PINB
        return fam === typeFilter;
      });
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.sku || '').toLowerCase().includes(q) ||
        (p.ref || '').toLowerCase().includes(q) ||
        (p.aliases || []).some(a => a.toLowerCase().includes(q)) ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.mx || '').toLowerCase().includes(q) ||
        (p.compat || '').toLowerCase().includes(q) ||
        (p.mat || '').toLowerCase().includes(q) ||
        String(p.dCorp ?? '').includes(q) ||
        String(p.dVarf ?? '').includes(q) ||
        String(p.L ?? '').includes(q)
      );
    }
    return list;
  }, [query, typeFilter]);

  return (
    <div className="flex-1 flex flex-col p-5 md:p-7 overflow-hidden min-h-0">
      <button onClick={onBack} className="flex items-center gap-1 text-[12px] font-mono text-[#888] hover:text-[#1de9b6] mb-4 self-start"><ChevronLeft size={14}/>Back</button>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-3 bg-white/[0.04] border border-white/15 focus-within:border-[#1de9b6]/60 rounded-lg px-4 py-3">
          <Search size={16} className="text-[#888] shrink-0"/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="DGSI SKU, your part number, client code, M20, diameter…"
            className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-[#666] font-mono"
            autoFocus
          />
          {query && <button onClick={() => setQuery('')} className="text-[#666] hover:text-white"><X size={14}/></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map(([v,l]) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              className={`px-4 py-2 text-[12px] font-mono font-bold uppercase tracking-wider border rounded-lg transition ${typeFilter===v ? 'bg-[#1de9b6]/15 border-[#1de9b6] text-[#1de9b6]' : 'border-white/15 text-[#999] hover:border-[#1de9b6]/50 hover:text-[#1de9b6]'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[12px] font-mono text-[#888] mb-3">{results.length} part{results.length !== 1 ? 's' : ''} found · {PRODUCTS.length} in catalog</div>

      <div className="flex-1 overflow-y-auto min-h-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 content-start pr-1">
        {results.map(p => (
          <div key={p.sku} className="bg-white/[0.03] border border-white/10 hover:border-[#1de9b6]/50 rounded-lg p-4 transition group flex flex-col">
            <div className="text-[14px] font-mono font-bold text-white group-hover:text-[#1de9b6] break-all">{p.sku}</div>
            <div className="text-[12px] text-[#B8B8B8] mt-1 mb-1 leading-snug">{displayName(p)}</div>
            {(p.ref || (p.aliases && p.aliases.length > 0)) && (
              <div className="text-[10px] font-mono text-[#777] mb-2 truncate">
                {p.ref && <>Client ref: {p.ref}</>}
                {p.aliases?.length > 0 && <> · aka {p.aliases.join(', ')}</>}
              </div>
            )}
            <div className="flex gap-4 mb-3 mt-auto">
              {p.dCorp != null && <div><span className="text-[10px] font-mono text-[#777] uppercase">Ø </span><span className="text-[14px] font-mono font-bold text-[#1de9b6]">{p.dCorp}</span></div>}
              {p.dVarf != null && <div><span className="text-[10px] font-mono text-[#777] uppercase">Ø tip </span><span className="text-[14px] font-mono font-bold text-[#1de9b6]">{p.dVarf}</span></div>}
              {p.L != null && <div><span className="text-[10px] font-mono text-[#777] uppercase">L </span><span className="text-[14px] font-mono font-bold text-[#1de9b6]">{p.L}</span></div>}
              {p.mx && <div><span className="text-[10px] font-mono text-[#777] uppercase">Thread </span><span className="text-[14px] font-mono font-bold text-[#1de9b6]">{p.mx}</span></div>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={drawingUrl(p)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono font-bold text-[#999] hover:text-[#1de9b6] border border-white/15 hover:border-[#1de9b6]/50 rounded transition">
                <FileText size={12}/>2D Drawing
              </a>
              <button onClick={() => addToCart(p)}
                className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-black uppercase tracking-wider text-[#1de9b6] hover:text-black bg-[#1de9b6]/10 hover:bg-[#1de9b6] border border-[#1de9b6]/40 rounded transition">
                <ShoppingCart size={12}/>Add
              </button>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="col-span-full p-8 text-center">
            <p className="text-[15px] text-[#999] mb-3">No parts match your search.</p>
            <button onClick={() => sendRFQ('Part inquiry — not in catalog', [`Searched for: ${query}`, '', 'Please advise availability / equivalent.'])}
              className="text-[13px] text-[#1de9b6] underline">Ask us about this part →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RFQ CART
// ═══════════════════════════════════════════════════════════════════════════
function RFQCart({ cart, setCart }) {
  const [open, setOpen] = useState(false);
  if (cart.length === 0) return null;

  const submit = () => {
    const lines = [
      'RFQ — DGSI Welding Configurator', '',
      ...cart.map(i => `• ${i.sku}  —  ${displayName(i)}  × ${i.qty}`),
      '', 'Company:', 'Contact person:', 'Phone:', 'Notes:',
    ];
    sendRFQ('RFQ — Welding components', lines);
  };

  return (
    <div className="absolute bottom-5 right-5 z-30">
      {open && (
        <div className="mb-3 w-80 bg-[#0c1512] border border-[#1de9b6]/40 rounded-xl shadow-2xl p-4">
          <div className="text-[11px] font-mono text-[#1de9b6] uppercase tracking-widest mb-3">RFQ · {cart.length} item{cart.length>1?'s':''}</div>
          <div className="max-h-56 overflow-y-auto space-y-2 mb-4">
            {cart.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-[12px] font-mono">
                <span className="text-white truncate">{i.sku}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <input type="number" min="1" value={i.qty}
                    onChange={e => setCart(c => c.map((x,xi) => xi===idx ? {...x, qty: Math.max(1, parseInt(e.target.value)||1)} : x))}
                    className="w-14 bg-white/5 border border-white/15 rounded px-2 py-1 text-center text-white outline-none focus:border-[#1de9b6]/60"/>
                  <button onClick={() => setCart(c => c.filter((_,xi) => xi!==idx))} className="text-[#666] hover:text-red-400"><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1de9b6] text-black text-[11px] font-black uppercase tracking-widest rounded hover:bg-white transition">
            <Mail size={13}/>Send RFQ by email
          </button>
          <div className="text-[10px] text-[#777] font-mono text-center mt-2">Opens your email client → {RFQ_EMAIL}</div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-3.5 bg-[#1de9b6] text-black text-[12px] font-black uppercase tracking-widest rounded-full shadow-[0_0_24px_rgba(29,233,182,0.4)] hover:bg-white transition">
        <ShoppingCart size={15}/><span>RFQ ({cart.reduce((s,i)=>s+i.qty,0)})</span>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MODAL (default export — DO NOT REMOVE dual export contract)
// ═══════════════════════════════════════════════════════════════════════════
export default function WeldingModal({ onClose }) {
  const [path, setPath] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (p) => {
    setCart(c => {
      const idx = c.findIndex(x => x.sku === p.sku);
      if (idx >= 0) return c.map((x,i) => i===idx ? {...x, qty:x.qty+1} : x);
      return [...c, { ...p, qty: 1 }];
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-[95vw] h-[92vh] bg-gradient-to-br from-[#0A0A0A] to-[#0a1714] border border-[#1de9b6]/40 shadow-[0_0_80px_rgba(29,233,182,0.2)] rounded-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="weld-scanline z-[5]"/>
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#1de9b6] z-20"/>
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#1de9b6] z-20"/>
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#1de9b6] z-20"/>
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#1de9b6] z-20"/>

        <div className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-3 py-1.5 bg-[#1de9b6]/20 text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.2em] rounded shrink-0">Flagship</span>
            <h2 className="text-[17px] md:text-[22px] font-black uppercase tracking-wider text-white truncate">Projection Welding <span className="text-[#1de9b6] glow-accent">Solutions</span></h2>
          </div>
          <button onClick={onClose} className="text-[#7A7A7A] hover:text-white transition bg-[#111] hover:bg-[#1a1a1a] p-2.5 rounded-full"><X size={22}/></button>
        </div>

        {path === null && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-8">
              <div className="text-[10px] font-mono text-[#1de9b6] tracking-[0.4em] uppercase mb-2">DGSI · Advanced Ceramics & CuCr1Zr</div>
              <p className="text-[14px] text-[#999] max-w-md">Configure a complete projection welding system or find exact replacement parts — engineered for automotive Tier-1 production. {PRODUCTS.length} components in catalog.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 w-full max-w-3xl">
              <button onClick={() => setPath('new')}
                className="shimmer-hover group text-left p-7 bg-white/[0.02] border border-white/10 hover:border-[#1de9b6]/60 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(29,233,182,0.15)] hover:-translate-y-0.5">
                <div className="float-soft w-12 h-12 rounded-xl bg-[#1de9b6]/10 border border-[#1de9b6]/30 flex items-center justify-center mb-5 group-hover:bg-[#1de9b6]/20 group-hover:shadow-[0_0_18px_rgba(29,233,182,0.35)] transition">
                  <Zap size={22} className="text-[#1de9b6]"/>
                </div>
                <h3 className="text-[19px] font-black uppercase tracking-wide text-white mb-2">New System</h3>
                <p className="text-[13px] text-[#999] leading-relaxed mb-5">I need a complete welding solution. Guide me through application, material and machine to get a recommended configuration.</p>
                <span className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#1de9b6]">Start consultation<ArrowRight size={14} className="group-hover:translate-x-1 transition"/></span>
              </button>
              <button onClick={() => setPath('spare')}
                className="shimmer-hover group text-left p-7 bg-white/[0.02] border border-white/10 hover:border-[#1de9b6]/60 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(29,233,182,0.15)] hover:-translate-y-0.5">
                <div className="float-soft w-12 h-12 rounded-xl bg-[#1de9b6]/10 border border-[#1de9b6]/30 flex items-center justify-center mb-5 group-hover:bg-[#1de9b6]/20 group-hover:shadow-[0_0_18px_rgba(29,233,182,0.35)] transition" style={{ animationDelay: '0.4s' }}>
                  <Wrench size={22} className="text-[#1de9b6]"/>
                </div>
                <h3 className="text-[19px] font-black uppercase tracking-wide text-white mb-2">Spare Parts</h3>
                <p className="text-[13px] text-[#999] leading-relaxed mb-5">I already have equipment. Search by DGSI SKU, your internal code or dimensions — download drawings and request a quote.</p>
                <span className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-[#1de9b6]">Quick lookup<ArrowRight size={14} className="group-hover:translate-x-1 transition"/></span>
              </button>
            </div>
          </div>
        )}

        {path === 'new' && <NewSystemWizard onBack={() => setPath(null)} addToCart={addToCart}/>}
        {path === 'spare' && <SparePartsFinder onBack={() => setPath(null)} addToCart={addToCart}/>}

        <RFQCart cart={cart} setCart={setCart}/>
      </div>
    </div>
  );
}