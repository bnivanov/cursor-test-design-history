import { movementId, nonEmptyString, positiveInt } from "./brand.ts";
import { yearSpan } from "./time.ts";
import { tokens, type DesignLanguage } from "./language.ts";
import {
  stillPattern,
  stillShape,
  stillWord,
  type SceneProgram,
} from "./scene.ts";
import { history, liveUrl, publication, work } from "./history.ts";
import { antiPattern, prompt, type Movement } from "./movement.ts";

function language(partial: DesignLanguage): DesignLanguage {
  return partial;
}

function program(partial: SceneProgram): SceneProgram {
  return partial;
}

export const material: Movement = {
  id: movementId("material"),
  name: nonEmptyString("Material Design"),
  span: yearSpan(2014, 5),
  history: history(
    "Paper, ink, elevation, motion as meaning. A system, not a look.",
    "Google I/O 2014. Cards rest at 2dp and rise when they matter. Ink splashes from the finger. The 8dp grid is law. A floating action button sits in the corner and tells you the primary verb. Polymer and later Material Components carry it onto the web. It is the most complete design system the web had yet been asked to implement, and it made a lot of sites look like Android settings.",
  ),
  language: language({
    tokens: tokens({
      bg: "#fafafa",
      fg: "#212121",
      accent: "#6200ee",
      muted: "#757575",
      border: "#e0e0e0",
      shadow: "#9e9e9e",
      fontDisplay: "Roboto, Helvetica, Arial, sans-serif",
      fontBody: "Roboto, Helvetica, Arial, sans-serif",
      fontMono: "Roboto Mono, monospace",
      radiusPx: 4,
      spacePx: 16,
    }),
    layout: {
      density: "regular",
      columns: 4,
      chrome: "dashboard",
      ornament: "none",
      nav: "side",
    },
    type: {
      displayScale: "medium",
      bodyMeasure: "readable",
      tracking: "normal",
      textCase: "as-written",
    },
    motion: {
      enter: "slide",
      durationMs: positiveInt(250),
      easing: "spring",
      loop: "none",
    },
  }),
  scene: program({
    geometry: { kind: "elevation-cards", count: positiveInt(4) },
    camera: { kind: "perspective", fov: positiveInt(36) },
    motion: { kind: "pulse", speed: positiveInt(2) },
    material: "accent",
    still: {
      alt: nonEmptyString("Cards at rest and a circular action button."),
      marks: [
        stillShape("rectangle", "border", 18, 28),
        stillShape("circle", "accent", 78, 72),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Random elevation",
      "Elevation is meaning. A card that floats for decoration is not Material. Rest, pick up, move, put down.",
    ),
    antiPattern(
      "iOS glyphs on purple",
      "Use the 8dp grid, Roboto, a primary and an accent, ink, and a FAB only if there is one clear action.",
    ),
  ],
  prompts: [
    prompt(
      "2015 Android web companion",
      "Design a Material web app. 8dp grid, Roboto, a primary color and an accent, cards with rest elevation, a FAB, a snackbar, meaningful motion (not bounce for fun). It should look like Inbox or early Material Gmail, not like a Dribbble remix.",
    ),
  ],
  works: [
    work({
      title: "Material Design",
      year: 2014,
      credit: "Google",
      ref: liveUrl("https://m3.material.io"),
    }),
    work({
      title: "Inbox by Gmail",
      year: 2014,
      credit: "Google",
      ref: publication("Inbox by Gmail", "Google", 2014),
    }),
    work({
      title: "Polymer shop demo",
      year: 2015,
      credit: "Google",
      ref: publication("Polymer Shop", "Google", 2015),
    }),
  ],
  answers: [movementId("flat")],
};

export const brutalism: Movement = {
  id: movementId("brutalism"),
  name: nonEmptyString("Brutalism / anti-design"),
  span: yearSpan(2014, 7),
  history: history(
    "A reaction to Bootstrap sameness. Raw type, exposed structure, ugly on purpose.",
    "Pascal Deville's Brutalist Websites catalogs pages that look like the HTML was left in the room. Fashion and editorial (Balenciaga, Bloomberg Businessweek experiments, DIS) use collision, system fonts, and visible borders as taste. It is not a lack of skill. It is a refusal of the template. Some of it is actually hard to use. That is sometimes the point and sometimes a failure the catalog should name.",
  ),
  language: language({
    tokens: tokens({
      bg: "#ffff00",
      fg: "#000000",
      accent: "#ff0000",
      muted: "#111111",
      border: "#000000",
      shadow: "#000000",
      fontDisplay: "Times New Roman, Times, serif",
      fontBody: "Arial, Helvetica, sans-serif",
      fontMono: "Courier New, monospace",
      radiusPx: 1,
      spacePx: 10,
    }),
    layout: {
      density: "dense",
      columns: 3,
      chrome: "minimal",
      ornament: "none",
      nav: "scattered",
    },
    type: {
      displayScale: "billboard",
      bodyMeasure: "wide",
      tracking: "tight",
      textCase: "uppercase",
    },
    motion: {
      enter: "skew",
      durationMs: positiveInt(80),
      easing: "steps",
      loop: "none",
    },
  }),
  scene: program({
    geometry: { kind: "colliding-slabs", count: positiveInt(7) },
    camera: { kind: "hero-tilt", fov: positiveInt(55) },
    motion: { kind: "drift", speed: positiveInt(7) },
    material: "accent",
    still: {
      alt: nonEmptyString("Overlapping black slabs on a yellow field."),
      marks: [
        stillWord("HTML", "fg", 8, 30),
        stillWord("AS IS", "accent", 40, 62),
        stillShape("line", "fg", 10, 80),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Tasteful cards on a 12 column grid",
      "Break the template. Mix Times and Arial at colliding sizes. Show the border. Leave a raw link.",
    ),
    antiPattern(
      "Illegible as a flex",
      "Brutalism is a visual argument, not an excuse to fail contrast or keyboard access. Keep it readable even when it is rude.",
    ),
  ],
  prompts: [
    prompt(
      "Anti-template magazine",
      "Design an editorial site that could sit on Brutalist Websites. System fonts only, visible structure, colliding scale, a loud default palette (yellow/red/black or equivalent), no Bootstrap grid, no hero stock photo. Make it feel authored, not broken.",
    ),
  ],
  works: [
    work({
      title: "Brutalist Websites",
      year: 2014,
      credit: "Pascal Deville",
      ref: liveUrl("https://brutalistwebsites.com"),
    }),
    work({
      title: "Bloomberg Businessweek digital experiments",
      year: 2016,
      credit: "Bloomberg Businessweek",
      ref: publication("Businessweek digital design", "Bloomberg", 2016),
    }),
    work({
      title: "Balenciaga.com (period)",
      year: 2016,
      credit: "Balenciaga",
      ref: publication("Balenciaga e-commerce", "Balenciaga", 2016),
    }),
  ],
  answers: [movementId("material"), movementId("flat"), movementId("web-2-0")],
};

export const glassRevival: Movement = {
  id: movementId("glass-revival"),
  name: nonEmptyString("Glass, dark, revival"),
  span: yearSpan(2018, 6),
  history: history(
    "OLED black, blur, translucency. Then a loud Y2K and maximalist revival against all of that.",
    "macOS Mojave (2018) and iOS 13 (2019) make dark mode a product choice. Glassmorphism (Big Sur, Fluent) is blur and stacked translucent panes. Neumorphism is a short fad. In parallel, fashion e-comm and Awwwards portfolios bring back chrome, blobs, Comic type, and clutter. The decade argues with itself. One night the UI is a smoked window. The next it is a holographic sticker sheet.",
  ),
  language: language({
    tokens: tokens({
      bg: "#0b0f1a",
      fg: "#f2f5ff",
      accent: "#66e0ff",
      muted: "#8b93b0",
      border: "#2b3558",
      shadow: "#041018",
      fontDisplay: "SF Pro Display, Helvetica Neue, sans-serif",
      fontBody: "SF Pro Text, Helvetica Neue, sans-serif",
      fontMono: "SF Mono, ui-monospace, monospace",
      radiusPx: 18,
      spacePx: 20,
    }),
    layout: {
      density: "sparse",
      columns: 2,
      chrome: "os-window",
      ornament: "grain",
      nav: "top",
    },
    type: {
      displayScale: "large",
      bodyMeasure: "readable",
      tracking: "wide",
      textCase: "as-written",
    },
    motion: {
      enter: "fade",
      durationMs: positiveInt(400),
      easing: "ease-out",
      loop: "pulse",
    },
  }),
  scene: program({
    geometry: { kind: "glass-planes", layers: positiveInt(4) },
    camera: { kind: "perspective", fov: positiveInt(48) },
    motion: { kind: "parallax", strength: positiveInt(12) },
    material: "accent",
    still: {
      alt: nonEmptyString("Frosted panes over a dark field."),
      marks: [
        stillPattern("noise", "border"),
        stillShape("rectangle", "muted", 24, 32),
        stillWord("blur(24px)", "accent", 18, 72),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Unreadable glass",
      "Blur is not contrast. Text on a pane still needs a backing fill that passes.",
    ),
    antiPattern(
      "Neumorphism as the whole UI",
      "Soft extrusion had a year. Do not build a product out of it. Quote glass or quote maximalist revival, not a grey squircle with no edge.",
    ),
  ],
  prompts: [
    prompt(
      "Big Sur pane",
      "Design a 2020 desktop-class web app chrome. Dark OLED field, translucent bars, backdrop blur, hairline borders, cyan accent, large rounded corners. Keep type readable. Optional second frame: a maximalist fashion landing that rejects this look with chrome and clutter.",
    ),
  ],
  works: [
    work({
      title: "macOS Mojave / Big Sur",
      year: 2018,
      credit: "Apple",
      ref: publication("macOS Mojave and Big Sur", "Apple", 2020),
    }),
    work({
      title: "Microsoft Fluent",
      year: 2017,
      credit: "Microsoft",
      ref: liveUrl("https://fluent2.microsoft.design"),
    }),
    work({
      title: "iOS 13 Dark Mode",
      year: 2019,
      credit: "Apple",
      ref: publication("iOS 13", "Apple", 2019),
    }),
  ],
  answers: [movementId("flat"), movementId("material")],
};

export const spatialAgentic: Movement = {
  id: movementId("spatial-agentic"),
  name: nonEmptyString("Spatial / agentic"),
  span: yearSpan(2020, 7),
  history: history(
    "Scroll is a camera. Then chat becomes chrome and the page is a canvas a model fills.",
    "WebGL and Three.js become default for high-end marketing. Active Theory, Locomotive, Apple product films in the page, Stripe's quiet craft. Then ChatGPT (November 2022) and the agentic editor (Cursor, v0, Claude Artifacts) make streaming text and a split human/machine pane the new window chrome. The field is still arguing about whether the interface is a scene, a document, or a conversation.",
  ),
  language: language({
    tokens: tokens({
      bg: "#09090b",
      fg: "#f4f4f5",
      accent: "#22c55e",
      muted: "#a1a1aa",
      border: "#27272a",
      shadow: "#000000",
      fontDisplay: "Geist, Inter, Helvetica Neue, sans-serif",
      fontBody: "Geist, Inter, system-ui, sans-serif",
      fontMono: "Geist Mono, IBM Plex Mono, monospace",
      radiusPx: 10,
      spacePx: 18,
    }),
    layout: {
      density: "regular",
      columns: 2,
      chrome: "dashboard",
      ornament: "grid",
      nav: "side",
    },
    type: {
      displayScale: "medium",
      bodyMeasure: "readable",
      tracking: "normal",
      textCase: "as-written",
    },
    motion: {
      enter: "fade",
      durationMs: positiveInt(260),
      easing: "ease-out",
      loop: "none",
    },
  }),
  scene: program({
    geometry: { kind: "chat-panels", count: positiveInt(5) },
    camera: { kind: "perspective", fov: positiveInt(32) },
    motion: { kind: "drift", speed: positiveInt(3) },
    material: "accent",
    still: {
      alt: nonEmptyString("Stacked chat panels beside a chrome orb."),
      marks: [
        stillPattern("grid", "border"),
        stillWord(">", "accent", 12, 48),
        stillShape("circle", "muted", 74, 48),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Generic particles",
      "If the 3D is not specific to the product, delete it. A studio-lit object or a typed stream beats a point cloud.",
    ),
    antiPattern(
      "Chat as the only affordance",
      "Agentic UI still needs structure: citations, diffs, a canvas, a way to say no. A text box is not a product.",
    ),
  ],
  prompts: [
    prompt(
      "2026 studio plus agent",
      "Design a marketing site that is also a working agent surface. Dark studio lighting, one WebGL object that is the product, a split pane where a model streams into a canvas, citation chips, a human view and a machine view of the same state. No particle soup. No fake AI sparkles.",
    ),
  ],
  works: [
    work({
      title: "Stripe",
      year: 2021,
      credit: "Stripe",
      ref: liveUrl("https://stripe.com"),
    }),
    work({
      title: "ChatGPT",
      year: 2022,
      credit: "OpenAI",
      ref: liveUrl("https://chatgpt.com"),
    }),
    work({
      title: "Active Theory",
      year: 2020,
      credit: "Active Theory",
      ref: liveUrl("https://activetheory.net"),
    }),
  ],
  answers: [
    movementId("glass-revival"),
    movementId("brutalism"),
    movementId("flash"),
  ],
};
