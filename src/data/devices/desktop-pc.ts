import type { Device } from "../../types";
import { desktopPcFlows } from "../flows/desktop-pc";
import { desktopPcQuiz } from "../quiz/desktop-pc";

/**
 * Desktop PC — learning content and 3D placement.
 *
 * Coordinates (scene units, roughly 1 unit = 10 cm):
 *   x: rear (−) → front (+) of the tower
 *   y: bottom (−) → top (+)
 *   z: motherboard tray (−) → open side (+)
 * `position` is the assembled center of each part; `explodeOffset` is added at 100% explode.
 * Most parts leave the case through the open side (+z) so nothing passes through a wall.
 */
export const desktopPC: Device = {
  id: "desktop-pc",
  name: "Desktop PC",
  meta: "Tower · ATX",
  intro: "Pull it apart, then click any part to learn what it does.",
  description:
    "A tower computer built from separate parts you can upgrade or replace. Each part has one job, and together they turn power and data into what you see on screen.",
  parts: [
    {
      id: "cpu",
      code: "PRC-01",
      name: "CPU",
      fullName: "Central processing unit",
      category: "processing",
      definition: {
        beginner: "The main chip that follows instructions and does the calculations for every program.",
        advanced:
          "A general-purpose processor that fetches, decodes and executes instructions, with multiple cores, on-chip cache and an integrated memory controller.",
      },
      function: {
        beginner: "Runs your apps and the operating system by doing billions of small steps every second.",
        advanced:
          "Executes program threads in parallel across its cores. Clock speed, instructions per clock and cache size decide how fast work gets done.",
      },
      connectsTo: ["mb", "cooler", "ram"],
      specs: [
        { label: "Cores / threads", value: "8 / 16" },
        { label: "Boost clock", value: "4.5 GHz" },
        { label: "Socket", value: "AM5" },
      ],
      failureSigns: "No display or no boot, sudden shutdowns from overheating, or very slow performance under load.",
      position: [-0.4, 1.45, -0.84],
      explodeOffset: [0, 0.1, 1.45],
    },
    {
      id: "gpu",
      code: "PRC-02",
      name: "Graphics card",
      fullName: "Graphics processing unit (GPU)",
      category: "processing",
      definition: {
        beginner: "A card with its own processor and memory that draws images, video and games on your screen.",
        advanced:
          "A massively parallel processor with dedicated VRAM, connected over PCIe and optimized for graphics and parallel compute workloads.",
      },
      function: {
        beginner: "Takes visual work off the CPU and sends the finished picture to your monitor.",
        advanced:
          "Renders frames and accelerates parallel tasks such as video encoding and AI, then outputs through HDMI or DisplayPort.",
      },
      connectsTo: ["mb", "psu"],
      specs: [
        { label: "VRAM", value: "8 GB GDDR6" },
        { label: "Interface", value: "PCIe 4.0 x16" },
      ],
      failureSigns: "Flickering or strange shapes on screen, driver crashes, or no video output.",
      position: [-0.75, 0.08, -0.32],
      explodeOffset: [0.3, -0.95, 2.3],
    },
    {
      id: "ram",
      code: "MEM-01",
      name: "RAM",
      fullName: "Random access memory",
      category: "memory",
      definition: {
        beginner: "Short-term memory that holds the data the CPU is working on right now.",
        advanced:
          "Volatile DRAM modules (DIMMs) that store active program data. Their contents are lost when power is removed.",
      },
      function: {
        beginner: "Gives the CPU fast access to open apps and files. More RAM lets more things run at once.",
        advanced:
          "Feeds the CPU memory controller with far lower latency than storage. Capacity, speed and dual-channel setup all affect performance.",
      },
      connectsTo: ["mb", "cpu"],
      specs: [
        { label: "Type", value: "DDR5" },
        { label: "Capacity", value: "2 × 8 GB" },
        { label: "Speed", value: "5600 MT/s" },
      ],
      failureSigns: "Random crashes, blue screens, or beeping at startup.",
      position: [0.37, 1.35, -0.69],
      explodeOffset: [0.45, 0.45, 1.9],
    },
    {
      id: "ssd",
      code: "STO-01",
      name: "M.2 SSD",
      fullName: "NVMe solid-state drive",
      category: "storage",
      definition: {
        beginner:
          "A small, very fast storage stick that keeps your files and operating system even when the PC is off.",
        advanced: "Non-volatile NAND flash storage using the NVMe protocol over PCIe lanes, in the M.2 2280 form factor.",
      },
      function: {
        beginner: "Stores the operating system, apps and files, and loads them quickly into RAM.",
        advanced: "Provides persistent storage with much higher throughput and lower latency than SATA drives.",
      },
      connectsTo: ["mb", "cpu"],
      specs: [
        { label: "Capacity", value: "1 TB" },
        { label: "Interface", value: "PCIe 4.0 NVMe" },
      ],
      failureSigns: "Slow boot, drive missing in BIOS, or files that won't open.",
      position: [-0.6, 0.62, -0.84],
      explodeOffset: [0.15, -0.35, 1.75],
    },
    {
      id: "hdd",
      code: "STO-02",
      name: "Hard drive",
      fullName: "Hard disk drive (HDD)",
      category: "storage",
      definition: {
        beginner: "A larger, slower drive that stores lots of files on spinning disks.",
        advanced: "Magnetic storage with rotating platters and a moving read/write head, connected over SATA.",
      },
      function: {
        beginner: "Keeps big collections of files, backups and games at a low cost.",
        advanced:
          "Offers high capacity at a low cost per terabyte, at the price of slower seek times. Common for bulk and backup storage.",
      },
      connectsTo: ["mb", "psu"],
      specs: [
        { label: "Capacity", value: "2 TB" },
        { label: "Speed", value: "7200 RPM" },
      ],
      failureSigns: "Clicking or grinding sounds, very slow file access, or disk errors.",
      position: [1.45, -1.95, 0.05],
      explodeOffset: [0.35, -0.42, 2.6],
    },
    {
      id: "psu",
      code: "PWR-01",
      name: "Power supply",
      fullName: "Power supply unit (PSU)",
      category: "power",
      definition: {
        beginner: "The box that turns wall power into the safe, steady power every part needs.",
        advanced:
          "Converts AC mains power into regulated DC rails (12 V, 5 V and 3.3 V) and delivers it through its cables.",
      },
      function: {
        beginner: "Powers the motherboard, CPU, graphics card and drives.",
        advanced:
          "Supplies stable power as the load changes. Wattage and efficiency rating (80 PLUS) decide headroom and heat.",
      },
      connectsTo: ["mb", "gpu", "hdd"],
      specs: [
        { label: "Wattage", value: "650 W" },
        { label: "Efficiency", value: "80 PLUS Gold" },
      ],
      failureSigns: "PC won't turn on, random restarts under load, or a burning smell.",
      position: [-1.38, -1.82, 0],
      explodeOffset: [-0.2, -0.32, 2.45],
    },
    {
      id: "cooler",
      code: "CLG-01",
      name: "CPU cooler",
      fullName: "Heatsink and fan",
      category: "cooling",
      definition: {
        beginner: "A metal heatsink and fan that pull heat away from the CPU.",
        advanced:
          "A thermal solution that moves heat from the CPU heat spreader, through thermal paste, into fins or a liquid radiator.",
      },
      function: {
        beginner: "Keeps the CPU from overheating so it can run at full speed.",
        advanced:
          "Holds the CPU below its temperature limit to prevent thermal throttling. Rated by the heat (TDP) it can handle.",
      },
      connectsTo: ["cpu", "mb"],
      specs: [
        { label: "Type", value: "Tower air cooler" },
        { label: "Rated for", value: "Up to 180 W" },
      ],
      failureSigns: "Loud fan, high CPU temperatures, or sudden shutdowns.",
      position: [-0.4, 1.45, 0.1],
      explodeOffset: [0.1, 1.0, 2.6],
    },
    {
      id: "fans",
      code: "CLG-02",
      name: "Case fans",
      fullName: "Intake and exhaust fans",
      category: "cooling",
      definition: {
        beginner: "Fans that pull cool air into the case and push hot air out.",
        advanced:
          "Axial fans arranged as intake and exhaust to move air through the chassis, with speed controlled by PWM.",
      },
      function: {
        beginner: "Keep every part inside the case cool.",
        advanced: "Balance intake and exhaust airflow to lower component temperatures and reduce dust buildup.",
      },
      connectsTo: ["chassis", "mb"],
      specs: [
        { label: "Size", value: "120 mm" },
        { label: "Control", value: "4-pin PWM" },
      ],
      failureSigns: "Rattling noise, a fan that doesn't spin, or rising temperatures.",
      position: [1.98, 0.62, 0],
      explodeOffset: [1.75, 0, 0.9],
    },
    {
      id: "mb",
      code: "CON-01",
      name: "Motherboard",
      fullName: "Main circuit board",
      category: "connectivity",
      definition: {
        beginner: "The main circuit board that every other part plugs into.",
        advanced:
          "The printed circuit board that hosts the CPU socket, chipset, memory slots, PCIe and M.2 slots, and I/O ports.",
      },
      function: {
        beginner: "Connects all the parts so they can talk to each other and share power.",
        advanced:
          "Routes data and power between components. Its chipset and form factor decide which CPUs, slots and ports are supported.",
      },
      connectsTo: ["cpu", "ram", "gpu", "ssd", "hdd", "psu", "fans"],
      specs: [
        { label: "Form factor", value: "ATX" },
        { label: "Socket", value: "AM5" },
      ],
      failureSigns: "No power or no POST, dead ports, or swollen capacitors.",
      position: [-0.55, 0.65, -0.9],
      explodeOffset: [0, 0, 0],
    },
    {
      id: "chassis",
      code: "STR-01",
      name: "Case",
      fullName: "Computer chassis",
      category: "structure",
      definition: {
        beginner: "The metal and glass box that holds and protects all the parts.",
        advanced:
          "The chassis provides mounting points, airflow paths, drive bays and front I/O, sized for a motherboard form factor.",
      },
      function: {
        beginner: "Holds everything in place, guides airflow and protects parts from dust and damage.",
        advanced:
          "Sets the limits for board size, graphics card length and cooler height, and shapes the airflow layout.",
      },
      connectsTo: ["mb", "psu", "fans"],
      specs: [
        { label: "Size", value: "Mid tower" },
        { label: "Supports", value: "ATX, micro-ATX" },
      ],
      failureSigns: "Poor airflow, loose front ports, or rattling panels.",
      position: [0, 0, 0],
      explodeOffset: [0, 0, 0],
    },
  ],
  flows: desktopPcFlows,
  quiz: desktopPcQuiz,
};
