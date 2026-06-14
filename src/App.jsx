import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, FileText, Zap, Wrench } from 'lucide-react';

// ─── Constants: Extracted Premium Suppliers ────────────────────────────────
const supplierLogos = [
  { name: '3M', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/3M_wordmark.svg/512px-3M_wordmark.svg.png' },
  { name: 'Bosch', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-Logo.svg/512px-Bosch-Logo.svg.png' },
  { name: 'Milwaukee', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Milwaukee_Tool_logo.svg/512px-Milwaukee_Tool_logo.svg.png' },
  { name: 'Loctite', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Loctite_logo.svg/512px-Loctite_logo.svg.png' },
  { name: 'Facom', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Facom_logo.svg/512px-Facom_logo.svg.png' },
  { name: 'Knipex', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Knipex_logo.svg/512px-Knipex_logo.svg.png' },
  { name: 'Uvex', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Uvex-logo.svg/512px-Uvex-logo.svg.png' },
  { name: 'DuPont', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DuPont_logo.svg/512px-DuPont_logo.svg.png' },
  { name: 'Honeywell', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Honeywell_logo.svg/512px-Honeywell_logo.svg.png' },
  { name: 'Kärcher', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/K%C3%A4rcher_Logo_2015.svg/512px-K%C3%A4rcher_Logo_2015.svg.png' },
  { name: 'Ansell', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ansell_logo.svg/512px-Ansell_logo.svg.png' },
  { name: 'Fluke', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Fluke_Corporation_logo.svg/512px-Fluke_Corporation_logo.svg.png' }
];

// ─── Tiny hook: reveal on scroll ───────────────────────────────────────────
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

// ─── Reusable Section Wrapper with "ruler" decoration ──────────────────────
function Section({ id, children, className = '', light = false }) {
  const [ref, visible] = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-28 px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${light ? 'bg-[#0F0F0F]' : 'bg-[#080808]'} ${className}`}
    >
      {/* Ruler line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1de9b6]/20" />
      {children}
    </section>
  );
}

// ─── Section label (eyebrow) ────────────────────────────────────────────────
function Eyebrow({ code, label }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-[10px] text-[#4A4A4A] font-mono tracking-widest">{code}</span>
      <div className="h-px flex-1 max-w-[40px] bg-[#1de9b6]/40" />
      <span className="text-[10px] text-[#1de9b6] font-mono tracking-[0.3em] uppercase">{label}</span>
    </div>
  );
}

// ─── Animated counter ───────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-[#F0EDE8] font-sans selection:bg-[#1de9b6] selection:text-black overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080808]/98 backdrop-blur-md shadow-[0_1px_0_rgba(29,233,182,0.15)] py-3' : 'bg-gradient-to-b from-[#080808]/95 via-[#080808]/50 to-transparent py-6'}`}>
        <div className="max-w-[98%] 2xl:max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
          
          {/* ── LOGO SECTION ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-3 group cursor-pointer text-center shrink-0"
            aria-label="Go to homepage"
          >
            {/* Icon: CNC Drill Bit (End Mill) */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]">
                  {/* Mandrina / Coada burghiului (Gray) */}
                  <rect x="35" y="10" width="30" height="40" rx="2" fill="#5A5A5A" />
                  <rect x="30" y="45" width="40" height="5" rx="1" fill="#4A4A4A" />
                  
                  {/* Capul de taiere - End Mill style (Teal/Green) */}
                  <path d="M40 50 L60 50 L58 85 C57 92, 43 92, 42 85 Z" fill="#1de9b6" />
                  
                  {/* Caneluri elicoidale (Linii de taiere) */}
                  <path d="M43 55 Q 50 65, 57 55" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M42 65 Q 50 75, 58 65" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M41 75 Q 50 85, 59 75" stroke="#050505" strokeWidth="1.5" fill="none" opacity="0.6"/>

                  {/* Glow effect la hover */}
                  <path d="M40 50 L60 50 L58 85 C57 92, 43 92, 42 85 Z" fill="none" stroke="#1de9b6" strokeWidth="4" strokeOpacity="0.1" className="blur-sm group-hover:strokeOpacity-0.3 transition-all" />
               </svg>
            </div>

            {/* Typography: Mazda-Inspired - Centrat */}
            <div className="flex flex-col items-center">
              <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.25em] leading-none text-white group-hover:text-[#1de9b6] transition-colors">
                Development General
              </span>
              <span className="text-[12px] md:text-[14px] font-light uppercase tracking-[0.52em] leading-tight text-[#1de9b6] group-hover:text-white transition-colors mt-1">
                System Industry
              </span>
            </div>
          </button>

          {/* ── RIGHT SECTION - Nav + CTAs aliniate ── */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-10">
            {/* Desktop nav */}
            <nav className="flex items-center gap-7">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)}
                  className="relative text-[13px] font-bold uppercase tracking-[0.2em] text-[#E0E0E0] hover:text-white transition-colors cursor-pointer group py-2">
                  {item}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#1de9b6] transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_8px_rgba(29,233,182,0.5)]" />
                </button>
              ))}
            </nav>

            {/* CTAs Desktop */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button 
                onClick={() => scrollTo('contact')} 
                className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#7A7A7A] hover:text-white transition-colors pr-1"
              >
                <FileText size={12} className="text-[#1de9b6]/60 group-hover:text-[#1de9b6] transition-colors" />
                <span>Request Quote</span>
              </button>
              
              <a 
                href="#" 
                className="group relative flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#1de9b6] to-[#0bc192] text-[#050505] text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:from-white hover:to-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] shadow-[0_0_15px_rgba(29,233,182,0.15)] rounded-sm"
              >
                <ShoppingBag size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>Shop Online</span>
              </a>
            </div>
          </div>

          {/* Hamburger (Mobile) */}
          <button className="lg:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-[2px] bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-[2px] bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[#080808] border-t border-[#1de9b6]/20 px-6 py-8 flex flex-col gap-6">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item)}
                className="text-left text-sm font-bold uppercase tracking-[0.2em] text-[#F0EDE8] hover:text-[#1de9b6] transition-colors">
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

          <h1 className="text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight text-white mb-8">
            Precision<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(29,233,182,0.5)' }}>in Every</span><br />
            <span className="text-[#1de9b6]">Part.</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <p className="max-w-md text-base text-[#8A8A8A] font-light leading-relaxed border-l-2 border-[#1de9b6]/40 pl-6">
              Industrial tools, consumables, CNC machining, and emergency custom engineering. One-source solutions for critical production needs.
            </p>
            <div className="flex gap-4 shrink-0">
              <button onClick={() => scrollTo('services')} className="px-8 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-[10px] hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(29,233,182,0.25)] rounded-sm">
                Our Services
              </button>
              <button onClick={() => scrollTo('contact')} className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white hover:text-black transition-all rounded-sm">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] font-mono text-[#4A4A4A] tracking-widest uppercase">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#1de9b6]/5 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────── */}
      <div className="bg-[#0D0D0D] border-y border-[#1de9b6]/10 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#1de9b6]/10">
          {[
            { value: 15, suffix: '+', label: 'Years in Industry', decimals: 0 },
            { value: 2800, suffix: '+', label: 'Products Available', decimals: 0 },
            { value: 48, suffix: 'h', label: 'Emergency Delivery', decimals: 0 },
            { value: 340, suffix: '+', label: 'Industrial Clients', decimals: 0 },
          ].map((s, i) => (
            <div key={i} className="text-center md:px-8">
              <div className="text-3xl md:text-4xl font-black text-[#1de9b6] mb-1">
                <Counter end={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="text-[10px] text-[#5A5A5A] font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <Section id="about" light>
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="01 /" label="About DGSI" />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-8">
                Industrial Precision<br />
                <span className="text-[#1de9b6]">Meets Speed.</span>
              </h2>
              <p className="text-[#7A7A7A] leading-relaxed mb-6">
                DGSI is an authorized distributor and custom manufacturing partner for companies that need precision, reliability, and response speed. We consolidate multi-brand sourcing, engineer rapid solutions, and deliver on impossible deadlines.
              </p>
              <p className="text-[#7A7A7A] leading-relaxed">
                Trusted by automotive, packaging, metallurgy, and manufacturing leaders across Europe, we speak the language of technical drawings, tight tolerances, and production-critical urgency.
              </p>
              <div className="mt-10">
                <button onClick={() => scrollTo('contact')} className="px-6 py-3 border border-[#1de9b6]/50 text-[#1de9b6] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1de9b6]/10 transition-all rounded-sm">
                  Learn More
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'distributor', title: 'Authorized Distributor', desc: 'Official partner for 120+ global brands without MOQ constraints.' },
                { id: 'manufacturing', title: 'Emergency Manufacturing', desc: '48–72h custom CNC parts, electrodes, and assemblies.' },
                { id: 'audit', title: 'Technical Audit', desc: 'Production line analysis and cost optimization consulting.' },
                { id: 'tooling', title: 'Tooling Customization', desc: 'Precision-engineered solutions based on your technical specs.' },
              ].map((f, i) => (
                <div key={i} className="relative p-6 bg-[#080808] border border-[#1de9b6]/10 hover:border-[#1de9b6]/40 transition-all duration-500 group overflow-hidden min-h-[190px] flex flex-col justify-center">
                  
                  {/* Default Text Content */}
                  <div className={`relative z-10 transition-all duration-500 ${f.id === 'distributor' ? 'group-hover:-translate-y-8 group-hover:opacity-0' : ''}`}>
                    <div className="w-6 h-px bg-[#1de9b6] mb-4 group-hover:w-10 transition-all duration-300" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">{f.title}</h4>
                    <p className="text-[11px] text-[#5A5A5A] leading-relaxed">{f.desc}</p>
                  </div>

                  {/* Hover Overlay specifically for Distributor to show Suppliers */}
                  {f.id === 'distributor' && (
                    <div className="absolute inset-0 bg-[#0A0A0A] z-20 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 border-t-2 border-[#1de9b6]">
                      <div className="text-[8px] font-mono text-[#1de9b6] tracking-[0.3em] uppercase mb-4 text-center">Top Global Partners</div>
                      
                      {/* Logo Grid 4x3 */}
                      <div className="grid grid-cols-4 gap-2 w-full content-center justify-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
                        {supplierLogos.map((logo, idx) => (
                          <div key={idx} className="flex items-center justify-center w-full h-8 bg-white/95 rounded-[2px] p-1.5 grayscale hover:grayscale-0 transition-all duration-300">
                            <img
                              src={logo.src}
                              alt={logo.name}
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'block';
                              }}
                            />
                            {/* Text Fallback if Image Fails */}
                            <span className="hidden text-[7px] font-black uppercase tracking-wider text-[#050505] text-center leading-tight">{logo.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-14">
            Complete Industrial<br />
            <span className="text-[#1de9b6]">Ecosystem.</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { cat: 'Machining', items: ['Holemaking & Boring', 'Threading & Tapping', 'Parting & Cutting', 'Turning', 'Milling'] },
              { cat: 'Toolholding', items: ['Toolholders', 'Chucks & Collets', 'Machine Vises', 'Clamping Systems'] },
              { cat: 'Measurement', items: ['Micrometers', 'Calipers', 'Dial Indicators', 'Feeler Gauges', 'Measurement Tools'] },
              { cat: 'Abrasives', items: ['Abrasive Discs', 'Saw Blades', 'Wire Brushes', 'Precision Files', 'Spare Parts'] },
              { cat: 'Hand Tools', items: ['Assembly Tools', 'Torque Tools', 'Impact Tools', 'Cutting Tools', 'Tool Sets'] },
            ].map((prod, i) => (
              <div 
                key={i} 
                className="group relative bg-gradient-to-br from-[#1de9b6]/15 via-[#1de9b6]/8 to-[#1de9b6]/3 border border-[#1de9b6]/30 hover:border-[#1de9b6]/70 rounded-xl p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(29,233,182,0.2)] hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white mb-6 pb-4 border-b border-[#1de9b6]/30 group-hover:border-[#1de9b6]/60 transition-all">
                    {prod.cat}
                  </h3>
                  <div className="space-y-3">
                    {prod.items.map((item, idx) => (
                      <a key={item} href="#" onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 px-4 py-3 bg-white/90 text-black rounded-lg hover:bg-white hover:shadow-lg hover:shadow-[#1de9b6]/30 transition-all duration-300 group/btn transform hover:translate-x-1 cursor-pointer">
                        <span className="text-[#1de9b6] font-black text-sm group-hover/btn:text-lg transition-all">▸</span>
                        <span className="text-[13px] font-semibold text-gray-800 group-hover/btn:text-black transition-colors">{item}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 relative p-8 bg-gradient-to-r from-[#1de9b6]/10 to-transparent border border-[#1de9b6]/40 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#1de9b6]/20 text-[#1de9b6] text-[10px] font-black uppercase tracking-widest rounded mb-3">Our Strength</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white">Projection Welding Electrodes</h3>
                </div>
                <Zap className="text-[#1de9b6] w-8 h-8 flex-shrink-0" />
              </div>
              <p className="text-[#8A8A8A] leading-relaxed max-w-2xl">
                Custom-engineered welding electrodes for projection welding, resistance spot welding, and advanced joining applications. Available on-demand with emergency 48-hour delivery.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── SERVICES ───────────────────────────────────────────────────– */}
      <Section id="services" light>
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="03 /" label="Services" />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-14">
            What We<br />
            <span className="text-[#1de9b6]">Deliver.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Industrial Tools & Consumables', desc: 'Authorized distributor for 120+ global brands. Multi-brand consolidation, no MOQ constraints.', icon: <Wrench /> },
              { title: 'Emergency Manufacturing', desc: 'Custom CNC-machined parts, projection welding electrodes. 48–72h delivery for critical needs.', icon: <Zap /> },
              { title: 'Audit & Technical Consulting', desc: 'Production line & tooling analysis, cost optimization, risk identification.', icon: <FileText /> },
              { title: 'Tooling Customization', desc: 'Tool regrinding, sharpening, die & mold repair. Precision-engineered solutions on spec.', icon: <Wrench /> },
            ].map((s, i) => (
              <div key={i} className="bg-[#0B0B0B] p-8 border border-[#1de9b6]/10 hover:border-[#1de9b6]/40 transition-all group">
                <div className="text-[#1de9b6] mb-4 w-8 h-8">{s.icon}</div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">{s.title}</h3>
                <p className="text-[12px] text-[#5A5A5A] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CLIENTS & PARTNERS ─── */}
      <Section id="clients" light>
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="05 /" label="Trusted By" />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-16">
            Trusted by Industry<br />
            <span className="text-[#1de9b6]">Leaders Across Europe.</span>
          </h2>

          <div className="bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/15 rounded-lg p-12 backdrop-blur-sm">
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start items-center">
              {[
                { name: 'Dacia', url: 'https://www.dacia.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/DACIALOGOTYPE.png' },
                { name: 'Kirchhoff', url: 'https://www.kirchhoff-automotive.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Kirchhoff_Logo.svg/3840px-Kirchhoff_Logo.svg.png' },
                { name: 'Martur Fompak', url: 'https://i.ytimg.com/vi/P51XJF6wpXY/maxresdefault.jpg', logo: 'https://www.sap.com/dam/application/shared/logos/customer/h-q/martur-fompak-customer-logo.png' },
                { name: 'Farplas', url: 'https://www.farplas.com', logo: 'https://faraero.com.tr/wp-content/uploads/2020/08/farplas-logo.png' },
                { name: 'Kärcher', url: 'https://www.karcher.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/K%C3%A4rcher_Logo_2015.svg/1280px-K%C3%A4rcher_Logo_2015.svg.png' },
                { name: 'Timken', url: 'https://www.timken.com', logo: 'https://cdn.freebiesupply.com/logos/large/2x/timken-logo-png-transparent.png' },
                { name: 'HORSE Powertrain', url: 'https://www.horse.cars', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Horse_Powertrain_Limited_logo.svg/1280px-Horse_Powertrain_Limited_logo.svg.png' },
                { name: 'Beyçelik Gestamp', url: 'https://www.beycelikgestamp.com', logo: 'https://www.beycelikgestamp.com.tr/dacegug/2025/10/gestamp_logo.svg' },
                { name: 'Coskunoz Holding', url: 'https://www.coskunozholding.com.tr/en/companies/automotive', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Co%C5%9Fkun%C3%B6z_Holding.svg/3840px-Co%C5%9Fkun%C3%B6z_Holding.svg.png' },
                { name: 'GIC NOSAG', url: 'https://www.gicnosag.com', logo: 'https://cdn.abacus.ai/images/e5f1d495-d26a-46f0-a653-3a7add4030b6.png' },
                { name: 'UKS', url: 'https://www.uksstamping.com', logo: 'https://www.uksstamping.com/assets/img/uks-logo.png' },
                { name: 'Opsan', url: 'https://www.opsan.com.tr', logo: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/el5grzb45tlvtvmmcbyg?ik-sanitizeSvg=true' },
              ].map((client, i) => (
                <a
                  key={i}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 h-32 w-40 bg-white border border-white/40 hover:border-white hover:shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer rounded-md"
                >
                  {/* Logo container setat pe 100% alb pur pt vizibilitate perfecta */}
                  <div className="flex items-center justify-center h-full w-full px-4 bg-white">
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-w-[92%] max-h-[85%] object-contain transition-all duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    {/* Fallback text if logo doesn't load */}
                    <p className="hidden text-[10px] font-black uppercase tracking-widest text-black transition-all duration-300 text-center leading-tight">
                      {client.name}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <p className="text-[12px] text-[#5A5A5A] text-center mt-14 border-t border-[#1A1A1A] pt-10">
            ...and 300+ industrial clients across automotive, packaging, metallurgy, food processing, and manufacturing sectors.
          </p>
        </div>
      </Section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <Section id="contact" light className="pb-40">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="07 /" label="Contact" />
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-6">
                Ready to<br />
                <span className="text-[#1de9b6]">Work Together?</span>
              </h2>
              <div className="space-y-6 mt-12">
                {[
                  { label: 'Email', value: 'contact@dgsi.ro' },
                  { label: 'Location', value: 'Romania — EU Delivery' },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-6 py-6 border-b border-[#1A1A1A]">
                    <span className="text-[9px] font-mono text-[#1de9b6]/60 tracking-widest uppercase w-16 shrink-0 pt-0.5">{c.label}</span>
                    <span className="text-lg text-[#F0EDE8]">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 bg-[#0D0D0D] p-8 border border-white/5 rounded-sm">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company" className="w-full bg-[#080808] border border-[#1A1A1A] text-sm px-4 py-4 outline-none focus:border-[#1de9b6]/50 transition-all" />
                <input type="text" placeholder="Name" className="w-full bg-[#080808] border border-[#1A1A1A] text-sm px-4 py-4 outline-none focus:border-[#1de9b6]/50 transition-all" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full bg-[#080808] border border-[#1A1A1A] text-sm px-4 py-4 outline-none focus:border-[#1de9b6]/50 transition-all" />
              <textarea rows={4} placeholder="How can we help your production line?" className="w-full bg-[#080808] border border-[#1A1A1A] text-sm px-4 py-4 outline-none focus:border-[#1de9b6]/50 transition-all resize-none" />
              <button className="w-full py-4 bg-[#1de9b6] text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-[#1de9b6]/10">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] font-mono text-[#3A3A3A] tracking-widest uppercase text-center md:text-left">
              © 2026 Development General System Industry · Precision In Every Part
           </div>
           <nav className="flex flex-wrap justify-center gap-8">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)} className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#4A4A4A] hover:text-[#1de9b6] transition-colors">{item}</button>
              ))}
           </nav>
        </div>
      </footer>
    </div>
  );
}