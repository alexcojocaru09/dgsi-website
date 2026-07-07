import React, { useState, useContext, createContext, useEffect, useCallback } from 'react';
import { X, FileText, Plus, Check, Trash2, ChevronRight, ChevronLeft, ShoppingBag, Upload, Building2, Mail, Package, Send } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// RFQ SYSTEM — "Request for Quote" cart + builder for DGSI
//
// Two features in one:
//   1. Add-to-Quote: a B2B "cart" of requested items (no prices, just requests)
//   2. Smart RFQ Builder: a 3-step wizard that collects the request + contact
//
// ── PERSISTENCE NOTE ──────────────────────────────────────────────────────
// This uses in-memory React state (works everywhere, including artifacts).
// For your LIVE site (VS Code → Netlify), to make the cart survive page
// refreshes, add localStorage in the RFQProvider effect — see the comment
// marked  [LIVE-SITE LOCALSTORAGE]  below.
// ═══════════════════════════════════════════════════════════════════════════

const RFQContext = createContext(null);

export function useRFQ() {
  const ctx = useContext(RFQContext);
  if (!ctx) throw new Error('useRFQ must be used inside <RFQProvider>');
  return ctx;
}

export function RFQProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wizardOpen, setWizardOpen] = useState(false);

  // [LIVE-SITE LOCALSTORAGE] — uncomment these two effects on your real site
  // (they fail inside artifacts but work perfectly on Netlify):
  //
  // useEffect(() => {
  //   try {
  //     const saved = localStorage.getItem('dgsi-rfq');
  //     if (saved) setItems(JSON.parse(saved));
  //   } catch (e) { /* ignore */ }
  // }, []);
  // useEffect(() => {
  //   try { localStorage.setItem('dgsi-rfq', JSON.stringify(items)); } catch (e) { /* ignore */ }
  // }, [items]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev; // no duplicates
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearItems = useCallback(() => setItems([]), []);

  const hasItem = useCallback((id) => items.some((i) => i.id === id), [items]);

  const value = {
    items, addItem, removeItem, clearItems, hasItem,
    count: items.length,
    wizardOpen, setWizardOpen,
  };

  return <RFQContext.Provider value={value}>{children}</RFQContext.Provider>;
}

// ─── Add-to-RFQ button (used inside product modals) ────────────────────────
export function AddToRFQButton({ item, size = 'sm' }) {
  const { addItem, removeItem, hasItem } = useRFQ();
  const added = hasItem(item.id);

  const base = 'group/rfq flex items-center justify-center gap-2 font-black uppercase tracking-[0.15em] rounded-md transition-all duration-300';
  const dims = size === 'sm' ? 'px-3 py-2 text-[10px]' : 'px-5 py-3 text-[11px]';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        added ? removeItem(item.id) : addItem(item);
      }}
      className={`${base} ${dims} ${
        added
          ? 'bg-[#1de9b6]/15 text-[#1de9b6] border border-[#1de9b6]/40'
          : 'bg-white/[0.04] text-[#B8B8B8] border border-white/10 hover:border-[#1de9b6]/50 hover:text-[#1de9b6] hover:bg-[#1de9b6]/[0.06]'
      }`}
    >
      {added ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
      <span>{added ? 'Added' : 'Add to RFQ'}</span>
    </button>
  );
}

