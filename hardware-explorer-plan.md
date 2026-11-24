# Hardware Explorer — Project Plan

> Working title. An interactive 3D explorer that teaches IT students what is inside computing devices. Students rotate a device, pull it apart with an exploded view, and click any part to learn its definition, main function and how it connects to the rest of the system.
>
> Approved UI mockup ("Bench" theme): https://claude.ai/artifact/W3SNnewCQ2tVmJSRAQa4b9 — this file describes everything in it, so the build does not depend on opening the link.

---

## 1. Instructions for Claude Code

- Read this whole file first.
- **Build Phase 1 only** (section 10). Stop when Phase 1 is done and summarize what was built and what is next.
- Follow the visual design in section 11 exactly: colors, fonts, spacing, radius and layout are already approved.
- Keep all learning content in data files (`src/data/`), never hard-coded in components, so new devices can be added without new UI code. Use the content in section 8 as the starting data.
- Build every 3D part from simple primitives (boxes, cylinders, planes) in code. Do not download external 3D models.
- The design is original. It must not copy any existing product's layout, branding or colors.
- Run the dev server and check that there are no console errors before finishing.
- **Git:** never run `git commit`, `git push` or anything that creates commits or rewrites history, and never open pull requests. Instead, list the files to commit and suggest `git add` / `git commit -m "..."` commands. Suggested commit messages must not contain a `Co-Authored-By` line or any mention of Claude or AI. Full rules are in `CLAUDE.md`.
- **Phases:** after each phase, stop and give a phase summary (what was built, how to try it, checklist status, known issues, what to commit, what comes next), then wait until the user replies "continue" before starting the next phase. The summary format is in `CLAUDE.md`.

---

## 2. Target users

IT students (first and second year) learning computer hardware. They should be able to explore on their own and also use it in class on a projector.

---

## 3. Tech stack

| Purpose | Choice |
|---|---|
| Build tool | Vite |
| UI | React 18 + TypeScript |
| 3D | three.js via `@react-three/fiber` |
| 3D helpers | `@react-three/drei` (OrbitControls, Html labels, Edges/Outlines, ContactShadows, CameraControls) |
| Animation | `@react-spring/three` (or `maath/easing`) for smooth explode and camera moves |
| State | Zustand |
| Styling | CSS Modules with CSS custom properties for the theme tokens in section 11 |
| Fonts | Geist and Geist Mono (Google Fonts or the `geist` npm package) |
| Deploy | Static build, deployable to Vercel / Netlify / GitHub Pages |

No backend, no accounts in this version.

---

