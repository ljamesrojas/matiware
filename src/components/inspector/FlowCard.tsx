import type { Ref } from "react";
import { X } from "lucide-react";
import styles from "./PartCard.module.css";
import flowStyles from "./FlowCard.module.css";
import { FLOW_COLORS } from "../viewer/flowColors";
import { useExplorerStore } from "../../store/useExplorerStore";
import type { ActiveFlowStep } from "../../hooks/useFlowStep";
import type { Device } from "../../types";

interface Props {
  device: Device;
  active: ActiveFlowStep;
  moreRef?: Ref<HTMLDivElement>;
}

/** Text for the inspector's live region, so screen readers hear each new step. */
export function flowAnnouncement({ flow, step, index, total }: ActiveFlowStep): string {
  return `${flow.name}, step ${index + 1} of ${total}: ${step.title}. ${step.route}.`;
}

/** Inspector content in flow mode: the current step's caption and a list of all steps. */
export function FlowCard({ device, active, moreRef }: Props) {
  const level = useExplorerStore((s) => s.level);
  const stopFlow = useExplorerStore((s) => s.stopFlow);
  const setFlowKind = useExplorerStore((s) => s.setFlowKind);
  const setFlowStep = useExplorerStore((s) => s.setFlowStep);
  const { flow, step, index, total } = active;
  const flows = device.flows ?? [];
  const color = FLOW_COLORS[flow.id];

  return (
    <article className={styles.card} aria-labelledby="flow-step-title">
      <div className={styles.topRow}>
        {flows.length > 1 && (
          <div className={flowStyles.segmented} role="group" aria-label="Flow type">
            {flows.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`${flowStyles.option} hit`}
                aria-pressed={f.id === flow.id}
                onClick={() => setFlowKind(f.id)}
              >
                {f.shortName}
              </button>
            ))}
          </div>
        )}
        <button type="button" className={styles.close} onClick={stopFlow} aria-label="Exit flow mode">
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <span className="mono-label">
        {flow.name} · Step {index + 1} / {total}
      </span>
      <h2 className={styles.name} id="flow-step-title" style={{ marginTop: 10 }}>
        {step.title}
      </h2>
      <p className={styles.fullName}>
        <span className={flowStyles.dot} style={{ background: color }} aria-hidden="true" />
        {step.route}
      </p>

      <hr className={styles.divider} data-peek-end />

      <section className={styles.section}>
        <h3 className={styles.heading}>{flow.question}</h3>
        <p className={styles.body}>{step.caption[level]}</p>
      </section>

      <dl className={styles.specs} style={{ marginTop: 18 }}>
        <div className={styles.specRow}>
          <dt>{flow.badgeLabel}</dt>
          <dd>{step.badge}</dd>
        </div>
      </dl>

      <div ref={moreRef} className={styles.more}>
        <section className={styles.section} style={{ marginTop: 22 }}>
          <h3 className={styles.heading}>All steps</h3>
          <p className={flowStyles.intro}>{flow.intro}</p>
          <ol className={flowStyles.steps}>
            {flow.steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={flowStyles.stepRow}
                  aria-current={i === index ? "step" : undefined}
                  onClick={() => setFlowStep(i)}
                >
                  <span className={flowStyles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={flowStyles.stepText}>
                    <span className={flowStyles.stepTitle}>{s.title}</span>
                    <span className={flowStyles.stepRoute}>{s.route}</span>
                  </span>
                  <span className={flowStyles.stepBadge}>{s.badge}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
