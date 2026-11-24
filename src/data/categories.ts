import type { Category, CategoryInfo } from "../types";

/** Category names and their muted dot colors (Bench theme). */
export const categories: Record<Category, CategoryInfo> = {
  processing: { id: "processing", name: "Processing", color: "#5865A6" },
  memory: { id: "memory", name: "Memory", color: "#7A5BA6" },
  storage: { id: "storage", name: "Storage", color: "#3E8A80" },
  power: { id: "power", name: "Power", color: "#B07A2A" },
  cooling: { id: "cooling", name: "Cooling", color: "#4C86A8" },
  connectivity: { id: "connectivity", name: "Connectivity", color: "#4F8A55" },
  structure: { id: "structure", name: "Structure", color: "#8A8880" },
};

/** Display order for legends and the device overview. */
export const categoryOrder: Category[] = [
  "processing",
  "memory",
  "storage",
  "power",
  "cooling",
  "connectivity",
  "structure",
];
