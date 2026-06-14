import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, FileText, Zap, Wrench } from 'lucide-react';

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
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#080808]/95 backdrop-blur-md shadow-[0_1px_0_rgba(29,233,182,0.15)]' : 'bg-transparent'} py-5`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo — Home button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group cursor-pointer"
            aria-label="Go to homepage"
          >
            <svg width="36" height="40" viewBox="0 0 36 40" fill="none" xmlns="https://thumbs.dreamstime.com/b/homecore-icons-color-real-estate-home-logo-set-eps-vector-property-branding-design-pack-456135765.jpg"
              className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(29,233,182,0.6)]">
              <path d="M18 1L2 7.5V19C2 27.5 9 35 18 39C27 35 34 27.5 34 19V7.5L18 1Z"
                stroke="#1de9b6" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              <path d="M18 4L5 9.8V19C5 26 10.8 32.5 18 36C25.2 32.5 31 26 31 19V9.8L18 4Z"
                fill="#1de9b6" fillOpacity="0.06" />
              <path d="M10 14H14.5C16.5 14 18 15.5 18 18C18 20.5 16.5 22 14.5 22H10V14Z"
                stroke="#1de9b6" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
              <path d="M22 15.5C21 14.6 19.8 14 18.5 14" stroke="#1de9b6" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M23.5 18C23.5 20.5 21.5 22.5 19 22.5C18.7 22.5 18.4 22.5 18.1 22.4"
                stroke="#1de9b6" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <path d="M21 18H23.5" stroke="#1de9b6" strokeWidth="1.4" strokeLinecap="round" />
              <text x="18" y="31" textAnchor="middle" fontFamily="monospace" fontSize="6"
                fontWeight="bold" fill="#1de9b6" letterSpacing="2" opacity="0.7">SI</text>
            </svg>
            <span className="text-xl font-black tracking-[0.15em] text-white group-hover:text-[#1de9b6] transition-colors duration-300">DGSI</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item)}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7A7A7A] hover:text-[#1de9b6] transition-colors cursor-pointer">
                {item}
              </button>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 border border-[#1de9b6]/40 text-[#1de9b6] text-[10px] font-black uppercase tracking-[0.2em] hover:border-[#1de9b6] hover:bg-[#1de9b6]/8 transition-all group">
              <ShoppingBag size={13} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              Online Shop
            </a>
            <button onClick={() => scrollTo('contact')} className="flex items-center gap-2 px-5 py-2.5 bg-[#1de9b6] text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#5fffd9] transition-all group">
              <FileText size={13} className="opacity-80 group-hover:opacity-100 transition-opacity" />
              Request Quote
            </button>
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`w-5 h-px bg-current mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-px bg-current mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#080808] border-t border-[#1de9b6]/20 px-6 py-8 flex flex-col gap-6">
            {navItems.map(item => (
              <button key={item} onClick={() => scrollTo(item)}
                className="text-left text-xs font-bold uppercase tracking-[0.25em] text-[#F0EDE8] hover:text-[#1de9b6] transition-colors">
                {item}
              </button>
            ))}
            <a href="#" className="mt-4 flex items-center justify-center gap-2 px-6 py-3 border border-[#1de9b6]/40 text-[#1de9b6] text-[10px] font-black uppercase tracking-[0.2em]">
              <ShoppingBag size={13} />
              Online Shop
            </a>
            <button onClick={() => scrollTo('contact')} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1de9b6] text-black text-[10px] font-black uppercase tracking-[0.2em]">
              <FileText size={13} />
              Request Quote
            </button>
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

        <div className="absolute top-28 right-6 text-right hidden md:block">
          <p className="text-[9px] font-mono text-[#1de9b6]/50 tracking-widest">REF-DGSI-2025</p>
          <p className="text-[9px] font-mono text-[#4A4A4A] tracking-widest">INDUSTRIAL TOOLING & MANUFACTURING</p>
          <p className="text-[9px] font-mono text-[#4A4A4A] tracking-widest">PRECISION & EMERGENCY SOLUTIONS</p>
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
              <button onClick={() => scrollTo('services')} className="px-8 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-[10px] hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(29,233,182,0.25)]">
                Our Services
              </button>
              <button onClick={() => scrollTo('contact')} className="px-8 py-4 border border-white/15 text-white font-bold uppercase tracking-[0.15em] text-[10px] hover:border-[#1de9b6]/60 hover:text-[#1de9b6] transition-all">
                Request Quote
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] font-mono text-[#4A4A4A] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#1de9b6]/50 to-transparent animate-pulse" />
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
              <div className="mt-10 flex items-center gap-6">
                <button onClick={() => scrollTo('contact')} className="px-6 py-3 border border-[#1de9b6]/50 text-[#1de9b6] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1de9b6]/10 transition-all">
                  Learn More
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Authorized Distributor', desc: 'Official partner for 120+ global brands without MOQ constraints.' },
                { title: 'Emergency Manufacturing', desc: '48–72h custom CNC parts, electrodes, and assemblies.' },
                { title: 'Technical Audit', desc: 'Production line analysis and cost optimization consulting.' },
                { title: 'Tooling Customization', desc: 'Precision-engineered solutions based on your technical specs.' },
              ].map((f, i) => (
                <div key={i} className="p-6 bg-[#080808] border border-[#1de9b6]/10 hover:border-[#1de9b6]/40 transition-all group">
                  <div className="w-6 h-px bg-[#1de9b6] mb-4 group-hover:w-10 transition-all duration-300" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">{f.title}</h4>
                  <p className="text-[11px] text-[#5A5A5A] leading-relaxed">{f.desc}</p>
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
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10">
                  {/* Category Title */}
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white mb-6 pb-4 border-b border-[#1de9b6]/30 group-hover:border-[#1de9b6]/60 transition-all">
                    {prod.cat}
                  </h3>
                  
                  {/* Subcategory Items as Buttons */}
                  <div className="space-y-3">
                    {prod.items.map((item, idx) => (
                      <a
                        key={item}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-3 px-4 py-3 bg-white/90 text-black rounded-lg hover:bg-white hover:shadow-lg hover:shadow-[#1de9b6]/30 transition-all duration-300 group/btn transform hover:translate-x-1 cursor-pointer"
                      >
                        <span className="text-[#1de9b6] font-black text-sm group-hover/btn:text-lg transition-all">▸</span>
                        <span className="text-[13px] font-semibold text-gray-800 group-hover/btn:text-black transition-colors">
                          {item}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1de9b6]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Welding Electrodes Highlight */}
          <div className="mt-8 relative p-8 bg-gradient-to-r from-[#1de9b6]/10 to-transparent border border-[#1de9b6]/40 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22https://storage.googleapis.com/brandflow-bucket/magipattern/mockups/css-pattern-editor.webp><defs><pattern id=%22dots%22 x=%220%22 y=%220%22 width=%2220%22 height=%2220%22 patternUnits=%22userSpaceOnUse%22><circle cx=%2210%22 cy=%2210%22 r=%222%22 fill=%22%231de9b6%22 opacity=%220.05%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23dots)%22/></svg>')] opacity-40" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-[#1de9b6]/20 text-[#1de9b6] text-[10px] font-black uppercase tracking-widest rounded mb-3">Our Strength</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white">Projection Welding Electrodes</h3>
                </div>
                <Zap className="text-[#1de9b6] w-8 h-8 flex-shrink-0" />
              </div>
              <p className="text-[#8A8A8A] leading-relaxed max-w-2xl">
                Custom-engineered welding electrodes for projection welding, resistance spot welding, and advanced joining applications. Available on-demand with emergency 48-hour delivery for production line stoppages.
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
              {
                title: 'Industrial Tools & Consumables',
                desc: 'Authorized distributor for 120+ global brands. Multi-brand consolidation, no MOQ constraints, 1-year pricing guarantees.',
                icon: <Wrench />,
              },
              {
                title: 'Emergency Manufacturing',
                desc: 'Custom CNC-machined parts, projection welding electrodes, ceramics & assemblies. 48–72h delivery for critical production needs.',
                icon: <Zap />,
              },
              {
                title: 'Audit & Technical Consulting',
                desc: 'Production line & tooling analysis, cost optimization, risk identification, supplier portfolio optimization.',
                icon: <FileText />,
              },
              {
                title: 'Tooling Customization',
                desc: 'Tool regrinding, sharpening, die & mold repair, heat treatment, surface finishing. Precision-engineered solutions on spec.',
                icon: <Wrench />,
              },
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

      {/* ── CLIENTS & PARTNERS ─────────────────────────────────────────── */}
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
                  className="flex-shrink-0 h-32 w-40 bg-white/90 border border-white/40 hover:border-white hover:shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer rounded-md"
                >
                  {/* Logo container */}
                  <div className="flex items-center justify-center h-full w-full px-4">
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

      {/* ── PROCESS ────────────────────────────────────────────────────── */}
      <Section id="process">
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="06 /" label="How We Work" />
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-16">
            From Request<br />
            <span className="text-[#1de9b6]">to Delivery.</span>
          </h2>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-[#1de9b6]/15" />
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Technical Inquiry', desc: 'Send specs, drawings, or part numbers. Our engineers respond within 2 hours.' },
                { step: '02', title: 'Source & Quote', desc: 'Identify optimal sources from our network and deliver firm quotation.' },
                { step: '03', title: 'Order Confirmation', desc: 'Price locked, lead time confirmed, dedicated support assigned.' },
                { step: '04', title: 'Door-to-Dock', desc: 'Tracked delivery, documentation, and post-delivery technical support.' },
              ].map((p, i) => (
                <div key={i} className="relative pt-6">
                  <div className="relative z-10 w-16 h-16 border border-[#1de9b6]/30 bg-[#080808] flex items-center justify-center mb-6 group-hover:border-[#1de9b6] transition-all">
                    <span className="text-[10px] font-mono text-[#1de9b6] tracking-widest">{p.step}</span>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">{p.title}</h4>
                  <p className="text-[12px] text-[#5A5A5A] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── TRUST BANNER ───────────────────────────────────────────────── */}
      <div className="bg-[#1de9b6] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-mono text-black/50 tracking-widest uppercase mb-2">Next Step</p>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-black leading-tight">
              Let's Talk <br />About Your Production Needs.
            </h3>
          </div>
          <button onClick={() => scrollTo('contact')} className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#1A1A1A] transition-all flex-shrink-0">
            Start Conversation
          </button>
        </div>
      </div>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <Section id="contact" light>
        <div className="max-w-7xl mx-auto">
          <Eyebrow code="07 /" label="Contact" />
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white mb-6">
                Ready to<br />
                <span className="text-[#1de9b6]">Work Together?</span>
              </h2>
              <p className="text-[#5A5A5A] leading-relaxed mb-10">
                Send your technical inquiry and our team will respond with sourcing options and pricing within 2 business hours.
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Email', value: 'contact@dgsi.ro' },
                  { label: 'Phone', value: '+40 xxx xxx xxx' },
                  { label: 'Location', value: 'Romania — EU' },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-6 py-4 border-b border-[#1A1A1A]">
                    <span className="text-[9px] font-mono text-[#1de9b6]/60 tracking-widest uppercase w-16 shrink-0 pt-0.5">{c.label}</span>
                    <span className="text-sm text-[#F0EDE8]">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono text-[#4A4A4A] uppercase tracking-widest block mb-2">Company</label>
                  <input type="text" placeholder="Your company name" className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-[#1de9b6]/50 text-[#F0EDE8] text-sm px-4 py-3 outline-none transition-all placeholder:text-[#3A3A3A]" />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-[#4A4A4A] uppercase tracking-widest block mb-2">Contact Name</label>
                  <input type="text" placeholder="Full name" className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-[#1de9b6]/50 text-[#F0EDE8] text-sm px-4 py-3 outline-none transition-all placeholder:text-[#3A3A3A]" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-mono text-[#4A4A4A] uppercase tracking-widest block mb-2">Email</label>
                <input type="email" placeholder="business@company.com" className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-[#1de9b6]/50 text-[#F0EDE8] text-sm px-4 py-3 outline-none transition-all placeholder:text-[#3A3A3A]" />
              </div>
              <div>
                <label className="text-[9px] font-mono text-[#4A4A4A] uppercase tracking-widest block mb-2">Inquiry Type</label>
                <select className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-[#1de9b6]/50 text-[#7A7A7A] text-sm px-4 py-3 outline-none transition-all appearance-none">
                  <option value="">Select inquiry type</option>
                  <option>Industrial Tools & Consumables</option>
                  <option>Emergency CNC Manufacturing</option>
                  <option>Welding Electrodes</option>
                  <option>Audit & Consulting</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-mono text-[#4A4A4A] uppercase tracking-widest block mb-2">Details</label>
                <textarea rows={4} placeholder="Part numbers, quantities, specifications, timeline..."
                  className="w-full bg-[#080808] border border-[#1A1A1A] focus:border-[#1de9b6]/50 text-[#F0EDE8] text-sm px-4 py-3 outline-none transition-all placeholder:text-[#3A3A3A] resize-none" />
              </div>
              <button className="w-full py-4 bg-[#1de9b6] text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#5fffd9] transition-all shadow-[0_0_30px_rgba(29,233,182,0.2)]">
                Send Inquiry
              </button>
              <p className="text-[10px] text-[#3A3A3A] text-center font-mono">Response within 2 business hours · Confidential</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#050505] border-t border-[#1de9b6]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-12">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group cursor-pointer" aria-label="Go to homepage">
              <svg width="32" height="36" viewBox="0 0 36 40" fill="none" xmlns="https://thumbs.dreamstime.com/b/home-concept-blue-icon-vector-colorful-outline-house-symbol-real-estate-logo-dark-background-90138079.jpg"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <path d="M18 1L2 7.5V19C2 27.5 9 35 18 39C27 35 34 27.5 34 19V7.5L18 1Z"
                  stroke="#1de9b6" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                <path d="M18 4L5 9.8V19C5 26 10.8 32.5 18 36C25.2 32.5 31 26 31 19V9.8L18 4Z"
                  fill="#1de9b6" fillOpacity="0.06" />
                <text x="18" y="31" textAnchor="middle" fontFamily="monospace" fontSize="6"
                  fontWeight="bold" fill="#1de9b6" letterSpacing="2" opacity="0.7">SI</text>
              </svg>
              <span className="text-xl font-black tracking-[0.15em] text-white/50 group-hover:text-white transition-colors duration-300">DGSI</span>
            </button>
            <nav className="flex flex-wrap gap-8">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A4A4A] hover:text-[#1de9b6] transition-colors">
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="h-px bg-[#1de9b6]/10 mb-8" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-[10px] font-mono text-[#3A3A3A] tracking-widest">
              © 2025 DGSI · Industrial Tools, Manufacturing & Engineering · Romania
            </p>
            <p className="text-[9px] font-mono text-[#2A2A2A] tracking-widest">
              REF-DGSI-WEB-v2.0 · PRECISION IN EVERY PART
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
