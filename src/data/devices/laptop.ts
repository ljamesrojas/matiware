import type { Device } from "../../types";
import { laptopFlows } from "../flows/laptop";
import { laptopQuiz } from "../quiz/laptop";
import { laptopScenarios } from "../troubleshoot/laptop";

/**
 * Laptop — learning content and 3D placement.
 *
 * Coordinates (scene units, roughly 1 unit = 5 cm):
 *   x: left (−) → right (+), y: desk (0) → up, z: hinge / back (−) → front (+)
 * The base is 6.2 × 0.36 × 4.4 with the lid hinged at the back. `position` is the assembled
 * center of each part; `explodeOffset` is added at 100% explode. Parts lift out of the
 * bottom case in layers, the top case (keyboard) is lifted off and set down in front, and
 * the lid tilts away.
 */
export const laptop: Device = {
  id: "laptop",
  name: "Laptop",
  meta: "14-inch · Thin and light",
  intro: "Lift the parts out of the case, then click any part to learn what it does.",
  description:
    "A portable computer with the same kinds of parts as a desktop, squeezed into a thin case with a built-in screen, keyboard and battery. Many parts are smaller, and some are soldered to the board.",
  parts: [
    {
      id: "cpu",
      code: "PRC-01",
      name: "CPU",
      fullName: "Mobile processor",
      category: "processing",
      definition: {
        beginner: "The main chip that runs every program. In most laptops it also draws the picture on the screen.",
        advanced:
          "A low-power processor package with CPU cores, an integrated GPU and a memory controller, soldered to the motherboard (BGA) instead of sitting in a socket.",
      },
      function: {
        beginner: "Runs the operating system and apps while using little power, so the battery lasts longer.",
        advanced:
          "Boosts its clock speed under load and drops into low-power states when idle, staying within a power limit of roughly 15–28 W that the cooling and battery can handle.",
      },
      connectsTo: ["mb", "cooler", "ram"],
      specs: [
        { label: "Cores / threads", value: "8 / 16" },
        { label: "Power limit", value: "15–28 W" },
        { label: "Graphics", value: "Integrated" },
      ],
      failureSigns:
        "Overheating and slowdowns, random shutdowns, or no power-on. Because it is soldered, a dead CPU usually means replacing the whole motherboard.",
      position: [-0.8, 0.115, -1.25],
      explodeOffset: [0, 1.55, 0],
    },
    {
      id: "ram",
      code: "MEM-01",
      name: "RAM",
      fullName: "Laptop memory (SO-DIMM)",
      category: "memory",
      definition: {
        beginner: "Short-term memory that holds whatever the CPU is working on right now.",
        advanced:
          "Volatile DDR5 memory on a small-outline module (SO-DIMM). Many thin laptops solder the memory chips straight onto the board instead, so they can't be upgraded.",
      },
      function: {
        beginner: "Lets you keep many apps and browser tabs open without slowing down.",
        advanced:
          "Feeds both the CPU cores and the integrated graphics, which share the same memory, so capacity and speed affect both.",
      },
      connectsTo: ["mb", "cpu"],
      specs: [
        { label: "Type", value: "DDR5 SO-DIMM" },
        { label: "Capacity", value: "16 GB" },
        { label: "Speed", value: "5600 MT/s" },
      ],
      failureSigns: "Random crashes, blue screens, or the laptop powering on to a black screen.",
      position: [0.75, 0.13, -1.5],
      explodeOffset: [0.3, 1.6, 0],
    },
    {
      id: "ssd",
      code: "STO-01",
      name: "M.2 SSD",
      fullName: "NVMe solid-state drive",
      category: "storage",
      definition: {
        beginner: "A small, fast storage stick that keeps your files and operating system when the laptop is off.",
        advanced: "Non-volatile NAND flash storage on an M.2 2280 card, using the NVMe protocol over PCIe lanes from the processor.",
      },
      function: {
        beginner: "Stores the operating system, apps and files, and loads them quickly.",
        advanced:
          "Gives fast, silent storage with no moving parts, which copes with bumps and drops far better than a spinning hard drive.",
      },
      connectsTo: ["mb", "cpu"],
      specs: [
        { label: "Capacity", value: "512 GB" },
        { label: "Interface", value: "PCIe 4.0 NVMe" },
      ],
      failureSigns: "Slow start-up, the drive missing in BIOS, or files that won't open.",
      position: [1.9, 0.115, -0.85],
      explodeOffset: [0.4, 1.5, 0.3],
    },
    {
      id: "wifi",
      code: "CON-02",
      name: "Wi-Fi card",
      fullName: "Wireless network card",
      category: "connectivity",
      definition: {
        beginner: "A small card that connects the laptop to Wi-Fi networks and Bluetooth devices.",
        advanced:
          "An M.2 2230 module with Wi-Fi 6E and Bluetooth radios, wired to antennas that run through the hinge into the display lid.",
      },
      function: {
        beginner: "Sends and receives data over the air, so you can go online without a cable.",
        advanced:
          "Turns network data into radio signals in the 2.4, 5 and 6 GHz bands and back. The antennas sit in the lid, away from the metal base, for better reception.",
      },
      connectsTo: ["mb", "display"],
      specs: [
        { label: "Standard", value: "Wi-Fi 6E" },
        { label: "Bluetooth", value: "5.3" },
        { label: "Form factor", value: "M.2 2230" },
      ],
      failureSigns: "Wi-Fi that keeps dropping, a weak signal, or no networks showing at all.",
      position: [2.2, 0.115, -1.65],
      explodeOffset: [0.5, 1.65, -0.2],
    },
    {
      id: "battery",
      code: "PWR-01",
      name: "Battery",
      fullName: "Lithium-ion battery pack",
      category: "power",
      definition: {
        beginner: "A rechargeable pack that powers the laptop when it is not plugged in.",
        advanced:
          "A lithium-ion polymer pack of several cells in series, with a battery management circuit that tracks charge, temperature and health.",
      },
      function: {
        beginner: "Stores energy from the charger and powers every part when you are on the go.",
        advanced:
          "Supplies around 11–12 V to the board's power circuits. Its capacity in watt-hours (Wh) decides how long the laptop runs unplugged.",
      },
      connectsTo: ["mb"],
      specs: [
        { label: "Capacity", value: "60 Wh" },
        { label: "Voltage", value: "11.55 V (3 cells)" },
      ],
      failureSigns:
        "Short battery life, the laptop dying at a high percentage, or a swollen battery lifting the case or touchpad. Stop using a swollen battery.",
      position: [0, 0.14, 1.0],
      explodeOffset: [0, 0.7, 0.6],
    },
    {
      id: "cooler",
      code: "CLG-01",
      name: "Cooling system",
      fullName: "Heat pipes and blower fan",
      category: "cooling",
      definition: {
        beginner: "Flat copper pipes and a small fan that carry heat away from the processor.",
        advanced:
          "Copper heat pipes move heat from a cold plate on the CPU to a fin stack at the back, where a centrifugal blower fan pushes it out through the vents.",
      },
      function: {
        beginner: "Keeps the laptop from overheating, so it stays fast and comfortable to touch.",
        advanced:
          "Removes the processor's heat so it can hold higher clock speeds. Dust in the fins or a weak fan leads to thermal throttling.",
      },
      connectsTo: ["cpu", "mb"],
      specs: [
        { label: "Fan", value: "1 × blower" },
        { label: "Heat pipes", value: "2" },
      ],
      failureSigns: "A loud or rattling fan, a hot keyboard, or the laptop slowing down under load.",
      position: [-1.65, 0.2, -1.4],
      explodeOffset: [-0.2, 2.3, -0.2],
    },
    {
      id: "mb",
      code: "CON-01",
      name: "Motherboard",
      fullName: "Logic board",
      category: "connectivity",
      definition: {
        beginner: "The main circuit board that every part connects to.",
        advanced:
          "A dense multi-layer board that carries the soldered processor, power circuits, memory and M.2 slots, the ports, and connectors for the screen, keyboard and battery.",
      },
      function: {
        beginner: "Connects all the parts and shares power and data between them.",
        advanced:
          "Routes data and power, charges the battery through USB-C Power Delivery and converts the battery voltage into the many lower voltages each part needs.",
      },
      connectsTo: ["cpu", "ram", "ssd", "wifi", "battery", "cooler", "display", "keyboard"],
      specs: [
        { label: "Ports", value: "2 × USB-C, USB-A, HDMI" },
        { label: "Charging", value: "USB-C PD, 65 W" },
      ],
      failureSigns: "No power, a laptop that won't charge, or ports that stop working.",
      position: [0.5, 0.08, -1.25],
      explodeOffset: [0, 1.0, 0],
    },
    {
      id: "display",
      code: "IO-01",
      name: "Display",
      fullName: "Screen and lid",
      category: "io",
      definition: {
        beginner: "The screen in the lid that shows you everything the laptop is doing.",
        advanced:
          "An LCD or OLED panel in the lid, driven over an internal eDP cable through the hinge. The lid also holds the webcam and the Wi-Fi antennas.",
      },
      function: {
        beginner: "Turns the picture from the processor into light you can see.",
        advanced:
          "Shows frames from the integrated GPU at a set resolution and refresh rate. The panel type affects color, brightness and how much battery it uses.",
      },
      connectsTo: ["mb", "wifi"],
      specs: [
        { label: "Size", value: "14 inch" },
        { label: "Resolution", value: "1920 × 1200" },
        { label: "Refresh rate", value: "60 Hz" },
      ],
      failureSigns: "Flickering, lines across the screen, dead pixels, or a very dim picture.",
      position: [0, 2.34, -2.69],
      explodeOffset: [0, 1.2, -2.2],
    },
    {
      id: "keyboard",
      code: "IO-02",
      name: "Keyboard",
      fullName: "Top case with keyboard and touchpad",
      category: "io",
      definition: {
        beginner: "The keys and touchpad you use to type and move the pointer.",
        advanced:
          "The top case (palm rest) holds a scissor-switch keyboard and a glass touchpad, connected to the board with flat ribbon cables.",
      },
      function: {
        beginner: "Turns your key presses and finger movements into input the computer understands.",
        advanced:
          "A keyboard controller scans the key matrix to find which keys are pressed; the touchpad reports finger positions and gestures to the operating system.",
      },
      connectsTo: ["mb", "chassis"],
      specs: [
        { label: "Layout", value: "Full size, backlit" },
        { label: "Touchpad", value: "Glass, multi-touch" },
      ],
      failureSigns: "Keys that don't respond or repeat, a jumpy pointer, or a touchpad that won't click.",
      position: [0, 0.34, 0],
      explodeOffset: [1.5, 0.9, 4.6],
    },
    {
      id: "chassis",
      code: "STR-01",
      name: "Case",
      fullName: "Bottom case",
      category: "structure",
      definition: {
        beginner: "The shell that holds and protects all the parts.",
        advanced:
          "An aluminum or plastic bottom case with screw posts, rubber feet, side openings for the ports and air vents, plus the hinge mounts for the lid.",
      },
      function: {
        beginner: "Keeps the parts safe, lets air in and out, and stays light enough to carry.",
        advanced:
          "Sets the laptop's thickness, weight and airflow path, and spreads some of the heat through its surface.",
      },
      connectsTo: ["mb", "battery", "keyboard", "display"],
      specs: [
        { label: "Material", value: "Aluminum" },
        { label: "Weight", value: "1.4 kg" },
      ],
      failureSigns: "Cracks, loose or stiff hinges, or blocked vents.",
      position: [0, 0, 0],
      explodeOffset: [0, 0, 0],
    },
  ],
  flows: laptopFlows,
  quiz: laptopQuiz,
  troubleshooting: laptopScenarios,
};
