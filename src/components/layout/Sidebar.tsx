import styles from "./Sidebar.module.css";
import { DeviceTiles } from "./DeviceTiles";
import { PartsList } from "./PartsList";
import { Legend } from "./Legend";
import { deviceSubtitle, getDevice } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

/** Sidebar body, shared by the desktop sidebar and the mobile drawer. */
export function SidebarContent() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <DeviceTiles />
        <div className={styles.device}>
          <h1 className={styles.title}>{device.name}</h1>
          <p className={`${styles.subtitle} mono-label`}>{deviceSubtitle(device)}</p>
          <p className={styles.intro}>{device.intro}</p>
        </div>
      </div>
      <div className={styles.partsHead}>
        <h2 className="mono-label">Parts</h2>
        <span className="mono-label">{device.parts.length}</span>
      </div>
      <div className={styles.scroll}>
        <PartsList />
      </div>
      <Legend />
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Device and parts">
      <SidebarContent />
    </aside>
  );
}