## 4. Screen layout (desktop)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [logo] Hardware Explorer   DEVICES / DESKTOP PC     Reading level [Beg|Adv]│  header 64px
├──────────────┬─────────────────────────────────────────────┬───────────────┤
│ [PC][Lap][Ph]│ (Drag to rotate · Scroll to zoom)  (VIEW ·…)│ ┌───────────┐ │
│              │                                             │ │ Inspector │ │
│ Desktop PC   │                                             │ │ card      │ │
│ TOWER · ATX  │            3D model (center)                │ │ (floating)│ │
│ short intro  │                                             │ │           │ │
│──────────────│                                             │ │           │ │
│ PARTS     10 │                                             │ │           │ │
│ 01 CPU     ● │                                             │ │           │ │
│ 02 Graphics● │      ╭─────────── floating dock ──────────╮ │ │           │ │
│ ...          │      │Assemble EXPLODE ━━●━━ 70% Expand │  │ │ └───────────┘ │
│──────────────│      │Labels Isolate │ − + ↺            │  │ │               │
│ legend       │      ╰────────────────────────────────────╯ │               │
└──────────────┴─────────────────────────────────────────────┴───────────────┘
```

- **Header** (64px, panel color, bottom border): logo mark (30px rounded square in the accent color with a white chip icon) + "Hardware Explorer" wordmark, a mono breadcrumb `DEVICES / DESKTOP PC`, and on the right the Beginner / Advanced segmented pill control.
- **Left sidebar** (260–300px, panel color, right border):
  1. Device tiles in a 3-column grid: Desktop (selected, accent border and tint), Laptop and Phone (dashed border, muted, mono `SOON` tag).
  2. Device title "Desktop PC" (28px, weight 500), mono subtitle `TOWER · ATX · 10 PARTS`, one-line intro: "Pull it apart, then click any part to learn what it does."
  3. Divider, then mono `PARTS` label with count, then the **numbered parts list**: mono number (`01`–`10`), part name, small category dot on the right. Selected row: accent tint background, accent-dark text.
  4. Category color legend pinned to the bottom.
- **Center stage** (canvas color, no panel): two small translucent pills on top (left: "Drag to rotate · Scroll to zoom"; right: mono status such as `VIEW · INSPECTING MEM-01`), the 3D model filling the space, and a **floating dock** centered at the bottom.
- **Inspector card**: floats on the canvas to the right of the model (320–372px wide, white, 1px border, large radius, soft shadow). It is a card on the canvas, not a docked panel. Shows the part card (section 6) or the device overview when nothing is selected.
- **Mobile (< 768px):** header with menu button (opens the parts list as a drawer), centered title + mono subtitle, reset button. Model takes the top area, a compact floating explode pill sits below it, and the inspector becomes a **bottom sheet** (24px top radius, grabber) showing code, name, definition, main function and connects-to, with "Swipe up for specs and signs of failure" to expand it.

---

## 5. Interactions

| Action | Result |
|---|---|
| Drag | Rotate the model (OrbitControls, damped) |
| Scroll / pinch | Zoom (clamped min/max distance) |
| Hover a part | Thin outline + small name tooltip; cursor becomes pointer |
| Click a part (3D or sidebar list) | Part becomes selected: camera eases toward it, unrelated parts fade to ~20% opacity, connected parts stay at full opacity, the selected part gets an accent-colored outline, inspector shows the part card |
| Click empty space / close card / Esc | Deselect: all parts return to full opacity, camera eases back, inspector shows the device overview |
| Explode slider (0–100%) | Each part moves from its assembled position toward its exploded offset, smoothly. Dashed leader lines connect each moved part back to its slot |
| Assemble / Expand | Animate slider to 0% / 100% |
| Labels toggle | Show/hide floating pill labels (white pill, category dot, name) |
| Isolate toggle | Unrelated parts become almost invisible (~4%) and their labels and leader lines hide, so only the selected part and its connections remain |
| Zoom − / + | Step camera distance |
| Reset view | Reset camera, selection, explode (70%), labels on, isolate off |
| "Connects to" chip | Selects that part (jump navigation) |
| Previous / Next buttons | Step through parts in list order |
| Beginner / Advanced | Swaps definition and main function text between simple and technical versions |

Keyboard: parts list and all controls are real buttons (Tab / Enter), Esc closes the card. Respect `prefers-reduced-motion` (skip camera easing and explode animation). Minimum hit target 40px on desktop, 44px on mobile.

---

## 6. Part card contents (inspector)

1. **Top row:** mono part code tag (e.g. `MEM-01`, light gray background, 6px radius) + category dot and name; close button on the right.
2. **Name** (30px, weight 500, tight letter-spacing) and **full name** (14px, secondary).
3. Divider.
4. **DEFINITION**: 15px text, line-height 1.6.
5. **MAIN FUNCTION**: 15px text, line-height 1.6.
6. **CONNECTS TO**: pill chips with category dot; clicking selects that part.
7. **SPECS TO KNOW**: data-sheet rows, label on the left (13px, secondary), value on the right (13px mono), thin divider between rows.
8. **SIGNS OF FAILURE**: soft warm box (`#F6F4EF`) with an amber dot and mono heading, 14px text.
9. **Footer:** ghost buttons "‹ Previous part name" and "Next part name ›".

Section headings are mono, 11px, uppercase, letter-spacing 0.06em, secondary color.

**Device overview** (nothing selected): mono `OVERVIEW`, "Desktop PC" title, short description, one row per category with dot, name and part count, and the hint "Select a part from the list, or click it on the model, to see its definition and main function."

