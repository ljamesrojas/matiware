import styles from "./PartCard.module.css";
import type { Spec } from "../../types";

export function SpecRows({ specs }: { specs: Spec[] }) {
  return (
    <dl className={styles.specs}>
      {specs.map((s) => (
        <div key={s.label} className={styles.specRow}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
