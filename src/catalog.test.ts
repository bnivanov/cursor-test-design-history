import { describe, expect, it } from "vitest";
import { compileCatalog, byId, catalogErrorMessage } from "./catalog.ts";
import { records } from "./records.ts";
import { movementId } from "./brand.ts";
import { parseRoute, href, toggleAudience } from "./route.ts";
import { agentRecipe } from "./movement.ts";
import { emitDistFiles } from "./emit.ts";
import { sceneSignature } from "./scene.ts";

describe("catalog", () => {
  it("seals twelve unique movements", () => {
    const compiled = compileCatalog(records);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) {
      return;
    }
    expect(compiled.catalog.inTimeOrder).toHaveLength(12);
    const ids = compiled.catalog.inTimeOrder.map((item) => item.id);
    expect(new Set(ids).size).toBe(12);
  });

  it("rejects a duplicate scene program", () => {
    const first = records[0];
    const second = records[1];
    const clone = { ...second, scene: first.scene };
    const compiled = compileCatalog([first, clone, ...records.slice(2)]);
    expect(compiled.ok).toBe(false);
    if (compiled.ok) {
      return;
    }
    expect(compiled.error.kind).toBe("duplicate-scene");
  });

  it("keeps recipe tokens identical to page tokens", () => {
    const compiled = compileCatalog(records);
    if (!compiled.ok) {
      throw new Error(catalogErrorMessage(compiled.error));
    }
    for (const movement of compiled.catalog.inTimeOrder) {
      expect(agentRecipe(movement).tokens).toBe(movement.language.tokens);
    }
  });

  it("round-trips audience without dropping the movement", () => {
    const compiled = compileCatalog(records);
    if (!compiled.ok) {
      throw new Error(catalogErrorMessage(compiled.error));
    }
    const movement = byId(compiled.catalog, movementId("flash"));
    expect(movement).toBeDefined();
    if (movement === undefined) {
      return;
    }
    const parsed = parseRoute(`#/m/${movement.id}/human`, compiled.catalog);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    const toggled = toggleAudience(parsed.route);
    expect(toggled.kind).toBe("movement");
    if (toggled.kind !== "movement") {
      return;
    }
    expect(toggled.movement).toBe(movement);
    expect(toggled.audience).toBe("agent");
    expect(href(toggled)).toBe(`#/m/${movement.id}/agent`);
  });

  it("emits matching counts", () => {
    const compiled = compileCatalog(records);
    if (!compiled.ok) {
      throw new Error(catalogErrorMessage(compiled.error));
    }
    const files = emitDistFiles(compiled.catalog);
    const json = JSON.parse(files["catalog.json"]) as { count: number };
    expect(json.count).toBe(12);
    expect(files["llms.txt"]).toContain("id: proto-web");
    expect(files["llms.txt"]).toContain("id: spatial-agentic");
  });

  it("gives every era a unique scene signature", () => {
    const signatures = records.map((item) => sceneSignature(item.scene));
    expect(new Set(signatures).size).toBe(records.length);
  });
});
