import type { Flow } from "../../types";

/**
 * Flow-mode content for the Desktop PC.
 * Paths use the same coordinates as src/data/devices/desktop-pc.ts. Board-level waypoints
 * sit just in front of the motherboard (z ≈ −0.82) so the route reads like a circuit trace.
 * Power values are rough figures for this build under heavy load and are labeled as approximate.
 */

const BOARD_Z = -0.82;
const SOCKET: [number, number, number] = [-0.4, 1.45, BOARD_Z];
const DIMMS: [number, number, number] = [0.37, 1.45, BOARD_Z];

export const desktopPcFlows: Flow[] = [
  {
    id: "data",
    name: "Data flow",
    shortName: "Data",
    question: "What happens when you open an app?",
    intro: "Follow an app from the drive to your screen, one hop at a time.",
    badgeLabel: "Carries",
    steps: [
      {
        id: "load",
        route: "Storage → RAM",
        title: "Load the app",
        badge: "App files",
        caption: {
          beginner:
            "When you open an app, its files are copied from the SSD into RAM, where the CPU can reach them quickly.",
          advanced:
            "The operating system asks the NVMe drive for the app's files. The SSD copies them over PCIe lanes, through the CPU's I/O and memory controller, straight into RAM (direct memory access).",
        },
        focus: ["ssd", "ram"],
        via: ["mb"],
        path: [
          { part: "ssd" },
          { part: "ssd", assembled: true },
          { world: [-0.4, 0.62, BOARD_Z] },
          { world: SOCKET },
          { world: DIMMS },
          { part: "ram", assembled: true },
          { part: "ram" },
        ],
      },
      {
        id: "fetch",
        route: "RAM → CPU",
        title: "Run the instructions",
        badge: "Instructions + data",
        caption: {
          beginner:
            "The CPU pulls the app's instructions and data out of RAM and works through them, billions of small steps every second.",
          advanced:
            "The memory controller streams instructions and data into the CPU caches. The cores fetch, decode and execute them, writing results back to cache and RAM.",
        },
        focus: ["ram", "cpu"],
        via: ["mb"],
        path: [
          { part: "ram" },
          { part: "ram", assembled: true },
          { world: DIMMS },
          { world: SOCKET },
          { part: "cpu", assembled: true },
          { part: "cpu" },
        ],
      },
      {
        id: "draw",
        route: "CPU → GPU",
        title: "Send the drawing work",
        badge: "Draw commands",
        caption: {
          beginner: "The CPU tells the graphics card what to draw: windows, text, pictures and 3D scenes.",
          advanced:
            "The graphics driver builds command buffers and uploads textures and geometry over the PCIe x16 slot into the card's VRAM.",
        },
        focus: ["cpu", "gpu"],
        via: ["mb"],
        path: [
          { part: "cpu" },
          { part: "cpu", assembled: true },
          { world: SOCKET },
          { world: [-0.4, 0.25, BOARD_Z] },
          { world: [-0.6, 0.25, BOARD_Z] },
          { part: "gpu", assembled: true, offset: [0.15, 0.17, -0.5] },
          { part: "gpu", offset: [0.15, 0.17, -0.5] },
          { part: "gpu" },
        ],
      },
      {
        id: "display",
        route: "GPU → Display",
        title: "Show the picture",
        badge: "Video frames",
        caption: {
          beginner:
            "The graphics card turns those instructions into finished pictures and sends them to your monitor many times every second.",
          advanced:
            "The GPU renders each frame into VRAM, then its display engine sends it out over HDMI or DisplayPort at the monitor's refresh rate, for example 60 or 144 times a second.",
        },
        focus: ["gpu"],
        path: [
          { part: "gpu" },
          { part: "gpu", offset: [-1.33, 0.05, -0.1] },
          { part: "gpu", offset: [-2.1, 0.05, -0.1] },
          { part: "gpu", offset: [-2.1, 1.1, -0.1] },
        ],
        endMarker: { label: "Monitor", icon: "monitor" },
      },
    ],
  },
  {
    id: "power",
    name: "Power flow",
    shortName: "Power",
    question: "Where does the power go?",
    intro: "See how power reaches each part when the PC is working hard. Watts are approximate.",
    badgeLabel: "Approx. power",
    steps: [
      {
        id: "wall",
        route: "Wall → Power supply",
        title: "Power comes in",
        badge: "≈ 400 W",
        caption: {
          beginner:
            "Power from the wall socket goes into the power supply, which turns it into the low, steady voltages the parts need.",
          advanced:
            "The PSU converts AC mains into regulated 12 V, 5 V and 3.3 V DC. At about 90% efficiency (80 PLUS Gold), roughly 40 W of the 400 W becomes heat inside the PSU.",
        },
        focus: ["psu"],
        path: [
          { part: "psu", offset: [-2.0, 0.15, -0.3] },
          { part: "psu", offset: [-0.76, 0.15, -0.3] },
          { part: "psu" },
        ],
        startMarker: { label: "Wall outlet", icon: "plug" },
      },
      {
        id: "board",
        route: "Power supply → Motherboard",
        title: "Power the board",
        badge: "≈ 45 W",
        caption: {
          beginner:
            "The big 24-pin cable powers the motherboard, which passes power on to the RAM, the SSD and the fans.",
          advanced:
            "The 24-pin ATX connector feeds the board's 12 V, 5 V and 3.3 V rails. They supply the chipset, RAM, M.2 SSD and fan headers, about 45 W together.",
        },
        focus: ["psu", "mb"],
        path: [
          { part: "psu" },
          { part: "psu", assembled: true },
          { world: [-1.38, -1.3, 0] },
          { world: [0.75, -1.3, 0] },
          { world: [0.75, 0.85, 0] },
          { world: [0.75, 0.85, -0.73] },
          { world: [0.59, 0.85, -0.73] },
        ],
      },
      {
        id: "cpu",
        route: "Power supply → CPU",
        title: "Power the processor",
        badge: "≈ 140 W",
        caption: {
          beginner:
            "A separate 8-pin cable brings power to the parts around the CPU socket, which clean it up and feed it to the processor.",
          advanced:
            "The 8-pin EPS 12 V cable feeds the VRMs beside the socket. They step 12 V down to about 1–1.4 V for the cores. This CPU can draw up to about 140 W.",
        },
        focus: ["psu", "cpu"],
        via: ["mb"],
        path: [
          { part: "psu" },
          { part: "psu", assembled: true },
          { world: [-1.38, -1.3, 0.45] },
          { world: [-1.95, -1.3, 0.45] },
          { world: [-1.95, 2.09, 0.45] },
          { world: [-1.3, 2.09, 0.45] },
          { world: [-1.3, 2.09, -0.74] },
          { world: [-1.3, 1.45, BOARD_Z] },
          { world: SOCKET },
          { part: "cpu", assembled: true },
          { part: "cpu" },
        ],
      },
      {
        id: "gpu",
        route: "Power supply → Graphics card",
        title: "Power the graphics card",
        badge: "≈ 170 W",
        caption: {
          beginner:
            "The graphics card uses the most power, so it gets its own cable from the power supply as well as power from its slot.",
          advanced:
            "Up to 75 W comes through the PCIe slot and the rest through an 8-pin PCIe power cable. A card in this class draws about 170 W while gaming.",
        },
        focus: ["psu", "gpu"],
        via: ["mb"],
        path: [
          { part: "psu" },
          { part: "psu", assembled: true },
          { world: [-0.6, -1.3, 0.55] },
          { world: [0.2, -1.3, 0.55] },
          { world: [0.2, 0.2, 0.55] },
          { part: "gpu", assembled: true, offset: [0.95, 0.12, 0.6] },
          { part: "gpu", offset: [0.95, 0.12, 0.6] },
          { part: "gpu" },
        ],
      },
      {
        id: "hdd",
        route: "Power supply → Hard drive",
        title: "Power the drive",
        badge: "≈ 7 W",
        caption: {
          beginner: "A thin SATA power cable keeps the hard drive's disks spinning.",
          advanced:
            "The SATA power connector supplies 12 V for the spindle motor and 5 V for the electronics. A 7200 RPM drive uses about 6–8 W while working.",
        },
        focus: ["psu", "hdd"],
        path: [
          { part: "psu" },
          { part: "psu", assembled: true },
          { world: [-0.4, -1.9, -0.76] },
          { world: [1.53, -1.9, -0.76] },
          { part: "hdd", assembled: true, offset: [0.08, -0.05, -0.74] },
          { part: "hdd", offset: [0.08, -0.05, -0.74] },
          { part: "hdd" },
        ],
      },
    ],
  },
];
