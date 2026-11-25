import { Columns3, Laptop, Monitor, Smartphone, type LucideIcon } from "lucide-react";
import styles from "./DeviceTiles.module.css";
import { deviceTiles } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { DeviceIcon } from "../../types";

const icons: Record<DeviceIcon, LucideIcon> = {
  desktop: Monitor,
  laptop: Laptop,
  phone: Smartphone,
};

export function DeviceTiles() {
  const deviceId = useExplorerStore((s) => s.deviceId);
  const setDevice = useExplorerStore((s) => s.setDevice);
  const comparing = useExplorerStore((s) => s.compare.active);
  const openCompare = useExplorerStore((s) => s.openCompare);
  const exitCompare = useExplorerStore((s) => s.exitCompare);

  const pick = (id: string) => {
    // Clicking the current device while comparing goes back to that device.
    if (comparing && id === deviceId) exitCompare();
    else setDevice(id);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} role="group" aria-label="Devices">
        {deviceTiles.map((tile) => {
          const Icon = icons[tile.icon];
          const selected = tile.id === deviceId && !comparing;
          return (
            <button
              key={tile.id}
              type="button"
              className={styles.tile}
              data-selected={selected || undefined}
              data-soon={!tile.available || undefined}
              aria-pressed={selected}
              aria-disabled={!tile.available}
              aria-label={tile.available ? tile.name : `${tile.name}, coming soon`}
              onClick={() => tile.available && pick(tile.id)}
            >
              <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              <span className={styles.name}>{tile.name}</span>
              {!tile.available && <span className={styles.soon}>Soon</span>}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={styles.compare}
        aria-pressed={comparing}
        onClick={() => (comparing ? exitCompare() : openCompare())}
      >
        <Columns3 size={16} strokeWidth={1.8} aria-hidden="true" />
        Compare devices
      </button>
    </div>
  );
}
