import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../lib/dashboard/component.js", import.meta.url), "utf8");
const view = readFileSync(new URL("../app/dashboard/view.tsx", import.meta.url), "utf8");
if (!/export class Component/.test(source)) throw new Error("Dashboard root logic is missing");
if (/new Function/.test(source) || /\beval\(/.test(source)) throw new Error("Dashboard logic still evaluates strings");
if (/addEventListener\('storage'|addEventListener\('focus'/.test(source)) throw new Error("focus/storage listeners remain");
if (/<sc-if|<sc-for|\{\{/.test(view)) throw new Error("Dashboard view still has dc-runtime markup");
if (/unpkg\.com\/react@18/.test(source + view)) throw new Error("React 18 unpkg dependency remains");
console.log("Dashboard root logic syntax passed");
