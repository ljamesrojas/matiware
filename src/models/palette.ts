/** Scene materials from plan section 9: matte, slightly desaturated real-world colors (shared by all devices). */
export const C = {
  panelLight: "#F7F7F4",
  panel: "#E9EAE6",
  panelDark: "#DEE0DB",
  pcb: "#4E7A6A",
  slot: "#2F4F45",
  dark: "#363B40",
  darker: "#2A2E33",
  metal: "#C9CDD0",
  platter: "#B7BCC0",
  edge: "#8C8F8A",
  // Laptop and phone
  copper: "#B98A6E",
  screen: "#2F3A40",
  screenUi: "#46555D",
  gold: "#B9A46A",
  glass: "#DADDD8",
} as const;

/** Brushed metal: low metalness so it reads well without an environment map. */
export const METAL = { color: C.metal, roughness: 0.45, metalness: 0.25 } as const;
