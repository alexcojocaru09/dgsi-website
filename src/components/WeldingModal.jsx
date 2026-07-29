// src/components/WeldingModal.jsx
// modal-welding-new · v10 — CATALOG CONSUMABILE RPW (3 piloni)
//   Piloni: Electrozi | Bucșe | Pini · date din src/data/weldingCatalog.js
//   2D = imaginea desenului (public/welding-drawings/) · 3D = revoluție exactă din cote
//   Cod tranzitoriu DGSI-TMP-xxx până la codificarea finală · Doceram doar ca "echivalent"
//   RFQ prin RFQSystem.jsx (AddToRFQButton) · contract exporturi păstrat, App.jsx neatins

import React, { useState, useMemo } from 'react';
import { X, Search, Download, Box, LayoutGrid, ChevronDown, Info, Clock } from 'lucide-react';
import { AddToRFQButton } from './RFQSystem';
import { PILLARS, FAMILIES, PARTS } from '../data/weldingCatalog';
import PartViewer3D from './PartViewer3D';

// ═══════════════════════════════════════════════════════════════════════════
// BANNER FLAGSHIP — grafic decorativ de brand (NU desen de produs).
// Păstrat pentru contractul cu App.jsx. NU ELIMINA.
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
  const SCALE = 3.5;
  const VW = 240, VH = 400, cx = VW / 2;
  const sheetH = 6, sheetY = VH / 2 + 20;
  const hasBoth = upper && lower;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full">
      <SvgDefs />
      <rect x={40} y={8} width={VW-80} height={12} rx="2" fill="url(#w4-brass)"/>
      <text x={cx} y={30} fill="#14D9C4" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">UPPER HEAD · FIXED</text>
      <rect x={40} y={VH-20} width={VW-80} height={12} rx="2" fill="url(#w4-brass)"/>
      <text x={cx} y={VH-26} fill="#14D9C4" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">LOWER HEAD · FIXED</text>

      <rect x={16} y={sheetY} width={VW-32} height={sheetH} fill="url(#w4-steel)"/>
      <text x={20} y={sheetY-4} fill="#778" fontSize="7" fontFamily="monospace">SHEET</text>

      {upper && (() => {
        const d = upper.dCorp * SCALE, l = upper.L * SCALE, x = cx - d/2, y0 = 40;
        const shW = d*0.6, tip = d*0.3;
        return (
          <g>
            <rect x={cx-shW/2} y={y0} width={shW} height={10} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <rect x={x} y={y0+10} width={d} height={l-tip-10} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <path d={`M ${x} ${y0+l-tip} L ${x+d} ${y0+l-tip} L ${cx+d*0.25} ${y0+l} L ${cx-d*0.25} ${y0+l} Z`} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
          </g>
        );
      })()}

      {pin && (() => {
        const d = pin.dCorp * SCALE, l = pin.L * SCALE, x = cx - d/2;
        const yTop = sheetY - l * 0.45;
        const dTip = (pin.dVarf ?? pin.dCorp * 0.7) * SCALE;
        return (
          <g>
            <rect x={cx-dTip/2} y={yTop} width={dTip} height={l*0.3} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
            <path d={`M ${cx-dTip/2} ${yTop} L ${cx+dTip/2} ${yTop} L ${cx} ${yTop-dTip*0.35} Z`} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
            <rect x={x} y={yTop+l*0.3} width={d} height={l*0.7} fill="url(#w4-pin)" stroke="#99a" strokeWidth="0.5"/>
          </g>
        );
      })()}

      {lower && (() => {
        const d = lower.dCorp * SCALE, l = lower.L * SCALE, x = cx - d/2;
        const yEnd = VH - 22, y0 = yEnd - l;
        return (
          <g>
            <rect x={x} y={y0} width={d} height={l} fill="url(#w4-cu)" stroke="#6a3f1a" strokeWidth="0.6"/>
            <rect x={cx - (pin ? pin.dCorp*SCALE/2+1.5 : 6)} y={y0} width={pin ? pin.dCorp*SCALE+3 : 12} height={l} fill="#1a0f08" opacity="0.55"/>
          </g>
        );
      })()}

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