---

## 7. Data model

All content lives in `src/data/devices/desktop-pc.ts`. Types in `src/types.ts`.

```ts
type Category = "processing" | "memory" | "storage" | "power" | "cooling" | "connectivity" | "structure";

interface Part {
  id: string;                    // "ram"
  code: string;                  // "MEM-01"
  name: string;                  // "RAM"
  fullName: string;              // "Random access memory"
  category: Category;
  definition: { beginner: string; advanced: string };
  function:   { beginner: string; advanced: string };
  connectsTo: string[];          // part ids
  specs: { label: string; value: string }[];
  failureSigns: string;
  // 3D placement
  position: [number, number, number];      // assembled position
  explodeOffset: [number, number, number]; // added at 100% explode
}

interface Device {
  id: string;                    // "desktop-pc"
  name: string;                  // "Desktop PC"
  meta: string;                  // "Tower · ATX"
  intro: string;
  description: string;
  parts: Part[];                 // in list order
}
```

Each part's 3D geometry is a React component in `src/models/desktop-pc/` keyed by part id, so content and geometry stay separate.

---

## 8. Desktop PC: parts and starting content (Phase 1)

List order, codes and connections:

| # | id | Code | Name | Category | Connects to |
|---|---|---|---|---|---|
| 01 | `cpu` | PRC-01 | CPU | processing | motherboard, CPU cooler, RAM |
| 02 | `gpu` | PRC-02 | Graphics card | processing | motherboard, power supply |
| 03 | `ram` | MEM-01 | RAM | memory | motherboard, CPU |
| 04 | `ssd` | STO-01 | M.2 SSD | storage | motherboard, CPU |
| 05 | `hdd` | STO-02 | Hard drive | storage | motherboard, power supply |
| 06 | `psu` | PWR-01 | Power supply | power | motherboard, graphics card, hard drive |
| 07 | `cooler` | CLG-01 | CPU cooler | cooling | CPU, motherboard |
| 08 | `fans` | CLG-02 | Case fans | cooling | case, motherboard |
| 09 | `mb` | CON-01 | Motherboard | connectivity | CPU, RAM, graphics card, M.2 SSD, hard drive, power supply, case fans |
| 10 | `chassis` | STR-01 | Case | structure | motherboard, power supply, case fans |

3D shape and explode direction for each part (stylized, low-poly, recognizable):

| id | Shape notes | Explode direction |
|---|---|---|
| `chassis` | Open-side tower shell (side panel removed), light matte panels | stays (anchor) |
| `mb` | Large flat green board with CPU socket outline, 2 DIMM slots, PCIe slot, M.2 slot, chipset, I/O shield | stays, slightly back |
| `cpu` | Small square chip with heat-spreader top | outward from board |
| `cooler` | Finned heatsink block with a fan disc on the front | further outward and up than the CPU |
| `ram` | Two thin sticks with chip details | outward and slightly up |
| `ssd` | Small thin stick with a label | outward and down |
| `gpu` | Long card with dark shroud, 2 fan discs and metal bracket | outward and down |
| `hdd` | Gray box in the drive bay with a platter circle | down |
| `psu` | Dark box at bottom rear with fan grille and label | down |
| `fans` | Two fan discs on the front wall | outward from the front |

Card content (write exactly this; Claude Code may polish wording but must keep it accurate):

**CPU — Central processing unit** (PRC-01)
- Definition — Beginner: The main chip that follows instructions and does the calculations for every program. / Advanced: A general-purpose processor that fetches, decodes and executes instructions, with multiple cores, on-chip cache and an integrated memory controller.
- Main function — Beginner: Runs your apps and the operating system by doing billions of small steps every second. / Advanced: Executes program threads in parallel across its cores. Clock speed, instructions per clock and cache size decide how fast work gets done.
- Specs: Cores / threads 8 / 16 · Boost clock 4.5 GHz · Socket AM5
- Signs of failure: No display or no boot, sudden shutdowns from overheating, or very slow performance under load.

