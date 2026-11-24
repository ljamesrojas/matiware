import { useLayoutEffect, useRef } from "react";
import styles from "./Inspector.module.css";
import { PartCard } from "./PartCard";
import { DeviceOverview } from "./DeviceOverview";
import { getDevice, getPart } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

/** Floating inspector card on the right side of the stage (desktop). */
export function Inspector() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const part = getPart(device, useExplorerStore((s) => s.selectedPartId));
  const setInsets = useExplorerStore((s) => s.setInsets);
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

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [part?.id]);

  return (
    <aside className={styles.inspector} ref={ref} aria-label="Inspector">
      <div className={styles.scroll} ref={scrollRef}>
        <div key={part?.id ?? "overview"} className={styles.swap}>
          {part ? <PartCard device={device} part={part} /> : <DeviceOverview device={device} />}
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {part ? `${part.name} selected` : ""}
      </div>
    </aside>
  );
}
