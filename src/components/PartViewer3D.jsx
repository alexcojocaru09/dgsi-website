// src/components/PartViewer3D.jsx
// versiune · 2026-v6 · buton 2D deschide PDF-ul cu cartuș (nu doar poza)
// Viewer 3D real (Three.js r128) — solid de revoluție din secțiunea 2D.
//
// CAMERĂ:
//   • PerspectiveCamera pentru vederile Iso/Sus/Jos/Față + orbit natural.
//   • OrthographicCamera activată automat când e apăsat „Cote" — ZERO
//     distorsiune de perspectivă, exact ca un desen CAD 2D.
//
// GEOMETRIE:
//   • LatheGeometry cu 360 segmente radiale (contur circular neted).
//   • toNonIndexed + normale per-față → muchii ascuțite CAD.
//
// COTE 3D:
//   1. GENERIC — profile.dims3d.items = [ { type, ...coords, label, radial }, ... ]
//      Coordonate în RAW frame (Y=0 la bază), match cu lathePoints.
//      Types: 'diameter' | 'length' | 'leader'. `radial:true` = mereu vizibilă;
//      `radial:false` = fade când modelul e cu spatele la cameră.
//   2. LEGACY — fallback pentru piese fără `items` (păstrează cotele TMP-001).
//
// BUTON 2D:
//   • profile.pdf = URL către PDF-ul cu cartuș (desen tehnic complet + tabel).
//     Click deschide PDF-ul într-un tab nou (window.open) — randare nativă
//     a browserului, nu overlay custom.
//   • Fallback: dacă profile.pdf lipsește dar profile.drawing2d există,
//     deschide poza într-un lightbox in-page (comportament vechi).
//
// Necesită: three@0.128.0

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Scissors, Ruler, FileText, X } from 'lucide-react';

const VIEWS = {
  iso:  { th: 0.6, ph: 1.15, r: 1.0 },
  fata: { th: 0,   ph: Math.PI / 2, r: 1.0 },
  sus:  { th: 0,   ph: 0.05, r: 0.95 },
  jos:  { th: 0,   ph: Math.PI - 0.05, r: 0.95 },
};

// ── PRESET-URI DE MATERIAL ──────────────────────────────────────────────
// Valori calibrate după fotografii reale ale consumabilelor RPW.
// Se aplică prin profile.material3d = 'zro2' | 'kcf' | 'cupru'.
// Orice câmp explicit din profile (color/metalness/roughness) are prioritate.
const MATERIALS = {
  // Zirconia ZrO2 (Cerazur®) — alb-ivoriu cald, satinat, ușor translucid la muchii
  zro2: {
    color: 0xf0e9dd,
    metalness: 0.02,
    roughness: 0.38,
    envMapIntensity: 0.55,
    clearcoat: 0.35,          // luciu satinat de suprafață
    clearcoatRoughness: 0.30,
    edgeColor: 0x6b655b,
    edgeOpacity: 0.45,
    grain: 0.045,             // micro-relief subtil (ceramică fină)
  },
  // KCF — gri-antracit închis cu tentă caldă, mat, aproape fără reflexii
  kcf: {
    color: 0x3b3733,
    metalness: 0.04,
    roughness: 0.72,
    envMapIntensity: 0.35,
    clearcoat: 0.08,
    clearcoatRoughness: 0.70,
    edgeColor: 0x15120f,
    edgeOpacity: 0.45,
    grain: 0.09,              // textură mată, mai pronunțată
  },
  // Cupru / CuCoBe — pentru electrozi (păstrat pentru compatibilitate)
  cupru: {
    color: 0xc06b32,
    metalness: 0.88,
    roughness: 0.42,
    envMapIntensity: 0.70,
    clearcoat: 0,
    clearcoatRoughness: 0.5,
    edgeColor: 0x1b0f06,
    edgeOpacity: 0.55,
    grain: 0.02,
  },
};

