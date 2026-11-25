import type { QuizContent } from "../../types";

/**
 * Build-it quiz content for the Laptop.
 * The bottom case starts in place, so Assemble mode covers the other nine parts.
 */
export const laptopQuiz: QuizContent = {
  optionsPerQuestion: 4,

  installTips: {
    battery:
      "Screw the battery into the front of the case. In real repairs, always unplug the battery first and plug it back in last.",
    mb: "Line the ports up with the openings in the side, screw the board down and reconnect its ribbon cables gently.",
    cpu: "Laptop processors are soldered to the board at the factory, so a replacement board arrives with the CPU already on it.",
    ram: "Slide the SO-DIMM into its slot at about 30°, then press it down flat until the side clips lock.",
    ssd: "Insert the drive into the M.2 slot at a slight angle, press it flat and fix it with its small screw.",
    wifi: "Plug the card into its M.2 slot, screw it down, then snap the two antenna cables onto its gold connectors.",
    cooler:
      "Clean off the old thermal paste, add fresh paste, tighten the cooler's screws in their numbered order and plug in the fan cable.",
    display:
      "Feed the display and antenna cables through the hinge, screw the hinges down and plug the display cable into the board.",
    keyboard: "Lower the top case over the parts, check that no cables are trapped, then clip and screw it into place.",
  },

  rules: [
    {
      part: "cpu",
      after: ["mb"],
      reason: "In a laptop the processor is soldered onto the motherboard, so the board has to be in first.",
    },
    {
      part: "ram",
      after: ["mb"],
      reason: "The memory plugs into a slot on the motherboard, so the board has to be in first.",
    },
    {
      part: "ssd",
      after: ["mb"],
      reason: "The SSD plugs into an M.2 slot on the motherboard, so the board has to be in first.",
    },
    {
      part: "wifi",
      after: ["mb"],
      reason: "The Wi-Fi card plugs into an M.2 slot on the motherboard, so the board has to be in first.",
    },
    {
      part: "cooler",
      after: ["cpu"],
      reason: "The cooler's copper plate presses onto the processor, so the CPU has to be there first.",
    },
    {
      part: "display",
      after: ["mb"],
      reason: "The screen's cable plugs into the motherboard, so the board has to be in first.",
    },
    {
      part: "keyboard",
      after: ["battery", "mb", "cpu", "ram", "ssd", "wifi", "cooler"],
      reason:
        "The top case closes over the battery and the board, so everything inside goes in first. (Many real laptops are built upside down: the parts go into the top case and the bottom case closes it.)",
    },
  ],
};
