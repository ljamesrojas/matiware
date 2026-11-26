/**
 * Lightweight 2D preview of the exploded Desktop PC for the landing page.
 * Plain SVG (no three.js) so the landing page loads fast; the real 3D model
 * loads only when the explorer opens.
 */

import styles from "./HeroIllustration.module.css";
import { C } from "../../models/palette";

const E = 0.72; // how far the parts are pulled apart

type PartKey = "chassis" | "mb" | "psu" | "hdd" | "gpu" | "ssd" | "ram" | "cpu" | "cooler" | "fans";

interface Geo {
  v: [number, number]; // explode vector at 100%
  a: [number, number]; // leader-line anchor (slot)
  l: [number, number]; // label position when assembled
  n: string;
  c: string; // category color
}

const geo: Record<PartKey, Geo> = {
  chassis: { v: [0, 0], a: [260, 270], l: [112, 30], n: "Case", c: "var(--cat-structure)" },
  mb: { v: [0, 0], a: [250, 235], l: [142, 84], n: "Motherboard", c: "var(--cat-connectivity)" },
  psu: { v: [-30, 95], a: [200, 458], l: [124, 382], n: "Power supply", c: "var(--cat-power)" },
  // Label below-left of the drive so the landing page's preview card doesn't cover it.
  hdd: { v: [30, 95], a: [346, 452], l: [282, 470], n: "Hard drive", c: "var(--cat-storage)" },
  gpu: { v: [250, 135], a: [250, 346], l: [358, 323], n: "Graphics card", c: "var(--cat-processing)" },
  ssd: { v: [300, 60], a: [215, 249], l: [268, 249], n: "M.2 SSD", c: "var(--cat-storage)" },
  ram: { v: [330, -20], a: [311, 116], l: [333, 170], n: "RAM", c: "var(--cat-memory)" },
  cpu: { v: [270, -20], a: [243, 168], l: [275, 168], n: "CPU", c: "var(--cat-processing)" },
  cooler: { v: [270, -125], a: [243, 128], l: [287, 150], n: "CPU cooler", c: "var(--cat-cooling)" },
  fans: { v: [-85, 0], a: [104, 205], l: [104, 128], n: "Case fans", c: "var(--cat-cooling)" },
};

const keys = Object.keys(geo) as PartKey[];
const round = (x: number) => Math.round(x * 10) / 10;
const dx = (k: PartKey) => round(geo[k].v[0] * E);
const dy = (k: PartKey) => round(geo[k].v[1] * E);
const move = (k: PartKey) => `translate(${dx(k)} ${dy(k)})`;
const moves = (k: PartKey) => geo[k].v[0] !== 0 || geo[k].v[1] !== 0;

const EDGE = C.edge;
const sw = (w: number) => ({ strokeWidth: w });

