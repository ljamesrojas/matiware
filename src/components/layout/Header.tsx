import { Cpu, Menu, RotateCcw } from "lucide-react";
import styles from "./Header.module.css";
import { LevelToggle } from "./LevelToggle";
import { useExplorerStore } from "../../store/useExplorerStore";
import { deviceSubtitle, getDevice } from "../../data/devices";

export function Header() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const drawerOpen = useExplorerStore((s) => s.drawerOpen);
  const setDrawerOpen = useExplorerStore((s) => s.setDrawerOpen);
  const resetView = useExplorerStore((s) => s.resetView);

  return (
    <header className={styles.header}>
      {/* Desktop */}
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">
          <Cpu size={18} strokeWidth={1.8} />
        </span>
        <span className={styles.wordmark}>Hardware Explorer</span>
        <span className={styles.sep} aria-hidden="true" />
        <nav aria-label="Breadcrumb" className={`${styles.crumbs} mono-label`}>
          <span>Devices</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className={styles.crumbCurrent}>
            {device.name}
          </span>
        </nav>
      </div>
      <div className={styles.right}>
        <LevelToggle />
      </div>

      {/* Mobile */}
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Open parts list"
        aria-expanded={drawerOpen}
        aria-controls="mobile-drawer"
        onClick={() => setDrawerOpen(true)}
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>
      <div className={styles.mobileTitle}>
        <span className={styles.mobileName}>{device.name}</span>
        <span className="mono-label">{deviceSubtitle(device)}</span>
      </div>
      <button type="button" className={styles.iconBtn} aria-label="Reset view" onClick={resetView}>
        <RotateCcw size={18} strokeWidth={1.8} />
      </button>
    </header>
  );
}
