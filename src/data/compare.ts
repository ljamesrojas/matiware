import type { CompareTopic } from "../types";

/**
 * Compare mode: one part type side by side across the desktop, laptop and phone.
 * Values match the specs in each device's data file. Sizes are approximate.
 */
export const compareTopics: CompareTopic[] = [
  {
    id: "processor",
    name: "Processor",
    title: "Processors across devices",
    question: "How does the main chip change as devices get smaller?",
    parts: { "desktop-pc": "cpu", laptop: "cpu", phone: "soc" },
    rows: [
      { label: "Part", values: { "desktop-pc": "Desktop CPU", laptop: "Mobile CPU", phone: "SoC" } },
      { label: "Mounted", values: { "desktop-pc": "Socket (AM5)", laptop: "Soldered", phone: "Soldered" } },
      { label: "CPU cores", values: { "desktop-pc": "8", laptop: "8", phone: "6" } },
      { label: "Power", values: { "desktop-pc": "Up to ~140 W", laptop: "15–28 W", phone: "~1–8 W" } },
      { label: "Graphics", values: { "desktop-pc": "Separate card", laptop: "Built in", phone: "Built in" } },
    ],
    takeaway: {
      beginner:
        "All three run the same kinds of programs, but the smaller the device, the less power its processor is allowed to use. A phone packs graphics, AI and more into one single chip.",
      advanced:
        "The power budget drops from over 100 W to a few watts. Mobile chips integrate the GPU (and in phones the NPU, image processor and modem) into one package to save space and energy, and they are soldered rather than socketed.",
    },
  },
  {
    id: "memory",
    name: "Memory",
    title: "Memory across devices",
    question: "How does RAM change as devices get smaller?",
    parts: { "desktop-pc": "ram", laptop: "ram", phone: "ram" },
    rows: [
      { label: "Part", values: { "desktop-pc": "DIMM sticks", laptop: "SO-DIMM stick", phone: "Stacked chip" } },
      { label: "Type", values: { "desktop-pc": "DDR5", laptop: "DDR5", phone: "LPDDR5X" } },
      { label: "Capacity", values: { "desktop-pc": "2 × 8 GB", laptop: "16 GB", phone: "8 GB" } },
      { label: "Size", values: { "desktop-pc": "133 × 31 mm", laptop: "70 × 30 mm", phone: "Chip-sized" } },
      { label: "Upgradeable", values: { "desktop-pc": "Yes", laptop: "Often", phone: "No" } },
    ],
    takeaway: {
      beginner:
        "The smaller the device, the closer the memory sits to the processor. Phones stack it right on top of the chip, which saves space and battery but means you can never add more.",
      advanced:
        "Going from DIMM to SO-DIMM to package-on-package LPDDR shortens the connections and lowers the I/O voltage and power use, at the cost of upgradeability. Many thin laptops also solder LPDDR memory.",
    },
  },
  {
    id: "storage",
    name: "Storage",
    title: "Storage across devices",
    question: "Where do the files live in each device?",
    parts: { "desktop-pc": "ssd", laptop: "ssd", phone: "storage" },
    rows: [
      { label: "Part", values: { "desktop-pc": "M.2 SSD", laptop: "M.2 SSD", phone: "UFS chip" } },
      { label: "Capacity", values: { "desktop-pc": "1 TB (+ 2 TB HDD)", laptop: "512 GB", phone: "256 GB" } },
      { label: "Interface", values: { "desktop-pc": "PCIe 4.0 NVMe", laptop: "PCIe 4.0 NVMe", phone: "UFS 4.0" } },
      { label: "Size", values: { "desktop-pc": "80 × 22 mm", laptop: "80 × 22 mm", phone: "11.5 × 13 mm" } },
      { label: "Upgradeable", values: { "desktop-pc": "Yes", laptop: "Usually", phone: "No" } },
    ],
    takeaway: {
      beginner:
        "Desktops and laptops often use the very same SSD stick. Phones solder a storage chip to the board, so choose enough storage when you buy the phone.",
      advanced:
        "Both PCs use NVMe over PCIe in the M.2 2280 form factor. Phones use UFS, a low-power flash interface in a small BGA package soldered to the logic board.",
    },
  },
  {
    id: "cooling",
    name: "Cooling",
    title: "Cooling across devices",
    question: "How does each device get rid of heat?",
    parts: { "desktop-pc": "cooler", laptop: "cooler", phone: "cooling" },
    rows: [
      { label: "Part", values: { "desktop-pc": "Tower cooler", laptop: "Heat pipes + fan", phone: "Vapor chamber" } },
      { label: "Fans", values: { "desktop-pc": "1 × 120 mm", laptop: "1 blower", phone: "None" } },
      { label: "Handles", values: { "desktop-pc": "Up to 180 W", laptop: "~15–28 W", phone: "A few watts" } },
      { label: "Noise", values: { "desktop-pc": "Quiet", laptop: "Loud under load", phone: "Silent" } },
    ],
    takeaway: {
      beginner:
        "Bigger devices can move more heat with bigger fans. Phones have no fans at all, so when they get hot they slow down to stay cool.",
      advanced:
        "Heat removal scales with fin area and airflow: a tower cooler handles well over 100 W, a laptop blower tens of watts, and a phone's passive vapor chamber only a few watts, so phones throttle sooner under long, heavy loads.",
    },
  },
  {
    id: "power",
    name: "Power",
    title: "Power across devices",
    question: "Where does each device get its energy?",
    parts: { "desktop-pc": "psu", laptop: "battery", phone: "battery" },
    rows: [
      { label: "Part", values: { "desktop-pc": "Power supply", laptop: "Battery pack", phone: "Battery" } },
      { label: "Source", values: { "desktop-pc": "Wall only", laptop: "Battery or charger", phone: "Battery or charger" } },
      { label: "Rating", values: { "desktop-pc": "650 W", laptop: "60 Wh", phone: "4,000 mAh (≈ 15 Wh)" } },
      { label: "Voltage", values: { "desktop-pc": "12 / 5 / 3.3 V", laptop: "11.55 V", phone: "3.87 V" } },
    ],
    takeaway: {
      beginner:
        "A desktop has no battery: it only works when plugged into the wall. Laptops and phones carry their energy with them and recharge over USB-C.",
      advanced:
        "A PSU continuously converts AC mains into regulated DC rails. Portable devices store energy in lithium-ion cells, rated in watt-hours, and use on-board regulators and USB Power Delivery charging.",
    },
  },
  {
    id: "board",
    name: "Main board",
    title: "Main boards across devices",
    question: "How much is plugged in, and how much is soldered?",
    parts: { "desktop-pc": "mb", laptop: "mb", phone: "mb" },
    rows: [
      { label: "Part", values: { "desktop-pc": "ATX motherboard", laptop: "Logic board", phone: "Logic board" } },
      { label: "Size", values: { "desktop-pc": "305 × 244 mm", laptop: "~220 × 80 mm", phone: "~40 × 50 mm" } },
      { label: "Plugged in", values: { "desktop-pc": "CPU, RAM, SSD, GPU", laptop: "RAM, SSD, Wi-Fi", phone: "Almost nothing" } },
      { label: "Layout", values: { "desktop-pc": "One flat board", laptop: "One dense board", phone: "Stacked board" } },
    ],
    takeaway: {
      beginner:
        "The smaller the device, the more parts are soldered straight onto the board. That saves space, but makes upgrades and repairs harder.",
      advanced:
        "Higher integration (soldered BGA parts, stacked boards) shrinks the board and improves efficiency, but reduces modularity and repairability.",
    },
  },
];

export function getCompareTopic(id: string): CompareTopic {
  return compareTopics.find((t) => t.id === id) ?? compareTopics[0];
}

/** The compare topic that a device's part belongs to, if any. */
export function findCompareTopic(deviceId: string, partId: string): CompareTopic | undefined {
  return compareTopics.find((t) => t.parts[deviceId] === partId);
}
