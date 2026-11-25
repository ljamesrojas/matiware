import type { Ref } from "react";
import { PartCard } from "./PartCard";
import { DeviceOverview } from "./DeviceOverview";
import { FlowCard, flowAnnouncement } from "./FlowCard";
import { CompareCard } from "./CompareCard";
import { QuizCard, quizAnnouncement, quizContentKey } from "../quiz/QuizCard";
import { getCompareTopic } from "../../data/compare";
import { getDevice, getPart } from "../../data/devices";
import { useFlowStep } from "../../hooks/useFlowStep";
import { useExplorerStore } from "../../store/useExplorerStore";

export type InspectorMode = "compare" | "quiz" | "flow" | "part" | "overview";

/**
 * Decides what the inspector shows (shared by the desktop card and the mobile sheet):
 * Compare > Quiz > Flow > selected part > device overview.
 */
export function useInspectorContent() {
  const device = getDevice(useExplorerStore((s) => s.deviceId));
  const part = getPart(device, useExplorerStore((s) => s.selectedPartId));
  const flowStep = useFlowStep();
  const quiz = useExplorerStore((s) => s.quiz);
  const compare = useExplorerStore((s) => s.compare);

  const mode: InspectorMode = compare.active
    ? "compare"
    : quiz.active
      ? "quiz"
      : flowStep
        ? "flow"
        : part
          ? "part"
          : "overview";

  /** A new key replays the card's entry animation. */
  let swapKey: string;
  /** Text for the screen-reader live region. */
  let announcement: string;
  switch (mode) {
    case "compare":
      swapKey = `compare-${compare.topic}`;
      announcement = `Comparing ${getCompareTopic(compare.topic).name.toLowerCase()} across devices`;
      break;
    case "quiz":
      swapKey = quizContentKey(quiz);
      announcement = quizAnnouncement(device, quiz);
      break;
    case "flow":
      swapKey = `flow-${flowStep!.flow.id}-${flowStep!.index}`;
      announcement = flowAnnouncement(flowStep!);
      break;
    case "part":
      swapKey = part!.id;
      announcement = `${part!.name} selected`;
      break;
    default:
      swapKey = "overview";
      announcement = "";
  }

  const render = (moreRef?: Ref<HTMLDivElement>) => {
    switch (mode) {
      case "compare":
        return <CompareCard moreRef={moreRef} />;
      case "quiz":
        return <QuizCard device={device} moreRef={moreRef} />;
      case "flow":
        return <FlowCard device={device} active={flowStep!} moreRef={moreRef} />;
      case "part":
        return <PartCard device={device} part={part!} moreRef={moreRef} />;
      default:
        return <DeviceOverview device={device} moreRef={moreRef} />;
    }
  };

  return { mode, swapKey, announcement, render, device, part, flowStep, quiz, compare };
}
