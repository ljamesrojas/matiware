import type { CSSProperties } from "react";
import {
  Columns3,
  Expand,
  Focus,
  GraduationCap,
  Lightbulb,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Route,
  Shrink,
  SkipBack,
  SkipForward,
  Tag,
} from "lucide-react";
import styles from "./Dock.module.css";
import { FLOW_STEP_MS, useExplorerStore } from "../../store/useExplorerStore";
import { assembleParts } from "../../store/quiz";
import { useFlowStep, type ActiveFlowStep } from "../../hooks/useFlowStep";
import { getDevice } from "../../data/devices";

const ICON = { size: 17, strokeWidth: 1.8, "aria-hidden": true } as const;

function ExplodeSlider() {
  const explode = useExplorerStore((s) => s.explode);
  const setExplode = useExplorerStore((s) => s.setExplode);
  const pct = Math.round(explode * 100);

  return (
    <label className={styles.slider}>
      <span className="mono-label">Explode</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={(e) => setExplode(Number(e.target.value) / 100)}
        aria-label="Explode"
        aria-valuetext={`${pct}%`}
        style={{ "--fill": `${pct}%` } as CSSProperties}
      />
      <span className={styles.value}>{pct}%</span>
    </label>
  );
}

/** Flow toggle: starts flow mode, or exits it when active. */
function FlowToggle({ withText }: { withText: boolean }) {
  const active = useExplorerStore((s) => s.flow.active);
  const startFlow = useExplorerStore((s) => s.startFlow);
  const stopFlow = useExplorerStore((s) => s.stopFlow);
  const hasFlows = !!getDevice(useExplorerStore((s) => s.deviceId)).flows?.length;
  if (!hasFlows) return null;

  return (
    <button
      type="button"
      className={withText ? styles.btn : styles.iconBtn}
      aria-pressed={active}
      aria-label={withText ? undefined : "Flow mode"}
      title={active ? "Exit flow mode" : "Play how data and power move through the device"}
      onClick={() => (active ? stopFlow() : startFlow())}
    >
      <Route {...ICON} />
      {withText && <span className={styles.text}>Flow</span>}
    </button>
  );
}

/** Quiz toggle: opens the quiz chooser, or exits the quiz when active. */
function QuizToggle({ withText }: { withText: boolean }) {
  const active = useExplorerStore((s) => s.quiz.active);
  const openQuiz = useExplorerStore((s) => s.openQuiz);
  const exitQuiz = useExplorerStore((s) => s.exitQuiz);
  const hasQuiz = !!getDevice(useExplorerStore((s) => s.deviceId)).quiz;
  if (!hasQuiz) return null;

  return (
    <button
      type="button"
      className={withText ? styles.btn : styles.iconBtn}
      aria-pressed={active}
      aria-label={withText ? undefined : "Quiz"}
      title={active ? "Exit quiz" : "Test yourself: identify parts or put the device back together"}
      onClick={() => (active ? exitQuiz() : openQuiz())}
    >
      <GraduationCap {...ICON} />
      {withText && <span className={styles.text}>Quiz</span>}
    </button>
  );
}

/** Quiz progress (question or parts placed) and the hint button in Assemble mode. */
function QuizProgress() {
  const quiz = useExplorerStore((s) => s.quiz);
  const showHint = useExplorerStore((s) => s.showHint);
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  if (!quiz.mode) return null;

  const hintButton = !quiz.finished && (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label="Show a hint"
      aria-pressed={!!quiz.hintPartId}
      onClick={showHint}
    >
      <Lightbulb {...ICON} />
    </button>
  );

  // Troubleshoot has no fixed length: show how many parts were checked.
  if (quiz.mode === "troubleshoot") {
    if (!quiz.scenario) return null;
    return (
      <>
        <span className={styles.stepCount}>
          <span className="mono-label">
            {/* Kept on phones too: a bare number would be unclear. */}
            Checks {quiz.checks.length}
          </span>
        </span>
        {hintButton}
      </>
    );
  }

  const identify = quiz.mode === "identify";
  const total = identify ? quiz.questions.length : assembleParts(device).length;
  const done = identify ? quiz.answers.filter((a) => a !== null).length : quiz.placed.length;
  const current = identify ? Math.min(quiz.index + 1, total) : done;

  return (
    <>
      <span className={styles.stepCount}>
        <span className="mono-label">
          <span className={styles.stepWord}>{identify ? "Question " : "Placed "}</span>
          {current} / {total}
        </span>
        <span className={styles.progress} aria-hidden="true">
          <span className={styles.progressStatic} style={{ transform: `scaleX(${total ? done / total : 0})` }} />
        </span>
      </span>
      {!identify && hintButton}
    </>
  );
}

