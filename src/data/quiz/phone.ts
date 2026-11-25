import type { QuizContent } from "../../types";

/**
 * Build-it quiz content for the Smartphone.
 * The frame starts in place, so Assemble mode covers the other ten parts.
 */
export const phoneQuiz: QuizContent = {
  optionsPerQuestion: 4,

  installTips: {
    display:
      "Lay the screen into the front of the frame, connect its flex cable and press it down evenly so the adhesive seals.",
    cooling: "Lay the vapor chamber flat in the frame. It has to touch the SoC area through thermal paste or a pad.",
    battery:
      "Stick the battery down with its stretch-release adhesive strips and connect it last. Never bend or puncture a lithium battery.",
    mb: "Fit the logic board into the frame, screw it down and connect the flex cables for the screen and cameras.",
    soc: "The SoC is soldered to the logic board at the factory, so it comes already fitted to a new board.",
    ram: "Phone RAM is stacked and soldered on top of the SoC (package on package), so it is fitted at the factory too.",
    storage: "The storage chip is soldered to the board, so storage can't be upgraded later. Choose the size when you buy the phone.",
    port: "Fit the USB-C board at the bottom, screw it in and connect its flex cable to the logic board.",
    camera: "Seat the camera module in its bracket, connect its flex cable and keep fingerprints off the lenses.",
    back: "Clean the edge of the frame, apply new adhesive and press the back glass on firmly to restore the water seal.",
  },

  rules: [
    {
      part: "mb",
      after: ["cooling"],
      reason: "The vapor chamber sits under the logic board, pressed against the hot chips, so it goes in first.",
    },
    {
      part: "soc",
      after: ["mb"],
      reason: "The SoC is soldered onto the logic board, so the board has to be in first.",
    },
    {
      part: "ram",
      after: ["soc"],
      reason: "The RAM is stacked on top of the SoC (package on package), so the SoC has to be there first.",
    },
    {
      part: "storage",
      after: ["mb"],
      reason: "The storage chip is soldered onto the logic board, so the board has to be in first.",
    },
    {
      part: "camera",
      after: ["mb"],
      reason: "The camera's flex cable plugs into the logic board, so the board goes in first.",
    },
    {
      part: "back",
      after: ["cooling", "battery", "mb", "soc", "ram", "storage", "port", "camera"],
      reason: "The back glass seals the phone, so everything inside has to be in place first.",
    },
  ],
};
