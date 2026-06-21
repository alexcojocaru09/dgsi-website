import React, { useState, useMemo } from 'react';
import { X, Zap, Droplets, Ruler, ShieldCheck, ChevronRight, ChevronLeft, Download, FileText, Check, Snowflake } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// WELDING CONFIGURATOR — DGSI flagship (hierarchical: category → subtype)
// Step 1 Upper:  interface category → wear-tip subtype
// Step 2 Lower:  cooling type (single level)
// Step 3 Pin:    weld-nut size → geometry subtype
// Each step supports Back navigation. Animation assembles in sync.
// Component types extracted from the official DOCERAM catalog.
// ═══════════════════════════════════════════════════════════════════════════

// ─── UPPER ELECTRODE: category → subtype ───────────────────────────────────
const UPPER_CATEGORIES = [
  {
    id: 'screw-in', name: 'Screw-in', meta: 'M18x1.5 thread',
    detail: 'Threaded M18x1.5 interface for high-volume series. Maximum rigidity.',
    subtypes: [
      { id: 'screw-flat', name: 'Flat Face', meta: 'CuCrZr · Ø10mm', tip: 'flat' },
      { id: 'screw-radius', name: 'Radius', meta: 'CuCrZr · R12', tip: 'radius' },
      { id: 'screw-pointed', name: 'Pointed', meta: 'CuCrZr · 30°', tip: 'pointed' },
    ],
  },
  {
    id: 'cap-cone', name: 'Cap / Cone', meta: 'Cone 1:10',
    detail: 'Conical cap interface (1:10) for fast change-over on variable lines.',
    subtypes: [
      { id: 'cap-flat', name: 'Flat Face', meta: 'CuCrZr · Ø10mm', tip: 'flat' },
      { id: 'cap-radius', name: 'Radius', meta: 'CuCrZr · R12', tip: 'radius' },
      { id: 'cap-pointed', name: 'Pointed', meta: 'CuCrZr · 30°', tip: 'pointed' },
    ],
  },
];

// ─── LOWER ELECTRODE: cooling category → size subtype ──────────────────────
const LOWER_CATEGORIES = [
  {
    id: 'cooled', name: 'Cooled', meta: 'Active · G1/8 Ø6mm', body: 'cooled',
    detail: 'Water-cooled base with G1/8 fittings & NBR 70 O-rings. Maximum thermal stability.',
  },
  {
    id: 'uncooled', name: 'Uncooled', meta: 'Solid body · CuCrZr', body: 'uncooled',
    detail: 'Solid-body base for tight installation spaces and lower duty cycles.',
  },
];
const LOWER_SIZES = [
  { id: 'lm4', name: 'M4' }, { id: 'lm5', name: 'M5' }, { id: 'lm8', name: 'M8' },
  { id: 'lm10', name: 'M10' }, { id: 'lm12', name: 'M12' },
];

// ─── CERAMIC PIN: weld-nut size → geometry subtype ─────────────────────────
const PIN_SIZES = [
  { id: 'm4', name: 'M4' }, { id: 'm5', name: 'M5' }, { id: 'm8', name: 'M8' },
  { id: 'm10', name: 'M10' }, { id: 'm12', name: 'M12' },
];
const PIN_GEOMETRIES = [
  { id: 'short', name: 'Short', meta: 'Standard length', geo: 'short' },
  { id: 'long', name: 'Long', meta: 'Extended reach', geo: 'long' },
  { id: 'collar', name: 'With Collar', meta: 'Shoulder seat', geo: 'collar' },
];
const PIN_MATERIAL = 'White Ceramic (Volcera)';

