import type { Device } from "../../types";
import { phoneFlows } from "../flows/phone";
import { phoneQuiz } from "../quiz/phone";

/**
 * Smartphone — learning content and 3D placement.
 *
 * Coordinates (scene units, roughly 1 unit = 2 cm):
 *   x: left (−) → right (+) seen from the back, y: bottom edge (0) → top (7.5),
 *   z: screen side (−) → back glass (+)
 * The phone stands upright with its back toward the camera, the way a teardown starts.
 * `position` is the assembled center; `explodeOffset` is added at 100% explode. Parts come
 * out of the back in a staircase; the screen moves away on the other side of the frame.
 */
export const phone: Device = {
  id: "phone",
  name: "Smartphone",
  meta: "6.1-inch · Glass back",
  intro: "Take the back off, then click any part to learn what it does.",
  description:
    "A pocket computer that squeezes a processor, memory, storage, battery, screen and cameras into a thin sandwich of glass and metal. Most of its chips are soldered together to save space.",
  parts: [
    {
      id: "soc",
      code: "PRC-01",
      name: "SoC",
      fullName: "System on a chip",
      category: "processing",
      definition: {
        beginner: "One chip that holds the phone's processor, graphics and more, all in one.",
        advanced:
          "A system on a chip that combines CPU cores, a GPU, a neural processing unit (NPU), an image signal processor and usually the cellular modem.",
      },
      function: {
        beginner: "Runs apps, draws the screen and processes photos while using as little battery as possible.",
        advanced:
          "Shares the work between big and small CPU cores, the GPU and dedicated accelerators to balance speed, heat and battery life.",
      },
      connectsTo: ["mb", "ram", "cooling"],
      specs: [
        { label: "CPU cores", value: "6 (2 big + 4 small)" },
        { label: "Process", value: "3 nm" },
      ],
      failureSigns: "Overheating, constant slowdowns, or a phone stuck restarting over and over.",
      position: [0.45, 6.35, 0.045],
      explodeOffset: [0, 0.5, 2.5],
    },
    {
      id: "ram",
      code: "MEM-01",
      name: "RAM",
      fullName: "LPDDR5X memory",
      category: "memory",
      definition: {
        beginner: "Short-term memory for the apps you have open right now.",
        advanced:
          "Low-power LPDDR5X DRAM, often stacked right on top of the SoC (package on package) to keep the connections short.",
      },
      function: {
        beginner: "Lets you switch between apps without them having to reload.",
        advanced:
          "Holds active app data for the SoC with high bandwidth and very low power use. When it fills up, the system closes apps in the background.",
      },
      connectsTo: ["soc", "mb"],
      specs: [
        { label: "Type", value: "LPDDR5X" },
        { label: "Capacity", value: "8 GB" },
      ],
      failureSigns: "Apps constantly closing in the background, crashes, or random restarts.",
      position: [0.45, 6.35, 0.085],
      explodeOffset: [0, 0.6, 3.2],
    },
    {
      id: "storage",
      code: "STO-01",
      name: "Storage",
      fullName: "UFS flash storage",
      category: "storage",
      definition: {
        beginner: "The chip that keeps your photos, apps and files, even when the phone is off.",
        advanced: "A UFS 4.0 chip: NAND flash with its own controller, soldered to the logic board.",
      },
      function: {
        beginner: "Saves everything you keep on the phone and loads apps quickly.",
        advanced:
          "Gives fast reads and writes over a high-speed serial link to the SoC. It can't be upgraded later because it is soldered in place.",
      },
      connectsTo: ["mb", "soc"],
      specs: [
        { label: "Capacity", value: "256 GB" },
        { label: "Type", value: "UFS 4.0" },
      ],
      failureSigns: "\"Storage full\" warnings, very slow apps, or photos and files that disappear.",
      position: [1.2, 5.45, 0.045],
      explodeOffset: [0.3, 0.3, 2.4],
    },
    {
      id: "battery",
      code: "PWR-01",
      name: "Battery",
      fullName: "Lithium-ion battery",
      category: "power",
      definition: {
        beginner: "The rechargeable battery that powers the whole phone.",
        advanced:
          "A single lithium-ion polymer cell of about 3.9 V, with a protection circuit that guards against over-charging, over-heating and short circuits.",
      },
      function: {
        beginner: "Stores energy from the charger and keeps the phone running all day.",
        advanced:
          "Feeds the power management chip, which turns its voltage into the many supplies the SoC, screen and radios need. Capacity is measured in mAh.",
      },
      connectsTo: ["mb"],
      specs: [
        { label: "Capacity", value: "4,000 mAh" },
        { label: "Voltage", value: "3.87 V (nominal)" },
      ],
      failureSigns:
        "Fast drain, sudden shutdowns at 20–30%, or a swollen battery pushing the screen or back out. Stop using a swollen battery.",
      position: [0, 2.9, 0.04],
      explodeOffset: [-0.2, -0.3, 1.5],
    },
    {
      id: "cooling",
      code: "CLG-01",
      name: "Vapor chamber",
      fullName: "Passive cooling plate",
      category: "cooling",
      definition: {
        beginner: "A thin sealed metal plate that spreads heat away from the processor. Phones have no fans.",
        advanced:
          "A flat copper chamber with a little liquid inside. The liquid boils at the hot spot and condenses in cooler areas, spreading heat into the frame. Graphite sheets help too.",
      },
      function: {
        beginner: "Stops one spot from getting too hot, so the phone can stay fast.",
        advanced:
          "Moves heat from the SoC across a wide area so the phone can hold its performance for longer before it has to throttle.",
      },
      connectsTo: ["soc", "frame"],
      specs: [
        { label: "Type", value: "Vapor chamber + graphite" },
        { label: "Fans", value: "None" },
      ],
      failureSigns: "The phone gets very hot in one spot and slows down quickly during games or video.",
      position: [0.6, 5.6, -0.07],
      explodeOffset: [0.2, 0.3, 0.8],
    },
    {
      id: "mb",
      code: "CON-01",
      name: "Logic board",
      fullName: "Main circuit board",
      category: "connectivity",
      definition: {
        beginner: "The main board that the phone's chips are soldered onto.",
        advanced:
          "A compact, often double-stacked board carrying the SoC, memory, storage, the power management chip, the radios, and connectors for the screen, cameras and battery.",
      },
      function: {
        beginner: "Connects every part and shares power and data between them.",
        advanced:
          "Routes high-speed signals and power, and drives the antennas for 5G, Wi-Fi, Bluetooth and NFC that are built into the frame.",
      },
      connectsTo: ["soc", "ram", "storage", "battery", "port", "display", "camera"],
      specs: [
        { label: "Radios", value: "5G, Wi-Fi 6E, Bluetooth, NFC" },
        { label: "Layout", value: "Stacked board" },
      ],
      failureSigns: "No power, no signal, or a phone that won't charge or start up.",
      position: [0.72, 6.1, 0],
      explodeOffset: [0, 0.5, 1.6],
    },
    {
      id: "port",
      code: "CON-02",
      name: "USB-C port",
      fullName: "Charging and data port",
      category: "connectivity",
      definition: {
        beginner: "The socket at the bottom where you plug in the charging cable.",
        advanced:
          "A USB Type-C connector on a small sub-board, linked to the logic board by a flex cable, often together with the microphone and speaker.",
      },
      function: {
        beginner: "Charges the battery and connects the phone to a computer or accessories.",
        advanced:
          "Agrees on charging power with the charger (USB Power Delivery) and carries data. Wired charging of about 20–30 W is common.",
      },
      connectsTo: ["mb"],
      specs: [
        { label: "Connector", value: "USB-C" },
        { label: "Wired charging", value: "About 20–30 W" },
      ],
      failureSigns: "A loose cable, charging only at certain angles, or no charging at all. Pocket lint in the port is a common cause.",
      position: [0, 0.4, 0.02],
      explodeOffset: [0.4, 0, 1.4],
    },
    {
      id: "display",
      code: "IO-01",
      name: "Display",
      fullName: "OLED touchscreen",
      category: "io",
      definition: {
        beginner: "The screen you look at and touch.",
        advanced:
          "An OLED panel, where every pixel makes its own light, bonded to a touch-sensor layer and strengthened cover glass.",
      },
      function: {
        beginner: "Shows the picture and senses where your fingers touch.",
        advanced:
          "Shows frames from the SoC at up to 120 Hz and reports touch positions from the capacitive sensor. It is often the most expensive part to replace.",
      },
      connectsTo: ["mb", "frame"],
      specs: [
        { label: "Size", value: "6.1 inch" },
        { label: "Type", value: "OLED" },
        { label: "Refresh rate", value: "60–120 Hz" },
      ],
      failureSigns: "Cracked glass, areas that don't respond to touch, colored lines, or burn-in.",
      position: [0, 3.75, -0.17],
      explodeOffset: [1.4, 0, -2.4],
    },
    {
      id: "camera",
      code: "IO-02",
      name: "Camera",
      fullName: "Rear camera module",
      category: "io",
      definition: {
        beginner: "The small cameras on the back that take photos and videos.",
        advanced:
          "Modules with a lens stack, an image sensor and often optical image stabilization, sending raw image data to the SoC's image signal processor.",
      },
      function: {
        beginner: "Catches light and turns it into photos and video.",
        advanced:
          "Each sensor turns light into electrical signals; the SoC's image signal processor and NPU turn those into the final picture.",
      },
      connectsTo: ["mb"],
      specs: [
        { label: "Cameras", value: "2 (main + ultra-wide)" },
        { label: "Main sensor", value: "48 MP" },
      ],
      failureSigns: "Blurry or black photos, a camera that won't focus, or a buzzing sound from the lens.",
      position: [-1.0, 6.35, 0.05],
      explodeOffset: [-0.9, 0.7, 2.4],
    },
    {
      id: "frame",
      code: "STR-01",
      name: "Frame",
      fullName: "Aluminum midframe",
      category: "structure",
      definition: {
        beginner: "The metal frame that holds everything together.",
        advanced:
          "An aluminum midframe and side rails that every part mounts to. Sections of the rails also work as antennas, split by thin plastic lines.",
      },
      function: {
        beginner: "Keeps the phone stiff and protects the parts inside.",
        advanced: "Gives strength, spreads heat and holds the antennas. Its seals give the phone its water resistance.",
      },
      connectsTo: ["display", "back", "mb", "battery", "cooling"],
      specs: [
        { label: "Material", value: "Aluminum" },
        { label: "Water resistance", value: "IP68" },
      ],
      failureSigns: "A bent frame, a screen lifting at the edge, or a phone that is no longer water-resistant after a repair.",
      position: [0, 3.75, 0],
      explodeOffset: [0, 0, 0],
    },
    {
      id: "back",
      code: "STR-02",
      name: "Back glass",
      fullName: "Rear glass panel",
      category: "structure",
      definition: {
        beginner: "The glass panel on the back of the phone.",
        advanced:
          "Strengthened glass glued to the frame. Unlike metal, glass lets wireless charging and radio signals pass through.",
      },
      function: {
        beginner: "Protects the inside of the phone and lets it charge on a wireless pad.",
        advanced: "Covers the wireless charging coil and keeps the water-resistant seal with its adhesive.",
      },
      connectsTo: ["frame", "mb"],
      specs: [
        { label: "Material", value: "Strengthened glass" },
        { label: "Wireless charging", value: "Qi, up to 15 W" },
      ],
      failureSigns: "Cracks, a panel lifting at the edge, or wireless charging that no longer works.",
      position: [0, 3.75, 0.19],
      explodeOffset: [-3.4, 0, 3.6],
    },
  ],
  flows: phoneFlows,
  quiz: phoneQuiz,
};
