import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(new URL("../public/flow.dc.html", import.meta.url), "utf8");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error("Dashboard CSS is missing");
const css = `@import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800;900&display=swap");
html, body { margin: 0; padding: 0; height: 100%; }
${styleMatch[1].trim()}
`;

const scriptMatch = html.match(/<script\b[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error("Dashboard root logic is missing");

let logic = scriptMatch[1];
logic = logic.replace("class Component extends DCLogic {", `import { FlowStore } from "./flow-api";

export class Component {
  props = {};
  onState = null;
  setState(update) {
    const patch = typeof update === "function" ? update(this.state) : update;
    if (!patch) return;
    this.state = Object.assign({}, this.state, patch);
    if (typeof this.onState === "function") this.onState(this.state);
  }
`);

logic = logic.replace(
  /applyStore\(extra\) \{\n    const snap = typeof FlowStore !== 'undefined' && FlowStore\.dashboardSnapshot \? FlowStore\.dashboardSnapshot\(\) : \{\};/,
  `applyStore(extra) {
    const live = typeof FlowStore !== "undefined" && FlowStore.dashboardState ? FlowStore.dashboardState() : {};
    const snap = {
      txns: live.txns, invoices: live.invoices, periods: live.periods, figures: live.figures,
      invoiceTotals: live.invoiceTotals, ageing: live.ageing, usage: live.usage, matchRate: live.matchRate,
      history: live.history, branches: live.branches, gateways: live.gateways, bank: live.bank,
      links: live.links, linkClients: live.linkClients, linkInvoices: live.linkInvoices,
      matches: live.matches, autoMatches: live.autoMatches, reminderInvoices: live.reminderInvoices,
      attention: live.attention, scan: live.scan, sampleBills: live.sampleBills, clients: live.clients,
      exportHistory: live.exportHistory, syncLog: live.syncLog, zoho: live.zoho,
      checkoutPages: live.checkoutPages, plans: live.plans, subscribers: live.subscribers,
      upcomingCharges: live.upcomingCharges, shopify: live.shopify, smartCheckout: live.smartCheckout,
      sampleBanks: live.sampleBanks, banks: live.banks, merchantName: live.merchantName,
      ownerName: live.ownerName, accountantName: live.accountantName, acctName: live.acctName,
      acctEmail: live.acctEmail, profile: live.profile, plan: live.plan, showTax: live.showTax
    };`
);

logic = logic.replace(
  /bindStoreEvents\(\) \{[\s\S]*?\n  \}/,
  `bindStoreEvents() {
    return;
  }`
);

const xdc = html.match(/<x-dc>([\s\S]*)<\/x-dc>/);
if (!xdc) throw new Error("x-dc root is missing");
let markup = xdc[1].replace(/<helmet>[\s\S]*?<\/helmet>/, "").trim();

const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "wbr"]);
const ATTR = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  colspan: "colSpan",
  rowspan: "rowSpan",
  maxlength: "maxLength",
  readonly: "readOnly",
  novalidate: "noValidate",
  crossorigin: "crossOrigin",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-opacity": "strokeOpacity",
  "stroke-dasharray": "strokeDasharray",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "text-anchor": "textAnchor",
  "text-transform": "textTransform",
  "vector-effect": "vectorEffect",
  "accent-height": "accentHeight"
};

function expr(path, scope) {
  const rootName = path.split(".")[0];
  return scope.has(rootName) ? path : "v." + path;
}

function interp(raw, scope) {
  const trimmed = String(raw).trim();
  const only = trimmed.match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/);
  if (only) return expr(only[1], scope);
  if (!trimmed.includes("{{")) return JSON.stringify(raw);
  const out = String(raw).replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, path) => "${" + expr(path, scope) + "}");
  return "`" + out.replace(/`/g, "\\`") + "`";
}

function styleExpr(raw, scope) {
  const trimmed = String(raw).trim();
  const only = trimmed.match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/);
  if (only) return "sx(" + expr(only[1], scope) + ")";
  if (!trimmed.includes("{{")) return "sx(" + JSON.stringify(raw) + ")";
  const out = String(raw).replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, path) => "${" + expr(path, scope) + "}");
  return "sx(`" + out.replace(/`/g, "\\`") + "`)";
}