// ─── Dynamic Welding Assembly SVG ──────────────────────────────────────────
// Fixed module (base plates + holder) always present; shank/wear-electrode/pin
// build in as the user selects. Spark only when upper + lower both installed.
function WeldingAssembly({ upper, lower, ceramic }) {
  const hasBoth = upper && lower;
  return (
    <svg viewBox="0 0 280 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="wa-cu" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a85f28"/><stop offset="50%" stopColor="#d68a4a"/><stop offset="100%" stopColor="#a85f28"/>
        </linearGradient>
        <linearGradient id="wa-cuV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b86f32"/><stop offset="50%" stopColor="#d68a4a"/><stop offset="100%" stopColor="#8a4f22"/>
        </linearGradient>
        <linearGradient id="wa-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a14a"/><stop offset="50%" stopColor="#b8923a"/><stop offset="100%" stopColor="#9a7a2e"/>
        </linearGradient>
        <linearGradient id="wa-pin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a9fc4"/><stop offset="25%" stopColor="#a8d0e8"/><stop offset="50%" stopColor="#c8e2f0"/><stop offset="75%" stopColor="#a8d0e8"/><stop offset="100%" stopColor="#5a8fb4"/>
        </linearGradient>
        <linearGradient id="wa-pinTip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a8fb4"/><stop offset="50%" stopColor="#b8d8ec"/><stop offset="100%" stopColor="#4a7fa4"/>
        </linearGradient>
        <radialGradient id="wa-spark">
          <stop offset="0%" stopColor="#ffffff"/><stop offset="30%" stopColor="#5fffd9"/><stop offset="60%" stopColor="#1de9b6"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="wa-heat">
          <stop offset="0%" stopColor="#1de9b6" stopOpacity="0.5"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      {/* ════ FIXED MODULE — always present (base plates + holders) ════ */}
      {/* Upper base plate (brass with holes) */}
      <g>
        <rect x="92" y="18" width="96" height="16" rx="2" fill="url(#wa-brass)" stroke="#7a6020" strokeWidth="1"/>
        {[100,112,124,148,160,172].map((cx) => <circle key={cx} cx={cx} cy="26" r="2" fill="#6a5418"/>)}
        {/* holder block under base plate */}
        <path d="M120 34 L160 34 L152 54 L128 54 Z" fill="url(#wa-brass)" stroke="#7a6020" strokeWidth="1"/>
      </g>
      <text x="140" y="12" fill="#1de9b6" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.55">UPPER BASE PLATE · FIXED</text>

      {/* Lower base plate (brass with holes) */}
      <g>
        <rect x="92" y="326" width="96" height="16" rx="2" fill="url(#wa-brass)" stroke="#7a6020" strokeWidth="1"/>
        {[100,112,124,148,160,172].map((cx) => <circle key={cx} cx={cx} cy="334" r="2" fill="#6a5418"/>)}
        <path d="M120 326 L160 326 L152 306 L128 306 Z" fill="url(#wa-brass)" stroke="#7a6020" strokeWidth="1"/>
      </g>
      <text x="140" y="354" fill="#1de9b6" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.55">LOWER BASE PLATE · FIXED</text>

      {/* ════ UPPER ELECTRODE (shank + wear tip) — built when selected ════ */}
      {upper ? (
        <g className="weld-upper">
          {/* shank */}
          <rect x="128" y="54" width="24" height="40" rx="2" fill="url(#wa-cu)" stroke="#6a3f1a" strokeWidth="1"/>
          {/* wear electrode by tip type */}
          {upper.tip === 'flat' && <rect x="130" y="94" width="20" height="16" rx="1" fill="url(#wa-cuV)" stroke="#6a3f1a" strokeWidth="1"/>}
          {upper.tip === 'radius' && <path d="M130 94 L150 94 L150 104 Q140 116 130 104 Z" fill="url(#wa-cuV)" stroke="#6a3f1a" strokeWidth="1"/>}
          {upper.tip === 'pointed' && <path d="M130 94 L150 94 L142 112 L138 112 Z" fill="url(#wa-cuV)" stroke="#6a3f1a" strokeWidth="1"/>}
          <line x1="140" y1="56" x2="140" y2="108" className="weld-current" stroke="#5fffd9" strokeWidth="1.2" opacity="0.6"/>
          <g transform="translate(168,60)">
            <rect x="0" y="0" width="46" height="13" rx="2" fill="rgba(29,233,182,0.15)" stroke="#1de9b6" strokeWidth="0.5"/>
            <text x="23" y="9" fill="#1de9b6" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">UPPER ✓</text>
          </g>
        </g>
      ) : (
        <g className="weld-empty">
          <rect x="128" y="54" width="24" height="56" rx="2" fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="3 3"/>
          <text x="140" y="86" fill="#1de9b6" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">UPPER</text>
        </g>
      )}

      {/* ════ WORKPIECE (sheet metal with projection) ════ */}
      <rect x="44" y="176" width="192" height="7" fill="#3a4248" stroke="#4a5258" strokeWidth="0.5"/>
      <rect x="44" y="183" width="192" height="7" fill="#2a3236" stroke="#4a5258" strokeWidth="0.5"/>
      <path d="M134 176 L146 176 L142 183 L138 183 Z" fill="#4a5258"/>

      {/* ════ CERAMIC PIN (central, realistic stepped blue ceramic) ════ */}
      {ceramic ? (
        <g className="weld-ceramic">
          {/* Realistic stepped pin: conical tip · threaded neck · shoulder · body · base */}
          {(() => {
            // vertical offset for long vs short; collar adds a wider seat at sheet level
            const topY = ceramic.geo === 'long' ? 150 : 158;
            return (
              <g>
                {/* conical tip */}
                <path d={`M134 ${topY+8} L146 ${topY+8} L144 ${topY} Q140 ${topY-4} 136 ${topY} Z`} fill="url(#wa-pinTip)" stroke="#4a7fa4" strokeWidth="0.5"/>
                {/* threaded neck */}
                <rect x="135" y={topY+8} width="10" height="9" fill="url(#wa-pin)" stroke="#4a7fa4" strokeWidth="0.5"/>
                <line x1="135" y1={topY+10} x2="145" y2={topY+10} stroke="#5a8fb4" strokeWidth="0.4"/>
                <line x1="135" y1={topY+13} x2="145" y2={topY+13} stroke="#5a8fb4" strokeWidth="0.4"/>
                {/* upper shoulder */}
                <path d={`M133 ${topY+17} L147 ${topY+17} L145 ${topY+25} L135 ${topY+25} Z`} fill="url(#wa-pin)" stroke="#4a7fa4" strokeWidth="0.5"/>
                {/* main body down through sheet to base */}
                <rect x="135" y={topY+25} width="10" height={ceramic.geo === 'long' ? 48 : 40} rx="1" fill="url(#wa-pin)" stroke="#4a7fa4" strokeWidth="0.5"/>
                {/* highlight stripe */}
                <rect x="137.5" y={topY+25} width="2" height={ceramic.geo === 'long' ? 48 : 40} fill="#e0f0fa" opacity="0.55"/>
                {/* collar (only "with collar") — wider seat at sheet */}
                {ceramic.geo === 'collar' && <path d="M131 180 L149 180 L147 188 L133 188 Z" fill="url(#wa-pin)" stroke="#4a7fa4" strokeWidth="0.5"/>}
                {/* cyan rim light to tie into site palette */}
                <rect x="135" y={topY+25} width="10" height={ceramic.geo === 'long' ? 48 : 40} rx="1" fill="none" stroke="#1de9b6" strokeWidth="0.4" opacity="0.35"/>
              </g>
            );
          })()}
          <g transform="translate(52,176)">
            <rect x="0" y="0" width="56" height="13" rx="2" fill="rgba(29,233,182,0.15)" stroke="#1de9b6" strokeWidth="0.5"/>
            <text x="28" y="9" fill="#1de9b6" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{ceramic.sizeName} PIN ✓</text>
          </g>
        </g>
      ) : (
        <g className="weld-empty">
          <rect x="135" y="158" width="10" height="28" rx="1" fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="2 2"/>
        </g>
      )}

      {/* ════ LOWER ELECTRODE (body) — built when selected ════ */}
      {lower ? (
        <g className="weld-lower">
          {lower.body === 'cooled' && (
            <g>
              <path d="M128 206 L152 206 L146 194 L134 194 Z" fill="url(#wa-cu)" stroke="#6a3f1a" strokeWidth="1"/>
              <rect x="126" y="206" width="28" height="40" rx="2" fill="url(#wa-cu)" stroke="#6a3f1a" strokeWidth="1"/>
              <rect x="120" y="246" width="40" height="50" rx="3" fill="url(#wa-cuV)" stroke="#6a3f1a" strokeWidth="1"/>
              {/* cooling fittings */}
              <circle cx="116" cy="262" r="3.5" fill="none" stroke="#5fffd9" strokeWidth="1"/>
              <circle cx="164" cy="262" r="3.5" fill="none" stroke="#5fffd9" strokeWidth="1"/>
              <line x1="112" y1="262" x2="108" y2="262" stroke="#5fffd9" strokeWidth="1.2"/>
              <line x1="168" y1="262" x2="172" y2="262" stroke="#5fffd9" strokeWidth="1.2"/>
            </g>
          )}
          {lower.body === 'uncooled' && (
            <g>
              <path d="M128 206 L152 206 L146 194 L134 194 Z" fill="url(#wa-cu)" stroke="#6a3f1a" strokeWidth="1"/>
              <rect x="124" y="206" width="32" height="42" rx="2" fill="url(#wa-cu)" stroke="#6a3f1a" strokeWidth="1"/>
              <rect x="118" y="248" width="44" height="48" rx="3" fill="url(#wa-cuV)" stroke="#6a3f1a" strokeWidth="1"/>
            </g>
          )}
          <line x1="140" y1="196" x2="140" y2="290" className="weld-current" stroke="#5fffd9" strokeWidth="1.2" opacity="0.6"/>
          <g transform="translate(168,266)">
            <rect x="0" y="0" width="46" height="13" rx="2" fill="rgba(29,233,182,0.15)" stroke="#1de9b6" strokeWidth="0.5"/>
            <text x="23" y="9" fill="#1de9b6" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LOWER ✓</text>
          </g>
        </g>
      ) : (
        <g className="weld-empty">
          <rect x="120" y="194" width="40" height="102" rx="3" fill="none" stroke="#1de9b6" strokeWidth="0.8" strokeDasharray="3 3"/>
          <text x="140" y="248" fill="#1de9b6" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.7">LOWER</text>
        </g>
      )}

      {/* ════ HEAT + SPARK — only when both electrodes installed ════ */}
      {hasBoth && (
        <>
          <circle cx="140" cy="183" r="22" fill="url(#wa-heat)" className="weld-heat"/>
          <g className="weld-spark">
            <circle cx="140" cy="183" r="10" fill="url(#wa-spark)"/>
            <circle cx="140" cy="183" r="4" fill="#ffffff"/>
            <g stroke="#5fffd9" strokeWidth="1.2" strokeLinecap="round">
              <line x1="140" y1="183" x2="140" y2="168"/>
              <line x1="140" y1="183" x2="152" y2="174"/>
              <line x1="140" y1="183" x2="128" y2="174"/>
              <line x1="140" y1="183" x2="154" y2="183"/>
              <line x1="140" y1="183" x2="126" y2="183"/>
            </g>
          </g>
          <circle className="weld-particle" cx="140" cy="183" r="1.2" fill="#5fffd9" style={{ '--dx': '18px', '--dy': '-12px' }}/>
          <circle className="weld-particle" cx="140" cy="183" r="1" fill="#1de9b6" style={{ '--dx': '-16px', '--dy': '-8px', animationDelay: '0.05s' }}/>
          <circle className="weld-particle" cx="140" cy="183" r="0.9" fill="#ffffff" style={{ '--dx': '20px', '--dy': '6px', animationDelay: '0.1s' }}/>
          <circle className="weld-particle" cx="140" cy="183" r="1" fill="#5fffd9" style={{ '--dx': '-18px', '--dy': '3px', animationDelay: '0.03s' }}/>
        </>
      )}
    </svg>
  );
}

