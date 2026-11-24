import { useEffect, useRef, type ReactElement, type Ref } from "react";
import { ArrowRight, Check, Hammer, Lightbulb, ScanSearch, X } from "lucide-react";
import card from "../inspector/PartCard.module.css";
import styles from "./QuizCard.module.css";
import { getPart } from "../../data/devices";
import { assembleParts } from "../../store/quiz";
import { useExplorerStore, type QuizState } from "../../store/useExplorerStore";
import type { Device, QuizMode } from "../../types";

interface Props {
  device: Device;
  moreRef?: Ref<HTMLDivElement>;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Inspector content in quiz mode. */
export function QuizCard({ device, moreRef }: Props) {
  const quiz = useExplorerStore((s) => s.quiz);
  if (!quiz.mode) return <QuizChooser moreRef={moreRef} />;
  if (quiz.finished) return <QuizSummary device={device} quiz={quiz} moreRef={moreRef} />;
  if (quiz.mode === "identify") return <IdentifyQuestion device={device} quiz={quiz} moreRef={moreRef} />;
  return <AssembleStatus device={device} quiz={quiz} moreRef={moreRef} />;
}

/** Key for the inspector's content swap: a new key replays the entry animation. */
export function quizContentKey(quiz: QuizState): string {
  if (!quiz.mode) return "quiz-choose";
  if (quiz.finished) return `quiz-${quiz.mode}-done`;
  return quiz.mode === "identify" ? `quiz-identify-${quiz.index}` : "quiz-assemble";
}

/** Text for the inspector's live region. */
export function quizAnnouncement(device: Device, quiz: QuizState): string {
  if (!quiz.mode) return "Quiz. Choose Identify or Assemble.";
  if (quiz.finished) return "Quiz finished. See your results.";
  if (quiz.mode === "identify") {
    const answer = quiz.answers[quiz.index];
    const target = getPart(device, quiz.questions[quiz.index]?.partId ?? null);
    if (answer && target) return answer === target.id ? "Correct." : `Not quite. This is the ${target.name}.`;
    return `Question ${quiz.index + 1} of ${quiz.questions.length}. What is the highlighted part?`;
  }
  const f = quiz.feedback;
  const part = getPart(device, f?.partId ?? null);
  if (f?.kind === "placed" && part) return `${part.name} placed.`;
  if (f?.kind === "blocked" && part) return `Not yet. ${part.name} needs other parts first.`;
  if (quiz.hintPartId) return `Hint: try the ${getPart(device, quiz.hintPartId)?.name}.`;
  return "";
}

function TopRow({ label }: { label: string }) {
  const exitQuiz = useExplorerStore((s) => s.exitQuiz);
  return (
    <div className={card.topRow}>
      <span className={card.code}>Quiz</span>
      <span className={card.category}>{label}</span>
      <button type="button" className={card.close} onClick={exitQuiz} aria-label="Exit quiz">
        <X size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}

const modes: { id: QuizMode; title: string; text: string; Icon: typeof ScanSearch }[] = [
  {
    id: "identify",
    title: "Identify",
    text: "A part lights up on the model. Pick its name from four options.",
    Icon: ScanSearch,
  },
  {
    id: "assemble",
    title: "Assemble",
    text: "Start from a fully exploded PC and click the parts back into place in an order that works.",
    Icon: Hammer,
  },
];

function QuizChooser({ moreRef }: { moreRef?: Ref<HTMLDivElement> }) {
  const startQuiz = useExplorerStore((s) => s.startQuiz);
  return (
    <article className={card.card} aria-labelledby="quiz-title">
      <TopRow label="Build-it quiz" />
      <h2 className={card.name} id="quiz-title">
        Test yourself
      </h2>
      <p className={card.fullName}>Two ways to check what you have learned.</p>
      <hr className={card.divider} data-peek-end />
      <div className={styles.modes}>
        {modes.map(({ id, title, text, Icon }) => (
          <button key={id} type="button" className={styles.mode} onClick={() => startQuiz(id)}>
            <span className={styles.modeIcon} aria-hidden="true">
              <Icon size={18} strokeWidth={1.8} />
            </span>
            <span className={styles.modeText}>
              <span className={styles.modeTitle}>{title}</span>
              <span className={styles.modeDesc}>{text}</span>
            </span>
            <ArrowRight size={16} strokeWidth={1.8} className={styles.modeArrow} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div ref={moreRef} />
    </article>
  );
}

function IdentifyQuestion({ device, quiz, moreRef }: { device: Device; quiz: QuizState; moreRef?: Ref<HTMLDivElement> }) {
  const level = useExplorerStore((s) => s.level);
  const answerQuestion = useExplorerStore((s) => s.answerQuestion);
  const nextQuestion = useExplorerStore((s) => s.nextQuestion);
  const nextRef = useRef<HTMLButtonElement>(null);

  const question = quiz.questions[quiz.index];
  const answer = quiz.answers[quiz.index];
  const target = getPart(device, question.partId)!;
  const score = quiz.answers.filter((a, i) => a !== null && a === quiz.questions[i].partId).length;
  const last = quiz.index === quiz.questions.length - 1;

  // Move focus to "Next" after answering, so keyboard users can carry on with Enter.
  useEffect(() => {
    if (answer) nextRef.current?.focus();
  }, [answer]);

  // Number keys 1–4 answer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (answer || e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const n = Number(e.key);
      if (n >= 1 && n <= question.options.length) answerQuestion(question.options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, question, answerQuestion]);

  return (
    <article className={card.card} aria-labelledby="quiz-q-title">
      <TopRow label="Identify" />
      <span className="mono-label">
        Question {quiz.index + 1} / {quiz.questions.length} · Score {score}
      </span>
      <h2 className={card.name} id="quiz-q-title" style={{ marginTop: 10 }}>
        What is this part?
      </h2>
      <p className={card.fullName}>
        It is highlighted on the model. Pick its name<span className={styles.keysHint}> or press 1–4</span>.
      </p>
      <hr className={card.divider} data-peek-end />

      <ol className={styles.options} aria-label="Answers">
        {question.options.map((id, i) => {
          const part = getPart(device, id)!;
          const state = !answer ? undefined : id === target.id ? "correct" : id === answer ? "wrong" : "other";
          return (
            <li key={id}>
              <button
                type="button"
                className={styles.option}
                data-state={state}
                aria-disabled={!!answer || undefined}
                onClick={() => answerQuestion(id)}
              >
                <span className={styles.optionKey}>{i + 1}</span>
                <span className={styles.optionName}>{part.name}</span>
                {state === "correct" && <Check size={16} strokeWidth={2} aria-label="Correct answer" />}
                {state === "wrong" && <X size={16} strokeWidth={2} aria-label="Your answer" />}
              </button>
            </li>
          );
        })}
      </ol>

      {answer && (
        <div className={styles.feedback} data-tone={answer === target.id ? "good" : "warn"}>
          <p className={styles.feedbackTitle}>
            {answer === target.id ? `Correct. That's the ${target.name}.` : `Not quite. This is the ${target.name}.`}
          </p>
          <p className={styles.feedbackText}>{target.definition[level]}</p>
        </div>
      )}

      {answer && (
        <button ref={nextRef} type="button" className={styles.primary} onClick={nextQuestion}>
          {last ? "See results" : "Next question"}
          <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
      <div ref={moreRef} />
    </article>
  );
}

function AssembleStatus({ device, quiz, moreRef }: { device: Device; quiz: QuizState; moreRef?: Ref<HTMLDivElement> }) {
  const showHint = useExplorerStore((s) => s.showHint);
  const total = assembleParts(device).length;
  const tips = device.quiz?.installTips ?? {};
  const f = quiz.feedback;
  const part = getPart(device, f?.partId ?? null);
  const hintPart = getPart(device, quiz.hintPartId);
  const names = (ids: string[]) => ids.map((id) => getPart(device, id)?.name ?? id).join(" and ");

  return (
    <article className={card.card} aria-labelledby="quiz-a-title">
      <TopRow label="Assemble" />
      <span className="mono-label">
        Placed {quiz.placed.length} / {total} · Out of order {quiz.attempts.length}
      </span>
      <h2 className={card.name} id="quiz-a-title" style={{ marginTop: 10 }}>
        Put it back together
      </h2>
      <p className={card.fullName}>
        Click parts on the model or in the parts list. Some parts need others in place first.
      </p>
      <hr className={card.divider} data-peek-end />

      {hintPart ? (
        <div className={styles.feedback} data-tone="info">
          <p className={styles.feedbackTitle}>Hint: try the {hintPart.name}.</p>
          <p className={styles.feedbackText}>It is highlighted on the model.</p>
        </div>
      ) : f?.kind === "placed" && part ? (
        <div className={styles.feedback} data-tone="good">
          <p className={styles.feedbackTitle}>{part.name} is in place.</p>
          {tips[part.id] && <p className={styles.feedbackText}>{tips[part.id]}</p>}
        </div>
      ) : f?.kind === "blocked" && part ? (
        <div className={styles.feedback} data-tone="warn">
          <p className={styles.feedbackTitle}>
            Not yet: put the {names(f.missing)} in before the {part.name}.
          </p>
          <p className={styles.feedbackText}>{f.reason}</p>
        </div>
      ) : f?.kind === "already" && part ? (
        <div className={styles.feedback} data-tone="info">
          <p className={styles.feedbackTitle}>The {part.name} is already in place.</p>
          <p className={styles.feedbackText}>Pick one of the parts still floating outside the case.</p>
        </div>
      ) : (
        <div className={styles.feedback} data-tone="info">
          <p className={styles.feedbackTitle}>The case and motherboard are already in.</p>
          <p className={styles.feedbackText}>Start with any part that plugs straight into the board or mounts in the case.</p>
        </div>
      )}

      <button type="button" className={styles.secondary} onClick={showHint} disabled={!!hintPart}>
        <Lightbulb size={16} strokeWidth={1.8} aria-hidden="true" />
        Show a hint
      </button>

      <div ref={moreRef} className={card.more}>
        {quiz.placed.length > 0 && (
          <section className={card.section} style={{ marginTop: 22 }}>
            <h3 className={card.heading}>Your build order</h3>
            <ol className={styles.order}>
              {quiz.placed.map((id, i) => (
                <li key={id}>
                  <span className={styles.orderNum}>{String(i + 1).padStart(2, "0")}</span>
                  {getPart(device, id)?.name}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}

function QuizSummary({ device, quiz, moreRef }: { device: Device; quiz: QuizState; moreRef?: Ref<HTMLDivElement> }) {
  const startQuiz = useExplorerStore((s) => s.startQuiz);
  const exitQuiz = useExplorerStore((s) => s.exitQuiz);
  const select = useExplorerStore((s) => s.select);
  const retryRef = useRef<HTMLButtonElement>(null);
  const mode = quiz.mode as QuizMode;
  const other: QuizMode = mode === "identify" ? "assemble" : "identify";

  useEffect(() => retryRef.current?.focus(), []);

  let headline: string;
  let verdict: string;
  let details: ReactElement;

  if (mode === "identify") {
    const total = quiz.questions.length;
    const missed = quiz.questions
      .map((q, i) => ({ partId: q.partId, answer: quiz.answers[i] }))
      .filter((q) => q.answer !== q.partId);
    const score = total - missed.length;
    headline = `${score} / ${total} correct`;
    verdict =
      score === total
        ? "Perfect score. You know every part."
        : score / total >= 0.7
          ? "Nice work. Have a look at the ones you missed."
          : "Keep exploring the parts, then try again.";
    details = missed.length ? (
      <section className={card.section}>
        <h3 className={card.heading}>Missed</h3>
        <ul className={styles.missed}>
          {missed.map((m) => {
            const right = getPart(device, m.partId)!;
            const picked = getPart(device, m.answer);
            return (
              <li key={m.partId}>
                <span className={styles.missedText}>
                  It was the <strong>{right.name}</strong>
                  {picked ? `, you picked ${picked.name}` : ""}
                </span>
                <button type="button" className={styles.link} onClick={() => select(right.id)}>
                  Learn about it
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    ) : (
      <></>
    );
  } else {
    const total = assembleParts(device).length;
    const retried = new Set(quiz.attempts.map((a) => a.partId));
    const firstTry = quiz.placed.filter((id) => !retried.has(id) && !quiz.hinted.includes(id)).length;
    headline = `${firstTry} / ${total} first try`;
    verdict =
      firstTry === total
        ? "Perfect build order."
        : `Built with ${plural(quiz.attempts.length, "out-of-order try", "out-of-order tries")} and ${plural(quiz.hinted.length, "hint", "hints")}.`;
    details = (
      <section className={card.section}>
        <h3 className={card.heading}>Your build order</h3>
        <ol className={styles.order}>
          {quiz.placed.map((id, i) => (
            <li key={id}>
              <span className={styles.orderNum}>{String(i + 1).padStart(2, "0")}</span>
              {getPart(device, id)?.name}
              {retried.has(id) && <span className={styles.tag}>Retry</span>}
              {quiz.hinted.includes(id) && <span className={styles.tag}>Hint</span>}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <article className={card.card} aria-labelledby="quiz-result-title">
      <TopRow label={mode === "identify" ? "Identify · Results" : "Assemble · Results"} />
      <span className="mono-label">Results</span>
      <h2 className={card.name} id="quiz-result-title" style={{ marginTop: 10 }}>
        {headline}
      </h2>
      <p className={card.fullName}>{verdict}</p>
      <hr className={card.divider} data-peek-end />

      <div className={styles.actions}>
        <button ref={retryRef} type="button" className={styles.primary} onClick={() => startQuiz(mode)}>
          Try again
        </button>
        <button type="button" className={styles.secondary} onClick={() => startQuiz(other)}>
          Try {other === "identify" ? "Identify" : "Assemble"}
        </button>
        <button type="button" className={styles.secondary} onClick={exitQuiz}>
          Exit quiz
        </button>
      </div>

      <div ref={moreRef} className={card.more}>
        {details}
      </div>
    </article>
  );
}
