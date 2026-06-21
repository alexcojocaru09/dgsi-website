import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, FileText, Zap, Wrench, Phone, Monitor, Settings, Truck, X, Target, CheckCircle, Droplets, Ruler, ShieldCheck, Download, ChevronRight, Mail, MapPin, MessageCircle, ArrowUp, Package } from 'lucide-react';
import SubcategoryIcon from './components/SubcategoryIcons';
import WeldingModal, { WeldingAnimation } from './components/WeldingModal';

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

// ─── Constants: Supplier Logos (Local SVG/PNG Files) ──────────────────────
const supplierLogos = [
  { name: 'Beta', src: '/logos/beta.png', color: '#F25322', scale: 3 },
  { name: 'Bosch', src: '/logos/bosch.svg', color: '#EA0016' },
  { name: 'Facom', src: '/logos/facom.svg', color: '#E3000F' },
  { name: 'Honeywell', src: '/logos/honeywell.svg', color: '#FF1B2D' },
  { name: 'Milwaukee', src: '/logos/milwaukee.svg', color: '#D01B22', scale: 1.3 },
  { name: 'Tyrolit', src: '/logos/tyrolit.svg', color: '#004A99' },
  { name: 'Unior', src: '/logos/unior.png', color: '#005EAA', scale: 1.8 },
  { name: 'Siemens', src: '/logos/siemens.svg', color: '#009999' },
  { name: 'Schneider Electric', src: '/logos/Schneider.png', color: '#3DCD58', scale: 1 },
  { name: 'Festo', src: '/logos/festo.png', color: '#0090D4', scale: 1 },
  { name: 'Sick', src: '/logos/sick.png', color: '#00509E', scale: 1 },
  { name: 'Legrand', src: '/logos/legrand.png', color: '#E2001A', scale: 1 },
  { name: 'SMC', src: '/logos/smc.png', color: '#005EAA', scale: 1 },
  { name: 'Balluff', src: '/logos/balluff.png', color: '#000000', scale: 1 }
];

