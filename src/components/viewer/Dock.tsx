import type { CSSProperties } from "react";
import { Expand, Focus, Minus, Plus, RotateCcw, Shrink, Tag } from "lucide-react";
import styles from "./Dock.module.css";
import { useExplorerStore } from "../../store/useExplorerStore";

const ICON = { size: 17, strokeWidth: 1.8, "aria-hidden": true } as const;

function ExplodeSlider() {
  const explode = useExplorerStore((s) => s.explode);
  const setExplode = useExplorerStore((s) => s.setExplode);
  const pct = Math.round(explode * 100);

  return (
    <label className={styles.slider}>
      <span className="mono-label">Explode</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={(e) => setExplode(Number(e.target.value) / 100)}
        aria-label="Explode"
        aria-valuetext={`${pct}%`}
        style={{ "--fill": `${pct}%` } as CSSProperties}
      />
      <span className={styles.value}>{pct}%</span>
    </label>
  );
}

/** Floating dock: explode controls, Labels / Isolate toggles, zoom and reset. */
export function Dock({ compact = false }: { compact?: boolean }) {
  const animateExplode = useExplorerStore((s) => s.animateExplode);
  const showLabels = useExplorerStore((s) => s.showLabels);
  const isolate = useExplorerStore((s) => s.isolate);
  const toggleLabels = useExplorerStore((s) => s.toggleLabels);
  const toggleIsolate = useExplorerStore((s) => s.toggleIsolate);
  const zoomBy = useExplorerStore((s) => s.zoomBy);
  const resetView = useExplorerStore((s) => s.resetView);

  if (compact) {
    return (
      <div className={`${styles.dock} ${styles.compact}`} role="toolbar" aria-label="View controls">
        <ExplodeSlider />
        <span className={styles.sep} aria-hidden="true" />
        <button
          type="button"
          className={styles.iconBtn}
          aria-pressed={showLabels}
          aria-label="Labels"
          onClick={toggleLabels}
        >
          <Tag {...ICON} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-pressed={isolate}
          aria-label="Isolate"
          onClick={toggleIsolate}
        >
          <Focus {...ICON} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dock} role="toolbar" aria-label="View controls">
      <button type="button" className={styles.btn} onClick={() => animateExplode(0)}>
        <Shrink {...ICON} />
        <span className={styles.text}>Assemble</span>
      </button>
      <ExplodeSlider />
      <button type="button" className={styles.btn} onClick={() => animateExplode(1)}>
        <Expand {...ICON} />
        <span className={styles.text}>Expand</span>
      </button>

      <span className={styles.sep} aria-hidden="true" />

      <button type="button" className={styles.btn} aria-pressed={showLabels} onClick={toggleLabels}>
        <Tag {...ICON} />
        <span className={styles.text}>Labels</span>
      </button>
      <button
        type="button"
        className={styles.btn}
        aria-pressed={isolate}
        onClick={toggleIsolate}
        title="Show only the selected part and its connections"
      >
        <Focus {...ICON} />
        <span className={styles.text}>Isolate</span>
      </button>

      <span className={styles.sep} aria-hidden="true" />

      <button type="button" className={styles.iconBtn} aria-label="Zoom out" onClick={() => zoomBy(-1)}>
        <Minus {...ICON} />
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Zoom in" onClick={() => zoomBy(1)}>
        <Plus {...ICON} />
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Reset view" onClick={resetView}>
        <RotateCcw {...ICON} />
      </button>
    </div>
  );
}
