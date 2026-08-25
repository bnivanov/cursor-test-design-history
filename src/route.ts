import type { MovementId } from "./brand.ts";
import { movementId } from "./brand.ts";
import { assertNever } from "./brand.ts";
import type { Catalog } from "./catalog.ts";
import { byId } from "./catalog.ts";
import type { Movement } from "./movement.ts";

export type Audience = "human" | "agent";

export type Route =
  | { readonly kind: "index"; readonly audience: Audience }
  | { readonly kind: "movement"; readonly movement: Movement; readonly audience: Audience };

export type ParseResult =
  | { readonly ok: true; readonly route: Route }
  | { readonly ok: false; readonly reason: "malformed" | "unknown-id" };

function parseAudience(raw: string | undefined): Audience | undefined {
  if (raw === "human" || raw === undefined || raw === "") {
    return "human";
  }
  if (raw === "agent") {
    return "agent";
  }
  return undefined;
}

export function parseRoute(hash: string, catalog: Catalog): ParseResult {
  const trimmed = hash.replace(/^#/, "").replace(/^\/+/, "");
  if (trimmed === "" || trimmed === "human") {
    return { ok: true, route: { kind: "index", audience: "human" } };
  }
  if (trimmed === "agent") {
    return { ok: true, route: { kind: "index", audience: "agent" } };
  }

  const parts = trimmed.split("/").filter((part) => part.length > 0);
  if (parts[0] !== "m" || parts[1] === undefined) {
    return { ok: false, reason: "malformed" };
  }

  let id: MovementId;
  try {
    id = movementId(parts[1]);
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const audience = parseAudience(parts[2]);
  if (audience === undefined || parts.length > 3) {
    return { ok: false, reason: "malformed" };
  }

  const movement = byId(catalog, id);
  if (movement === undefined) {
    return { ok: false, reason: "unknown-id" };
  }

  return { ok: true, route: { kind: "movement", movement, audience } };
}

export function href(route: Route): string {
  switch (route.kind) {
    case "index":
      return route.audience === "human" ? "#/" : "#/agent";
    case "movement":
      return `#/m/${route.movement.id}/${route.audience}`;
    default: {
      const _exhaustive: never = route;
      return assertNever(_exhaustive);
    }
  }
}

export function toggleAudience(route: Route): Route {
  const audience: Audience = route.audience === "human" ? "agent" : "human";
  switch (route.kind) {
    case "index":
      return { kind: "index", audience };
    case "movement":
      return { kind: "movement", movement: route.movement, audience };
    default: {
      const _exhaustive: never = route;
      return assertNever(_exhaustive);
    }
  }
}

export function openMovement(movement: Movement, audience: Audience): Route {
  return { kind: "movement", movement, audience };
}
