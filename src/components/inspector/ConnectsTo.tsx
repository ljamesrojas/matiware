import styles from "./PartCard.module.css";
import { CategoryDot } from "../common/CategoryDot";
import { getPart } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { Device } from "../../types";

export function ConnectsTo({ device, ids }: { device: Device; ids: string[] }) {
  const select = useExplorerStore((s) => s.select);

  return (
    <ul className={styles.chips}>
      {ids.map((id) => {
        const part = getPart(device, id);
        if (!part) return null;
        return (
          <li key={id}>
            <button
              type="button"
              className={`${styles.chip} hit`}
              onClick={() => select(id)}
              aria-label={`Go to ${part.name}`}
            >
              <CategoryDot category={part.category} size={7} />
              {part.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