**Graphics card — Graphics processing unit (GPU)** (PRC-02)
- Definition — Beginner: A card with its own processor and memory that draws images, video and games on your screen. / Advanced: A massively parallel processor with dedicated VRAM, connected over PCIe and optimized for graphics and parallel compute workloads.
- Main function — Beginner: Takes visual work off the CPU and sends the finished picture to your monitor. / Advanced: Renders frames and accelerates parallel tasks such as video encoding and AI, then outputs through HDMI or DisplayPort.
- Specs: VRAM 8 GB GDDR6 · Interface PCIe 4.0 x16
- Signs of failure: Flickering or strange shapes on screen, driver crashes, or no video output.

**RAM — Random access memory** (MEM-01)
- Definition — Beginner: Short-term memory that holds the data the CPU is working on right now. / Advanced: Volatile DRAM modules (DIMMs) that store active program data. Their contents are lost when power is removed.
- Main function — Beginner: Gives the CPU fast access to open apps and files. More RAM lets more things run at once. / Advanced: Feeds the CPU memory controller with far lower latency than storage. Capacity, speed and dual-channel setup all affect performance.
- Specs: Type DDR5 · Capacity 2 × 8 GB · Speed 5600 MT/s
- Signs of failure: Random crashes, blue screens, or beeping at startup.

**M.2 SSD — NVMe solid-state drive** (STO-01)
- Definition — Beginner: A small, very fast storage stick that keeps your files and operating system even when the PC is off. / Advanced: Non-volatile NAND flash storage using the NVMe protocol over PCIe lanes, in the M.2 2280 form factor.
- Main function — Beginner: Stores the operating system, apps and files, and loads them quickly into RAM. / Advanced: Provides persistent storage with much higher throughput and lower latency than SATA drives.
- Specs: Capacity 1 TB · Interface PCIe 4.0 NVMe
- Signs of failure: Slow boot, drive missing in BIOS, or files that won't open.

**Hard drive — Hard disk drive (HDD)** (STO-02)
- Definition — Beginner: A larger, slower drive that stores lots of files on spinning disks. / Advanced: Magnetic storage with rotating platters and a moving read/write head, connected over SATA.
- Main function — Beginner: Keeps big collections of files, backups and games at a low cost. / Advanced: Offers high capacity at a low cost per terabyte, at the price of slower seek times. Common for bulk and backup storage.
- Specs: Capacity 2 TB · Speed 7200 RPM
- Signs of failure: Clicking or grinding sounds, very slow file access, or disk errors.

**Power supply — Power supply unit (PSU)** (PWR-01)
- Definition — Beginner: The box that turns wall power into the safe, steady power every part needs. / Advanced: Converts AC mains power into regulated DC rails (12 V, 5 V and 3.3 V) and delivers it through its cables.
- Main function — Beginner: Powers the motherboard, CPU, graphics card and drives. / Advanced: Supplies stable power as the load changes. Wattage and efficiency rating (80 PLUS) decide headroom and heat.
- Specs: Wattage 650 W · Efficiency 80 PLUS Gold
- Signs of failure: PC won't turn on, random restarts under load, or a burning smell.

**CPU cooler — Heatsink and fan** (CLG-01)
- Definition — Beginner: A metal heatsink and fan that pull heat away from the CPU. / Advanced: A thermal solution that moves heat from the CPU heat spreader, through thermal paste, into fins or a liquid radiator.
- Main function — Beginner: Keeps the CPU from overheating so it can run at full speed. / Advanced: Holds the CPU below its temperature limit to prevent thermal throttling. Rated by the heat (TDP) it can handle.
- Specs: Type Tower air cooler · Rated for Up to 180 W
- Signs of failure: Loud fan, high CPU temperatures, or sudden shutdowns.

**Case fans — Intake and exhaust fans** (CLG-02)
- Definition — Beginner: Fans that pull cool air into the case and push hot air out. / Advanced: Axial fans arranged as intake and exhaust to move air through the chassis, with speed controlled by PWM.
- Main function — Beginner: Keep every part inside the case cool. / Advanced: Balance intake and exhaust airflow to lower component temperatures and reduce dust buildup.
- Specs: Size 120 mm · Control 4-pin PWM
- Signs of failure: Rattling noise, a fan that doesn't spin, or rising temperatures.