function parseAttrs(source) {
  const attrs = [];
  let i = 0;
  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i += 1;
    if (i >= source.length) break;
    let name = "";
    while (i < source.length && /[A-Za-z0-9:_-]/.test(source[i])) name += source[i++];
    if (!name) { i += 1; continue; }
    while (i < source.length && /\s/.test(source[i])) i += 1;
    if (source[i] === "=") {
      i += 1;
      while (i < source.length && /\s/.test(source[i])) i += 1;
      const q = source[i];
      if (q === '"' || q === "'") {
        i += 1;
        let value = "";
        while (i < source.length && source[i] !== q) value += source[i++];
        if (source[i] === q) i += 1;
        attrs.push({ name, value });
      } else {
        let value = "";
        while (i < source.length && !/\s/.test(source[i])) value += source[i++];
        attrs.push({ name, value });
      }
    } else {
      attrs.push({ name, value: true });
    }
  }
  return attrs;
}

function parseNodes(source, endTag) {
  const nodes = [];
  let i = 0;
  const closer = endTag ? "</" + endTag + ">" : null;
  while (i < source.length) {
    if (closer && source.startsWith(closer, i)) return { nodes, rest: source.slice(i + closer.length) };
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      i = end < 0 ? source.length : end + 3;
      continue;
    }
    if (source[i] === "<") {
      const end = source.indexOf(">", i);
      if (end < 0) break;
      const raw = source.slice(i + 1, end);
      if (raw.startsWith("/")) {
        return { nodes, rest: source.slice(end + 1) };
      }
      const selfClose = raw.endsWith("/");
      const body = selfClose ? raw.slice(0, -1).trim() : raw;
      const sp = body.search(/\s/);
      const tag = (sp < 0 ? body : body.slice(0, sp)).toLowerCase();
      const attrSource = sp < 0 ? "" : body.slice(sp);
      const attrs = parseAttrs(attrSource);
      i = end + 1;
      if (VOID.has(tag) || selfClose) {
        nodes.push({ type: "el", tag, attrs, children: [] });
        continue;
      }
      const inner = parseNodes(source.slice(i), tag);
      nodes.push({ type: "el", tag, attrs, children: inner.nodes });
      i = source.length - inner.rest.length;
      continue;
    }
    const next = source.indexOf("<", i);
    const text = source.slice(i, next < 0 ? source.length : next);
    if (text) nodes.push({ type: "text", text });
    if (next < 0) break;
    i = next;
  }
  return { nodes, rest: "" };
}

function emitText(text, scope) {
  if (!text) return "";
  if (!text.includes("{{")) {
    if (!text.trim()) return text.includes("\n") ? text : "";
    return text.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
  }
  return text.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, path) => "{" + expr(path, scope) + "}");
}

function jsxName(name) {
  return ATTR[name] || name;
}

