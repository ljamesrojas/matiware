import { useEffect, useRef, useState } from "react";
import styles from "./HoverTooltip.module.css";
import { getDevice, getPart } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

/** Small name tooltip that follows the mouse while it is over a part on the 3D canvas. */
export function HoverTooltip() {
  const ref = useRef<HTMLDivElement>(null);
  const [overCanvas, setOverCanvas] = useState(false);
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const part = getPart(device, useExplorerStore((s) => s.hoveredPartId));

  useEffect(() => {
    const stage = ref.current?.parentElement;
    if (!stage) return;
    const onMove = (e: PointerEvent) => {
      const onCanvas = e.pointerType === "mouse" && (e.target as HTMLElement).tagName === "CANVAS";
      setOverCanvas(onCanvas);
      if (!onCanvas || !ref.current) return;
      const r = stage.getBoundingClientRect();
      ref.current.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 16}px)`;
    };
    const onLeave = () => setOverCanvas(false);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.tooltip} data-visible={(overCanvas && !!part) || undefined} aria-hidden="true">
      {part?.name}
    </div>
  );
}
