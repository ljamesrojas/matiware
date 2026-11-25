import type { TroubleshootScenario } from "../../types";

/** Troubleshooting scenarios for the Laptop. */
export const laptopScenarios: TroubleshootScenario[] = [
  {
    id: "swollen-battery",
    title: "Battery dies fast, touchpad lifts",
    symptom: "The battery lasts less than an hour, and the touchpad has started sticking up and won't click.",
    clues: [
      "The laptop is four years old.",
      "The bottom of the case bulges slightly.",
      "The problem got worse over a few weeks.",
    ],
    culprit: "battery",
    cause: "The lithium-ion battery has swollen. It holds far less charge and pushes up on the touchpad from below.",
    fix: "Stop using and charging it, and have the battery replaced. Take the old one to a battery recycling point. Never puncture or bend it.",
    checks: {
      battery: {
        relevance: "likely",
        finding: "The battery cells are puffed up and pressing against the underside of the touchpad.",
      },
      keyboard: {
        relevance: "likely",
        finding: "The touchpad itself is fine, but something underneath is pushing it up.",
      },
      chassis: {
        relevance: "possible",
        finding: "The bottom case is bent outward from the inside: something under it has expanded.",
      },
      display: {
        relevance: "possible",
        finding: "The screen is at full brightness, which uses some extra battery, but it can't lift the touchpad.",
      },
      cpu: { relevance: "possible", finding: "Nothing is running in the background; the processor idles normally." },
    },
  },
  {
    id: "weak-wifi",
    title: "Wi-Fi keeps dropping",
    symptom: "The laptop keeps losing Wi-Fi and shows only one bar, even right next to the router.",
    clues: [
      "Phones on the same network work fine.",
      "The screen was replaced last month.",
      "It started straight after the repair.",
    ],
    culprit: "wifi",
    cause: "During the screen repair, one antenna cable was left unclipped from the Wi-Fi card.",
    fix: "Open the bottom case and snap both antenna cables back onto the Wi-Fi card's gold connectors.",
    checks: {
      wifi: {
        relevance: "likely",
        finding: "One of the two antenna cables is hanging loose instead of clipped onto the card.",
      },
      display: {
        relevance: "likely",
        finding: "The new screen works, and the antennas inside the lid are fine. Their cables run back down to the Wi-Fi card.",
      },
      mb: { relevance: "possible", finding: "The motherboard detects the Wi-Fi card normally." },
    },
  },
  {
    id: "hot-loud",
    title: "Hot, loud and slow",
    symptom: "The fan roars even with only a browser open, the left side gets very hot, and games stutter after a few minutes.",
    clues: [
      "It has never been cleaned.",
      "It is often used on a bed or sofa.",
      "Hot air from the vent feels weak.",
    ],
    culprit: "cooler",
    cause: "Dust clogged the cooling fins at the vent, so heat couldn't escape and the CPU slowed itself down (thermal throttling).",
    fix: "Clean the fins and fan with compressed air (hold the fan still while you do), and use the laptop on a hard, flat surface.",
    checks: {
      cooler: {
        relevance: "likely",
        finding: "A mat of dust covers the fin stack at the vent, so the fan can't push the hot air out.",
      },
      cpu: {
        relevance: "likely",
        finding: "The processor reaches 95 °C and lowers its speed to protect itself.",
      },
      chassis: {
        relevance: "possible",
        finding: "The case is fine, but using it on a soft surface blocks the air intake underneath and makes things worse.",
      },
      battery: { relevance: "possible", finding: "The battery is healthy and charges normally." },
      ram: { relevance: "possible", finding: "A memory test passes, and there is plenty of free RAM." },
    },
  },
];
