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

function flattenComputedColors(source: HTMLElement, clone: HTMLElement) {
  const from = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
  const to = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
  const limit = Math.min(from.length, to.length);
  for (let i = 0; i < limit; i++) {
    const style = getComputedStyle(from[i]);
    to[i].style.color = style.color;
    to[i].style.backgroundColor = style.backgroundColor;
    if (style.backgroundImage && style.backgroundImage !== "none") {
      to[i].style.backgroundImage = style.backgroundImage;
    }
    to[i].style.borderColor = style.borderColor;
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
  if (!source) throw new Error("Invoice preview is not ready");
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
  const pageW = 210;
  const margin = 12;
  const maxW = pageW - margin * 2;
  const ratio = canvas.width / canvas.height;
  const drawW = maxW;
  const drawH = drawW / ratio;
  const pageH = drawH + margin * 2;
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: [pageW, pageH] });
  const img = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(img, "JPEG", margin, margin, drawW, drawH);
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
