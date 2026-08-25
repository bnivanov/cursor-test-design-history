import { defineConfig } from "vite";
import config from "./vite.config.ts";

export default defineConfig({
  ...config,
  test: {
    environment: "node",
  },
});
