import type { ReactNode } from "react";
import "./pay.css";

export const metadata = { title: "Pay · Flow" };

export default function PayLayout({ children }: { children: ReactNode }) {
  return <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <div className="shell"><div className="wash" /><div className="pattern" /><div className="page"><div className="stage">{children}</div></div></div>
  </>;
}
