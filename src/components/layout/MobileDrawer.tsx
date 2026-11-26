import { useEffect, useRef } from "react";
import { Cpu, GraduationCap, X } from "lucide-react";
import styles from "./MobileDrawer.module.css";
import { SidebarContent } from "./Sidebar";
import { LevelToggle } from "./LevelToggle";
import { useExplorerStore } from "../../store/useExplorerStore";
import { homeHref } from "../../router";

export function MobileDrawer() {
  const open = useExplorerStore((s) => s.drawerOpen);
  const setOpen = useExplorerStore((s) => s.setDrawerOpen);
  const openQuiz = useExplorerStore((s) => s.openQuiz);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Move focus in on open, back to the menu button on close.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      document.querySelector<HTMLButtonElement>('[aria-controls="mobile-drawer"]')?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Keep Tab inside the drawer while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([aria-disabled='true']), input");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.root} data-open={open || undefined} aria-hidden={!open}>
      <div className={styles.scrim} onClick={() => setOpen(false)} />
      <div
        id="mobile-drawer"
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Parts list"
      >
        <div className={styles.head}>
          {/* On phones the header has no logo, so the way back to the landing page is here. */}
          <a href={homeHref} className={styles.home} aria-label="Matware home" onClick={() => setOpen(false)}>
            <span className={styles.logo} aria-hidden="true">
              <Cpu size={16} strokeWidth={1.8} />
            </span>
            <span className={styles.wordmark}>Matware</span>
          </a>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close parts list"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>
        <div className={styles.level}>
          <LevelToggle showLabel={false} />
          <button type="button" className={styles.quiz} onClick={openQuiz}>
            <GraduationCap size={17} strokeWidth={1.8} aria-hidden="true" />
            Test yourself
          </button>
        </div>
        <SidebarContent />
      </div>
    </div>
  );
}
