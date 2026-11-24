/** Scene materials from plan section 9: matte, slightly desaturated real-world colors. */
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
} as const;

/** Brushed metal: low metalness so it reads well without an environment map. */
export const METAL = { color: C.metal, roughness: 0.45, metalness: 0.25 } as const;
