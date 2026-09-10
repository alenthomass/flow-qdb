"use client";

import { useState, type CSSProperties, type ComponentPropsWithoutRef, type ElementType, type FocusEvent, type MouseEvent, type ReactNode } from "react";

function camelAttr(name: string): string {
  if (name.startsWith("--")) return name;
  if (name.startsWith("-webkit-")) return "Webkit" + name.slice(8).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  if (name.startsWith("-moz-")) return "Moz" + name.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  return name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function sx(css: string | CSSProperties | null | undefined): CSSProperties | undefined {
  if (!css) return undefined;
  if (typeof css === "object") return css;
  const out: Record<string, string> = {};
  String(css).split(";").forEach(part => {
    const i = part.indexOf(":");
    if (i < 0) return;
    const key = camelAttr(part.slice(0, i).trim());
    const value = part.slice(i + 1).trim();
    if (key && value) out[key] = value;
  });
  return out as CSSProperties;
}

function mergeHoverableStyle(
  style: string | CSSProperties | null | undefined,
  hoverStyle: string | CSSProperties | null | undefined,
  activeStyle: string | CSSProperties | null | undefined,
  focusStyle: string | CSSProperties | null | undefined,
  hover: boolean,
  active: boolean,
  focus: boolean
): CSSProperties | undefined {
  const base = sx(style) || {};
  const hoverS = sx(hoverStyle) || {};
  const activeS = sx(activeStyle) || {};
  const focusS = sx(focusStyle) || {};
  const merged: Record<string, string | number> = { ...base };
  Object.keys(hoverS).concat(Object.keys(activeS), Object.keys(focusS)).forEach(key => {
    if (!(key in base)) merged[key] = "";
  });
  if (hover) Object.assign(merged, hoverS);
  if (active) Object.assign(merged, activeS);
  if (focus) Object.assign(merged, focusS);
  return merged as CSSProperties;
}

type HoverableProps<T extends ElementType> = {
  as?: T;
  style?: string | CSSProperties;
  hoverStyle?: string | CSSProperties;
  activeStyle?: string | CSSProperties;
  focusStyle?: string | CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "style" | "as">;

export function Hoverable<T extends ElementType = "button">({
  as,
  style,
  hoverStyle,
  activeStyle,
  focusStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: HoverableProps<T>) {
  const Tag = (as || "button") as ElementType;
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);
  const merged = mergeHoverableStyle(style, hoverStyle, activeStyle, focusStyle, hover, active, focus);
  return (
    <Tag
      style={merged}
      onMouseEnter={(event: MouseEvent) => { setHover(true); onMouseEnter?.(event); }}
      onMouseLeave={(event: MouseEvent) => { setHover(false); setActive(false); onMouseLeave?.(event); }}
      onMouseDown={(event: MouseEvent) => { setActive(true); onMouseDown?.(event); }}
      onMouseUp={(event: MouseEvent) => { setActive(false); onMouseUp?.(event); }}
      onFocus={(event: FocusEvent) => { setFocus(true); onFocus?.(event); }}
      onBlur={(event: FocusEvent) => { setFocus(false); onBlur?.(event); }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
