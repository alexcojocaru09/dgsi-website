import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, FileText, Zap, Wrench, Phone, Monitor, Settings, Truck, X, Target, CheckCircle, Droplets, Ruler, ShieldCheck, Download, ChevronRight, Mail, MapPin } from 'lucide-react';

// ─── Constants: Supplier Logos (Local SVG/PNG Files) ──────────────────────
const supplierLogos = [
  { name: '3M', src: '/logos/3m.svg', color: '#FF0000' },
  { name: 'Beta', src: '/logos/beta.png', color: '#F25322', scale: 3 },
  { name: 'Bosch', src: '/logos/bosch.svg', color: '#EA0016' },
  { name: 'Facom', src: '/logos/facom.svg', color: '#E3000F' },
  { name: 'Hazet', src: '/logos/hazet.png', color: '#005EAA', scale: 1 },
  { name: 'Honeywell', src: '/logos/honeywell.svg', color: '#FF1B2D' },
  { name: 'Milwaukee', src: '/logos/milwaukee.svg', color: '#D01B22', scale: 1.3 },
  { name: 'Tyrolit', src: '/logos/tyrolit.svg', color: '#004A99' },
  { name: 'Unior', src: '/logos/unior.png', color: '#005EAA', scale: 1.8 },
  { name: 'Siemens', src: '/logos/siemens.svg', color: '#009999' }
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
  { name: 'GIC Nosag', src: '/logos/gicnosag.jpeg', scale: 1 },
  { name: 'UKS', src: '/logos/uks.png', scale: 1 },
  { name: 'Opsan', src: '/logos/opsan.jpeg', scale: 1 }
];

