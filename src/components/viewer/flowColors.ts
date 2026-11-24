import { categories } from "../../data/categories";
import type { FlowKind } from "../../types";

/** Particle color per flow: accent green for data, the power category color for power. */
export const FLOW_COLORS: Record<FlowKind, string> = {
  data: "#2F6B57",
  power: categories.power.color,
};
