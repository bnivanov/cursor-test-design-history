import { defineConfig, type Plugin } from "vite";
import { catalogErrorMessage, compileCatalog } from "./src/catalog.ts";
import { emitDistFiles } from "./src/emit.ts";
import { records } from "./src/records.ts";

function catalogPlugin(): Plugin {
  return {
    name: "catalog-emit",
    generateBundle() {
      const compiled = compileCatalog(records);
      if (!compiled.ok) {
        throw new Error(catalogErrorMessage(compiled.error));
      }
      const files = emitDistFiles(compiled.catalog);
      this.emitFile({
        type: "asset",
        fileName: "catalog.json",
        source: files["catalog.json"],
      });
      this.emitFile({
        type: "asset",
        fileName: "llms.txt",
        source: files["llms.txt"],
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [catalogPlugin()],
});
