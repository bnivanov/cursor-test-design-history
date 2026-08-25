import {
  assertNever,
  cssColor,
  cssFamily,
  positiveInt,
  type CssColor,
  type CssFamily,
  type PositiveInt,
} from "./brand.ts";

export type TokenSet = {
  readonly bg: CssColor;
  readonly fg: CssColor;
  readonly accent: CssColor;
  readonly muted: CssColor;
  readonly border: CssColor;
  readonly shadow: CssColor;
  readonly fontDisplay: CssFamily;
  readonly fontBody: CssFamily;
  readonly fontMono: CssFamily;
  readonly radiusPx: PositiveInt;
  readonly spacePx: PositiveInt;
};

export type LayoutRules = {
  readonly density: "sparse" | "regular" | "dense";
  readonly columns: 1 | 2 | 3 | 4 | 12;
  readonly chrome: "minimal" | "browser" | "os-window" | "editorial" | "dashboard";
  readonly ornament: "none" | "bevel" | "gloss" | "grain" | "grid" | "scanline";
  readonly nav: "top" | "side" | "bottom" | "scattered";
};

export type TypeRules = {
  readonly displayScale: "small" | "medium" | "large" | "billboard";
  readonly bodyMeasure: "narrow" | "readable" | "wide";
  readonly tracking: "tight" | "normal" | "wide";
  readonly textCase: "as-written" | "uppercase" | "small-caps";
};

export type MotionRules = {
  readonly enter: "none" | "fade" | "slide" | "scale" | "skew";
  readonly durationMs: PositiveInt;
  readonly easing: "linear" | "ease-out" | "spring" | "steps";
  readonly loop: "none" | "pulse" | "marquee";
};

export type ColorRole = keyof Pick<
  TokenSet,
  "bg" | "fg" | "accent" | "muted" | "border" | "shadow"
>;

export type DesignLanguage = {
  readonly tokens: TokenSet;
  readonly layout: LayoutRules;
  readonly type: TypeRules;
  readonly motion: MotionRules;
};

export type CssVars = {
  readonly "--bg": string;
  readonly "--fg": string;
  readonly "--accent": string;
  readonly "--muted": string;
  readonly "--border": string;
  readonly "--shadow": string;
  readonly "--font-display": string;
  readonly "--font-body": string;
  readonly "--font-mono": string;
  readonly "--radius": string;
  readonly "--space": string;
};

export type CssVarHost = {
  style: {
    setProperty: (property: string, value: string) => void;
  };
  setAttribute: (name: string, value: string) => void;
};

export function tokens(input: {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  border: string;
  shadow: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  radiusPx: number;
  spacePx: number;
}): TokenSet {
  return {
    bg: cssColor(input.bg),
    fg: cssColor(input.fg),
    accent: cssColor(input.accent),
    muted: cssColor(input.muted),
    border: cssColor(input.border),
    shadow: cssColor(input.shadow),
    fontDisplay: cssFamily(input.fontDisplay),
    fontBody: cssFamily(input.fontBody),
    fontMono: cssFamily(input.fontMono),
    radiusPx: positiveInt(input.radiusPx),
    spacePx: positiveInt(input.spacePx),
  };
}

export function resolveRole(set: TokenSet, role: ColorRole): CssColor {
  switch (role) {
    case "bg":
      return set.bg;
    case "fg":
      return set.fg;
    case "accent":
      return set.accent;
    case "muted":
      return set.muted;
    case "border":
      return set.border;
    case "shadow":
      return set.shadow;
    default: {
      const _exhaustive: never = role;
      return assertNever(_exhaustive);
    }
  }
}

export function cssVars(set: TokenSet): CssVars {
  return {
    "--bg": set.bg,
    "--fg": set.fg,
    "--accent": set.accent,
    "--muted": set.muted,
    "--border": set.border,
    "--shadow": set.shadow,
    "--font-display": set.fontDisplay,
    "--font-body": set.fontBody,
    "--font-mono": set.fontMono,
    "--radius": `${set.radiusPx}px`,
    "--space": `${set.spacePx}px`,
  };
}

export function applyTheater(language: DesignLanguage, target: CssVarHost): void {
  const vars = cssVars(language.tokens);
  for (const [property, value] of Object.entries(vars)) {
    target.style.setProperty(property, value);
  }
  target.setAttribute("data-density", language.layout.density);
  target.setAttribute("data-chrome", language.layout.chrome);
  target.setAttribute("data-ornament", language.layout.ornament);
  target.setAttribute("data-nav", language.layout.nav);
  target.setAttribute("data-scale", language.type.displayScale);
  target.setAttribute("data-measure", language.type.bodyMeasure);
  target.setAttribute("data-tracking", language.type.tracking);
  target.setAttribute("data-case", language.type.textCase);
  target.setAttribute("data-enter", language.motion.enter);
  target.setAttribute("data-loop", language.motion.loop);
  target.setAttribute("data-columns", String(language.layout.columns));
}

export function indexLanguage(): DesignLanguage {
  return {
    tokens: tokens({
      bg: "#0c0d10",
      fg: "#ece8df",
      accent: "#e8ff47",
      muted: "#9a9486",
      border: "#2a2c32",
      shadow: "#000000",
      fontDisplay: "Fraunces, Georgia, serif",
      fontBody: "Source Serif 4, Georgia, serif",
      fontMono: "IBM Plex Mono, ui-monospace, monospace",
      radiusPx: 2,
      spacePx: 20,
    }),
    layout: {
      density: "regular",
      columns: 1,
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
      durationMs: positiveInt(280),
      easing: "ease-out",
      loop: "none",
    },
  };
}