function emitAttrs(attrs, scope, tag) {
  const special = {};
  const rest = [];
  for (const attr of attrs) {
    if (attr.name === "hint-placeholder-count") continue;
    if (attr.name === "style-hover") { special.hover = attr.value; continue; }
    if (attr.name === "style-active") { special.active = attr.value; continue; }
    if (attr.name === "style-focus") { special.focus = attr.value; continue; }
    if (attr.name === "style") { special.style = attr.value; continue; }
    if (attr.value === true) {
      rest.push(jsxName(attr.name) + "={true}");
      continue;
    }
    if (attr.value === "false" && (attr.name === "draggable" || attr.name === "checked" || attr.name === "disabled")) {
      rest.push(jsxName(attr.name) + "={false}");
      continue;
    }
    if (attr.value === "true" && (attr.name === "draggable" || attr.name === "checked" || attr.name === "disabled")) {
      rest.push(jsxName(attr.name) + "={true}");
      continue;
    }
    if ((attr.name === "rows" || attr.name === "cols" || attr.name === "tabindex") && /^\d+$/.test(String(attr.value))) {
      rest.push(jsxName(attr.name) + "={" + Number(attr.value) + "}");
      continue;
    }
    const only = String(attr.value).trim().match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/);
    if (only) rest.push(jsxName(attr.name) + "={" + expr(only[1], scope) + "}");
    else if (String(attr.value).includes("{{")) rest.push(jsxName(attr.name) + "={" + interp(attr.value, scope) + "}");
    else rest.push(jsxName(attr.name) + "=" + JSON.stringify(attr.value));
  }
  const hoverable = special.hover != null || special.active != null || special.focus != null;
  if (special.style != null) {
    rest.unshift((hoverable ? "style" : "style") + "={" + styleExpr(special.style, scope) + "}");
  }
  if (special.hover != null) rest.push("hoverStyle={" + styleExpr(special.hover, scope) + "}");
  if (special.active != null) rest.push("activeStyle={" + styleExpr(special.active, scope) + "}");
  if (special.focus != null) rest.push("focusStyle={" + styleExpr(special.focus, scope) + "}");
  return { rest, hoverable, tag };
}

let keySeq = 0;
function emitNodes(nodes, scope, indent) {
  let out = "";
  for (const node of nodes) {
    if (node.type === "text") {
      out += emitText(node.text, scope);
      continue;
    }
    if (node.tag === "sc-if") {
      const value = node.attrs.find(a => a.name === "value");
      const cond = value && String(value.value).trim().match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/);
      const pred = cond ? expr(cond[1], scope) : "false";
      const inner = emitNodes(node.children, scope, indent + "  ").trim();
      out += `{!!(${pred}) && (<>${inner ? "\n" + indent + "  " + inner + "\n" + indent : ""}</>)}`;
      continue;
    }
    if (node.tag === "sc-for") {
      const list = node.attrs.find(a => a.name === "list");
      const as = node.attrs.find(a => a.name === "as");
      const listPath = list && String(list.value).trim().match(/^\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}$/);
      const alias = as ? String(as.value) : "item";
      const src = listPath ? expr(listPath[1], scope) : "[]";
      const next = new Set(scope);
      next.add(alias);
      const idx = alias + "Idx";
      const inner = emitNodes(node.children, next, indent + "  ").trim();
      out += `{((${src}) || []).map((${alias}: any, ${idx}: any) => <Fragment key={${alias}?.id || ${alias}?.key || '${alias}-' + ${idx}}>${inner ? "\n" + indent + "  " + inner + "\n" + indent : ""}</Fragment>)}`;
      continue;
    }
    const { rest, hoverable } = emitAttrs(node.attrs, scope, node.tag);
    const tag = hoverable ? "Hoverable" : node.tag;
    if (hoverable) rest.unshift('as="' + node.tag + '"');
    const attrStr = rest.length ? " " + rest.join(" ") : "";
    const inner = emitNodes(node.children, scope, indent + "  ");
    if (!inner.trim()) {
      out += `<${tag}${attrStr} />`;
    } else {
      out += `<${tag}${attrStr}>${inner}</${tag}>`;
    }
  }
  return out;
}

const parsed = parseNodes(markup);
const jsx = emitNodes(parsed.nodes, new Set(), "    ");

const view = `"use client";
// @ts-nocheck — mechanical port of the dc-runtime template.

import { Fragment } from "react";
import { Hoverable, sx } from "./chrome";

export function DashboardView({ v }: { v: Record<string, any> }) {
  return (
    <>
${jsx}
    </>
  );
}
`;

function write(rel, contents) {
  const path = root + "/" + rel;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  console.log("wrote " + rel + " (" + contents.length + " bytes)");
}

write("app/dashboard/dashboard.css", css);
write("lib/dashboard/component.js", logic.trim() + "\n");
write("app/dashboard/view.tsx", view);
console.log("port complete");