export default function PartViewer3D({ profile }) {
  const mountRef = useRef(null);
  const apiRef = useRef({});
  const [rot, setRot] = useState(true);
  const [sec, setSec] = useState(false);
  const [dim, setDim] = useState(false);
  const [view, setView] = useState('iso');
  const [show2d, setShow2d] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !profile) return;
    const W = mount.clientWidth || 500, H = mount.clientHeight || 420;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.localClippingEnabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // ── CAMERE ──────────────────────────────────────────────────────────
    const perspCam = new THREE.PerspectiveCamera(35, W / H, 0.1, 1000);
    const orthoBase = profile.orthoSize
      || ((profile.height || 22) / 2 * 1.35 + 8);
    let orthoScale = 1;
    const orthoCam = new THREE.OrthographicCamera(
      -orthoBase * (W / H), orthoBase * (W / H),
      orthoBase, -orthoBase,
      0.1, 1000
    );
    let activeCam = perspCam;
    const applyOrthoFrustum = () => {
      const w = mount.clientWidth || W, h = mount.clientHeight || H;
      const aspect = w / h;
      const s = orthoBase * orthoScale;
      orthoCam.left = -s * aspect;
      orthoCam.right = s * aspect;
      orthoCam.top = s;
      orthoCam.bottom = -s;
      orthoCam.updateProjectionMatrix();
    };
    applyOrthoFrustum();

    // preset de material (necesar pentru mediu + lumini + material)
    const M = MATERIALS[profile.material3d] || MATERIALS.cupru;
    const isCeramic = (profile.material3d === 'zro2' || profile.material3d === 'kcf');

    // ── MEDIU STUDIO ────────────────────────────────────────────────────
    // Pentru metal: contrast mare (reflexii vii). Pentru ceramică: softbox
    // difuz, fără hot-spots dure — altfel suprafața pare lucioasă nefiresc.
    (function () {
      const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
      const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 512);
      if (isCeramic) {
        g.addColorStop(0, '#e9ece9'); g.addColorStop(.4, '#b9c0bc');
        g.addColorStop(.7, '#5c6663'); g.addColorStop(1, '#232927');
      } else {
        g.addColorStop(0, '#d2d6d2'); g.addColorStop(.35, '#8f9a94');
        g.addColorStop(.6, '#39423e'); g.addColorStop(1, '#0d1210');
      }
      x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
      const s = x.createLinearGradient(0, 50, 0, 240);
      const a = isCeramic ? .28 : .45;   // softbox mai blând pe ceramică
      s.addColorStop(0, 'rgba(255,252,246,0)');
      s.addColorStop(.5, `rgba(255,252,246,${a})`);
      s.addColorStop(1, 'rgba(255,252,246,0)');
      x.fillStyle = s; x.fillRect(0, 50, 1024, 190);
      const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping;
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromEquirectangular(t).texture;
    })();

    scene.add(new THREE.HemisphereLight(0xe8ede9, isCeramic ? 0x1a1d1b : 0x11201a, isCeramic ? 0.85 : 0.7));
    const key = new THREE.DirectionalLight(0xfff6ec, isCeramic ? 1.15 : 0.95); key.position.set(18, 30, 22); scene.add(key);
    // rim: pe ceramică albă un accent teal puternic ar vira culoarea spre verde
    const rim = new THREE.DirectionalLight(0x14D9C4, isCeramic ? 0.14 : 0.35); rim.position.set(-24, 10, -18); scene.add(rim);
    const fil = new THREE.DirectionalLight(0xdfe8e4, isCeramic ? 0.55 : 0.4); fil.position.set(-14, -4, 20); scene.add(fil);

    // ── GEOMETRIE: revoluție a secțiunii exacte ─────────────────────────
    const pts = profile.lathePoints.map(p => new THREE.Vector2(p[0], p[1]));
    const RADIAL_SEG = profile.radialSegments || 360;
    let geo = new THREE.LatheGeometry(pts, RADIAL_SEG);
    geo.translate(0, -(profile.height || 22) / 2, 0);
    geo = geo.toNonIndexed();
    geo.computeVertexNormals();

    // ── MATERIAL: preset realist + micro-relief procedural ──────────────
    // Textură procedurală de micro-relief: modulează ușor rugozitatea, ca
    // suprafața să nu arate „plastic perfect". Intensitatea vine din preset.
    const grainTex = (function () {
      const S = 512;
      const c = document.createElement('canvas'); c.width = c.height = S;
      const x = c.getContext('2d');
      const img = x.createImageData(S, S);
      const amp = (M.grain ?? 0.05) * 255;
      for (let i = 0; i < S * S; i++) {
        // zgomot fin + o componentă cu frecvență joasă (variație de finisaj)
        const px = i % S, py = (i / S) | 0;
        const low = Math.sin(px * 0.021) * Math.cos(py * 0.017) * 0.5;
        const n = 255 - amp * (Math.random() * 0.7 + low * 0.3 + 0.15);
        const o = i * 4;
        img.data[o] = img.data[o + 1] = img.data[o + 2] = n;
        img.data[o + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 6);
      return t;
    })();

    const matParams = {
      color: profile.color ?? M.color,
      metalness: profile.metalness ?? M.metalness,
      roughness: profile.roughness ?? M.roughness,
      side: THREE.DoubleSide,
      envMapIntensity: profile.envMapIntensity ?? M.envMapIntensity,
      roughnessMap: grainTex,
    };
    // MeshPhysicalMaterial adaugă clearcoat (luciu satinat de ceramică)
    const mat = (M.clearcoat > 0 && THREE.MeshPhysicalMaterial)
      ? new THREE.MeshPhysicalMaterial({
          ...matParams,
          clearcoat: M.clearcoat,
          clearcoatRoughness: M.clearcoatRoughness,
        })
      : new THREE.MeshStandardMaterial(matParams);

    const part = new THREE.Mesh(geo, mat);

    const edgeMat = new THREE.LineBasicMaterial({
      color: M.edgeColor,
      transparent: true,
      opacity: M.edgeOpacity,
    });
    // Prag unghiular pentru muchiile CAD. Implicit 13° — suficient de jos ca
    // să deseneze rupturile reale de profil (ex: jonctiunea tranziție→con de
    // 16,8° la ENDR0042409, care la pragul vechi de 20° dispărea și făcea
    // zona să pară un singur con continuu), dar peste pasul unghiular al
    // arcelor (max ~10,2°/segment), ca domurile să rămână netede.
    const EDGE_ANGLE = profile.edgeAngle ?? 13;
    part.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, EDGE_ANGLE), edgeMat));

    const model = new THREE.Group(); model.add(part);
    model.rotation.x = 0.1; scene.add(model);

    (function () {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(128, 128, 10, 128, 128, 124);
      g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.55, 'rgba(0,0,0,.2)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, 256, 256);
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(profile.footprint ?? 34, profile.footprint ?? 34),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = -(profile.height || 22) / 2 - 1.2;
      scene.add(m);
    })();

    // ── COTE 3D ─────────────────────────────────────────────────────────
    const DIM_COLOR = 0x14D9C4;
    // Paletă pentru cotele Ø din vederile Sus/Jos: fiecare diametru primește
    // propria culoare, aplicată pe CONTURUL cercului desenat pe piesă + leader
    // + etichetă. Pe ceramică albă asta e singurul mod de a distinge clar
    // la ce muchie se referă fiecare cotă.
    const DIM_PALETTE = [
      { css: '#14D9C4', border: 'rgba(20,217,196,.6)'  },  // teal (brand)
      { css: '#FFB020', border: 'rgba(255,176,32,.6)'  },  // chihlimbariu
      { css: '#FF6B7A', border: 'rgba(255,107,122,.6)' },  // coral
      { css: '#8FD14F', border: 'rgba(143,209,79,.6)'  },  // lime
      { css: '#B47BFF', border: 'rgba(180,123,255,.6)' },  // violet
      { css: '#4DB8FF', border: 'rgba(77,184,255,.6)'  },  // azur
    ];
    const D = profile.dims3d || {};
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const _up = new THREE.Vector3(0, 1, 0);

    const dims = new THREE.Group();
    dims.visible = false;
    dims.renderOrder = 999;

    // ── COTE (measure mode) — un obiect per cotă, cu culoare proprie ────
    // Layout automat: distanțarea liniilor de cotă e calculată din dimensiunile
    // piesei, nu preluată din catalog — altfel cotele apropiate se suprapun.
    // Etichetele de lungime sunt rotite 90° (convenție desen tehnic), ceea ce
    // le face înguste și elimină suprapunerile pe orizontală.
    const coneGeos = [];
    const dimObjs = [];          // { lineMat, arrowMat, radial }
    // extinderea cotelor (frame centrat) — folosită la auto-fit-ul camerei ortho
    let dimMaxY = -Infinity, dimMinY = Infinity, dimMaxX = 0;

    const labelBox = document.createElement('div');
    labelBox.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;display:none;';
    mount.appendChild(labelBox);
    const labels = [];

    // ── Cote Ø pentru vederile SUS/JOS ──────────────────────────────────
    // Cerc colorat trasat pe conturul real al diametrului + leader punctat
    // spre eticheta de pe inelul exterior. Overlay SVG, activ doar pe sus/jos.
    const topSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    topSvg.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;display:none;');
    mount.appendChild(topSvg);
    const topLabelBox = document.createElement('div');
    topLabelBox.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;display:none;';
    mount.appendChild(topLabelBox);

    const topDims = [];
    const SVGNS = 'http://www.w3.org/2000/svg';
    const CIRCLE_SEG = 64;
    const addTopDim = (text, r, yCentered) => {
      const C = DIM_PALETTE[topDims.length % DIM_PALETTE.length];
      const circle = document.createElementNS(SVGNS, 'polyline');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', C.css);
      circle.setAttribute('stroke-width', '1.6');
      circle.setAttribute('opacity', '0.95');
      topSvg.appendChild(circle);
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('stroke', C.css);
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '3 2');
      line.setAttribute('opacity', '0.8');
      topSvg.appendChild(line);
      const el = document.createElement('div');
      el.textContent = text;
      el.style.cssText = 'position:absolute;transform:translate(-50%,-50%);' +
        'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;' +
        `line-height:1;letter-spacing:.04em;color:${C.css};background:rgba(6,11,10,.92);` +
        `border:1px solid ${C.border};border-radius:4px;padding:2px 6px;white-space:nowrap;` +
        'box-shadow:0 2px 8px rgba(0,0,0,.55);';
      topLabelBox.appendChild(el);
      topDims.push({ r, y: yCentered, label: text, circle, line, el, color: C.css });
    };

    // creează un set complet (linii + săgeți + etichetă) pentru o singură cotă
    const makeDim = (color, radial) => {
      const segs = [];
      const lineMat = new THREE.LineBasicMaterial({
        color, transparent: true, opacity: 0.95, depthTest: false, depthWrite: false,
      });
      const arrowMat = new THREE.MeshBasicMaterial({
        color, transparent: true, depthTest: false, depthWrite: false, opacity: 1.0,
      });
      const obj = { lineMat, arrowMat, radial };
      dimObjs.push(obj);
      return {
        seg: (a, b) => {
          segs.push(a.x, a.y, a.z, b.x, b.y, b.z);
          dimMaxY = Math.max(dimMaxY, a.y, b.y);
          dimMinY = Math.min(dimMinY, a.y, b.y);
          dimMaxX = Math.max(dimMaxX, Math.abs(a.x), Math.abs(b.x));
        },
        arrow: (tip, dir) => {
          const g = new THREE.ConeGeometry(0.45, 1.5, 14);
          const c = new THREE.Mesh(g, arrowMat);
          c.renderOrder = 1000;
          const d = dir.clone().normalize();
          c.quaternion.setFromUnitVectors(_up, d);
          c.position.copy(tip).addScaledVector(d, -0.75);
          dims.add(c);
          coneGeos.push(g);
        },
        label: (text, p, vertical) => {
          const el = document.createElement('div');
          el.textContent = text;
          const rot = vertical ? ' rotate(-90deg)' : '';
          el.style.cssText = 'position:absolute;transform:translate(-50%,-50%)' + rot + ';' +
            'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;' +
            `line-height:1;letter-spacing:.04em;color:${color};background:rgba(6,11,10,.9);` +
            `border:1px solid ${color}99;border-radius:4px;padding:2px 6px;white-space:nowrap;` +
            'box-shadow:0 2px 6px rgba(0,0,0,.5);transition:opacity .12s linear;';
          labelBox.appendChild(el);
          labels.push({ el, p: p.clone(), lateral: !radial });
        },
        finish: () => {
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
          const ls = new THREE.LineSegments(g, lineMat);
          ls.renderOrder = 999;
          dims.add(ls);
          obj.geo = g;
        },
      };
    };

    const yBase = -(profile.height || 22) / 2;
    const PART_H = profile.height || 22;
    const MAX_R = Math.max(...profile.lathePoints.map(p => p[0]));

    const buildFromItems = (items) => {
      // ── AUTO-LAYOUT ────────────────────────────────────────────────────
      // Diametrele se grupează deasupra/dedesubtul piesei și se distanțează
      // uniform, ordonate după poziția pe piesă (liniile de cotă nu se
      // intersectează). Lungimile se distanțează pe orizontală, cea mai mică
      // deschidere lângă piesă — convenție de desen tehnic.
      const dAbove = [], dBelow = [], lens = [], leads = [];
      for (const it of items) {
        if (it.type === 'diameter') ((it.lineY ?? 0) > PART_H / 2 ? dAbove : dBelow).push(it);
        else if (it.type === 'length') lens.push(it);
        else leads.push(it);
      }
      const gapY = Math.max(3.2, PART_H * 0.085);
      const gapX = Math.max(2.6, MAX_R * 0.34);

      dAbove.sort((a, b) => a.y - b.y).forEach((it, i) => { it._lineY = PART_H + gapY * (i + 1); });
      dBelow.sort((a, b) => b.y - a.y).forEach((it, i) => { it._lineY = -gapY * (i + 1); });
      lens.sort((a, b) => (a.y2 - a.y1) - (b.y2 - b.y1))
          .forEach((it, i) => { it._x = MAX_R + gapX * (i + 1); });

      const ordered = [...dBelow, ...dAbove, ...lens, ...leads];
      ordered.forEach((it, idx) => {
        const C = DIM_PALETTE[idx % DIM_PALETTE.length].css;
        const rad = !!it.radial;
        const d = makeDim(C, rad);
        const label = it.label || '';

        if (it.type === 'diameter') {
          const y = it.y + yBase, lineY = it._lineY + yBase, r = it.r;
          d.seg(V(-r, lineY), V(r, lineY));
          d.seg(V(-r, y), V(-r, lineY));
          d.seg(V(r, y), V(r, lineY));
          d.arrow(V(r, lineY), V(1, 0, 0));
          d.arrow(V(-r, lineY), V(-1, 0, 0));
          d.label(label, V(0, lineY, 0), false);
          addTopDim(label, r, y);
        }
        else if (it.type === 'length') {
          const x = it._x, y1 = it.y1 + yBase, y2 = it.y2 + yBase;
          const e1 = it.edgeR1 ?? 0, e2 = it.edgeR2 ?? 0;
          d.seg(V(x, y1), V(x, y2));
          d.seg(V(e1, y1), V(x, y1));
          d.seg(V(e2, y2), V(x, y2));
          d.arrow(V(x, y2), V(0, 1, 0));
          d.arrow(V(x, y1), V(0, -1, 0));
          d.label(label, V(x, (y1 + y2) / 2, 0), true);   // etichetă verticală
        }
        else if (it.type === 'leader') {
          const rx = it.from[0], ry = it.from[1] + yBase;
          const lx = it.to[0], ly = it.to[1] + yBase;
          d.seg(V(rx, ry), V(rx, ly));
          d.seg(V(rx, ly), V(lx, ly));
          d.arrow(V(rx, ry), V(0, ry < ly ? -1 : 1, 0));
          d.label(label, V(lx + 0.6, ly, 0), false);
        }
        d.finish();
      });
    };

    // ── LEGACY: cote hardcodate pentru electrod cap DGSI-TMP-001 ────────
    const buildLegacy = () => {
      const H2 = PART_H / 2, topY = H2, botY = -H2;
      const Rb = D.rBody ?? 10, Rt = D.rTop ?? 7.5, Rh = D.rHole ?? 1.5;
      const splitY = botY + (D.baseH ?? 10.5);
      const L = {
        dBody: D.dBody ?? 'Ø20', dTop: D.dTop ?? 'Ø15', dHole: D.dHole ?? 'Ø3',
        total: D.total ?? 'L 22', cav: D.cav ?? '11,5', base: D.base ?? '10,5',
      };
      const xIn = Rb + 3, xOut = Rb + 6;
      const yD20 = botY - 3, yD15 = topY + 3, yLead = topY + 5.5;
      const P = DIM_PALETTE;

      let d = makeDim(P[0].css, true);
      d.seg(V(-Rb, yD20), V(Rb, yD20)); d.seg(V(-Rb, botY), V(-Rb, yD20)); d.seg(V(Rb, botY), V(Rb, yD20));
      d.arrow(V(Rb, yD20), V(1, 0, 0)); d.arrow(V(-Rb, yD20), V(-1, 0, 0));
      d.label(L.dBody, V(0, yD20, 0), false); d.finish();

      d = makeDim(P[1].css, true);
      d.seg(V(-Rt, yD15), V(Rt, yD15)); d.seg(V(-Rt, topY), V(-Rt, yD15)); d.seg(V(Rt, topY), V(Rt, yD15));
      d.arrow(V(Rt, yD15), V(1, 0, 0)); d.arrow(V(-Rt, yD15), V(-1, 0, 0));
      d.label(L.dTop, V(0, yD15, 0), false); d.finish();

      d = makeDim(P[2].css, false);
      d.seg(V(Rh, topY), V(Rh, yLead)); d.seg(V(Rh, yLead), V(Rh + 3, yLead));
      d.arrow(V(Rh, topY), V(0, -1, 0));
      d.label(L.dHole, V(Rh + 3.6, yLead, 0), false); d.finish();

      d = makeDim(P[3].css, false);
      d.seg(V(xOut, botY), V(xOut, topY)); d.seg(V(Rb, botY), V(xOut, botY)); d.seg(V(Rt, topY), V(xOut, topY));
      d.arrow(V(xOut, topY), V(0, 1, 0)); d.arrow(V(xOut, botY), V(0, -1, 0));
      d.label(L.total, V(xOut, 0, 0), true); d.finish();

      d = makeDim(P[4].css, false);
      d.seg(V(xIn, splitY), V(xIn, topY)); d.seg(V(Rt, topY), V(xIn, topY)); d.seg(V(Rb, splitY), V(xIn, splitY));
      d.arrow(V(xIn, topY), V(0, 1, 0)); d.arrow(V(xIn, splitY), V(0, -1, 0));
      d.label(L.cav, V(xIn, (splitY + topY) / 2, 0), true); d.finish();

      d = makeDim(P[5].css, false);
      d.seg(V(xIn, botY), V(xIn, splitY)); d.seg(V(Rb, botY), V(xIn, botY));
      d.arrow(V(xIn, splitY), V(0, 1, 0)); d.arrow(V(xIn, botY), V(0, -1, 0));
      d.label(L.base, V(xIn, (botY + splitY) / 2, 0), true); d.finish();
    };

    if (D.items && D.items.length) buildFromItems(D.items);
    else buildLegacy();

    model.add(dims);

    const clip = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    const base = profile.camera || { theta: 0.6, phi: 1.15, radius: 60 };
    let th = base.theta, ph = base.phi, r = base.radius;
    let tTh = th, tPh = ph, tR = r;
    let savedR = null;
    let drag = false, px = 0, py = 0;
    const el = renderer.domElement;
    const onDown = e => { el.setPointerCapture(e.pointerId); drag = true; px = e.clientX; py = e.clientY; };
    const onMove = e => { if (!drag) return;
      tTh -= (e.clientX - px) * 0.008; tPh -= (e.clientY - py) * 0.008;
      tPh = Math.max(0.02, Math.min(Math.PI - 0.02, tPh));
      px = e.clientX; py = e.clientY; };
    const onUp = () => { drag = false; };
    const onWheel = e => { e.preventDefault();
      if (activeCam === orthoCam) {
        orthoScale = Math.max(0.3, Math.min(3, orthoScale * (1 + e.deltaY * 0.001)));
        applyOrthoFrustum();
      } else {
        tR = Math.max(base.radius * 0.5, Math.min(base.radius * 2.1, tR + e.deltaY * 0.035));
      }
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    let liveRot = true;
    let showTopDims = false;   // etichete Ø plate — active doar pe Sus/Jos
    apiRef.current.setRot = v => { liveRot = v; };
    apiRef.current.setSec = v => {
      mat.clippingPlanes = v ? [clip] : null; mat.needsUpdate = true;
      edgeMat.clippingPlanes = v ? [clip] : null; edgeMat.needsUpdate = true;
    };
    apiRef.current.setDim = v => {
      dims.visible = v;
      labelBox.style.display = v ? 'block' : 'none';
      if (v) {
        savedR = tR;
        tTh = VIEWS.fata.th;
        tPh = VIEWS.fata.ph;
        liveRot = false;
        activeCam = orthoCam;
        // auto-fit: încadrează TOATE cotele, nu doar piesa. Fără asta, cotele
        // exterioare (mai ales diametrele stivuite deasupra) ies din cadru.
        const w = mount.clientWidth || W, h = mount.clientHeight || H;
        const aspect = w / h;
        const needH = Math.max(Math.abs(dimMaxY), Math.abs(dimMinY)) * 1.10;
        const needW = dimMaxX * 1.18;
        orthoScale = Math.max(1, needH / orthoBase, needW / (orthoBase * aspect));
        applyOrthoFrustum();
        // cotele diametrale plate nu au sens simultan cu measure mode (Față)
        showTopDims = false;
        topLabelBox.style.display = 'none';
        topSvg.style.display = 'none';
      } else {
        activeCam = perspCam;
        if (savedR != null) { tR = savedR; savedR = null; }
      }
    };
    apiRef.current.setView = name => {
      const v = VIEWS[name]; if (!v) return;
      tTh = v.th; tPh = v.ph; tR = base.radius * v.r;
      liveRot = false; setRot(false);
      // pe Sus/Jos afișăm cotele Ø radiale; cotele liniare (measure mode) se
      // dezactivează, altfel cele două seturi se suprapun peste piesă.
      showTopDims = (name === 'sus' || name === 'jos');
      topLabelBox.style.display = showTopDims ? 'block' : 'none';
      topSvg.style.display = showTopDims ? 'block' : 'none';
      if (showTopDims) {
        dims.visible = false;
        labelBox.style.display = 'none';
        activeCam = perspCam;
        if (savedR != null) { tR = base.radius * v.r; savedR = null; }
      }
    };

    const _proj = new THREE.Vector3();
    const _lat  = new THREE.Vector3();
    const _cam  = new THREE.Vector3();

    let raf;
    (function tick() {
      raf = requestAnimationFrame(tick);
      if (!drag && liveRot) tTh += 0.0032;
      th += (tTh - th) * 0.15; ph += (tPh - ph) * 0.15; r += (tR - r) * 0.1;
      const st = Math.sin(ph);
      const cx = r * st * Math.sin(th);
      const cy = r * Math.cos(ph);
      const cz = r * st * Math.cos(th);
      perspCam.position.set(cx, cy, cz); perspCam.lookAt(0, 0, 0);
      orthoCam.position.set(cx, cy, cz); orthoCam.lookAt(0, 0, 0);
      renderer.render(scene, activeCam);

      if (dims.visible && labels.length) {
        _lat.set(1, 0, 0).applyQuaternion(model.quaternion);
        _cam.copy(activeCam.position); _cam.y = 0;
        const cLen = Math.hypot(_cam.x, _cam.z) || 1;
        const dot = (_lat.x * _cam.x + _lat.z * _cam.z) / cLen;
        const t = Math.max(0, Math.min(1, (dot + 0.4) / 0.8));
        const sideAlpha = 0.15 + t * 0.85;

        for (const o of dimObjs) {
          if (o.radial) continue;                 // cotele radiale rămân opace
          o.lineMat.opacity  = sideAlpha * 0.95;
          o.arrowMat.opacity = sideAlpha;
        }

        const lw = mount.clientWidth || W, lh = mount.clientHeight || H;
        for (let i = 0; i < labels.length; i++) {
          _proj.copy(labels[i].p).applyMatrix4(model.matrixWorld).project(activeCam);
          const s = labels[i].el.style;
          if (_proj.z < -1 || _proj.z > 1) { s.display = 'none'; continue; }
          s.display = 'block';
          s.left = ((_proj.x * 0.5 + 0.5) * lw) + 'px';
          s.top  = ((-_proj.y * 0.5 + 0.5) * lh) + 'px';
          s.opacity = labels[i].lateral ? sideAlpha : 1;
        }
      }

      // Cote Ø pe vederile Sus/Jos: fiecare diametru e trasat ca CERC colorat
      // pe conturul lui real de pe piesă, cu leader punctat spre eticheta de
      // pe inelul exterior — totul în aceeași culoare, ca să fie evident la
      // ce muchie se referă fiecare cotă (esențial pe ceramică albă).
      if (showTopDims && topDims.length) {
        const lw = mount.clientWidth || W, lh = mount.clientHeight || H;
        const n = topDims.length;
        _proj.set(0, 0, 0).applyMatrix4(model.matrixWorld).project(activeCam);
        const ccx = (_proj.x * 0.5 + 0.5) * lw;
        const ccy = (-_proj.y * 0.5 + 0.5) * lh;

        // pas 1 — trasează cercurile și află raza maximă a siluetei
        const anchor = new Array(n);
        let maxDist = 0;
        for (let i = 0; i < n; i++) {
          const td = topDims[i];
          let pts = '';
          let visible = true;
          for (let s = 0; s <= CIRCLE_SEG; s++) {
            const a = (s / CIRCLE_SEG) * Math.PI * 2;
            _proj.set(td.r * Math.cos(a), td.y, td.r * Math.sin(a))
                 .applyMatrix4(model.matrixWorld).project(activeCam);
            if (_proj.z < -1 || _proj.z > 1) { visible = false; break; }
            const sx = (_proj.x * 0.5 + 0.5) * lw;
            const sy = (-_proj.y * 0.5 + 0.5) * lh;
            pts += sx + ',' + sy + ' ';
            const d = Math.hypot(sx - ccx, sy - ccy);
            if (d > maxDist) maxDist = d;
          }
          if (!visible) {
            td.circle.setAttribute('opacity', '0');
            td.line.setAttribute('opacity', '0');
            td.el.style.display = 'none';
            anchor[i] = null;
            continue;
          }
          td.circle.setAttribute('points', pts.trim());
          td.circle.setAttribute('opacity', '0.95');

          // punct de ancoră pe cerc, la un unghi distinct pentru fiecare cotă
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
          _proj.set(td.r * Math.cos(ang), td.y, td.r * Math.sin(ang))
               .applyMatrix4(model.matrixWorld).project(activeCam);
          anchor[i] = {
            x: (_proj.x * 0.5 + 0.5) * lw,
            y: (-_proj.y * 0.5 + 0.5) * lh,
          };
        }

        // pas 2 — leader punctat de la cerc la eticheta de pe inelul exterior
        for (let i = 0; i < n; i++) {
          const td = topDims[i];
          const a = anchor[i];
          if (!a) continue;
          const dx = a.x - ccx, dy = a.y - ccy;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len;
          const ring = maxDist + 26 + (i % 2) * 22;
          const outX = ccx + ux * ring, outY = ccy + uy * ring;

          td.line.setAttribute('x1', a.x); td.line.setAttribute('y1', a.y);
          td.line.setAttribute('x2', outX); td.line.setAttribute('y2', outY);
          td.line.setAttribute('opacity', '0.8');

          td.el.style.display = 'block';
          td.el.style.left = outX + 'px';
          td.el.style.top  = outY + 'px';
        }
      }
    })();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      perspCam.aspect = w / h; perspCam.updateProjectionMatrix();
      applyOrthoFrustum();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      geo.dispose(); mat.dispose(); edgeMat.dispose(); grainTex.dispose();
      dimObjs.forEach(o => { o.geo?.dispose(); o.lineMat.dispose(); o.arrowMat.dispose(); });
      coneGeos.forEach(g => g.dispose());
      if (mount.contains(labelBox)) mount.removeChild(labelBox);
      if (mount.contains(topLabelBox)) mount.removeChild(topLabelBox);
      if (mount.contains(topSvg)) mount.removeChild(topSvg);
      renderer.dispose();
      if (mount.contains(el)) mount.removeChild(el);
    };
  }, [profile]);

  useEffect(() => { apiRef.current.setRot?.(rot); }, [rot]);
  useEffect(() => { apiRef.current.setSec?.(sec); }, [sec]);
  useEffect(() => { apiRef.current.setDim?.(dim); }, [dim]);

  if (!profile) return null;

  const has2d = !!(profile.pdf || profile.drawing2d);

  const open2d = () => {
    if (profile.pdf) {
      window.open(profile.pdf, '_blank', 'noopener,noreferrer');
    } else if (profile.drawing2d) {
      setShow2d(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px]">
      <div ref={mountRef} className="absolute inset-0" onPointerDown={() => setView(null)} />
      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#14D9C4]/15 text-[#14D9C4] text-[9px] font-black font-mono uppercase tracking-[0.15em] rounded pointer-events-none">
        {dim ? 'Ortho 1:1 · fidel 2D' : 'Model 1:1 · generat din desen'}
      </span>
      <span className="absolute top-3 right-3 text-[9px] font-mono text-[#4a5450] pointer-events-none">
        drag rotire · scroll zoom
      </span>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5 bg-black/55 border border-white/10 rounded-lg p-1 backdrop-blur-sm">
        {Object.keys(VIEWS).map(name => (
          <button key={name}
            onClick={() => {
              apiRef.current.setView?.(name);
              setView(name);
              // Sus/Jos folosesc cotele Ø radiale — measure mode se stinge
              if (name === 'sus' || name === 'jos') setDim(false);
            }}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition ${view === name ? 'bg-[#14D9C4] text-black font-bold' : 'text-[#999] hover:text-white'}`}>
            {name}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 items-end">
        <button onClick={() => setRot(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md border backdrop-blur-sm transition ${rot ? 'text-[#14D9C4] border-[#14D9C4]/50 bg-black/55' : 'text-[#999] border-white/10 bg-black/55'}`}>
          <RotateCw size={11}/>Rotire
        </button>
        <button onClick={() => setSec(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md border backdrop-blur-sm transition ${sec ? 'text-[#14D9C4] border-[#14D9C4]/50 bg-black/55' : 'text-[#999] border-white/10 bg-black/55'}`}>
          <Scissors size={11}/>Secțiune
        </button>
        <button
          onClick={() => {
            const next = !dim;
            setDim(next);
            if (next) { setRot(false); setView('fata'); }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md border backdrop-blur-sm transition ${dim ? 'text-[#14D9C4] border-[#14D9C4]/50 bg-black/55' : 'text-[#999] border-white/10 bg-black/55'}`}>
          <Ruler size={11}/>Cote
        </button>
        {has2d && (
          <button
            onClick={open2d}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md border backdrop-blur-sm transition text-[#999] border-white/10 bg-black/55 hover:text-[#14D9C4] hover:border-[#14D9C4]/50">
            <FileText size={11}/>2D
          </button>
        )}
      </div>

      {show2d && profile.drawing2d && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShow2d(false)}
        >
          <button
            onClick={() => setShow2d(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-md border border-white/10"
            aria-label="Închide"
          >
            <X size={18}/>
          </button>
          <img
            src={profile.drawing2d}
            alt="Desen tehnic 2D"
            className="max-w-[92%] max-h-[88%] object-contain rounded"
            onClick={e => e.stopPropagation()}
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-[#14D9C4] text-[10px] font-mono uppercase tracking-[0.15em] rounded">
            Desen tehnic original
          </span>
        </div>
      )}
    </div>
  );
}
