import { movementId, nonEmptyString, positiveInt } from "./brand.ts";
import { yearSpan } from "./time.ts";
import { tokens, type DesignLanguage } from "./language.ts";
import {
  stillPattern,
  stillShape,
  stillWord,
  type SceneProgram,
} from "./scene.ts";
import {
  archiveUrl,
  history,
  liveUrl,
  publication,
  work,
} from "./history.ts";
import { antiPattern, prompt, type Movement } from "./movement.ts";

function language(partial: DesignLanguage): DesignLanguage {
  return partial;
}

function program(partial: SceneProgram): SceneProgram {
  return partial;
}

export const protoWeb: Movement = {
  id: movementId("proto-web"),
  name: nonEmptyString("Proto-web"),
  span: yearSpan(1991, 5),
  history: history(
    "The web as a document. Grey pages, blue links, no layout as a craft.",
    "Tim Berners-Lee's CERN page (info.cern.ch, 1991) is text, default browser chrome, and underlined links. NCSA Mosaic (1993) made inline images ordinary. Yahoo (1994) is a directory, not a composition. The first banner ad, AT&T on HotWired in 1994, arrives before designers treat the page as a surface. Getting a document online was the event. Type was Times because the browser said so.",
  ),
  language: language({
    tokens: tokens({
      bg: "#c0c0c0",
      fg: "#000000",
      accent: "#0000ee",
      muted: "#404040",
      border: "#808080",
      shadow: "#000000",
      fontDisplay: "Times New Roman, Times, serif",
      fontBody: "Times New Roman, Times, serif",
      fontMono: "Courier New, Courier, monospace",
      radiusPx: 1,
      spacePx: 16,
    }),
    layout: {
      density: "sparse",
      columns: 1,
      chrome: "browser",
      ornament: "none",
      nav: "scattered",
    },
    type: {
      displayScale: "medium",
      bodyMeasure: "wide",
      tracking: "normal",
      textCase: "as-written",
    },
    motion: {
      enter: "none",
      durationMs: positiveInt(1),
      easing: "linear",
      loop: "none",
    },
  }),
  scene: program({
    geometry: { kind: "raw-box" },
    camera: { kind: "ortho", zoom: positiveInt(4) },
    motion: { kind: "none" },
    material: "fg",
    still: {
      alt: nonEmptyString("A grey rectangle and a blue underline."),
      marks: [
        stillPattern("grid", "border"),
        stillWord("http://", "accent", 12, 44),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "A dark cinematic hero",
      "Keep the grey document. No gradients, no cover image, no skip-intro energy.",
    ),
    antiPattern(
      "A layout grid",
      "One column of text. Images sit in the flow. Tables are not for design yet.",
    ),
  ],
  prompts: [
    prompt(
      "CERN-like note",
      "Design a single HTML document about a research project. Grey background, Times, blue underlined links, purple visited links, no CSS grid, no custom fonts. One heading, paragraphs, a list of links. It should look like 1993 Mosaic.",
    ),
  ],
  works: [
    work({
      title: "CERN World Wide Web",
      year: 1991,
      credit: "Tim Berners-Lee",
      ref: liveUrl("https://info.cern.ch"),
    }),
    work({
      title: "NCSA Mosaic",
      year: 1993,
      credit: "NCSA",
      ref: publication("Mosaic user documentation", "NCSA", 1993),
    }),
    work({
      title: "HotWired banner (AT&T)",
      year: 1994,
      credit: "HotWired",
      ref: publication("You Will", "AT&T / HotWired", 1994),
    }),
  ],
  answers: [],
};

export const vernacular: Movement = {
  id: movementId("vernacular"),
  name: nonEmptyString("Graphic vernacular"),
  span: yearSpan(1995, 5),
  history: history(
    "Tables become layout. Spacer GIFs hold columns. Everyone gets a homestead.",
    "GeoCities, Angelfire, and Tripod hand millions of people a plot. Netscape and IE ship frames, animated GIFs, and JavaScript. Space Jam (1996) is still up. 88x31 buttons, hit counters, guestbooks, MIDI, tiled stars, pages forever under construction. This is the web as folk art, built with the wrong tools on purpose because they were the only tools.",
  ),
  language: language({
    tokens: tokens({
      bg: "#000033",
      fg: "#ffff00",
      accent: "#ff00ff",
      muted: "#00ffff",
      border: "#ff0000",
      shadow: "#000000",
      fontDisplay: "Impact, Haettenschweiler, sans-serif",
      fontBody: "Comic Sans MS, Comic Sans, cursive",
      fontMono: "Courier New, monospace",
      radiusPx: 1,
      spacePx: 12,
    }),
    layout: {
      density: "dense",
      columns: 12,
      chrome: "browser",
      ornament: "bevel",
      nav: "scattered",
    },
    type: {
      displayScale: "billboard",
      bodyMeasure: "wide",
      tracking: "wide",
      textCase: "uppercase",
    },
    motion: {
      enter: "none",
      durationMs: positiveInt(80),
      easing: "steps",
      loop: "marquee",
    },
  }),
  scene: program({
    geometry: {
      kind: "sprite-grid",
      columns: positiveInt(8),
      rows: positiveInt(5),
    },
    camera: { kind: "ortho", zoom: positiveInt(3) },
    motion: { kind: "drift", speed: positiveInt(4) },
    material: "accent",
    still: {
      alt: nonEmptyString("A tiled field of 88 by 31 badges."),
      marks: [
        stillPattern("dots", "muted"),
        stillWord("UNDER CONSTRUCTION", "fg", 8, 50),
        stillShape("star", "accent", 80, 20),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Tasteful whitespace",
      "Fill the page. Tile the background. Blink something. Leave a guestbook.",
    ),
    antiPattern(
      "A single system font",
      "Mix Impact, Comic Sans, and a spinning GIF. Harmony is the wrong goal.",
    ),
  ],
  prompts: [
    prompt(
      "GeoCities homestead",
      "Build a 1997 personal homepage. Tiled star background, table layout, 88x31 buttons, a hit counter, marquee text, neon on navy, Comic Sans body, Impact headlines. Include an under construction gif energy even if you cannot host the gif.",
    ),
  ],
  works: [
    work({
      title: "Space Jam",
      year: 1996,
      credit: "Warner Bros.",
      ref: liveUrl("https://www.spacejam.com/1996/"),
    }),
    work({
      title: "GeoCities",
      year: 1994,
      credit: "David Bohnett / John Rezner",
      ref: publication("Beverly Hills Internet", "GeoCities", 1994),
    }),
    work({
      title: "The Hampster Dance",
      year: 1998,
      credit: "Deidre LaCarte",
      ref: publication("Hampster Dance", "GeoCities", 1998),
    }),
  ],
  answers: [movementId("proto-web")],
};

export const flash: Movement = {
  id: movementId("flash"),
  name: nonEmptyString("Flash / skip intro"),
  span: yearSpan(1998, 10),
  history: history(
    "The page becomes a stage. Loaders, sound, and a button that says skip intro.",
    "Macromedia Flash turns the browser into a director's tool. Agency sites open with percentage counters and custom cursors. 2Advanced and shops like it treat URLs as optional. Steve Jobs's 2007 iPhone letter begins the end. Adobe kills Flash Player on 31 December 2020. The work was often gorgeous and usually unarchivable.",
  ),
  language: language({
    tokens: tokens({
      bg: "#050505",
      fg: "#f4f4f4",
      accent: "#ff3300",
      muted: "#888888",
      border: "#222222",
      shadow: "#ff3300",
      fontDisplay: "Arial Black, Arial, sans-serif",
      fontBody: "Arial, Helvetica, sans-serif",
      fontMono: "Lucida Console, monospace",
      radiusPx: 2,
      spacePx: 18,
    }),
    layout: {
      density: "sparse",
      columns: 1,
      chrome: "minimal",
      ornament: "scanline",
      nav: "bottom",
    },
    type: {
      displayScale: "billboard",
      bodyMeasure: "narrow",
      tracking: "wide",
      textCase: "uppercase",
    },
    motion: {
      enter: "fade",
      durationMs: positiveInt(900),
      easing: "linear",
      loop: "pulse",
    },
  }),
  scene: program({
    geometry: { kind: "ribbon", turns: positiveInt(5) },
    camera: { kind: "hero-tilt", fov: positiveInt(42) },
    motion: { kind: "spin", speed: positiveInt(6) },
    material: "accent",
    still: {
      alt: nonEmptyString("A loading bar and a skip intro label."),
      marks: [
        stillShape("rectangle", "accent", 20, 70),
        stillWord("SKIP INTRO", "fg", 20, 40),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Deep links",
      "The intro is the site. Inner states do not need URLs. That is the historical fact and also the mistake.",
    ),
    antiPattern(
      "Silent autoplay",
      "Flash intros expected sound. Recreate the drama without blasting audio on load.",
    ),
  ],
  prompts: [
    prompt(
      "Skip-intro agency",
      "Design a 2003 agency splash. Full-bleed black, a percentage loader, condensed all-caps type, a skip intro control, timeline motion, no visible browser chrome. Recreate the feeling in HTML, CSS, and canvas. Do not require a plugin.",
    ),
  ],
  works: [
    work({
      title: "2Advanced",
      year: 1999,
      credit: "Eric Jordan",
      ref: archiveUrl("https://web.archive.org/web/20010223215059/http://www.2advanced.com/", 2001),
    }),
    work({
      title: "YouTube player",
      year: 2005,
      credit: "YouTube",
      ref: publication("YouTube Flash player", "YouTube", 2005),
    }),
    work({
      title: "Thoughts on Flash",
      year: 2010,
      credit: "Steve Jobs",
      ref: publication("Thoughts on Flash", "Apple", 2010),
    }),
  ],
  answers: [movementId("vernacular")],
};

export const standards: Movement = {
  id: movementId("standards"),
  name: nonEmptyString("Web standards"),
  span: yearSpan(2003, 4),
  history: history(
    "One HTML file, many skins. Structure and presentation split.",
    "The Web Standards Project and Jeffrey Zeldman argue that markup should mean something. CSS Zen Garden (Dave Shea, May 2003) proves the point by restyling one document over and over. Douglas Bowman's Wired News redesign (2002) had already taken tables out of a major site. Table layout starts to look like a hack instead of a craft.",
  ),
  language: language({
    tokens: tokens({
      bg: "#f4efe4",
      fg: "#1c1408",
      accent: "#0b57d0",
      muted: "#5c5346",
      border: "#c9bba6",
      shadow: "#8a7a62",
      fontDisplay: "Georgia, Palatino, serif",
      fontBody: "Georgia, Palatino, serif",
      fontMono: "Courier New, monospace",
      radiusPx: 2,
      spacePx: 24,
    }),
    layout: {
      density: "regular",
      columns: 2,
      chrome: "editorial",
      ornament: "none",
      nav: "top",
    },
    type: {
      displayScale: "large",
      bodyMeasure: "readable",
      tracking: "normal",
      textCase: "as-written",
    },
    motion: {
      enter: "fade",
      durationMs: positiveInt(240),
      easing: "ease-out",
      loop: "none",
    },
  }),
  scene: program({
    geometry: { kind: "glyph-field", text: nonEmptyString("CSS") },
    camera: { kind: "perspective", fov: positiveInt(45) },
    motion: { kind: "drift", speed: positiveInt(2) },
    material: "accent",
    still: {
      alt: nonEmptyString("The letters CSS stacked like a garden bed."),
      marks: [
        stillWord("ZEN", "fg", 14, 38),
        stillWord("GARDEN", "accent", 14, 58),
      ],
    },
  }),
  antiPatterns: [
    antiPattern(
      "Presentational markup",
      "No font tags, no table layout, no spacer GIFs. Semantic HTML, CSS for the look.",
    ),
    antiPattern(
      "A different HTML file per skin",
      "One document. The skin is a stylesheet. That is the Garden's whole trick.",
    ),
  ],
  prompts: [
    prompt(
      "Zen Garden skin",
      "Restyle a fixed HTML document (headings, paragraphs, a list, a footer) into a complete visual identity using only CSS. No extra markup. Print-quality typography, a real grid, and a palette that could hang in the original CSS Zen Garden.",
    ),
  ],
  works: [
    work({
      title: "CSS Zen Garden",
      year: 2003,
      credit: "Dave Shea",
      ref: liveUrl("https://csszengarden.com"),
    }),
    work({
      title: "A List Apart",
      year: 1997,
      credit: "Jeffrey Zeldman",
      ref: liveUrl("https://alistapart.com"),
    }),
    work({
      title: "Wired News CSS redesign",
      year: 2002,
      credit: "Douglas Bowman",
      ref: publication("Wired News redesign", "Stopdesign / Wired", 2002),
    }),
  ],
  answers: [movementId("vernacular"), movementId("flash")],
};