// ─── Constants: Client Logos (Local Files) ──────────────────────
const clientLogos = [
  { name: 'Dacia', src: '/logos/dacia.png', scale: 1 },
  { name: 'Kirchhoff', src: '/logos/kirchhoff.png', scale: 1 },
  { name: 'Martur Fompak', src: '/logos/martur.png', scale: 1 },
  { name: 'Farplas', src: '/logos/farplas.png', scale: 1 },
  { name: 'Kärcher', src: '/logos/kaercher.svg', scale: 1 },
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
      { name: 'Kyocera' },
      { name: 'Komet' },
      { name: 'Re-Bo' },
      { name: 'WTE' },
      { name: 'Fahrion' },
      { name: 'EWS' },
      { name: 'Tyrolit', src: '/logos/tyrolit.svg' },
      { name: 'Pferd' },
      { name: 'Lukas' },
      { name: 'Zeus' },
      { name: 'Ecoroll' }
    ]
  },
  {
    cat: 'Toolholding',
    icon: <Wrench />,
    items: ['Toolholders', 'Collet Chucks', 'Lathe Chucks', 'Machine Vises', 'Rigid Clamping'],
    catalogFile: '/clamping-catalog.pdf',
    brands: [
      { name: 'Schunk' },
      { name: 'Röhm' },
      { name: 'Allmatic' },
      { name: 'AMF' },
      { name: 'Hainbuch' },
      { name: 'Bessey' },
      { name: 'Brockhaus Heuer' }
    ]
  },
  {
    cat: 'Measurement',
    icon: <Ruler />,
    items: ['Micrometers', 'Dial Indicators', 'Feeler Gauges', 'Calipers', 'Smart Sensors'],
    catalogFile: '/measuring-catalog.pdf',
    brands: [
      { name: 'Mitutoyo' },
      { name: 'Mahr' },
      { name: 'Zeiss' },
      { name: 'Tesa' },
      { name: 'Leica' },
      { name: 'Fluke' },
      { name: 'Stahlwille' },
      { name: 'Honeywell', src: '/logos/honeywell.svg' },
      { name: 'Siemens', src: '/logos/siemens.svg' },
      { name: 'Festo', src: '/logos/festo.png' },
      { name: 'SICK', src: '/logos/sick.png' },
      { name: 'SMC', src: '/logos/smc.png' },
      { name: 'Balluff', src: '/logos/balluff.png' },
      { name: 'Schneider Electric', src: '/logos/Schneider.png' },
      { name: 'Legrand', src: '/logos/legrand.png' }
    ]
  },
  {
    cat: 'Abrasives & Sawing',
    icon: <Zap />,
    items: ['Abrasive Discs', 'Wire Brushes', 'Saw Blades', 'Precision Files', 'Spare Parts'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: 'Tyrolit', src: '/logos/tyrolit.svg' },
      { name: 'Pferd' },
      { name: 'Lessmann' },
      { name: 'VSM' },
      { name: 'Lukas' }
    ]
  },
  {
    cat: 'Hand Tools',
    icon: <Wrench />,
    items: ['Fastening & Assembly', 'Torque Tools', 'Impact Tools', 'Cutting Tools', 'Tool Sets'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: 'Bosch', src: '/logos/bosch.svg' },
      { name: 'Milwaukee', src: '/logos/milwaukee.svg', scale: 1.3 },
      { name: 'Facom', src: '/logos/facom.svg' },
      { name: 'Beta', src: '/logos/beta.png', scale: 3 },
      { name: 'Unior', src: '/logos/unior.png', scale: 1.8 },
      { name: 'Knipex' },
      { name: 'Wera' },
      { name: 'Wiha' },
      { name: 'Gedore' },
      { name: 'Hazet' },
      { name: 'Stahlwille' },
      { name: 'Bahco' },
      { name: 'Atlas Copco' },
      { name: '3M' },
      { name: 'Loctite' },
      { name: 'Kärcher', src: '/logos/kaercher.svg' }
    ]
  },
  {
    cat: 'Protective Equipment',
    icon: <ShieldCheck />,
    items: ['Hand Protection', 'Head Protection', 'Workwear & Footwear', 'Fall Protection', 'First Aid'],
    catalogFile: '/tools-catalog.pdf',
    brands: [
      { name: 'Uvex' },
      { name: 'Ansell' },
      { name: 'Honeywell', src: '/logos/honeywell.svg' },
      { name: 'Dräger' },
      { name: 'DuPont' },
      { name: 'Helly Hansen' },
      { name: 'Mascot' },
      { name: 'Blåkläder' },
      { name: 'Haix' },
      { name: 'Schuberth' },
      { name: 'Skylotec' },
      { name: 'Elten' }
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
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1de9b6]/20 z-10" />
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
      <div className="h-px flex-1 max-w-[40px] bg-[#1de9b6]/40" />
      <span className="text-[10px] text-[#1de9b6] font-mono tracking-[0.3em] uppercase">{label}</span>
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
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(29,233,182,0.06), transparent 70%)`,
      }}
    />
  );
}

// ─── Premium Logo Card (reusable for suppliers & clients) ──────────────────
function LogoCard({ logo, className = '' }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`group/logo shrink-0 flex items-center justify-center bg-white rounded-xl border border-black/[0.06] p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_12px_40px_-12px_rgba(29,233,182,0.4)] hover:border-[#1de9b6]/30 ${className}`}
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
      <div className={`absolute left-0 bg-[#1de9b6] z-0 animate-progress-flow ${expanded ? 'top-10 h-px shadow-[0_0_15px_#1de9b6]' : 'top-3.5 h-[1px] shadow-[0_0_8px_#1de9b6]'}`} style={{ animationDelay: '0.5s' }} />
      {steps.map((step, idx) => (
        <div key={idx} className="relative z-10 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: `${500 + idx * 300}ms` }}>
          <div className={`${expanded ? 'w-20 h-20 border-[3px]' : 'w-7 h-7 border'} rounded-full bg-[#080808] border-[#1de9b6] text-[#1de9b6] flex items-center justify-center shadow-[0_0_15px_rgba(29,233,182,0.3)]`}>{step.icon}</div>
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
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [weldingOpen, setWeldingOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = (expandedCard || weldingOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [expandedCard, weldingOpen]);

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

  // About cards data (extracted to render cleanly under paragraph)
  const aboutCards = [
    { id: 'distributor', title: 'Authorized Distributor', desc: 'Official partner for 120+ global brands without MOQ constraints.', icon: <Package /> },
    { id: 'manufacturing', title: 'Emergency Manufacturing', desc: '48–72h custom CNC parts, electrodes, and assemblies.', icon: <Zap /> },
    { id: 'audit', title: 'Technical Audit', desc: 'Production line analysis and cost optimization consulting.', icon: <Target /> },
    { id: 'tooling', title: 'Tooling Customization', desc: 'Precision-engineered solutions based on your technical specs.', icon: <Wrench /> },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F0EDE8] font-sans selection:bg-[#1de9b6] selection:text-black overflow-x-hidden">

      {/* ── CURSOR SPOTLIGHT — radial glow following mouse ── */}
      <CursorSpotlight />

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
        <div className="h-full bg-gradient-to-r from-[#1de9b6] to-[#5fffd9] shadow-[0_0_10px_rgba(29,233,182,0.6)] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080808]/98 backdrop-blur-md shadow-[0_1px_0_rgba(29,233,182,0.15)] py-3' : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/50 to-transparent py-6'}`}>
        <div className="max-w-[98%] 2xl:max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-3 group cursor-pointer text-center shrink-0">
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
               {/* ── CNC MILLING LOGO ── Static: drill bit | Hover: CNC milling on X/Y axes */}
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <rect x="14" y="74" width="72" height="12" rx="1.5" fill="#2A2A2A" stroke="#6A6A6A" strokeWidth="0.5" />
                  <rect x="14" y="74" width="72" height="3" rx="1.5" fill="#1de9b6" opacity="0.25" />
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <line x1="8" y1="80" x2="90" y2="80" stroke="#1de9b6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                    <text x="92" y="83" fill="#1de9b6" fontSize="8" fontWeight="bold" opacity="0.7">X</text>
                    <line x1="50" y1="6" x2="50" y2="86" stroke="#1de9b6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                    <text x="53" y="10" fill="#1de9b6" fontSize="8" fontWeight="bold" opacity="0.7">Y</text>
                  </g>
                  <g className="group-hover:animate-cnc-mill">
                    <rect x="40" y="10" width="20" height="26" rx="2" fill="#8A8A8A" />
                    <rect x="38" y="32" width="24" height="5" rx="1" fill="#7A7A7A" />
                    <g className="origin-center group-hover:animate-spin" style={{ transformOrigin: '50px 52px', animationDuration: '0.4s' }}>
                      <path d="M42 37 L58 37 L55 68 C54 73, 46 73, 45 68 Z" fill="#1de9b6" />
                      <path d="M45 42 Q 50 48, 55 42" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                      <path d="M45 50 Q 50 56, 55 50" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                      <path d="M46 58 Q 50 64, 54 58" stroke="#050505" strokeWidth="1.2" fill="none" opacity="0.5" />
                    </g>
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <circle cx="42" cy="69" r="1" fill="#1de9b6" className="group-hover:animate-chip1" />
                      <circle cx="58" cy="69" r="1" fill="#5fffd9" className="group-hover:animate-chip2" />
                      <circle cx="50" cy="71" r="0.8" fill="#1de9b6" className="group-hover:animate-chip3" />
                    </g>
                  </g>
               </svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.25em] leading-none text-white group-hover:text-[#1de9b6] transition-colors">Development General</span>
              <span className="text-[12px] md:text-[14px] font-light uppercase tracking-[0.52em] leading-tight text-[#1de9b6] group-hover:text-white transition-colors mt-1">System Industry</span>
            </div>
          </button>
          <div className="hidden lg:flex flex-1 items-center justify-end gap-10">
            <nav className="flex items-center gap-7">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)} className="relative text-[13px] font-bold uppercase tracking-[0.2em] text-[#E0E0E0] hover:text-white transition-colors cursor-pointer group py-2">
                  {item}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#1de9b6] transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_8px_rgba(29,233,182,0.5)]" />
                </button>
              ))}
            </nav>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button onClick={() => scrollTo('contact')} className="group flex items-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-[#1de9b6] hover:text-white border border-[#1de9b6]/30 hover:border-[#1de9b6] hover:bg-[#1de9b6]/10 transition-all duration-300 rounded-sm">
                <FileText size={13} className="transition-transform group-hover:rotate-12" />
                <span>Request Quote</span>
              </button>
              <a
                href="https://www.industrytools.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#1de9b6] to-[#0bc192] text-[#050505] text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:from-white hover:to-white hover:text-black shadow-[0_0_20px_rgba(29,233,182,0.15)] rounded-sm"
              >
                <ShoppingBag size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>Shop Online</span>
              </a>
            </div>
          </div>
          <button className="lg:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-[2px] bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-[#080808] border-t border-[#1de9b6]/20 px-6 py-8 flex flex-col gap-6">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item)} className="text-left text-sm font-bold uppercase tracking-[0.2em] text-[#F0EDE8] hover:text-[#1de9b6] transition-colors">
                {item}
              </button>
            ))}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#1A1A1A]">
               <a href="https://www.industrytools.ro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1de9b6] to-[#0bc192] text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-[0_0_15px_rgba(29,233,182,0.15)]">
                  <ShoppingBag size={16} />
                  <span>Shop Online</span>
               </a>
               <button onClick={() => scrollTo('contact')} className="flex items-center justify-center gap-3 px-6 py-3 text-[#B8B8B8] text-[11px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
                  <FileText size={15} className="text-[#1de9b6]/60" />
                  <span>Request Quote</span>
               </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-[#080808]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#1de9b6 1px, transparent 1px), linear-gradient(90deg, #1de9b6 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-32 right-6 text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#1de9b6]/50 tracking-widest">PITEȘTI · ROMANIA</p>
          <p className="text-[9px] font-mono text-[#7A7A7A] tracking-widest uppercase">Precision Engineering &amp; Global Sourcing</p>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-16">
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="h-px w-12 bg-[#1de9b6]" />
            <span className="text-[10px] font-mono text-[#1de9b6] tracking-[0.4em] uppercase">Industrial Partner · Since 2023</span>
          </div>
          <h1 className="text-[clamp(2.6rem,7.5vw,6.5rem)] font-black uppercase leading-[0.95] tracking-tight text-white mb-8 max-w-5xl">
            <ScrambleText text="Precision in Every Part." /><br />
            <span className="text-[#1de9b6]"><ScrambleText text="Speed in Every Order." /></span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-[#BCBCBC] font-light leading-relaxed border-l-2 border-[#1de9b6]/40 pl-6 mb-12">
            Your strategic partner for premium multi-brand integration, emergency custom manufacturing, and guaranteed price stability — engineered for Tier-1 automotive and manufacturing leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.industrytools.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(29,233,182,0.25)] rounded-sm"
            >
              <ShoppingBag size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Shop Online
            </a>
            <button onClick={() => scrollTo('products')} className="flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.15em] text-xs hover:bg-white hover:text-black transition-all rounded-sm">
              Explore Portfolio
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] font-mono text-[#7A7A7A] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#1de9b6]/40 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#0D0D0D] border-y border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
          {/* Slot 1: static "Since 2023" — no counter */}
          <div className="text-center md:px-8">
            <div className="text-3xl md:text-4xl font-black text-[#1de9b6] mb-1">Since 2023</div>
            <div className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-widest">Romania-Based</div>
          </div>
          {[
            { value: 2000, suffix: '+', label: 'Products Available' },
            { value: 48, suffix: 'h', label: 'Emergency Delivery' },
            { value: 30, suffix: '+', label: 'Tier-1 Partners' },
          ].map((s, i) => (
            <div key={i} className="text-center md:px-8">
              <div className="text-3xl md:text-4xl font-black text-[#1de9b6] mb-1"><Counter end={s.value} suffix={s.suffix} /></div>
              <div className="text-[10px] text-[#8A8A8A] font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <Section id="about" bgImage="/about-bg.png">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="01 /" label="About DGSI" />

          {/* Header block: heading + paragraph + CTA, stacked centered/aligned */}
          <div className="max-w-4xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-8">
              <ScrambleText text="Industrial Precision" /><br /><span className="text-[#1de9b6]"><ScrambleText text="Meets Speed." /></span>
            </h2>
            <p className="text-[#C0C0C0] text-lg leading-relaxed mb-10">
              DGSI is an authorized distributor and custom manufacturing partner for companies that need precision, reliability, and response speed. We consolidate multi-brand sourcing, engineer rapid solutions, and deliver on impossible deadlines.
            </p>
            <a
              href="/DGSI-pres-EN.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#1de9b6]/50 text-[#1de9b6] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1de9b6] hover:text-black hover:border-[#1de9b6] transition-all duration-300 rounded-sm group shadow-[0_0_15px_rgba(29,233,182,0.1)]"
            >
              <FileText size={14} className="group-hover:rotate-12 transition-transform" />
              <span>View Company Profile</span>
            </a>
          </div>

          {/* Full-width 4-column cards (CHANGE #1: bigger, sub paragraph) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {aboutCards.map((f) => (
              <div
                key={f.id}
                onClick={() => setExpandedCard(f.id)}
                className="p-8 md:p-9 bg-[#080808]/80 backdrop-blur-sm border border-[#1de9b6]/20 hover:border-[#1de9b6]/60 transition-all group cursor-pointer relative overflow-hidden flex flex-col min-h-[240px]"
              >
                <div className="relative z-10 transition-all duration-300 group-hover:-translate-y-1 flex-1 flex flex-col">
                  <div className="text-[#1de9b6] mb-6 w-10 h-10">{f.icon}</div>
                  <div className="w-8 h-px bg-[#1de9b6] mb-5 group-hover:w-14 transition-all duration-300" />
                  <h4 className="text-base md:text-lg font-black uppercase tracking-wider text-white mb-4 leading-tight">{f.title}</h4>
                  <p className="text-sm text-[#BCBCBC] leading-relaxed flex-1">{f.desc}</p>
                  <span className="mt-6 text-[10px] font-bold text-[#1de9b6] uppercase tracking-widest flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
      <Section id="products" bgImage="/products-bg.png">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="02 /" label="Product Portfolio" />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-6"><ScrambleText text="Complete Industrial" /><br /><span className="text-[#1de9b6]"><ScrambleText text="Ecosystem." /></span></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-10">End-to-end coverage from machining to protective equipment — a single source for your entire production floor. Filter by category to explore our range.</p>

          {/* ── Filter bar — BIGGER (user requested these to be larger) ── */}
          <div className="flex flex-wrap gap-3 mb-12">
            {productFilters.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setExpandedCard(null); }}
                className={`px-7 py-4 text-[14px] md:text-[15px] font-black uppercase tracking-[0.15em] rounded-sm border transition-all duration-300 ${activeFilter === f ? 'bg-[#1de9b6] text-black border-[#1de9b6] shadow-[0_0_20px_rgba(29,233,182,0.3)]' : 'bg-transparent text-[#B8B8B8] border-white/15 hover:border-[#1de9b6]/60 hover:text-white hover:bg-white/[0.03]'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Product cards — clean 3-col grid, click opens fullscreen modal with details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProducts.map((prod) => (
              <div
                key={prod.cat}
                onClick={() => setExpandedCard('product-' + prod.cat)}
                className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#1de9b6]/40 rounded-xl p-7 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10 group-hover:border-[#1de9b6]/30 transition-all">
                    <div className="w-6 h-6 text-[#1de9b6]">{prod.icon}</div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white flex-1">{prod.cat}</h3>
                    <ChevronRight size={16} className="text-[#1de9b6] opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="space-y-3 flex-1 mb-7">
                    {prod.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-[#D8D8D8] transition-colors cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1de9b6] shrink-0 shadow-[0_0_6px_rgba(29,233,182,0.4)]" />
                        <span className="text-sm md:text-base font-bold tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                  {prod.catalogFile && (
                    <div className="mt-auto">
                      <a href={prod.catalogFile} target="_blank" rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}
                         className="group/btn relative flex items-center justify-center gap-3 w-full py-3.5 bg-white/5 border border-[#1de9b6]/30 text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.25em] rounded-sm transition-all duration-500 hover:bg-[#1de9b6] hover:text-black hover:border-[#1de9b6]"
                      >
                        <Download size={14} className="relative z-10" />
                        <span className="relative z-10">Catalog</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Welding teaser — opens flagship welding modal ── */}
          <div
            onClick={() => setWeldingOpen(true)}
            className="group mt-12 relative p-8 md:p-14 bg-gradient-to-r from-[#1de9b6]/10 to-transparent border border-[#1de9b6]/30 hover:border-[#1de9b6]/60 overflow-hidden rounded-sm cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_rgba(29,233,182,0.1)]"
          >
            {/* Animated weld spark glow on hover */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 group-hover:opacity-40 transition-opacity duration-500 hidden lg:block pointer-events-none">
              <WeldingAnimation height={240} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block px-3 py-1 bg-[#1de9b6]/20 text-[#1de9b6] text-[10px] font-black uppercase tracking-widest rounded">Flagship Expertise</span>
                  <Zap className="text-[#1de9b6] w-5 h-5" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-5">Projection Welding Electrodes</h3>
                <p className="text-[#B8B8B8] text-lg leading-relaxed">Specialized engineering for resistance and projection welding lines. Precision-manufactured electrodes for automotive Tier-1 production.</p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center justify-center gap-4 px-10 py-5 bg-transparent border-2 border-[#1de9b6] text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.3em] group-hover:bg-[#1de9b6] group-hover:text-black transition-all duration-500 rounded-sm shadow-[0_0_20px_rgba(29,233,182,0.15)]">
                  <Zap size={18} />
                  <span>Explore System</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SERVICES SECTION ── */}
      <Section id="services" className="bg-[#0B0B0B]" bgImage="/services-bg.png">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="03 /" label="Expert Services" />
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6"><ScrambleText text="What We Deliver." /></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-16">Beyond supply — we engineer outcomes. Measurable savings, reduced downtime, and operational predictability for your production lines.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'distributor', title: 'Industrial Supply', desc: 'Authorized distributor for 120+ global brands. Consolidation, no MOQ, price locks.', icon: <Package />, metric: '120+', metricLabel: 'Brands' },
              { id: 'manufacturing', title: 'Emergency Manufacturing', desc: '48–72h CNC machining for critical production line components.', icon: <Zap />, metric: '48h', metricLabel: 'Lead Time' },
              { id: 'audit', title: 'Process Audit', desc: 'Analysis of speeds, feeds, and tool wear to reduce cycle time and cost-per-part.', icon: <Target />, metric: '↓ Costs', metricLabel: 'Optimization' },
              // CHANGE #5: metric -50% → "Cost-Saving" (no exaggerated number)
              { id: 'tooling', title: 'Tool Regrinding', desc: 'Professional reconditioning brings expensive tools back to original performance.', icon: <Settings />, metric: 'Cost-Saving', metricLabel: 'vs New Tools' },
            ].map((s, i) => (
              <div key={i} onClick={() => setExpandedCard(s.id)} className="bg-[#0D0D0D] p-8 border border-white/5 hover:border-[#1de9b6]/40 transition-all group cursor-pointer flex flex-col relative overflow-hidden">
                <div className="text-[#1de9b6] mb-5 w-9 h-9">{s.icon}</div>
                <h3 className="text-base md:text-lg font-black uppercase text-white mb-4">{s.title}</h3>
                <p className="text-[14px] md:text-[15px] text-[#B8B8B8] leading-relaxed mb-6 flex-1">{s.desc}</p>
                <div className="flex items-end justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-xl md:text-2xl font-black text-[#1de9b6] leading-none">{s.metric}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#B0B0B0] mt-1.5">{s.metricLabel}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#1de9b6] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">More <ChevronRight size={12} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CLIENTS ── */}
      <Section id="clients" bgImage="/clients-bg.png">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="04 /" label="Trusted By" />
          <h2 className="text-5xl font-black uppercase text-white mb-6"><ScrambleText text="Tier-1 Partners." /></h2>
          <p className="max-w-2xl text-[#B8B8B8] text-lg font-light leading-relaxed mb-4">Trusted by leading automotive groups and Tier-1 manufacturers across Europe. Our precision and reliability power some of the most demanding production lines on the continent.</p>
        </div>
        <div className="-mx-6 mt-14 space-y-5">
          <LogoMarquee logos={clientLogos.slice(0, 6)} direction="left" speed={48} cardClass="w-44 h-28 md:w-52 md:h-32" />
          <LogoMarquee logos={clientLogos.slice(6)} direction="right" speed={48} cardClass="w-44 h-28 md:w-52 md:h-32" />
        </div>
      </Section>

      {/* ── PROCESS — interactive hover with detail reveal ── */}
      <Section id="process" className="bg-[#0B0B0B]" bgImage="/process-bg.png">
        <div className="max-w-7xl mx-auto text-center">
           <Eyebrow code="05 /" label="Workflow" />
           <h2 className="text-5xl font-black uppercase text-white mb-6"><ScrambleText text="From Request To Dock." /></h2>
           <p className="max-w-2xl mx-auto text-[#C0C0C0] text-lg font-light leading-relaxed mb-20">A clear four-step process — from your first inquiry to delivery at your loading bay. Hover over any step to see what happens behind the scenes.</p>

           <div className="grid md:grid-cols-4 gap-5">
              {[
                {
                  n: '01', t: 'Technical Inquiry', d: 'Specs, drawings or part numbers.',
                  icon: <FileText />,
                  details: [
                    'Send drawings, P/N or specs',
                    'No formality, just the need',
                    'Engineer-to-engineer dialogue'
                  ],
                  time: 'Same day'
                },
                {
                  n: '02', t: 'Optimal Sourcing', d: 'Identifying the best global source.',
                  icon: <Target />,
                  details: [
                    'Cross-check 14+ brand partners',
                    'Compare lead times and prices',
                    'Validate technical compatibility'
                  ],
                  time: '1–2 business days'
                },
                {
                  n: '03', t: 'Order Locked', d: 'Price and lead time confirmed.',
                  icon: <CheckCircle />,
                  details: [
                    'Firm price quote issued',
                    'Lead time guaranteed in writing',
                    'PO acceptance and scheduling'
                  ],
                  time: '24h response'
                },
                {
                  n: '04', t: 'Door-to-Dock', d: 'Tracked express delivery.',
                  icon: <Truck />,
                  details: [
                    'Express courier or dedicated truck',
                    'Real-time tracking shared',
                    'Delivery receipt confirmation'
                  ],
                  time: 'EU-wide 48–96h'
                }
              ].map((step, i) => (
                <div key={i} className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#1de9b6]/50 rounded-xl p-8 transition-all duration-500 overflow-hidden cursor-default min-h-[280px] flex flex-col">

                  {/* Glow + corner accent (appear on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                  <div className="absolute top-0 right-0 w-0 h-px bg-[#1de9b6] group-hover:w-full transition-all duration-700 ease-out" />

                  {/* DEFAULT state */}
                  <div className="relative z-10 flex flex-col items-center text-center transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-3">
                    <div className="text-[5rem] font-black text-white/[0.06] leading-none mb-3 group-hover:text-[#1de9b6]/20 transition-colors">{step.n}</div>
                    <h4 className="text-lg font-black text-[#1de9b6] uppercase tracking-wider mb-4">{step.t}</h4>
                    <p className="text-[#B0B0B0] text-sm">{step.d}</p>
                  </div>

                  {/* HOVER state — appears with smooth fade-in */}
                  <div className="absolute inset-0 p-6 flex flex-col opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-md bg-[#1de9b6]/15 border border-[#1de9b6]/30 flex items-center justify-center text-[#1de9b6]">
                          {React.cloneElement(step.icon, { size: 18 })}
                        </div>
                        <span className="text-[10px] font-mono text-[#1de9b6] tracking-[0.3em]">STEP {step.n}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#1de9b6] uppercase tracking-widest">{step.time}</span>
                    </div>

                    <h4 className="text-base font-black text-white uppercase tracking-wider mb-4">{step.t}</h4>

                    <ul className="space-y-2.5 text-left flex-1">
                      {step.details.map((d, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-[13px] text-[#D8D8D8] leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{ transitionDelay: `${150 + idx * 100}ms` }}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#1de9b6] mt-2 shrink-0 shadow-[0_0_6px_#1de9b6]" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Bottom progress bar that fills on hover */}
                    <div className="mt-5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1de9b6] to-[#5fffd9] w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_8px_#1de9b6]"
                        style={{ transitionDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
           </div>

           <p className="text-[#B0B0B0] text-[11px] font-mono uppercase tracking-[0.3em] mt-10">↑ Hover any step to see how it works ↑</p>
        </div>
      </Section>

      {/* ── CONTACT (CHANGE #4: unified business card + active channels + live indicators) ── */}
      <Section id="contact">
        <div className="max-w-7xl mx-auto">
           <Eyebrow code="06 /" label="Get In Touch" />
           <div className="grid md:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-5xl md:text-6xl font-black uppercase text-white leading-[0.9] mb-10"><ScrambleText text="Start The" /><br/><span className="text-[#1de9b6]"><ScrambleText text="Conversation." /></span></h2>
                 <p className="text-[#B8B8B8] text-lg leading-relaxed mb-10">Send us your technical drawings, part numbers, or a list of requirements. Our engineers respond within one business day with sourcing options and a locked quote.</p>

                 {/* ── UNIFIED BUSINESS CARD ── */}
                 <div className="relative bg-gradient-to-br from-[#0D0D0D] to-[#080808] border border-[#1de9b6]/15 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(29,233,182,0.05)] overflow-hidden">
                    {/* corner accents */}
                    <div className="absolute top-0 left-0 w-12 h-px bg-[#1de9b6]" />
                    <div className="absolute top-0 left-0 w-px h-12 bg-[#1de9b6]" />
                    <div className="absolute bottom-0 right-0 w-12 h-px bg-[#1de9b6]" />
                    <div className="absolute bottom-0 right-0 w-px h-12 bg-[#1de9b6]" />

                    {/* Header: REACH OUT */}
                    <div className="flex items-center gap-4 mb-8">
                       <span className="text-[10px] font-mono text-[#1de9b6] tracking-[0.4em] uppercase">Reach Out</span>
                       <div className="h-px flex-1 bg-[#1de9b6]/20" />
                    </div>

                    {/* Passive info rows */}
                    <div className="space-y-7 mb-10">
                       <a href="mailto:contact@industrytools.ro" className="flex items-start gap-5 group">
                          <Mail className="text-[#1de9b6] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Email</p>
                             <p className="text-base md:text-lg font-bold text-white group-hover:text-[#1de9b6] transition-colors truncate">contact@industrytools.ro</p>
                          </div>
                       </a>
                       <a href="tel:+40770852576" className="flex items-start gap-5 group">
                          <Phone className="text-[#1de9b6] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Phone</p>
                             <p className="text-base md:text-lg font-bold text-white group-hover:text-[#1de9b6] transition-colors">+40 770 852 576</p>
                          </div>
                       </a>
                       <div className="flex items-start gap-5">
                          <MapPin className="text-[#1de9b6] mt-1 shrink-0" size={22} />
                          <div className="min-w-0 flex-1">
                             <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-widest mb-1">Office</p>
                             <p className="text-base md:text-lg font-bold text-white">Pitești, Romania</p>
                          </div>
                       </div>
                    </div>

                    {/* Divider with label */}
                    <div className="flex items-center gap-4 mb-7">
                       <div className="h-px flex-1 bg-white/5" />
                       <span className="text-[9px] font-mono text-[#8A8A8A] tracking-[0.4em] uppercase">Active Channels</span>
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
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#25D366] transition-colors">Replies ~1h</span>
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
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#5B5FC7] transition-colors">Replies ~1h</span>
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
                          <span className="text-[8px] font-mono text-[#8A8A8A] group-hover:text-[#0A66C2] transition-colors">Follow DGSI</span>
                       </a>
                    </div>
                 </div>
              </div>

              <div className="bg-[#0D0D0D] p-10 border border-white/5 rounded-sm">
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <input type="text" placeholder="COMPANY" className="bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#1de9b6] outline-none transition-all" />
                    <input type="text" placeholder="NAME" className="bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#1de9b6] outline-none transition-all" />
                 </div>
                 <input type="email" placeholder="BUSINESS EMAIL" className="w-full bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#1de9b6] outline-none mb-6 transition-all" />
                 <textarea rows="4" placeholder="HOW CAN WE HELP YOUR PRODUCTION?" className="w-full bg-[#080808] border border-white/10 p-4 text-xs font-bold uppercase focus:border-[#1de9b6] outline-none mb-8 resize-none transition-all"></textarea>
                 <button className="w-full py-5 bg-[#1de9b6] text-black font-black uppercase text-xs hover:bg-white transition-all shadow-[0_0_20px_#1de9b633] rounded-sm">Send Inquiry</button>
              </div>
           </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="text-[10px] font-mono text-[#6A6A6A] tracking-[0.3em] uppercase">© 2026 Development General System Industry · Precision Engineering Romania</div>
          <nav className="flex flex-wrap justify-center gap-8">
            {navItems.map(item => (<button key={item} onClick={() => scrollTo(item)} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A7A7A] hover:text-[#1de9b6] transition-colors">{item}</button>))}
          </nav>
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
        className={`fixed bottom-24 right-6 z-[55] w-12 h-12 rounded-full bg-[#1de9b6] text-black flex items-center justify-center shadow-[0_4px_20px_rgba(29,233,182,0.3)] hover:scale-110 transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp size={22} />
      </button>

      {/* MODAL SYSTEM */}
      {expandedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setExpandedCard(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-[85vw] md:max-w-[75vw] h-[85vh] md:h-[75vh] bg-[#0A0A0A] border border-[#1de9b6]/50 shadow-[0_0_60px_rgba(29,233,182,0.2)] rounded-md overflow-y-auto p-12 animate-modal-slide" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpandedCard(null)} className="absolute top-6 right-6 text-[#8A8A8A] hover:text-white transition-colors bg-[#111] p-3 rounded-full z-50"><X size={28} /></button>
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
               <span className="text-xs text-[#1de9b6] font-mono tracking-[0.4em] uppercase">DGSI ENGINEERING SCOPE</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            {expandedCard === 'distributor' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight text-center md:text-left">Authorized Global<br/>Partner Network</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">Direct access to inventory and technical support from global leaders. We consolidate 120+ official brands into a single procurement point, streamlining your logistics and reducing downtime.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {supplierLogos.map((logo, idx) => (
                        <LogoCard key={idx} logo={logo} className="h-24 md:h-28" />
                    ))}
                </div>
              </div>
            )}

            {expandedCard === 'manufacturing' && (
              <div className="animate-fade-in text-center">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">Emergency Protocol:<br/>CAD TO PART IN 48H</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed mx-auto">When production stops, every second costs. Our protocol activates dedicated CNC capacity instantly. We guarantee critical parts and electrodes within 48-72 hours.</p>
                <div className="bg-[#080808] border border-white/5 rounded-xl p-16 flex items-center justify-center shadow-inner mt-8"><EmergencyTimeline expanded /></div>
              </div>
            )}

            {expandedCard === 'audit' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">Technical Audit &amp;<br/>Process Optimization</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">Our engineers analyze cutting data, tool wear, and material flow to identify bottlenecks and reduce cost-per-part through data-driven solutions.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        {icon: <Target/>, title: "Cutting Data Analysis", desc: "Optimizing speeds and feeds for maximum productivity."},
                        {icon: <Droplets/>, title: "Coolant Management", desc: "Checking concentration and pressure to maximize tool life."},
                        {icon: <Ruler/>, title: "Precision Audit", desc: "Identifying geometric deviations in the production process."},
                        {icon: <CheckCircle/>, title: "Cost-per-Part Optimization", desc: "Accurate calculation of achievable yearly savings."}
                    ].map((item, i) => (
                        <div key={i} className="bg-[#080808] border border-white/5 p-8 rounded-lg flex items-start gap-8">
                            <div className="w-16 h-16 text-[#1de9b6] flex-shrink-0">{item.icon}</div>
                            <div><h5 className="text-2xl font-bold text-white mb-4">{item.title}</h5><p className="text-xl text-[#B0B0B0] leading-relaxed">{item.desc}</p></div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* CHANGE #2: Tooling modal — V2 text, no 50% */}
            {expandedCard === 'tooling' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">Custom Tooling &amp;<br/>Regrinding Solutions</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">Custom tools built to your specifications. Plus, our regrinding service brings expensive tools back to original performance — a smart alternative to buying new.</p>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-lg flex-1">
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5"><Wrench className="text-[#1de9b6] w-8 h-8" /><h5 className="text-3xl font-bold text-white">Custom Tool Design</h5></div>
                        <ul className="text-xl text-[#B0B0B0] space-y-6 list-disc list-inside">
                            <li>Dedicated geometries for heavy alloys (Inconel, Titanium).</li>
                            <li>Special high-performance coatings (DLC, Diamond).</li>
                           <li>Ultra-tight tolerances up to ±0.005mm.</li>
                            <li>Profile milling cutters and step drill systems.</li>
                        </ul>
                    </div>
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-lg flex-1">
                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5"><ShieldCheck className="text-[#1de9b6] w-8 h-8" /><h5 className="text-3xl font-bold text-white">Regrinding Services</h5></div>
                        <ul className="text-xl text-[#B0B0B0] space-y-6 list-disc list-inside">
                           <li>Sharpening on state-of-the-art 5-axis CNC machines.</li>
                            <li>Full restoration of original manufacturer geometry.</li>
                            <li>Logistics protocol for fast pick-up &amp; delivery.</li>
                            <li>Detailed quality measurement reports included.</li>
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
                    <div className="w-12 h-12 text-[#1de9b6]">{prod.icon}</div>
                    <h3 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight">{prod.cat}</h3>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* LEFT — subcategories with animated icons */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-mono text-[#1de9b6] tracking-[0.3em] uppercase">Subcategories</span>
                        <div className="h-px flex-1 bg-[#1de9b6]/20" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {prod.items.map((item) => (
                          <div
                            key={item}
                            className="group/sub flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#1de9b6]/30 hover:bg-[#1de9b6]/[0.04] transition-all duration-300"
                          >
                            <span className="w-14 h-14 flex items-center justify-center bg-[#1de9b6]/10 border border-[#1de9b6]/25 rounded-xl text-[#1de9b6] shrink-0 group-hover/sub:bg-[#1de9b6]/20 transition-all">
                              <SubcategoryIcon name={item} size={28} />
                            </span>
                            <span className="text-xl md:text-2xl font-bold tracking-wide text-[#D8D8D8] group-hover/sub:text-white transition-colors">{item}</span>
                          </div>
                        ))}
                      </div>

                      {prod.catalogFile && (
                        <a href={prod.catalogFile} target="_blank" rel="noopener noreferrer"
                           className="mt-8 flex items-center justify-center gap-3 w-full max-w-md py-5 bg-[#1de9b6]/10 border border-[#1de9b6]/30 text-[#1de9b6] text-[12px] font-black uppercase tracking-[0.25em] rounded-sm transition-all duration-500 hover:bg-[#1de9b6] hover:text-black"
                        >
                          <Download size={16} />
                          <span>Download Full Catalog</span>
                        </a>
                      )}
                    </div>

                    {/* RIGHT — partner brands */}
                    {prod.brands && prod.brands.length > 0 && (
                      <div className="lg:w-80 shrink-0 lg:border-l lg:border-white/10 lg:pl-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-[11px] font-mono text-[#1de9b6] tracking-[0.3em] uppercase">Partner Brands</span>
                          <div className="h-px flex-1 bg-[#1de9b6]/20" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {prod.brands.map((brand) => (
                            <div
                              key={brand.name}
                              className={`flex items-center justify-center rounded-xl p-3 h-16 transition-all hover:scale-105 ${brand.src ? 'bg-white shadow-sm' : 'bg-white/[0.04] border border-[#1de9b6]/15'}`}
                              title={brand.name}
                            >
                              {brand.src ? (
                                <img
                                  src={brand.src}
                                  alt={brand.name}
                                  loading="lazy"
                                  className="max-w-full max-h-full object-contain mix-blend-multiply opacity-90"
                                  style={{ transform: `scale(${brand.scale || 1})` }}
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

      {/* ── WELDING MODAL (flagship) ── */}
      {weldingOpen && <WeldingModal onClose={() => setWeldingOpen(false)} />}

    </div>
  );
}