// Lightweight standalone preview used by teaser card in App.jsx
export function WeldingAnimation({ height = 240 }) {
  return (
    <div style={{ maxHeight: height }} className="w-full h-auto">
      <WeldingAssembly
        upper={{ tip: 'radius' }}
        lower={{ body: 'cooled' }}
        ceramic={{ geo: 'short', sizeName: 'M8' }}
      />
    </div>
  );
}

// ─── Option button ─────────────────────────────────────────────────────────
function OptionBtn({ label, meta, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`group/opt relative flex flex-col items-start gap-1.5 p-3.5 rounded-lg border text-left transition-all ${
        selected
          ? 'bg-[#1de9b6]/10 border-[#1de9b6] shadow-[0_0_16px_rgba(29,233,182,0.15)]'
          : 'bg-white/[0.03] border-white/10 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/[0.04] hover:-translate-y-0.5 cursor-pointer'
      }`}
    >
      {icon && <span className={`w-5 h-5 ${selected ? 'text-[#1de9b6]' : 'text-[#1de9b6]/60'}`}>{icon}</span>}
      <span className="text-[13px] font-black text-white">{label}</span>
      {meta && <span className={`text-[9px] font-mono uppercase tracking-wide ${selected ? 'text-[#1de9b6]' : 'text-[#888]'}`}>{meta}</span>}
      {selected && (
        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#1de9b6] flex items-center justify-center">
          <Check size={10} strokeWidth={3} className="text-black" />
        </span>
      )}
    </button>
  );
}

