import { Laptop, Monitor, Smartphone, type LucideIcon } from "lucide-react";
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

  return (
    <div className={styles.grid} role="group" aria-label="Devices">
      {deviceTiles.map((tile) => {
        const Icon = icons[tile.icon];
        const selected = tile.id === deviceId;
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
            onClick={(e) => {
              if (!tile.available) e.preventDefault();
            }}
          >
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className={styles.name}>{tile.name}</span>
            {!tile.available && <span className={styles.soon}>Soon</span>}
          </button>
        );
      })}
    </div>
  );
}
