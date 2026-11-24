import type { Device } from "../types";

export interface IdentifyQuestion {
  partId: string;
  /** Part ids, shuffled; one of them is `partId`. */
  options: string[];
}

export type AssembleFeedback =
  | { kind: "placed"; partId: string }
  | { kind: "blocked"; partId: string; missing: string[]; reason: string }
  | { kind: "already"; partId: string };

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One question per part, in random order, each with shuffled options. */
export function buildIdentifyQuestions(device: Device): IdentifyQuestion[] {
  const ids = device.parts.map((p) => p.id);
  const count = Math.min(device.quiz?.optionsPerQuestion ?? 4, ids.length);
  return shuffle(ids).map((partId) => {
    const distractors = shuffle(ids.filter((id) => id !== partId)).slice(0, count - 1);
    return { partId, options: shuffle([partId, ...distractors]) };
  });
}

/** Parts that never move in the exploded view start in place (case, motherboard). */
export function prePlacedParts(device: Device): string[] {
  return device.parts.filter((p) => p.explodeOffset.every((v) => v === 0)).map((p) => p.id);
}

/** Parts the student has to put back in Assemble mode, in list order. */
export function assembleParts(device: Device): string[] {
  const pre = new Set(prePlacedParts(device));
  return device.parts.map((p) => p.id).filter((id) => !pre.has(id));
}

/** Which prerequisites are still missing for a part, and why they matter. */
export function missingPrereqs(
  device: Device,
  partId: string,
  placed: Set<string>,
): { missing: string[]; reason: string } {
  const rule = device.quiz?.rules.find((r) => r.part === partId);
  if (!rule) return { missing: [], reason: "" };
  return { missing: rule.after.filter((id) => !placed.has(id)), reason: rule.reason };
}

/** A random part that can be placed right now (used for hints). */
export function nextValidPart(device: Device, placed: Set<string>): string | null {
  const valid = assembleParts(device).filter(
    (id) => !placed.has(id) && missingPrereqs(device, id, placed).missing.length === 0,
  );
  return valid.length ? valid[Math.floor(Math.random() * valid.length)] : null;
}