// ─── Hierarchical Step Card ────────────────────────────────────────────────
function StepCard({ stepNum, meta, title, icon, locked, done, summary, children, onBack, showBack }) {
  const stateClass = done
    ? 'border-[#1de9b6]/30'
    : locked
      ? 'border-white/5 opacity-40'
      : 'border-[#1de9b6]/50 shadow-[0_0_24px_rgba(29,233,182,0.08)] bg-gradient-to-br from-[#1de9b6]/[0.04] to-transparent';
  const numClass = done
    ? 'bg-[#1de9b6]/15 text-[#1de9b6] border border-[#1de9b6]'
    : locked
      ? 'bg-white/5 text-[#555] border border-white/10'
      : 'bg-[#1de9b6] text-black shadow-[0_0_16px_rgba(29,233,182,0.5)]';

  return (
    <div className={`relative bg-white/[0.02] border rounded-xl p-5 transition-all duration-300 ${stateClass}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm font-mono shrink-0 transition-all duration-300 ${numClass}`}>
          {done ? <Check size={18} strokeWidth={3} /> : stepNum}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-0.5 ${locked ? 'text-[#555]' : done ? 'text-[#888]' : 'text-[#1de9b6]'}`}>{meta}</div>
          <div className="text-base font-black uppercase tracking-wider text-white truncate">{title}</div>
        </div>
        {showBack && !locked && (
          <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#1de9b6] hover:text-white bg-[#1de9b6]/10 hover:bg-[#1de9b6]/20 px-2.5 py-1.5 rounded transition-all">
            <ChevronLeft size={12} /> Back
          </button>
        )}
        {done && summary && (
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1de9b6] bg-[#1de9b6]/10 px-2.5 py-1 rounded">{summary}</span>
        )}
      </div>
      {!locked && children}
      {locked && (
        <div className="text-[11px] text-[#666] font-mono uppercase tracking-wider pl-14">Complete previous step first</div>
      )}
    </div>
  );
}

// Breadcrumb showing navigation depth within a step
function Breadcrumb({ trail }) {
  return (
    <div className="flex items-center gap-1.5 mb-3 pl-1 flex-wrap">
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={11} className="text-[#1de9b6]/40" />}
          <span className={`text-[9px] font-mono uppercase tracking-widest ${i === trail.length - 1 ? 'text-[#1de9b6]' : 'text-[#888]'}`}>{t}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────
export default function WeldingModal({ onClose }) {
  // Upper: 2-level (category → subtype)
  const [upperCat, setUpperCat] = useState(null);
  const [upper, setUpper] = useState(null);
  // Lower: 2-level (cooling → size)
  const [lowerCat, setLowerCat] = useState(null);
  const [lower, setLower] = useState(null);
  // Pin: 2-level (size → geometry)
  const [pinSize, setPinSize] = useState(null);
  const [ceramic, setCeramic] = useState(null);

  const completed = [upper, lower, ceramic].filter(Boolean).length;
  const progress = (completed / 3) * 100;

  const summary = useMemo(() => {
    const parts = [];
    if (upper) parts.push(`${upper.name} Upper`);
    if (lower) parts.push(`${lower.name} Lower`);
    if (ceramic) parts.push(`${ceramic.sizeName} ${ceramic.name} Pin`);
    return parts.length > 0 ? parts.join(' · ') : 'No components selected yet';
  }, [upper, lower, ceramic]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-[95vw] h-[92vh] bg-gradient-to-br from-[#0A0A0A] to-[#0a1714] border border-[#1de9b6]/40 shadow-[0_0_80px_rgba(29,233,182,0.2)] rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1de9b6 1px, transparent 1px), linear-gradient(90deg, #1de9b6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#1de9b6] z-20" />
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#1de9b6] z-20" />
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#1de9b6] z-20" />
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#1de9b6] z-20" />

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <span className="px-3 py-1.5 bg-[#1de9b6]/20 text-[#1de9b6] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded shrink-0">Flagship · Configurator</span>
            <h2 className="text-base md:text-xl font-black uppercase tracking-wider text-white truncate">Projection Welding System</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[9px] font-mono text-[#1de9b6] tracking-[0.2em] uppercase">Build</span>
              <div className="w-28 h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1de9b6] to-[#5fffd9] shadow-[0_0_8px_#1de9b6] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-black text-white">{completed}/3</span>
            </div>
            <button onClick={onClose} className="text-[#7A7A7A] hover:text-white transition-colors bg-[#111] hover:bg-[#1a1a1a] p-2.5 rounded-full">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_2fr] gap-5 p-5 md:p-7 overflow-hidden">

          {/* LEFT — live assembly */}
          <div className="bg-gradient-to-b from-[#0a1714] to-[#060d0c] border border-[#1de9b6]/20 rounded-xl p-5 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-mono text-[#1de9b6] tracking-[0.3em] uppercase">Live Assembly</span>
              <div className="h-px flex-1 bg-[#1de9b6]/20" />
            </div>
            <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_#0a1f1a_0%,_#050a09_80%)] rounded-lg overflow-hidden flex items-center justify-center min-h-[320px]">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#1de9b6 1px, transparent 1px), linear-gradient(90deg, #1de9b6 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
              <div className="relative w-full h-full max-w-[280px] flex items-center justify-center p-4">
                <WeldingAssembly upper={upper} lower={lower} ceramic={ceramic} />
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] tracking-[0.25em] text-[#1de9b6] uppercase opacity-70">
                {completed === 0 && 'Fixed module ready · Select parts'}
                {completed === 1 && 'Configuring 1 of 3'}
                {completed === 2 && 'Configuring 2 of 3 · Almost there'}
                {completed === 3 && '✓ System fully configured'}
              </div>
            </div>
            <div className="mt-4 flex gap-1.5">
              {[upper, lower, ceramic].map((p, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${p ? 'bg-[#1de9b6] shadow-[0_0_6px_#1de9b6]' : 'bg-white/8'}`} />
              ))}
            </div>
          </div>

          {/* RIGHT — config steps */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 min-h-0">

            {/* ── STEP 1: UPPER (category → subtype) ── */}
            <StepCard
              stepNum="1" meta="Step 01 · Top Module" title="Upper Electrode" icon={<Zap />}
              locked={false} done={!!upper} summary={upper ? upper.name : null}
              showBack={!!upperCat && !upper}
              onBack={() => setUpperCat(null)}
            >
              {!upperCat ? (
                <>
                  <Breadcrumb trail={['Choose interface']} />
                  <div className="grid grid-cols-2 gap-2.5">
                    {UPPER_CATEGORIES.map((c) => (
                      <OptionBtn key={c.id} label={c.name} meta={c.meta} icon={<Zap />} selected={false} onClick={() => setUpperCat(c)} />
                    ))}
                  </div>
                </>
              ) : !upper ? (
                <>
                  <Breadcrumb trail={[upperCat.name, 'Choose wear tip']} />
                  <div className="grid grid-cols-3 gap-2.5">
                    {upperCat.subtypes.map((s) => (
                      <OptionBtn key={s.id} label={s.name} meta={s.meta} icon={<Zap />} selected={false}
                        onClick={() => setUpper({ ...s, name: `${upperCat.name} ${s.name}` })} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between pl-14">
                  <span className="text-[13px] text-[#C0C0C0]">{upper.name} · <span className="text-[#1de9b6] font-mono text-[11px]">{upper.meta}</span></span>
                  <button onClick={() => { setUpper(null); }} className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#1de9b6] hover:text-white bg-[#1de9b6]/10 hover:bg-[#1de9b6]/20 px-2.5 py-1.5 rounded transition-all">
                    <ChevronLeft size={12} /> Change
                  </button>
                </div>
              )}
            </StepCard>

            {/* ── STEP 2: LOWER (cooling → size) ── */}
            <StepCard
              stepNum="2" meta="Step 02 · Bottom Module" title="Lower Electrode" icon={<ShieldCheck />}
              locked={!upper} done={!!lower} summary={lower ? lower.name : null}
              showBack={!!lowerCat && !lower}
              onBack={() => setLowerCat(null)}
            >
              {!lowerCat ? (
                <>
                  <Breadcrumb trail={['Choose cooling']} />
                  <div className="grid grid-cols-2 gap-2.5">
                    {LOWER_CATEGORIES.map((c) => (
                      <OptionBtn key={c.id} label={c.name} meta={c.meta} selected={false}
                        icon={c.id === 'cooled' ? <Snowflake /> : <ShieldCheck />}
                        onClick={() => setLowerCat(c)} />
                    ))}
                  </div>
                </>
              ) : !lower ? (
                <>
                  <Breadcrumb trail={[lowerCat.name, 'Choose weld-nut size']} />
                  <div className="grid grid-cols-5 gap-2.5">
                    {LOWER_SIZES.map((s) => (
                      <OptionBtn key={s.id} label={s.name} meta="" selected={false}
                        onClick={() => setLower({ body: lowerCat.body, meta: lowerCat.meta, name: `${lowerCat.name} ${s.name}` })} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between pl-14">
                  <span className="text-[13px] text-[#C0C0C0]">{lower.name} · <span className="text-[#1de9b6] font-mono text-[11px]">{lower.meta}</span></span>
                  <button onClick={() => setLower(null)} className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#1de9b6] hover:text-white bg-[#1de9b6]/10 hover:bg-[#1de9b6]/20 px-2.5 py-1.5 rounded transition-all">
                    <ChevronLeft size={12} /> Change
                  </button>
                </div>
              )}
            </StepCard>

            {/* ── STEP 3: CERAMIC PIN (size → geometry) ── */}
            <StepCard
              stepNum="3" meta="Step 03 · Centering" title="Ceramic Pin" icon={<Ruler />}
              locked={!(upper && lower)} done={!!ceramic} summary={ceramic ? `${ceramic.sizeName} ${ceramic.name}` : null}
              showBack={!!pinSize && !ceramic}
              onBack={() => setPinSize(null)}
            >
              {!pinSize ? (
                <>
                  <Breadcrumb trail={['Choose weld-nut size']} />
                  <div className="grid grid-cols-5 gap-2.5">
                    {PIN_SIZES.map((s) => (
                      <OptionBtn key={s.id} label={s.name} meta="" selected={false} onClick={() => setPinSize(s)} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#888] font-mono mt-3 pl-1">Material: {PIN_MATERIAL}</p>
                </>
              ) : !ceramic ? (
                <>
                  <Breadcrumb trail={[`Nut ${pinSize.name}`, 'Choose geometry']} />
                  <div className="grid grid-cols-3 gap-2.5">
                    {PIN_GEOMETRIES.map((g) => (
                      <OptionBtn key={g.id} label={g.name} meta={g.meta} icon={<Ruler />} selected={false}
                        onClick={() => setCeramic({ ...g, sizeName: pinSize.name })} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between pl-14">
                  <span className="text-[13px] text-[#C0C0C0]">{ceramic.sizeName} {ceramic.name} · <span className="text-[#1de9b6] font-mono text-[11px]">{ceramic.meta}</span></span>
                  <button onClick={() => setCeramic(null)} className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#1de9b6] hover:text-white bg-[#1de9b6]/10 hover:bg-[#1de9b6]/20 px-2.5 py-1.5 rounded transition-all">
                    <ChevronLeft size={12} /> Change
                  </button>
                </div>
              )}
            </StepCard>

            {/* QUOTE BAR */}
            <div className={`mt-2 p-4 md:p-5 rounded-xl border transition-all duration-500 ${completed === 3 ? 'bg-gradient-to-r from-[#1de9b6]/15 to-transparent border-[#1de9b6]/50 shadow-[0_0_24px_rgba(29,233,182,0.12)]' : 'bg-white/[0.02] border-white/8'}`}>
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-[#1de9b6] tracking-[0.25em] uppercase mb-1">REF · DGSI-PW-2026</div>
                  <div className="text-sm font-bold text-white truncate">{summary}</div>
                  {completed < 3 && <div className="text-[11px] text-[#888] mt-1">{3 - completed} more {3 - completed === 1 ? 'component' : 'components'} to complete</div>}
                </div>
                <a
                  href={completed === 3 ? '#contact' : undefined}
                  onClick={(e) => {
                    if (completed < 3) { e.preventDefault(); return; }
                    onClose();
                    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className={`flex items-center justify-center gap-3 px-6 md:px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded transition-all duration-300 shrink-0 ${
                    completed === 3 ? 'bg-[#1de9b6] text-black hover:bg-white shadow-[0_0_20px_rgba(29,233,182,0.3)] cursor-pointer' : 'bg-white/5 text-[#555] border border-white/10 cursor-not-allowed'
                  }`}
                >
                  <FileText size={14} /><span>Request Quote</span>{completed === 3 && <ChevronRight size={14} />}
                </a>
              </div>
            </div>

            <a href="/welding-catalog.pdf" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/10 text-[#B8B8B8] hover:text-white hover:border-[#1de9b6]/40 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all">
              <Download size={14} /><span>Or download full welding catalog</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}