**Motherboard — Main circuit board** (CON-01)
- Definition — Beginner: The main circuit board that every other part plugs into. / Advanced: The printed circuit board that hosts the CPU socket, chipset, memory slots, PCIe and M.2 slots, and I/O ports.
- Main function — Beginner: Connects all the parts so they can talk to each other and share power. / Advanced: Routes data and power between components. Its chipset and form factor decide which CPUs, slots and ports are supported.
- Specs: Form factor ATX · Socket AM5
- Signs of failure: No power or no POST, dead ports, or swollen capacitors.

**Case — Computer chassis** (STR-01)
- Definition — Beginner: The metal and glass box that holds and protects all the parts. / Advanced: The chassis provides mounting points, airflow paths, drive bays and front I/O, sized for a motherboard form factor.
- Main function — Beginner: Holds everything in place, guides airflow and protects parts from dust and damage. / Advanced: Sets the limits for board size, graphics card length and cooler height, and shapes the airflow layout.
- Specs: Size Mid tower · Supports ATX, micro-ATX
- Signs of failure: Poor airflow, loose front ports, or rattling panels.

**Device overview text:** "A tower computer built from separate parts you can upgrade or replace. Each part has one job, and together they turn power and data into what you see on screen."

---

## 9. 3D scene look

- Soft studio lighting: hemisphere light + one directional key light with soft shadows. A soft blurred contact shadow under the model (`ContactShadows`), no visible floor plane.
- Background is the canvas color (`#EEEDE9`), not black or a gradient.
- Matte, slightly desaturated real-world materials: light warm-gray case panels (`#F7F7F4`, `#E9EAE6`, `#DEE0DB`), muted green PCB (`#4E7A6A`), dark slots (`#2F4F45`), dark components (`#363B40`), brushed metal (`#C9CDD0`).
- Default part edge color `#8C8F8A`; selected part edge in the accent color.
- Labels: white pill, 1px `#E2E0DA` border (accent border when selected), category dot, 11px name.
- Leader lines: dashed, `#8A95A1`, from each part's slot to its exploded position.

---

## 10. Phases

### Phase 1 — MVP (build this now)
- [ ] Vite + React + TS project, folder structure from section 12
- [ ] Theme tokens from section 11 as CSS custom properties; Geist + Geist Mono loaded
- [ ] Desktop layout from section 4 (header, sidebar, center stage with floating dock, floating inspector card), responsive with the mobile layout and bottom sheet
- [ ] Desktop PC model built from primitives, all 10 parts in section 8, scene look from section 9
- [ ] Orbit, zoom, hover outline, click to select, fade unrelated parts, camera focus
- [ ] Explode slider + Assemble / Expand with smooth animation and dashed leader lines
- [ ] Labels toggle and Isolate toggle
- [ ] Numbered parts list synced with 3D selection; category legend
- [ ] Inspector part card with all fields from section 6; device overview when nothing is selected
- [ ] Clickable "Connects to" chips and Previous / Next navigation
- [ ] Beginner / Advanced toggle
- [ ] Reset view, zoom buttons, Esc to close, keyboard navigation, reduced-motion support
- [ ] Device tiles with Laptop and Phone marked `SOON`

**Done when:** a student can open the app, explode the PC, click every part, read accurate content in both reading levels, use Isolate and Labels, and navigate between connected parts — on desktop and on a phone — with no console errors, and it matches the Bench theme.

### Phase 2 — Data flow mode
- Toggle that plays a step-by-step animation of what happens when you open an app: storage → RAM → CPU → GPU → display output. Glowing particles in the accent color travel along paths between parts; a caption in the inspector explains each step; play / pause / next step controls in the dock.
- Optional power flow variant: PSU → motherboard → components, showing approximate watts.

### Phase 3 — Build-it quiz
- "Identify" mode: a part is highlighted, student picks its name from 4 options.
- "Assemble" mode: start fully exploded, student clicks parts back into place in a valid order.
- Score summary at the end.

