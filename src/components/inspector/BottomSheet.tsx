import { useCallback, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./BottomSheet.module.css";
import { PartCard } from "./PartCard";
import { DeviceOverview } from "./DeviceOverview";
import { FlowCard, flowAnnouncement } from "./FlowCard";
import { useFlowStep } from "../../hooks/useFlowStep";
import { getDevice, getPart } from "../../data/devices";
import { useExplorerStore, type SheetState } from "../../store/useExplorerStore";

const GRABBER_H = 22;
const HINT_H = 48;
const PILL_SPACE = 64; // room for the compact explode pill above the sheet
const DRAG_THRESHOLD = 8;
const SWIPE_DISTANCE = 48;

const order: SheetState[] = ["peek", "half", "full"];

/** Mobile inspector: a bottom sheet with peek, half and full heights. */
export function BottomSheet() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const part = getPart(device, useExplorerStore((s) => s.selectedPartId));
  const sheetState = useExplorerStore((s) => s.sheetState);
  const setSheetState = useExplorerStore((s) => s.setSheetState);
  const setInsets = useExplorerStore((s) => s.setInsets);
  const flowStep = useFlowStep();
  const contentKey = flowStep ? `flow-${flowStep.flow.id}-${flowStep.index}` : (part?.id ?? "overview");

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState({ peek: 120, half: 320, full: 560 });
  const [dragDy, setDragDy] = useState<number | null>(null);
  const drag = useRef<{ y: number; id: number; active: boolean; fromContent: boolean } | null>(null);

  // Measure the three heights from the content itself.
  const measure = useCallback(() => {
    const sheet = sheetRef.current;
    const content = contentRef.current;
    const more = moreRef.current;
    if (!sheet || !content || !more) return;
    // offsetTop is relative to the sheet (the nearest positioned ancestor) and ignores scrolling.
    const stageH = sheet.parentElement!.clientHeight;
    const peekEnd = content.querySelector<HTMLElement>("[data-peek-end]");
    const peek = (peekEnd ? peekEnd.offsetTop : GRABBER_H + 80) + HINT_H;
    const half = more.offsetTop + HINT_H;
    const full = stageH - 12;
    setHeights({
      peek: Math.round(Math.min(peek, stageH * 0.3)),
      half: Math.round(Math.min(half, stageH * 0.64)),
      full: Math.round(full),
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    if (sheetRef.current?.parentElement) ro.observe(sheetRef.current.parentElement);
    return () => ro.disconnect();
  }, [measure, contentKey]);

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [part?.id, flowStep?.flow.id]);

  const baseHeight = heights[sheetState];
  const height =
    dragDy === null ? baseHeight : Math.max(heights.peek * 0.8, Math.min(heights.full, baseHeight - dragDy));

  // Share the sheet height with the explode pill and the camera.
  useLayoutEffect(() => {
    const stage = sheetRef.current?.parentElement;
    stage?.style.setProperty("--sheet-h", `${height}px`);
    if (dragDy === null) setInsets({ right: 0, bottom: baseHeight + PILL_SPACE });
  }, [height, baseHeight, dragDy, setInsets]);

  const step = (dir: 1 | -1) => {
    const i = order.indexOf(sheetState);
    setSheetState(order[Math.max(0, Math.min(order.length - 1, i + dir))]);
  };

  // While a sheet drag is active, stop the browser from scrolling the content.
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const onTouchMove = (e: TouchEvent) => {
      if (drag.current?.active) e.preventDefault();
    };
    sheet.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => sheet.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Swipe anywhere on the sheet. When fully open, the content scrolls normally; pulling
  // down while it is scrolled to the top (or dragging the grabber) collapses the sheet.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const inHandle = !!(e.target as HTMLElement).closest("[data-sheet-handle]");
    const fromContent = sheetState === "full" && !inHandle;
    if (fromContent && (contentRef.current?.scrollTop ?? 0) > 0) return;
    drag.current = { y: e.clientY, id: e.pointerId, active: false, fromContent };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y;
    if (!d.active && d.fromContent && dy < 0) {
      drag.current = null; // scrolling up inside the content, not a sheet drag
      return;
    }
    if (!d.active && Math.abs(dy) > DRAG_THRESHOLD) {
      d.active = true;
      sheetRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.active) setDragDy(dy);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    sheetRef.current?.releasePointerCapture(e.pointerId);
    const dy = e.clientY - d.y;
    setDragDy(null);
    if (dy < -SWIPE_DISTANCE) step(1);
    else if (dy > SWIPE_DISTANCE) step(-1);
  };

  const hintText = flowStep
    ? "Swipe up for all steps"
    : part
      ? "Swipe up for specs and signs of failure"
      : "Swipe up for parts by category";

  return (
    <section
      ref={sheetRef}
      className={styles.sheet}
      data-state={sheetState}
      data-dragging={dragDy !== null || undefined}
      style={{ height }}
      aria-label="Inspector"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className={styles.handle} data-sheet-handle>
        <button
          type="button"
          className={styles.grabber}
          aria-label={sheetState === "full" ? "Collapse details" : "Expand details"}
          aria-expanded={sheetState === "full"}
          onClick={() => setSheetState(sheetState === "full" ? "half" : sheetState === "peek" ? "half" : "full")}
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div ref={contentRef} className={styles.content}>
        <div key={contentKey} className={styles.swap}>
          {flowStep ? (
            <FlowCard device={device} active={flowStep} moreRef={moreRef} />
          ) : part ? (
            <PartCard device={device} part={part} moreRef={moreRef} />
          ) : (
            <DeviceOverview device={device} moreRef={moreRef} />
          )}
        </div>
      </div>

      {sheetState !== "full" && (
        <button type="button" className={styles.hint} onClick={() => setSheetState("full")}>
          <ChevronUp size={16} strokeWidth={1.8} aria-hidden="true" />
          {hintText}
        </button>
      )}

      <div className="sr-only" aria-live="polite">
        {flowStep ? flowAnnouncement(flowStep) : part ? `${part.name} selected` : ""}
      </div>
    </section>
  );
}