/** Previous / play-pause / next and the step counter with a progress bar. */
function FlowControls({ active }: { active: ActiveFlowStep }) {
  const stepFlow = useExplorerStore((s) => s.stepFlow);
  const toggleFlowPlay = useExplorerStore((s) => s.toggleFlowPlay);
  const { index, total, playing } = active;

  return (
    <>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Previous step"
        onClick={() => stepFlow(-1)}
        disabled={index === 0}
      >
        <SkipBack {...ICON} />
      </button>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.play}`}
        aria-label={playing ? "Pause" : "Play"}
        onClick={toggleFlowPlay}
      >
        {playing ? <Pause {...ICON} /> : <Play {...ICON} />}
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Next step"
        onClick={() => stepFlow(1)}
        disabled={index === total - 1}
      >
        <SkipForward {...ICON} />
      </button>
      <span className={styles.stepCount}>
        <span className="mono-label">
          <span className={styles.stepWord}>Step </span>
          {index + 1} / {total}
        </span>
        <span className={styles.progress} aria-hidden="true">
          <span
            // Restart with the step timer (new step, or play after pause).
            key={`${active.flow.id}-${index}-${playing}`}
            className={styles.progressFill}
            data-playing={playing || undefined}
            style={{ animationDuration: `${FLOW_STEP_MS}ms` }}
          />
        </span>
      </span>
    </>
  );
}

/** Floating dock: explode controls, Labels / Isolate / Flow toggles, flow playback, zoom and reset. */
export function Dock({ compact = false }: { compact?: boolean }) {
  const animateExplode = useExplorerStore((s) => s.animateExplode);
  const showLabels = useExplorerStore((s) => s.showLabels);
  const isolate = useExplorerStore((s) => s.isolate);
  const toggleLabels = useExplorerStore((s) => s.toggleLabels);
  const toggleIsolate = useExplorerStore((s) => s.toggleIsolate);
  const zoomBy = useExplorerStore((s) => s.zoomBy);
  const resetView = useExplorerStore((s) => s.resetView);
  const flowStep = useFlowStep();
  const quizActive = useExplorerStore((s) => s.quiz.active);
  const comparing = useExplorerStore((s) => s.compare.active);
  const exitCompare = useExplorerStore((s) => s.exitCompare);
  const compareExit = (withText: boolean) => (
    <button
      type="button"
      className={withText ? styles.btn : styles.iconBtn}
      aria-pressed
      aria-label={withText ? undefined : "Exit compare mode"}
      title="Exit compare mode"
      onClick={exitCompare}
    >
      <Columns3 {...ICON} />
      {withText && <span className={styles.text}>Compare</span>}
    </button>
  );

  if (compact) {
    // On phones the compare card has its own close button; the pill would only cover the models.
    if (comparing) return null;
    return (
      <div className={`${styles.dock} ${styles.compact}`} role="toolbar" aria-label="View controls">
        {quizActive ? (
          <>
            <QuizToggle withText={false} />
            <span className={styles.sep} aria-hidden="true" />
            <QuizProgress />
          </>
        ) : flowStep ? (
          <>
            <FlowToggle withText={false} />
            <span className={styles.sep} aria-hidden="true" />
            <FlowControls active={flowStep} />
          </>
        ) : (
          <>
            <ExplodeSlider />
            <span className={styles.sep} aria-hidden="true" />
            <button
              type="button"
              className={styles.iconBtn}
              aria-pressed={showLabels}
              aria-label="Labels"
              onClick={toggleLabels}
            >
              <Tag {...ICON} />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              aria-pressed={isolate}
              aria-label="Isolate"
              onClick={toggleIsolate}
            >
              <Focus {...ICON} />
            </button>
            <FlowToggle withText={false} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.dock} role="toolbar" aria-label="View controls">
      {comparing ? (
        compareExit(true)
      ) : quizActive ? (
        <>
          <QuizToggle withText />
          <span className={styles.sep} aria-hidden="true" />
          <QuizProgress />
        </>
      ) : flowStep ? (
        <>
          <FlowToggle withText />
          <span className={styles.sep} aria-hidden="true" />
          <FlowControls active={flowStep} />
        </>
      ) : (
        <>
          <button type="button" className={styles.btn} onClick={() => animateExplode(0)}>
            <Shrink {...ICON} />
            <span className={styles.text}>Assemble</span>
          </button>
          <ExplodeSlider />
          <button type="button" className={styles.btn} onClick={() => animateExplode(1)}>
            <Expand {...ICON} />
            <span className={styles.text}>Expand</span>
          </button>

          <span className={styles.sep} aria-hidden="true" />

          <button type="button" className={styles.btn} aria-pressed={showLabels} onClick={toggleLabels}>
            <Tag {...ICON} />
            <span className={styles.text}>Labels</span>
          </button>
          <button
            type="button"
            className={styles.btn}
            aria-pressed={isolate}
            onClick={toggleIsolate}
            title="Show only the selected part and its connections"
          >
            <Focus {...ICON} />
            <span className={styles.text}>Isolate</span>
          </button>
          <FlowToggle withText />
          <QuizToggle withText />
        </>
      )}

      <span className={styles.sep} aria-hidden="true" />

      <button type="button" className={styles.iconBtn} aria-label="Zoom out" onClick={() => zoomBy(-1)}>
        <Minus {...ICON} />
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Zoom in" onClick={() => zoomBy(1)}>
        <Plus {...ICON} />
      </button>
      <button type="button" className={styles.iconBtn} aria-label="Reset view" onClick={resetView}>
        <RotateCcw {...ICON} />
      </button>
    </div>
  );
}