### Later
- Add Laptop, then Smartphone (same data model, new models and content).
- Compare mode: one part (e.g. RAM, storage, cooling) side by side across devices.
- Troubleshooting scenarios (e.g. "PC powers on but no display" → student picks which parts to check).

---

## 11. Visual style: "Bench" theme (approved)

Premium, minimal and calm, with a technical spec-sheet personality.

**Colors**

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#EEEDE9` | App background and 3D stage |
| `--panel` | `#FBFAF8` | Header, sidebar, dock |
| `--surface` | `#FFFFFF` | Inspector card, chips, device tiles |
| `--border` | `#E4E2DC` | All 1px borders |
| `--divider` | `#EFEDE8` | Rows inside the inspector |
| `--hover` | `#F3F2EE` | Hover background, code tag background |
| `--soft` | `#F6F4EF` | Signs-of-failure box |
| `--text` | `#1C1C1A` | Primary text |
| `--text-body` | `#2A2926` | Card paragraphs |
| `--text-2` | `#55534D` | Secondary text |
| `--text-3` | `#6F6D66` | Mono labels, captions |
| `--accent` | `#2F6B57` | Circuit-board green: logo, selection, active toggles, slider |
| `--accent-tint` | accent 9–12% over white | Selected list row, active dock button |
| `--accent-ink` | accent 85% + black | Text on accent tint |
| `--warn-dot` / `--warn-ink` | `#C2701F` / `#8A4B14` | Signs-of-failure heading |

Category colors (muted; used only for small dots and label dots):

| Category | Color |
|---|---|
| processing | `#5865A6` |
| memory | `#7A5BA6` |
| storage | `#3E8A80` |
| power | `#B07A2A` |
| cooling | `#4C86A8` |
| connectivity | `#4F8A55` |
| structure | `#8A8880` |

**Typography**
- UI font: **Geist** (weights 400, 500, 600). Mono font: **Geist Mono** (400, 500).
- Page/device title 28px / 500 / letter-spacing −0.02em. Part name 30px / 500 / −0.02em. Wordmark 17px / 600.
- Body 15px, line-height 1.6. List items 14px. Small text 12–13px.
- Mono labels: 11px, uppercase, letter-spacing 0.06em, `--text-3` (e.g. `PARTS`, `DEFINITION`, `EXPLODE`, `TOWER · ATX · 10 PARTS`, part codes).

**Shape and depth**
- Base radius 14px (`--r`). Inspector card `--r + 4px`. List rows and buttons `--r − 4px`. Dock, chips, segmented control and pills fully rounded (999px).
- Borders 1px `--border`. Shadows only on floating elements: inspector `0 16px 44px rgba(28,28,26,.08)`, dock `0 12px 32px rgba(28,28,26,.08)`, bottom sheet `0 -10px 32px rgba(28,28,26,.10)`.
- No gradients, no glow, no emoji. Icons: one consistent outline set (Lucide), 1.7–2px stroke.

**Motion**
- 250–450ms ease-out for camera, explode, fades and the inspector content swap; bottom sheet slides up on mobile.

---

## 12. Folder structure

```
src/
  main.tsx
  App.tsx
  types.ts
  theme.css                      # Bench tokens as CSS custom properties
  store/useExplorerStore.ts      # selectedPartId, hoveredPartId, explode, showLabels, isolate, zoom, level
  data/
    devices/desktop-pc.ts
    categories.ts                # names and colors
  models/
    desktop-pc/                  # one component per part + DesktopPC.tsx assembling them
  components/
    layout/  (Header, Sidebar, DeviceTiles, PartsList, Legend, MobileDrawer)
    viewer/  (Scene, PartMesh, Labels, LeaderLines, CameraRig, Dock, StagePills)
    inspector/ (Inspector, PartCard, DeviceOverview, SpecRows, ConnectsTo, BottomSheet)
```

`PartMesh` is a shared wrapper that handles hover, click, fade, isolate, outline and explode offset for any part, so each part model only defines its geometry.
