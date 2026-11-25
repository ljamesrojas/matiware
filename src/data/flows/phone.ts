import type { Flow, FlowPoint } from "../../types";

/**
 * Flow-mode content for the Smartphone.
 * Board waypoints are relative to the logic board (`part: "mb"`), so the traces follow it
 * when it comes out of the frame. Watts are approximate.
 */

/** A point on the back face of the logic board, in board-local x / y. */
const board = (x: number, y: number): FlowPoint => ({ part: "mb", offset: [x, y, 0.05] });

const STORAGE = board(0.48, -0.65);
const SOC = board(-0.27, 0.25);
const DISPLAY_CONNECTOR = board(0.3, 0.9);
const BATTERY_CONNECTOR = board(0, -1.15);
const BATTERY_FLEX: FlowPoint = { part: "battery", offset: [0.72, 1.9, 0.09] };
const DISPLAY_FLEX: FlowPoint = { part: "display", offset: [0.6, 2.4, 0.05] };

export const phoneFlows: Flow[] = [
  {
    id: "data",
    name: "Data flow",
    shortName: "Data",
    question: "What happens when you open an app?",
    intro: "Follow an app from the storage chip to the screen.",
    badgeLabel: "Carries",
    steps: [
      {
        id: "load",
        route: "Storage → RAM",
        title: "Load the app",
        badge: "App files",
        caption: {
          beginner: "When you open an app, it is copied from the storage chip into RAM.",
          advanced:
            "The UFS controller streams the app's code and data to the SoC's memory controller, which writes it into the LPDDR5X RAM stacked on top.",
        },
        focus: ["storage", "ram"],
        via: ["mb", "soc"],
        path: [{ part: "storage" }, STORAGE, board(-0.27, -0.65), SOC, { part: "ram" }],
      },
      {
        id: "fetch",
        route: "RAM → SoC",
        title: "Run the instructions",
        badge: "Instructions + data",
        caption: {
          beginner: "The processor reads the app from RAM and runs it.",
          advanced:
            "Instructions and data move from RAM into the CPU caches, and the operating system picks big or small cores depending on how hard the app works.",
        },
        focus: ["ram", "soc"],
        via: ["mb"],
        path: [{ part: "ram" }, { part: "ram", offset: [0.6, 0, 0] }, { part: "soc", offset: [0.6, 0, 0] }, { part: "soc" }],
      },
      {
        id: "display",
        route: "SoC → Display",
        title: "Show the picture",
        badge: "Video frames",
        caption: {
          beginner: "The graphics part of the chip draws the screen and sends it to the display.",
          advanced:
            "The GPU renders each frame and the display controller sends it over a MIPI DSI link, up to 120 times a second.",
        },
        focus: ["soc", "display"],
        via: ["mb"],
        path: [{ part: "soc" }, SOC, board(0.3, 0.25), DISPLAY_CONNECTOR, DISPLAY_FLEX, { part: "display" }],
      },
    ],
  },
  {
    id: "power",
    name: "Power flow",
    shortName: "Power",
    question: "Where does the power go?",
    intro: "See how the charger and battery power the phone. Watts are approximate.",
    badgeLabel: "Approx. power",
    steps: [
      {
        id: "charger",
        route: "Charger → USB-C port",
        title: "Plug in the charger",
        badge: "≈ 20 W",
        caption: {
          beginner: "The charging cable plugs into the USB-C port at the bottom of the phone.",
          advanced:
            "Before fast charging starts, USB Power Delivery agrees on a higher voltage (often 9 V) and a current with the charger.",
        },
        focus: ["port"],
        path: [{ part: "port", offset: [0, -0.3, 1.4] }, { part: "port", offset: [0, -0.3, 0.05] }, { part: "port" }],
        startMarker: { label: "USB-C charger", icon: "plug" },
      },
      {
        id: "charge",
        route: "USB-C port → Battery",
        title: "Charge the battery",
        badge: "≈ 20 W",
        caption: {
          beginner: "A charging chip on the logic board fills the battery.",
          advanced:
            "The charging chip converts the input down to the cell's maximum of about 4.4 V and slows charging after about 80% to protect the battery.",
        },
        focus: ["port", "battery"],
        via: ["mb"],
        path: [
          { part: "port" },
          { part: "port", offset: [1.62, 0.3, 0.05] },
          { part: "port", offset: [1.62, 4.4, 0.05] },
          board(0.9, -1.15),
          BATTERY_CONNECTOR,
          BATTERY_FLEX,
          { part: "battery" },
        ],
      },
      {
        id: "soc",
        route: "Battery → SoC",
        title: "Power the chip",
        badge: "≈ 1–8 W",
        caption: {
          beginner: "The battery powers the chip that runs everything.",
          advanced:
            "The power management chip splits the battery's ~3.9 V into many low-voltage supplies. The SoC uses well under 1 W when idle and up to about 8 W in demanding games.",
        },
        focus: ["battery", "soc"],
        via: ["mb"],
        path: [{ part: "battery" }, BATTERY_FLEX, BATTERY_CONNECTOR, board(-0.27, -1.15), SOC, { part: "soc" }],
      },
      {
        id: "display",
        route: "Battery → Display",
        title: "Light up the screen",
        badge: "≈ 1–2 W",
        caption: {
          beginner: "The screen is one of the biggest users of battery.",
          advanced:
            "An OLED panel uses more power for bright, white content and less for dark content, roughly 1–2 W at everyday brightness.",
        },
        focus: ["battery", "display"],
        via: ["mb"],
        path: [{ part: "battery" }, BATTERY_FLEX, BATTERY_CONNECTOR, board(0.3, -1.15), DISPLAY_CONNECTOR, DISPLAY_FLEX, { part: "display" }],
      },
    ],
  },
];
