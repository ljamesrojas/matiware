import { useLayoutEffect, useRef } from "react";
import styles from "./Inspector.module.css";
import { useInspectorContent } from "./useInspectorContent";
import { useExplorerStore } from "../../store/useExplorerStore";

/** Floating inspector card on the right side of the stage (desktop). */
export function Inspector() {
  const setInsets = useExplorerStore((s) => s.setInsets);
  const { mode, swapKey, announcement, render, flowStep } = useInspectorContent();
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tell the camera how much of the stage the card covers.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const stage = el.parentElement!.getBoundingClientRect();
      const card = el.getBoundingClientRect();
      setInsets({ right: stage.right - card.left, bottom: 72 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    ro.observe(el.parentElement!);
    return () => ro.disconnect();
  }, [setInsets]);

  // Back to the top for new content (but not for each step of the same flow).
  const scrollKey = mode === "flow" ? `flow-${flowStep?.flow.id}` : swapKey;
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  return (
    <aside className={styles.inspector} ref={ref} aria-label="Inspector">
      <div className={styles.scroll} ref={scrollRef}>
        <div key={swapKey} className={styles.swap}>
          {render()}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </aside>
  );
}
