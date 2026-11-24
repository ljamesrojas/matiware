import { categories } from "../../data/categories";
import type { Category } from "../../types";

interface Props {
  category: Category;
  size?: number;
}

export function CategoryDot({ category, size = 8 }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        flex: "none",
        width: size,
        height: size,
        borderRadius: "50%",
        background: categories[category].color,
      }}
    />
  );
}
