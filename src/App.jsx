// src/App.jsx
// v · 14.10.26 · Sockets catalogs + presentations → 6 languages (RO/EN/FR/DE/IT/ES), new file names, IT/ES flags
// v · 08.10.26 · Welding catalog RO/EN/FR/DE + Sockets printed brochure (EN) + RPW database paused (SHOW_RPW_DATABASE)
// v · 04.08.26 · Impact Sockets — cataloage multilingve RO/EN/FR/DE cu butoane-steag
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, FileText, Zap, Wrench, Phone, Monitor, Settings, Truck, X, Target, CheckCircle, Droplets, Ruler, ShieldCheck, Download, ChevronRight, Mail, MapPin, MessageCircle, ArrowUp, Package, Database, ExternalLink, BookOpen } from 'lucide-react';
import SubcategoryIcon from './components/SubcategoryIcons';
import WeldingModal, { WeldingAnimation } from './components/WeldingModal';
import { RFQProvider, AddToRFQButton, RFQFloatingBadge, RFQWizard, useRFQ } from './components/RFQSystem';
import { translations, LANGS } from './i18n';

// ─── Custom Icons ─────────────────────────────────────────────────────────────
function LinkedInIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
    </svg>
  );
}

function TeamsIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM20 11.5h-8c-1.38 0-2.5 1.12-2.5 2.5v7h13v-7c0-1.38-1.12-2.5-2.5-2.5ZM16.5 15h-1.5v4.5h-1V15H12.5v-1h4v1ZM2 13.5v7h6v-8H4.5c-1.38 0-2.5 1.12-2.5 2.5Z" />
    </svg>
  );
}

