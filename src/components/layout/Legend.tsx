import styles from "./Legend.module.css";
import { CategoryDot } from "../common/CategoryDot";
import { categories, categoryOrder } from "../../data/categories";
import { getDevice } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

export function Legend() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const used = categoryOrder.filter((c) => device.parts.some((p) => p.category === c));

  return (
    <div className={styles.legend}>
      <h3 className={`${styles.title} mono-label`}>Categories</h3>
      <ul className={styles.items}>
        {used.map((c) => (
          <li key={c} className={styles.item}>
            <CategoryDot category={c} />
            {categories[c].name}
          </li>
        ))}
      </ul>
    </div>
  );
}
