import type { QuizContent } from "../../types";

/**
 * Build-it quiz content for the Desktop PC.
 * The case and motherboard start in place (they do not move in the exploded view),
 * so Assemble mode covers the other eight parts.
 */
export const desktopPcQuiz: QuizContent = {
  optionsPerQuestion: 4,

  installTips: {
    cpu: "Line up the small triangle on the CPU with the one on the socket and lower it straight in. Never press on the contacts.",
    ram: "Open the latches, line up the notch on the stick with the key in the slot, then press both ends down until the latches click.",
    ssd: "Slide the stick into the M.2 slot at a slight angle, press it flat and hold it down with its screw or latch.",
    cooler:
      "Put a pea-sized dot of thermal paste on the CPU (unless the cooler has it already), mount the cooler evenly and plug its fan into the CPU_FAN header.",
    gpu: "Remove the rear slot covers, push the card into the top PCIe x16 slot until it clicks, screw in the bracket and connect its power cable.",
    psu: "Mount the power supply at the bottom rear with its fan facing a vent, then run its cables to the board, CPU, graphics card and drives.",
    hdd: "Slide the drive into the drive cage and secure it, then connect a SATA data cable to the motherboard and a SATA power cable from the PSU.",
    fans: "Mount the fans on the front panel so they pull air in. An arrow on the fan frame shows which way the air flows.",
  },

  rules: [
    {
      part: "cooler",
      after: ["cpu", "ram"],
      reason:
        "The cooler sits on top of the CPU, and a big tower cooler can hang over the memory slots, so the CPU and RAM go in first.",
    },
    {
      part: "gpu",
      after: ["ssd"],
      reason: "On many motherboards the graphics card covers an M.2 slot, so the SSD goes in before the card.",
    },
  ],
};
