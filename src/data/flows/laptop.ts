import type { Flow, FlowPoint } from "../../types";

/**
 * Flow-mode content for the Laptop.
 * Board waypoints are given relative to the motherboard (`part: "mb"`), so the traces
 * follow the board when it lifts out of the case. Watts are approximate.
 */

/** A point on the top of the motherboard, in board-local x / z. */
const board = (x: number, z: number): FlowPoint => ({ part: "mb", offset: [x, 0.05, z] });

const SSD_SLOT = board(0.6, 0.4);
const CPU = board(-1.3, 0);
const RAM_SLOT = board(0.25, -0.25);
const DISPLAY_CONNECTOR = board(-0.5, -0.72);
const BATTERY_CONNECTOR = board(-0.5, 0.72);
const USB_C = board(2.12, 0.6);
const BATTERY_CABLE: FlowPoint = { part: "battery", offset: [0, 0.1, -0.9] };
const HINGE: FlowPoint = { part: "display", offset: [0, -1.95, 0.52] };

export const laptopFlows: Flow[] = [
  {
    id: "data",
    name: "Data flow",
    shortName: "Data",
    question: "What happens when you open an app?",
    intro: "Follow an app from the SSD to the screen in the lid.",
    badgeLabel: "Carries",
    steps: [
      {
        id: "load",
        route: "Storage → RAM",
        title: "Load the app",
        badge: "App files",
        caption: {
          beginner:
            "When you open an app, its files are copied from the SSD into RAM, where the processor can reach them quickly.",
          advanced:
            "The NVMe drive copies the app's files over PCIe lanes, through the processor's memory controller, straight into RAM (direct memory access).",
        },
        focus: ["ssd", "ram"],
        via: ["mb"],
        path: [{ part: "ssd" }, SSD_SLOT, board(-1.3, 0.4), CPU, board(-1.3, -0.25), RAM_SLOT, { part: "ram" }],
      },
      {
        id: "fetch",
        route: "RAM → CPU",
        title: "Run the instructions",
        badge: "Instructions + data",
        caption: {
          beginner: "The CPU pulls the app's instructions and data out of RAM and works through them.",
          advanced:
            "The memory controller streams instructions and data into the CPU caches. The cores execute them and write results back.",
        },
        focus: ["ram", "cpu"],
        via: ["mb"],
        path: [{ part: "ram" }, RAM_SLOT, board(-1.3, -0.25), CPU, { part: "cpu" }],
      },
      {
        id: "display",
        route: "CPU → Display",
        title: "Show the picture",
        badge: "Video frames",
        caption: {
          beginner:
            "The graphics part of the processor draws the picture and sends it up through the hinge to the screen.",
          advanced:
            "The integrated GPU renders frames into shared memory, and the display engine sends them over an eDP cable that runs through the hinge into the lid.",
        },
        focus: ["cpu", "display"],
        via: ["mb"],
        path: [
          { part: "cpu" },
          CPU,
          board(-0.5, 0),
          DISPLAY_CONNECTOR,
          HINGE,
          { part: "display", offset: [0, -1.0, 0.27] },
          { part: "display" },
        ],
      },
    ],
  },
  {
    id: "power",
    name: "Power flow",
    shortName: "Power",
    question: "Where does the power go?",
    intro: "See how the charger and battery power the laptop. Watts are approximate.",
    badgeLabel: "Approx. power",
    steps: [
      {
        id: "charger",
        route: "Charger → Motherboard",
        title: "Plug in the charger",
        badge: "≈ 65 W",
        caption: {
          beginner:
            "The USB-C charger plugs into the motherboard, which agrees with the charger on how much power to take.",
          advanced:
            "USB Power Delivery negotiates 20 V at up to 3.25 A (65 W) over the cable before the charger raises its voltage.",
        },
        focus: ["mb"],
        path: [board(3.1, 0.6), USB_C, board(0.5, 0.6), { part: "mb" }],
        startMarker: { label: "USB-C charger", icon: "plug" },
      },
      {
        id: "charge",
        route: "Motherboard → Battery",
        title: "Charge the battery",
        badge: "≈ 45 W",
        caption: {
          beginner: "Power the laptop doesn't need right now goes into the battery.",
          advanced:
            "The charging circuit fills the cells with a constant current, then a constant voltage as they get full, so charging slows down near 100%.",
        },
        focus: ["mb", "battery"],
        path: [{ part: "mb" }, board(-0.5, 0.3), BATTERY_CONNECTOR, BATTERY_CABLE, { part: "battery" }],
      },
      {
        id: "cpu",
        route: "Battery → CPU",
        title: "Power the processor",
        badge: "≈ 15–28 W",
        caption: {
          beginner: "Unplugged, the processor gets its power from the battery through the motherboard.",
          advanced:
            "Voltage regulators beside the processor step the battery's ~11.5 V down to about 1 V for the cores, within the chip's 15–28 W power limit.",
        },
        focus: ["battery", "cpu"],
        via: ["mb"],
        path: [{ part: "battery" }, BATTERY_CABLE, BATTERY_CONNECTOR, board(-1.3, 0.72), CPU, { part: "cpu" }],
      },
      {
        id: "display",
        route: "Battery → Display",
        title: "Light up the screen",
        badge: "≈ 4 W",
        caption: {
          beginner: "The screen is one of the biggest users of battery while you work.",
          advanced:
            "A 14-inch LCD typically draws about 3–5 W, mostly for its backlight. Turning the brightness down is the quickest way to make the battery last longer.",
        },
        focus: ["battery", "display"],
        via: ["mb"],
        path: [
          { part: "battery" },
          BATTERY_CABLE,
          BATTERY_CONNECTOR,
          board(-0.5, 0),
          DISPLAY_CONNECTOR,
          HINGE,
          { part: "display" },
        ],
      },
    ],
  },
];
