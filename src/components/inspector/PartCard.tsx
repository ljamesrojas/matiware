import type { Ref } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./PartCard.module.css";
import { CategoryDot } from "../common/CategoryDot";
import { ConnectsTo } from "./ConnectsTo";
import { SpecRows } from "./SpecRows";
import { categories } from "../../data/categories";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { Device, Part } from "../../types";

interface Props {
  device: Device;
  part: Part;
  /** Marks where the "more" section (specs, failure, nav) starts, for the mobile sheet. */
  moreRef?: Ref<HTMLDivElement>;
}

export function PartCard({ device, part, moreRef }: Props) {
  const level = useExplorerStore((s) => s.level);
  const select = useExplorerStore((s) => s.select);

  const index = device.parts.findIndex((p) => p.id === part.id);
  const n = device.parts.length;
  const prev = device.parts[(index - 1 + n) % n];
  const next = device.parts[(index + 1) % n];

  return (
    <article className={styles.card} aria-labelledby={`part-title-${part.id}`}>
      <div className={styles.topRow}>
        <span className={styles.code}>{part.code}</span>
        <span className={styles.category}>
          <CategoryDot category={part.category} />
          {categories[part.category].name}
        </span>
        <button
          type="button"
          className={styles.close}
          onClick={() => select(null)}
          aria-label="Close part card"
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <h2 className={styles.name} id={`part-title-${part.id}`}>
        {part.name}
      </h2>
      <p className={styles.fullName}>{part.fullName}</p>

      <hr className={styles.divider} data-peek-end />

      <section className={styles.section}>
        <h3 className={styles.heading}>Definition</h3>
        <p className={styles.body}>{part.definition[level]}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Main function</h3>
        <p className={styles.body}>{part.function[level]}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Connects to</h3>
        <ConnectsTo device={device} ids={part.connectsTo} />
      </section>

      <div ref={moreRef} className={styles.more}>
        <section className={styles.section}>
          <h3 className={styles.heading}>Specs to know</h3>
          <SpecRows specs={part.specs} />
        </section>

        <section className={styles.failure}>
          <h3 className={styles.failureHeading}>
            <span className={styles.warnDot} aria-hidden="true" />
            Signs of failure
          </h3>
          <p>{part.failureSigns}</p>
        </section>

        <nav className={styles.footer} aria-label="Part navigation">
          <button type="button" className={styles.ghost} onClick={() => select(prev.id)}>
            <ChevronLeft size={16} strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">Previous part: </span>
            <span className={styles.ghostLabel}>{prev.name}</span>
          </button>
          <button type="button" className={`${styles.ghost} ${styles.ghostNext}`} onClick={() => select(next.id)}>
            <span className="sr-only">Next part: </span>
            <span className={styles.ghostLabel}>{next.name}</span>
            <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </article>
  );
}
