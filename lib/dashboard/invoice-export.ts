export const INVOICE_DOC_SELECTOR = ".flow-invoice-doc";
const PRINT_ROOT_ID = "flow-invoice-print-root";
const A4_WIDTH_PX = 794;

export function invoicePdfFilename(number?: string, client?: string): string {
  return sanitizePart(number || "invoice") + "-" + sanitizePart(client || "client") + ".pdf";
}

function sanitizePart(raw: string): string {
  const cleaned = String(raw || "")
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || "invoice";
}

function invoiceDoc(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector(INVOICE_DOC_SELECTOR);
}

const HTML2CANVAS_COLOR_PROPS = [
  "color",
  "backgroundColor",
  "backgroundImage",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor"
] as const;

const SRGB_COLOR_RE = /color\(\s*(?:srgb|display-p3)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)/gi;

function srgbToCss(r: number, g: number, b: number, a: number): string {
  const rr = Math.max(0, Math.min(255, Math.round(r * 255)));
  const gg = Math.max(0, Math.min(255, Math.round(g * 255)));
  const bb = Math.max(0, Math.min(255, Math.round(b * 255)));
  if (!(a < 1)) return "rgb(" + rr + ", " + gg + ", " + bb + ")";
  return "rgba(" + rr + ", " + gg + ", " + bb + ", " + a + ")";
}

function html2canvasSafeColor(value: string): string {
  if (!value || value.indexOf("color(") === -1) return value;
  return value.replace(SRGB_COLOR_RE, (_m, r, g, b, a) =>
    srgbToCss(parseFloat(r), parseFloat(g), parseFloat(b), a == null || a === "" ? 1 : parseFloat(a))
  );
}

function flattenComputedColors(source: HTMLElement, clone: HTMLElement) {
  const from = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
  const to = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
  const limit = Math.min(from.length, to.length);
  for (let i = 0; i < limit; i++) {
    const style = getComputedStyle(from[i]);
    for (const prop of HTML2CANVAS_COLOR_PROPS) {
      const raw = style[prop];
      if (!raw || raw === "none") continue;
      to[i].style[prop] = html2canvasSafeColor(raw);
    }
    to[i].style.boxShadow = "none";
    to[i].style.animation = "none";
  }
  clone.querySelectorAll(".flow-invoice-glow").forEach(node => node.remove());
  clone.style.backgroundColor = clone.style.backgroundColor && clone.style.backgroundColor !== "rgba(0, 0, 0, 0)"
    ? clone.style.backgroundColor
    : "#ffffff";
  clone.style.borderRadius = "0";
  clone.style.boxShadow = "none";
  clone.style.marginTop = "0";
  clone.style.minHeight = "0";
  clone.style.height = "auto";
  clone.style.aspectRatio = "auto";
  clone.style.overflow = "visible";
}

function prepareExportClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".flow-invoice-glow").forEach(node => node.remove());
  clone.style.width = A4_WIDTH_PX + "px";
  clone.style.maxWidth = A4_WIDTH_PX + "px";
  clone.style.marginTop = "0";
  clone.style.boxShadow = "none";
  clone.style.borderRadius = "0";
  clone.style.minHeight = "0";
  clone.style.height = "auto";
  clone.style.aspectRatio = "auto";
  clone.style.overflow = "visible";
  return clone;
}

async function withExportClone<T>(source: HTMLElement, run: (node: HTMLElement) => Promise<T>): Promise<T> {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:-12000px",
    "top:0",
    "width:" + A4_WIDTH_PX + "px",
    "background:#fff",
    "pointer-events:none",
    "z-index:-1"
  ].join(";");
  const clone = prepareExportClone(source);
  host.appendChild(clone);
  document.body.appendChild(host);
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return await run(clone);
  } finally {
    host.remove();
  }
}

export async function downloadInvoicePdf(number?: string, client?: string, node?: HTMLElement | null): Promise<string> {
  const source = node || invoiceDoc();
  if (!source) throw new Error("Document preview is not ready");
  const filename = invoicePdfFilename(number, client);
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf")
  ]);
  const canvas = await withExportClone(source, clone => html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: A4_WIDTH_PX,
    windowWidth: A4_WIDTH_PX,
    onclone(_document, cloned) {
      flattenComputedColors(clone, cloned);
    }
  }));
  if (!canvas.width || !canvas.height) throw new Error("Could not render invoice to PDF");
  // True A4 page (210mm x 297mm): short invoices get normal blank space below the
  // content, like a real printed page. Content taller than one page's content area
  // spills onto additional A4 pages instead of being squeezed or cut off.
  const pageW = 210;
  const pageH = 297;
  const margin = 12;
  const drawW = pageW - margin * 2;
  const contentH = pageH - margin * 2;
  const ratio = canvas.width / canvas.height;
  const totalDrawH = drawW / ratio;
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  if (totalDrawH <= contentH) {
    pdf.addImage(img, "JPEG", margin, margin, drawW, totalDrawH);
  } else {
    const maxPages = 50;
    let renderedH = 0;
    let page = 0;
    while (renderedH < totalDrawH && page < maxPages) {
      if (page > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", margin, margin - renderedH, drawW, totalDrawH);
      renderedH += contentH;
      page++;
    }
  }
  const blob = pdf.output("blob");
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(href);
  }, 500);
  return filename;
}

export function printInvoicePreview() {
  const source = invoiceDoc();
  if (!source || typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("Invoice preview is not ready");
  }
  let root = document.getElementById(PRINT_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = PRINT_ROOT_ID;
    document.body.appendChild(root);
  }
  const clone = prepareExportClone(source);
  clone.style.width = "210mm";
  clone.style.maxWidth = "210mm";
  root.replaceChildren(clone);
  document.documentElement.classList.add("flow-printing");
  const cleanup = () => {
    document.documentElement.classList.remove("flow-printing");
    root.replaceChildren();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
}
