import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const html = readFileSync(new URL("../public/flow.dc.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/g)];
if (!scripts.length) throw new Error("Dashboard root logic is missing");
for (const [, source] of scripts) {
  new Script(source, { filename: "public/flow.dc.html root logic" });
}
console.log("Dashboard root logic syntax passed");
