import "./theater.css";
import { assertNever } from "./brand.ts";
import { catalog } from "./boot.ts";
import { spanEnd } from "./time.ts";
import { applyTheater, cssVars, indexLanguage } from "./language.ts";
import { agentRecipe } from "./movement.ts";
import type { Movement } from "./movement.ts";
import { motionPref, stageOutput } from "./scene.ts";
import type { MotionPreference } from "./scene.ts";
import {
  href,
  openMovement,
  parseRoute,
  toggleAudience,
  type Audience,
  type Route,
} from "./route.ts";
import { createStage, paintStill, type StageHandle } from "./stage.ts";
import type { Work, WorkRef } from "./history.ts";

const appNode = document.querySelector("#app");
const canvasNode = document.querySelector("#stage");
if (!(appNode instanceof HTMLElement) || !(canvasNode instanceof HTMLCanvasElement)) {
  throw new Error("missing #app or #stage");
}
const app: HTMLElement = appNode;
const canvas: HTMLCanvasElement = canvasNode;

let stage: StageHandle | undefined;
let motion: MotionPreference = motionPref(
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : null,
);

function refHtml(ref: WorkRef): string {
  switch (ref.kind) {
    case "url":
      return `<a href="${ref.href}">${ref.href}</a>`;
    case "archive":
      return `<a href="${ref.href}">archive ${ref.captured}</a>`;
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

function workHtml(item: Work): string {
  return `<li><cite>${item.title}</cite> (${item.year}, ${item.credit}) ${refHtml(item.ref)}</li>`;
}

function navHtml(route: Route): string {
  const other = toggleAudience(route);
  const label = route.audience === "human" ? "Agent view" : "Human view";
  return `
    <header class="mast">
      <a class="wordmark" href="#/">The Field</a>
      <p class="tag">A history of web and digital design, 1991–2026</p>
      <a class="audience" href="${href(other)}">${label}</a>
    </header>
  `;
}

function eraChip(movement: Movement, audience: Audience): string {
  const vars = cssVars(movement.language.tokens);
  const style = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const end = spanEnd(movement.span);
  return `
    <a class="era" style="${style}" href="${href(openMovement(movement, audience))}">
      <span class="era-years">${movement.span.start}–${end}</span>
      <strong>${movement.name}</strong>
      <span class="era-sum">${movement.history.summary}</span>
    </a>
  `;
}

function renderIndex(audience: Audience): void {
  applyTheater(indexLanguage(), document.documentElement);
  canvas.hidden = true;
  const intro =
    audience === "human"
      ? "Walk the movements. Each one restyles this page. Notable examples are real. If a URL is gone, the catalog says so."
      : "Agent view. Each movement is a recipe: tokens, layout, type, motion, anti-patterns, prompts. The same catalog is also /catalog.json and /llms.txt.";
  app.innerHTML = `
    ${navHtml({ kind: "index", audience })}
    <main class="index">
      <p class="lede">${intro}</p>
      <ol class="eras">
        ${catalog.inTimeOrder.map((item) => `<li>${eraChip(item, audience)}</li>`).join("")}
      </ol>
    </main>
  `;
}

function renderHuman(movement: Movement): void {
  applyTheater(movement.language, document.documentElement);
  const output = stageOutput(movement.language, movement.scene, motion);
  const end = spanEnd(movement.span);
  const works = movement.works.map(workHtml).join("");
  const answers = movement.answers.length
    ? movement.answers
        .map((id) => {
          const other = catalog.inTimeOrder.find((item) => item.id === id);
          if (!other) {
            return "";
          }
          return `<a href="${href(openMovement(other, "human"))}">${other.name}</a>`;
        })
        .join(", ")
    : "the empty web";

  app.innerHTML = `
    ${navHtml({ kind: "movement", movement, audience: "human" })}
    <main class="era-page">
      <p class="kicker">${movement.span.start}–${end}</p>
      <h1>${movement.name}</h1>
      <p class="summary">${movement.history.summary}</p>
      <article class="essay">${movement.history.essay}</article>
      <section>
        <h2>Notable</h2>
        <ul class="works">${works}</ul>
      </section>
      <p class="answers">Answers ${answers}</p>
      <div class="stage-slot" id="still-host"></div>
    </main>
  `;

  switch (output.kind) {
    case "canvas":
      canvas.hidden = false;
      stage ??= createStage(canvas);
      stage.replace(output.program, movement.language.tokens);
      break;
    case "still": {
      canvas.hidden = true;
      const host = document.querySelector("#still-host");
      if (host instanceof HTMLElement) {
        paintStill(host, output);
      }
      break;
    }
    default: {
      const _exhaustive: never = output;
      assertNever(_exhaustive);
    }
  }
}

function renderAgent(movement: Movement): void {
  applyTheater(movement.language, document.documentElement);
  canvas.hidden = true;
  const recipe = agentRecipe(movement);
  const end = spanEnd(recipe.span);
  const tokens = Object.entries(recipe.tokens)
    .map(([k, v]) => `<tr><th>${k}</th><td><code>${v}</code></td></tr>`)
    .join("");
  app.innerHTML = `
    ${navHtml({ kind: "movement", movement, audience: "agent" })}
    <main class="agent-page">
      <p class="kicker">Agent recipe · ${recipe.span.start}–${end}</p>
      <h1>${recipe.name}</h1>
      <p class="summary">${movement.history.summary}</p>
      <section>
        <h2>Tokens</h2>
        <table class="tokens">${tokens}</table>
      </section>
      <section>
        <h2>Layout</h2>
        <p>density ${recipe.layout.density}, ${recipe.layout.columns} columns, chrome ${recipe.layout.chrome}, ornament ${recipe.layout.ornament}, nav ${recipe.layout.nav}.</p>
      </section>
      <section>
        <h2>Type</h2>
        <p>scale ${recipe.type.displayScale}, measure ${recipe.type.bodyMeasure}, tracking ${recipe.type.tracking}, case ${recipe.type.textCase}.</p>
      </section>
      <section>
        <h2>Motion</h2>
        <p>enter ${recipe.motion.enter}, ${recipe.motion.durationMs}ms ${recipe.motion.easing}, loop ${recipe.motion.loop}. Geometry ${recipe.geometry}.</p>
      </section>
      <section>
        <h2>Do not</h2>
        <ul>${recipe.antiPatterns.map((item) => `<li><strong>${item.name}.</strong> ${item.instead}</li>`).join("")}</ul>
      </section>
      <section>
        <h2>Prompts</h2>
        ${recipe.prompts.map((item) => `<figure class="prompt"><figcaption>${item.title}</figcaption><pre>${item.body}</pre></figure>`).join("")}
      </section>
      <section>
        <h2>Works</h2>
        <ul class="works">${recipe.works.map(workHtml).join("")}</ul>
      </section>
      <p class="machine"><a href="./catalog.json">catalog.json</a> · <a href="./llms.txt">llms.txt</a></p>
    </main>
  `;
}

function renderUnknown(reason: "malformed" | "unknown-id"): void {
  applyTheater(indexLanguage(), document.documentElement);
  canvas.hidden = true;
  app.innerHTML = `
    ${navHtml({ kind: "index", audience: "human" })}
    <main>
      <h1>Unknown route</h1>
      <p>${reason === "unknown-id" ? "That movement is not in the catalog." : "The hash is malformed."}</p>
      <p><a href="#/">Back to the timeline.</a></p>
    </main>
  `;
}

function paint(): void {
  const parsed = parseRoute(window.location.hash, catalog);
  if (!parsed.ok) {
    renderUnknown(parsed.reason);
    return;
  }
  const route = parsed.route;
  switch (route.kind) {
    case "index":
      renderIndex(route.audience);
      return;
    case "movement":
      switch (route.audience) {
        case "human":
          renderHuman(route.movement);
          return;
        case "agent":
          renderAgent(route.movement);
          return;
        default: {
          const _exhaustive: never = route.audience;
          assertNever(_exhaustive);
        }
      }
      return;
    default: {
      const _exhaustive: never = route;
      assertNever(_exhaustive);
    }
  }
}

window.addEventListener("hashchange", paint);
window
  .matchMedia("(prefers-reduced-motion: reduce)")
  .addEventListener("change", (event) => {
    motion = motionPref(event.matches ? "reduce" : null);
    paint();
  });
paint();
