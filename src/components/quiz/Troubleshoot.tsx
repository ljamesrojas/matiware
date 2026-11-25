import { useEffect, useRef, type Ref } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import card from "../inspector/PartCard.module.css";
import styles from "./QuizCard.module.css";
import { getPart } from "../../data/devices";
import { checkPart, getScenario } from "../../store/quiz";
import { useExplorerStore, type QuizState } from "../../store/useExplorerStore";
import type { CheckRelevance, Device } from "../../types";
import { QuizTopRow, inSentence, plural } from "./shared";

const RELEVANCE: Record<CheckRelevance, { tag: string; tone: "good" | "info" | "warn"; lead: (name: string) => string }> = {
  likely: { tag: "Likely", tone: "good", lead: (n) => `Good thinking: the ${n} is a likely suspect.` },
  possible: { tag: "Possible", tone: "info", lead: (n) => `Worth a look: the ${n} could be involved.` },
  unlikely: { tag: "Unlikely", tone: "warn", lead: (n) => `Unlikely: the ${n} doesn't usually cause this.` },
};

interface Props {
  device: Device;
  quiz: QuizState;
  moreRef?: Ref<HTMLDivElement>;
}

/** The list of checks so far, each tagged with how sensible it was. */
function CheckList({ device, quiz, title }: { device: Device; quiz: QuizState; title: string }) {
  const scenario = getScenario(device, quiz.scenario)!;
  if (!quiz.checks.length) return null;
  return (
    <section className={card.section} style={{ marginTop: 22 }}>
      <h3 className={card.heading}>{title}</h3>
      <ol className={styles.order}>
        {quiz.checks.map((id, i) => (
          <li key={id}>
            <span className={styles.orderNum}>{String(i + 1).padStart(2, "0")}</span>
            {getPart(device, id)?.name}
            <span className={styles.tag} data-tone={RELEVANCE[checkPart(scenario, id).relevance].tone}>
              {id === scenario.culprit ? "Cause" : RELEVANCE[checkPart(scenario, id).relevance].tag}
            </span>
            {quiz.hinted.includes(id) && <span className={styles.tag}>Hint</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Pick one of the device's problems. */
export function ScenarioPicker({ device, moreRef }: { device: Device; moreRef?: Ref<HTMLDivElement> }) {
  const chooseScenario = useExplorerStore((s) => s.chooseScenario);
  const scenarios = device.troubleshooting ?? [];
  return (
    <article className={card.card} aria-labelledby="ts-pick-title">
      <QuizTopRow label="Troubleshoot" />
      <h2 className={card.name} id="ts-pick-title">
        Find the fault
      </h2>
      <p className={card.fullName}>Pick a problem, then check parts one at a time until you find the cause.</p>
      <hr className={card.divider} data-peek-end />
      <div className={styles.modes}>
        {scenarios.map((s, i) => (
          <button key={s.id} type="button" className={styles.mode} onClick={() => chooseScenario(s.id)}>
            <span className={styles.modeIcon} aria-hidden="true">
              <span className={styles.modeNum}>{String(i + 1).padStart(2, "0")}</span>
            </span>
            <span className={styles.modeText}>
              <span className={styles.modeTitle}>{s.title}</span>
              <span className={styles.modeDesc}>{s.symptom}</span>
            </span>
            <ArrowRight size={16} strokeWidth={1.8} className={styles.modeArrow} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div ref={moreRef} />
    </article>
  );
}

/** A problem in progress: symptom, clues, feedback on the last check, and a hint. */
export function TroubleshootStatus({ device, quiz, moreRef }: Props) {
  const showHint = useExplorerStore((s) => s.showHint);
  const scenario = getScenario(device, quiz.scenario)!;
  const scenarios = device.troubleshooting ?? [];
  const number = scenarios.findIndex((s) => s.id === scenario.id) + 1;
  const f = quiz.feedback;
  const part = getPart(device, f?.partId ?? null);
  const hintPart = getPart(device, quiz.hintPartId);

  let feedback;
  if (hintPart) {
    feedback = (
      <div className={styles.feedback} data-tone="info">
        <p className={styles.feedbackTitle}>Hint: check the {inSentence(hintPart.name)}.</p>
        <p className={styles.feedbackText}>It is highlighted on the model.</p>
      </div>
    );
  } else if (f?.kind === "checked" && part) {
    const result = checkPart(scenario, part.id);
    const r = RELEVANCE[result.relevance];
    feedback = (
      <div className={styles.feedback} data-tone={r.tone}>
        <p className={styles.feedbackTitle}>{r.lead(inSentence(part.name))}</p>
        <p className={styles.feedbackText}>
          {result.finding || `The ${inSentence(part.name)} looks fine, and it isn't linked to this symptom.`}
        </p>
      </div>
    );
  } else if (f?.kind === "already" && part) {
    feedback = (
      <div className={styles.feedback} data-tone="info">
        <p className={styles.feedbackTitle}>You already checked the {inSentence(part.name)}.</p>
        <p className={styles.feedbackText}>Try a part you haven't looked at yet.</p>
      </div>
    );
  } else {
    feedback = (
      <div className={styles.feedback} data-tone="info">
        <p className={styles.feedbackTitle}>Where would you look first?</p>
        <p className={styles.feedbackText}>Click a part on the model or in the parts list to check it.</p>
      </div>
    );
  }

  return (
    <article className={card.card} aria-labelledby="ts-title">
      <QuizTopRow label="Troubleshoot" />
      <span className="mono-label">
        Problem {number} / {scenarios.length} · {plural(quiz.checks.length, "check", "checks")}
      </span>
      <h2 className={card.name} id="ts-title" style={{ marginTop: 10 }}>
        {scenario.title}
      </h2>
      <p className={card.fullName}>{scenario.symptom}</p>
      <hr className={card.divider} data-peek-end />

      <section className={card.section}>
        <h3 className={card.heading}>What you notice</h3>
        <ul className={styles.clues}>
          {scenario.clues.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {feedback}

      <button type="button" className={styles.secondary} onClick={showHint} disabled={!!hintPart}>
        <Lightbulb size={16} strokeWidth={1.8} aria-hidden="true" />
        Show a hint
      </button>

      <div ref={moreRef} className={card.more}>
        <CheckList device={device} quiz={quiz} title="Checked so far" />
      </div>
    </article>
  );
}

/** Solved: how many checks it took, the cause and the fix. */
export function TroubleshootSummary({ device, quiz, moreRef }: Props) {
  const chooseScenario = useExplorerStore((s) => s.chooseScenario);
  const startQuiz = useExplorerStore((s) => s.startQuiz);
  const openQuiz = useExplorerStore((s) => s.openQuiz);
  const exitQuiz = useExplorerStore((s) => s.exitQuiz);
  const primaryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => primaryRef.current?.focus(), []);

  const scenario = getScenario(device, quiz.scenario)!;
  const scenarios = device.troubleshooting ?? [];
  const next = scenarios[scenarios.findIndex((s) => s.id === scenario.id) + 1];
  const culprit = getPart(device, scenario.culprit)!;
  const n = quiz.checks.length;
  const unlikely = quiz.checks.filter((id) => checkPart(scenario, id).relevance === "unlikely").length;

  const verdict =
    n === 1
      ? "Straight to the cause. Expert diagnosis!"
      : unlikely === 0
        ? "Every check was a sensible one. Nicely done."
        : `${plural(unlikely, "check was", "checks were")} unlikely to cause this. Next time, start with the parts linked to the symptom.`;

  return (
    <article className={card.card} aria-labelledby="ts-done-title">
      <QuizTopRow label="Troubleshoot · Solved" />
      <span className="mono-label">Solved</span>
      <h2 className={card.name} id="ts-done-title" style={{ marginTop: 10 }}>
        Found it in {plural(n, "check", "checks")}
      </h2>
      <p className={card.fullName}>{verdict}</p>
      <hr className={card.divider} data-peek-end />

      <div className={styles.feedback} data-tone="good">
        <p className={styles.feedbackTitle}>The cause: the {inSentence(culprit.name)}</p>
        <p className={styles.feedbackText}>{scenario.cause}</p>
      </div>
      <section className={card.section}>
        <h3 className={card.heading}>The fix</h3>
        <p className={card.body}>{scenario.fix}</p>
      </section>

      <div className={styles.actions}>
        {next ? (
          <button ref={primaryRef} type="button" className={styles.primary} onClick={() => chooseScenario(next.id)}>
            Next problem
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        ) : (
          <button ref={primaryRef} type="button" className={styles.primary} onClick={() => startQuiz("troubleshoot")}>
            Pick a problem
          </button>
        )}
        <button type="button" className={styles.secondary} onClick={openQuiz}>
          Other modes
        </button>
        <button type="button" className={styles.secondary} onClick={exitQuiz}>
          Exit quiz
        </button>
      </div>

      <div ref={moreRef} className={card.more}>
        <CheckList device={device} quiz={quiz} title="Your checks" />
      </div>
    </article>
  );
}
