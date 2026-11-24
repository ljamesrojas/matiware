import { useRef, type KeyboardEvent } from "react";
import styles from "./PartsList.module.css";
import { CategoryDot } from "../common/CategoryDot";
import { categories } from "../../data/categories";
import { getDevice } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

export function PartsList() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const selectedId = useExplorerStore((s) => s.selectedPartId);
  const hoveredId = useExplorerStore((s) => s.hoveredPartId);
  const select = useExplorerStore((s) => s.select);
  const hover = useExplorerStore((s) => s.hover);
  const listRef = useRef<HTMLOListElement>(null);

  // Arrow keys move focus between rows; Enter / Space select (native button behavior).
  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const buttons = Array.from(listRef.current?.querySelectorAll("button") ?? []);
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next = i;
    if (e.key === "ArrowDown") next = Math.min(buttons.length - 1, i + 1);
    if (e.key === "ArrowUp") next = Math.max(0, i - 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = buttons.length - 1;
    if (next !== i && buttons[next]) {
      e.preventDefault();
      buttons[next].focus();
    }
  };

  return (
    <ol className={styles.list} ref={listRef} onKeyDown={onKeyDown} aria-label="Parts">
      {device.parts.map((part, index) => {
        const selected = part.id === selectedId;
        return (
          <li key={part.id}>
            <button
              type="button"
              className={styles.row}
              data-selected={selected || undefined}
              data-hovered={(!selected && part.id === hoveredId) || undefined}
              aria-current={selected ? "true" : undefined}
              onClick={() => select(part.id)}
              onPointerEnter={(e) => e.pointerType === "mouse" && hover(part.id)}
              onPointerLeave={() => hover(null)}
            >
              <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{part.name}</span>
              <CategoryDot category={part.category} />
              <span className="sr-only">, {categories[part.category].name}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