// ─── Country Flags — inline SVG, zero assets ──────────────────────────────────
function Flag({ code }) {
  const uid = React.useId().replace(/:/g, '');
  const box = 'block w-full h-full';

  if (code === 'RO') return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <rect width="1" height="2" fill="#002B7F" />
      <rect x="1" width="1" height="2" fill="#FCD116" />
      <rect x="2" width="1" height="2" fill="#CE1126" />
    </svg>
  );

  if (code === 'FR') return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  );

  if (code === 'IT') return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  );

  if (code === 'ES') return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </svg>
  );

  if (code === 'DE') return (
    <svg viewBox="0 0 5 3" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <rect width="5" height="1" fill="#000000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  );

  // EN → Union Jack
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={box} aria-hidden="true">
      <clipPath id={`uk-${uid}`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#uk-${uid})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

// ─── Impact Sockets — cataloage multilingve ───────────────────────────────────
// Fișierele stau în /public/catalogs/ — schimbă doar aici dacă se modifică numele
const SOCKET_CATALOGS = [
  { code: 'RO', file: '/catalogs/Catalog tubulare DGSI w35 RO - compressed.pdf' },
  { code: 'EN', file: '/catalogs/Socket Catalogue DGSI w35 EN - compressed.pdf' },
  { code: 'FR', file: '/catalogs/Catalogue Douilles DGSI w35 FR - compressed.pdf' },
  { code: 'DE', file: '/catalogs/Katalog Stecknuesse DGSI w35 DE - compressed.pdf' },
  { code: 'IT', file: '/catalogs/Catalogo Bussole DGSI w35 IT - compressed.pdf' },
  { code: 'ES', file: '/catalogs/Catalogo Vasos DGSI w35 ES - compressed.pdf' },
];

// ─── Impact Sockets — broșură tipărită (rezumat întreaga gamă, EN) ────────────
// Urci PDF-ul în /public/catalogs/ cu exact acest nume. ready: false → buton gri „coming soon”.
const SOCKET_BROCHURE = { code: 'EN', file: '/catalogs/Brosura-tubulare-EN-w41.pdf', ready: false };

// ─── RPW Welding — cataloage multilingve ──────────────────────────────────────
// Fișierele stau în /public/catalogs/ — aceeași logică ca la tubulare.
// Dacă o limbă nu e gata: ready: false → steag gri, neclicabil.
const WELDING_CATALOGS = [
  { code: 'RO', file: '/catalogs/Catalog-welding-RO-w41.pdf', ready: true },
  { code: 'EN', file: '/catalogs/Catalog-welding-EN-w41.pdf', ready: true },
  { code: 'FR', file: '/catalogs/Catalog-welding-FR-w41.pdf', ready: true },
  { code: 'DE', file: '/catalogs/Catalog-welding-DE-w41.pdf', ready: true },
];

// ─── RPW Database — PAUZĂ ─────────────────────────────────────────────────────
// false = ascunde secțiunea 03 „RPW Electrode Database” + modalul cu baza de date.
// Codul (WeldingModal, weldingCatalog.js, PartViewer3D) rămâne intact pentru reconstrucție.
// Când revine baza de date nouă: treci pe true.
const SHOW_RPW_DATABASE = false;

// ─── Grilă de 4 steaguri pentru cataloage multilingve (sockets + welding) ─────
function CatalogFlags({ catalogs, label }) {
  return (
    <div className={`grid gap-2 mb-3 ${catalogs.length > 4 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4'}`}>
      {catalogs.map((c) => (
        c.ready === false ? (
          <span
            key={c.code}
            title={`${label} — ${c.code} — coming soon`}
            aria-disabled="true"
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/[0.02] border border-white/10 rounded-sm opacity-40 cursor-not-allowed"
          >
            <span className="block w-[26px] h-[17px] overflow-hidden rounded-[2px] grayscale">
              <Flag code={c.code} />
            </span>
            <span className="text-[9px] font-black tracking-[0.15em] text-[#7A7A7A]">{c.code}</span>
          </span>
        ) : (
          <a
            key={c.code}
            href={encodeURI(c.file)}
            target="_blank"
            rel="noopener noreferrer"
            title={`${label} — ${c.code} (PDF)`}
            aria-label={`Download ${label} ${c.code}`}
            className="group/flag flex flex-col items-center justify-center gap-1.5 py-3 bg-[#5EEAD4]/[0.06] border border-[#5EEAD4]/25 rounded-sm hover:bg-[#5EEAD4]/15 hover:border-[#5EEAD4] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(94,234,212,0.25)] transition-all duration-200"
          >
            <span className="block w-[26px] h-[17px] overflow-hidden rounded-[2px] ring-1 ring-black/40 group-hover/flag:ring-[#5EEAD4]/60 transition">
              <Flag code={c.code} />
            </span>
            <span className="text-[9px] font-black tracking-[0.15em] text-[#B8B8B8] group-hover/flag:text-[#5EEAD4] transition-colors">{c.code}</span>
          </a>
        )
      ))}
    </div>
  );
}

// ─── Prezentare de firmă — PDF multilingv ─────────────────────────────────────
// Fișierele stau în /public/business-presentations/
// Când primești FR/DE: urci fișierul și treci ready: true — atât.
const PRESENTATIONS = [
  { code: 'RO', file: '/business-presentations/DGSI pres RO - optimizat.pdf', ready: true },
  { code: 'EN', file: '/business-presentations/DGSI pres EN - optimizat.pdf', ready: true },
  { code: 'FR', file: '/business-presentations/DGSI pres FR - optimizat.pdf', ready: true },
  { code: 'DE', file: '/business-presentations/DGSI pres DE - optimizat.pdf', ready: true },
  { code: 'IT', file: '/business-presentations/DGSI pres IT - optimizat.pdf', ready: true },
  { code: 'ES', file: '/business-presentations/DGSI pres ES - optimizat.pdf', ready: true },
];

// ─── Constants: Certifications (imagini PNG cu fundal negru) ──────────────
// Fișierele stau în /public/certifications/ — ordine: ISO crescător, EcoVadis ultimul
const CERT_DIR = '/certifications';
const CERTIFICATIONS = [
  { name: 'ISO 9001',  file: 'iso-9001',  title: 'Quality Management' },
  { name: 'ISO 14001', file: 'iso-14001', title: 'Environmental Management' },
  { name: 'ISO 27001', file: 'iso-27001', title: 'Information Security' },
  { name: 'ISO 45001', file: 'iso-45001', title: 'Occupational Health & Safety' },
  { name: 'EcoVadis',  file: 'ecovadis',  title: 'Sustainability Rating — Silver, Top 15%' },
];

// ─── Constants: Supplier Logos (Local SVG/PNG Files) ──────────────────────
const supplierLogos = [
  { name: 'Beta', src: '/logos/beta.png', color: '#F25322', scale: 3 },
  { name: 'Bosch', src: '/logos/bosch.svg', color: '#EA0016' },
  { name: 'Facom', src: '/logos/facom.svg', color: '#E3000F' },
  { name: 'Honeywell', src: '/logos/Honeywell.svg', color: '#FF1B2D' },
  { name: 'Milwaukee', src: '/logos/Milwaukee.svg', color: '#D01B22', scale: 1.3 },
  { name: 'Unior', src: '/logos/unior.png', color: '#005EAA', scale: 1.8 },
  { name: 'Siemens', src: '/logos/siemens.svg', color: '#009999' },
  { name: 'Schneider Electric', src: '/logos/Schneider.png', color: '#3DCD58', scale: 1 },
  { name: 'Festo', src: '/logos/festo.png', color: '#0090D4', scale: 1 },
  { name: 'Sick', src: '/logos/sick.png', color: '#00509E', scale: 1 },
  { name: 'Legrand', src: '/logos/legrand.png', color: '#E2001A', scale: 1 },
  { name: 'SMC', src: '/logos/smc.png', color: '#005EAA', scale: 1 },
  { name: 'Balluff', src: '/logos/balluff.png', color: '#000000', scale: 1 },
  { name: 'Bahco', src: '/logos/bahco.png', color: '#E2001A', scale: 1 },
  { name: 'Gedore', src: '/logos/gedore.jpg', color: '#E2001A', scale: 1 },
  { name: 'Stahlwille', src: '/logos/stahlwille.jpg', color: '#003D7C', scale: 1 },
  { name: 'Mitutoyo', src: '/logos/mitutoyo.png', color: '#003D7C', scale: 1 },
  { name: 'Mahr', src: '/logos/mahr.png', color: '#E2001A', scale: 1 },
  { name: 'Fluke', src: '/logos/fluke.png', color: '#FFC400', scale: 1 },
  { name: 'Zeiss', src: '/logos/zeiss.png', color: '#0072C6', scale: 1 },
  { name: 'Schunk', src: '/logos/schunk.png', color: '#003D7C', scale: 1 },
  { name: 'Röhm', src: '/logos/rohm.png', color: '#E2001A', scale: 1 },
  { name: 'Kärcher', src: '/logos/Kaercher.svg', color: '#FFD800', scale: 1 },
  { name: 'Kyocera', src: '/logos/kyocera.png', color: '#E2001A', scale: 1 },
  { name: 'Komet', src: '/logos/komet.jpg', color: '#003D7C', scale: 1 }
];

// ─── Constants: Client Logos (Local Files) ──────────────────────
const clientLogos = [
  { name: 'Dacia', src: '/logos/dacia.png', scale: 1 },
  { name: 'Kirchhoff', src: '/logos/kirchhoff.png', scale: 1 },
  { name: 'Martur Fompak', src: '/logos/martur.png', scale: 1 },
  { name: 'Farplas', src: '/logos/farplas.png', scale: 1 },
  { name: 'Kärcher', src: '/logos/Kaercher.svg', scale: 1 },
  { name: 'Timken', src: '/logos/timken.png', scale: 1 },
  { name: 'Horse Powertrain', src: '/logos/horse.png', scale: 1 },
  { name: 'Beyçelik Gestamp', src: '/logos/gestamp.png', scale: 1 },
  { name: 'Coșkunöz', src: '/logos/coskunoz.png', scale: 1 },
  { name: 'GIC Nosag', src: '/logos/gicnosag.jpeg', scale: 3 },
  { name: 'UKS', src: '/logos/uks.png', scale: 1 },
  { name: 'Opsan', src: '/logos/opsan.jpeg', scale: 3 }
];

// ─── Constants: Product Categories (aligned with business presentation) ─────
// Each subcategory item: { name, brands: [{ name, src?, scale? }] }
// Brands with `src` render as image; without `src` render as text pill until you add the file to /public/logos/
const productCategories = [
  {
    cat: 'Machining',
    icon: <Settings />,
    items: ['Holemaking & Boring', 'Threading & Tapping', 'Parting & Cutting-off', 'Turning', 'Milling'],
    catalogFile: '/machining-catalog.pdf',
    brands: [
      { name: 'Kyocera', src: '/logos/kyocera.png' },
      { name: 'Komet', src: '/logos/komet.jpg' },
      { name: 'Re-Bo', src: '/logos/rebo.png' },
      { name: 'WTE', src: '/logos/WTE.jpg' },
      { name: 'Fahrion', src: '/logos/fahrion.png' },
      { name: 'EWS', src: '/logos/ews.png' }
    ]
  },
  {
    cat: 'Toolholding',
    icon: <Wrench />,
    items: ['Toolholders', 'Collet Chucks', 'Lathe Chucks', 'Machine Vises', 'Rigid Clamping'],
    catalogFile: '/clamping-catalog.pdf',
    brands: [
      { name: 'Schunk', src: '/logos/schunk.png' },
      { name: 'Röhm', src: '/logos/rohm.png' },
      { name: 'Allmatic', src: '/logos/allmatic.jpg' },
      { name: 'AMF', src: '/logos/amf.png' },
      { name: 'Hainbuch', src: '/logos/hainbuch.png' },
      { name: 'Bessey', src: '/logos/bessey.png' }
    ]
  },
  {
    cat: 'Measurement',
    icon: <Ruler />,
    items: ['Micrometers', 'Dial Indicators', 'Feeler Gauges', 'Calipers', 'Smart Sensors'],
    catalogFile: '/measuring-catalog.pdf',
    brands: [
      { name: 'Mitutoyo', src: '/logos/mitutoyo.png' },
      { name: 'Mahr', src: '/logos/mahr.png' },
      { name: 'Zeiss', src: '/logos/zeiss.png' },
      { name: 'Tesa', src: '/logos/tesa.png' },
      { name: 'Fluke', src: '/logos/fluke.png' },
      { name: 'Honeywell', src: '/logos/Honeywell.svg' },
      { name: 'Siemens', src: '/logos/siemens.svg' },
      { name: 'Festo', src: '/logos/festo.png' },
      { name: 'SICK', src: '/logos/sick.png' },
      { name: 'SMC', src: '/logos/smc.png' },
      { name: 'Balluff', src: '/logos/balluff.png' },
      { name: 'Schneider Electric', src: '/logos/Schneider.png' }
    ]
  },
  {
    cat: 'Abrasives & Sawing',
    icon: <Zap />,
    items: ['Abrasive Discs', 'Wire Brushes', 'Saw Blades', 'Precision Files', 'Spare Parts'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: 'Pferd', src: '/logos/pferdtools.png' },
      { name: 'Lukas', src: '/logos/lukas.png' },
      { name: '3M', src: '/logos/3m.svg' },
      { name: 'Bosch', src: '/logos/bosch.svg' },
      { name: 'Milwaukee', src: '/logos/Milwaukee.svg', scale: 1.25 },
      { name: 'Bahco', src: '/logos/bahco.png' }
    ]
  },
  {
    cat: 'Hand Tools',
    icon: <Wrench />,
    items: ['Fastening & Assembly', 'Torque Tools', 'Impact Tools', 'Cutting Tools', 'Tool Sets'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: 'Bosch', src: '/logos/bosch.svg' },
      { name: 'Milwaukee', src: '/logos/Milwaukee.svg', scale: 1.25 },
      { name: 'Facom', src: '/logos/facom.svg' },
      { name: 'Beta', src: '/logos/beta.png', scale: 1.35 },
      { name: 'Unior', src: '/logos/unior.png', scale: 1.3 },
      { name: 'Gedore', src: '/logos/gedore.jpg' },
      { name: 'Hazet', src: '/logos/hazet.png' },
      { name: 'Stahlwille', src: '/logos/stahlwille.jpg' },
      { name: 'Bahco', src: '/logos/bahco.png' }
    ]
  },
  {
    cat: 'Protective Equipment',
    icon: <ShieldCheck />,
    items: ['Hand Protection', 'Head Protection', 'Workwear & Footwear', 'Fall Protection', 'First Aid'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: '3M', src: '/logos/3m.svg' },
      { name: 'Honeywell', src: '/logos/Honeywell.svg' },
      { name: 'Milwaukee', src: '/logos/Milwaukee.svg', scale: 1.25 }
    ]
  }
];

// ─── Utilities & Components ───────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ id, children, className = '', bgImage = null }) {
  const [ref, visible] = useInView();
  return (
    <section id={id} ref={ref} className={`relative py-28 px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} bg-[#080808] ${className} overflow-hidden`}>
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale" style={{ backgroundImage: `url('${bgImage}')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808]/50 to-[#080808]" />
        </>
      )}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#5EEAD4]/20 z-10" />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ code, label }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-[10px] text-[#7A7A7A] font-mono tracking-widest">{code}</span>
      <div className="h-px flex-1 max-w-[40px] bg-[#5EEAD4]/40" />
      <span className="text-[10px] text-[#5EEAD4] font-mono tracking-[0.3em] uppercase">{label}</span>
    </div>
  );
}

