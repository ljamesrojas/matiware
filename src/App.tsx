import { useEffect } from "react";
import styles from "./App.module.css";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileDrawer } from "./components/layout/MobileDrawer";
import { Scene } from "./components/viewer/Scene";
import { StagePills } from "./components/viewer/StagePills";
import { Dock } from "./components/viewer/Dock";
import { HoverTooltip } from "./components/viewer/HoverTooltip";
import { FlowTimer } from "./components/viewer/FlowTimer";
import { Inspector } from "./components/inspector/Inspector";
import { BottomSheet } from "./components/inspector/BottomSheet";
import { useIsMobile, usePrefersReducedMotion } from "./hooks/useMediaQuery";
import { useExplorerStore } from "./store/useExplorerStore";

export default function App() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const setReducedMotion = useExplorerStore((s) => s.setReducedMotion);

  useEffect(() => setReducedMotion(reducedMotion), [reducedMotion, setReducedMotion]);

  // Esc closes the drawer first, then the part card, then flow mode or the quiz.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useExplorerStore.getState();
      if (s.drawerOpen) s.setDrawerOpen(false);
      else if (s.selectedPartId) s.select(null);
      else if (s.flow.active) s.stopFlow();
      else if (s.quiz.active) s.exitQuiz();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        {!isMobile && <Sidebar />}
        <main className={styles.stage} aria-label="3D model viewer">
          <Scene />
          <FlowTimer />
          <StagePills />
          <HoverTooltip />
          <Dock compact={isMobile} />
          {isMobile ? <BottomSheet /> : <Inspector />}
        </main>
      </div>
      {isMobile && <MobileDrawer />}
    </div>
  );
}
