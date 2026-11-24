import styles from "./LevelToggle.module.css";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { ReadingLevel } from "../../types";

const options: { id: ReadingLevel; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "advanced", label: "Advanced" },
];

export function LevelToggle({ showLabel = true }: { showLabel?: boolean }) {
  const level = useExplorerStore((s) => s.level);
  const setLevel = useExplorerStore((s) => s.setLevel);

  return (
    <div className={styles.wrap}>
      {showLabel && (
        <span className={styles.label} aria-hidden="true">
          Reading level
        </span>
      )}
      <div className={styles.segmented} role="group" aria-label="Reading level">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`${styles.option} hit`}
            aria-pressed={level === o.id}
            onClick={() => setLevel(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
