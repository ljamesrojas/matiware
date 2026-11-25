import { X } from "lucide-react";
import card from "../inspector/PartCard.module.css";
import { useExplorerStore } from "../../store/useExplorerStore";

/** "A", "A and B", "A, B and C". */
export const listText = (items: string[]) =>
  items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** "1 check", "2 checks". */
export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Top row of every quiz card: "Quiz" tag, the mode, and the exit button. */
export function QuizTopRow({ label }: { label: string }) {
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

/**
 * A part name for use mid-sentence: "the hard drive", but "the CPU", "the SoC", "the Wi-Fi card".
 * Only a plain capitalized first word ("Hard", "Battery") is lowercased.
 */
export const inSentence = (name = "") => {
  const first = name.split(" ")[0];
  return /^[A-Z][a-z]+$/.test(first) ? name[0].toLowerCase() + name.slice(1) : name;
};
