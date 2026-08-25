import { nonEmptyString, type MovementId, type NonEmptyString } from "./brand.ts";
import type { DesignLanguage, TokenSet } from "./language.ts";
import type { LayoutRules, MotionRules, TypeRules } from "./language.ts";
import type { HumanHistory, Work } from "./history.ts";
import type { YearSpan } from "./time.ts";
import type { SceneProgram } from "./scene.ts";

export type AntiPattern = {
  readonly name: NonEmptyString;
  readonly instead: NonEmptyString;
};

export type AgentPrompt = {
  readonly title: NonEmptyString;
  readonly body: NonEmptyString;
};

export type Movement = {
  readonly id: MovementId;
  readonly name: NonEmptyString;
  readonly span: YearSpan;
  readonly history: HumanHistory;
  readonly language: DesignLanguage;
  readonly scene: SceneProgram;
  readonly antiPatterns: readonly [AntiPattern, ...AntiPattern[]];
  readonly prompts: readonly [AgentPrompt, ...AgentPrompt[]];
  readonly works: readonly [Work, ...Work[]];
  readonly answers: readonly MovementId[];
};

export type AgentRecipe = {
  readonly id: MovementId;
  readonly name: NonEmptyString;
  readonly span: YearSpan;
  readonly tokens: TokenSet;
  readonly layout: LayoutRules;
  readonly type: TypeRules;
  readonly motion: MotionRules;
  readonly geometry: SceneProgram["geometry"]["kind"];
  readonly antiPatterns: readonly [AntiPattern, ...AntiPattern[]];
  readonly prompts: readonly [AgentPrompt, ...AgentPrompt[]];
  readonly works: readonly [Work, ...Work[]];
};

export function antiPattern(name: string, instead: string): AntiPattern {
  return {
    name: nonEmptyString(name),
    instead: nonEmptyString(instead),
  };
}

export function prompt(title: string, body: string): AgentPrompt {
  return {
    title: nonEmptyString(title),
    body: nonEmptyString(body),
  };
}

export function agentRecipe(movement: Movement): AgentRecipe {
  return {
    id: movement.id,
    name: movement.name,
    span: movement.span,
    tokens: movement.language.tokens,
    layout: movement.language.layout,
    type: movement.language.type,
    motion: movement.language.motion,
    geometry: movement.scene.geometry.kind,
    antiPatterns: movement.antiPatterns,
    prompts: movement.prompts,
    works: movement.works,
  };
}
