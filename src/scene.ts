import {
  nonEmptyString,
  positiveInt,
  type NonEmptyString,
  type PositiveInt,
} from "./brand.ts";
import { assertNever } from "./brand.ts";
import type { ColorRole, DesignLanguage, TokenSet } from "./language.ts";

export type GeometryKind =
  | { readonly kind: "sprite-grid"; readonly columns: PositiveInt; readonly rows: PositiveInt }
  | { readonly kind: "bevel-blocks"; readonly count: PositiveInt; readonly depth: PositiveInt }
  | { readonly kind: "ribbon"; readonly turns: PositiveInt }
  | { readonly kind: "paper-layers"; readonly layers: PositiveInt }
  | { readonly kind: "glass-planes"; readonly layers: PositiveInt }
  | { readonly kind: "wire-lattice"; readonly divisions: PositiveInt }
  | { readonly kind: "glyph-field"; readonly text: NonEmptyString }
  | { readonly kind: "raw-box" }
  | { readonly kind: "colliding-slabs"; readonly count: PositiveInt }
  | { readonly kind: "elevation-cards"; readonly count: PositiveInt }
  | { readonly kind: "chrome-orb" }
  | { readonly kind: "chat-panels"; readonly count: PositiveInt };

export type CameraVocab =
  | { readonly kind: "ortho"; readonly zoom: PositiveInt }
  | { readonly kind: "perspective"; readonly fov: PositiveInt }
  | { readonly kind: "hero-tilt"; readonly fov: PositiveInt };

export type SceneMotion =
  | { readonly kind: "none" }
  | { readonly kind: "drift"; readonly speed: PositiveInt }
  | { readonly kind: "spin"; readonly speed: PositiveInt }
  | { readonly kind: "parallax"; readonly strength: PositiveInt }
  | { readonly kind: "pulse"; readonly speed: PositiveInt };

export type PosterMark =
  | {
      readonly kind: "shape";
      readonly shape: "rectangle" | "circle" | "line" | "star";
      readonly color: ColorRole;
      readonly x: PositiveInt;
      readonly y: PositiveInt;
    }
  | {
      readonly kind: "word";
      readonly text: NonEmptyString;
      readonly color: ColorRole;
      readonly x: PositiveInt;
      readonly y: PositiveInt;
    }
  | {
      readonly kind: "pattern";
      readonly pattern: "grid" | "dots" | "stripes" | "noise";
      readonly color: ColorRole;
    };

export type StillFrame = {
  readonly alt: NonEmptyString;
  readonly marks: readonly [PosterMark, ...PosterMark[]];
};

export type SceneProgram = {
  readonly geometry: GeometryKind;
  readonly camera: CameraVocab;
  readonly motion: SceneMotion;
  readonly material: ColorRole;
  readonly still: StillFrame;
};

export type MotionPreference = "full" | "reduced";

export type StageOutput =
  | { readonly kind: "canvas"; readonly program: SceneProgram }
  | { readonly kind: "still"; readonly still: StillFrame; readonly tokens: TokenSet };

export function sceneSignature(program: SceneProgram): string {
  return JSON.stringify({
    geometry: program.geometry,
    camera: program.camera,
    motion: program.motion,
    material: program.material,
  });
}

export function stageOutput(
  language: DesignLanguage,
  program: SceneProgram,
  motion: MotionPreference,
): StageOutput {
  switch (motion) {
    case "full":
      return { kind: "canvas", program };
    case "reduced":
      return { kind: "still", still: program.still, tokens: language.tokens };
    default: {
      const _exhaustive: never = motion;
      return assertNever(_exhaustive);
    }
  }
}

export function motionPref(query: string | null): MotionPreference {
  return query === "reduce" ? "reduced" : "full";
}

export function stillWord(
  text: string,
  color: ColorRole,
  x: number,
  y: number,
): PosterMark {
  return {
    kind: "word",
    text: nonEmptyString(text),
    color,
    x: positiveInt(x),
    y: positiveInt(y),
  };
}

export function stillShape(
  shape: "rectangle" | "circle" | "line" | "star",
  color: ColorRole,
  x: number,
  y: number,
): PosterMark {
  return { kind: "shape", shape, color, x: positiveInt(x), y: positiveInt(y) };
}

export function stillPattern(
  pattern: "grid" | "dots" | "stripes" | "noise",
  color: ColorRole,
): PosterMark {
  return { kind: "pattern", pattern, color };
}
