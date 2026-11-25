import type { Ref } from "react";
import { Hammer, ScanSearch, Wrench } from "lucide-react";
import { useExplorerStore } from "../../store/useExplorerStore";
import styles from "./PartCard.module.css";
import { CategoryDot } from "../common/CategoryDot";
import { categories, categoryOrder } from "../../data/categories";
import { compareTopics } from "../../data/compare";
import type { Device } from "../../types";

interface Props {
  device: Device;
  moreRef?: Ref<HTMLDivElement>;
}

export function DeviceOverview({ device, moreRef }: Props) {
  const startQuiz = useExplorerStore((s) => s.startQuiz);
  const openCompare = useExplorerStore((s) => s.openCompare);
  const topics = compareTopics.filter((t) => t.parts[device.id]);
  const rows = categoryOrder
    .map((c) => ({ id: c, count: device.parts.filter((p) => p.category === c).length }))
    .filter((r) => r.count > 0);

  return (
    <article className={styles.card} aria-labelledby="overview-title">
      <span className="mono-label">Overview</span>
      <h2 className={styles.name} id="overview-title" style={{ marginTop: 10 }}>
        {device.name}
      </h2>
      <p className={styles.body} style={{ marginTop: 8 }} data-peek-end>
        {device.description}
      </p>
      <p className={styles.hint}>
        Select a part from the list, or click it on the model, to see its definition and main function.
      </p>

      <div ref={moreRef} className={styles.more}>
        <hr className={styles.divider} />
        <h3 className={styles.heading}>Parts by category</h3>
        <ul className={styles.catRows}>
          {rows.map((r) => (
            <li key={r.id} className={styles.catRow}>
              <CategoryDot category={r.id} />
              <span className={styles.catName}>{categories[r.id].name}</span>
              <span className={styles.catCount}>
                {r.count} {r.count === 1 ? "part" : "parts"}
              </span>
            </li>
          ))}
        </ul>
        {topics.length > 0 && (
          <section className={styles.section} style={{ marginTop: 22 }}>
            <h3 className={styles.heading}>Compare with other devices</h3>
            <div className={styles.chips}>
              {topics.map((t) => (
                <button key={t.id} type="button" className={`${styles.chip} hit`} onClick={() => openCompare(t.id)}>
                  {t.name}
                </button>
              ))}
            </div>
          </section>
        )}
        {device.quiz && (
          <section className={styles.section} style={{ marginTop: 22 }}>
            <h3 className={styles.heading}>Test yourself</h3>
            <div className={styles.chips}>
              <button type="button" className={`${styles.chip} hit`} onClick={() => startQuiz("identify")}>
                <ScanSearch size={15} strokeWidth={1.8} aria-hidden="true" />
                Identify parts
              </button>
              <button type="button" className={`${styles.chip} hit`} onClick={() => startQuiz("assemble")}>
                <Hammer size={15} strokeWidth={1.8} aria-hidden="true" />
                Assemble it
              </button>
              {!!device.troubleshooting?.length && (
                <button type="button" className={`${styles.chip} hit`} onClick={() => startQuiz("troubleshoot")}>
                  <Wrench size={15} strokeWidth={1.8} aria-hidden="true" />
                  Troubleshoot
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
