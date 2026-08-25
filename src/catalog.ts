import type { MovementId } from "./brand.ts";
import { compareSpans } from "./time.ts";
import { sceneSignature } from "./scene.ts";
import type { Movement } from "./movement.ts";

export type CatalogError =
  | { readonly kind: "too-few"; readonly count: number }
  | { readonly kind: "duplicate-id"; readonly id: MovementId }
  | { readonly kind: "unknown-answer"; readonly from: MovementId; readonly to: MovementId }
  | { readonly kind: "duplicate-scene"; readonly a: MovementId; readonly b: MovementId };

export type Catalog = {
  readonly __brand: "Catalog";
  readonly inTimeOrder: readonly [Movement, ...Movement[]];
};

export type CompileResult =
  | { readonly ok: true; readonly catalog: Catalog }
  | { readonly ok: false; readonly error: CatalogError };

export function compileCatalog(records: readonly Movement[]): CompileResult {
  if (records.length < 10) {
    return { ok: false, error: { kind: "too-few", count: records.length } };
  }

  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) {
      return { ok: false, error: { kind: "duplicate-id", id: record.id } };
    }
    seen.add(record.id);
  }

  for (const record of records) {
    for (const answer of record.answers) {
      if (!seen.has(answer)) {
        return {
          ok: false,
          error: { kind: "unknown-answer", from: record.id, to: answer },
        };
      }
    }
  }

  const signatures = new Map<string, MovementId>();
  for (const record of records) {
    const signature = sceneSignature(record.scene);
    const existing = signatures.get(signature);
    if (existing !== undefined) {
      return {
        ok: false,
        error: { kind: "duplicate-scene", a: existing, b: record.id },
      };
    }
    signatures.set(signature, record.id);
  }

  const sorted = [...records].sort((a, b) =>
    compareSpans(a.span, b.span, a.id, b.id),
  );
  const head = sorted[0];
  if (head === undefined) {
    return { ok: false, error: { kind: "too-few", count: 0 } };
  }

  const catalog: Catalog = {
    __brand: "Catalog",
    inTimeOrder: [head, ...sorted.slice(1)],
  };
  return { ok: true, catalog };
}

export function byId(catalog: Catalog, id: MovementId): Movement | undefined {
  return catalog.inTimeOrder.find((movement) => movement.id === id);
}

export function catalogErrorMessage(error: CatalogError): string {
  switch (error.kind) {
    case "too-few":
      return `catalog needs at least 10 movements, got ${error.count}`;
    case "duplicate-id":
      return `duplicate movement id: ${error.id}`;
    case "unknown-answer":
      return `${error.from} answers unknown id ${error.to}`;
    case "duplicate-scene":
      return `scene programs for ${error.a} and ${error.b} are identical`;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
