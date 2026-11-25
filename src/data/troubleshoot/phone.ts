import type { TroubleshootScenario } from "../../types";

/** Troubleshooting scenarios for the Smartphone. */
export const phoneScenarios: TroubleshootScenario[] = [
  {
    id: "charge-angle",
    title: "Only charges at an angle",
    symptom: "The phone only charges if you hold the cable at an angle, and it stops when you let go.",
    clues: [
      "Two different cables do the same thing.",
      "Wireless charging still works.",
      "The phone lives in a jeans pocket.",
    ],
    culprit: "port",
    cause: "Pocket lint built up inside the USB-C port, so the plug can't go in all the way.",
    fix: "Power off and gently clear the port with a wooden toothpick or plastic pick (never metal), then try the cable again.",
    checks: {
      port: {
        relevance: "likely",
        finding: "The USB-C port is packed with lint at the back, so the plug stops short.",
      },
      battery: { relevance: "possible", finding: "The battery is healthy and charges normally on a wireless pad." },
      mb: { relevance: "possible", finding: "The charging circuit works: wireless charging is normal." },
      back: { relevance: "unlikely", finding: "The back glass is intact, and wireless charging through it works." },
    },
  },
  {
    id: "dead-touch",
    title: "Part of the screen ignores touch",
    symptom: "Taps near the top of the screen do nothing, but the rest of the screen works.",
    clues: ["The phone was dropped last week.", "A crack runs across the top corner.", "The picture still looks normal."],
    culprit: "display",
    cause: "The drop cracked the screen and broke part of its touch sensor layer.",
    fix: "Replace the display assembly. A case and a screen protector help prevent it happening again.",
    checks: {
      display: {
        relevance: "likely",
        finding: "The crack has damaged the touch layer under the glass in exactly the area that stopped working.",
      },
      frame: {
        relevance: "possible",
        finding: "The corner of the frame is scuffed where it hit the ground, but it is still straight.",
      },
      mb: { relevance: "possible", finding: "The display's flex cable is firmly connected to the logic board." },
      soc: { relevance: "possible", finding: "Apps run smoothly and respond to touch everywhere else on the screen." },
    },
  },
  {
    id: "early-shutdown",
    title: "Switches off at 30%",
    symptom: "The phone suddenly turns off with 20–30% battery left, especially when opening the camera or when it is cold.",
    clues: ["The phone is three years old and used all day.", "It turns back on when plugged in.", "It used to last a full day."],
    culprit: "battery",
    cause: "The worn battery can no longer deliver short bursts of high current, so the phone shuts down to protect itself.",
    fix: "Replace the battery. Lithium-ion batteries lose capacity after a few hundred full charge cycles.",
    checks: {
      battery: {
        relevance: "likely",
        finding: "The battery's health is down to 71%, and its voltage dips sharply when the camera starts.",
      },
      soc: { relevance: "possible", finding: "No app is using the processor in the background." },
      display: {
        relevance: "possible",
        finding: "The screen is on high brightness, which drains faster, but it doesn't cause sudden shutdowns.",
      },
      port: { relevance: "possible", finding: "The USB-C port is clean and charges at full speed." },
      camera: { relevance: "possible", finding: "The camera works normally; it just draws extra power when it starts." },
    },
  },
];
