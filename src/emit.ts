import { spanEnd } from "./time.ts";
import type { Catalog } from "./catalog.ts";
import { agentRecipe } from "./movement.ts";
import type { AgentRecipe, Movement } from "./movement.ts";
import type { Work, WorkRef } from "./history.ts";
import { assertNever } from "./brand.ts";

export type DistFiles = {
  readonly "catalog.json": string;
  readonly "llms.txt": string;
};

function refLine(ref: WorkRef): string {
  switch (ref.kind) {
    case "url":
      return ref.href;
    case "archive":
      return `${ref.href} (archive ${ref.captured})`;
    case "publication":
      return `${ref.title}, ${ref.publisher}, ${ref.published}`;
    case "unarchived":
      return "no surviving public URL";
    default: {
      const _exhaustive: never = ref;
      return assertNever(_exhaustive);
    }
  }
}

function workLine(work: Work): string {
  return `- ${work.title} (${work.year}, ${work.credit}): ${refLine(work.ref)}`;
}

function recipeBlock(recipe: AgentRecipe, movement: Movement): string {
  const tokens = recipe.tokens;
  const end = spanEnd(recipe.span);
  const answers = movement.answers.length
    ? movement.answers.join(", ")
    : "none";
  return [
    `## ${recipe.name} (${recipe.span.start}–${end})`,
    `id: ${recipe.id}`,
    `answers: ${answers}`,
    `tokens: bg ${tokens.bg}, fg ${tokens.fg}, accent ${tokens.accent}, muted ${tokens.muted}, border ${tokens.border}, shadow ${tokens.shadow}`,
    `type: display ${tokens.fontDisplay}; body ${tokens.fontBody}; mono ${tokens.fontMono}; scale ${recipe.type.displayScale}; measure ${recipe.type.bodyMeasure}; tracking ${recipe.type.tracking}; case ${recipe.type.textCase}`,
    `layout: density ${recipe.layout.density}; columns ${recipe.layout.columns}; chrome ${recipe.layout.chrome}; ornament ${recipe.layout.ornament}; nav ${recipe.layout.nav}`,
    `motion: enter ${recipe.motion.enter}; ${recipe.motion.durationMs}ms ${recipe.motion.easing}; loop ${recipe.motion.loop}`,
    `geometry: ${recipe.geometry}`,
    `radius ${tokens.radiusPx}px; space ${tokens.spacePx}px`,
    ``,
    `Do not:`,
    ...recipe.antiPatterns.map((item) => `- ${item.name}: ${item.instead}`),
    ``,
    `Prompts:`,
    ...recipe.prompts.map((item) => `- ${item.title}: ${item.body}`),
    ``,
    `Works:`,
    ...recipe.works.map(workLine),
    ``,
  ].join("\n");
}

export function emitDistFiles(catalog: Catalog): DistFiles {
  const payload = {
    schemaVersion: 1 as const,
    count: catalog.inTimeOrder.length,
    movements: catalog.inTimeOrder.map((movement) => ({
      ...agentRecipe(movement),
      summary: movement.history.summary,
      answers: movement.answers,
    })),
  };

  const llms = [
    "# The Field",
    "A catalog of web and digital design movements from 1991 through 2026.",
    "Use a movement as a complete recipe. Copy tokens, layout, type, motion, anti-patterns, and prompts.",
    "Do not mix two movements unless the brief asks for a revival.",
    "",
    `Movements: ${catalog.inTimeOrder.length}`,
    ...catalog.inTimeOrder.map((movement) => {
      const end = spanEnd(movement.span);
      return `- ${movement.id}: ${movement.name} (${movement.span.start}–${end})`;
    }),
    "",
    ...catalog.inTimeOrder.map((movement) =>
      recipeBlock(agentRecipe(movement), movement),
    ),
  ].join("\n");

  return {
    "catalog.json": `${JSON.stringify(payload, null, 2)}\n`,
    "llms.txt": `${llms.trim()}\n`,
  };
}
