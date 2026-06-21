import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SUBCATEGORY ICONS
//
// Hand-drawn technical SVG icons, one per product subcategory.
// Animations are tied to ".group-hover" on the parent card — they only run
// when the user hovers the card that contains them (no "circus" of motion).
//
// Required CSS animations (defined in src/index.css):
//   spin-cw, spin-cw-fast, spin-ccw, drill-down, saw-cut,
//   spark, pulse-grip, shake-tap, measure-slide
// ═══════════════════════════════════════════════════════════════════════════

const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// ─── MACHINING ─────────────────────────────────────────────────────────────
function IconHolemaking({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-drill-down" style={{ transformBox: 'fill-box' }}>
        <rect x="13" y="3" width="6" height="9" rx="1" fill="currentColor" opacity="0.25"/>
        <path d="M14 12 L18 12 L17 26 C16.7 27.5 15.3 27.5 15 26 Z" fill="currentColor" opacity="0.45"/>
        <path d="M14.5 14 Q 16 17, 17.5 14"/>
        <path d="M14.5 18 Q 16 21, 17.5 18"/>
        <path d="M14.5 22 Q 16 25, 17.5 22"/>
      </g>
    </svg>
  );
}

function IconThreading({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-shake-tap" style={{ transformBox: 'fill-box' }}>
        <rect x="13" y="4" width="6" height="5" rx="0.5" fill="currentColor" opacity="0.3"/>
        <path d="M11 9 L21 9"/>
        <path d="M11 12 L21 14"/>
        <path d="M11 15 L21 17"/>
        <path d="M11 18 L21 20"/>
        <path d="M11 21 L21 23"/>
        <path d="M13 9 L13 25 L19 25 L19 9"/>
      </g>
    </svg>
  );
}

function IconParting({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="4" y="14" width="16" height="5" fill="currentColor" opacity="0.25"/>
      <g className="group-hover:animate-saw-cut">
        <path d="M22 9 L26 9 L26 24 L22 24 Z" fill="currentColor" opacity="0.5"/>
        <path d="M22 11 L21 12 L22 13"/>
        <path d="M22 15 L21 16 L22 17"/>
        <path d="M22 19 L21 20 L22 21"/>
      </g>
      <circle cx="6" cy="22" r="0.8" fill="currentColor" className="group-hover:animate-spark"/>
      <circle cx="9" cy="23" r="0.6" fill="currentColor" className="group-hover:animate-spark" style={{ animationDelay: '0.3s' }}/>
    </svg>
  );
}

function IconTurning({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-cw" style={{ transformBox: 'fill-box' }}>
        <circle cx="16" cy="16" r="9" fill="currentColor" opacity="0.15"/>
        <circle cx="16" cy="16" r="9"/>
        <line x1="16" y1="7" x2="16" y2="11"/>
        <line x1="25" y1="16" x2="21" y2="16"/>
        <line x1="16" y1="25" x2="16" y2="21"/>
        <line x1="7" y1="16" x2="11" y2="16"/>
      </g>
      <path d="M27 14 L29 12 L27 10"/>
      <path d="M27 12 L23 12"/>
    </svg>
  );
}

function IconMilling({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="12" y="3" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <g className="origin-center group-hover:animate-spin-cw-fast" style={{ transformBox: 'fill-box', transformOrigin: '16px 20px' }}>
        <circle cx="16" cy="20" r="6" fill="currentColor" opacity="0.2"/>
        <path d="M11 18 L21 18 M11 22 L21 22 M13 16 L13 24 M19 16 L19 24"/>
        <circle cx="16" cy="20" r="6"/>
      </g>
      <line x1="16" y1="9" x2="16" y2="14"/>
    </svg>
  );
}

// ─── TOOLHOLDING / CLAMPING ────────────────────────────────────────────────
function IconToolholders({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <path d="M10 4 L22 4 L20 10 L12 10 Z" fill="currentColor" opacity="0.3"/>
      <g className="origin-center group-hover:animate-pulse-grip" style={{ transformBox: 'fill-box' }}>
        <path d="M12 10 L14 22 L18 22 L20 10"/>
        <line x1="14" y1="16" x2="18" y2="16"/>
      </g>
      <line x1="16" y1="22" x2="16" y2="28"/>
      <line x1="13" y1="28" x2="19" y2="28"/>
    </svg>
  );
}