export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 720 560"
      role="img"
      aria-label="Exploded view of a desktop PC with its parts labeled"
      style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
    >
      <defs>
        <filter id="hero-floor" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse cx="275" cy="522" rx="235" ry="18" fill="#1C1C1A" opacity="0.12" filter="url(#hero-floor)" />

      {/* Case */}
      <polygon points="110,70 140,48 440,48 410,70" fill={C.panel} stroke={EDGE} style={sw(1.5)} strokeLinejoin="round" />
      <polygon points="410,70 440,48 440,448 410,470" fill={C.panelDark} stroke={EDGE} style={sw(1.5)} strokeLinejoin="round" />
      <rect x="110" y="70" width="300" height="400" rx="6" fill={C.panelLight} stroke={EDGE} style={sw(1.5)} />
      <line x1="112" y1="386" x2="290" y2="386" stroke={C.metal} style={sw(1.5)} />
      <rect x="292" y="388" width="110" height="72" rx="3" fill="none" stroke={C.metal} style={sw(1.5)} strokeDasharray="4 4" />

      {/* Motherboard */}
      <rect x="135" y="95" width="230" height="280" rx="4" fill={C.pcb} stroke={EDGE} style={sw(2)} />
      <rect x="137" y="100" width="16" height="70" rx="2" fill={C.metal} />
      <rect x="215" y="140" width="56" height="56" rx="3" fill={C.slot} stroke={C.metal} style={sw(1)} strokeDasharray="3 3" />
      <rect x="298" y="116" width="11" height="128" rx="2" fill={C.slot} />
      <rect x="314" y="116" width="11" height="128" rx="2" fill={C.slot} />
      <rect x="155" y="296" width="180" height="9" rx="2" fill={C.slot} />
      <rect x="170" y="245" width="90" height="8" rx="2" fill={C.slot} />
      <rect x="290" y="268" width="34" height="34" rx="3" fill={C.slot} />
      <path d="M271 160 H290 M271 180 H298 M243 196 V244 M307 268 V244 M260 249 H290" fill="none" stroke={C.slot} style={sw(1.5)} />

      {/* Leader lines */}
      {keys.filter(moves).map((k) => (
        <line
          key={`lead-${k}`}
          x1={geo[k].a[0]}
          y1={geo[k].a[1]}
          x2={round(geo[k].a[0] + dx(k))}
          y2={round(geo[k].a[1] + dy(k))}
          stroke="#8A95A1"
          opacity="0.9"
          style={sw(1.2)}
          strokeDasharray="4 4"
        />
      ))}

      {/* Power supply */}
      <g transform={move("psu")}>
        <rect x="120" y="396" width="160" height="62" rx="4" fill={C.dark} stroke={EDGE} style={sw(2)} />
        <circle cx="158" cy="427" r="21" fill={C.darker} stroke={C.edge} style={sw(1.5)} />
        <path d="M144 427 H172 M158 413 V441 M148 417 L168 437 M168 417 L148 437" stroke={C.edge} style={sw(1.2)} />
        <rect x="200" y="410" width="66" height="34" rx="2" fill={C.panel} />
        <path d="M208 420 H256 M208 428 H246 M208 436 H238" stroke={C.metal} style={sw(1.5)} />
      </g>

      {/* Hard drive */}
      <g transform={move("hdd")}>
        <rect x="300" y="396" width="92" height="56" rx="4" fill={C.metal} stroke={EDGE} style={sw(2)} />
        <circle cx="332" cy="424" r="20" fill={C.platter} stroke="#8A95A1" style={sw(1.2)} />
        <circle cx="332" cy="424" r="4" fill="#8A95A1" />
        <path d="M332 424 L358 408" stroke={C.edge} style={sw(2)} strokeLinecap="round" />
        <rect x="364" y="404" width="22" height="40" rx="2" fill={C.panel} />
      </g>

      {/* Graphics card */}
      <g transform={move("gpu")}>
        <rect x="144" y="296" width="6" height="54" rx="1" fill={C.metal} />
        <rect x="150" y="300" width="200" height="46" rx="4" fill={C.darker} stroke={EDGE} style={sw(2)} />
        <circle cx="205" cy="323" r="18" fill={C.dark} stroke={C.edge} style={sw(1.2)} />
        <circle cx="295" cy="323" r="18" fill={C.dark} stroke={C.edge} style={sw(1.2)} />
        <circle cx="205" cy="323" r="5" fill={C.darker} />
        <circle cx="295" cy="323" r="5" fill={C.darker} />
        <rect x="236" y="316" width="28" height="14" rx="2" fill={C.dark} />
      </g>

      {/* M.2 SSD */}
      <g transform={move("ssd")}>
        <rect x="170" y="243" width="90" height="12" rx="2" fill={C.slot} stroke={EDGE} style={sw(1.5)} />
        <rect x="194" y="246" width="34" height="6" rx="1" fill={C.panel} />
        <rect x="234" y="246" width="16" height="6" rx="1" fill={C.dark} />
      </g>

      {/* RAM */}
      <g transform={move("ram")}>
        {[298, 314].map((x) => (
          <g key={x}>
            <rect x={x} y="116" width="11" height="128" rx="2" fill={C.pcb} stroke={EDGE} style={sw(1.5)} />
            {[126, 150, 174, 198, 222].map((y) => (
              <rect key={y} x={x + 2} y={y} width="7" height="16" rx="1" fill={C.dark} />
            ))}
          </g>
        ))}
      </g>

      {/* CPU */}
      <g transform={move("cpu")}>
        <rect x="219" y="144" width="48" height="48" rx="4" fill={C.pcb} stroke={EDGE} style={sw(2)} />
        <rect x="229" y="154" width="28" height="28" rx="2" fill={C.panel} stroke={C.edge} style={sw(1)} />
        <path d="M223 148 h6 l-6 6 z" fill="#8A95A1" />
      </g>

      {/* CPU cooler */}
      <g transform={move("cooler")}>
        <rect x="207" y="128" width="72" height="80" rx="5" fill={C.metal} stroke={EDGE} style={sw(2)} />
        <path
          d="M211 136 H275 M211 144 H275 M211 152 H275 M211 160 H275 M211 168 H275 M211 176 H275 M211 184 H275 M211 192 H275 M211 200 H275"
          stroke={C.edge}
          style={sw(1.2)}
        />
        <circle cx="243" cy="168" r="27" fill={C.dark} stroke={C.darker} style={sw(1.5)} />
        <path d="M243 168 L243 147 M243 168 L261 178 M243 168 L225 178" stroke="#8A95A1" style={sw(4)} strokeLinecap="round" />
        <circle cx="243" cy="168" r="7" fill={C.darker} />
      </g>

      {/* Case fans */}
      <g transform={move("fans")}>
        {[165, 250].map((cy) => (
          <g key={cy}>
            <circle cx="128" cy={cy} r="24" fill={C.dark} stroke={EDGE} style={sw(2)} />
            <circle cx="128" cy={cy} r="16" fill="none" stroke={C.metal} style={sw(1.5)} />
            <circle cx="128" cy={cy} r="6" fill="#8A95A1" />
          </g>
        ))}
      </g>

      {/* Labels */}
      {keys.map((k) => {
        const g = geo[k];
        const width = Math.round(30 + g.n.length * 6.4);
        return (
          <g key={`label-${k}`} className={styles.label} transform={`translate(${round(g.l[0] + dx(k))} ${round(g.l[1] + dy(k))})`}>
            <rect x="0" y="-11" width={width} height="22" rx="11" fill="#FFFFFF" stroke="#E2E0DA" style={sw(1.2)} />
            <circle cx="11" cy="0" r="3.5" style={{ fill: g.c }} />
            <text x="20" y="4" fill="#1C1C1A" style={{ fontSize: 11, fontWeight: 500, fontFamily: "var(--font-sans)" }}>
              {g.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