function Counter({ end, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    const duration = 1800;
    const steps = 60;
    const inc = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(parseFloat(current.toFixed(decimals)));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, end, decimals]);
  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}</span>;
}

// ─── Text Scramble Effect ("CNC decoding") ─────────────────────────────────
// Characters decode from random glyphs to real text on scroll-in, one at a time.
const CNC_CHARS = '⌀╳▓░█▒◆◇●○■□△▽⬡⬢⏣⏢';

function ScrambleText({ text, className = '', as: Tag = 'span', children }) {
  const displayText = text || (typeof children === 'string' ? children : '');
  const [output, setOutput] = useState(displayText);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [ref, visible] = useInView(0.3);
  // Sync output when the text prop changes (e.g. language switch)
  useEffect(() => { setOutput(displayText); }, [displayText]);
  useEffect(() => {
    if (!visible || hasPlayed || !displayText) return;
    setHasPlayed(true);
    const chars = displayText.split('');
    const totalFrames = chars.length + 8;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const decoded = chars.map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (i < frame - 4) return ch;
        return CNC_CHARS[Math.floor(Math.random() * CNC_CHARS.length)];
      }).join('');
      setOutput(decoded);
      if (frame >= totalFrames) {
        setOutput(displayText);
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [visible, hasPlayed, displayText]);
  return <Tag ref={ref} className={className}>{output}</Tag>;
}

// ─── Cursor Spotlight (radial glow following mouse) ────────────────────────
function useMouseGlow() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return pos;
}

function CursorSpotlight() {
  const { x, y } = useMouseGlow();
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(94, 234, 212,0.06), transparent 70%)`,
      }}
    />
  );
}

// ─── Premium Logo Card (reusable for suppliers & clients) ──────────────────
function LogoCard({ logo, className = '' }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`group/logo shrink-0 flex items-center justify-center bg-white rounded-xl border border-black/[0.06] p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_12px_40px_-12px_rgba(94, 234, 212,0.4)] hover:border-[#5EEAD4]/30 ${className}`}
    >
      {!failed ? (
        <img
          src={logo.src}
          alt={logo.name}
          loading="lazy"
          className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90 transition-opacity duration-300 group-hover/logo:opacity-100"
          style={{ transform: `scale(${logo.scale || 1})` }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-xs font-black uppercase tracking-[0.15em] text-center" style={{ color: logo.color || '#111' }}>{logo.name}</span>
      )}
    </div>
  );
}