// ─── Constants: Product Categories ──────────────────
const productCategories = [
  { 
    cat: 'Machining', 
    items: ['Drilling', 'Threading', 'Turning', 'Milling', 'Sawing'],
    catalogFile: '/machining-catalog.pdf'
  },
  { 
    cat: 'Clamping', 
    items: ['Toolholders', 'Turning Toolholders', 'Zero-point Systems', 'Measuring Devices', 'Magnetic & Vacuum', 'Mechanical Clamping'],
    catalogFile: '/clamping-catalog.pdf'
  },
  { 
    cat: 'Measuring', 
    items: ['Micrometers', 'Dial Indicators', 'Gauges', 'Calipers', 'Ancillaries', 'Sensor Tech'],
    catalogFile: '/measuring-catalog.pdf'
  },
  { 
    cat: 'Tools & PPE', 
    items: ['Power & Pneumatic', 'Abrasive Pads', 'Hand Tools', 'Compressed Air', 'Cutting & Sawing', 'Grinding & Polishing', 'Workstations', 'Work Protection'],
    catalogFile: '/tools-catalog.pdf'
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
      <span className="text-[10px] text-[#4A4A4A] font-mono tracking-widest">{code}</span>
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

function SupplierLogoTile({ logo }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex items-center justify-center w-full h-12 bg-white rounded-[2px] p-2 shadow-sm transition-transform duration-300 hover:scale-110 overflow-hidden">
      {!failed ? (
        <img 
          src={logo.src} 
          alt={logo.name} 
          className="max-w-full max-h-full object-contain mix-blend-multiply" 
          style={{ transform: `scale(${logo.scale || 1})` }}
          onError={() => setFailed(true)} 
        />
      ) : (
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-center" style={{ color: logo.color || '#111' }}>{logo.name}</span>
      )}
    </div>
  );
}

function ClientLogoTile({ logo }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="h-24 md:h-32 bg-white flex items-center justify-center p-6 rounded-[2px] shadow-sm transition-all duration-500 overflow-hidden">
      {!failed ? (
        <img 
          src={logo.src} 
          alt={logo.name} 
          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 opacity-80 hover:opacity-100" 
          style={{ transform: `scale(${logo.scale || 1})` }}
          onError={() => setFailed(true)} 
        />
      ) : (
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-center text-black">{logo.name}</span>
      )}
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

  useEffect(() => {
    document.body.style.overflow = expandedCard ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [expandedCard]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = ['about', 'products', 'services', 'clients', 'process', 'contact'];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F0EDE8] font-sans selection:bg-[#1de9b6] selection:text-black overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080808]/98 backdrop-blur-md shadow-[0_1px_0_rgba(29,233,182,0.15)] py-3' : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/50 to-transparent py-6'}`}>
        <div className="max-w-[98%] 2xl:max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-3 group cursor-pointer text-center shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
                  <rect x="35" y="10" width="30" height="40" rx="2" fill="#5A5A5A" />
                  <rect x="30" y="45" width="40" height="5" rx="1" fill="#4A4A4A" />
                  <path d="M40 50 L60 50 L58 85 C57 92, 43 92, 42 85 Z" fill="#1de9b6" />
                  <path d="M43 55 Q 50 65, 57 55" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M42 65 Q 50 75, 58 65" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M41 75 Q 50 85, 59 75" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M40 50 L60 50 L58 85 C57 92, 43 92, 42 85 Z" fill="none" stroke="#1de9b6" strokeWidth="4" strokeOpacity="0.1" className="blur-sm group-hover:strokeOpacity-0.3 transition-all" />
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
              <button onClick={() => scrollTo('contact')} className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7A7A7A] hover:text-white transition-colors pr-1">
                <FileText size={12} className="text-[#1de9b6]/60 group-hover:text-[#1de9b6] transition-colors" />
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
               <a href="#" className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#1de9b6] to-[#0bc192] text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm shadow-[0_0_15px_rgba(29,233,182,0.15)]">
                  <ShoppingBag size={16} />
                  <span>Shop Online</span>
               </a>
               <button onClick={() => scrollTo('contact')} className="flex items-center justify-center gap-3 px-6 py-3 text-[#8A8A8A] text-[11px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">
                  <FileText size={15} className="text-[#1de9b6]/60" />
                  <span>Request Quote</span>
               </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero-bg.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#1de9b6 1px, transparent 1px), linear-gradient(90deg, #1de9b6 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-36 right-6 text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#1de9b6]/50 tracking-widest">REF-DGSI-2025</p>
          <p className="text-[9px] font-mono text-[#4A4A4A] tracking-widest uppercase">Precision Engineering & Global Sourcing</p>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-[#1de9b6]" />
            <span className="text-[10px] font-mono text-[#1de9b6] tracking-[0.4em] uppercase">Industrial Excellence</span>
          </div>
          <h1 className="text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight text-white mb-8">Precision<br /><span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(29,233,182,0.5)' }}>in Every</span><br /><span className="text-[#1de9b6]">Part.</span></h1>
          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <p className="max-w-md text-base text-[#8A8A8A] font-light leading-relaxed border-l-2 border-[#1de9b6]/40 pl-6">Global supply chain and engineering for Tier-1 automotive and manufacturing leaders.</p>
            <div className="flex gap-4 shrink-0">
              <button onClick={() => scrollTo('products')} className="px-8 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-[10px] hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(29,233,182,0.25)] rounded-sm">Explore Portfolio</button>
              <button onClick={() => scrollTo('contact')} className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all rounded-sm">Contact Us</button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] font-mono text-[#4A4A4A] tracking-widest uppercase">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#1de9b6]/5 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#0D0D0D] border-y border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
          {[
            { value: 15, suffix: '+', label: 'Years in Industry' },
            { value: 2800, suffix: '+', label: 'Products Available' },
            { value: 48, suffix: 'h', label: 'Emergency Delivery' },
            { value: 340, suffix: '+', label: 'Industrial Clients' },
          ].map((s, i) => (
            <div key={i} className="text-center md:px-8">
              <div className="text-3xl md:text-4xl font-black text-[#1de9b6] mb-1"><Counter end={s.value} suffix={s.suffix} /></div>
              <div className="text-[10px] text-[#5A5A5A] font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <Section id="about" bgImage="/about-bg.png">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="01 /" label="About DGSI" />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-8">Industrial Precision<br /><span className="text-[#1de9b6]">Meets Speed.</span></h2>
              <p className="text-[#A0A0A0] leading-relaxed mb-10">DGSI is an authorized distributor and custom manufacturing partner for companies that need precision, reliability, and response speed. We consolidate multi-brand sourcing, engineer rapid solutions, and deliver on impossible deadlines.</p>
              
              <div className="mt-10">
                <a 
                 href="/DGSI-pres-EN.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-3 px-8 py-4 border border-[#1de9b6]/50 text-[#1de9b6] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1de9b6] hover:text-black hover:border-[#1de9b6] transition-all duration-300 rounded-sm group shadow-[0_0_15px_rgba(29,233,182,0.1)]"
                >
                  <FileText size={14} className="group-hover:rotate-12 transition-transform" />
                  <span>View Company Profile</span>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'distributor', title: 'Authorized Distributor', desc: 'Official partner for 120+ global brands without MOQ constraints.' },
                { id: 'manufacturing', title: 'Emergency Manufacturing', desc: '48–72h custom CNC parts, electrodes, and assemblies.' },
                { id: 'audit', title: 'Technical Audit', desc: 'Production line analysis and cost optimization consulting.' },
                { id: 'tooling', title: 'Tooling Customization', desc: 'Precision-engineered solutions based on your technical specs.' },
              ].map((f, i) => (
                <div key={i} onClick={() => setExpandedCard(f.id)} className="p-6 bg-[#080808]/80 backdrop-blur-sm border border-[#1de9b6]/20 hover:border-[#1de9b6]/60 transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[160px]">
                  <div className="relative z-10 transition-all duration-300 group-hover:-translate-y-2">
                    <div className="w-6 h-px bg-[#1de9b6] mb-4 group-hover:w-10 transition-all duration-300" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">{f.title}</h4>
                    <p className="text-[11px] text-[#8A8A8A] leading-relaxed mb-2">{f.desc}</p>
                  </div>
                  <span className="text-[9px] font-bold text-[#1de9b6] uppercase tracking-widest absolute bottom-4 left-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">Click to Expand <Zap size={10} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── PRODUCTS ───────────────────────────────────────────────────── */}
      <Section id="products">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="02 /" label="Product Portfolio" />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-14">Complete Industrial<br /><span className="text-[#1de9b6]">Ecosystem.</span></h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((prod, i) => (
              <div key={i} className="group relative bg-[#0D0D0D] border border-white/5 hover:border-[#1de9b6]/50 rounded-xl p-8 transition-all duration-500 overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white mb-8 pb-4 border-b border-white/10 group-hover:border-[#1de9b6]/30 transition-all">{prod.cat}</h3>
                  <div className="space-y-5 flex-1 mb-8">
                    {prod.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-[#D0D0D0] hover:text-white transition-all duration-300 cursor-default hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group/item mb-3">
                        <ChevronRight size={18} className="text-[#1de9b6] group-hover/item:translate-x-1 transition-transform" />
                        <span className="text-base font-bold tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                  {prod.catalogFile && (
                    <div className="mt-auto">
                      <a href={prod.catalogFile} target="_blank" rel="noopener noreferrer"
                         className="group/btn relative flex items-center justify-center gap-3 w-full py-4 bg-white/5 backdrop-blur-md border border-[#1de9b6]/30 text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.25em] rounded-sm transition-all duration-500 hover:bg-[#1de9b6] hover:text-black hover:border-[#1de9b6] overflow-hidden shadow-sm"
                      >
                        <Download size={15} className="relative z-10 transition-transform duration-500 group-hover/btn:-translate-y-1" />
                        <span className="relative z-10">Catalog</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 relative p-8 md:p-14 bg-gradient-to-r from-[#1de9b6]/10 to-transparent border border-[#1de9b6]/30 overflow-hidden rounded-sm">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-block px-3 py-1 bg-[#1de9b6]/20 text-[#1de9b6] text-[10px] font-black uppercase tracking-widest rounded">Flagship Expertise</span>
                  <Zap className="text-[#1de9b6] w-5 h-5" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-5">Projection Welding Electrodes</h3>
                <p className="text-[#8A8A8A] text-lg leading-relaxed">Specialized engineering for resistance and projection welding lines. Precision-manufactured electrodes for automotive Tier-1 production.</p>
              </div>
              <div className="shrink-0">
                <a href="/welding-catalog.pdf" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-4 px-10 py-5 bg-transparent border-2 border-[#1de9b6] text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#1de9b6] hover:text-black transition-all duration-500 rounded-sm shadow-[0_0_20px_rgba(29,233,182,0.15)]"
                >
                  <Download size={18} />
                  <span>Engineering Specs</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SERVICES SECTION ── */}
      <Section id="services" className="bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="03 /" label="Expert Services" />
          <h2 className="text-5xl font-black uppercase text-white mb-16">What We Deliver.</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Industrial Supply', desc: 'Authorized distributor for 120+ global brands. Consolidation, no MOQ, price locks.', icon: <Wrench /> },
              { title: 'Rapid Prototyping', desc: '48–72h CNC machining for critical production line components.', icon: <Zap /> },
              { title: 'Process Audit', desc: 'In-depth analysis of speeds, feeds, and tool wear to reduce cycle time.', icon: <FileText /> },
              { title: 'Tool Regrinding', desc: 'Professional reconditioning to restore OEM performance at 50% cost.', icon: <Settings /> },
            ].map((s, i) => (
              <div key={i} className="bg-[#0D0D0D] p-8 border border-white/5 hover:border-[#1de9b6]/40 transition-all group">
                <div className="text-[#1de9b6] mb-4 w-8 h-8">{s.icon}</div>
                <h3 className="text-sm font-black uppercase text-white mb-3">{s.title}</h3>
                <p className="text-[12px] text-[#7A7A7A] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CLIENTS ── */}
      <Section id="clients">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="04 /" label="Trusted By" />
          <h2 className="text-5xl font-black uppercase text-white mb-16">Tier-1 Partners.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clientLogos.map((logo, idx) => (
                <ClientLogoTile key={idx} logo={logo} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── PROCESS ── */}
      <Section id="process" className="bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto text-center">
           <Eyebrow code="05 /" label="Workflow" />
           <h2 className="text-5xl font-black uppercase text-white mb-20">From Request To Dock.</h2>
           <div className="grid md:grid-cols-4 gap-12">
              {[{n:'01', t:'Technical Inquiry', d:'Specs, drawings or part numbers.'}, {n:'02', t:'Optimal Sourcing', d:'Identifying the best global source.'}, {n:'03', t:'Order Locked', d:'Price and lead time confirmed.'}, {n:'04', t:'Door-to-Dock', d:'Tracked express delivery.'}].map((step, i) => (
                <div key={i} className="relative">
                   <div className="text-6xl font-black text-white/5 absolute -top-10 left-1/2 -translate-x-1/2">{step.n}</div>
                   <h4 className="text-lg font-black text-[#1de9b6] mb-4 uppercase">{step.t}</h4>
                   <p className="text-[#7A7A7A]">{step.d}</p>
                </div>
              ))}
           </div>
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section id="contact">
        <div className="max-w-7xl mx-auto">
           <Eyebrow code="06 /" label="Get In Touch" />
           <div className="grid md:grid-cols-2 gap-20">
              <div>
                 <h2 className="text-6xl font-black uppercase text-white leading-[0.9] mb-10">Start The<br/><span className="text-[#1de9b6]">Conversation.</span></h2>
                 <div className="space-y-8">
                    <div className="flex items-center gap-6 p-6 bg-white/5 border-l-4 border-[#1de9b6]">
                       <Mail className="text-[#1de9b6]" />
                       <div><p className="text-[10px] font-mono text-[#7A7A7A] uppercase">Email</p><p className="text-xl font-bold">contact@industrytools.ro</p></div>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-white/5 border-l-4 border-[#1de9b6]">
                       <MapPin className="text-[#1de9b6]" />
                       <div><p className="text-[10px] font-mono text-[#7A7A7A] uppercase">Location</p><p className="text-xl font-bold">Romania, Pitesti 110043</p></div>
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
          <div className="text-[10px] font-mono text-[#3A3A3A] tracking-[0.3em] uppercase">© 2026 Development General System Industry · Precision Engineering Romania</div>
          <nav className="flex flex-wrap justify-center gap-8">
            {navItems.map(item => (<button key={item} onClick={() => scrollTo(item)} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#4A4A4A] hover:text-[#1de9b6] transition-colors">{item}</button>))}
          </nav>
        </div>
      </footer>

      {/* MODAL SYSTEM */}
      {expandedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setExpandedCard(null)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-[85vw] md:max-w-[75vw] h-[85vh] md:h-[75vh] bg-[#0A0A0A] border border-[#1de9b6]/50 shadow-[0_0_60px_rgba(29,233,182,0.2)] rounded-md overflow-y-auto p-12 animate-modal-slide" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpandedCard(null)} className="absolute top-6 right-6 text-[#5A5A5A] hover:text-white transition-colors bg-[#111] p-3 rounded-full z-50"><X size={28} /></button>
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
               <span className="text-xs text-[#1de9b6] font-mono tracking-[0.4em] uppercase">DGSI ENGINEERING SCOPE</span>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            {expandedCard === 'distributor' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight text-center md:text-left">Authorized Global<br/>Partner Network</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">Direct access to inventory and technical support from global leaders. We consolidate 120+ official brands into a single procurement point, streamlining your logistics and reducing downtime.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {supplierLogos.map((logo, idx) => (
                        <SupplierLogoTile key={idx} logo={logo} />
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
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">Technical Audit &<br/>Process Optimization</h3>
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

            {expandedCard === 'tooling' && (
              <div className="animate-fade-in">
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white mb-8 tracking-tight">Custom Tooling &<br/>Regrinding Solutions</h3>
                <p className="text-[#D0D0D0] text-xl md:text-2xl max-w-4xl mb-16 leading-relaxed">Bespoke geometric solutions tailored to your specific application. Restore expensive tools to original performance while reducing costs by up to 50%.</p>
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
                            <li>Logistics protocol for fast pick-up & delivery.</li>
                            <li>Detailed quality measurement reports included.</li>
                        </ul>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}