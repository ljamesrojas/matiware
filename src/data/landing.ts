/** Copy and links for the landing page. */

export const links = {
  portfolio: "https://ljrojas.vercel.app/",
  github: "https://github.com/ljamesrojas/matiware",
};

export const hero = {
  eyebrow: "Interactive hardware explorer · For IT students",
  title: "See what's inside the devices you use every day.",
  lead: "Pull a computer apart in 3D, click any part, and learn what it is, what it does and how it connects to everything else.",
};

export const steps = [
  {
    title: "Pull it apart",
    text: "Drag the exploded-view slider to separate every part, and rotate the model to see it from any side.",
  },
  {
    title: "Click any part",
    text: "Read its definition and main function, the specs worth knowing and the signs that it's failing.",
  },
  {
    title: "Watch it work",
    text: "Play the data and power flows to see how information and electricity move from part to part.",
  },
  {
    title: "Test yourself",
    text: "Identify parts, rebuild the device and solve troubleshooting cases, or compare parts across devices.",
  },
];

/** Short line for each device card, by device id. */
export const deviceBlurbs: Record<string, string> = {
  "desktop-pc": "CPU, graphics card, RAM, storage, power supply, cooling and more.",
  laptop: "See how the same jobs fit into a thin, portable body.",
  phone: "Discover how almost everything fits onto one chip.",
};

export const developer = {
  initials: "LJ",
  name: "Lawrenze James Rojas",
  role: "BSIT student · Gordon College",
  note: "Hi, I'm LJ, a BSIT student and full-stack web developer from the Philippines. I built Matware because computer hardware makes more sense when you can take it apart and see how each part connects to the rest. I hope it helps fellow IT students learn by exploring, not just memorizing.",
};
