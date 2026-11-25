import type { TroubleshootScenario } from "../../types";

/** Troubleshooting scenarios for the Desktop PC. */
export const desktopPcScenarios: TroubleshootScenario[] = [
  {
    id: "no-display",
    title: "Powers on, but no picture",
    symptom: "The fans spin and the lights come on, but the monitor just says \"No signal\".",
    clues: [
      "Fans and lights turn on, so the PC is getting power.",
      "The monitor and its cable work on another computer.",
      "The PC was carried to a new desk yesterday.",
    ],
    culprit: "gpu",
    cause: "Moving the PC knocked the graphics card partly out of its slot, so no picture reached the monitor.",
    fix: "Push the card back into the PCIe slot until the latch clicks, screw the bracket in and reconnect its 8-pin power cable.",
    checks: {
      gpu: {
        relevance: "likely",
        finding: "The graphics card has tipped out of its slot at one end, and its power cable is loose.",
      },
      ram: { relevance: "likely", finding: "Both RAM sticks are clicked firmly into their slots." },
      cpu: { relevance: "possible", finding: "The CPU sits flat in its socket and the cooler is mounted properly." },
      mb: { relevance: "possible", finding: "No damage on the board, and its power connectors are plugged in." },
      psu: { relevance: "possible", finding: "The power supply turns on and powers the fans and lights." },
    },
  },
  {
    id: "shutdown-gaming",
    title: "Switches off during games",
    symptom: "Browsing and schoolwork are fine, but a few minutes into a game the PC suddenly turns off.",
    clues: [
      "It only happens under heavy load.",
      "The top of the case feels hot.",
      "Nothing in the PC has changed for two years.",
    ],
    culprit: "cooler",
    cause: "Dust blocked the CPU cooler, so the CPU overheated and the PC shut down to protect itself.",
    fix: "Clean the fins with compressed air, check the fan is plugged into CPU_FAN, and replace the thermal paste if it is old.",
    checks: {
      cooler: {
        relevance: "likely",
        finding: "The cooler's fins are packed with dust and its fan barely spins.",
      },
      cpu: {
        relevance: "likely",
        finding: "The CPU hits its temperature limit within minutes of starting a game. Something isn't taking its heat away.",
      },
      psu: {
        relevance: "likely",
        finding: "The 650 W power supply is enough for this PC, and its fan spins normally.",
      },
      fans: { relevance: "possible", finding: "Both case fans spin and move air through the case." },
      gpu: { relevance: "possible", finding: "The graphics card's fans speed up in games and it stays at a safe temperature." },
    },
  },
  {
    id: "clicking-drive",
    title: "Clicking noise, slow files",
    symptom: "Photos and videos on the second drive take ages to open, and there is a clicking sound from the front of the case.",
    clues: [
      "Apps and Windows on the main drive open quickly.",
      "Only files on the D: drive are slow.",
      "The clicking gets louder when you open those files.",
    ],
    culprit: "hdd",
    cause: "The hard drive is failing: its read/write head is struggling to read the spinning platters.",
    fix: "Copy the important files off straight away, then replace the drive. An SSD would be faster and has no moving parts.",
    checks: {
      hdd: {
        relevance: "likely",
        finding: "The hard drive clicks again and again, and its health check (SMART) reports bad sectors. It is failing.",
      },
      ssd: { relevance: "possible", finding: "The SSD is healthy and fast. The slow files aren't stored on it." },
      ram: { relevance: "possible", finding: "A memory test finishes with no errors." },
      fans: { relevance: "possible", finding: "The case fans spin quietly. The clicking isn't coming from them." },
    },
  },
];