// Export păstrat pentru App.jsx — NU ELIMINA
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
// STĂRI VIEWER
// ═══════════════════════════════════════════════════════════════════════════
function EmptyViewer({ text }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 h-full">
      <Info size={26} className="text-[#333] mb-3"/>
      <p className="text-[13px] text-[#666] font-mono max-w-xs">{text}</p>
    </div>
  );
}

function PendingDrawing({ label }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 h-full">
      <Clock size={26} className="text-[#333] mb-3"/>
      <p className="text-[13px] text-[#999] font-mono max-w-xs">Desen {label} în pregătire</p>
      <p className="text-[11px] text-[#555] font-mono mt-2 max-w-xs">Se adaugă din sursă verificată — nu afișăm date estimate</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWER — 3D / 2D
// ═══════════════════════════════════════════════════════════════════════════
function ViewerPanel({ part, tab, setTab }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-b border-white/10 flex-wrap bg-[#0A0A0A] relative z-10">
        <div className="text-[11px] font-mono text-[#888] truncate">
          {part
            ? <>Catalog <ChevronDown size={10} className="inline -rotate-90 mx-1"/>{FAMILIES.find(f => f.key === part.family)?.label}<ChevronDown size={10} className="inline -rotate-90 mx-1"/><span className="text-white">{part.dgsiCode || part.tempCode}</span></>
            : 'selectează o piesă'}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(part?.assets?.pdf || part?.assets?.drawing2d) && (
            <a href={part.assets.pdf || part.assets.drawing2d}
              {...(part.assets.pdf ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-mono font-bold text-[#999] hover:text-[#14D9C4] border border-white/15 hover:border-[#14D9C4]/50 rounded transition">
              <Download size={13}/>Desen
            </a>
          )}
          <button disabled title="CAD în pregătire"
            className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-mono font-bold text-[#555] border border-white/10 rounded cursor-not-allowed opacity-50">
            <Download size={13}/>CAD
          </button>
          {part && (
            <AddToRFQButton
              item={{ id: part.dgsiCode || part.tempCode, name: part.name, category: 'RPW Consumables' }}
              size="sm"
            />
          )}
        </div>
      </div>

      <div className="flex gap-1 px-5 md:px-6 pt-4 bg-[#0A0A0A] relative z-10">
        {[{ key: '3d', label: '3D', icon: Box }, { key: '2d', label: '2D', icon: LayoutGrid }].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-t-lg border-b-2 transition ${tab === t.key ? 'text-[#14D9C4] border-[#14D9C4] bg-[#14D9C4]/[0.06]' : 'text-[#777] border-transparent hover:text-white'}`}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden border-t border-white/5 relative">
        {tab === '3d' && (
          !part ? <EmptyViewer text="Selectează o piesă pentru modelul 3D" />
          : part.profile3d ? <PartViewer3D profile={part.profile3d} />
          : <PendingDrawing label="3D" />
        )}
        {tab === '2d' && (
          !part ? <EmptyViewer text="Selectează o piesă pentru desenul 2D" />
          : part.assets?.pdf ? (
            <iframe
              src={part.assets.pdf}
              title={`Desen tehnic ${part.tempCode}`}
              className="w-full h-full border-0 bg-white"
            />
          )
          : part.assets?.drawing2d ? (
            <div className="w-full h-full bg-white flex items-center justify-center p-4 overflow-auto">
              <img src={part.assets.drawing2d} alt={`Desen 2D ${part.tempCode}`}
                className="max-w-full max-h-full object-contain" />
            </div>
          )
          : <PendingDrawing label="2D" />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PANOU SPECIFICAȚII
// ═══════════════════════════════════════════════════════════════════════════
function SpecPanel({ part }) {
  if (!part) return <EmptyViewer text="Selectează o piesă din listă pentru specificații" />;
  return (
    <div className="flex flex-col h-full overflow-y-auto min-h-0">
      <div className="p-4 border-b border-white/10">
        <span className="text-[10px] font-mono text-[#14D9C4] tracking-[0.3em] uppercase">
          {FAMILIES.find(f => f.key === part.family)?.label}
        </span>
        <h4 className="text-[16px] font-black text-white mt-1.5 leading-snug">{part.name}</h4>
        <div className="mt-2.5 font-mono">
          {part.dgsiCode ? (
            <span className="text-[15px] font-black text-[#14D9C4]">{part.dgsiCode}</span>
          ) : (
            <>
              <span className="text-[15px] font-black text-[#14D9C4]">{part.tempCode}</span>
              <span className="ml-2 px-2 py-0.5 bg-[#e7b23c]/15 text-[#e7b23c] text-[8px] font-black uppercase tracking-[0.12em] rounded align-middle">
                cod DGSI în curs de atribuire
              </span>
            </>
          )}
        </div>
        <div className="text-[10px] font-mono text-[#7a7a7a] mt-1.5">
          echivalent pentru <span className="text-[#B0B0B0]">Doceram {part.docerawEquivalent}</span>
        </div>
      </div>
      <div>
        {part.specs.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2.5 px-4 border-b border-white/5 gap-4">
            <span className="text-[10px] font-mono text-[#777] uppercase tracking-wider shrink-0">{label}</span>
            <span className="text-[13px] font-mono font-bold text-white text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL PRINCIPAL (export default — contract App.jsx, NU MODIFICA SEMNĂTURA)
// ═══════════════════════════════════════════════════════════════════════════
export default function WeldingModal({ onClose }) {
  const [pillar, setPillar] = useState(PILLARS[0].key);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(PARTS[0] || null);
  const [tab, setTab] = useState('3d');
  const [mobileView, setMobileView] = useState('list');

  const families = useMemo(() => FAMILIES.filter(f => f.pillar === pillar), [pillar]);

  const partsByFamily = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = {};
    families.forEach(f => {
      map[f.key] = PARTS.filter(p => p.family === f.key).filter(p => !q ||
        p.name.toLowerCase().includes(q) ||
        (p.dgsiCode || '').toLowerCase().includes(q) ||
        p.tempCode.toLowerCase().includes(q) ||
        p.docerawEquivalent.toLowerCase().includes(q)
      );
    });
    return map;
  }, [families, query]);

  const totalInPillar = useMemo(
    () => Object.values(partsByFamily).reduce((n, arr) => n + arr.length, 0),
    [partsByFamily]
  );

  const handleSelect = p => { setSelected(p); setTab('3d'); setMobileView('detail'); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-[95vw] h-[92vh] bg-[#0A0A0A] border border-[#14D9C4]/40 shadow-[0_0_80px_rgba(20,217,196,0.2)] rounded-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* BACKGROUND INDUSTRIAL — imagine + overlay întunecat pt. lizibilitate (~20%) */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('/welding-modal-background.png')",
            opacity: 0.22,
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0A0A0A]/85 via-[#0A0A0A]/70 to-[#0a1512]/85 pointer-events-none" />

        <div className="weld-scanline z-[5]"/>
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#14D9C4] z-20"/>
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#14D9C4] z-20"/>
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#14D9C4] z-20"/>
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#14D9C4] z-20"/>

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10 shrink-0 bg-[#0A0A0A]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-3 py-1.5 bg-[#14D9C4]/20 text-[#14D9C4] text-[11px] font-black uppercase tracking-[0.2em] rounded shrink-0">Flagship</span>
            <h2 className="text-[17px] md:text-[22px] font-black uppercase tracking-wider text-white truncate">
              RPW <span className="text-[#14D9C4] glow-accent">Consumables</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-[#7A7A7A] hover:text-white transition bg-[#111] hover:bg-[#1a1a1a] p-2.5 rounded-full"><X size={22}/></button>
        </div>

        {/* PILONI */}
        <div className="relative z-10 flex gap-1 px-5 md:px-8 border-b border-white/10 shrink-0 bg-[#0A0A0A]">
          {PILLARS.map(p => (
            <button key={p.key}
              onClick={() => { setPillar(p.key); setSelected(null); setMobileView('list'); }}
              className={`px-5 py-3 text-[12px] font-black uppercase tracking-[0.1em] border-b-2 transition ${pillar === p.key ? 'text-[#14D9C4] border-[#14D9C4] bg-[#14D9C4]/[0.06]' : 'text-[#777] border-transparent hover:text-white'}`}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

          {/* STÂNGA — căutare + arbore familii/piese */}
          <div className={`lg:w-[300px] shrink-0 border-r border-white/10 flex-col min-h-0 relative z-10 bg-[#0A0A0A] ${mobileView === 'list' ? 'flex flex-1' : 'hidden lg:flex'}`}>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/15 focus-within:border-[#14D9C4]/60 rounded-lg px-3.5 py-2.5">
                <Search size={15} className="text-[#888] shrink-0"/>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="cod, denumire, echivalent..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-[#666] font-mono"/>
                {query && <button onClick={() => setQuery('')} className="text-[#666] hover:text-white"><X size={13}/></button>}
              </div>
            </div>
            <div className="px-4 py-2 text-[10px] font-mono text-[#777] uppercase tracking-wider">
              {totalInPillar} {totalInPillar === 1 ? 'piesă' : 'piese'} · {PILLARS.find(p => p.key === pillar)?.label}
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {families.map(f => (
                <div key={f.key}>
                  <div className="px-4 pt-3 pb-1.5 text-[9px] font-mono text-[#666] uppercase tracking-[0.2em]">{f.label}</div>
                  {partsByFamily[f.key].length === 0 && (
                    <div className="px-4 py-2 text-[11px] font-mono text-[#555]">— în curând —</div>
                  )}
                  {partsByFamily[f.key].map(p => {
                    const active = selected?.tempCode === p.tempCode;
                    return (
                      <div key={p.tempCode} onClick={() => handleSelect(p)}
                        className={`px-4 py-2.5 border-b border-white/5 cursor-pointer transition-colors ${active ? 'bg-[#14D9C4]/10 border-l-2 border-l-[#14D9C4]' : 'hover:bg-white/[0.03]'}`}>
                        <div className={`text-[12px] font-mono font-bold flex items-center gap-2 ${active ? 'text-[#14D9C4]' : 'text-white'}`}>
                          {p.dgsiCode || p.tempCode}
                          {(p.profile3d || p.assets?.drawing2d) &&
                            <span className="w-1.5 h-1.5 rounded-full bg-[#14D9C4] shrink-0" title="desen verificat"/>}
                        </div>
                        <div className="text-[11px] text-[#888] truncate">{p.name}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* MIJLOC — specificații */}
          <div className={`lg:w-[290px] shrink-0 border-r border-white/10 min-h-0 relative z-10 bg-[#0A0A0A] ${mobileView === 'detail' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
            {mobileView === 'detail' && (
              <button onClick={() => setMobileView('list')} className="lg:hidden flex items-center gap-1.5 text-[11px] font-mono text-[#888] hover:text-[#14D9C4] px-5 pt-4">
                <ChevronDown size={13} className="rotate-90"/>Înapoi la listă
              </button>
            )}
            <SpecPanel part={selected} />
          </div>

          {/* DREAPTA — viewer 3D/2D */}
          <div className={`flex-1 min-h-0 ${mobileView === 'detail' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
            <ViewerPanel part={selected} tab={tab} setTab={setTab} />
          </div>

        </div>
      </div>
    </div>
  );
}