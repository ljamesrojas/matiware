import type { Ref } from "react";
import { X } from "lucide-react";
import card from "./PartCard.module.css";
import styles from "./CompareCard.module.css";
import { compareTopics, getCompareTopic } from "../../data/compare";
import { deviceTiles, getDevice } from "../../data/devices";
import { useExplorerStore } from "../../store/useExplorerStore";

/** Inspector content in Compare mode. */
export function CompareCard({ moreRef }: { moreRef?: Ref<HTMLDivElement> }) {
  const level = useExplorerStore((s) => s.level);
  const compare = useExplorerStore((s) => s.compare);
  const setTopic = useExplorerStore((s) => s.setCompareTopic);
  const setTrueScale = useExplorerStore((s) => s.setTrueScale);
  const exitCompare = useExplorerStore((s) => s.exitCompare);
  const openPartIn = useExplorerStore((s) => s.openPartIn);

  const topic = getCompareTopic(compare.topic);
  const columns = deviceTiles.filter((t) => topic.parts[t.id]);

  return (
    <article className={card.card} aria-labelledby="compare-title">
      <div className={card.topRow}>
        <span className={card.code}>Compare</span>
        <span className={card.category}>Across devices</span>
        <button type="button" className={card.close} onClick={exitCompare} aria-label="Exit compare mode">
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <h2 className={card.name} id="compare-title">
        {topic.title}
      </h2>
      <p className={card.fullName}>{topic.question}</p>

      <div className={styles.topics} role="group" aria-label="Part to compare">
        {compareTopics.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.topic} hit`}
            aria-pressed={t.id === topic.id}
            onClick={() => setTopic(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <hr className={card.divider} data-peek-end />

      <div className={styles.scaleRow}>
        <span className={card.heading} style={{ margin: 0 }}>
          On the model
        </span>
        <div className={styles.segmented} role="group" aria-label="Model size">
          <button
            type="button"
            className={`${styles.option} hit`}
            aria-pressed={!compare.trueScale}
            onClick={() => setTrueScale(false)}
          >
            Same size
          </button>
          <button
            type="button"
            className={`${styles.option} hit`}
            aria-pressed={compare.trueScale}
            onClick={() => setTrueScale(true)}
          >
            True scale
          </button>
        </div>
      </div>
      <p className={styles.scaleNote}>
        {compare.trueScale
          ? "Shown at their real sizes compared with each other."
          : "Enlarged to the same size so you can see the details."}
      </p>

      <table className={styles.table}>
        <caption className="sr-only">{topic.title}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Detail</span>
            </th>
            {columns.map((c) => {
              const part = getDevice(c.id).parts.find((p) => p.id === topic.parts[c.id]);
              return (
                <th key={c.id} scope="col">
                  <button
                    type="button"
                    className={styles.colHead}
                    onClick={() => openPartIn(c.id, topic.parts[c.id])}
                    aria-label={`Open the ${getDevice(c.id).name.toLowerCase()}'s ${part?.name ?? "part"}`}
                  >
                    {c.name}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {topic.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {columns.map((c) => (
                <td key={c.id}>{row.values[c.id] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <section className={card.failure} style={{ background: "var(--accent-tint)" }}>
        <h3 className={card.failureHeading} style={{ color: "var(--accent-ink)" }}>
          <span className={card.warnDot} style={{ background: "var(--accent)" }} aria-hidden="true" />
          What to notice
        </h3>
        <p>{topic.takeaway[level]}</p>
      </section>

      <div ref={moreRef} />
    </article>
  );
}
