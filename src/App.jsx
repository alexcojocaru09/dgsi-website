import React, { useState } from 'react';
import { Menu, X, Zap, Settings, Shield, Wrench } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-gray-200 font-sans selection:bg-[#00FF66] selection:text-black">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-3xl font-black tracking-tighter text-white">DGSI</div>
          <nav className="hidden md:flex gap-8">
            {['About', 'Products', 'Capabilities', 'Partners'].map(item => (
              <a key={item} href="#" className="text-xs font-bold uppercase tracking-widest hover:text-[#00FF66] transition-colors">{item}</a>
            ))}
          </nav>
          <button className="hidden md:block px-6 py-2 border border-[#00FF66] text-[#00FF66] text-xs font-bold uppercase tracking-widest hover:bg-[#00FF66] hover:text-black transition-all">
            Contact
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        {/* Imaginea de fundal - Cale actualizată exact conform fișierului tău */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-block px-3 py-1 mb-6 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest bg-[#00E5FF]/10 backdrop-blur">
            Industrial Engineering Excellence
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white mb-6">
            Precision in <br />
            <span className="text-[#00FF66]">Every Part.</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-400 font-light mb-10 border-l border-[#00FF66] pl-6 leading-relaxed">
            Your strategic partner for premium multi-brand integration, 
            emergency custom manufacturing, and guaranteed price stability.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-[#00FF66] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)]">
              Explore Services
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:border-[#00FF66] hover:text-[#00FF66] transition-all">
              Request Audit
            </button>
          </div>
        </div>
      </section>

      {/* GRID VALORI */}
      <section className="py-24 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Emergency Manufacturing", icon: <Zap /> },
            { title: "Industrial Services", icon: <Settings /> },
            { title: "Global Procurement", icon: <Shield /> },
            { title: "Technical Consulting", icon: <Wrench /> }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-[#0B0B0B] border border-white/5 hover:border-[#00FF66]/50 transition-all group">
              <div className="text-[#00FF66] mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-white">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
