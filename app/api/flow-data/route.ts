import { dashboardState } from "@/lib/data/view";

export function GET() {
  const body = "window.FLOW_DATA = " + JSON.stringify(dashboardState()) + ";";
  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
