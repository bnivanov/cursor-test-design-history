import { catalogErrorMessage, compileCatalog, type Catalog } from "./catalog.ts";
import { records } from "./records.ts";

const compiled = compileCatalog(records);
if (!compiled.ok) {
  throw new Error(catalogErrorMessage(compiled.error));
}

export const catalog: Catalog = compiled.catalog;