function IconColletChucks({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="13" y="3" width="6" height="6" fill="currentColor" opacity="0.4"/>
      <g className="origin-center group-hover:animate-pulse-grip" style={{ transformBox: 'fill-box' }}>
        <path d="M11 9 L13 14 L13 24 L19 24 L19 14 L21 9 Z"/>
        <line x1="13" y1="18" x2="19" y2="18" strokeDasharray="1 1"/>
      </g>
    </svg>
  );
}

function IconLatheChucks({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-ccw" style={{ transformBox: 'fill-box' }}>
        <circle cx="16" cy="16" r="10"/>
        <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.4"/>
        <line x1="16" y1="6" x2="16" y2="9"/>
        <line x1="26" y1="16" x2="23" y2="16"/>
        <line x1="16" y1="26" x2="16" y2="23"/>
        <line x1="6" y1="16" x2="9" y2="16"/>
      </g>
    </svg>
  );
}

function IconMachineVises({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="4" y="14" width="24" height="6" fill="currentColor" opacity="0.3"/>
      <g className="origin-center group-hover:animate-pulse-grip" style={{ transformBox: 'fill-box', transformOrigin: '16px 17px' }}>
        <rect x="6" y="10" width="4" height="10"/>
        <rect x="22" y="10" width="4" height="10"/>
      </g>
      <rect x="13" y="11" width="6" height="6" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

function IconRigidClamping({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="6" y="14" width="20" height="4" fill="currentColor" opacity="0.3"/>
      <g className="origin-center group-hover:animate-pulse-grip" style={{ transformBox: 'fill-box' }}>
        <path d="M10 14 L10 8 L14 8 L14 14"/>
        <path d="M18 14 L18 8 L22 8 L22 14"/>
      </g>
      <line x1="6" y1="22" x2="26" y2="22" strokeDasharray="2 2"/>
    </svg>
  );
}

// ─── MEASUREMENT ───────────────────────────────────────────────────────────
function IconMicrometers({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="4" y="13" width="24" height="6" rx="0.5" fill="currentColor" opacity="0.2"/>
      <g className="group-hover:animate-measure-slide">
        <rect x="10" y="11" width="6" height="10" fill="currentColor" opacity="0.4"/>
        <circle cx="13" cy="16" r="1.5"/>
      </g>
      <line x1="6" y1="13" x2="6" y2="11"/>
      <line x1="12" y1="13" x2="12" y2="11"/>
      <line x1="18" y1="13" x2="18" y2="11"/>
      <line x1="24" y1="13" x2="24" y2="11"/>
    </svg>
  );
}

function IconDialIndicators({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <circle cx="16" cy="16" r="11" fill="currentColor" opacity="0.1"/>
      <circle cx="16" cy="16" r="11"/>
      <g className="origin-center group-hover:animate-spin-cw-fast" style={{ transformBox: 'fill-box', transformOrigin: '16px 16px' }}>
        <line x1="16" y1="16" x2="16" y2="8" strokeWidth="2"/>
      </g>
      <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
      <line x1="16" y1="7" x2="16" y2="9"/>
      <line x1="25" y1="16" x2="23" y2="16"/>
      <line x1="16" y1="25" x2="16" y2="23"/>
      <line x1="7" y1="16" x2="9" y2="16"/>
    </svg>
  );
}

function IconFeelerGauges({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="group-hover:animate-measure-slide">
        <path d="M4 16 L10 12 L10 20 Z" fill="currentColor" opacity="0.4"/>
        <path d="M8 16 L14 14 L14 18 Z" fill="currentColor" opacity="0.5"/>
        <path d="M12 16 L18 15 L18 17 Z" fill="currentColor" opacity="0.6"/>
      </g>
      <line x1="22" y1="10" x2="22" y2="22" strokeDasharray="2 2"/>
    </svg>
  );
}

function IconCalipers({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <line x1="4" y1="20" x2="28" y2="20"/>
      <g className="group-hover:animate-measure-slide">
        <rect x="9" y="14" width="3" height="6" fill="currentColor" opacity="0.4"/>
        <rect x="20" y="14" width="3" height="6" fill="currentColor" opacity="0.4"/>
      </g>
      <line x1="4" y1="20" x2="4" y2="17"/>
      <line x1="10" y1="20" x2="10" y2="18"/>
      <line x1="16" y1="20" x2="16" y2="17"/>
      <line x1="22" y1="20" x2="22" y2="18"/>
      <line x1="28" y1="20" x2="28" y2="17"/>
    </svg>
  );
}

function IconSmartSensors({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="6" y="6" width="20" height="20" rx="3" fill="currentColor" opacity="0.15"/>
      <rect x="6" y="6" width="20" height="20" rx="3"/>
      <circle cx="16" cy="16" r="3" fill="currentColor" className="group-hover:animate-spark" style={{ animationDuration: '2s' }}/>
      <line x1="16" y1="6" x2="16" y2="3"/>
      <line x1="16" y1="26" x2="16" y2="29"/>
      <line x1="6" y1="16" x2="3" y2="16"/>
      <line x1="26" y1="16" x2="29" y2="16"/>
    </svg>
  );
}

// ─── ABRASIVES & SAWING ────────────────────────────────────────────────────
function IconAbrasiveDiscs({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-cw-fast" style={{ transformBox: 'fill-box' }}>
        <circle cx="16" cy="16" r="10" fill="currentColor" opacity="0.15"/>
        <circle cx="16" cy="16" r="10"/>
        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.5"/>
        <line x1="16" y1="6" x2="16" y2="9"/>
        <line x1="25.07" y1="11" x2="22.4" y2="12.6"/>
        <line x1="25.07" y1="21" x2="22.4" y2="19.4"/>
        <line x1="16" y1="26" x2="16" y2="23"/>
        <line x1="6.93" y1="21" x2="9.6" y2="19.4"/>
        <line x1="6.93" y1="11" x2="9.6" y2="12.6"/>
      </g>
      <circle cx="4" cy="22" r="0.7" fill="currentColor" className="group-hover:animate-spark"/>
      <circle cx="28" cy="22" r="0.7" fill="currentColor" className="group-hover:animate-spark" style={{ animationDelay: '0.4s' }}/>
    </svg>
  );
}

function IconWireBrushes({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-cw" style={{ transformBox: 'fill-box' }}>
        <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.3"/>
        <line x1="16" y1="4" x2="16" y2="10"/>
        <line x1="16" y1="22" x2="16" y2="28"/>
        <line x1="4" y1="16" x2="10" y2="16"/>
        <line x1="22" y1="16" x2="28" y2="16"/>
        <line x1="7.5" y1="7.5" x2="11.7" y2="11.7"/>
        <line x1="20.3" y1="20.3" x2="24.5" y2="24.5"/>
        <line x1="24.5" y1="7.5" x2="20.3" y2="11.7"/>
        <line x1="11.7" y1="20.3" x2="7.5" y2="24.5"/>
      </g>
    </svg>
  );
}

function IconSawBlades({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="group-hover:animate-saw-cut">
        <path d="M4 18 L7 14 L10 18 L13 14 L16 18 L19 14 L22 18 L25 14 L28 18 Z" fill="currentColor" opacity="0.4"/>
        <line x1="4" y1="22" x2="28" y2="22"/>
      </g>
    </svg>
  );
}

function IconPrecisionFiles({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="group-hover:animate-saw-cut">
        <path d="M6 22 L22 6 L26 10 L10 26 Z" fill="currentColor" opacity="0.3"/>
        <line x1="9" y1="19" x2="13" y2="23"/>
        <line x1="12" y1="16" x2="16" y2="20"/>
        <line x1="15" y1="13" x2="19" y2="17"/>
        <line x1="18" y1="10" x2="22" y2="14"/>
      </g>
      <path d="M22 6 L26 10" strokeWidth="2"/>
    </svg>
  );
}

function IconSpareParts({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-cw" style={{ transformBox: 'fill-box', animationDuration: '3s' }}>
        <circle cx="16" cy="16" r="3" fill="currentColor"/>
        <circle cx="16" cy="16" r="8" strokeDasharray="2 3"/>
        <path d="M16 4 L18 8 L14 8 Z" fill="currentColor" opacity="0.5"/>
        <path d="M28 16 L24 18 L24 14 Z" fill="currentColor" opacity="0.5"/>
        <path d="M16 28 L14 24 L18 24 Z" fill="currentColor" opacity="0.5"/>
        <path d="M4 16 L8 14 L8 18 Z" fill="currentColor" opacity="0.5"/>
      </g>
    </svg>
  );
}

// ─── HAND TOOLS ────────────────────────────────────────────────────────────
function IconFastening({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-shake-tap" style={{ transformBox: 'fill-box' }}>
        <path d="M22 4 L28 10 L24 14 L18 8 Z" fill="currentColor" opacity="0.4"/>
        <path d="M18 8 L8 18 L4 22 L10 28 L14 24 L24 14"/>
        <circle cx="20" cy="12" r="1.5" fill="currentColor"/>
      </g>
    </svg>
  );
}

function IconTorqueTools({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-spin-cw" style={{ transformBox: 'fill-box', animationDuration: '1.4s' }}>
        <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.4"/>
        <line x1="16" y1="6" x2="16" y2="10"/>
        <path d="M22 8 L19 11"/>
        <line x1="26" y1="16" x2="22" y2="16"/>
      </g>
      <rect x="13" y="20" width="6" height="8" rx="1" fill="currentColor" opacity="0.3"/>
      <line x1="11" y1="28" x2="21" y2="28"/>
    </svg>
  );
}

function IconImpactTools({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-shake-tap" style={{ transformBox: 'fill-box', animationDuration: '0.25s' }}>
        <rect x="11" y="3" width="10" height="14" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="14" y="17" width="4" height="6" fill="currentColor" opacity="0.6"/>
      </g>
      <line x1="14" y1="23" x2="14" y2="29"/>
      <line x1="18" y1="23" x2="18" y2="29"/>
      <circle cx="4" cy="10" r="0.8" fill="currentColor" className="group-hover:animate-spark"/>
      <circle cx="28" cy="10" r="0.8" fill="currentColor" className="group-hover:animate-spark" style={{ animationDelay: '0.3s' }}/>
    </svg>
  );
}

function IconCuttingTools({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <g className="origin-center group-hover:animate-pulse-grip" style={{ transformBox: 'fill-box' }}>
        <path d="M4 8 L14 16 L4 24" fill="currentColor" opacity="0.3"/>
        <path d="M28 8 L18 16 L28 24" fill="currentColor" opacity="0.3"/>
        <line x1="4" y1="8" x2="14" y2="16"/>
        <line x1="4" y1="24" x2="14" y2="16"/>
        <line x1="28" y1="8" x2="18" y2="16"/>
        <line x1="28" y1="24" x2="18" y2="16"/>
        <line x1="14" y1="16" x2="18" y2="16"/>
      </g>
    </svg>
  );
}

function IconToolSets({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="4" y="10" width="24" height="16" rx="1.5" fill="currentColor" opacity="0.15"/>
      <rect x="4" y="10" width="24" height="16" rx="1.5"/>
      <path d="M11 10 L11 7 L21 7 L21 10"/>
      <line x1="4" y1="16" x2="28" y2="16"/>
      <line x1="14" y1="13" x2="18" y2="13"/>
      <line x1="14" y1="22" x2="18" y2="22"/>
    </svg>
  );
}

// ─── PROTECTIVE EQUIPMENT ──────────────────────────────────────────────────
function IconHandProtection({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <path d="M16 4 C 9 4, 7 12, 9 18 L9 26 L11 28 L21 28 L23 26 L23 18 C25 12, 23 4, 16 4 Z" fill="currentColor" opacity="0.2"/>
      <path d="M16 4 C 9 4, 7 12, 9 18 L9 26 L11 28 L21 28 L23 26 L23 18 C25 12, 23 4, 16 4 Z"/>
      <line x1="13" y1="14" x2="13" y2="16"/>
      <line x1="19" y1="14" x2="19" y2="16"/>
    </svg>
  );
}

function IconHeadProtection({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <path d="M6 20 C 6 10, 26 10, 26 20" fill="currentColor" opacity="0.25"/>
      <path d="M6 20 C 6 10, 26 10, 26 20"/>
      <line x1="4" y1="20" x2="28" y2="20"/>
      <line x1="4" y1="22" x2="28" y2="22"/>
      <line x1="14" y1="14" x2="18" y2="14"/>
    </svg>
  );
}

function IconWorkwear({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <path d="M12 4 L20 4 L21 8 L24 9 L25 14 L23 16 L23 26 L19 28 L13 28 L9 26 L9 16 L7 14 L8 9 L11 8 Z" fill="currentColor" opacity="0.2"/>
      <path d="M12 4 L20 4 L21 8 L24 9 L25 14 L23 16 L23 26 L19 28 L13 28 L9 26 L9 16 L7 14 L8 9 L11 8 Z"/>
      <line x1="14" y1="12" x2="18" y2="12"/>
    </svg>
  );
}

function IconFootwear({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <path d="M6 22 L8 26 L18 26 L26 22 L26 18 L18 14 L10 14 L6 18 Z" fill="currentColor" opacity="0.25"/>
      <path d="M6 22 L8 26 L18 26 L26 22 L26 18 L18 14 L10 14 L6 18 Z"/>
      <line x1="6" y1="18" x2="26" y2="18"/>
      <line x1="14" y1="14" x2="14" y2="11"/>
      <line x1="14" y1="11" x2="20" y2="11"/>
    </svg>
  );
}

function IconFirstAid({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
      <rect x="6" y="8" width="20" height="18" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="6" y="8" width="20" height="18" rx="2"/>
      <g className="origin-center group-hover:animate-shake-tap" style={{ transformBox: 'fill-box' }}>
        <line x1="16" y1="13" x2="16" y2="21" strokeWidth="2.5"/>
        <line x1="12" y1="17" x2="20" y2="17" strokeWidth="2.5"/>
      </g>
    </svg>
  );
}

// ─── REGISTRY ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  // Machining
  'Holemaking & Boring': IconHolemaking,
  'Threading & Tapping': IconThreading,
  'Parting & Cutting-off': IconParting,
  'Turning': IconTurning,
  'Milling': IconMilling,
  // Toolholding
  'Toolholders': IconToolholders,
  'Collet Chucks': IconColletChucks,
  'Lathe Chucks': IconLatheChucks,
  'Machine Vises': IconMachineVises,
  'Rigid Clamping': IconRigidClamping,
  // Measurement
  'Micrometers': IconMicrometers,
  'Dial Indicators': IconDialIndicators,
  'Feeler Gauges': IconFeelerGauges,
  'Calipers': IconCalipers,
  'Smart Sensors': IconSmartSensors,
  // Abrasives
  'Abrasive Discs': IconAbrasiveDiscs,
  'Wire Brushes': IconWireBrushes,
  'Saw Blades': IconSawBlades,
  'Precision Files': IconPrecisionFiles,
  'Spare Parts': IconSpareParts,
  // Hand Tools
  'Fastening & Assembly': IconFastening,
  'Torque Tools': IconTorqueTools,
  'Impact Tools': IconImpactTools,
  'Cutting Tools': IconCuttingTools,
  'Tool Sets': IconToolSets,
  // Protective
  'Hand Protection': IconHandProtection,
  'Head Protection': IconHeadProtection,
  'Workwear & Footwear': IconWorkwear,
  'Fall Protection': IconFootwear,
  'First Aid': IconFirstAid,
};

export default function SubcategoryIcon({ name, size = 32 }) {
  const Cmp = ICON_MAP[name];
  if (!Cmp) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" {...baseProps}>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
      </svg>
    );
  }
  return <Cmp size={size} />;
}
