import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";
import { resetStore } from "../lib/data/store.ts";
import { dashboardState } from "../lib/data/view.ts";

resetStore();
const body = "window.FLOW_DATA = " + JSON.stringify(dashboardState()) + ";\n";
writeFileSync(new URL("../public/flow-data.js", import.meta.url), body);

buildSync({
  absWorkingDir: fileURLToPath(new URL("..", import.meta.url)),
  entryPoints: ["lib/data/browser.ts"],
  bundle: true,
  format: "iife",
  globalName: "FlowStore",
  outfile: "public/flow-store.js",
  platform: "browser",
  target: ["es2022"],
  logLevel: "warning"
});