// ─── Infinite Logo Marquee (premium "trusted by" scroller) ─────────────────
function LogoMarquee({ logos, direction = 'left', speed = 45, cardClass = '', fadeColor = '#080808' }) {
  const doubled = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10"
        style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10"
        style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
      />
      <div
        className={`flex gap-5 w-max ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((logo, idx) => (
          <LogoCard key={`${logo.name}-${idx}`} logo={logo} className={cardClass} />
        ))}
      </div>
    </div>
  );
}

const EmergencyTimeline = ({ expanded = false }) => {
  const steps = [
    { time: '00h', label: expanded ? 'SOS Request' : 'REQ', icon: <Phone size={expanded ? 36 : 12} /> },
    { time: '+2h', label: expanded ? 'CAD Engineering' : 'CAD', icon: <Monitor size={expanded ? 36 : 12} /> },
    { time: '+12h', label: expanded ? 'CNC Machining' : 'CNC', icon: <Settings size={expanded ? 36 : 12} className="animate-spin" style={{ animationDuration: '4s' }} /> },
    { time: '48h', label: expanded ? 'Dispatch & Ship' : 'SHIP', icon: <Truck size={expanded ? 36 : 12} /> },
  ];
  return (
    <div className={`w-full flex items-start justify-between relative ${expanded ? 'px-16' : 'px-2'}`}>
      <div className={`absolute left-0 right-0 h-[1px] bg-[#1A1A1A] z-0 ${expanded ? 'top-10 px-28' : 'top-3.5 px-6'}`} />
      <div className={`absolute left-0 bg-[#5EEAD4] z-0 animate-progress-flow ${expanded ? 'top-10 h-px shadow-[0_0_15px_#5EEAD4]' : 'top-3.5 h-[1px] shadow-[0_0_8px_#5EEAD4]'}`} style={{ animationDelay: '0.5s' }} />
      {steps.map((step, idx) => (
        <div key={idx} className="relative z-10 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: `${500 + idx * 300}ms` }}>
          <div className={`${expanded ? 'w-20 h-20 border-[3px]' : 'w-7 h-7 border'} rounded-full bg-[#080808] border-[#5EEAD4] text-[#5EEAD4] flex items-center justify-center shadow-[0_0_15px_rgba(94, 234, 212,0.3)]`}>{step.icon}</div>
          <div className={`flex flex-col items-center text-center ${expanded ? 'mt-4' : 'mt-2'}`}>
            <span className={`${expanded ? 'text-3xl md:text-4xl' : 'text-[10px]'} font-black text-white leading-none`}>{step.time}</span>
            <span className={`${expanded ? 'text-sm md:text-lg mt-2' : 'text-[7px] mt-1'} font-mono text-[#D0D0D0] uppercase tracking-widest`}>{step.label}</span>
          </div>
        </div>
      ))}
      </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ─── Contact Form — dual submit: Netlify Forms + mailto fallback ──────────
function ContactForm({ t }) {
  const [form, setForm] = useState({ company: '', name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const CONTACT_EMAIL = 'office@industrytools.ro';
  const handleSend = () => {
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return;
    // Netlify Forms POST (silent, appears in Netlify dashboard)
    try {
      const fd = new URLSearchParams();
      fd.append('form-name', 'dgsi-contact');
      fd.append('company', form.company);
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('message', form.message);
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: fd.toString() })
        .catch(() => {});
    } catch (e) { /* ignore */ }
    // mailto fallback (opens user's mail client)
    const subject = `[DGSI Contact] ${form.company || 'New inquiry'} — ${form.name || 'Website'}`;
    const body = [
      `From: ${form.name} (${form.company})`,
      `Email: ${form.email}`,
      '',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 rounded-full bg-[#5EEAD4]/20 flex items-center justify-center"><CheckCircle size={28} className="text-[#5EEAD4]" /></div>
        <p className="text-white font-black uppercase text-sm tracking-widest">Message sent</p>
        <p className="text-[#8A8A8A] text-xs font-mono">Your email client should open with the message pre-filled.</p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={t.contact.formCompany} className="bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#5EEAD4] outline-none transition-all text-white placeholder-[#5A5A5A]" />
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.formName} className="bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#5EEAD4] outline-none transition-all text-white placeholder-[#5A5A5A]" />
      </div>
      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.formEmail} className="w-full bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#5EEAD4] outline-none mb-6 transition-all text-white placeholder-[#5A5A5A]" />
      <textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.formMessage} className="w-full bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#5EEAD4] outline-none mb-8 resize-none transition-all text-white placeholder-[#5A5A5A]"></textarea>
      <button
        onClick={handleSend}
        disabled={!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)}
        className="w-full py-5 bg-[#5EEAD4] text-black font-black uppercase text-xs hover:bg-white transition-all shadow-[0_0_20px_#5EEAD433] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t.contact.send}
      </button>
    </>
  );
}

function AppInner() {
  const { setWizardOpen } = useRFQ();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lang, setLang] = useState('en');
  const [weldingOpen, setWeldingOpen] = useState(false);   // ← MODAL RPW (41 piese + 3D)
  const t = translations[lang];
  // Icons attached by id/index — translation data stays pure JSON-like
  const aboutIcons = { distributor: <Package />, manufacturing: <Zap />, audit: <Target />, tooling: <Wrench /> };
  const serviceIcons = { distributor: <Package />, manufacturing: <Zap />, tooling: <Settings /> };
  const stepIcons = [<FileText />, <Target />, <CheckCircle />, <Truck />];
  const auditIcons = [<Target />, <Droplets />, <Ruler />, <CheckCircle />];
  useEffect(() => {
    document.body.style.overflow = expandedCard ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [expandedCard]);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 40);
      setShowTop(scrollTop > 600);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };
  const navItems = ['about', 'products', 'services', 'clients', 'process', 'contact'];
  const productFilters = ['All', ...productCategories.map(p => p.cat)];
  const visibleProducts = activeFilter === 'All' ? productCategories : productCategories.filter(p => p.cat === activeFilter);
  // About cards data — text from translations, icons attached by id
  const aboutCards = t.about.cards.map(c => ({ ...c, icon: aboutIcons[c.id] }));
  return (
    <div className="min-h-screen bg-[#080808] text-[#F0EDE8] font-sans selection:bg-[#5EEAD4] selection:text-black overflow-x-hidden">
      {/* ── CURSOR SPOTLIGHT — radial glow following mouse ── */}
      <CursorSpotlight />

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
        <div className="h-full bg-gradient-to-r from-[#5EEAD4] to-[#5fffd9] shadow-[0_0_10px_rgba(94, 234, 212,0.6)] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080808]/98 backdrop-blur-md shadow-[0_1px_0_rgba(94, 234, 212,0.15)]' : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/60 to-transparent'}`}>
        {/* ═══ TIER 1 — utility strip: language + request quote ═══ */}
        <div className="hidden xl:block border-b border-white/[0.06]">
          <div className="max-w-[98%] 2xl:max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#5A5A5A] tracking-[0.3em] uppercase">Pitești · Romania — Tier-1 Industrial Supply</span>
            <div className="flex items-center gap-5">
              <button onClick={() => setWizardOpen(true)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#5EEAD4] hover:text-white transition-colors">
                <FileText size={11} className="transition-transform group-hover:rotate-12" />
                <span>{t.header.requestQuote}</span>
              </button>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1">
                {LANGS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-label={`Switch language to ${l.toUpperCase()}`}
                    className={`group/lang flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-[0.15em] rounded-[2px] transition-all duration-300 ${lang === l ? 'bg-[#5EEAD4] text-black shadow-[0_0_10px_rgba(94, 234, 212,0.3)]' : 'text-[#8A8A8A] hover:text-white'}`}
                  >
                    <span className={`block w-[15px] h-[10px] overflow-hidden rounded-[1px] transition-all duration-300 ${lang === l ? 'opacity-100 ring-1 ring-black/25' : 'opacity-40 grayscale group-hover/lang:opacity-100 group-hover/lang:grayscale-0'}`}>
                      <Flag code={l.toUpperCase()} />
                    </span>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TIER 2 — main bar: logo · nav (single row) · shop CTA ═══ */}
        <div className={`max-w-[98%] 2xl:max-w-7xl mx-auto px-6 flex justify-between items-center gap-6 transition-all duration-500 ${scrolled ? 'py-3' : 'py-4'}`}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group cursor-pointer shrink-0">
            {/* ── CNC MILLING ICON (compact, left of text) ── */}
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <rect x="14" y="74" width="72" height="12" rx="1.5" fill="#2A2A2A" stroke="#6A6A6A" strokeWidth="0.5" />
                  <rect x="14" y="74" width="72" height="3" rx="1.5" fill="#5EEAD4" opacity="0.25" />
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <line x1="8" y1="80" x2="90" y2="80" stroke="#5EEAD4" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                    <text x="92" y="83" fill="#5EEAD4" fontSize="8" fontWeight="bold" opacity="0.7">X</text>
                    <line x1="50" y1="6" x2="50" y2="86" stroke="#5EEAD4" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                    <text x="53" y="10" fill="#5EEAD4" fontSize="8" fontWeight="bold" opacity="0.7">Y</text>
                  </g>
                  <g className="group-hover:animate-cnc-mill">
                    <rect x="40" y="10" width="20" height="26" rx="2" fill="#8A8A8A" />
                    <rect x="38" y="32" width="24" height="5" rx="1" fill="#7A7A7A" />
                    <g className="origin-center group-hover:animate-spin" style={{ transformOrigin: '50px 52px', animationDuration: '0.4s' }}>
                      <path d="M42 37 L58 37 L55 68 C54 73, 46 73, 45 68 Z" fill="#5EEAD4" />
                      <path d="M45 42 Q 50 48, 55 42" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                      <path d="M45 50 Q 50 56, 55 50" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                      <path d="M46 58 Q 50 64, 54 58" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                    </g>
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <circle cx="42" cy="69" r="1" fill="#5EEAD4" className="group-hover:animate-chip1" />
                      <circle cx="58" cy="69" r="1" fill="#5fffd9" className="group-hover:animate-chip2" />
                      <circle cx="50" cy="71" r="0.8" fill="#5EEAD4" className="group-hover:animate-chip3" />
                    </g>
                  </g>
               </svg>
            </div>
            {/* ── Brand text (full name, 2 stacked lines, right of icon) ── */}
            <div className="flex flex-col items-start leading-none">
              <span className="text-[13px] md:text-[15px] font-black uppercase tracking-[0.22em] text-white group-hover:text-[#5EEAD4] transition-colors whitespace-nowrap">Development General</span>
              <span className="text-[11px] md:text-[13px] font-light uppercase tracking-[0.48em] text-[#5EEAD4] group-hover:text-white transition-colors mt-1 whitespace-nowrap">System Industry</span>
            </div>
          </button>
          <div className="hidden xl:flex flex-1 items-center justify-end gap-8">
            <nav className="flex items-center gap-6">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)} className="relative text-[12px] font-bold uppercase tracking-[0.15em] text-[#E0E0E0] hover:text-white transition-colors cursor-pointer group py-2 whitespace-nowrap">
                  {t.nav[item]}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#5EEAD4] transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_8px_rgba(94, 234, 212,0.5)]" />
                </button>
              ))}
            </nav>
            <a
              href="https://www.industrytools.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#5EEAD4] to-[#0bc192] text-[#050505] text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:from-white hover:to-white hover:text-black shadow-[0_0_20px_rgba(94, 234, 212,0.15)] rounded-sm shrink-0 whitespace-nowrap"
            >
              <ShoppingBag size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              <span>{t.header.shopOnline}</span>
            </a>
          </div>
          <button className="xl:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-[2px] bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="xl:hidden bg-[#080808] border-t border-[#5EEAD4]/20 px-6 py-8 flex flex-col gap-6">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item)} className="text-left text-sm font-bold uppercase tracking-[0.2em] text-[#F0EDE8] hover:text-[#5EEAD4] transition-colors">
                {t.nav[item]}
              </button>
            ))}
            {/* ── LANGUAGE SWITCHER (mobile) ── */}
            <div className="flex items-center gap-1 pt-2">
              {LANGS.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`group/lang flex items-center gap-2 px-3 py-2 text-[11px] font-black uppercase tracking-[0.15em] rounded-sm border transition-all ${lang === l ? 'bg-[#5EEAD4] text-black border-[#5EEAD4]' : 'text-[#8A8A8A] border-white/10 hover:text-white hover:border-white/30'}`}
                >
                  <span className={`block w-[18px] h-[12px] overflow-hidden rounded-[2px] transition-all ${lang === l ? 'opacity-100 ring-1 ring-black/25' : 'opacity-45 grayscale group-hover/lang:opacity-100 group-hover/lang:grayscale-0'}`}>
                    <Flag code={l.toUpperCase()} />
                  </span>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#1A1A1A]">
               <a href="https://www.industrytools.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#5EEAD4] to-[#0bc192] text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-[0_0_15px_rgba(94, 234, 212,0.15)]">
                  <ShoppingBag size={16} />
                  <span>{t.header.shopOnline}</span>
               </a>
               <button onClick={() => { setWizardOpen(true); setMenuOpen(false); }} className="flex items-center justify-center gap-3 px-6 py-3 text-[#B8B8B8] text-[11px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
                  <FileText size={15} className="text-[#5EEAD4]/60" />
                  <span>{t.header.requestQuote}</span>
               </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.webp')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-[#080808]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#5EEAD4 1px, transparent 1px), linear-gradient(90deg, #5EEAD4 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-32 right-6 text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#5EEAD4]/50 tracking-widest">PITEȘTI · ROMANIA</p>
          <p className="text-[9px] font-mono text-[#7A7A7A] tracking-widest uppercase">{t.hero.tag2}</p>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-16">
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="h-px w-12 bg-[#5EEAD4]" />
            <span className="text-[10px] font-mono text-[#5EEAD4] tracking-[0.4em] uppercase">{t.hero.badge}</span>
          </div>
          <h1 className="text-[clamp(2.6rem,7.5vw,6.5rem)] font-black uppercase leading-[0.95] tracking-tight text-white mb-8 max-w-5xl">
            <ScrambleText text={t.hero.h1a} /><br />
            <span className="text-[#5EEAD4]"><ScrambleText text={t.hero.h1b} /></span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-[#BCBCBC] font-light leading-relaxed border-l-2 border-[#5EEAD4]/40 pl-6 mb-12">
            {t.hero.lead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.industrytools.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#5EEAD4] text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(94, 234, 212,0.25)] rounded-sm"
            >
              <ShoppingBag size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              {t.header.shopOnline}
            </a>
            <button onClick={() => scrollTo('products')} className="flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-white hover:text-black transition-all rounded-sm">
              {t.hero.explore}
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] font-mono text-[#7A7A7A] tracking-widest uppercase">{t.hero.scroll}</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#5EEAD4]/40 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#0D0D0D] border-y border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
          {/* Slot 1: static "Since 2023" — no counter */}
          <div className="text-center md:px-8">
            <div className="text-3xl md:text-4xl font-black text-[#5EEAD4] mb-1">{t.stats.since}</div>
            <div className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-widest">{t.stats.romaniaBased}</div>
          </div>
          {[
            { value: 2000, suffix: '+', label: t.stats.products },
            { value: 48, suffix: 'h', label: t.stats.delivery },
            { value: 30, suffix: '+', label: t.stats.partners },
          ].map((s, i) => (
            <div key={i} className="text-center md:px-8">
              <div className="text-3xl md:text-4xl font-black text-[#5EEAD4] mb-1"><Counter end={s.value} suffix={s.suffix} /></div>
              <div className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <Section id="about" bgImage="/about-bg.webp">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="01 /" label={t.about.eyebrow} />
          {/* Header block: heading + paragraph + CTA, stacked centered/aligned */}
          <div className="max-w-4xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-8">
              <ScrambleText text={t.about.h2a} /><br /><span className="text-[#5EEAD4]"><ScrambleText text={t.about.h2b} /></span>
            </h2>
            <p className="text-[#C0C0C0] text-lg leading-relaxed mb-10">
              {t.about.lead}
            </p>
            {/* ── Prezentare de firmă — 6 limbi, flag buttons ── */}
            <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 border border-[#5EEAD4]/30 bg-[#5EEAD4]/[0.04] rounded-sm shadow-[0_0_15px_rgba(94, 234, 212,0.08)]">
              <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5EEAD4]">
                <FileText size={14} />
                {t.about.viewProfile}
              </span>
              <span className="hidden sm:block h-6 w-px bg-[#5EEAD4]/25" />
              <div className="flex flex-wrap items-center gap-2">
                {PRESENTATIONS.map((p) => (
                  p.ready ? (
                    <a
                      key={p.code}
                      href={encodeURI(p.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`DGSI company profile — ${p.code} (PDF)`}
                      aria-label={`View company profile in ${p.code}`}
                      className="group/pres flex items-center gap-2 px-3 py-2 border border-[#5EEAD4]/25 bg-[#5EEAD4]/[0.06] rounded-sm hover:bg-[#5EEAD4] hover:border-[#5EEAD4] transition-all duration-200"
                    >
                      <span className="block w-[18px] h-[12px] overflow-hidden rounded-[2px] ring-1 ring-black/30">
                        <Flag code={p.code} />
                      </span>
                      <span className="text-[10px] font-black tracking-[0.15em] text-[#5EEAD4] group-hover/pres:text-black transition-colors">{p.code}</span>
                    </a>
                  ) : (
                    <span
                      key={p.code}
                      title={`${p.code} — coming soon`}
                      aria-disabled="true"
                      className="flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/[0.02] rounded-sm opacity-40 cursor-not-allowed"
                    >
                      <span className="block w-[18px] h-[12px] overflow-hidden rounded-[2px] grayscale">
                        <Flag code={p.code} />
                      </span>
                      <span className="text-[10px] font-black tracking-[0.15em] text-[#7A7A7A]">{p.code}</span>
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
          {/* Full-width 4-column cards (CHANGE #1: bigger, sub paragraph) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {aboutCards.map((f) => (
              <div
                key={f.id}
                onClick={() => setExpandedCard(f.id)}
                className="p-8 md:p-9 bg-[#080808]/80 backdrop-blur-sm border border-[#5EEAD4]/20 hover:border-[#5EEAD4]/60 transition-all group cursor-pointer relative overflow-hidden flex flex-col min-h-[240px]"
              >
                <div className="relative z-10 transition-all duration-300 group-hover:-translate-y-1 flex-1 flex flex-col">
                  <div className="text-[#5EEAD4] mb-6 w-10 h-10">{f.icon}</div>
                  <div className="w-8 h-px bg-[#5EEAD4] mb-5 group-hover:w-14 transition-all duration-300" />
                  <h4 className="text-base md:text-lg font-black uppercase tracking-wider text-white mb-4 leading-tight">{f.title}</h4>
                  <p className="text-sm text-[#BCBCBC] leading-relaxed flex-1">{f.desc}</p>
                  <span className="mt-6 text-[10px] font-bold text-[#5EEAD4] uppercase tracking-widest flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {t.about.learnMore} <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
      <Section id="products" bgImage="/products-bg.webp">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="02 /" label={t.products.eyebrow} />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-6"><ScrambleText text={t.products.h2a} /><br /><span className="text-[#5EEAD4]"><ScrambleText text={t.products.h2b} /></span></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-16">{t.products.lead}</p>

          {/* ═══ SUB-GROUP 1: OWN MANUFACTURING · INDUSTRYTOOLS BY DGSI ═══ */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-[#5EEAD4]" />
              <span className="text-[10px] md:text-[11px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.products.ownGroup}</span>
              <div className="h-px flex-1 bg-[#5EEAD4]/20" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1 — RPW Ceramic Electrodes */}
              <div className="group relative bg-gradient-to-br from-[#0D1210] to-[#080808] border border-[#5EEAD4]/25 hover:border-[#5EEAD4]/60 rounded-xl p-8 md:p-9 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_0_40px_rgba(94, 234, 212,0.15)] hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#5EEAD4]/60" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#5EEAD4]/60" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#5EEAD4]/60" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#5EEAD4]/60" />
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Header: brand badge + icon */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="px-3 py-1.5 bg-[#5EEAD4]/15 text-[#5EEAD4] text-[10px] font-black uppercase tracking-[0.2em] rounded">{t.products.ownBadge}</span>
                    <div className="w-14 h-14 flex items-center justify-center text-[#5EEAD4]">
                      <WeldingAnimation height={56} />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-[26px] font-black uppercase tracking-tight text-white mb-2 leading-tight">{t.products.rpwTitle}</h3>
                  <div className="text-[11px] font-mono text-[#5EEAD4] tracking-[0.15em] mb-5">{t.products.rpwMeta}</div>
                  <p className="text-[#B8B8B8] text-sm leading-relaxed mb-8 flex-1">{t.products.rpwDesc}</p>
                  {/* ── Cataloage welding multilingve: 4 butoane-steag + request quote ── */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.products.weldingDownload}</span>
                      <div className="h-px flex-1 bg-[#5EEAD4]/20" />
                    </div>

                    <CatalogFlags catalogs={WELDING_CATALOGS} label="RPW Welding Catalog" />

                    <div className="flex flex-col sm:flex-row gap-3">
                      {SHOW_RPW_DATABASE && (
                        <button
                          onClick={() => setWeldingOpen(true)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#5EEAD4] text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(94, 234, 212,0.25)]"
                        >
                          <Database size={14} />
                          <span>{t.products.rpwOpen}</span>
                        </button>
                      )}
                      <a
                        href={`mailto:office@industrytools.ro?subject=${encodeURIComponent(t.rpw.mailSubject)}`}
                        className="flex-1 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#5EEAD4] hover:text-black transition-all"
                      >
                        <FileText size={14} />
                        <span>{t.products.rpwQuote}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 — Impact Sockets & Accessories */}
              <div className="group relative bg-gradient-to-br from-[#0D1210] to-[#080808] border border-[#5EEAD4]/25 hover:border-[#5EEAD4]/60 rounded-xl p-8 md:p-9 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_0_40px_rgba(94, 234, 212,0.15)] hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#5EEAD4]/60" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[#5EEAD4]/60" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#5EEAD4]/60" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#5EEAD4]/60" />
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Header: brand badge + icon */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="px-3 py-1.5 bg-[#5EEAD4]/15 text-[#5EEAD4] text-[10px] font-black uppercase tracking-[0.2em] rounded">{t.products.ownBadge}</span>
                    <div className="w-14 h-14 flex items-center justify-center text-[#5EEAD4]">
                      <Wrench size={40} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-[26px] font-black uppercase tracking-tight text-white mb-2 leading-tight">{t.products.socketsTitle}</h3>
                  <div className="text-[11px] font-mono text-[#5EEAD4] tracking-[0.15em] mb-5">{t.products.socketsMeta}</div>
                  <p className="text-[#B8B8B8] text-sm leading-relaxed mb-8 flex-1">{t.products.socketsDesc}</p>

                  {/* ── Cataloage multilingve: 4 butoane-steag + request pricing ── */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.products.socketsDownload}</span>
                      <div className="h-px flex-1 bg-[#5EEAD4]/20" />
                    </div>

                    <CatalogFlags catalogs={SOCKET_CATALOGS} label="Impact Sockets Catalog" />

                    {/* ── Broșură tipărită — rezumat întreaga gamă (EN) ── */}
                    {SOCKET_BROCHURE.ready ? (
                      <a
                        href={SOCKET_BROCHURE.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Impact Sockets — printed brochure, full range summary (EN, PDF)"
                        className="group/bro w-full mb-3 flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-[#5EEAD4]/25 rounded-sm hover:border-[#5EEAD4] hover:bg-[#5EEAD4]/[0.08] transition-all duration-200"
                      >
                        <BookOpen size={16} className="text-[#5EEAD4] shrink-0" />
                        <span className="flex-1 text-left">
                          <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-white group-hover/bro:text-[#5EEAD4] transition-colors">{t.products.socketsBrochure}</span>
                          <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8A8A] mt-0.5">{t.products.socketsBrochureMeta}</span>
                        </span>
                        <span className="block w-[20px] h-[13px] overflow-hidden rounded-[2px] ring-1 ring-black/40 shrink-0">
                          <Flag code={SOCKET_BROCHURE.code} />
                        </span>
                        <Download size={14} className="text-[#5EEAD4] shrink-0" />
                      </a>
                    ) : null}

                    <a
                      href={`mailto:office@industrytools.ro?subject=${encodeURIComponent('IndustryTools Sockets — pricing request')}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#5EEAD4] hover:text-black transition-all"
                    >
                      <Mail size={14} />
                      <span>{t.products.socketsPricing}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ═══ SUB-GROUP 2: DISTRIBUTION PARTNERS ═══ */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-[#5EEAD4]" />
            <span className="text-[10px] md:text-[11px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.products.partnerGroup}</span>
            <div className="h-px flex-1 bg-[#5EEAD4]/20" />
          </div>

          {/* ── Filter bar — BIGGER (user requested these to be larger) ── */}
          <div className="flex flex-wrap gap-3 mb-12">
            {productFilters.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setExpandedCard(null); }}
                className={`px-7 py-4 text-[14px] md:text-[15px] font-black uppercase tracking-[0.15em] rounded-sm border transition-all duration-300 ${activeFilter === f ? 'bg-[#5EEAD4] text-black border-[#5EEAD4] shadow-[0_0_20px_rgba(94, 234, 212,0.3)]' : 'bg-transparent text-[#B8B8B8] border-white/15 hover:border-[#5EEAD4]/60 hover:text-white hover:bg-white/[0.03]'}`}
              >
                {f === 'All' ? t.products.all : (t.cats[f] || f)}
              </button>
            ))}
          </div>

          {/* Product cards — clean 3-col grid, click opens fullscreen modal with details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProducts.map((prod) => (
              <div
                key={prod.cat}
                onClick={() => setExpandedCard('product-' + prod.cat)}
                className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#5EEAD4]/40 rounded-xl p-7 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#5EEAD4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10 group-hover:border-[#5EEAD4]/30 transition-all">
                    <div className="w-6 h-6 text-[#5EEAD4]">{prod.icon}</div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white flex-1">{t.cats[prod.cat] || prod.cat}</h3>
                    <ChevronRight size={16} className="text-[#5EEAD4] opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="space-y-3 flex-1 mb-7">
                    {prod.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-[#D8D8D8] transition-colors cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4] shrink-0 shadow-[0_0_6px_rgba(94, 234, 212,0.4)]" />
                        <span className="text-sm md:text-base font-bold tracking-wide">{t.subs[item] || item}</span>
                      </div>
                    ))}
                  </div>
                  {prod.catalogFile && (
                    <div className="mt-auto">
                      <a href={prod.catalogFile} target="_blank" rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className="group/btn relative flex items-center justify-center gap-3 w-full py-3.5 bg-white/5 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[11px] font-black uppercase tracking-[0.25em] rounded-sm transition-all duration-500 hover:bg-[#5EEAD4] hover:text-black hover:border-[#5EEAD4]"
                      >
                        <Download size={14} className="relative z-10" />
                        <span className="relative z-10">{t.products.catalog}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── RPW DATABASE SECTION — în pauză (SHOW_RPW_DATABASE) ── */}
      {SHOW_RPW_DATABASE && (
      <Section id="rpw" className="bg-[#0A0F0D]" bgImage="/welding-bg.webp">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="03 /" label={t.rpw.eyebrow} />
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6"><ScrambleText text={t.rpw.h2} /></h2>
          <p className="max-w-3xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-14">{t.rpw.lead}</p>
          {/* ── Hero banner: stats + welding animation ── */}
          <div className="relative p-8 md:p-14 bg-gradient-to-r from-[#5EEAD4]/10 to-transparent border border-[#5EEAD4]/30 overflow-hidden rounded-sm mb-10">
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#5EEAD4] pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#5EEAD4] pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#5EEAD4] pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#5EEAD4] pointer-events-none" />
            {/* Weld animation ambience */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25 hidden lg:block pointer-events-none">
              <WeldingAnimation height={240} />
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl">
              {t.rpw.stats.map((st, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-[#5EEAD4] mb-2">{st.v}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9A9A9A]">{st.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* ── 3 value props ── */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {t.rpw.props.map((p, i) => (
              <div key={i} className="group p-8 bg-[#0D0D0D] border border-white/5 hover:border-[#5EEAD4]/60 hover:shadow-[0_0_40px_rgba(94, 234, 212,0.15)] hover:-translate-y-0.5 transition-all duration-300 rounded-sm">
                <div className="text-[11px] font-mono text-[#5EEAD4] tracking-[0.3em] mb-4">{String(i + 1).padStart(2, '0')} /</div>
                <h3 className="text-base font-black uppercase text-white mb-3 tracking-wide">{p.title}</h3>
                <p className="text-sm text-[#9A9A9A] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          {/* ── CTAs ── */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <button
              onClick={() => setWeldingOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#5EEAD4] text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(94, 234, 212,0.25)]"
            >
              <Database size={16} />
              <span>{t.rpw.open}</span>
            </button>
            <a
              href={'mailto:office@industrytools.ro?subject=' + encodeURIComponent(t.rpw.mailSubject)}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#5EEAD4] hover:text-black transition-all duration-300 rounded-sm"
            >
              <FileText size={16} />
              <span>{t.rpw.quote}</span>
            </a>
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border border-white/10 text-[#B8B8B8] text-[11px] font-black uppercase tracking-[0.3em] hover:border-[#5EEAD4]/60 hover:text-[#5EEAD4] transition-all duration-300 rounded-sm"
            >
              <span>{t.rpw.contact}</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <p className="mt-6 text-xs font-mono text-[#7A7A7A] tracking-wide">{t.rpw.note}</p>
        </div>
      </Section>
      )}

      {/* ── SERVICES SECTION ── */}
      <Section id="services" className="bg-[#0B0B0B]" bgImage="/services-bg.webp">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code={SHOW_RPW_DATABASE ? '04 /' : '03 /'} label={t.services.eyebrow} />
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6"><ScrambleText text={t.services.h2} /></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-16">{t.services.lead}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {t.services.cards.map((s, i) => (
              <div key={i} onClick={() => setExpandedCard(s.id)} className="bg-[#0D0D0D] p-8 border border-white/5 hover:border-[#5EEAD4]/40 transition-all group cursor-pointer flex flex-col relative overflow-hidden">
                <div className="text-[#5EEAD4] mb-5 w-9 h-9">{serviceIcons[s.id]}</div>
                <h3 className="text-base md:text-lg font-black uppercase text-white mb-4">{s.title}</h3>
                <p className="text-[14px] md:text-[15px] text-[#B8B8B8] leading-relaxed mb-6 flex-1">{s.desc}</p>
                <div className="flex items-end justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-xl md:text-2xl font-black text-[#5EEAD4] leading-none">{s.metric}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mt-1.5">{s.metricLabel}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#5EEAD4] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">{t.services.more} <ChevronRight size={12} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CLIENTS ── */}
      <Section id="clients" bgImage="/clients-bg.webp">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code={SHOW_RPW_DATABASE ? '05 /' : '04 /'} label={t.clients.eyebrow} />
          <h2 className="text-5xl font-black uppercase text-white mb-6"><ScrambleText text={t.clients.h2} /></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-4">{t.clients.lead}</p>
        </div>
        <div className="-mx-6 mt-14 space-y-5">
          <LogoMarquee logos={clientLogos.slice(0, 6)} direction="left" speed={48} cardClass="w-44 h-28 md:w-52 md:h-32" />
          <LogoMarquee logos={clientLogos.slice(6)} direction="right" speed={48} cardClass="w-44 h-28 md:w-52 md:h-32" />
        </div>
      </Section>

      {/* ── PROCESS — interactive hover with detail reveal ── */}
      <Section id="process" className="bg-[#0B0B0B]" bgImage="/process-bg.webp">
        <div className="max-w-7xl mx-auto text-center">
           <Eyebrow code={SHOW_RPW_DATABASE ? '06 /' : '05 /'} label={t.process.eyebrow} />
           <h2 className="text-5xl font-black uppercase text-white mb-6"><ScrambleText text={t.process.h2} /></h2>
           <p className="max-w-2xl mx-auto text-[#C0C0C0] text-lg font-light leading-relaxed mb-20">{t.process.lead}</p>
           <div className="grid md:grid-cols-4 gap-5">
              {t.process.steps.map((step, i) => {
                const n = String(i + 1).padStart(2, '0');
                const icon = stepIcons[i];
                return (
                <div key={i} className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#5EEAD4]/50 rounded-xl p-8 transition-all duration-500 overflow-hidden cursor-default min-h-[280px] flex flex-col">
                  {/* Glow + corner accent (appear on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5EEAD4]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-0 h-px bg-[#5EEAD4] group-hover:w-full transition-all duration-700 ease-out" />
                  {/* DEFAULT state */}
                  <div className="relative z-10 flex flex-col items-center text-center transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-3">
                    <div className="text-[5rem] font-black text-white/[0.06] leading-none mb-3 group-hover:text-[#5EEAD4]/20 transition-colors">{n}</div>
                    <h4 className="text-lg font-black text-[#5EEAD4] uppercase tracking-wider mb-4">{step.t}</h4>
                    <p className="text-[#B0B0B0] text-sm">{step.d}</p>
                  </div>
                  {/* HOVER state — appears with smooth fade-in */}
                  <div className="absolute inset-0 p-6 flex flex-col opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-md bg-[#5EEAD4]/15 border border-[#5EEAD4]/30 flex items-center justify-center text-[#5EEAD4]">
                          {React.cloneElement(icon, { size: 18 })}
                        </div>
                        <span className="text-[10px] font-mono text-[#5EEAD4] tracking-[0.3em]">{t.process.step} {n}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#5EEAD4] uppercase tracking-widest">{step.time}</span>
                    </div>
                    <h4 className="text-base font-black text-white uppercase tracking-wider mb-4">{step.t}</h4>
                    <ul className="space-y-2.5 text-left flex-1">
                      {step.details.map((d, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-[13px] text-[#D8D8D8] leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{ transitionDelay: `${150 + idx * 100}ms` }}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#5EEAD4] mt-2 shrink-0 shadow-[0_0_6px_#5EEAD4]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Bottom progress bar that fills on hover */}
                    <div className="mt-5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5EEAD4] to-[#5fffd9] w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_8px_#5EEAD4]"
                        style={{ transitionDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
                );
              })}
           </div>
           <p className="text-[#B0B0B0] text-[11px] font-mono uppercase tracking-[0.3em] mt-10">{t.process.hint}</p>
        </div>
      </Section>

      {/* ── CONTACT (CHANGE #4: unified business card + active channels + live indicators) ── */}
      <Section id="contact">
        <div className="max-w-7xl mx-auto">
           <Eyebrow code={SHOW_RPW_DATABASE ? '07 /' : '06 /'} label={t.contact.eyebrow} />
           <div className="grid md:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-5xl md:text-6xl font-black uppercase text-white leading-[0.9] mb-10"><ScrambleText text={t.contact.h2a} /><br/><span className="text-[#5EEAD4]"><ScrambleText text={t.contact.h2b} /></span></h2>
                 <p className="text-[#B8B8B8] text-lg leading-relaxed mb-10">{t.contact.lead}</p>
                 {/* ── UNIFIED BUSINESS CARD ── */}
                 <div className="relative bg-gradient-to-br from-[#0D0D0D] to-[#080808] border border-[#5EEAD4]/15 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(94, 234, 212,0.05)] overflow-hidden">
                    {/* corner accents */}
                    <div className="absolute top-0 left-0 w-12 h-px bg-[#5EEAD4]" />
                    <div className="absolute top-0 left-0 w-px h-12 bg-[#5EEAD4]" />
                    <div className="absolute bottom-0 right-0 w-12 h-px bg-[#5EEAD4]" />
                    <div className="absolute bottom-0 right-0 w-px h-12 bg-[#5EEAD4]" />
                    {/* Header: REACH OUT */}
                    <div className="flex items-center gap-4 mb-8">
                       <span className="text-[10px] font-mono text-[#5EEAD4] tracking-[0.4em] uppercase">{t.contact.reachOut}</span>
                       <div className="h-px flex-1 bg-[#5EEAD4]/20" />
                    </div>
                    {/* Passive info rows */}
                    <div className="space-y-7 mb-10">
                       <a href="mailto:office@industrytools.ro" className="flex items-start gap-5 group">
                          <Mail className="text-[#5EEAD4] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">{t.contact.email}</p>
                             <p className="text-base md:text-lg font-bold text-white group-hover:text-[#5EEAD4] transition-colors truncate">office@industrytools.ro</p>
                          </div>
                       </a>
                       <a href="tel:+40770852576" className="flex items-start gap-5 group">
                          <Phone className="text-[#5EEAD4] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">{t.contact.phone}</p>
                             <p className="text-base md:text-lg font-bold text-white group-hover:text-[#5EEAD4] transition-colors">+40 770 852 576</p>
                          </div>
                       </a>
                       <div className="flex items-start gap-5">
                          <MapPin className="text-[#5EEAD4] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">{t.contact.office}</p>
                             <p className="text-base md:text-lg font-bold text-white">Pitești, Romania</p>
                          </div>
                       </div>
                    </div>
                    {/* Divider with label */}
                    <div className="flex items-center gap-4 mb-7">
                       <div className="h-px flex-1 bg-white/5" />
                       <span className="text-[9px] font-mono text-[#8A8A8A] tracking-[0.4em] uppercase">{t.contact.activeChannels}</span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    {/* Active channels buttons with live indicators */}
                    <div className="grid grid-cols-3 gap-3">
                       {/* WhatsApp - live */}
                       <a
                         href="https://wa.me/40770852576"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-all group"
                       >
                          <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                             <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
                             <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
                          </span>
                          <MessageCircle size={26} className="text-[#25D366]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D0D0D0] group-hover:text-white transition-colors">WhatsApp</span>
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#25D366] transition-colors">{t.contact.replies}</span>
                       </a>
                       {/* Teams - live */}
                       <a
                         href="https://teams.microsoft.com/l/chat/0/0?users=alex.cojocaru@industrytools.ro"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-[#5B5FC7]/10 hover:border-[#5B5FC7]/40 transition-all group"
                       >
                          <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                             <span className="absolute inline-flex h-full w-full rounded-full bg-[#5B5FC7] opacity-75 animate-ping" />
                             <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5B5FC7]" />
                          </span>
                          <TeamsIcon size={26} className="text-[#5B5FC7]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D0D0D0] group-hover:text-white transition-colors">Teams</span>
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#5B5FC7] transition-colors">{t.contact.replies}</span>
                       </a>
                       {/* LinkedIn - presence */}
                       <a
                         href="https://www.linkedin.com/company/development-general-system-industry-srl/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex flex-col items-center justify-center gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-xl hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/40 transition-all group"
                       >
                          <LinkedInIcon size={24} className="text-[#0A66C2]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#D0D0D0] group-hover:text-white transition-colors mt-0.5">LinkedIn</span>
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#0A66C2] transition-colors">{t.contact.follow}</span>
                       </a>
                    </div>
                 </div>
              </div>
              <div className="bg-[#0D0D0D] p-10 border border-white/5 rounded-sm">
                 <ContactForm t={t} />
              </div>
           </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-[#050505] border-t border-white/5">
        {/* ── Certifications strip — PNG pe fundal negru, fără borduri vizibile ── */}
        <div className="bg-black py-14 px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            <div className="flex items-center gap-6 w-full">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#5EEAD4]/30" />
              <span className="text-[14px] md:text-[17px] font-mono font-bold text-[#5EEAD4] tracking-[0.35em] uppercase shrink-0 text-center">{t.footer.certifications}</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#5EEAD4]/30" />
            </div>
            <div className="w-full flex flex-wrap items-start justify-center gap-x-10 md:gap-x-16 gap-y-10">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.name} className="group/cert flex flex-col items-center gap-3.5" title={cert.title}>
                  <img
                    src={`${CERT_DIR}/${cert.file}.png`}
                    alt={cert.name}
                    loading="lazy"
                    className="block w-[118px] h-[118px] md:w-[140px] md:h-[140px] object-contain bg-black transition-all duration-300 group-hover/cert:scale-105 group-hover/cert:drop-shadow-[0_0_22px_rgba(94,234,212,0.35)]"
                  />
                  <span className="text-[10px] md:text-[11px] font-mono text-[#8A8A8A] tracking-[0.18em] uppercase group-hover/cert:text-[#5EEAD4] transition-colors">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── Footer bottom bar ── */}
        <div className="py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="text-[10px] font-mono text-[#6A6A6A] tracking-[0.3em] uppercase">{t.footer.copyright}</div>
            <nav className="flex flex-wrap justify-center gap-8">
              {navItems.map(item => (<button key={item} onClick={() => scrollTo(item)} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A7A] hover:text-[#5EEAD4] transition-colors">{t.nav[item]}</button>))}
            </nav>
          </div>
        </div>
      </footer>

      {/* ── FLOATING ACTIONS ── */}
      <a
        href="https://wa.me/40770852576"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[55] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      >
        <MessageCircle size={26} />
      </a>
      <a
        href="https://www.linkedin.com/company/development-general-system-industry-srl/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="DGSI on LinkedIn"
        className="fixed bottom-24 left-6 z-[55] w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(10,102,194,0.4)] hover:scale-110 transition-transform"
      >
        <LinkedInIcon size={22} />
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-6 z-[55] w-12 h-12 rounded-full bg-[#5EEAD4] text-black flex items-center justify-center shadow-[0_4px_20px_rgba(94, 234, 212,0.3)] hover:scale-110 transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp size={22} />
      </button>

      {/* MODAL SYSTEM */}
      {expandedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setExpandedCard(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-[85vw] md:max-w-[75vw] h-[85vh] md:h-[75vh] bg-[#0A0A0A] border border-[#5EEAD4]/50 shadow-[0_0_60px_rgba(94, 234, 212,0.2)] rounded-md overflow-y-auto p-12 animate-modal-slide" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpandedCard(null)} className="absolute top-6 right-6 text-[#8A8A8A] hover:text-white transition-colors bg-[#111] p-3 rounded-full z-50"><X size={28} /></button>
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
               <span className="text-xs text-[#5EEAD4] font-mono tracking-[0.4em] uppercase">{t.modal.scope}</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>
            {expandedCard === 'distributor' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight text-center md:text-left">{t.modal.distributor.h3[0]}<br/>{t.modal.distributor.h3[1]}</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">{t.modal.distributor.p}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {supplierLogos.map((logo, idx) => (
                        <LogoCard key={idx} logo={logo} className="h-24 md:h-28" />
                    ))}
                </div>
              </div>
            )}
            {expandedCard === 'manufacturing' && (
              <div className="animate-fade-in text-center">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">{t.modal.manufacturing.h3[0]}<br/>{t.modal.manufacturing.h3[1]}</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed mx-auto">{t.modal.manufacturing.p}</p>
                <div className="bg-[#080808] border border-white/5 rounded-xl p-16 flex items-center justify-center shadow-inner mt-8"><EmergencyTimeline expanded /></div>
              </div>
            )}
            {expandedCard === 'audit' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">{t.modal.audit.h3[0]}<br/>{t.modal.audit.h3[1]}</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">{t.modal.audit.p}</p>
                <div className="grid md:grid-cols-2 gap-8">
                    {t.modal.audit.items.map((item, i) => (
                        <div key={i} className="bg-[#080808] border border-white/5 p-8 rounded-lg flex items-start gap-8">
                            <div className="w-16 h-16 text-[#5EEAD4] flex-shrink-0">{auditIcons[i]}</div>
                            <div><h5 className="text-2xl font-bold text-white mb-4">{item.title}</h5><p className="text-xl text-[#B0B0B0] leading-relaxed">{item.desc}</p></div>
                        </div>
                    ))}
                </div>
              </div>
            )}
            {/* CHANGE #2: Tooling modal — V2 text, no 50% */}
            {expandedCard === 'tooling' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">{t.modal.tooling.h3[0]}<br/>{t.modal.tooling.h3[1]}</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">{t.modal.tooling.p}</p>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-lg flex-1">
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5"><Wrench className="text-[#5EEAD4] w-8 h-8" /><h5 className="text-3xl font-bold text-white">{t.modal.tooling.box1Title}</h5></div>
                        <ul className="text-xl text-[#B0B0B0] space-y-6 list-disc list-inside">
                            {t.modal.tooling.box1.map((li, i) => <li key={i}>{li}</li>)}
                        </ul>
                    </div>
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-lg flex-1">
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5"><ShieldCheck className="text-[#5EEAD4] w-8 h-8" /><h5 className="text-3xl font-bold text-white">{t.modal.tooling.box2Title}</h5></div>
                        <ul className="text-xl text-[#B0B0B0] space-y-6 list-disc list-inside">
                            {t.modal.tooling.box2.map((li, i) => <li key={i}>{li}</li>)}
                        </ul>
                    </div>
                </div>
              </div>
            )}
            {/* ── PRODUCT CATEGORY MODALS ── */}
            {expandedCard?.startsWith('product-') && (() => {
              const catName = expandedCard.replace('product-', '');
              const prod = productCategories.find(p => p.cat === catName);
              if (!prod) return null;
              return (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-12 h-12 text-[#5EEAD4]">{prod.icon}</div>
                    <h3 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">{t.cats[prod.cat] || prod.cat}</h3>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* LEFT — subcategories with animated icons */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.modal.subcategories}</span>
                        <div className="h-px flex-1 bg-[#5EEAD4]/20" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {prod.items.map((item) => (
                          <div
                            key={item}
                            className="group/sub flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#5EEAD4]/30 hover:bg-[#5EEAD4]/[0.04] transition-all duration-300"
                          >
                            <span className="w-14 h-14 flex items-center justify-center bg-[#5EEAD4]/10 border border-[#5EEAD4]/25 rounded-xl text-[#5EEAD4] shrink-0 group-hover/sub:bg-[#5EEAD4]/20 transition-all">
                              <SubcategoryIcon name={item} size={28} />
                            </span>
                            <span className="flex-1 text-lg md:text-xl font-bold tracking-wide text-[#D8D8D8] group-hover/sub:text-white transition-colors">{t.subs[item] || item}</span>
                            <AddToRFQButton item={{ id: `${prod.cat}-${item}`, name: item, category: prod.cat }} size="sm" />
                          </div>
                        ))}
                      </div>
                      {prod.catalogFile && (
                        <a href={prod.catalogFile} target="_blank" rel="noopener noreferrer"
                           className="mt-8 flex items-center justify-center gap-3 w-full max-w-md py-5 bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[12px] font-black uppercase tracking-[0.25em] rounded-sm transition-all duration-500 hover:bg-[#5EEAD4] hover:text-black"
                        >
                          <Download size={16} />
                          <span>{t.modal.downloadCatalog}</span>
                        </a>
                      )}
                    </div>
                    {/* RIGHT — partner brands */}
                    {prod.brands && prod.brands.length > 0 && (
                      <div className="lg:w-80 shrink-0 lg:border-l lg:border-white/10 lg:pl-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-[11px] font-mono text-[#5EEAD4] tracking-[0.3em] uppercase">{t.modal.partnerBrands}</span>
                          <div className="h-px flex-1 bg-[#5EEAD4]/20" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {prod.brands.map((brand) => (
                            <div
                              key={brand.name}
                              className={`flex items-center justify-center rounded-xl p-2 h-16 overflow-hidden transition-all hover:scale-105 ${brand.src ? 'bg-white shadow-sm' : 'bg-white/[0.04] border border-[#5EEAD4]/15'}`}
                              title={brand.name}
                            >
                              {brand.src ? (
                                // Tile is h-16 (64px) with p-2 (8px each side) → 48px inner height.
                                // max-h-full + object-contain lets the logo occupy the full 48px = 75% of the tile,
                                // hitting Alex's 70–80% brief. overflow-hidden clips any scale bleed.
                                <img
                                  src={brand.src}
                                  alt={brand.name}
                                  loading="lazy"
                                  className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
                                  style={{ transform: `scale(${Math.min(brand.scale || 1, 1.4)})` }}
                                />
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-[#C0C0C0] text-center leading-tight">{brand.name}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── WELDING MODAL — configurator RPW CONSUMABILE (41 piese + 3D) ── */}
      {SHOW_RPW_DATABASE && weldingOpen && <WeldingModal onClose={() => setWeldingOpen(false)} />}

      {/* ── RFQ SYSTEM — floating badge + wizard ── */}
      <RFQFloatingBadge />
      <RFQWizard />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Wrap the whole app in the RFQ provider so cart state is available everywhere
export default function App() {
  return (
    <RFQProvider>
      <AppInner />
    </RFQProvider>
  );
}