// ─── Floating RFQ badge (bottom, shows count, opens wizard) ─────────────────
export function RFQFloatingBadge() {
  const { count, setWizardOpen } = useRFQ();
  if (count === 0) return null;
  return (
    <button
      onClick={() => setWizardOpen(true)}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[56] flex items-center gap-3 px-6 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-xs rounded-full shadow-[0_4px_30px_rgba(29,233,182,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 animate-fade-in"
    >
      <FileText size={18} />
      <span>Review RFQ</span>
      <span className="flex items-center justify-center min-w-6 h-6 px-1.5 bg-black text-[#1de9b6] rounded-full text-xs font-black">{count}</span>
    </button>
  );
}

// ─── The Smart RFQ Builder wizard ──────────────────────────────────────────
const CATEGORY_OPTIONS = [
  'CNC Consumables', 'Projection Welding', 'Machining Tools', 'Toolholding',
  'Measurement', 'Abrasives & Sawing', 'Hand Tools', 'Protective Equipment', 'Other',
];

export function RFQWizard() {
  const { items, removeItem, clearItems, wizardOpen, setWizardOpen, count } = useRFQ();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [fileName, setFileName] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    document.body.style.overflow = wizardOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [wizardOpen]);

  // Pre-fill category if cart has items
  useEffect(() => {
    if (wizardOpen && items.length > 0 && !category) {
      setCategory(items[0].category || 'CNC Consumables');
    }
  }, [wizardOpen, items, category]);

  if (!wizardOpen) return null;

  const close = () => {
    setWizardOpen(false);
    setTimeout(() => { setStep(0); setSubmitted(false); }, 300);
  };

  const canProceed = () => {
    if (step === 0) return category !== '' || items.length > 0;
    if (step === 1) return details.trim() !== '' || items.length > 0 || fileName !== '';
    if (step === 2) return company.trim() !== '' && email.trim() !== '' && /\S+@\S+\.\S+/.test(email);
    return true;
  };

  const handleSubmit = () => {
    // ── LIVE SITE: wire this to Netlify Forms / Formspree / email service ──
    // The structured payload is ready below; POST it to your endpoint.
    const payload = {
      category,
      details,
      attachment: fileName || null,
      items: items.map((i) => ({ name: i.name, category: i.category })),
      contact: { company, name, email },
      ref: `DGSI-RFQ-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    console.log('RFQ submitted:', payload); // replace with real submit on live site
    setSubmitted(true);
    clearItems();
  };

  const steps = ['What you need', 'Specifications', 'Your details'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in" onClick={close}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-[#0A0A0A] to-[#0a1714] border border-[#1de9b6]/40 shadow-[0_0_80px_rgba(29,233,182,0.2)] rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#1de9b6] z-20" />
        <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#1de9b6] z-20" />
        <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#1de9b6] z-20" />
        <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#1de9b6] z-20" />

        {submitted ? (
          /* ── SUCCESS STATE ── */
          <div className="p-10 md:p-14 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#1de9b6]/15 border-2 border-[#1de9b6] flex items-center justify-center mb-8">
              <Check size={40} strokeWidth={3} className="text-[#1de9b6]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">Request Received</h3>
            <p className="text-[#C0C0C0] text-lg leading-relaxed max-w-md mb-8">
              Thank you. Our engineers will review your request and reply within <span className="text-[#1de9b6] font-bold">one business day</span> with sourcing options and a locked quote.
            </p>
            <button onClick={close} className="px-8 py-4 bg-[#1de9b6] text-black font-black uppercase tracking-[0.15em] text-xs rounded-sm hover:bg-white transition-all">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-[#1de9b6]/20 text-[#1de9b6] text-[10px] font-black uppercase tracking-[0.2em] rounded">RFQ Builder</span>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">Request a Quote</h2>
              </div>
              <button onClick={close} className="text-[#7A7A7A] hover:text-white transition-colors bg-[#111] hover:bg-[#1a1a1a] p-2.5 rounded-full">
                <X size={22} />
              </button>
            </div>

            {/* STEP INDICATOR */}
            <div className="relative z-10 flex items-center gap-2 px-6 md:px-8 py-4 border-b border-white/5 shrink-0">
              {steps.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black font-mono transition-all ${
                      i < step ? 'bg-[#1de9b6]/15 text-[#1de9b6] border border-[#1de9b6]'
                      : i === step ? 'bg-[#1de9b6] text-black shadow-[0_0_12px_rgba(29,233,182,0.4)]'
                      : 'bg-white/5 text-[#555] border border-white/10'
                    }`}>
                      {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest hidden sm:block ${i === step ? 'text-[#1de9b6]' : 'text-[#666]'}`}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-[#1de9b6]/40' : 'bg-white/10'}`} />}
                </React.Fragment>
              ))}
            </div>

            {/* BODY */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8">

              {/* Cart items summary (shown on all steps if present) */}
              {count > 0 && (
                <div className="mb-6 p-4 bg-[#1de9b6]/[0.04] border border-[#1de9b6]/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Package size={14} className="text-[#1de9b6]" />
                    <span className="text-[10px] font-mono text-[#1de9b6] tracking-[0.2em] uppercase">Your RFQ List ({count})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item.id} className="group/chip flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white/[0.03] border border-white/10 rounded-md text-[12px] text-[#D8D8D8]">
                        {item.name}
                        <button onClick={() => removeItem(item.id)} className="text-[#666] hover:text-[#ff6b6b] transition-colors">
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 0 — Category */}
              {step === 0 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-black uppercase text-white mb-2">What are you looking for?</h3>
                  <p className="text-[#999] text-sm mb-6">Select the area that best matches your need — no commitment, just a request.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          category === cat
                            ? 'bg-[#1de9b6]/10 border-[#1de9b6] text-white shadow-[0_0_16px_rgba(29,233,182,0.12)]'
                            : 'bg-white/[0.03] border-white/10 text-[#C0C0C0] hover:border-[#1de9b6]/40 hover:text-white'
                        }`}
                      >
                        <span className="text-[13px] font-bold">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1 — Specs */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-black uppercase text-white mb-2">Tell us the specifics</h3>
                  <p className="text-[#999] text-sm mb-6">Part numbers, dimensions, quantities, or a technical drawing — whatever you have.</p>

                  <label className="block mb-2 text-[10px] font-mono text-[#888] uppercase tracking-widest">Description</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows="5"
                    placeholder="e.g. 50x carbide end mills Ø10mm, or SMC part number XYZ, or describe what you need..."
                    className="w-full bg-[#080808] border border-white/10 p-4 text-sm text-white focus:border-[#1de9b6] outline-none rounded-md resize-none transition-all mb-5 placeholder:text-[#555]"
                  />

                  <label className="block mb-2 text-[10px] font-mono text-[#888] uppercase tracking-widest">Attach drawing (optional)</label>
                  <label className="flex items-center gap-3 p-4 bg-[#080808] border border-dashed border-white/15 rounded-md cursor-pointer hover:border-[#1de9b6]/40 transition-all">
                    <Upload size={18} className="text-[#1de9b6]" />
                    <span className="text-sm text-[#999]">{fileName || 'Click to upload PDF, DXF, STEP, or image'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    />
                  </label>
                </div>
              )}

              {/* STEP 2 — Contact */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-black uppercase text-white mb-2">Where do we send the quote?</h3>
                  <p className="text-[#999] text-sm mb-6">We'll reply within one business day. No spam, ever.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-[10px] font-mono text-[#888] uppercase tracking-widest flex items-center gap-2"><Building2 size={12} /> Company *</label>
                      <input
                        type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company name"
                        className="w-full bg-[#080808] border border-white/10 p-4 text-sm text-white focus:border-[#1de9b6] outline-none rounded-md transition-all placeholder:text-[#555]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[10px] font-mono text-[#888] uppercase tracking-widest">Contact name</label>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Your name (optional)"
                        className="w-full bg-[#080808] border border-white/10 p-4 text-sm text-white focus:border-[#1de9b6] outline-none rounded-md transition-all placeholder:text-[#555]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[10px] font-mono text-[#888] uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Business email *</label>
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-[#080808] border border-white/10 p-4 text-sm text-white focus:border-[#1de9b6] outline-none rounded-md transition-all placeholder:text-[#555]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER — navigation */}
            <div className="relative z-10 flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-t border-white/10 shrink-0">
              <button
                onClick={() => step > 0 ? setStep(step - 1) : close()}
                className="flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-[#999] hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
                {step > 0 ? 'Back' : 'Cancel'}
              </button>

              {step < 2 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-sm transition-all ${
                    canProceed() ? 'bg-[#1de9b6] text-black hover:bg-white cursor-pointer' : 'bg-white/5 text-[#555] cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => canProceed() && handleSubmit()}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-sm transition-all ${
                    canProceed() ? 'bg-[#1de9b6] text-black hover:bg-white shadow-[0_0_20px_rgba(29,233,182,0.3)] cursor-pointer' : 'bg-white/5 text-[#555] cursor-not-allowed'
                  }`}
                >
                  <Send size={15} /> Submit Request
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}