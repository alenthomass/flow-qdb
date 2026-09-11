"use client";
// @ts-nocheck — mechanical port of the dc-runtime template.

import { Fragment } from "react";
import { Hoverable, Presence, sx } from "./chrome";
import { InvoicePreview } from "./invoice-preview";
import { LinkCreateForm } from "./link-create";

function choiceCard(on: boolean) {
  return sx("display:flex; align-items:flex-start; gap:11px; text-align:left; padding:13px 14px; border-radius:12px; border:none; outline:none; background:" + (on ? "var(--bar-solid)" : "var(--panel-2)") + "; box-shadow:none; transition:background .15s ease");
}
const choiceHover = sx("background:var(--bar-solid)");
const fieldChip = "flex:0 0 auto; font-size:11px; font-weight:700; color:var(--ink-3); padding:3px 7px; border-radius:6px; background:var(--chip)";

export function DashboardView({ v }: { v: Record<string, any> }) {
  return (
    <>
<div style={sx("display:flex; height:100vh; overflow:hidden; position:relative; font-family:'Urbanist','Cairo',system-ui,sans-serif; color:var(--ink); background:var(--canvas); -webkit-font-smoothing:antialiased")} data-theme={v.theme}>

  {!!(v.mob.off) && (<>
        <aside style={sx(v.sty.aside)} onMouseEnter={v.h.railOpen} onMouseLeave={v.h.railClose}>
    <div style={sx(v.sty.railHead)}>
      <div style={sx(v.sty.logoTile)}>
        <svg width={v.sty.logoIcon} height={v.sty.logoIcon} viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M3 8h6.5M3 11.5h4" stroke="var(--on-accent)" strokeWidth="1.9" strokeLinecap="round" /></svg>
      </div>
      {!!(v.railOn) && (<>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:21px; font-weight:600; letter-spacing:-.03em; white-space:nowrap")}>Flow</div>
            </>)}
      <span style={sx("position:relative; display:inline-flex")} onMouseEnter={v.sandboxTipOn} onMouseLeave={v.sandboxTipOff}>
        <div style={sx(v.sty.railChip)} title="Simulated gateway. Live payment processing pending Qatar commercial registration.">{v.envLabel}</div>
        {!!(v.sandboxTip) && (<>
                <span style={sx("position:absolute; top:calc(100% + 8px); right:0; width:220px; background:var(--bar-solid); border:1px solid var(--line); border-radius:9px; box-shadow:0 20px 40px -20px rgba(0,0,0,.5); padding:10px 12px; font-size:11.5px; font-weight:500; color:var(--ink-3); line-height:1.5; text-transform:none; letter-spacing:normal; z-index:30")}>Simulated gateway. Live payment processing pending Qatar commercial registration.</span>
              </>)}
      </span>
    </div>

    <nav style={sx(v.sty.navWrap)}>
      {((v.navGroups) || []).map((g: any, gIdx: any) => <Fragment key={g?.id || g?.key || 'g-' + gIdx}>
              <div style={sx(g.wrap)}>
        <div style={sx(g.headStyle)}>{g.label}</div>
        <div style={sx(g.ruleStyle)} />
      {((g.items) || []).map((n: any, nIdx: any) => <Fragment key={n?.id || n?.key || 'n-' + nIdx}>
                  <Hoverable as="button" style={sx(n.style)} onClick={n.go} onMouseEnter={n.enter} onMouseLeave={n.leave} aria-label={n.label} title={n.label} hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}>
          <span style={sx(n.tile)}>
            <svg width={n.iconSize} height={n.iconSize} viewBox="0 0 20 20" fill="none">
              <path d={n.d} stroke={n.ic} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={sx(n.labelStyle)}>{n.label}</span>
          {!!(n.badge) && (<>
                      <span style={sx("font-size:10.5px; font-weight:700; background:var(--accent); color:var(--on-accent); min-width:18px; height:18px; padding:0 5px; border-radius:9px; display:flex; align-items:center; justify-content:center")}>{n.badge}</span>
                    </>)}
        </Hoverable>
                </Fragment>)}
      </div>
            </Fragment>)}
    </nav>

    <div style={sx(v.sty.railPlan)}>
      <div style={sx("background:linear-gradient(170deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:12px")}>
        <div style={sx("font-size:11.5px; font-weight:700; letter-spacing:.04em; color:var(--ink-4)")}>FLOW PLAN</div>
        <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em; margin-top:4px")}>{v.plan.line}</div>
        <div style={sx("height:5px; background:var(--dash); border-radius:3px; margin:9px 0 6px; overflow:hidden")}>
          <div style={sx(`height:100%; width:${v.usage.pct}; background:linear-gradient(90deg,var(--accent),var(--accent-2)); border-radius:3px`)} />
        </div>
        <div style={sx("font-size:11px; color:var(--ink-3)")}>{v.usage.label}</div>
      </div>
    </div>
  </aside>
      </>)}

  <Presence show={!!v.flyout.show} kind="menu">
        <div className="flow-open-menu" style={sx(v.flyout.style)} onMouseEnter={v.flyout.keep} onMouseLeave={v.flyout.close}>
      <div style={sx("padding:16px 18px 12px; font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5); border-bottom:1px solid var(--divider-2)")}>{v.flyout.title}</div>
      <div style={sx("padding:8px")}>
        {((v.flyout.rows) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
              <Hoverable as="button" style={sx(r.style)} onClick={r.go} hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}>
            <svg style={sx("flex:0 0 19px")} width="19" height="19" viewBox="0 0 20 20" fill="none"><path d={r.d} stroke={r.ic} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={sx("flex:1; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{r.short}</span>
          </Hoverable>
            </Fragment>)}
      </div>
    </div>
      </Presence>

  <main style={sx(v.sty.main)}>
    <header style={sx(v.sty.headerBar)}>
      <div style={sx(v.sty.header)}>
      {!!(v.head.show) && (<>
              <div style={sx("min-width:0")}>
          <h1 style={sx("margin:0; font-family:'Urbanist','Cairo',sans-serif; font-size:24px; font-weight:600; letter-spacing:-.03em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{v.head.title}</h1>
          <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:1px")}>{v.head.sub}</div>
        </div>
            </>)}
      <div style={sx("flex:1")} />
      {!!(v.mob.on) && (<>
              <button style={sx("display:flex; align-items:center; gap:9px; flex:1; min-width:0; text-align:left")} onClick={v.h.goHome}>
          <div style={sx("width:30px; height:30px; border-radius:10px; background:var(--ink-block); display:flex; align-items:center; justify-content:center; flex:0 0 30px")}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M3 8h6.5M3 11.5h4" stroke="var(--on-block)" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <div style={sx("min-width:0")}>
            <div style={sx("font-size:15px; font-weight:700; letter-spacing:-.02em")}>Flow</div>
            <div style={sx("font-size:10.5px; color:var(--ink-4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Overview</div>
          </div>
        </button>
        <button style={sx("width:38px; height:38px; border-radius:10px; border:1px solid var(--line); background:var(--glass); display:flex; align-items:center; justify-content:center; flex:0 0 38px")} onClick={v.h.openSearch} aria-label="Search">
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><circle cx="6.2" cy="6.2" r="4.2" stroke="var(--ink-3)" strokeWidth="1.5" /><path d="M9.4 9.4 12 12" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
            </>)}
      {!!(v.mob.off) && (<>
              <Hoverable as="button" style={sx("display:flex; align-items:center; gap:9px; background:var(--btn-light); border:1px solid var(--line); border-radius:10px; padding:10px 12px; width:272px; backdrop-filter:blur(10px); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.openSearch} hoverStyle={sx("background:var(--panel-3)")}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6.2" cy="6.2" r="4.2" stroke="var(--ink-4)" strokeWidth="1.5" /><path d="M9.4 9.4 12 12" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <span style={sx("flex:1; min-width:0; font-size:12.5px; color:var(--ink-4); text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>Search payments, invoices…</span>
      </Hoverable>
            </>)}
      <Hoverable as="button" style={sx("width:38px; height:38px; border-radius:10px; border:1px solid var(--line); background:var(--glass); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; transition:background-color .2s ease, border-color .2s ease, filter .18s ease")} onClick={v.h.toggleTheme} hoverStyle={sx("background:var(--panel-3)")}>
        {!!(v.isDark) && (<>
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.6" stroke="var(--accent)" strokeWidth="1.6" /><path d="M10 1.8v2.4M10 15.8v2.4M18.2 10h-2.4M4.2 10H1.8M15.8 4.2l-1.7 1.7M5.9 14.1l-1.7 1.7M15.8 15.8l-1.7-1.7M5.9 5.9 4.2 4.2" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </>)}
        {!!(v.isLight) && (<>
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1Z" stroke="var(--ink-3)" strokeWidth="1.6" strokeLinejoin="round" /></svg>
              </>)}
      </Hoverable>
      <div style={sx("position:relative")}>
        <Hoverable as="button" style={sx("width:36px; height:36px; border-radius:10px; background:var(--btn-dark); color:var(--on-block); font-size:12.5px; font-weight:700; display:flex; align-items:center; justify-content:center; border:1px solid var(--line); box-shadow:0 8px 18px -12px rgba(0,0,0,.55); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} data-user-menu="1" onClick={v.h.toggleUser} hoverStyle={sx("filter:brightness(1.14)")}>{v.me.initials}</Hoverable>
        <Presence show={!!v.userMenu} kind="menu">
                <div style={sx("position:fixed; inset:0; z-index:40")} onClick={v.h.closeUser} />
          <div className="flow-open-menu" style={sx("position:absolute; top:46px; right:0; z-index:41; width:min(288px, calc(100vw - 24px)); background:var(--bar-solid); border:1px solid var(--line); border-radius:11px; box-shadow:0 30px 60px -30px rgba(0,0,0,.55); overflow:hidden")} data-user-menu="1">
            <div style={sx("padding:18px 18px 16px; display:flex; align-items:center; gap:12px")}>
              <div style={sx("width:44px; height:44px; flex:0 0 44px; border-radius:13px; background:var(--btn-dark); color:var(--on-block); font-size:14px; font-weight:700; display:flex; align-items:center; justify-content:center")}>{v.me.initials}</div>
              <div style={sx("min-width:0")}>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{v.me.name}</div>
                <div style={sx("font-size:11.5px; color:var(--ink-4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{v.me.email}</div>
              </div>
            </div>
            <div style={sx("padding:0 18px 16px; display:flex; flex-wrap:wrap; gap:7px")}>
              <span style={sx("font-size:10.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); border:1px solid transparent; padding:4px 9px; border-radius:6px")}>{v.me.role}</span>
              <span style={sx("font-size:10.5px; font-weight:650; color:var(--ink-2); background:var(--chip); border:1px solid var(--line); padding:4px 9px; border-radius:6px")}>{v.me.plan}</span>
            </div>
            <div style={sx("padding:14px 18px; border-top:1px solid var(--divider-2); display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
              <div><div style={sx("font-size:10.5px; font-weight:600; color:var(--ink-4); letter-spacing:.04em; text-transform:uppercase")}>Business</div><div style={sx("font-size:12.5px; font-weight:600; margin-top:3px")}>{v.me.business}</div></div>
              <div><div style={sx("font-size:10.5px; font-weight:600; color:var(--ink-4); letter-spacing:.04em; text-transform:uppercase")}>Branch</div><div style={sx("font-size:12.5px; font-weight:600; margin-top:3px")}>{v.me.branch}</div></div>
              <div><div style={sx("font-size:10.5px; font-weight:600; color:var(--ink-4); letter-spacing:.04em; text-transform:uppercase")}>Approval limit</div><div style={sx("font-size:12.5px; font-weight:600; margin-top:3px")}>{v.me.limit}</div></div>
              <div><div style={sx("font-size:10.5px; font-weight:600; color:var(--ink-4); letter-spacing:.04em; text-transform:uppercase")}>Last sign-in</div><div style={sx("font-size:12.5px; font-weight:600; margin-top:3px")}>{v.me.lastLogin}</div></div>
            </div>
            <div style={sx("border-top:1px solid var(--divider-2); padding:8px")}>
              {((v.me.links) || []).map((ml: any, mlIdx: any) => <Fragment key={ml?.id || ml?.key || 'ml-' + mlIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:10px; text-align:left; font-size:12.5px; font-weight:600; color:var(--ink-2); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={ml.go} hoverStyle={sx("background:var(--panel-3)")}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d={ml.d} stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {ml.label}
                </Hoverable>
                    </Fragment>)}
            </div>
            <div style={sx("border-top:1px solid var(--divider-2); padding:8px")}>
              <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:10px; padding:9px 11px; border-radius:10px; text-align:left; font-size:12.5px; font-weight:600; color:var(--ink-3); transition:background .15s ease, color .15s ease")} onClick={v.h.signOut} hoverStyle={sx("background:var(--neg-soft); color:var(--neg)")}>
                <svg style={sx("flex:0 0 15px")} width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M12.4 5.6V4.2a1.4 1.4 0 0 0-1.4-1.4H4.6a1.4 1.4 0 0 0-1.4 1.4v11.6a1.4 1.4 0 0 0 1.4 1.4H11a1.4 1.4 0 0 0 1.4-1.4v-1.4M8.4 10h8.4m0 0-2.6-2.6M16.8 10l-2.6 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Sign out
              </Hoverable>
            </div>
          </div>
              </Presence>
      </div>
      </div>
    </header>

    {!!(v.tabs.show) && (<>
          <div style={sx(v.sty.tabbarWrap)}>
      <div style={sx(v.sty.tabbar)}>
        {((v.tabs.items) || []).map((tb: any, tbIdx: any) => <Fragment key={tb?.id || tb?.key || 'tb-' + tbIdx}>
                <Hoverable as="button" style={sx(tb.style)} onClick={tb.go} hoverStyle={sx("color:var(--ink)")}>
            {!!(tb.hasIcon) && (<>
                    <svg style={sx("flex:0 0 15px")} width="15" height="15" viewBox="0 0 20 20" fill="none"><path d={tb.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </>)}
            <span>{tb.label}</span>
          </Hoverable>
              </Fragment>)}
      </div>
      </div>
        </>)}

    <div style={sx(v.sty.content)}>
      <div key={v.areaKey} className="flow-area" style={sx(v.sty.contentInner)}>

        {!!(v.head.inPage) && (<>
              <div style={sx("margin-bottom:26px")}>
            <h1 style={sx("margin:0; font-size:27px; font-weight:700; letter-spacing:-.03em")}>{v.head.title}</h1>
            <div style={sx("font-size:13.5px; color:var(--ink-3); margin-top:5px")}>{v.head.sub}</div>
          </div>
            </>)}


        {!!(v.detail.on) && (<>
              <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-bottom:22px; padding:2px 0; background:transparent; border:none; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-4); transition:color .16s ease")} onClick={v.h.back} hoverStyle={sx("color:var(--ink)")}>
            <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.2 7H3.2M6.6 3.4 3 7l3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>Back</span>
          </Hoverable>
            </>)}

        {!!(v.backNav.show) && (<>
              <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-bottom:22px; padding:2px 0; background:transparent; border:none; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-4); transition:color .16s ease")} onClick={v.backNav.go} hoverStyle={sx("color:var(--ink)")}>
            <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.2 7H3.2M6.6 3.4 3 7l3.6 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{v.backNav.label}</span>
          </Hoverable>
            </>)}

        {!!(v.hub.show) && (<>
              {!!(v.smart.overview) && (<>
                <div style={sx("max-width:1080px; margin-bottom:16px")}>
          <div style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:16px 20px; text-align:left; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:none; border-radius:11px; box-shadow:var(--shadow-card)")}>
            <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Automatic Checkout</span>
            <span style={sx("font-size:12.5px; color:var(--ink-4)")}>Runs on its own, optimising for your customers</span>
            <span style={sx("margin-left:auto")} />
            <button style={sx(v.smart.Track)} onClick={v.smart.toggle}><span style={sx(v.smart.Knob)} /></button>
          </div>
          <div className={v.smart.on ? "flow-smart-drop is-open" : "flow-smart-drop"}>
            <div className="flow-smart-drop-inner">
                    <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start; padding-top:14px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:none; border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Payment methods, best first</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:5px")}>We show each customer the method they're most likely to use.</div>
                <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:16px")}>
                  <div style={sx("display:flex; align-items:center; gap:12px; border:1px solid var(--line); border-radius:12px; padding:13px 14px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; color:var(--ink-5)")}>01</span><span style={sx("font-size:13.5px; font-weight:600; flex:1")}>Apple Pay</span></div>
                  <div style={sx("display:flex; align-items:center; gap:12px; border:1px solid var(--line); border-radius:12px; padding:13px 14px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; color:var(--ink-5)")}>02</span><span style={sx("font-size:13.5px; font-weight:600; flex:1")}>Debit / credit card</span></div>
                  <div style={sx("display:flex; align-items:center; gap:12px; border:1px solid var(--line); border-radius:12px; padding:13px 14px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; color:var(--ink-5)")}>03</span><span style={sx("font-size:13.5px; font-weight:600; flex:1")}>Google Pay</span></div>
                </div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Detect wallets automatically</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Show Apple Pay / Google Pay only when available</div></div>
                    <button style={sx(v.tgs.walletDetect.Track)} onClick={v.tgs.walletDetect.go}><span style={sx(v.tgs.walletDetect.Knob)} /></button>
                  </div>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Retry after a decline</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Offer another method without leaving the page</div></div>
                    <button style={sx(v.tgs.retry.Track)} onClick={v.tgs.retry.go}><span style={sx(v.tgs.retry.Knob)} /></button>
                  </div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:none; border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Where people drop off</div>
                <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:18px")}>
                  {((v.smart.steps) || []).map((st: any, stIdx: any) => <Fragment key={st?.id || st?.key || 'st-' + stIdx}>
                            <div><div style={sx("display:flex; justify-content:space-between; font-size:12.5px; font-weight:600")}><span>{st.label}</span><span style={sx("color:var(--ink-4)")}>{st.pct}</span></div><div style={sx("height:9px; background:var(--divider); border-radius:5px; margin-top:6px")}><div style={sx(`height:9px; width:${st.bar}; background:var(--ink-2); border-radius:5px`)} /></div></div>
                          </Fragment>)}
                </div>
                <div style={sx("margin-top:18px; background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:13px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>{v.smart.note}</div>
              </div>
            </div>
            </div>
          </div>
          </div>
              </>)}
          <div style={sx("max-width:1080px; display:grid; grid-template-columns:repeat(auto-fit,minmax(272px,1fr)); gap:14px")}>
            {((v.hub.cards) || []).map((c: any, cIdx: any) => <Fragment key={c?.id || c?.key || 'c-' + cIdx}>
                  <Hoverable as="button" style={sx("position:relative; overflow:hidden; display:flex; flex-direction:column; align-items:flex-start; text-align:left; padding:22px 22px 20px; border-radius:11px; background:radial-gradient(340px 200px at 100% 0%, var(--accent-soft) 0%, rgba(0,0,0,0) 62%), linear-gradient(168deg, var(--surface) 0%, var(--surface-2) 100%); border:none; box-shadow:var(--shadow-card); transition:transform .2s cubic-bezier(.32,.72,0,1), box-shadow .2s ease")} onClick={c.go} hoverStyle={sx("transform:translateY(-4px); box-shadow:0 28px 50px -30px rgba(0,0,0,.42)")}>
                <span style={sx("display:flex; align-items:center; justify-content:space-between; width:100%; margin-bottom:18px")}>
                  <span style={sx("width:40px; height:40px; border-radius:13px; background:linear-gradient(150deg, var(--accent), var(--accent-2)); display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px -12px rgba(0,0,0,.5)")}>
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d={c.d} stroke="var(--on-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  {!!(c.meta) && (<>
                        <span style={sx("font-size:12px; font-weight:600; color:var(--ink-4); white-space:nowrap")}>{c.meta}</span>
                      </>)}
                </span>
                <h2 style={sx("margin:0; font-family:'Clash Display','Urbanist',sans-serif; font-size:17px; font-weight:400; letter-spacing:-.018em; line-height:1.2")}>{c.title}</h2>
                <span style={sx("display:flex; align-items:flex-end; gap:14px; width:100%; margin-top:7px")}>
                  <span style={sx("flex:1; min-width:0; font-size:12.5px; color:var(--ink-4); line-height:1.5; text-wrap:pretty")}>{c.desc}</span>
                  <span style={sx("flex:0 0 26px; width:26px; height:26px; border-radius:8px; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; opacity:.55")}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.2 6h5.6M6.2 3.4 8.8 6l-2.6 2.6" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </span>
              </Hoverable>
                </Fragment>)}
          </div>
            </>)}

        {!!(v.mob.home) && (<>
              <div style={sx("display:flex; flex-direction:column; gap:14px; padding-bottom:16px")}>
            <div>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:22px; font-weight:600; letter-spacing:-.03em")}>{v.greet.hello}</div>
              <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:4px")}>{v.greet.sub}</div>
            </div>

            <div style={sx("position:relative; overflow:hidden; border-radius:16px; padding:20px 16px 0; background:linear-gradient(145deg,#1B1B21 0%,#2A2A33 52%,#141418 100%); box-shadow:0 22px 44px -26px rgba(0,0,0,.55)")}>
              <div style={sx("font-size:11px; font-weight:650; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.62)")}>Net this period</div>
              <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:34px; font-weight:600; letter-spacing:-.035em; color:#fff; margin-top:6px; line-height:1")}>{v.mobData.balance}</div>
              <div style={sx("display:flex; align-items:center; gap:8px; margin-top:8px; flex-wrap:wrap")}>
                <span style={sx("font-size:12px; color:rgba(255,255,255,.68)")}>{v.mobData.pending} pending</span>
                <span style={sx("font-size:12px; font-weight:700; color:#8FE9C2")}>{v.mobData.delta}</span>
              </div>
              <img style={sx("width:calc(100% + 16px); height:132px; margin:8px -8px 0; display:block; object-fit:fill; pointer-events:none")} src={v.chart.src} alt="" draggable={false} />
            </div>

            <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:10px")}>
              <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px 14px 13px; box-shadow:var(--shadow-card)")}>
                <div style={sx("font-size:10.5px; font-weight:650; color:var(--ink-4); letter-spacing:.05em; text-transform:uppercase")}>Money in</div>
                <div style={sx("font-size:16px; font-weight:700; margin-top:4px")}>{v.mobData.inflow}</div>
              </div>
              <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px 14px 13px; box-shadow:var(--shadow-card)")}>
                <div style={sx("font-size:10.5px; font-weight:650; color:var(--ink-4); letter-spacing:.05em; text-transform:uppercase")}>Money out</div>
                <div style={sx("font-size:16px; font-weight:700; margin-top:4px")}>{v.mobData.outflow}</div>
              </div>
            </div>

            {!!(v.att.any) && (<>
                  <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); overflow:hidden")}>
                <div style={sx("display:flex; align-items:center; justify-content:space-between; padding:14px 16px 10px")}>
                  <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:15px; font-weight:600")}>Needs a look</div>
                  <span style={sx("font-size:11px; font-weight:700; color:var(--ink-4)")}>{v.att.count}</span>
                </div>
                {((v.att.items) || []).map((a: any, aIdx: any) => <Fragment key={a?.id || a?.key || 'a-' + aIdx}>
                      <div style={sx("display:flex; align-items:center; gap:10px; padding:12px 16px; border-top:1px solid var(--divider-2)")}>
                    <div style={sx("flex:1; min-width:0")}>
                      <div style={sx("font-size:13px; font-weight:700")}>{a.amt}</div>
                      <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{a.note}</div>
                    </div>
                    <button style={sx("font-size:12px; font-weight:700; color:var(--on-block); background:var(--btn-dark); padding:8px 10px; border-radius:8px")} onClick={a.confirm}>OK</button>
                  </div>
                    </Fragment>)}
              </div>
                </>)}

            <div style={sx("display:grid; grid-template-columns:repeat(4,1fr); gap:9px")}>
              {((v.mobData.actions) || []).map((a: any, aIdx: any) => <Fragment key={a?.id || a?.key || 'a-' + aIdx}>
                    <Hoverable as="button" className="flow-action-tile" style={sx("display:flex; flex-direction:column; align-items:center; gap:8px; padding:14px 6px; border-radius:16px")} onClick={a.go} activeStyle={sx("transform:scale(.96)")}>
                  <span style={sx("width:38px; height:38px; border-radius:12px; background:var(--accent-soft); border:1px solid var(--accent-line); display:flex; align-items:center; justify-content:center")}>
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d={a.d} stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span style={sx("font-size:11px; font-weight:650; color:var(--ink-2)")}>{a.label}</span>
                </Hoverable>
                  </Fragment>)}
            </div>

            <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:11px")}>
              <Hoverable as="button" style={sx("text-align:left; padding:16px; border-radius:16px; background:var(--surface); border:1px solid var(--line); box-shadow:var(--shadow-card)")} onClick={v.mobData.goMatch} activeStyle={sx("transform:scale(.98)")}>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.mobData.needsMatch}</div>
                <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Need matching</div>
              </Hoverable>
              <Hoverable as="button" style={sx("text-align:left; padding:16px; border-radius:16px; background:var(--surface); border:1px solid var(--line); box-shadow:var(--shadow-card)")} onClick={v.mobData.goInv} activeStyle={sx("transform:scale(.98)")}>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.mobData.outstanding}</div>
                <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Outstanding, {v.mobData.openInv} invoices</div>
              </Hoverable>
            </div>

            <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; justify-content:space-between; padding:16px 16px 12px")}>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Recent activity</div>
                <button style={sx("font-size:11.5px; font-weight:650; color:var(--accent)")} onClick={v.mobData.goTxns}>See all</button>
              </div>
              {((v.mobData.recent) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:12px 16px; border-top:1px solid var(--divider-2); text-align:left")} onClick={r.open} activeStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("width:36px; height:36px; flex:0 0 36px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:10.5px; font-weight:700; color:var(--ink-3)")}>{r.srcAbbr}</span>
                  <span style={sx("flex:1; min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{r.party}</span>
                    <span style={sx("display:block; font-size:11px; color:var(--ink-4); margin-top:2px")}>{r.d} · {r.tag}</span>
                  </span>
                  {!!(r.isIn) && (<>
                        <span style={sx("font-size:13.5px; font-weight:700; color:var(--pos); white-space:nowrap")}>{r.amt}</span>
                      </>)}
                  {!!(r.isOut) && (<>
                        <span style={sx("font-size:13.5px; font-weight:700; color:var(--ink-2); white-space:nowrap")}>{r.amt}</span>
                      </>)}
                </Hoverable>
                  </Fragment>)}
            </div>
          </div>
            </>)}

        {!!(v.mob.txns) && (<>
              <div style={sx("display:flex; flex-direction:column; gap:12px")}>
            <div>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:22px; font-weight:600; letter-spacing:-.03em")}>Money in and out</div>
              <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:4px")}>Latest movement. The full ledger stays on desktop.</div>
            </div>
            <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); overflow:hidden")}>
              {((v.mobData.allTxns) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:13px 14px; border-bottom:1px solid var(--divider-2); text-align:left")} onClick={r.open} activeStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("width:36px; height:36px; flex:0 0 36px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:10.5px; font-weight:700; color:var(--ink-3)")}>{r.srcAbbr}</span>
                  <span style={sx("flex:1; min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{r.party}</span>
                    <span style={sx("display:block; font-size:11px; color:var(--ink-4); margin-top:2px")}>{r.d} · {r.src} · {r.status}</span>
                  </span>
                  <span style={sx("font-size:13px; font-weight:700; white-space:nowrap")}>{r.amt}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
          </div>
            </>)}

        {!!(v.mob.invoices) && (<>
              <div style={sx("display:flex; flex-direction:column; gap:12px")}>
            <div style={sx("display:flex; align-items:flex-end; justify-content:space-between; gap:12px")}>
              <div>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:22px; font-weight:600; letter-spacing:-.03em")}>Invoices</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:4px")}>{v.mobData.openInv} open · {v.mobData.outstanding} outstanding</div>
              </div>
              <button style={sx("font-size:12.5px; font-weight:700; color:var(--on-block); background:var(--btn-dark); padding:10px 12px; border-radius:9px")} onClick={v.h.newInvoice}>New</button>
            </div>
            <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); overflow:hidden")}>
              {((v.mobData.invoices) || []).map((inv: any, invIdx: any) => <Fragment key={inv?.id || inv?.key || 'inv-' + invIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:13px 14px; border-bottom:1px solid var(--divider-2); text-align:left")} onClick={inv.open} activeStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("flex:1; min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{inv.client}</span>
                    <span style={sx("display:block; font-size:11px; color:var(--ink-4); margin-top:2px")}>{inv.no} · {inv.status}</span>
                  </span>
                  <span style={sx("font-size:13px; font-weight:700; white-space:nowrap")}>{inv.amt}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
          </div>
            </>)}

        {!!(v.show.dashboard) && (<>
              <div style={sx(v.sty.greet)}>
            <div>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:30px; font-weight:600; letter-spacing:-.025em")}>{v.greet.hello}</div>
              <div style={sx("font-size:13.5px; color:var(--ink-3); margin-top:5px")}>{v.greet.sub}</div>
            </div>
            <div style={sx("margin-left:auto; display:flex; align-items:center; gap:10px")}>
              <button className="flow-outline-btn" style={sx("display:flex; align-items:center; gap:7px; font-size:12.5px; font-weight:650; color:var(--ink); background:var(--btn-light); padding:10px 16px; border-radius:10px; backdrop-filter:blur(6px)")} onClick={v.h.newLink}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M8.2 11.8a3 3 0 0 0 4.5.3l2.4-2.4a3 3 0 0 0-4.2-4.2l-1.3 1.3M11.8 8.2a3 3 0 0 0-4.5-.3L4.9 10.3a3 3 0 0 0 4.2 4.2l1.3-1.3" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Payment link
              </button>
              <button style={sx("display:flex; align-items:center; gap:7px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:11px 18px; border-radius:9px; box-shadow:0 10px 22px -12px rgba(0,0,0,.6)")} onClick={v.h.newInvoice}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.5v11M4.5 10h11" stroke="var(--on-block)" strokeWidth="2" strokeLinecap="round" /></svg>
                New invoice
              </button>
            </div>
          </div>

          <div style={sx(v.sty.kpi)}>
            {((v.kpis) || []).map((k: any, kIdx: any) => <Fragment key={k?.id || k?.key || 'k-' + kIdx}>
                  <div style={sx("background:var(--bar-solid); border-radius:18px; box-shadow:var(--shadow-card); padding:18px 20px; min-width:0")}>
                <div style={sx("display:flex; align-items:center; gap:8px")}>
                  <span style={sx("width:22px; height:22px; flex:0 0 22px; border-radius:50%; background:var(--chip); display:flex; align-items:center; justify-content:center")}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                      <path d={k.d} stroke="var(--ink-3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={sx("font-size:13px; font-weight:600; color:var(--ink-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{k.label}</span>
                </div>
                <div style={sx("font-size:22px; font-weight:700; letter-spacing:-.03em; margin-top:12px; white-space:nowrap; font-variant-numeric:tabular-nums; color:var(--ink)")}>{k.val}</div>
                {!!(k.up) && (<>
                      <div style={sx("display:flex; align-items:center; gap:4px; font-size:12.5px; font-weight:650; color:var(--pos); margin-top:7px; font-variant-numeric:tabular-nums")}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 9.2V2.8M3.2 5.6 6 2.8l2.8 2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {k.delta}
                      </div>
                    </>)}
                {!!(k.down) && (<>
                      <div style={sx("display:flex; align-items:center; gap:4px; font-size:12.5px; font-weight:650; color:var(--neg); margin-top:7px; font-variant-numeric:tabular-nums")}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 2.8v6.4M3.2 6.4 6 9.2l2.8-2.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {k.delta}
                      </div>
                    </>)}
                {!!(k.neutral) && (<>
                      <div style={sx("font-size:12.5px; font-weight:600; color:var(--ink-4); margin-top:7px")}>{k.delta}</div>
                    </>)}
              </div>
                </Fragment>)}
          </div>
          <div style={sx(v.sty.grid2)}>
            <div style={sx("position:relative; overflow:hidden; display:flex; flex-direction:column; background:linear-gradient(145deg,#1B1B21 0%,#2A2A33 52%,#141418 100%); border-radius:16px; padding:24px 0 20px; min-width:0; box-shadow:0 24px 48px -22px rgba(8,8,12,.55)")}>
              <div style={sx("position:absolute; top:-90px; right:-60px; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,.14),rgba(255,255,255,0) 70%); animation:flowGlow 9s ease-in-out infinite; pointer-events:none")} />
              <div style={sx("position:absolute; bottom:-120px; left:-40px; width:260px; height:260px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,.07),rgba(255,255,255,0) 70%); pointer-events:none")} />
              <div style={sx("position:relative; display:flex; align-items:flex-start; gap:16px; flex-wrap:wrap; min-width:0; padding:0 26px")}>
                <div>
                  <div style={sx("font-size:12.5px; font-weight:600; color:rgba(255,255,255,.62); letter-spacing:.06em; text-transform:uppercase")}>Net this period</div>
                  <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:clamp(32px,3.6vw,46px); font-weight:600; letter-spacing:-.035em; margin-top:8px; color:#FFFFFF; white-space:nowrap")}>{v.bal.total}</div>
                  <div style={sx("display:flex; align-items:center; gap:10px; margin-top:10px")}>
                    <span style={sx("font-size:12.5px; color:rgba(255,255,255,.68)")}>{v.bal.pending} pending settlement</span>
                    {!!(v.bal.delta) && (<>
                          <span style={sx("width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,.35)")} />
                          <span style={sx("font-size:12.5px; font-weight:700; color:#8FE9C2")}>{v.bal.delta}</span>
                        </>)}
                  </div>
                </div>
                <div style={sx("margin-left:auto; display:flex; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.18); border-radius:16px; padding:3px; gap:2px; backdrop-filter:blur(8px)")}>
                  {((v.tfs) || []).map((x: any, xIdx: any) => <Fragment key={x?.id || x?.key || 'x-' + xIdx}>
                        {!!(x.on) && (<>
                          <button style={sx("padding:6px 14px; font-size:12px; font-weight:700; border-radius:7px; background:#FFFFFF; color:#15151A")}>{x.label}</button>
                        </>)}
                    {!!(x.off) && (<>
                          <button style={sx("padding:6px 14px; font-size:12px; font-weight:600; border-radius:7px; color:rgba(255,255,255,.7)")} onClick={x.go}>{x.label}</button>
                        </>)}
                      </Fragment>)}
                </div>
              </div>
              <div style={sx("margin-top:18px; position:relative; flex:1; min-height:190px; cursor:crosshair")} onMouseMove={v.chartHover} onMouseLeave={v.chartLeave}>
                <img style={sx("position:absolute; inset:0; width:100%; height:100%; display:block; pointer-events:none")} src={v.chart.src} alt="" draggable={false} />
                <div style={sx("position:absolute; inset:0; overflow:hidden; pointer-events:none")}>
                  <div style={sx(`position:absolute; left:${v.chart.tip.left}; top:${v.chart.tip.top}; width:100px; display:flex; justify-content:center`)}>
                    <div style={sx("background:rgba(255,255,255,.94); color:#15151A; font-size:11.5px; font-weight:700; padding:5px 10px; border-radius:8px; white-space:nowrap; box-shadow:0 8px 20px -8px rgba(0,0,0,.7)")}>{v.chart.tip.value}</div>
                  </div>
                  <span style={sx(`position:absolute; left:${v.chart.dot.left}; top:${v.chart.dot.top}; width:11px; height:11px; margin:-5.5px 0 0 -5.5px; border-radius:50%; background:#5FE0AC; box-shadow:0 0 0 4px rgba(95,224,172,.22), 0 0 18px rgba(95,224,172,.55)`)} />
                </div>
                <div style={sx("position:absolute; left:0; top:0; bottom:0; width:100%; overflow:hidden; pointer-events:none")}>
                  {((v.chart.gridVals) || []).map((g: any, gIdx: any) => <Fragment key={g?.id || g?.key || 'g-' + gIdx}>
                        <span style={sx(`position:absolute; left:16px; top:${g.top}; transform:translateY(-125%); font-size:9.5px; font-weight:600; color:rgba(255,255,255,.30); letter-spacing:.03em`)}>{g.label}</span>
                      </Fragment>)}
                </div>
              </div>
              <div style={sx("position:relative; display:flex; justify-content:space-between; margin-top:10px; padding:0 26px")}>
                {((v.chart.labels) || []).map((l: any, lIdx: any) => <Fragment key={l?.id || l?.key || 'l-' + lIdx}>
                      <span style={sx(`font-size:11px; color:rgba(255,255,255,.5); font-weight:600; ${l.axisStyle}`)}>{l.t}</span>
                    </Fragment>)}
              </div>
            </div>

            <div style={sx("display:flex; flex-direction:column; gap:22px; min-width:0")}>
              <div style={sx("background:var(--bar-solid); border-radius:20px; box-shadow:var(--shadow-card); padding:18px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Quick Actions</div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px")}>
                  {((v.quick) || []).map((q: any, qIdx: any) => <Fragment key={q?.id || q?.key || 'q-' + qIdx}>
                        <Hoverable as="button" className="flow-action-tile" style={sx("text-align:left; padding:18px 18px 20px; border-radius:20px; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={q.go} hoverStyle={sx("border-color:var(--dash)")}>
                      <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--ink-block); display:flex; align-items:center; justify-content:center; box-shadow:0 10px 18px -8px rgba(0,0,0,.45)")}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <path d={q.d} stroke="var(--on-block)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div style={sx("font-size:13.5px; font-weight:650; color:var(--ink); margin-top:14px; line-height:1.25; letter-spacing:-.015em")}>{q.label}</div>
                    </Hoverable>
                      </Fragment>)}
                </div>
              </div>

              <div style={sx("position:relative; overflow:hidden; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:8px")}>
                  <span style={sx("width:26px; height:26px; border-radius:8px; background:var(--btn-dark); border:1px solid var(--line); box-shadow:0 6px 14px -8px rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; flex:0 0 26px")}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="m4 10.2 4.2 4.2L16.5 5.6" stroke="var(--on-block)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Matching Status</div>
                  {!!(v.match.hasOpen) && (<>
                        <div style={sx("margin-left:auto; font-size:12.5px; font-weight:600; color:var(--ink-4)")}>{v.match.openLabel}</div>
                      </>)}
                </div>
                <div style={sx("margin-top:20px")}>
                  <div style={sx("display:flex; align-items:flex-end; gap:12px")}>
                    <div>
                      <div style={sx("font-size:11px; font-weight:650; color:var(--ink-4); letter-spacing:.06em")}>MATCHED AUTOMATICALLY</div>
                      <div style={sx("font-size:38px; font-weight:700; letter-spacing:-.04em; line-height:1; margin-top:8px")}>{v.match.pctText}</div>
                    </div>
                    <div style={sx("margin-left:auto; text-align:right")}>
                      <div style={sx("font-size:11px; font-weight:650; color:var(--ink-5); letter-spacing:.05em; text-transform:uppercase")}>{v.matchLabel}</div>
                      <div style={sx("font-size:13px; font-weight:650; color:var(--ink-2); margin-top:6px")}>{v.match.matched} of {v.match.totalItems}</div>
                    </div>
                  </div>
                  <div style={sx("height:10px; background:var(--chip); border-radius:6px; margin-top:18px; overflow:hidden")}>
                    <div style={sx(`height:100%; width:${v.match.pctText}; background:linear-gradient(90deg,var(--ink-5) 0%,var(--ink-2) 55%,var(--ink) 100%); border-radius:6px; transition:width .55s cubic-bezier(.32,.72,0,1)`)} data-match-fill={true} />
                  </div>
                  <div style={sx("display:flex; align-items:center; gap:10px; margin-top:16px")}>
                    <span style={sx("font-size:12px; color:var(--ink-4)")}>{v.match.look}</span>
                    {!!(v.match.hasOpen) && (<>
                          <button style={sx("margin-left:auto; display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:9px 15px; border-radius:9px")} onClick={v.h.goMatching}>
                        Review
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2.5 8 6l-4 3.5" stroke="var(--on-block)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                        </>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={sx(v.sty.grid2b)}>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px 22px")}>
              <div style={sx("display:flex; align-items:center; gap:10px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Recent Activity</div>
                <div style={sx("flex:1")} />
                <button style={sx("font-size:12.5px; font-weight:600; color:var(--accent)")} onClick={v.h.goTxns}>View all →</button>
              </div>
              <div style={sx("margin-top:6px")}>
                {((v.recent) || []).map((t: any, tIdx: any) => <Fragment key={t?.id || t?.key || 't-' + tIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:15px 8px; border-bottom:1px solid var(--divider); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={t.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <div style={sx("width:32px; height:32px; border-radius:9px; background:var(--panel); border:1px solid transparent; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:var(--ink-3)")}>{t.srcAbbr}</div>
                    <div style={sx("min-width:0; flex:1")}>
                      <div style={sx("font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{t.party}</div>
                      <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{t.d} · {t.src}</div>
                    </div>
                    <span style={sx("font-size:12.5px; color:var(--ink-4)")}>{t.tag}</span>
                    {!!(t.isIn) && (<>
                          <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13.5px; font-weight:600; color:var(--pos); width:130px; text-align:right")}>{t.amt}</div>
                        </>)}
                    {!!(t.isOut) && (<>
                          <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13.5px; font-weight:600; color:var(--ink); width:130px; text-align:right")}>{t.amt}</div>
                        </>)}
                  </Hoverable>
                    </Fragment>)}
              </div>
            </div>

            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px; display:flex; flex-direction:column; height:100%")}>
              <div style={sx("display:flex; align-items:center; gap:9px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Needs Your Attention</div>
                {!!(v.att.any) && (<>
                      <span style={sx("font-size:11px; font-weight:700; background:var(--accent-soft); color:var(--ink); border:1px solid var(--accent-line); padding:3px 8px; border-radius:6px")}>{v.att.count}</span>
                    </>)}
              </div>
              {!!(v.att.any) && (<>
                    <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:14px")}>
                  {((v.att.items) || []).map((a: any, aIdx: any) => <Fragment key={a?.id || a?.key || 'a-' + aIdx}>
                        <div style={sx("border:1px solid transparent; border-radius:13px; padding:13px; background:var(--panel-3)")}>
                      <div style={sx("display:flex; align-items:baseline; gap:8px")}>
                        <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15px; font-weight:600")}>{a.amt}</div>
                        <div style={sx("font-size:11.5px; color:var(--ink-4)")}>{a.d} · {a.src}</div>
                      </div>
                      <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:5px; line-height:1.45")}>{a.note}</div>
                      <div style={sx("display:flex; align-items:center; gap:6px; margin-top:10px")}>
                        <span style={sx("font-size:12px; font-weight:600; color:var(--ink-4); white-space:nowrap")}>{a.conf} match</span>
                        <div style={sx("flex:1")} />
                        <button style={sx("font-size:12px; font-weight:600; color:var(--ink-3); padding:6px 10px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={a.reject}>Reject</button>
                        <button style={sx("font-size:12px; font-weight:600; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:6px 12px; border-radius:8px")} onClick={a.confirm}>Confirm</button>
                      </div>
                    </div>
                      </Fragment>)}
                </div>
                  </>)}
              {!!(v.att.none) && (<>
                    <div style={sx("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:34px 10px")}>
                  <div style={sx("width:44px; height:44px; margin:0 auto; border-radius:14px; background:var(--accent-soft); border:1px solid var(--accent-line); display:flex; align-items:center; justify-content:center")}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="m5 10.5 3.4 3.4L15 6.8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={sx("font-size:13.5px; font-weight:650; margin-top:12px")}>You're all caught up</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Nothing needs your review right now.</div>
                </div>
                  </>)}
            </div>
          </div>
            </>)}

        {!!(v.show.payments) && (<>
              {!!(v.pt.gateway) && (<>
                <div style={sx("display:grid; grid-template-columns:1.4fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:44px; height:44px; border-radius:15px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--accent); font-size:13px")}>SC</div>
                  <div>
                    <div style={sx("font-size:15.5px; font-weight:700")}>SkipCash <span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></div>
                    <div style={sx("font-size:12.5px; color:var(--ink-4)")}>Your payment gateway, money settles straight to you</div>
                  </div>
                  <div style={sx("margin-left:auto; display:flex; align-items:center; gap:3px; padding:3px; background:var(--panel-2); border:1px solid var(--line); border-radius:10px")}>
                    <button style={sx(v.env.testStyle)} onClick={v.env.goTest}>Sandbox</button>
                    <button style={sx(v.env.liveStyle)} onClick={v.env.goLive}>Live</button>
                  </div>
                </div>
                <div style={sx("display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:20px")}>
                  <div style={sx("background:var(--panel-2); border:1px solid transparent; border-radius:13px; padding:14px")}><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>This month</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:5px")}>{v.gateways?.skipcash?.month}</div></div>
                  <div style={sx("background:var(--panel-2); border:1px solid transparent; border-radius:13px; padding:14px")}><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Settling</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:5px")}>{v.gateways?.skipcash?.settling}</div></div>
                  <div style={sx("background:var(--panel-2); border:1px solid transparent; border-radius:13px; padding:14px")}><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Settled share</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:5px")}>{v.gateways?.skipcash?.success}</div></div>
                </div>
                <div style={sx("margin-top:22px; padding-top:20px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em")}>How your payment pages look</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>Applies to payment pages, links, invoices and receipts</div>
                  <div style={sx("display:flex; align-items:center; gap:13px; margin-top:15px; padding:14px; border:1px dashed var(--dash); border-radius:14px")}>
                    <div style={sx("width:44px; height:44px; flex:0 0 44px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:650; color:var(--ink-5)")}>Logo</div>
                    <div style={sx("min-width:0; flex:1")}>
                      <div style={sx("font-size:12.5px; font-weight:600")}>Your logo</div>
                      <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>PNG or SVG, at least 128px square</div>
                    </div>
                    <Hoverable as="button" style={sx("font-size:12px; font-weight:650; padding:8px 13px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.note} data-note="Logo upload is sample-only in this sandbox" hoverStyle={sx("filter:brightness(.97)")}>Upload</Hoverable>
                  </div>
                  <div style={sx("margin-top:14px")}>
                    <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>Accent colour</div>
                    <div style={sx("display:flex; gap:8px")}>
                      {((v.brand.swatches) || []).map((sw: any, swIdx: any) => <Fragment key={sw?.id || sw?.key || 'sw-' + swIdx}>
                            <button style={sx(sw.style)} onClick={sw.go} />
                          </Fragment>)}
                      <Hoverable as="button" style={sx("width:30px; height:30px; border-radius:9px; border:1px dashed var(--ink-6); display:flex; align-items:center; justify-content:center; color:var(--ink-4); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.brand.togglePicker} title="More colours" hoverStyle={sx("border-color:var(--ink-4); color:var(--ink)")}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      </Hoverable>
                    </div>
                    {!!(v.brand.pickerOpen) && (<>
                          <div style={sx("margin-top:12px; padding:14px; border:1px solid var(--line); border-radius:12px; background:var(--panel-2)")}>
                        <div style={sx("display:grid; grid-template-columns:repeat(10,1fr); gap:6px")}>
                          {((v.brand.palette) || []).map((pc: any, pcIdx: any) => <Fragment key={pc?.id || pc?.key || 'pc-' + pcIdx}>
                                <button style={sx(pc.style)} onClick={pc.go} />
                              </Fragment>)}
                        </div>
                        <div style={sx("display:flex; align-items:center; gap:10px; margin-top:14px; padding-top:12px; border-top:1px solid var(--divider)")}>
                          <span style={sx(v.brand.previewStyle)} />
                          <span style={sx("font-size:12px; font-weight:600; color:var(--ink-3)")}>Hex</span>
                          <Hoverable as="input" style={sx("flex:1; min-width:0; padding:8px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:12.5px; background:var(--panel)")} value={v.brand.hex} onChange={v.brand.setHex} placeholder="#17171C" focusStyle={sx("border-color:var(--ink-6)")} />
                        </div>
                      </div>
                        </>)}
                  </div>
                </div>

                <div style={sx("display:flex; gap:10px; margin-top:20px")}>
                  <Hoverable as="button" style={sx("font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.h.testTxn} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Send a test payment</Hoverable>
                  <button style={sx("font-size:13px; font-weight:600; color:var(--ink); background:var(--btn-light); border:1px solid var(--line); padding:10px 16px; border-radius:9px")} onClick={v.gatewayOpen}>Manage connection</button>
                </div>
              </div>

              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px; margin-top:16px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Add another gateway</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px; line-height:1.5")}>Run a second provider alongside SkipCash, or switch over entirely.</div>
                <div style={sx("display:flex; flex-direction:column; margin-top:16px; border-top:1px solid var(--divider)")}>
                  {(Array.isArray(v.gatewayOptions) ? v.gatewayOptions : []).map((gw: any, gwIdx: any) => <Fragment key={gw?.id || gw?.key || 'gw-' + gwIdx}>
                        <div style={sx("display:flex; align-items:center; gap:13px; padding:14px 0; border-bottom:1px solid var(--divider-2)")}>
                      <span style={sx("width:36px; height:36px; flex:0 0 36px; border-radius:11px; background:var(--chip); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--ink-3)")}>{gw.initials}</span>
                      <span style={sx("flex:1; min-width:0")}>
                        <span style={sx("display:block; font-size:13.5px; font-weight:600")}>{gw.name}</span>
                        <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{gw.note}</span>
                      </span>
                      <button style={sx(gw.btnStyle)} onClick={gw.go}>{gw.cta}</button>
                    </div>
                      </Fragment>)}
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>How settlement works</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:10px")}>Customers pay through SkipCash. The money goes directly into your own merchant account, Flow never holds it. We just show you what happened and keep your books tidy.</div>
                <div style={sx("margin-top:14px; padding-top:14px; border-top:1px solid var(--divider); font-size:12.5px; color:var(--ink-3); line-height:1.6")}>{v.env.note}</div>
              </div>
            </div>
              </>)}

          {!!(v.pt.checkout) && (<>
                {!!(v.ppList.show) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); overflow:hidden")}>
              <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:22px 24px 18px")}>
                <div style={sx("min-width:0; flex:1 1 200px")}>
                  <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>Your payment pages</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>{v.ppList.count}</div>
                </div>
                <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; flex:0 0 auto; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); padding:10px 15px; border-radius:10px; white-space:nowrap; transition:transform .15s ease, filter .15s ease")} onClick={v.ppList.create} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.5v11M4.5 10h11" stroke="var(--on-block)" strokeWidth="2" strokeLinecap="round" /></svg>
                  New page
                </Hoverable>
              </div>
              {!!(v.ppList.empty) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>No pages yet</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Create a page customers can open, fill in and pay on.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.ppList.create} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>New page</Hoverable>
                </div>
                  </>)}
              {((v.ppList.rows) || []).map((pg: any, pgIdx: any) => <Fragment key={pg?.id || pg?.key || 'pg-' + pgIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:14px; padding:16px 24px; border-top:1px solid var(--divider-2); text-align:left; transition:background .15s ease")} onClick={pg.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("width:38px; height:38px; flex:0 0 38px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center")}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 7.4h12l-1 9.2a1.4 1.4 0 0 1-1.4 1.2H6.4A1.4 1.4 0 0 1 5 16.6L4 7.4ZM7.6 7.4V5.6a2.4 2.4 0 0 1 4.8 0v1.8" stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span style={sx("min-width:0; flex:1")}>
                    <span style={sx("display:flex; align-items:center; gap:9px")}>
                      <span style={sx("font-size:14px; font-weight:600; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{pg.title}</span>
                      {!!(pg.published) && (<>
                              <span style={sx("display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}><span style={sx("width:5px; height:5px; border-radius:50%; background:var(--pos)")} />Live</span>
                            </>)}
                      {!!(pg.draft) && (<>
                              <span style={sx("display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}><span style={sx("width:5px; height:5px; border-radius:50%; background:var(--ink-6)")} />Draft</span>
                            </>)}
                    </span>
                    <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:3px")}>{pg.meta}</span>
                  </span>
                  <span style={sx("font-size:14px; font-weight:650; white-space:nowrap")}>{pg.amount}</span>
                  <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M4 2.5 8 6l-4 3.5" stroke="var(--ink-5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Hoverable>
                    </Fragment>)}
            </div>
                </>)}

          {!!(v.ppList.published) && (<>
                  <div style={sx("min-height:calc(100vh - 74px); background:var(--panel-2)")}>
              <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:14px 28px; background:var(--modal); backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%); border-bottom:1px solid var(--line)")}>
                <div style={sx("flex:1 1 200px; font-family:'Clash Display','Urbanist',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em")}>Page published</div>
                <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); padding:9px 16px; border-radius:9px; white-space:nowrap; transition:transform .15s ease, filter .15s ease")} onClick={v.ppList.back} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>All payment pages</Hoverable>
              </div>

              <div style={sx("position:relative; overflow:hidden")}>
              <div style={sx("position:absolute; inset:0; pointer-events:none; background:var(--page-pattern); background-size:96px 96px; mask-image:linear-gradient(to right, transparent 0%, transparent 34%, rgba(0,0,0,.18) 48%, rgba(0,0,0,.55) 62%, rgba(0,0,0,.88) 78%, #000 92%, #000 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, transparent 34%, rgba(0,0,0,.18) 48%, rgba(0,0,0,.55) 62%, rgba(0,0,0,.88) 78%, #000 92%, #000 100%)")} />
              <div style={sx("position:relative; max-width:900px; margin:0 auto; padding:36px 28px 64px")}>
                <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-bottom:20px; padding:2px 0; background:transparent; border:none; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-4); transition:color .16s ease")} onClick={v.ppList.reopen} hoverStyle={sx("color:var(--ink)")}>
                  <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11.2 7H3.2M6.6 3.4 3 7l3.6 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Edit page</span>
                </Hoverable>

                <div style={sx("position:relative; overflow:hidden; background:var(--bar-solid); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:30px")}>
                  <div style={sx("display:inline-flex; align-items:center; gap:8px; font-size:10px; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:var(--ink-5)")}>
                    <span style={sx("width:6px; height:6px; border-radius:50%; background:var(--pos)")} />Live
                  </div>
                  <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:600; letter-spacing:-.035em; margin-top:12px")}>Your page is live</div>
                  <div style={sx("font-size:13.5px; color:var(--ink-4); margin-top:6px; max-width:460px; line-height:1.6")}>Share the link and customers can pay you straight away. Every payment lands in Money In &amp; Out.</div>

                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:24px; padding:13px 14px; border:1px solid var(--line); border-radius:12px; background:var(--panel-2)")}>
                    <span style={sx("min-width:0; flex:1 1 220px; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{v.pp.url}</span>
                    <div style={sx("display:flex; gap:8px; flex:0 0 auto")}>
                      <Hoverable as="button" className="flow-outline-btn" style={sx("font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; background:var(--bar-solid); color:var(--ink); white-space:nowrap")} onClick={v.pp.copyUrl} hoverStyle={sx("background:var(--panel-2)")}>Copy link</Hoverable>
                      <Hoverable as="button" className="flow-outline-btn" style={sx("display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; background:var(--bar-solid); color:var(--ink); white-space:nowrap")} onClick={v.pp.copyUrl} hoverStyle={sx("background:var(--panel-2)")}>
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M14.4 6.8a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM5.6 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM14.4 17.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM7.5 9.1l5 -2.3M7.5 10.9l5 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Share
                      </Hoverable>
                    </div>
                  </div>
                </div>

                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em; margin:34px 0 14px")}>What happens next</div>

                <div style={sx("display:flex; flex-direction:column; gap:12px")}>
                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:var(--bar-solid); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:20px 22px")}>
                    <span style={sx("width:38px; height:38px; flex:0 0 38px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center")}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 8h3.2M8.4 11h2.2" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span style={sx("min-width:0; flex:1 1 220px")}>
                      <span style={sx("display:block; font-size:13.5px; font-weight:600")}>{v.rcSummary.title}</span>
                      <span style={sx("display:block; font-size:12.5px; color:var(--ink-4); line-height:1.55; margin-top:3px")}>{v.rcSummary.sub}</span>
                    </span>
                    <Hoverable as="button" className="flow-outline-btn" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; background:var(--bar-solid); color:var(--ink); white-space:nowrap")} onClick={v.h.openReceipts} hoverStyle={sx("background:var(--panel-2)")}>Receipt settings</Hoverable>
                  </div>

                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:var(--bar-solid); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:20px 22px")}>
                    <span style={sx("width:38px; height:38px; flex:0 0 38px; border-radius:12px; background:var(--chip); display:flex; align-items:center; justify-content:center")}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2.3l1.3 2.2 2.5-.4.6 2.4 2.2 1.3-1.2 2.2 1.2 2.2-2.2 1.3-.6 2.4-2.5-.4L10 17.7l-1.3-2.2-2.5.4-.6-2.4-2.2-1.3 1.2-2.2-1.2-2.2 2.2-1.3.6-2.4 2.5.4ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span style={sx("min-width:0; flex:1 1 220px")}>
                      <span style={sx("display:block; font-size:13.5px; font-weight:600")}>{v.psSummary.title}</span>
                      <span style={sx("display:block; font-size:12.5px; color:var(--ink-4); line-height:1.55; margin-top:3px")}>{v.psSummary.sub}</span>
                    </span>
                    <Hoverable as="button" className="flow-outline-btn" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; background:var(--bar-solid); color:var(--ink); white-space:nowrap")} onClick={v.h.openPageSettings} hoverStyle={sx("background:var(--panel-2)")}>Page settings</Hoverable>
                  </div>
                </div>

                <div style={sx("font-size:12px; color:var(--ink-5); margin-top:18px")}>You can change receipts and page settings any time from this page.</div>
              </div>
              </div>
            </div>
                </>)}

          {!!(v.ppList.edit) && (<>
                  <div style={sx("min-height:calc(100vh - 74px); background:var(--panel-2)")}>

              <div style={sx("position:sticky; top:0; z-index:30; display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:14px 28px; background:var(--bar-solid); border-bottom:1px solid var(--line)")}>
                <div style={sx("min-width:0; flex:1 1 200px; display:flex; align-items:center; gap:11px")}>
                  <Hoverable as="button" style={sx("width:30px; height:30px; flex:0 0 30px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); display:flex; align-items:center; justify-content:center; color:var(--ink-3); transition:color .15s ease")} onClick={v.ppList.back} hoverStyle={sx("color:var(--ink)")}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.2 2.6 3.8 6l3.4 3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Hoverable>
                  <div style={sx("min-width:0")}>
                    <div style={sx("display:flex; align-items:baseline; gap:9px; min-width:0")}>
                      <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{v.pp.headline}</span>
                      <span style={sx("font-size:11.5px; color:var(--ink-5); white-space:nowrap")}>{v.pp.ref}</span>
                    </div>
                    <div style={sx("font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-5); margin-top:2px")}>{v.pp.statusLabel}</div>
                  </div>
                </div>
                <div style={sx("display:flex; gap:8px; flex:0 0 auto")}>
                  <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:650; padding:9px 13px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink-2); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.openReceipts} hoverStyle={sx("filter:brightness(.97)")}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 8h3.2M8.4 11h2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Receipts
                  </Hoverable>
                  <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:650; padding:9px 13px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink-2); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.openPageSettings} hoverStyle={sx("filter:brightness(.97)")}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 2.3l1.3 2.2 2.5-.4.6 2.4 2.2 1.3-1.2 2.2 1.2 2.2-2.2 1.3-.6 2.4-2.5-.4L10 17.7l-1.3-2.2-2.5.4-.6-2.4-2.2-1.3 1.2-2.2-1.2-2.2 2.2-1.3.6-2.4 2.5.4ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Page settings
                  </Hoverable>
                  {!!(v.pp.publishErrorOn) && (<>
                          <span style={sx("font-size:12px; font-weight:650; color:var(--neg); white-space:nowrap")}>{v.pp.publishError}</span>
                        </>)}
                  <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); padding:9px 16px; border-radius:9px; white-space:nowrap; transition:transform .15s ease, filter .15s ease")} onClick={v.pp.publish} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>{v.pp.publishLabel}</Hoverable>
                </div>
              </div>

              <div style={sx("position:relative; background:var(--panel-2); padding:0; overflow:hidden")}>
                <div style={sx("position:absolute; inset:0; pointer-events:none; background:var(--page-wash)")} />
                <div style={sx("position:relative; margin:0; background:var(--bar-solid); overflow:hidden")}>
                <div style={sx("position:absolute; inset:0; pointer-events:none; background:var(--page-pattern); background-size:96px 96px; mask-image:linear-gradient(to right, transparent 0%, transparent 34%, rgba(0,0,0,.18) 48%, rgba(0,0,0,.55) 62%, rgba(0,0,0,.88) 78%, #000 92%, #000 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, transparent 34%, rgba(0,0,0,.18) 48%, rgba(0,0,0,.55) 62%, rgba(0,0,0,.88) 78%, #000 92%, #000 100%)")} />
                <div style={sx("position:relative; padding:64px clamp(28px, 5vw, 72px) 48px")}>
                <div style={sx(v.ppGrid)}>

                  <div style={sx("min-width:0; position:relative; padding-left:max(0px, calc((100% - 400px) / 2))")}>
                    <div style={sx("display:inline-flex; align-items:center; gap:7px; margin-bottom:22px; font-size:10.5px; font-weight:700; letter-spacing:.11em; text-transform:uppercase; color:var(--ink-5)")}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M13.4 3.6l3 3L7.8 15.2l-3.8.8.8-3.8 8.6-8.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Click any text to edit
                    </div>
                    <div style={sx("display:flex; align-items:center; gap:13px")}>
                      <input style={sx("display:none")} id="flow-page-logo" type="file" accept="image/*" onChange={v.pp.onLogo} />
                      <Hoverable as="button" style={sx("width:52px; height:52px; flex:0 0 52px; padding:0; border-radius:13px; border:" + (v.pp.hasLogo ? "none" : "1px dashed var(--dash)") + "; display:flex; align-items:center; justify-content:center; overflow:hidden; font-size:10px; font-weight:650; color:var(--ink-5); cursor:pointer; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.pp.pickLogo} hoverStyle={sx(v.pp.hasLogo ? "filter:brightness(1.06)" : "border-color:var(--ink-5); color:var(--ink-3)")}>
                        {!!(v.pp.hasLogo) && (<>
                                    <img style={sx("width:100%; height:100%; object-fit:cover")} src={v.pp.logo} alt="" />
                                  </>)}
                        {!!(v.pp.noLogo) && (<>
                                    Logo
                                  </>)}
                      </Hoverable>
                      <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; letter-spacing:-.025em")}>{v.me.business}</div>
                    </div>

                    <Hoverable as="input" style={sx("width:100%; margin-top:28px; padding:10px 12px; margin-left:-12px; border:1px solid transparent; border-radius:10px; outline:none; background:transparent; font-family:'Urbanist','Cairo',sans-serif; font-size:36px; font-weight:600; letter-spacing:-.035em; color:var(--ink); transition:background .16s ease, border-color .16s ease")} value={v.pp.title} onChange={v.pp.setTitle} placeholder="Enter page title here" hoverStyle={sx("background:var(--panel-2); border-color:var(--line)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />

                    {!!(v.pp.goalOff) && (<>
                                <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:8px; margin-top:14px; padding:0; background:transparent; border:none; font-size:13px; font-weight:650; color:var(--ink-2); transition:color .15s ease")} onClick={v.pp.toggleGoal} hoverStyle={sx("color:var(--ink)")}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        Add a goal tracker
                        <span style={sx("position:relative; display:inline-flex")} onMouseEnter={v.pp.goalTipOn} onMouseLeave={v.pp.goalTipOff}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M7 6.4v3.4M7 4.2h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                          {!!(v.pp.goalTip) && (<>
                                      <span style={sx("position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); width:210px; background:var(--bar-solid); border:1px solid var(--line); border-radius:9px; box-shadow:0 20px 40px -20px rgba(0,0,0,.5); padding:10px 12px; font-size:11.5px; font-weight:500; color:var(--ink-3); line-height:1.5; text-transform:none; letter-spacing:normal; z-index:30")}>Shows a progress bar toward a target amount raised, so contributors see how close you are to the goal.</span>
                                    </>)}
                        </span>
                      </Hoverable>
                              </>)}
                    {!!(v.pp.goalOn) && (<>
                                <div style={sx("margin-top:16px; padding:16px; border:1px solid var(--line); border-radius:14px; background:var(--panel-2)")}>
                        <div style={sx("display:flex; align-items:center; gap:12px")}>
                          <div style={sx("flex:1; min-width:0")}>
                            <div style={sx("font-size:12.5px; font-weight:650")}>Goal tracker</div>
                            <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Shows a progress bar as payments come in</div>
                          </div>
                          <Hoverable as="button" style={sx("width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--ink-4); transition:background .15s ease, color .15s ease")} onClick={v.pp.toggleGoal} hoverStyle={sx("background:var(--neg-soft); color:var(--neg)")}>
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
                          </Hoverable>
                        </div>
                        <div style={sx("display:flex; align-items:baseline; gap:8px; margin-top:14px")}>
                          <span style={sx("font-size:12px; color:var(--ink-4)")}>Target</span>
                          <input style={sx("flex:1; min-width:0; padding:8px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px; background:var(--surface); color:var(--ink)")} value={v.pp.goal} onChange={v.pp.setGoal} />
                        </div>
                        <div style={sx("height:7px; border-radius:4px; background:var(--divider); margin-top:12px; overflow:hidden")}><span style={sx("display:block; width:34%; height:100%; background:var(--btn-dark)")} /></div>
                        <div style={sx("font-size:11px; color:var(--ink-5); margin-top:7px")}>{v.pp.goalNote}</div>
                      </div>
                              </>)}

                    <div style={sx("margin-top:20px; border:1px solid var(--line); border-radius:11px; overflow:hidden")}>
                      <textarea style={sx("width:100%; display:block; padding:10px 12px; border:none; outline:none; background:transparent; resize:vertical; font-family:'Urbanist','Cairo',sans-serif; font-size:14px; line-height:1.6; color:var(--ink-2)")} value={v.pp.desc} onChange={v.pp.setDesc} rows={3} placeholder="Tell customers what they are paying for" />
                      <div style={sx("display:flex; align-items:center; gap:4px; padding:7px 8px; border-top:1px solid var(--divider-2); background:var(--panel-2); flex-wrap:wrap")}>
                        <select style={sx("font-size:12px; font-weight:600; color:var(--ink-2); background:var(--surface); border:1px solid var(--line); border-radius:7px; padding:5px 8px; margin-right:4px")}>
                          <option>Normal</option><option>Heading</option><option>Subheading</option>
                        </select>
                        <span style={sx("width:1px; height:18px; background:var(--divider); margin:0 4px")} />
                        {((v.pp.tools) || []).map((tl: any, tlIdx: any) => <Fragment key={tl?.id || tl?.key || 'tl-' + tlIdx}>
                                    <Hoverable as="button" style={sx(tl.style)} onClick={tl.go} hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d={tl.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </Hoverable>
                                  </Fragment>)}
                      </div>
                    </div>

                    <div style={sx("margin-top:48px")}>
                      <div style={sx("font-size:13.5px; font-weight:650; letter-spacing:-.01em")}>Share this on</div>
                      <div style={sx("display:flex; gap:9px; margin-top:12px")}>
                        {((v.pp.share) || []).map((sh: any, shIdx: any) => <Fragment key={sh?.id || sh?.key || 'sh-' + shIdx}>
                                    <Hoverable as="button" style={sx("width:34px; height:34px; border-radius:10px; border:1px solid var(--line); background:var(--btn-light); display:flex; align-items:center; justify-content:center; color:var(--ink-3); transition:color .15s ease")} onClick={v.h.copy} hoverStyle={sx("color:var(--ink)")}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d={sh.d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </Hoverable>
                                  </Fragment>)}
                      </div>
                    </div>

                    <div style={sx("margin-top:32px")}>
                      <div style={sx("font-size:13.5px; font-weight:650; letter-spacing:-.01em")}>Contact us</div>
                      <div style={sx("display:flex; flex-direction:column; gap:11px; margin-top:12px")}>
                        <div style={sx("display:flex; align-items:center; gap:11px")}>
                          <svg style={sx("flex:0 0 16px")} width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6" stroke="var(--ink-5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <Hoverable as="input" style={sx("flex:1; min-width:0; padding:8px 11px; border:1px solid transparent; border-radius:9px; outline:none; background:transparent; font-size:13.5px; color:var(--ink-2); transition:background .16s ease, border-color .16s ease")} value={v.pp.email} onChange={v.pp.setEmail} placeholder="Support email" hoverStyle={sx("background:var(--panel-2); border-color:var(--line)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />
                        </div>
                        <div style={sx("display:flex; align-items:center; gap:11px")}>
                          <svg style={sx("flex:0 0 16px")} width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6.2 3.4h2.2l1.1 2.8-1.5 1.1a8.4 8.4 0 0 0 3.7 3.7l1.1-1.5 2.8 1.1v2.2a1.4 1.4 0 0 1-1.5 1.4A11.6 11.6 0 0 1 4.8 4.9a1.4 1.4 0 0 1 1.4-1.5Z" stroke="var(--ink-5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <Hoverable as="input" style={sx("flex:1; min-width:0; padding:8px 11px; border:1px solid transparent; border-radius:9px; outline:none; background:transparent; font-size:13.5px; color:var(--ink-2); transition:background .16s ease, border-color .16s ease")} value={v.pp.phone} onChange={v.pp.setPhone} placeholder="Support phone" hoverStyle={sx("background:var(--panel-2); border-color:var(--line)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />
                        </div>
                      </div>
                    </div>

                    <div style={sx("display:flex; align-items:center; gap:12px; margin-top:32px; padding-top:22px; border-top:1px solid var(--divider)")}>
                      <div style={sx("flex:1")}>
                        <div style={sx("font-size:13px; font-weight:600")}>Terms and conditions</div>
                        <div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>A short note above the pay button</div>
                      </div>
                      <button style={sx(v.pp.termsTrack)} onClick={v.pp.toggleTerms}><span style={sx(v.pp.termsKnob)} /></button>
                    </div>

                    {!!(v.pp.termsOn) && (<>
                                <div style={sx("font-size:12px; color:var(--ink-5); line-height:1.65; margin-top:14px")}>By paying you agree to share these details with {v.me.business}, in line with applicable law.</div>
                              </>)}

                    <div style={sx("margin-top:34px; padding-top:22px; border-top:1px solid var(--divider)")}>
                      <div style={sx("display:inline-flex; align-items:center; gap:8px")}>
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M3 4.5h10M3 8h6.5M3 11.5h4" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" /></svg>
                        <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em; color:var(--ink)")}>Flow</span>
                      </div>
                      <div style={sx("font-size:12px; color:var(--ink-4); margin-top:10px; line-height:1.6")}>Want a payment page like this for your business? <br />Visit <span style={sx("color: var(--accent); font-weight: 600;")}>Flow Payment Pages</span> to get started.</div>
                    </div>
                  </div>

                  <div style={sx("position:relative; z-index:1; display:flex; justify-content:center; padding-top:8px")}>
                  <div style={sx("width:100%; max-width:400px; background:var(--bar-solid); border:1px solid var(--line); border-radius:12px; box-shadow:0 30px 60px -30px rgba(0,0,0,.55); overflow:hidden")}>
                    <div style={sx("padding:22px 22px 6px")}>
                      <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>Payment details</div>
                      <div style={sx("width:26px; height:3px; border-radius:2px; background:var(--ink); margin-top:10px")} />
                    </div>

                    <div style={sx("padding:18px 22px 0; display:flex; flex-direction:column; gap:14px")}>
                      {((v.pp.fields) || []).map((fd: any, fdIdx: any) => <Fragment key={fd?.id || fd?.key || 'fd-' + fdIdx}>
                                  <Hoverable as="div" style={sx(fd.rowStyle)} draggable={v.true} onDragStart={fd.dragStart} onDragOver={fd.dragOver} onDragEnd={fd.dragEnd} onDrop={fd.drop} hoverStyle={sx(fd.rowHover)}>
                          {!!(fd.viewing) && (<>
                                      <div style={sx("display:flex; align-items:center; gap:10px")}>
                              <span style={sx("width:14px; flex:0 0 14px; display:flex; align-items:center; justify-content:center; color:var(--ink-6); cursor:grab")} title="Drag to reorder">
                                <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor"><circle cx="2.2" cy="2.6" r="1.5" /><circle cx="8.8" cy="2.6" r="1.5" /><circle cx="2.2" cy="7" r="1.5" /><circle cx="8.8" cy="7" r="1.5" /><circle cx="2.2" cy="11.4" r="1.5" /><circle cx="8.8" cy="11.4" r="1.5" /></svg>
                              </span>
                              <span style={sx("width:82px; flex:0 0 82px; font-size:12.5px; color:var(--ink-3); font-weight:600")}>{fd.label}{!!(fd.reqMark) && (<>
                                            <span style={sx("color:var(--neg); margin-left:3px")}>*</span>
                                          </>)}</span>
                              {!!(fd.isPrice) && (<>
                                          <span style={sx("flex:1; min-width:0; position:relative")}>
                                  <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:650; padding:9px 14px; border-radius:9px; border:1px dashed var(--dash); background:transparent; color:var(--ink-2); transition:border-color .15s ease, color .15s ease")} onClick={v.pp.priceMenu.toggle} hoverStyle={sx("border-color:var(--ink-5); color:var(--ink)")}>
                                    <span style={sx("width:18px; height:18px; border-radius:50%; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:700; color:var(--ink-3)")}>QR</span>
                                    {v.pp.priceMenu.label}
                                  </Hoverable>
                                  <Presence show={!!v.pp.priceMenu.open} kind="menu">
                                              <span style={sx("position:fixed; inset:0; z-index:40")} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); v.pp.priceMenu.close(); }} />
                                    <span className="flow-open-menu" style={sx("position:absolute; top:calc(100% + 7px); left:0; z-index:41; display:block; width:250px; background:var(--bar-solid); border:1px solid var(--line); border-radius:12px; box-shadow:0 26px 52px -26px rgba(0,0,0,.45); overflow:hidden")}>
                                      <span style={sx("display:block; padding:12px 14px 9px; font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5); border-bottom:1px solid var(--divider-2)")}>Select amount type</span>
                                      <span style={sx("display:block; padding:6px")}>
                                        {((v.pp.priceMenu.options) || []).map((po: any, poIdx: any) => <Fragment key={po?.id || po?.key || 'po-' + poIdx}>
                                                    <Hoverable as="button" type="button" style={sx("width:100%; display:flex; align-items:flex-start; gap:10px; padding:9px 10px; border-radius:9px; text-align:left; transition:background .14s ease")} onMouseDown={(e) => { e.stopPropagation(); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); po.go(e); }} hoverStyle={sx("background:var(--panel-3)")}>
                                            <svg style={sx("flex:0 0 16px; margin-top:1px")} width="16" height="16" viewBox="0 0 20 20" fill="none"><path d={po.d} stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            <span style={sx("min-width:0")}>
                                              <span style={sx("display:block; font-size:12.5px; font-weight:600; color:var(--ink)")}>{po.label}</span>
                                              <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{po.sub}</span>
                                            </span>
                                          </Hoverable>
                                                  </Fragment>)}
                                      </span>
                                    </span>
                                            </Presence>
                                </span>
                                        </>)}
                              {!!(fd.notPrice) && (<>
                                          <span style={sx("flex:1; min-width:0; border:1px solid var(--ink-6); border-radius:9px; padding:10px 12px; font-size:12.5px; color:var(--ink-4); background:var(--bar-solid)")}>{fd.ph}</span>
                                        </>)}
                              <Hoverable as="button" style={sx("width:26px; height:26px; flex:0 0 26px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--ink-5); transition:background .15s ease, color .15s ease")} onClick={fd.edit} title="Edit field" hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}>
                                <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M13.4 3.6l3 3L7.8 15.2l-3.8.8.8-3.8 8.6-8.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </Hoverable>
                            </div>
                                    </>)}

                          {!!(fd.editing) && (<>
                                      <div className="flow-open-expand"><div style={sx("padding:2px 0")}>
                                      <div style={sx("background:var(--bar-solid); border:1px solid var(--ink-6); border-radius:11px; box-shadow:0 20px 44px -22px rgba(0,0,0,.5); overflow:hidden")}>
                              {!!(fd.notPrice) && (<>
                                          <div style={sx("display:flex; align-items:center; gap:10px; padding:14px")}>
                                <input style={sx("width:110px; flex:0 0 110px; padding:6px 0; border:none; border-bottom:2px solid var(--ink); outline:none; background:transparent; font-size:12.5px; font-weight:600; color:var(--ink)")} value={fd.draft} onChange={fd.setLabel} placeholder="Field label" />
                                <span className="flow-field" style={sx("flex:1; min-width:0; border-radius:9px; padding:10px 12px; font-size:12.5px; color:var(--ink-5)")}>To be filled by customer</span>
                              </div>
                                        </>)}
                              {!!(fd.isPrice) && (<>
                                          <div style={sx("padding:14px 14px 8px")}>
                                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-5); margin-bottom:6px")}>Name on checkout</div>
                                <input style={sx("width:100%; padding:6px 0; border:none; border-bottom:2px solid var(--ink); outline:none; background:transparent; font-size:12.5px; font-weight:600; color:var(--ink)")} value={fd.draft} onChange={fd.setLabel} placeholder="Field label" />
                              </div>
                                {!!(fd.fixedMode || fd.qtyMode) && (<>
                                              <div style={sx("padding:6px 14px 14px")}>
                                    <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-5); margin-bottom:8px")}>Amount<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div>
                                    <span style={sx("display:flex; align-items:center; gap:8px")}>
                                      <span className="flow-field" style={sx("flex:1; min-width:0; display:flex; align-items:center; gap:8px; border-radius:9px; padding:10px 12px")}>
                                        <span style={sx(fieldChip)}>QR</span>
                                        <input autoFocus inputMode="decimal" style={sx("flex:1; min-width:0; border:none; outline:none; background:transparent; font-size:12.5px; font-weight:600; color:var(--ink); font-variant-numeric:tabular-nums")} value={fd.unitPrice} onChange={fd.setPrice} placeholder="0.00" />
                                      </span>
                                      {!!(fd.qtyMode) && (<>
                                                    <span className="flow-field" style={sx("display:flex; align-items:center; border-radius:9px; overflow:hidden; flex:0 0 auto; opacity:.65")} title="Customers choose the quantity">
                                          <span style={sx("width:28px; height:36px; display:flex; align-items:center; justify-content:center; color:var(--ink-5); font-size:14px; font-weight:600")}>–</span>
                                          <span style={sx("width:28px; text-align:center; font-size:12.5px; font-weight:650; color:var(--ink-4)")}>1</span>
                                          <span style={sx("width:28px; height:36px; display:flex; align-items:center; justify-content:center; color:var(--ink-5); font-size:14px; font-weight:600")}>+</span>
                                        </span>
                                                  </>)}
                                    </span>
                                    <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:8px; line-height:1.45")}>{fd.amountNote}</div>
                                  </div>
                                            </>)}
                                {!!(fd.openMode) && (<>
                                              <div style={sx("padding:6px 14px 14px")}>
                                    <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-5); margin-bottom:8px")}>Amount</div>
                                    <span style={sx("display:block; border:1px dashed var(--ink-6); border-radius:9px; padding:10px 12px; font-size:12.5px; color:var(--ink-4); background:var(--bar-solid); line-height:1.45")}>Customers type any amount on the page.</span>
                                  </div>
                                            </>)}
                                        </>)}
                              {!!(fd.optional && fd.notPrice) && (<>
                                          <div style={sx("padding:10px 14px; border-top:1px solid var(--divider-2); font-size:11.5px; color:var(--ink-3)")}>Customers can skip this field.</div>
                                        </>)}
                              {!!(fd.locked || fd.isPrice) && (<>
                                          <div style={sx("padding:11px 14px; border-top:1px solid var(--divider-2); background:var(--panel-2); font-size:11.5px; color:var(--ink-3); line-height:1.5")}><strong style={sx("color:var(--ink)")}>Mandatory</strong> field. {fd.notPrice ? fd.amountNote + ' ' : ''}It cannot be removed.</div>
                                        </>)}
                              <div style={sx("display:flex; align-items:center; justify-content:flex-end; gap:8px; padding:11px 14px; border-top:1px solid var(--divider-2)")}>
                                {!!(fd.removable && fd.notPrice) && (<>
                                            <button style={sx("display:flex; align-items:center; gap:7px; padding:5px 0; margin-right:16px")} onClick={fd.toggleRequired}>
                                    <span style={sx(fd.reqTrack)}><span style={sx(fd.reqKnob)} /></span>
                                    <span style={sx("font-size:12px; font-weight:600; color:var(--ink-3); white-space:nowrap")}>Required</span>
                                  </button>
                                          </>)}
                                {!!(fd.removable && fd.notPrice) && (<>
                                            <Hoverable as="button" style={sx("margin-right:auto; font-size:12px; font-weight:600; padding:7px 11px; border-radius:8px; color:var(--neg); transition:background .15s ease")} onClick={fd.remove} hoverStyle={sx("background:var(--neg-soft)")}>Remove</Hoverable>
                                          </>)}
                                <Hoverable as="button" style={sx("font-size:12px; font-weight:600; padding:7px 13px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink-3); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={fd.cancel} hoverStyle={sx("filter:brightness(.97)")}>Cancel</Hoverable>
                                <Hoverable as="button" style={sx("font-size:12px; font-weight:650; padding:7px 15px; border-radius:8px; color:var(--on-block); background:var(--btn-dark)")} onClick={fd.save} hoverStyle={sx("filter:brightness(1.12)")}>Save</Hoverable>
                              </div>
                            </div>
                                      </div></div>
                                    </>)}
                        </Hoverable>
                                </Fragment>)}

                      <div style={sx("display:flex; align-items:center; gap:12px")}>
                        <span style={sx("width:14px; flex:0 0 14px")} />
                        <span style={sx("width:82px; flex:0 0 82px; font-size:12.5px; color:var(--ink-5)")}>Add new</span>
                        <div style={sx("display:flex; gap:8px; flex:1; min-width:0")}>
                          <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:650; padding:9px 13px; border-radius:9px; border:1px dashed var(--dash); background:transparent; color:var(--ink-3); transition:border-color .15s ease, color .15s ease")} onClick={v.pp.addText} hoverStyle={sx("border-color:var(--ink-5); color:var(--ink)")}>
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Input field
                          </Hoverable>
                        </div>
                        <span style={sx("width:26px; flex:0 0 26px")} />
                      </div>
                    </div>

                    <div style={sx("display:flex; align-items:center; gap:12px; margin-top:22px; padding:14px 22px; border-top:1px solid var(--divider); background:var(--panel-2)")}>
                      <span style={sx("flex:1; min-width:0")}>
                        <span style={sx("display:flex; align-items:center; gap:7px")}>
                          <span style={sx("display:inline-flex; align-items:center; justify-content:center; height:22px; padding:0 7px; border-radius:5px; background:#FFFFFF; border:1px solid var(--line)")}>
                            <img style={sx("height:13px; width:auto; max-width:32px; object-fit:contain; display:block")} src="https://commons.wikimedia.org/wiki/Special:FilePath/Visa%20Inc.%20logo%20(2021%E2%80%93present).svg" alt="VISA" />
                          </span>
                          <span style={sx("display:inline-flex; align-items:center; justify-content:center; height:22px; padding:0 7px; border-radius:5px; background:#FFFFFF; border:1px solid var(--line)")}>
                            <img style={sx("height:13px; width:auto; max-width:32px; object-fit:contain; display:block")} src="https://commons.wikimedia.org/wiki/Special:FilePath/Mastercard-logo.svg" alt="MASTERCARD" />
                          </span>
                          <span style={sx("display:inline-flex; align-items:center; justify-content:center; height:22px; padding:0 7px; border-radius:5px; background:#FFFFFF; border:1px solid var(--line)")}>
                            <img style={sx("height:13px; width:auto; max-width:32px; object-fit:contain; display:block")} src="https://commons.wikimedia.org/wiki/Special:FilePath/Apple%20Pay%20logo.svg" alt="APPLE PAY" />
                          </span>
                          <span style={sx("display:inline-flex; align-items:center; justify-content:center; height:22px; padding:0 8px; border-radius:5px; background:#FFFFFF; border:1px solid var(--line)")}>
                            <span style={sx("font-size:9px; font-weight:800; letter-spacing:.03em; color:#15151A")}>NAPS</span>
                          </span>
                        </span>
                        <span style={sx("display:block; font-size:10px; color:var(--ink-5); margin-top:7px")}>Secured by SkipCash · {v.envLabel}</span>
                      </span>
                      <Hoverable as="button" style={sx("position:relative; flex:0 0 auto; max-width:220px; overflow:hidden; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); padding:11px 40px 11px 18px; border-radius:9px; white-space:nowrap; text-overflow:ellipsis; transition:filter .15s ease")} onClick={v.pp.editPayLabel} hoverStyle={sx("filter:brightness(1.12)")}>
                        <span style={sx("overflow:hidden; text-overflow:ellipsis; display:inline-block; max-width:150px; vertical-align:bottom")}>{v.pp.payLabel}</span> {v.pp.total}
                        <svg style={sx("position:absolute; right:14px; top:50%; transform:translateY(-50%); opacity:.75")} width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M13.4 3.6l3 3L7.8 15.2l-3.8.8.8-3.8 8.6-8.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </Hoverable>
                    </div>
                  </div>
                  </div>

                  <Presence show={!!v.pp.payLabelEditing}>
                              <div className="flow-open-scrim" style={sx("position:fixed; inset:0; z-index:60; background:rgba(18,18,24,.5); display:flex; align-items:center; justify-content:center; padding:20px")} onClick={v.pp.cancelPayLabel}>
                      <div className="flow-open-pop" style={sx("width:100%; max-width:480px; background:var(--bar-solid); border-radius:16px; box-shadow:0 40px 90px -30px rgba(0,0,0,.5); overflow:hidden")} onClick={v.h.stop}>
                        <div style={sx("padding:26px 26px 8px")}>
                          {!!(v.pp.payAmountOpen) && (<>
                                        <div style={sx("font-size:12px; font-weight:650; color:var(--ink-3); margin-bottom:8px")}>Amount</div>
                            <div style={sx("border:1px dashed var(--ink-6); border-radius:9px; padding:10px 12px; font-size:12.5px; color:var(--ink-4); background:var(--bar-solid); line-height:1.45")}>Customers type any amount on the page.</div>
                                      </>)}
                          {!!(!v.pp.payAmountOpen) && (<>
                                        <div style={sx("font-size:12px; font-weight:650; color:var(--ink); margin-bottom:8px")}>Amount<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div>
                            <div className="flow-field" style={sx("display:flex; align-items:center; gap:8px; border-radius:9px; padding:10px 12px")}>
                              <span style={sx(fieldChip)}>QR</span>
                              <input autoFocus inputMode="decimal" style={sx("flex:1; min-width:0; border:none; outline:none; background:transparent; font-size:12.5px; font-weight:600; color:var(--ink); font-variant-numeric:tabular-nums")} value={v.pp.payAmountDraft} onChange={v.pp.setPayAmountDraft} placeholder="0.00" />
                            </div>
                            <div style={sx("font-size:12px; color:var(--ink-4); margin-top:8px; line-height:1.45")}>{v.pp.payAmountHint}</div>
                                      </>)}
                          <div style={sx("font-size:12px; font-weight:650; color:var(--ink); margin:20px 0 8px")}>Payment button label<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div>
                          <input className="flow-field" style={sx("width:100%; padding:10px 12px; border-radius:9px; outline:none; font-size:12.5px; font-weight:600; color:var(--ink)")} value={v.pp.payLabelDraft} onChange={v.pp.setPayLabelDraft} placeholder="Pay" />
                        </div>
                        <div style={sx("display:flex; align-items:center; gap:12px; padding:16px 26px; background:var(--panel-2)")}>
                          <span style={sx("flex:1; min-width:0; display:flex; align-items:center; gap:7px; font-size:11px; font-weight:700; letter-spacing:.06em; color:var(--ink-4)")}>UPI · VISA · MASTERCARD · NAPS</span>
                          <span style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); padding:10px 16px; border-radius:8px; white-space:nowrap")}>{v.pp.payLabelDraft} {v.pp.total}</span>
                        </div>
                        <div style={sx("display:flex; align-items:center; justify-content:flex-end; gap:10px; padding:16px 26px; border-top:1px solid var(--divider-2)")}>
                          <Hoverable as="button" type="button" style={sx("width:38px; height:38px; border-radius:9px; border:1px solid var(--ink-6); color:var(--accent); display:flex; align-items:center; justify-content:center; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.pp.cancelPayLabel} hoverStyle={sx("background:var(--accent-soft)")}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          </Hoverable>
                          <Hoverable as="button" type="button" style={sx("width:38px; height:38px; border-radius:9px; background:var(--btn-dark); color:var(--on-block); display:flex; align-items:center; justify-content:center; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.pp.savePayLabel} hoverStyle={sx("filter:brightness(1.12)")}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M4.4 10.4 8 14l7.6-8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </Hoverable>
                        </div>
                      </div>
                    </div>
                            </Presence>

                </div>

                </div>
                </div>
              </div>
            </div>
                </>)}
              </>)}

          {!!(v.pt.links) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:16px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Collected via links</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.linkSum.total}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>All time</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Active links</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.linkSum.active}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Ready to share</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Times paid</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.linkSum.uses}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Across every link</div>
              </div>
            </div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; gap:12px; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Payment Links</div>
                <div style={sx("flex:1")} />
                <button style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 16px; border-radius:9px")} onClick={v.h.newLink}>New link</button>
              </div>
              <div style={sx("display:grid; grid-template-columns:1.6fr .9fr .8fr .7fr .7fr 56px; gap:24px; padding:11px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; color:var(--ink-5); letter-spacing:.09em; text-transform:uppercase")}>
                <span>DESCRIPTION</span><span style={sx("text-align:center")}>AMOUNT</span><span style={sx("text-align:center")}>STATUS</span><span style={sx("text-align:center")}>CREATED</span><span style={sx("text-align:center")}>USES</span><span style={sx("text-align:center")} />
              </div>
              {!!(v.empt.links) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>No links yet</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Create a link and send it so someone can pay you.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.h.newLink} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>New link</Hoverable>
                </div>
                  </>)}
              {((v.links) || []).map((l: any, lIdx: any) => <Fragment key={l?.id || l?.key || 'l-' + lIdx}>
                    <Hoverable as="div" style={sx("display:grid; grid-template-columns:1.6fr .9fr .8fr .7fr .7fr 56px; gap:24px; padding:14px 22px; border-bottom:1px solid var(--divider-2); align-items:center; transition:background .15s ease")} hoverStyle={sx("background:var(--panel-2)")}>
                  <button style={sx("font-size:13px; font-weight:600; text-align:left")} onClick={l.open}>{l.desc}</button>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; text-align:center")}>{l.amt}</span>
                  <span style={sx("text-align:center")}><span style={sx(l.chip)}>{l.status}</span></span>
                  <span style={sx("font-size:12.5px; color:var(--ink-3); text-align:center")}>{l.created}</span>
                  <span style={sx("font-size:12.5px; color:var(--ink-3); text-align:center")}>{l.uses}</span>
                  <button style={sx("font-size:12px; font-weight:600; color:var(--accent); text-align:center")} onClick={l.copy}>Copy</button>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.pt.subs) && (<>
                <div style={sx("display:flex; align-items:center; gap:12px; margin-bottom:16px")}>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Subscription plans</div>
              <div style={sx("flex:1")} />
              <button style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 16px; border-radius:9px")} onClick={v.h.newPlan}>New plan</button>
            </div>
            <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:16px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Recurring revenue</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.subsSum.mrr}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Every month, before fees</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Active subscribers</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.subsSum.people}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Across {v.subsSum.plans}</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Average per customer</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.subsSum.avg}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Monthly, all plans</div>
              </div>
            </div>

            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; gap:14px; padding:13px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span style={sx("flex:1; min-width:0")}>Plan</span>
                <span style={sx("width:132px; flex:0 0 132px; text-align:center")}>Price</span>
                <span style={sx("width:112px; flex:0 0 112px; text-align:center")}>Subscribers</span>
                <span style={sx("width:132px; flex:0 0 132px; text-align:center")}>Monthly revenue</span>
                <span style={sx("width:64px; flex:0 0 64px; text-align:center")}>Share</span>
              </div>
              {!!(v.empt.plans) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>No plans yet</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Create a plan and customers can pay you every month.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.h.newPlan} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>New plan</Hoverable>
                </div>
                  </>)}
              {((v.plans) || []).map((p: any, pIdx: any) => <Fragment key={p?.id || p?.key || 'p-' + pIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:14px; padding:16px 22px; border-top:1px solid var(--divider-2); text-align:left; transition:background .15s ease")} onClick={p.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("flex:1; min-width:0")}>
                    <span style={sx("display:block; font-size:14.5px; font-weight:600; letter-spacing:-.015em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{p.name}</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-5); margin-top:2px")}>{p.every}</span>
                  </span>
                  <span style={sx("width:132px; flex:0 0 132px; text-align:center; font-size:13px; color:var(--ink-3)")}>{p.amt}</span>
                  <span style={sx("width:112px; flex:0 0 112px; text-align:center; font-family:'Urbanist','Cairo',sans-serif; font-size:14px; font-weight:600")}>{p.subsT}</span>
                  <span style={sx("width:132px; flex:0 0 132px; text-align:center; font-family:'Urbanist','Cairo',sans-serif; font-size:14px; font-weight:600")}>{p.mrrT}</span>
                  <span style={sx("width:64px; flex:0 0 64px; display:flex; justify-content:center")} onClick={p.copy}><Hoverable as="span" style={sx("display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px; border:1px solid var(--line); color:var(--ink-4); transition:background .15s ease, color .15s ease")} title="Copy signup link" hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}><svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M8.2 11.8 11.8 8.2M7.4 13.4a2.6 2.6 0 0 1 0-3.7l1.5-1.5M12.6 6.6a2.6 2.6 0 0 1 3.7 3.7l-1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></Hoverable></span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.pt.bank) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700")}>{v.bank.initials}</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>{v.bank.name}</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{v.bank.note}</div></div>
                  <span style={sx("margin-left:auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                </div>
                <div style={sx("display:flex; gap:22px; margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Bank activity</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:3px")}>{v.bank.activity}</div></div>
                </div>
                <div style={sx("margin-top:16px; background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:12px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>Sample data. Live bank feeds arrive in a later phase.</div>
              </div>
              {(Array.isArray(v.bank?.extra) ? v.bank.extra : []).map((bx: any, bxIdx: any) => <Fragment key={bx?.id || bx?.key || 'bx-' + bxIdx}>
                      <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:22px")}>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700")}>{bx.initials}</div>
                    <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>{bx.name}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{bx.note}</div></div>
                    <span style={sx("margin-left:auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                  </div>
                </div>
                    </Fragment>)}
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Need another bank account?</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>Connect another Qatari bank account and Flow will track those payments and expenses alongside your existing accounts. Sample feeds only in this sandbox.</div>
                {!!(v.bankOn.idle && v.bankOn.hasRemaining) && (<>
                      <button type="button" style={sx("margin-top:16px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 18px; border-radius:10px")} onClick={v.bankOn.start}>Connect another bank</button>
                    </>)}
                {!!(v.bankOn.idle && v.bankOn.noneLeft) && (<>
                      <div style={sx("margin-top:16px; font-size:12.5px; color:var(--ink-3); line-height:1.6")}>All sample banks in this sandbox are connected.</div>
                    </>)}
                {!!(v.bankOn.pick) && (<>
                      <div style={sx("margin-top:16px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>Sample banks only. Live QCB feeds need Express Sandbox admission.</div>
                  <div style={sx("display:flex; flex-direction:column; gap:8px; margin-top:12px")}>
                    {(Array.isArray(v.bankOn.choices) ? v.bankOn.choices : []).map((bk: any, bkIdx: any) => <Fragment key={bk?.id || bk?.key || 'bk-' + bkIdx}>
                          <button type="button" style={sx("text-align:left; font-size:13px; font-weight:600; padding:11px 14px; border-radius:10px; border:1px solid var(--line); background:var(--btn-light)")} onClick={bk.go}>{bk.label}</button>
                        </Fragment>)}
                  </div>
                    </>)}
                {!!(v.bankOn.consent) && (<>
                      <div style={sx("margin-top:16px; font-size:13px; font-weight:600")}>{v.bankOn.picked}</div>
                  <div style={sx("margin-top:8px; font-size:12.5px; color:var(--ink-3); line-height:1.6")}>This connection is labelled sample data. It does not change cash on hand.</div>
                  <button type="button" style={sx("margin-top:16px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 18px; border-radius:10px")} onClick={v.bankOn.confirm}>Connect sample bank</button>
                    </>)}
              </div>
            </div>
              </>)}

          {!!(v.pt.shopify) && (<>
                <div style={sx("display:grid; grid-template-columns:1.3fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--chip); color:var(--ink-2); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700")}>SH</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>Shopify</div><div style={sx("font-size:12.5px; color:var(--ink-4)")}>{v.shopify.shopLine}</div></div>
                  {!!(v.shopify.connected) && (<>
                        <span style={sx("margin-left:auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                      </>)}
                  {!!(v.shopify.disconnected) && (<>
                        <span style={sx("margin-left:auto; font-size:12.5px; font-weight:600; color:var(--ink-4)")}>Not connected</span>
                      </>)}
                </div>
                {!!(v.shopify.idle) && (<>
                      <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:20px")}>
                    <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Store URL</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.shopDomain} onChange={v.F.shopDomain} placeholder="your-store.myshopify.com" /></label>
                    <button style={sx("font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.shopify.begin}>Connect Shopify</button>
                  </div>
                    </>)}
                {!!(v.shopify.authorize) && (<>
                      <div style={sx("margin-top:20px; font-size:13.5px; font-weight:600")}>Approve Flow on {v.shopify.pendingDomain}</div>
                  <div style={sx("margin-top:8px; font-size:12.5px; color:var(--ink-3); line-height:1.6")}>Simulated OAuth. Approving tags new incoming orders as Shopify. Existing ledger rows stay as they are.</div>
                  <div style={sx("display:flex; gap:10px; margin-top:16px")}>
                    <button style={sx("font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.shopify.approve}>Approve access</button>
                    <button style={sx("font-size:13px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.shopify.cancel}>Cancel</button>
                  </div>
                    </>)}
                {!!(v.shopify.connected) && (<>
                      <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:20px")}>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Store URL</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.shopify.shopDomain} readOnly={true} /></label>
                  <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
                    <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Checkout maps to</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value="Flow checkout (SkipCash)" readOnly={true} /></label>
                    <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Currency</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value="QR, Qatari Riyal" readOnly={true} /></label>
                  </div>
                  <div style={sx("display:flex; align-items:center; gap:12px; padding-top:6px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Sync products</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Keep names and prices in step</div></div>
                    <button style={sx(v.tgs.productSync.Track)} onClick={v.tgs.productSync.go}><span style={sx(v.tgs.productSync.Knob)} /></button>
                  </div>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Test mode</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Orders are recorded but not charged</div></div>
                    <button style={sx(v.tgs.testMode.Track)} onClick={v.tgs.testMode.go}><span style={sx(v.tgs.testMode.Knob)} /></button>
                  </div>
                  {!!(v.shopify.sampleReady) && (<>
                          <button style={sx("font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.shopify.ingest}>Pull sample order</button>
                        </>)}
                </div>
                    </>)}
              </div>
              <div style={sx("display:flex; flex-direction:column; gap:14px")}>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Sync status</div>
                  <div style={sx("display:flex; gap:20px; margin-top:12px")}>
                    <div><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Plugin</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:3px")}>{v.shopify.plugin}</div></div>
                    <div><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Orders on ledger</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; margin-top:2px")}>{v.shopify.orderCount}</div></div>
                  </div>
                  <div style={sx("margin-top:14px; padding-top:12px; border-top:1px solid var(--divider); font-size:12.5px; color:var(--ink-3)")}>{v.shopify.syncNote}</div>
                </div>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Setup guide</div>
                  <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:12px; font-size:12.5px; color:var(--ink-3)")}>
                    <div style={sx("display:flex; gap:9px")}><span style={sx("color:var(--ink-3); font-weight:700")}>1.</span><span>Install the Flow app from the Shopify app store</span></div>
                    <div style={sx("display:flex; gap:9px")}><span style={sx("color:var(--ink-3); font-weight:700")}>2.</span><span>Approve access to orders and products</span></div>
                    <div style={sx("display:flex; gap:9px")}><span style={sx("color:var(--ink-3); font-weight:700")}>3.</span><span>Choose Flow checkout at the payments step</span></div>
                  </div>
                </div>
              </div>
            </div>
              </>)}
            </>)}

        {!!(v.show.transactions) && (<>
              {!!(v.tt.all) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; gap:10px; padding:14px 20px; border-bottom:1px solid var(--divider); flex-wrap:wrap")}>
                <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em")}>All transactions</span>
                <span style={sx("font-size:12px; color:var(--ink-4)")}>{v.counts.rows} of {v.counts.total} shown</span>
                <div style={sx("flex:1")} />
                {!!(v.fclear.show) && (<>
                      <Hoverable as="button" style={sx("font-size:12px; font-weight:600; padding:8px 13px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink-3); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.fclear.go} hoverStyle={sx("filter:brightness(.97)")}>Clear filters</Hoverable>
                    </>)}
                <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.export} hoverStyle={sx("filter:brightness(.97)")}>Export</Hoverable>
              </div>
              <div style={sx("position:relative; display:flex; align-items:center; gap:9px; padding:13px 20px; border-bottom:1px solid var(--divider); flex-wrap:wrap")}>
                {((v.fmenu) || []).map((fm: any, fmIdx: any) => <Fragment key={fm?.id || fm?.key || 'fm-' + fmIdx}>
                      <div style={sx("position:relative")}>
                    <button style={sx(fm.chipStyle)} onClick={fm.toggle}>
                      <span>{fm.label}: {fm.value}</span>
                      <svg style={sx("flex:0 0 10px")} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.4 3.9 5 6.5l2.6-2.6" stroke={fm.caret} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <Presence show={!!fm.open} kind="menu">
                          <div style={sx("position:fixed; inset:0; z-index:38")} onClick={fm.toggle} />
                      <div className="flow-open-menu" style={sx("position:absolute; top:calc(100% + 6px); left:0; z-index:39; min-width:172px; padding:5px; background:var(--modal); backdrop-filter:blur(24px) saturate(150%); border:1px solid var(--line); border-radius:12px; box-shadow:0 22px 44px -22px rgba(0,0,0,.45)")}>
                        {((fm.options) || []).map((o: any, oIdx: any) => <Fragment key={o?.id || o?.key || 'o-' + oIdx}>
                              <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:9px; padding:8px 12px; border-radius:9px; text-align:left; font-size:12.5px; font-weight:500; color:var(--ink-2)")} onClick={o.go} hoverStyle={sx("background:var(--panel-3)")}>
                            <span style={sx("width:11px; flex:0 0 11px")}>
                              {!!(o.on) && (<>
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.2 6.2 4.6 8.6 9.8 3.4" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  </>)}
                            </span>
                            <span>{o.label}</span>
                          </Hoverable>
                            </Fragment>)}
                      </div>
                        </Presence>
                  </div>
                    </Fragment>)}
              </div>
              <div style={sx("display:grid; grid-template-columns:.6fr 1.5fr .8fr 1fr .8fr .9fr; gap:24px; padding:11px 20px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; color:var(--ink-5); letter-spacing:.09em; text-transform:uppercase")}>
                <span>Date</span><span>Counterparty</span><span>Source</span><span>Tag</span><span>Status</span><span style={sx("text-align:right")}>Amount</span>
              </div>
              {!!(v.empt.rows) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>No transactions match these filters</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Widen the period or clear a filter to see more.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.fclear.go} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Clear filters</Hoverable>
                </div>
                  </>)}
              {((v.rows) || []).map((t: any, tIdx: any) => <Fragment key={t?.id || t?.key || 't-' + tIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:grid; grid-template-columns:.6fr 1.5fr .8fr 1fr .8fr .9fr; gap:24px; padding:16px 20px; border-bottom:1px solid var(--divider-2); align-items:center; text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={t.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("font-size:12.5px; color:var(--ink-3)")}>{t.d}</span>
                  <span style={sx("font-size:13px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{t.party}</span>
                  <span style={sx("font-size:12.5px; color:var(--ink-3)")}>{t.src}</span>
                  <span><span style={sx("font-size:12.5px; color:var(--ink-4)")}>{t.tag}</span></span>
                  <span><span style={sx(t.chip)}>{t.status}</span></span>
                  {!!(t.isIn) && (<>
                        <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; font-weight:600; color:var(--pos); text-align:right")}>{t.amt}</span>
                      </>)}
                  {!!(t.isOut) && (<>
                        <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; font-weight:600; text-align:right")}>{t.amt}</span>
                      </>)}
                </Hoverable>
                  </Fragment>)}
            </div>
            <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-top:16px; padding:2px 0; background:transparent; border:none; font-size:12.5px; font-weight:600; color:var(--ink-4); transition:color .16s ease")} onClick={v.actGo.payments} hoverStyle={sx("color:var(--ink)")}>
              <span>See payment activity</span>
              <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.8 7h8M7.4 3.4 11 7l-3.6 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Hoverable>
              </>)}

          {!!(v.tt.matching) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px 22px; margin-bottom:16px")}>
              <div style={sx("display:flex; align-items:center; gap:10px")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Match rate this month</div><div style={sx("margin-left:auto; font-family:'Urbanist','Cairo',sans-serif; font-size:15px; font-weight:600")}>{v.auto.pctText}</div></div>
              <div style={sx("height:9px; background:var(--divider); border-radius:5px; margin-top:12px; overflow:hidden")}><div style={sx(`height:100%; width:${v.auto.pctW}; background:linear-gradient(90deg,var(--pos),var(--pos-2)); border-radius:5px`)} /></div>
              <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:10px")}>{v.auto.line}</div>
            </div>

            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); margin-bottom:16px; overflow:hidden")}>
              <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:16px 20px; text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.auto.toggle} hoverStyle={sx("background:var(--panel-2)")}>
                <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15px; font-weight:600; letter-spacing:-.02em")}>Matched automatically</span>
                <span style={sx("font-size:12.5px; font-weight:650; color:var(--ink-4)")}>{v.auto.count}</span>
                <span style={sx("margin-left:auto; font-size:12px; color:var(--ink-4)")}>No action needed</span>
                {!!(v.auto.shut) && (<>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.6 5.2 7 8.6l3.4-3.4" stroke="var(--ink-4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </>)}
                {!!(v.auto.open) && (<>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.6 8.8 7 5.4l3.4 3.4" stroke="var(--ink-4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </>)}
              </Hoverable>
              {!!(v.auto.open) && (<>
                    {((v.auto.rows) || []).map((am: any, amIdx: any) => <Fragment key={am?.id || am?.key || 'am-' + amIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:14px; padding:13px 20px; border-top:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={am.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <span style={sx("font-size:13.5px; font-weight:650; width:104px; flex:0 0 104px")}>{am.amt}</span>
                    <span style={sx("flex:1; min-width:0; font-size:12.5px; color:var(--ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{am.party}</span>
                    <svg style={sx("flex:0 0 14px")} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.4 7h9.2M8.6 4 11.6 7l-3 3" stroke="var(--ink-5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={sx("font-size:12.5px; font-weight:600; width:86px; flex:0 0 86px; text-align:right")}>{am.inv}</span>
                    <span style={sx("font-size:11px; font-weight:700; letter-spacing:.08em; color:var(--pos); width:52px; flex:0 0 52px; text-align:right")}>{am.confT}</span>
                  </Hoverable>
                    </Fragment>)}
                  </>)}
            </div>
            <div style={sx("display:flex; flex-direction:column; gap:12px")}>
              {((v.matches) || []).map((m: any, mIdx: any) => <Fragment key={m?.id || m?.key || 'm-' + mIdx}>
                    <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:18px 20px; display:flex; align-items:center; gap:16px")}>
                  <div style={sx("min-width:0; flex:1")}>
                    <div style={sx("display:flex; align-items:baseline; gap:10px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600")}>{m.amt}</span><span style={sx("font-size:13px; font-weight:600")}>{m.party}</span></div>
                    <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:5px")}>Suggested match: {m.inv}, {m.why}</div>
                  </div>
                  {!!(m.high) && (<>
                        <span style={sx("font-size:12.5px; font-weight:600; color:var(--ink-3); white-space:nowrap")}>{m.confT} sure</span>
                      </>)}
                  {!!(m.low) && (<>
                        <span style={sx("font-size:12.5px; font-weight:600; color:var(--ink-4); white-space:nowrap")}>{m.confT} sure</span>
                      </>)}
                  <button style={sx("font-size:12.5px; font-weight:600; padding:9px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={m.open}>Review</button>
                </div>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.tt.scan) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("border:1.5px dashed var(--dash); border-radius:11px; padding:44px 20px; text-align:center; background:var(--panel-2)")}>
                  <div style={sx("width:48px; height:48px; margin:0 auto; border-radius:16px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center")}>
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M3 7V4.5A1.5 1.5 0 0 1 4.5 3H7M13 3h2.5A1.5 1.5 0 0 1 17 4.5V7M17 13v2.5a1.5 1.5 0 0 1-1.5 1.5H13M7 17H4.5A1.5 1.5 0 0 1 3 15.5V13M6 10h8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </div>
                  <div style={sx("font-size:14px; font-weight:650; margin-top:14px")}>Take a photo of the bill</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:5px")}>Or drop a PDF, we'll read the details for you</div>
                  <button style={sx("margin-top:16px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 18px; border-radius:10px")} onClick={v.h.openScan}>Upload a bill</button>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>What we pull out</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:14px")}>
                  <div style={sx("display:flex; justify-content:space-between; padding:11px 13px; background:var(--panel-2); border:1px solid transparent; border-radius:11px")}><span style={sx("font-size:12.5px; color:var(--ink-3)")}>Vendor</span><span style={sx("font-size:13px; font-weight:600")}>{v.scan.vendor}</span></div>
                  <div style={sx("display:flex; justify-content:space-between; padding:11px 13px; background:var(--panel-2); border:1px solid transparent; border-radius:11px")}><span style={sx("font-size:12.5px; color:var(--ink-3)")}>Amount</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; font-weight:600")}>{v.scan.amount}</span></div>
                  <div style={sx("display:flex; justify-content:space-between; padding:11px 13px; background:var(--panel-2); border:1px solid transparent; border-radius:11px")}><span style={sx("font-size:12.5px; color:var(--ink-3)")}>Date</span><span style={sx("font-size:13px; font-weight:600")}>{v.scan.date}</span></div>
                </div>
                <div style={sx("margin-top:16px; font-size:12px; color:var(--ink-4); line-height:1.5")}>Blurry photo? We'll flag it for manual entry instead of guessing.</div>
              </div>
            </div>
              </>)}

          {!!(v.tt.bank) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1.4fr; gap:22px; align-items:start")}>
              <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700")}>{v.bank.initials}</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>{v.bank.name}</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; color:var(--ink-4); margin-top:2px")}>{v.bank.note}</div></div>
                </div>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; margin-top:18px")}>{v.bank.activity}</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>{v.bank.activityCaption}</div>
                <div style={sx("margin-top:16px; display:inline-flex; font-size:11px; font-weight:650; color:var(--ink-3); background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); padding:5px 10px; border-radius:7px")}>Sample data, not a live feed</div>
              </div>
              {(Array.isArray(v.bank?.extra) ? v.bank.extra : []).map((bx: any, bxIdx: any) => <Fragment key={bx?.id || bx?.key || 'bxba-' + bxIdx}>
                    <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:22px")}>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700")}>{bx.initials}</div>
                    <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>{bx.name}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{bx.note}</div></div>
                    <span style={sx("margin-left:auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                  </div>
                </div>
                  </Fragment>)}
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Bank side by side with Flow</div>
                {((v.rows) || []).map((t: any, tIdx: any) => <Fragment key={t?.id || t?.key || 't-' + tIdx}>
                      <div style={sx("display:grid; grid-template-columns:1fr auto 1fr; gap:14px; padding:15px 20px; border-bottom:1px solid var(--divider-2); align-items:center")}>
                    <div><div style={sx("font-size:12.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{t.party}</div><div style={sx("font-size:11px; color:var(--ink-4); margin-top:2px")}>Bank · {t.d}</div></div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10m0 0-3-3m3 3-3 3" stroke="var(--ink-6)" strokeWidth="1.4" strokeLinecap="round" /></svg>
                    <div style={sx("text-align:right")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px; font-weight:600")}>{t.amt}</div><div style={sx("font-size:11px; color:var(--ink-4); margin-top:2px")}>{t.src} · {t.tag}</div></div>
                  </div>
                    </Fragment>)}
              </div>
            </div>
              </>)}
            </>)}

        {!!(v.show.invoicing) && (<>
              {!!(v.it.create) && (<>
                <div style={sx("display:grid; grid-template-columns:1.25fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>New invoice</div>
                <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:16px")}>
                  <div style={sx("position:relative")}>
                    <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Client<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div>
                    <button style={sx(v.nv.clientBtn)} onClick={v.nv.toggleClients}>
                      <span style={sx("flex:1; min-width:0; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{v.nv.clientLabel}</span>
                      <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2.6 4.4 6 7.8l3.4-3.4" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <Presence show={!!v.nv.clientsOpen} kind="menu">
                          <div style={sx("position:fixed; inset:0; z-index:40")} onClick={v.nv.toggleClients} />
                      <div className="flow-open-menu" style={sx("position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:41; background:var(--bar-solid); border:1px solid var(--line); border-radius:12px; box-shadow:0 26px 52px -26px rgba(0,0,0,.45); overflow:hidden")}>
                        {((v.nv.clientOptions) || []).map((co: any, coIdx: any) => <Fragment key={co?.id || co?.key || 'co-' + coIdx}>
                              <button style={sx(co.style)} onClick={co.go}>
                            <span style={sx("flex:1; min-width:0; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{co.name}</span>
                            {!!(co.on) && (<>
                                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2.2 6.2 4.6 8.6 9.8 3.4" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </>)}
                          </button>
                            </Fragment>)}
                        <div style={sx("display:flex; align-items:center; gap:8px; padding:9px; border-top:1px solid var(--divider)")}>
                          <Hoverable as="input" style={sx("flex:1; min-width:0; padding:8px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:12.5px; background:var(--panel)")} value={v.nv.newClient} onChange={v.nv.setNewClient} placeholder="Add a new client" focusStyle={sx("border-color:var(--ink-6)")} />
                          <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 13px; border-radius:8px; color:var(--on-block); background:var(--btn-dark); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.nv.addClient} hoverStyle={sx("filter:brightness(1.12)")}>Add</Hoverable>
                        </div>
                      </div>
                        </Presence>
                  </div>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Billing address (optional)</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.nv.clientAddress} onChange={v.nv.setClientAddress} placeholder="Street, city, country" focusStyle={sx("border-color:var(--ink-6)")} /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>PO / Reference (optional)</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.nv.reference} onChange={v.nv.setReference} placeholder="PO-1042" focusStyle={sx("border-color:var(--ink-6)")} /></label>
                  <div>
                    <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:8px")}>Line items</div>
                    <div style={sx("border:1px solid var(--line); border-radius:12px; overflow:hidden")}>
                      <div style={sx("display:grid; grid-template-columns:2fr .6fr .8fr .8fr 32px; gap:10px; padding:10px 13px; background:var(--panel-2); font-size:11px; font-weight:650; color:var(--ink-4)")}>
                        <span>DESCRIPTION</span><span>QTY</span><span>PRICE</span><span style={sx("text-align:right")}>TOTAL</span><span />
                      </div>
                      {((v.nv.items) || []).map((li: any, liIdx: any) => <Fragment key={li?.id || li?.key || 'li-' + liIdx}>
                            <div style={sx("display:grid; grid-template-columns:2fr .6fr .8fr .8fr 32px; gap:10px; padding:8px 13px; border-top:1px solid var(--divider); font-size:13px; align-items:center")}>
                          <Hoverable as="input" style={sx("width:100%; padding:7px 9px; margin-left:-9px; border:1px solid transparent; border-radius:8px; outline:none; background:transparent; font-size:13px; color:var(--ink); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} value={li.desc} onChange={li.setDesc} placeholder="What are you billing for" hoverStyle={sx("background:var(--panel-2)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />
                          <Hoverable as="input" style={sx("width:100%; padding:7px 9px; margin-left:-9px; border:1px solid transparent; border-radius:8px; outline:none; background:transparent; font-size:13px; color:var(--ink); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} value={li.qty} onChange={li.setQty} hoverStyle={sx("background:var(--panel-2)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />
                          <Hoverable as="input" style={sx("width:100%; padding:7px 9px; margin-left:-9px; border:1px solid transparent; border-radius:8px; outline:none; background:transparent; font-size:13px; color:var(--ink); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} value={li.price} onChange={li.setPrice} hoverStyle={sx("background:var(--panel-2)")} focusStyle={sx("background:var(--panel-2); border-color:var(--ink-6)")} />
                          <span style={sx("text-align:right; font-weight:600")}>{li.total}</span>
                          <Hoverable as="button" style={sx("width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--ink-5); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={li.remove} title="Remove line" hoverStyle={sx("background:var(--panel-3); color:var(--neg)")}>
                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                          </Hoverable>
                        </div>
                          </Fragment>)}
                      <Hoverable as="button" style={sx("width:100%; padding:11px 13px; border-top:1px solid var(--divider); font-size:12.5px; font-weight:600; color:var(--accent); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.nv.addItem} hoverStyle={sx("background:var(--panel-2)")}>+ Add line item</Hoverable>
                    </div>
                  </div>
                  <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
                    {!!(v.showTax) && (<>
                          <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Tax %</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif; background:var(--panel)")} value={v.nv.tax} onChange={v.nv.setTax} focusStyle={sx("border-color:var(--ink-6)")} /></label>
                        </>)}
                    <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Due date<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); color:var(--ink)")} type="date" value={v.nv.due} onChange={v.nv.setDue} focusStyle={sx("border-color:var(--ink-6)")} />{!!(v.nv.dueErrorOn) && (<>
                            <span style={sx("display:block; font-size:12px; font-weight:650; color:var(--neg); margin-top:6px")}>{v.nv.dueError}</span>
                          </>)}</label>
                  </div>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Discount (optional)</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif; background:var(--panel)")} value={v.nv.discount} onChange={v.nv.setDiscount} placeholder="0.00" focusStyle={sx("border-color:var(--ink-6)")} /></label>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}>
                      <div style={sx("font-size:13px; font-weight:600")}>Partial payment</div>
                      <div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Allow the customer to pay less than the full amount</div>
                    </div>
                    <button type="button" role="switch" aria-checked={!!v.nv.partialOn} aria-label="Partial payment" onClick={v.nv.togglePartial} style={sx(v.nv.partialTrack)}>
                      <span style={sx(v.nv.partialKnob)} />
                    </button>
                  </div>
                  <div>
                    <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Attachments (optional)</div>
                    <label style={sx("position:relative; display:inline-flex; align-items:center; font-size:12.5px; font-weight:600; padding:9px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); cursor:pointer")}>
                      <input type="file" multiple onChange={v.nv.addFiles} style={sx("position:absolute; inset:0; opacity:0; cursor:pointer")} />
                      Attach files
                    </label>
                    {((v.nv.files) || []).map((file: any, fileIdx: any) => <Fragment key={file?.name || 'file-' + fileIdx}>
                          <div style={sx("display:flex; align-items:center; gap:10px; margin-top:8px")}>
                        <span style={sx("flex:1; min-width:0; font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{file.name}</span>
                        <Hoverable as="button" style={sx("font-size:12px; font-weight:600; color:var(--ink-4); padding:4px 8px; border-radius:7px")} onClick={file.remove} hoverStyle={sx("color:var(--neg)")}>Remove</Hoverable>
                      </div>
                        </Fragment>)}
                  </div>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Notes</div><Hoverable as="textarea" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; resize:vertical; background:var(--panel)")} value={v.nv.notes} onChange={v.nv.setNotes} placeholder="Thanks for your business." rows={3} focusStyle={sx("border-color:var(--ink-6)")} /></label>
                  <div style={sx("display:flex; gap:10px; flex-wrap:wrap")}>
                    <Hoverable as="button" style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 18px; border-radius:9px")} onClick={v.nv.create} hoverStyle={sx("filter:brightness(1.12)")}>Create invoice</Hoverable>
                    <Hoverable as="button" style={sx("font-size:13px; font-weight:600; padding:11px 18px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.nv.draft} hoverStyle={sx("filter:brightness(.97)")}>Save as draft</Hoverable>
                    <Hoverable as="button" disabled={!!v.nv.exportOff} style={sx("font-size:13px; font-weight:600; padding:11px 18px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); opacity:" + (v.nv.exportOff ? ".45" : "1") + "; cursor:" + (v.nv.exportOff ? "default" : "pointer"))} onClick={v.nv.downloadPdf} hoverStyle={sx(v.nv.exportOff ? "" : "filter:brightness(.97)")}>{v.nv.pdfBusy ? "Downloading…" : "Download PDF"}</Hoverable>
                    <Hoverable as="button" disabled={!!v.nv.exportOff} style={sx("font-size:13px; font-weight:600; padding:11px 18px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); opacity:" + (v.nv.exportOff ? ".45" : "1") + "; cursor:" + (v.nv.exportOff ? "default" : "pointer"))} onClick={v.nv.printInvoice} hoverStyle={sx(v.nv.exportOff ? "" : "filter:brightness(.97)")}>Print</Hoverable>
                  </div>
                </div>
              </div>
              <InvoicePreview
                number={v.nv.no}
                client={v.nv.clientLabel}
                clientAddress={v.nv.clientAddress}
                businessName={v.nv.businessName}
                sellerAddress={v.nv.sellerAddress || v.profile.address}
                taxReg={v.nv.taxReg || v.profile.taxRegistrationNumber}
                issued={v.nv.issuedLabel}
                due={v.nv.dueLabel}
                status={v.nv.statusLabel}
                chip={v.nv.statusChip}
                lines={Array.isArray(v.nv.preview) ? v.nv.preview : []}
                subtotal={v.nv.subtotal}
                discount={v.nv.discountAmt}
                total={v.nv.total}
                partialPayment={!!v.nv.partialOn}
                reference={v.nv.reference}
                notes={v.nv.notes}
                bankName={v.nv.bankName}
                accountName={v.nv.accountName}
                iban={v.nv.iban}
              />
            </div>
              </>)}

          {!!(v.it.all) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:16px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Outstanding</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.invSum.outstanding}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>{v.invSum.unpaid} unpaid</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Total invoiced</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.invSum.paid}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>{v.invSum.paidN} invoices</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Overdue</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.invSum.overdue}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>{v.invSum.overdueN} past due</div>
              </div>
            </div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; gap:10px; padding:16px 20px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>All Invoices</div>
                <span style={sx("font-size:12px; color:var(--ink-4)")}>{v.counts.invoices} total</span>
                <div style={sx("flex:1")} />
                <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.note} data-note="Reminders queued for open invoices">Send reminders</button>
                <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.export}>Export</button>
                <button style={sx("font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 15px; border-radius:8px")} onClick={v.h.newInvoice}>New invoice</button>
              </div>
              <div style={sx("display:grid; grid-template-columns:.8fr 1.4fr 1fr .85fr .8fr .8fr; gap:28px; padding:11px 20px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; color:var(--ink-5); letter-spacing:.09em; text-transform:uppercase")}>
                <span>NUMBER</span><span>CLIENT</span><span>AMOUNT</span><span>STATUS</span><span>DUE</span><span>TAG</span>
              </div>
              {!!(v.empt.invoices) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>No invoices yet</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Bill a client and Flow will track what is paid and what is late.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.h.newInvoice} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>New invoice</Hoverable>
                </div>
                  </>)}
              {((v.invoices) || []).map((i: any, iIdx: any) => <Fragment key={i?.id || i?.key || 'i-' + iIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:grid; grid-template-columns:.8fr 1.4fr 1fr .85fr .8fr .8fr; gap:28px; padding:16px 20px; border-bottom:1px solid var(--divider-2); align-items:center; text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={i.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px; font-weight:600")}>{i.no}</span>
                  <span style={sx("font-size:13px; font-weight:600")}>{i.client}</span>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px")}>{i.amt}</span>
                  <span><span style={sx(i.chip)}>{i.status}</span></span>
                  <span style={sx("font-size:12.5px; color:var(--ink-3)")}>{i.due}</span>
                  <span style={sx("font-size:11px; font-weight:600; color:var(--ink-3)")}>{i.tag}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.it.recurring) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("flex:1")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Make this invoice recurring</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>Flow sends it for you on a schedule</div></div>
                  <button style={sx(v.tgs.recurring.Track)} onClick={v.tgs.recurring.go}><span style={sx(v.tgs.recurring.Knob)} /></button>
                </div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px")}>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Client</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.rec.client} onChange={v.F.recClient} placeholder="Select or add a client" /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Amount (QR)</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.rec.amount} onChange={v.F.recAmount} placeholder="0.00" /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Every</div>
                    <select style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.rec.every} onChange={v.F.recEvery}>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                      <option value="Quarter">Quarter</option>
                    </select>
                  </label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Ends</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.rec.ends} onChange={v.F.recEnds} placeholder="After how many sends" /></label>
                </div>
                <Hoverable as="button" style={sx("margin-top:16px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.rec.start} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Start schedule</Hoverable>
                <div style={sx("margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-size:12px; font-weight:650; color:var(--ink-4)")}>NEXT THREE SENDS</div>
                  <div style={sx("display:flex; flex-direction:column; gap:8px; margin-top:10px")}>
                    {!!(v.rec.hasNext) && ((v.rec.next) || []).map((n: any, nIdx: any) => <Fragment key={n?.id || n?.label || 'n-' + nIdx}>
                      <div style={sx("font-size:12.5px; color:var(--ink-3); padding:10px 12px; background:var(--panel-2); border:1px solid transparent; border-radius:10px")}>{n.label}</div>
                    </Fragment>)}
                    {!!(v.rec.none) && (<>
                    <div style={sx("font-size:12.5px; color:var(--ink-4); padding:10px 12px; background:var(--panel-2); border:1px solid transparent; border-radius:10px")}>No recurring invoices are stored.</div>
                    </>)}
                  </div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Running now</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:14px")}>
                  {((v.rec.running) || []).map((row: any, rowIdx: any) => <Fragment key={row?.id || 'r-' + rowIdx}>
                    <div style={sx("border:1px solid transparent; border-radius:12px; padding:13px 14px")}>
                      <div style={sx("font-size:13px; font-weight:600")}>{row.title}</div>
                      <div style={sx("font-size:12px; color:var(--ink-4); margin-top:4px")}>{row.next}</div>
                      <div style={sx("display:flex; gap:8px; margin-top:10px")}>
                        <Hoverable as="button" style={sx("font-size:12px; font-weight:600; padding:7px 12px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={row.send} hoverStyle={sx("filter:brightness(.97)")}>Send now</Hoverable>
                        <Hoverable as="button" style={sx("font-size:12px; font-weight:600; padding:7px 12px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={row.pause} hoverStyle={sx("filter:brightness(.97)")}>Pause</Hoverable>
                        <Hoverable as="button" style={sx("font-size:12px; font-weight:600; padding:7px 12px; border-radius:8px; border:1px solid var(--line); color:var(--neg)")} onClick={row.cancel} hoverStyle={sx("filter:brightness(.97)")}>Cancel</Hoverable>
                      </div>
                    </div>
                  </Fragment>)}
                  {!!(v.rec.none) && (<>
                  <div style={sx("font-size:12.5px; color:var(--ink-4)")}>Nothing is running on a schedule.</div>
                  </>)}
                </div>
              </div>
            </div>
              </>)}

          {!!(v.it.reminders) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>When we nudge clients</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:16px")}>
                  {((v.reminders) || []).map((rm: any, rmIdx: any) => <Fragment key={rm?.id || rm?.key || 'rm-' + rmIdx}>
                        <div style={sx("display:flex; align-items:center; gap:12px; border:1px solid transparent; border-radius:12px; padding:13px 14px")}>
                      <span style={sx("font-size:13px; font-weight:600; flex:1")}>{rm.label}</span>
                      <button style={sx(rm.Track)} onClick={rm.go}><span style={sx(rm.Knob)} /></button>
                    </div>
                      </Fragment>)}
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Send one now</div>
              {!!(v.empt.reminders) && (<>
                      <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Nothing to remind right now</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Reminders go to invoices that are sent, viewed, overdue or awaiting settlement.</div>
                </div>
                    </>)}
              {!!(v.hasReminders) && (<>
                      <div style={sx("display:grid; grid-template-columns:minmax(0,1fr) 84px 78px; gap:14px; padding:11px 20px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span>Client</span><span>Status</span><span />
              </div>
              {((v.reminderInvoices) || []).map((i: any, iIdx: any) => <Fragment key={i?.id || i?.key || 'i-' + iIdx}>
                        <Hoverable as="div" style={sx("display:grid; grid-template-columns:minmax(0,1fr) 84px 78px; gap:14px; align-items:center; padding:14px 20px; border-bottom:1px solid var(--divider-2); transition:background .15s ease")} hoverStyle={sx("background:var(--panel-2)")}>
                    <span style={sx("min-width:0")}>
                      <span style={sx("display:block; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{i.client}</span>
                      <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{i.amt} · due {i.due}</span>
                    </span>
                    <span style={sx(i.chip)}>{i.status}</span>
                    <Hoverable as="button" style={sx("justify-self:end; font-size:12px; font-weight:600; padding:8px 13px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:filter .15s ease")} onClick={i.remind} hoverStyle={sx("filter:brightness(.97)")}>Remind</Hoverable>
                  </Hoverable>
                      </Fragment>)}
                    </>)}
              </div>
            </div>
              </>)}

          {!!(v.it.clients) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(auto-fill,minmax(288px,1fr)); gap:14px")}>
              {((v.clients) || []).map((c: any, cIdx: any) => <Fragment key={c?.id || c?.key || 'c-' + cIdx}>
                    <Hoverable as="button" style={sx("display:flex; flex-direction:column; text-align:left; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); overflow:hidden; transition:transform .18s ease, box-shadow .18s ease")} onClick={c.open} hoverStyle={sx("transform:translateY(-2px); box-shadow:0 22px 40px -28px rgba(0,0,0,.35)")}>
                  <span style={sx("display:flex; align-items:center; gap:12px; padding:18px 20px 16px")}>
                    <span style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--chip); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:700; color:var(--ink-2)")}>{c.initials}</span>
                    <span style={sx("min-width:0; flex:1")}>
                      <span style={sx("display:block; font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{c.name}</span>
                      <span style={sx("display:block; font-size:12px; color:var(--ink-4); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{c.email}</span>
                    </span>
                  </span>
                  <span style={sx("display:grid; grid-template-columns:1fr 1fr; border-top:1px solid var(--divider); background:var(--panel-2)")}>
                    <span style={sx("padding:12px 20px; border-right:1px solid var(--divider)")}>
                      <span style={sx("display:block; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Lifetime</span>
                      <span style={sx("display:block; font-family:'Clash Display','Urbanist',sans-serif; font-size:19px; font-weight:400; letter-spacing:-.025em; margin-top:5px")}>{c.total}</span>
                    </span>
                    <span style={sx("padding:12px 20px")}>
                      <span style={sx("display:block; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Invoices</span>
                      <span style={sx("display:block; font-family:'Clash Display','Urbanist',sans-serif; font-size:19px; font-weight:400; letter-spacing:-.025em; margin-top:5px")}>{c.count}</span>
                    </span>
                  </span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}
            </>)}

        {!!(v.show.accounting) && (<>
              {!!(v.at.zoho) && (<>
                <div style={sx("display:grid; grid-template-columns:1.2fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:42px; height:42px; border-radius:12px; background:var(--neg-soft); color:var(--neg); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700")}>ZB</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:17px; font-weight:600; letter-spacing:-.02em")}>Zoho Books</div><div style={sx("font-size:12.5px; color:var(--ink-4)")}>books.zoho.com · {v.me.business}</div></div>
                  <span style={sx("margin-left:auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                </div>
                <div style={sx("display:flex; align-items:center; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Sync automatically</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Every day at 06:00</div></div>
                  <button style={sx(v.tgs.autoSync.Track)} onClick={v.tgs.autoSync.go}><span style={sx(v.tgs.autoSync.Knob)} /></button>
                </div>
                <div style={sx("display:flex; gap:10px; margin-top:18px")}>
                  <Hoverable as="button" style={sx("font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.h.syncNow} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Sync now</Hoverable>
                  <button style={sx("font-size:13px; font-weight:600; padding:10px 16px; border-radius:10px; border:1px solid var(--line); background:var(--btn-light); color:var(--neg)")} onClick={v.h.note} data-note="Disconnect is sample-only in this sandbox">Disconnect</button>
                </div>
                {!!(v.zoho.hasLast) && (<>
                      <div style={sx("margin-top:14px; font-size:12.5px; color:var(--ink-3)")}>{v.zoho.line}</div>
                    </>)}
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Sync log</div>
                {((v.syncLog) || []).map((sl: any, slIdx: any) => <Fragment key={sl?.id || sl?.key || 'sl-' + slIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={sl.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:12.5px; font-weight:600")}>{sl.target}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{sl.when} · {sl.itemsT} items</div></div>
                    <span style={sx(sl.chip)}>{sl.status}</span>
                  </Hoverable>
                    </Fragment>)}
              </div>
            </div>
            <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-top:16px; padding:2px 0; background:transparent; border:none; font-size:12.5px; font-weight:600; color:var(--ink-4); transition:color .16s ease")} onClick={v.actGo.sync} hoverStyle={sx("color:var(--ink)")}>
              <span>See sync activity</span>
              <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.8 7h8M7.4 3.4 11 7l-3.6 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Hoverable>
              </>)}

          {!!(v.at.tally) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Export for Tally</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>Download an XML file and import it into Tally. Two-way live sync needs a desktop connector, that comes later.</div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px")}>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>From</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); color:var(--ink)")} type="date" value={v.periodFrom} onChange={v.F.periodFrom} /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>To</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); color:var(--ink)")} type="date" value={v.periodTo} onChange={v.F.periodTo} /></label>
                </div>
                <button style={sx("margin-top:16px; font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 18px; border-radius:9px")} onClick={v.h.tallyExport}>Export XML</button>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Export history</div>
                {!!(v.exports.none) && (<>
                      <div style={sx("padding:16px 20px; font-size:12.5px; color:var(--ink-4)")}>No export history is stored.</div>
                    </>)}
                {!!(v.exports.any) && (<>
                      {((v.exports.rows) || []).map((ex: any, exIdx: any) => <Fragment key={ex?.id || ex?.key || 'ex-' + exIdx}>
                        <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={ex.open} hoverStyle={sx("background:var(--panel-2)")}>
                      <div style={sx("flex:1")}><div style={sx("font-size:12.5px; font-weight:600")}>{ex.target}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{ex.when} · {ex.itemsT} items</div></div>
                      <span style={sx(ex.chip)}>{ex.status}</span>
                    </Hoverable>
                      </Fragment>)}
                    </>)}
              </div>
            </div>
            <Hoverable as="button" style={sx("display:inline-flex; align-items:center; gap:7px; margin-top:16px; padding:2px 0; background:transparent; border:none; font-size:12.5px; font-weight:600; color:var(--ink-4); transition:color .16s ease")} onClick={v.actGo.sync} hoverStyle={sx("color:var(--ink)")}>
              <span>See sync activity</span>
              <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.8 7h8M7.4 3.4 11 7l-3.6 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Hoverable>
              </>)}

          {!!(v.at.tax) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px; max-width:720px")}>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Tax</div>
              <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Not registered for this merchant</div>
              <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:14px")}>This merchant is not registered. Qatar commercial invoices do not add a goods-and-services tax line.</div>
              <label style={sx("display:block; margin-top:18px")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Tax registration number</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.profile.taxRegistrationNumber} onChange={v.F.taxRegNumber} placeholder="Not registered" /></label>
            </div>
              </>)}
            </>)}

        {!!(v.show.connections) && (<>
              {!!(v.connStats.show) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-bottom:18px")}>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Active connections</div><div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.connStats.active}</div></div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Needs attention</div><div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.connStats.attention}</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>{v.connStats.who}</div></div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Last check</div><div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>09:41</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Today</div></div>
          </div>
              </>)}
          {!!(v.ct.gateways) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:12px; margin-bottom:20px")}>
            <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--accent-soft); color:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>SC</div>
              <div style={sx("flex:1 1 200px; min-width:0")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>SkipCash</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>Sandbox keys · last event 12 minutes ago</div>
              </div>
              <span style={sx("flex:0 0 auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
              <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.skipcash} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
            </div>
            </div>
            <div style={sx("font-size:12.5px; color:var(--ink-4); margin-bottom:14px")}>One simulated gateway in this phase. These are on the roadmap.</div>
            <div style={sx("display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:12px")}>
              {((v.providers) || []).map((pv: any, pvIdx: any) => <Fragment key={pv?.id || pv?.key || 'pv-' + pvIdx}>
                    <div style={sx("background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:16px")}>
                  <div style={sx("display:flex; align-items:center; gap:10px")}>
                    <div style={sx("width:34px; height:34px; flex:0 0 34px; border-radius:10px; background:linear-gradient(150deg,var(--panel-3),var(--chip)); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:700; color:var(--ink-3)")}>{pv.initial}</div>
                    <div style={sx("font-size:13.5px; font-weight:650; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{pv.n}</div>
                  </div>
                  <div style={sx("font-size:11.5px; color:var(--ink-5); margin-top:10px; line-height:1.45; min-height:32px")}>{pv.s}</div>
                  <button style={sx("margin-top:8px; width:100%; font-size:12.5px; font-weight:600; color:var(--ink-4); background:linear-gradient(170deg,var(--panel-3),var(--panel)); border:1px solid var(--line); padding:8px; border-radius:9px")} onClick={pv.go}>Coming soon</button>
                </div>
                  </Fragment>)}
            </div>
              </>)}


          {!!(v.ct.banks) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:12px")}>
            <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>{v.bank.initials}</div>
              <div style={sx("flex:1 1 200px; min-width:0")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>{v.bank.name}</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{v.bank.note}</div>
              </div>
              <span style={sx("flex:0 0 auto; font-size:12px; color:var(--ink-4)")}>Sample data. Live bank feeds arrive in a later phase.</span>
              <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.bank} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
            </div>
            {(Array.isArray(v.bank?.extra) ? v.bank.extra : []).map((bx: any, bxIdx: any) => <Fragment key={bx?.id || bx?.key || 'bxca-' + bxIdx}>
                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--ink-block); color:var(--on-block); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>{bx.initials}</div>
                <div style={sx("flex:1 1 200px; min-width:0")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>{bx.name}</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{bx.note}</div>
                </div>
                <span style={sx("flex:0 0 auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.bank} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
              </div>
                </Fragment>)}
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Need another bank account?</div>
              <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>Connect another Qatari bank account and Flow will track those payments and expenses alongside your existing accounts. Sample feeds only in this sandbox.</div>
              {!!(v.bankOn.idle && v.bankOn.hasRemaining) && (<>
                    <button type="button" style={sx("margin-top:16px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 18px; border-radius:10px")} onClick={v.connMan.bank}>Connect another bank</button>
                  </>)}
              {!!(v.bankOn.idle && v.bankOn.noneLeft) && (<>
                    <div style={sx("margin-top:16px; font-size:12.5px; color:var(--ink-3); line-height:1.6")}>All sample banks in this sandbox are connected.</div>
                  </>)}
            </div>
            </div>
              </>)}

          {!!(v.ct.platforms) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:12px")}>
            <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--chip); color:var(--ink-2); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>TL</div>
              <div style={sx("flex:1 1 200px; min-width:0")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Tally</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>Last export 1 Aug · XML</div>
              </div>
              <span style={sx("flex:0 0 auto; font-size:12px; color:var(--ink-4)")}>File export</span>
              <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.tally} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
            </div>
            <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--chip); color:var(--ink-2); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>ZB</div>
              <div style={sx("flex:1 1 200px; min-width:0")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Zoho Books</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>Last sync today, 06:00</div>
              </div>
              <span style={sx("flex:0 0 auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
              <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.zoho} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
            </div>
            <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
              <div style={sx("width:40px; height:40px; flex:0 0 40px; border-radius:11px; background:var(--chip); color:var(--ink-2); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11.5px")}>SH</div>
              <div style={sx("flex:1 1 200px; min-width:0")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Shopify</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:2px")}>{v.shopify.appsLine}</div>
              </div>
              {!!(v.shopify.connected) && (<>
                      <span style={sx("flex:0 0 auto; display:inline-flex; align-items:baseline; gap:7px; font-size:12.5px; font-weight:600; color:var(--ink)")}><span style={sx("width:6px; height:6px; flex:0 0 6px; border-radius:50%; background:var(--pos); transform:translateY(-1px)")} />Connected<span style={sx("font-size:11px; font-weight:500; color:var(--ink-5)")}>Simulated</span></span>
                    </>)}
              {!!(v.shopify.disconnected) && (<>
                      <span style={sx("flex:0 0 auto; font-size:12.5px; font-weight:600; color:var(--ink-4)")}>Not connected</span>
                    </>)}
              <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.connMan.shopify} hoverStyle={sx("filter:brightness(.97)")}>Manage</Hoverable>
            </div>
            </div>
              </>)}
            </>)}

        {!!(v.show.reports) && (<>
              {!!(v.rt.overview) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px")}>
              {((v.pnl.cards) || []).map((c: any, cIdx: any) => <Fragment key={c?.id || c?.key || 'c-' + cIdx}>
                    <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                  <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>{c.label}</div>
                  <div style={sx(`font-size:22px; font-weight:700; letter-spacing:-.025em; margin-top:6px; color:${c.color}`)}>{c.val}</div>
                  <div style={sx("font-size:12px; color:var(--ink-4); margin-top:6px")}>{c.note}</div>
                </div>
                  </Fragment>)}
            </div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px; margin-top:18px")}>
              <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Profit &amp; loss, {v.pnl.periodLabel}</div>
              <div style={sx("display:flex; flex-direction:column; margin-top:16px")}>
                {((v.pnl.rows) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                      <div style={sx("display:flex; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid var(--divider-2)")}>
                    <span style={sx(`font-size:13px; font-weight:${r.weight}; flex:1`)}>{r.label}</span>
                    <div style={sx("flex:0 0 220px; height:7px; background:var(--chip); border-radius:4px; overflow:hidden")}>
                      <div style={sx(`height:100%; width:${r.bar}; background:${r.color}; border-radius:4px`)} />
                    </div>
                    <span style={sx(`font-size:13.5px; font-weight:700; width:130px; text-align:right; color:${r.color}`)}>{r.val}</span>
                  </div>
                    </Fragment>)}
              </div>
              <div style={sx("display:flex; align-items:baseline; gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid var(--line)")}>
                <span style={sx("font-size:13.5px; font-weight:700")}>Net profit</span>
                <span style={sx("font-size:12.5px; color:var(--ink-4)")}>{v.pnl.margin} margin</span>
                <span style={sx(`margin-left:auto; font-size:24px; font-weight:700; letter-spacing:-.03em; color:${v.pnl.netColor}`)}>{v.pnl.net}</span>
              </div>
            </div>
              </>)}

          {!!(v.rt.cash) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-bottom:18px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>CASH ON HAND</div><div style={sx("font-size:22px; font-weight:700; letter-spacing:-.025em; margin-top:6px")}>{v.runway.cash}</div></div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>{v.runway.burnLabel}</div><div style={sx("font-size:22px; font-weight:700; letter-spacing:-.025em; margin-top:6px")}>{v.runway.burn}</div></div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>RUNWAY</div><div style={sx("font-size:22px; font-weight:700; letter-spacing:-.025em; margin-top:6px; color:var(--pos)")}>{v.runway.months}</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:6px")}>{v.runway.until}</div></div>
            </div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
              <div style={sx("display:flex; align-items:center; gap:14px")}>
                <div><div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Cash flow &amp; forecast</div><div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:4px")}>Solid bars are actual, outlined bars are projected</div></div>
                <div style={sx("margin-left:auto; display:flex; align-items:center; gap:14px")}>
                  <span style={sx("display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-3)")}><span style={sx("width:10px; height:10px; border-radius:3px; background:var(--pos)")} />In</span>
                  <span style={sx("display:flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-3)")}><span style={sx("width:10px; height:10px; border-radius:3px; background:var(--ink-6)")} />Out</span>
                </div>
              </div>
              <div style={sx("display:flex; align-items:flex-end; gap:14px; margin-top:26px; height:170px")}>
                {((v.forecast) || []).map((c: any, cIdx: any) => <Fragment key={c?.id || c?.key || 'c-' + cIdx}>
                      <div style={sx("flex:1; min-width:0; display:flex; flex-direction:column; align-items:center; gap:9px")}>
                    <div style={sx("display:flex; align-items:flex-end; gap:4px; height:140px")}>
                      <div style={sx(`width:16px; height:${c.inH}; border-radius:5px 5px 0 0; background:${c.inBg}; border:${c.border}`)} />
                      <div style={sx(`width:16px; height:${c.outH}; border-radius:5px 5px 0 0; background:${c.outBg}; border:${c.border}`)} />
                    </div>
                    <span style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600; white-space:nowrap")}>{c.day}</span>
                  </div>
                    </Fragment>)}
              </div>
            </div>
              </>)}

          {!!(v.rt.spend) && (<>
                <div style={sx("display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr); gap:18px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Where money went</div>
                <div style={sx("display:flex; flex-direction:column; gap:12px; margin-top:18px")}>
                  {((v.spend.tags) || []).map((t: any, tIdx: any) => <Fragment key={t?.id || t?.key || 't-' + tIdx}>
                        <button style={sx("text-align:left; display:flex; align-items:center; gap:14px")} onClick={t.go}>
                      <span style={sx("font-size:13px; font-weight:600; width:96px; flex:0 0 96px")}>{t.tag}</span>
                      <span style={sx("flex:1; height:9px; background:var(--chip); border-radius:5px; overflow:hidden; display:block")}><span style={sx(`display:block; height:100%; width:${t.bar}; background:${t.color}; border-radius:5px`)} /></span>
                      <span style={sx("font-size:13px; font-weight:700; width:110px; text-align:right")}>{t.out}</span>
                      <span style={sx("font-size:11.5px; color:var(--ink-4); width:44px; text-align:right")}>{t.pct}</span>
                    </button>
                      </Fragment>)}
                  {!!(v.spend.hasRefunds) && (<>
                        <div style={sx("text-align:left; display:flex; align-items:center; gap:14px")}>
                      <span style={sx("font-size:13px; font-weight:600; width:96px; flex:0 0 96px")}>Refunds</span>
                      <span style={sx("flex:1; font-size:12px; color:var(--ink-4)")}>Not counted as spend</span>
                      <span style={sx("font-size:13px; font-weight:700; width:110px; text-align:right")}>{v.spend.refunds}</span>
                      <span style={sx("font-size:11.5px; color:var(--ink-4); width:44px; text-align:right")} />
                    </div>
                      </>)}
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Biggest vendors</div>
                <div style={sx("display:flex; flex-direction:column; gap:2px; margin-top:14px")}>
                  {((v.spend.vendors) || []).map((v: any, vIdx: any) => <Fragment key={v?.id || v?.key || 'v-' + vIdx}>
                        <div style={sx("display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--divider-2)")}>
                      <span style={sx("width:30px; height:30px; flex:0 0 30px; border-radius:9px; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:10.5px; font-weight:700; color:var(--ink-3)")}>{v.abbr}</span>
                      <div style={sx("min-width:0; flex:1")}><div style={sx("font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{v.name}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{v.tag} · {v.count}</div></div>
                      <span style={sx("font-size:13px; font-weight:700")}>{v.total}</span>
                    </div>
                      </Fragment>)}
                </div>
                <div style={sx("margin-top:16px; background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:13px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>{v.spend.insight}</div>
              </div>
            </div>
              </>)}

          {!!(v.rt.receivables) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:18px")}>
              {((v.ageing.buckets) || []).map((b: any, bIdx: any) => <Fragment key={b?.id || b?.key || 'b-' + bIdx}>
                    <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                  <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>{b.label}</div>
                  <div style={sx(`font-size:22px; font-weight:700; letter-spacing:-.025em; margin-top:6px; color:${b.color}`)}>{b.val}</div>
                  <div style={sx("font-size:12px; color:var(--ink-4); margin-top:6px")}>{b.count}</div>
                </div>
                  </Fragment>)}
            </div>
            <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Who owes you</div>
                <div style={sx("flex:1")} />
                <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:9px 15px; border-radius:8px")} onClick={v.h.note} data-note="Reminders queued for overdue invoices" hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Chase all overdue</Hoverable>
              </div>
              {((v.ageing.rows) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:14px; padding:16px 22px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={r.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <div style={sx("min-width:0; flex:1")}><div style={sx("font-size:13px; font-weight:600")}>{r.client}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{r.no} · due {r.due}</div></div>
                  <span style={sx(`font-size:11px; font-weight:650; color:${r.ageColor}`)}>{r.age}</span>
                  <span style={sx(r.chip)}>{r.status}</span>
                  <span style={sx("font-size:13.5px; font-weight:700; width:120px; text-align:right")}>{r.amt}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.rt.pack) && (<>
                <div style={sx("display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:18px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Accountant pack</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>One download with everything your accountant asks for, structured and ready to file.</div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px")}>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Period</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.pack.period} /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Format</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13.5px; background:var(--panel)")} defaultValue="ZIP (PDF + CSV + XML)" /></label>
                </div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:18px")}>
                  {((v.pack.items) || []).map((p: any, pIdx: any) => <Fragment key={p?.id || p?.key || 'p-' + pIdx}>
                        <div style={sx("display:flex; align-items:center; gap:11px; padding:12px 14px; border:1px solid var(--line); border-radius:11px; background:var(--panel-3)")}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="m5 10.4 3.5 3.5L15.4 6.6" stroke="var(--pos)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span style={sx("font-size:13px; font-weight:600; flex:1")}>{p.label}</span>
                      <span style={sx("font-size:11.5px; color:var(--ink-4)")}>{p.meta}</span>
                    </div>
                      </Fragment>)}
                </div>
                <button style={sx("margin-top:18px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:11px 18px; border-radius:9px")} onClick={v.h.export}>Download pack</button>
              </div>
              <div style={sx("display:flex; flex-direction:column; gap:18px")}>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px")}>
                  <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Saved reports</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>Packs you download are saved here for 12 months.</div>
                  <div style={sx("display:flex; flex-direction:column; gap:2px; margin-top:12px")}>
                    {!!(v.empt.reports) && (<>
                          <div style={sx("display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid var(--divider-2)")}>
                        <div style={sx("flex:1")}>
                          <div style={sx("height:12px; width:46%; max-width:168px; border-radius:4px; background:var(--chip)")} />
                          <div style={sx("height:10px; width:34%; max-width:118px; border-radius:4px; background:var(--chip); margin-top:8px; opacity:.65")} />
                        </div>
                        <span style={sx("height:10px; width:32px; flex:0 0 32px; border-radius:4px; background:var(--chip)")} />
                      </div>
                        </>)}
                    {((v.reports) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                          <button style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid var(--divider-2); text-align:left")} onClick={r.open}>
                        <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:650")}>{r.name}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{r.range} · built {r.built}</div></div>
                        <span style={sx("font-size:11px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5); white-space:nowrap")}>{r.type}</span>
                      </button>
                        </Fragment>)}
                  </div>
                </div>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px")}>
                  <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Send it monthly</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>We can email the pack to {v.pack.accountant} on the 1st of every month.</div>
                  <Hoverable as="button" style={sx("margin-top:14px; font-size:12.5px; font-weight:600; padding:9px 15px; border-radius:8px; border:1px solid var(--line); background:linear-gradient(170deg,var(--panel-3),var(--panel)); transition:background .15s ease")} onClick={v.h.copy} hoverStyle={sx("background:var(--panel-3)")}>Turn on monthly send</Hoverable>
                </div>
              </div>
            </div>
              </>)}

          {!!(v.rt.branches) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Branch performance</div>
                <div style={sx("flex:1")} />
                <span style={sx("font-size:12px; color:var(--ink-4)")}>{v.reportsLabel}</span>
              </div>
              <div style={sx("display:grid; grid-template-columns:1.3fr 1fr 1fr .8fr; gap:24px; padding:11px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span>BRANCH</span><span style={sx("text-align:right")}>REVENUE</span><span style={sx("text-align:right")}>SHARE</span><span style={sx("text-align:right")}>PEOPLE</span>
              </div>
              {((v.branchPerf) || []).map((b: any, bIdx: any) => <Fragment key={b?.id || b?.key || 'b-' + bIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:grid; grid-template-columns:1.3fr 1fr 1fr .8fr; gap:24px; padding:16px 22px; border-bottom:1px solid var(--divider-2); align-items:center; text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={b.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <div style={sx("display:flex; align-items:center; gap:10px; min-width:0")}>
                    <span style={sx("width:30px; height:30px; flex:0 0 30px; border-radius:9px; background:var(--ink-block); color:var(--on-block); font-size:10.5px; font-weight:700; display:flex; align-items:center; justify-content:center")}>{b.initials}</span>
                    <div style={sx("min-width:0")}><div style={sx("font-size:13px; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{b.name}</div><div style={sx("font-size:11.5px; color:var(--ink-4)")}>{b.sub}</div></div>
                  </div>
                  <span style={sx("font-size:13.5px; font-weight:700; text-align:right")}>{b.rev}</span>
                  <div style={sx("display:flex; align-items:center; gap:9px; justify-content:flex-end")}>
                    <span style={sx("width:70px; height:7px; background:var(--chip); border-radius:4px; overflow:hidden; display:block")}><span style={sx(`display:block; height:100%; width:${b.share}; background:var(--pos); border-radius:4px`)} /></span>
                    <span style={sx("font-size:12px; color:var(--ink-3); width:38px; text-align:right")}>{b.share}</span>
                  </div>
                  <span style={sx("font-size:13px; text-align:right; color:var(--ink-3)")}>{b.staffT}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}
            </>)}

        {!!(v.show.team) && (<>
              {!!(v.mt.members) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>People with access</div>
                <div style={sx("flex:1")} />
                <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:9px 15px; border-radius:8px")} onClick={v.h.newMember} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Invite</Hoverable>
              </div>
              <div style={sx("display:grid; grid-template-columns:minmax(0,1fr) 132px 132px; gap:16px; padding:11px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span>Person</span><span>Role</span><span>Last active</span>
              </div>
              {!!(v.empt.team) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Only you have access</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Invite your accountant or a staff member and set what they can reach.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.h.newMember} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Invite someone</Hoverable>
                </div>
                  </>)}
              {((v.team) || []).map((m: any, mIdx: any) => <Fragment key={m?.id || m?.key || 'm-' + mIdx}>
                    <Hoverable as="button" style={sx("width:100%; display:grid; grid-template-columns:minmax(0,1fr) 132px 132px; gap:16px; align-items:center; padding:15px 22px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={m.open} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("display:flex; align-items:center; gap:13px; min-width:0")}>
                    <span style={sx("width:36px; height:36px; flex:0 0 36px; border-radius:11px; background:var(--chip); font-size:12px; font-weight:700; color:var(--ink-3); display:flex; align-items:center; justify-content:center")}>{m.initials}</span>
                    <span style={sx("min-width:0")}>
                      <span style={sx("display:block; font-size:13.5px; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{m.name}</span>
                      <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{m.email}</span>
                    </span>
                  </span>
                  <span style={sx("font-size:12.5px; font-weight:600; color:var(--ink-2)")}>{m.role}</span>
                  <span style={sx("font-size:12px; color:var(--ink-5)")}>{m.last}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.mt.permissions) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card)")}>
              <div style={sx("padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>What each role can reach</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Pick a level for each role</div>
              </div>
              <div style={sx("display:grid; grid-template-columns:1.4fr repeat(3,minmax(0,1fr)); gap:12px; padding:11px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span>AREA</span><span style={sx("text-align:center")}>OWNER</span><span style={sx("text-align:center")}>ACCOUNTANT</span><span style={sx("text-align:center")}>STAFF</span>
              </div>
              {((v.perms) || []).map((p: any, pIdx: any) => <Fragment key={p?.id || p?.key || 'p-' + pIdx}>
                    <Hoverable as="div" style={sx("display:grid; grid-template-columns:1.4fr repeat(3,minmax(0,1fr)); gap:12px; padding:9px 22px; border-bottom:1px solid var(--divider-2); align-items:center; transition:background .15s ease")} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("font-size:13px; font-weight:600")}>{p.area}</span>
                  {((p.cells) || []).map((c: any, cIdx: any) => <Fragment key={c?.id || c?.key || 'c-' + cIdx}>
                        <div style={sx("position:relative; display:flex; justify-content:center")}>
                      <Hoverable as="button" style={sx(c.style)} onClick={c.go} hoverStyle={sx("background:var(--panel-3)")}>
                        <span>{c.label}</span>
                        <svg style={sx("flex:0 0 10px")} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.4 3.9 5 6.5l2.6-2.6" stroke={c.caret} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </Hoverable>
                      <Presence show={!!c.open} kind="menu">
                            <div className="flow-open-scrim" style={sx("position:absolute; top:calc(100% + 5px); left:50%; transform:translateX(-50%); z-index:30; width:132px; padding:5px; background:var(--modal); backdrop-filter:blur(24px) saturate(150%); border:1px solid var(--line); border-radius:11px; box-shadow:0 22px 44px -22px rgba(0,0,0,.45)")}>
                          {((c.options) || []).map((o: any, oIdx: any) => <Fragment key={o?.id || o?.key || 'o-' + oIdx}>
                                <Hoverable as="button" style={sx(o.style)} onClick={o.go} hoverStyle={sx("background:var(--panel-3)")}>
                              {!!(o.on) && (<>
                                    <svg style={sx("flex:0 0 11px")} width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.2 6.2 4.6 8.6 9.8 3.4" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  </>)}
                              <span>{o.label}</span>
                            </Hoverable>
                              </Fragment>)}
                        </div>
                          </Presence>
                    </div>
                      </Fragment>)}
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}

          {!!(v.mt.approvals) && (<>
                <div style={sx("display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); gap:18px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Approval limits</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:8px")}>Anything above a person's limit waits for the owner to approve.</div>
                <div style={sx("display:flex; flex-direction:column; margin-top:18px; border-top:1px solid var(--divider)")}>
                  {((v.limits) || []).map((l: any, lIdx: any) => <Fragment key={l?.id || l?.key || 'l-' + lIdx}>
                        <div style={sx("display:flex; align-items:center; gap:16px; padding:14px 0; border-bottom:1px solid var(--divider-2)")}>
                      <span style={sx("min-width:0; flex:1")}>
                        <span style={sx("display:block; font-size:13px; font-weight:650; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{l.name}</span>
                        <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{l.role} · can approve up to</span>
                      </span>
                      <Hoverable as="input" style={sx("flex:0 0 128px; width:128px; padding:9px 12px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:13px; font-weight:650; text-align:right; background:var(--panel); transition:border-color .15s ease")} value={l.cap} onChange={l.setCap} readOnly={l.readOnly} focusStyle={sx("border-color:var(--ink-6)")} />
                    </div>
                      </Fragment>)}
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("display:flex; align-items:center; gap:10px; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                  <div style={sx("font-size:16.5px; font-weight:700; letter-spacing:-.02em")}>Waiting on you</div>
                  <span style={sx("font-size:12.5px; font-weight:650; color:var(--ink-4)")}>{v.pending.count}</span>
                </div>
                {((v.pending.items) || []).map((p: any, pIdx: any) => <Fragment key={p?.id || p?.key || 'p-' + pIdx}>
                      <div style={sx("padding:16px 22px; border-bottom:1px solid var(--divider-2)")}>
                    <div style={sx("display:flex; align-items:baseline; gap:10px")}>
                      <span style={sx("font-size:15px; font-weight:700")}>{p.amt}</span>
                      <span style={sx("font-size:12px; color:var(--ink-4)")}>{p.what}</span>
                    </div>
                    <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:5px")}>Requested by {p.who} · {p.when}</div>
                    <div style={sx("display:flex; gap:8px; margin-top:12px")}>
                      <button style={sx("font-size:12px; font-weight:600; color:var(--ink-3); padding:7px 13px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={p.reject}>Decline</button>
                      <button style={sx("font-size:12px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, box-shadow .15s ease, filter .15s ease; padding:7px 14px; border-radius:8px")} onClick={p.approve}>Approve</button>
                    </div>
                  </div>
                    </Fragment>)}
                {!!(v.pending.none) && (<>
                      <div style={sx("padding:40px 22px; text-align:center")}>
                    <div style={sx("font-size:13.5px; font-weight:650")}>Nothing to approve</div>
                    <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Requests over a limit will show up here.</div>
                  </div>
                    </>)}
              </div>
            </div>
              </>)}

          {!!(v.mt.audit) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; padding:18px 22px; border-bottom:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Activity</div>
                <div style={sx("flex:1")} />
                <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:linear-gradient(170deg,var(--panel-3),var(--panel)); transition:background .15s ease")} onClick={v.h.export} hoverStyle={sx("background:var(--panel-3)")}>Export</Hoverable>
              </div>
              <div style={sx("display:flex; align-items:center; gap:8px; padding:12px 22px; border-bottom:1px solid var(--divider); flex-wrap:wrap")}>
                <span style={sx("font-size:10.5px; font-weight:700; color:var(--ink-5); letter-spacing:.09em; margin-right:4px")}>TYPE</span>
                {((v.actFilters) || []).map((af: any, afIdx: any) => <Fragment key={af?.id || af?.key || 'af-' + afIdx}>
                      <button style={sx(af.style)} onClick={af.go}>{af.label}</button>
                    </Fragment>)}
              </div>
              {!!(v.actNone) && (<>
                    <div style={sx("padding:34px 22px; text-align:center; font-size:13px; color:var(--ink-4)")}>Nothing recorded under this type yet.</div>
                  </>)}
              <div style={sx("display:grid; grid-template-columns:118px 168px minmax(0,1fr) 104px; gap:16px; padding:11px 22px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>
                <span>When</span><span>Who</span><span>What happened</span><span>Type</span>
              </div>
              {((v.history) || []).map((hi: any, hiIdx: any) => <Fragment key={hi?.id || hi?.key || 'hi-' + hiIdx}>
                    <Hoverable as="div" style={sx("display:grid; grid-template-columns:118px 168px minmax(0,1fr) 104px; gap:16px; padding:14px 22px; border-bottom:1px solid var(--divider-2); align-items:center; transition:background .15s ease")} hoverStyle={sx("background:var(--panel-2)")}>
                  <span style={sx("font-size:12px; color:var(--ink-4)")}>{hi.when}</span>
                  <span style={sx("display:flex; align-items:center; gap:9px; min-width:0")}>
                    <span style={sx(hi.avatarStyle)}>{hi.avatar}</span>
                    <span style={sx("font-size:12.5px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{hi.who}</span>
                  </span>
                  <span style={sx("font-size:13px; color:var(--ink-2); text-wrap:pretty")}>{hi.what}</span>
                  <span style={sx(hi.kindStyle)}>{hi.kindLabel}</span>
                </Hoverable>
                  </Fragment>)}
            </div>
              </>)}
            </>)}

        {!!(v.show.payroll) && (<>
              {!!(v.yt.employees) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
              <div style={sx("display:flex; align-items:center; padding:16px 20px; border-bottom:1px solid var(--divider)")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Employees</div><div style={sx("flex:1")} /><button style={sx("font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 15px; border-radius:8px")} onClick={v.h.newEmployee}>Add employee</button></div>
              <div style={sx("display:grid; grid-template-columns:1.3fr 1fr 1fr 1fr 72px; gap:24px; padding:11px 20px; border-bottom:1px solid var(--divider); font-size:10.5px; font-weight:700; color:var(--ink-5); letter-spacing:.09em; text-transform:uppercase")}><span>Name</span><span>Role</span><span>Monthly</span><span>Paid by</span><span /></div>
              {!!(v.empt.employees) && (<>
                    <div style={sx("display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:52px 24px")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; letter-spacing:-.02em")}>Nobody on payroll yet</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); max-width:320px; line-height:1.6")}>Add an employee and Flow works out deductions and payslips for you.</div>
                  <Hoverable as="button" style={sx("margin-top:12px; font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:10px 18px; border-radius:9px")} onClick={v.h.newEmployee} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Add employee</Hoverable>
                </div>
                  </>)}
              {((v.employees) || []).map((e: any, eIdx: any) => <Fragment key={e?.id || e?.key || 'e-' + eIdx}>
                    <Hoverable as="div" style={sx("display:grid; grid-template-columns:1.3fr 1fr 1fr 1fr 72px; gap:24px; padding:14px 20px; border-bottom:1px solid var(--divider-2); align-items:center; transition:background .15s ease")} hoverStyle={sx("background:var(--panel-2)")}>
                  <Hoverable as="button" style={sx("text-align:left; font-size:13px; font-weight:650")} onClick={e.open} hoverStyle={sx("color:var(--accent)")}>{e.name}</Hoverable>
                  <span style={sx("font-size:12.5px; color:var(--ink-3)")}>{e.role}</span>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px")}>{e.sal}</span>
                  <span style={sx("font-size:12.5px; color:var(--ink-3)")}>{e.method}</span>
                  <Hoverable as="button" style={sx("justify-self:end; display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; color:var(--ink-4); padding:6px 10px; border-radius:8px; transition:background .15s ease, color .15s ease")} onClick={e.edit} hoverStyle={sx("background:var(--panel-3); color:var(--ink)")}>
                    <svg style={sx("flex:0 0 13px")} width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M13.4 3.6l3 3L7.8 15.2l-3.8.8.8-3.8 8.6-8.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Edit
                  </Hoverable>
                </Hoverable>
                  </Fragment>)}
            </div>
            <div style={sx("margin-top:14px; background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:14px; padding:14px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>Flow records payslips and pushes the expense to your books. You still make the actual transfer, automatic payouts come in a later phase.</div>
              </>)}

          {!!(v.yt.payslips) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Monthly payroll</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.payroll.total}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Before deductions</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Net to pay</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.payroll.net}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>After {v.payroll.pctText} deductions</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); padding:18px 20px")}>
                <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>On payroll</div>
                <div style={sx("font-family:'Clash Display','Urbanist',sans-serif; font-size:28px; font-weight:400; letter-spacing:-.03em; margin-top:8px")}>{v.payroll.count}</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Active employees</div>
              </div>
            </div>
            <div style={sx("margin-top:16px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px; display:flex; align-items:center; gap:16px")}>
              <div style={sx("flex:1")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Send payroll to Transactions</div><div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:4px")}>Adds one expense line tagged Salaries, ready for your books.</div></div>
              <Hoverable as="button" style={sx(v.payroll.postStyle)} onClick={v.payroll.post} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>{v.payroll.postLabel}</Hoverable>
            </div>
            <div style={sx("display:grid; grid-template-columns:1fr 1.2fr; gap:22px; align-items:start; margin-top:16px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Generate payslips</div>
                <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:16px")}>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Period</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.payroll.period} onChange={v.payroll.setPeriod} /></label>
                  <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Employees</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} defaultValue={`All (${v.payroll.count})`} /></label>
                  <button style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 18px; border-radius:9px")} onClick={v.h.generatePayslips}>Generate</button>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Breakdown preview</div>
                <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:16px")}>
                  <div style={sx("display:flex; justify-content:space-between; font-size:13px")}><span style={sx("color:var(--ink-3)")}>Base salaries</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>{v.payroll.total}</span></div>
                  <div style={sx("display:flex; justify-content:space-between; font-size:13px")}><span style={sx("color:var(--ink-3)")}>Deductions</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>-{v.payroll.deductions}</span></div>
                  <div style={sx("display:flex; justify-content:space-between; align-items:baseline; padding-top:12px; margin-top:6px; border-top:1px solid var(--divider)")}><span style={sx("font-size:13px; font-weight:650")}>Net to pay</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600")}>{v.payroll.net}</span></div>
                </div>
              </div>
            </div>
              </>)}

          {!!(v.yt.tax) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Qatar rates in use</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Change a rate and every payroll figure follows</div>
                <div style={sx("display:flex; flex-direction:column; margin-top:16px; border-top:1px solid var(--divider)")}>
                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid var(--divider-2)")}>
                    <span style={sx("flex:1 1 160px; min-width:0")}>
                      <span style={sx("display:block; font-size:13px; font-weight:600")}>Withholding, services</span>
                      <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Applied to salaries and service invoices</span>
                    </span>
                    <span style={sx("flex:0 0 auto; display:flex; align-items:center; gap:7px")}>
                      <Hoverable as="input" style={sx("width:74px; padding:9px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:13px; font-weight:650; text-align:right; background:var(--panel); transition:border-color .15s ease")} value={v.rates.wht} onChange={v.rates.setwht} inputMode="decimal" focusStyle={sx("border-color:var(--ink-6)")} />
                      <span style={sx("font-size:12.5px; color:var(--ink-4)")}>%</span>
                    </span>
                  </div>
                  <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid var(--divider-2)")}>
                    <span style={sx("flex:1 1 160px; min-width:0")}>
                      <span style={sx("display:block; font-size:13px; font-weight:600")}>Withholding, royalties</span>
                      <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Applied to royalty payments</span>
                    </span>
                    <span style={sx("flex:0 0 auto; display:flex; align-items:center; gap:7px")}>
                      <Hoverable as="input" style={sx("width:74px; padding:9px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:13px; font-weight:650; text-align:right; background:var(--panel); transition:border-color .15s ease")} value={v.rates.royalty} onChange={v.rates.setroyalty} inputMode="decimal" focusStyle={sx("border-color:var(--ink-6)")} />
                      <span style={sx("font-size:12.5px; color:var(--ink-4)")}>%</span>
                    </span>
                  </div>
                </div>
                <Hoverable as="button" style={sx("margin-top:18px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:11px 20px; border-radius:9px")} onClick={v.rates.save} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Save rates</Hoverable>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>This period</div>
                <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:16px")}>
                  <div style={sx("display:flex; justify-content:space-between; font-size:13px")}><span style={sx("color:var(--ink-3)")}>Payroll base</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>{v.payroll.total}</span></div>
                  <div style={sx("display:flex; justify-content:space-between; font-size:13px")}><span style={sx("color:var(--ink-3)")}>Withholding due</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>{v.payroll.deductions}</span></div>
                </div>
                <div style={sx("margin-top:16px; font-size:12.5px; color:var(--ink-4); line-height:1.5")}>These are indicative figures for your records, confirm with your accountant before filing.</div>
              </div>
            </div>
              </>)}
            </>)}

        {!!(v.show.settings) && (<>
              {!!(v.st.tags) && (<>
                <div style={sx("display:grid; grid-template-columns:1.4fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Tag as you go</div>
                {((v.rows) || []).map((t: any, tIdx: any) => <Fragment key={t?.id || t?.key || 't-' + tIdx}>
                      <div style={sx("display:flex; align-items:center; gap:12px; padding:15px 20px; border-bottom:1px solid var(--divider-2)")}>
                    <div style={sx("min-width:0; flex:1")}><div style={sx("font-size:13px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{t.party}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{t.d} · {t.src}</div></div>
                    <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px")}>{t.amt}</span>
                    <span style={sx("font-size:11px; font-weight:600; color:var(--accent); background:var(--accent-soft); padding:4px 10px; border-radius:7px; min-width:78px; text-align:center")}>{t.tag}</span>
                  </div>
                    </Fragment>)}
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Manage tags</div>
                <div style={sx("display:flex; flex-direction:column; gap:8px; margin-top:14px")}>
                  {((v.tagList) || []).map((tg: any, tgIdx: any) => <Fragment key={tg?.id || tg?.key || 'tg-' + tgIdx}>
                        <div style={sx("display:flex; align-items:center; gap:10px; border:1px solid transparent; border-radius:11px; padding:11px 13px")}>
                      <input style={sx("flex:1; min-width:0; padding:0; border:none; outline:none; background:transparent; font-size:13px; font-weight:600")} value={tg.value} onChange={tg.setName} />
                      <span style={sx("font-size:11.5px; color:var(--ink-4)")}>{tg.count} items</span>
                      <button style={sx("font-size:12px; font-weight:600")} onClick={tg.rename}>Rename</button>
                      <button style={sx("font-size:12px; font-weight:600; color:var(--neg)")} onClick={tg.del}>Remove</button>
                    </div>
                      </Fragment>)}
                </div>
                <div style={sx("margin-top:14px; font-size:12.5px; color:var(--ink-4); line-height:1.5")}>Tags work like cost centres, use them to see where money goes without an accountant's chart of accounts.</div>
              </div>
            </div>
              </>)}


          {!!(v.st.profile) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px; max-width:720px")}>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Business Profile</div>
              <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:18px")}>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Business name</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.businessName} onChange={v.F.businessName} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Legal entity</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.legalEntity} onChange={v.F.legalEntity} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Tax registration number</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.profile.taxRegistrationNumber} onChange={v.F.taxRegNumber} placeholder="Not registered" /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Industry</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.industry} onChange={v.F.industry} /></label>
                <label style={sx("grid-column:span 2")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Address</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.address} onChange={v.F.profileAddress} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Currency</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.profile.currency} onChange={v.F.profileCurrency} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Bank name</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.bankName || ""} onChange={v.F.profileBankName} placeholder="Ahli Bank" /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Account name</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.profile.accountName || ""} onChange={v.F.profileAccountName} placeholder={v.profile.businessName} /></label>
                <label style={sx("grid-column:span 2")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>IBAN</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.profile.iban || ""} onChange={v.F.profileIban} placeholder="QA00 AHLB 0000 0000 0000 0000 000" /></label>
              </div>
              <button style={sx("margin-top:20px; font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 20px; border-radius:9px")} onClick={v.h.saveProfile}>Save changes</button>
            </div>
              </>)}

          {!!(v.st.account) && (<>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:24px; max-width:720px")}>
              <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Account</div>
              <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:18px")}>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Your name</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); transition:border-color .15s ease")} value={v.acct.name} onChange={v.acct.setName} focusStyle={sx("border-color:var(--ink-6)")} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Email</div><Hoverable as="input" style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); transition:border-color .15s ease")} value={v.acct.email} onChange={v.acct.setEmail} focusStyle={sx("border-color:var(--ink-6)")} /></label>
                <label style={sx("grid-column:span 2")}>
                  <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Password</div>
                  <span style={sx("display:flex; gap:10px")}>
                    <Hoverable as="input" style={sx("flex:1; min-width:0; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); transition:border-color .15s ease")} type={v.acct.pwType} value={v.acct.pw} onChange={v.acct.setPw} placeholder="Enter a new password" focusStyle={sx("border-color:var(--ink-6)")} />
                    <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:600; padding:0 14px; border-radius:10px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink-3); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.acct.togglePw} hoverStyle={sx("filter:brightness(.97)")}>{v.acct.pwLabel}</Hoverable>
                  </span>
                  <span style={sx(`display:block; font-size:11.5px; color:${v.acct.hintColor}; margin-top:6px`)}>{v.acct.hint}</span>
                </label>
              </div>
              <div style={sx("margin-top:20px; padding-top:18px; border-top:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:14px; font-weight:600; letter-spacing:-.015em")}>Tell me about</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Pick how you hear about each thing</div>
                <div style={sx("display:flex; flex-direction:column; margin-top:14px; border-top:1px solid var(--divider-2)")}>
                  {((v.notif) || []).map((n: any, nIdx: any) => <Fragment key={n?.id || n?.key || 'n-' + nIdx}>
                        <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid var(--divider-2)")}>
                      <span style={sx("flex:1 1 160px; font-size:13px; font-weight:600")}>{n.label}</span>
                      <span style={sx("flex:0 0 auto; display:flex; gap:3px; padding:3px; background:var(--panel-2); border:1px solid var(--line); border-radius:9px")}>
                        {((n.options) || []).map((o: any, oIdx: any) => <Fragment key={o?.id || o?.key || 'o-' + oIdx}>
                              <button style={sx(o.style)} onClick={o.go}>{o.label}</button>
                            </Fragment>)}
                      </span>
                    </div>
                      </Fragment>)}
                </div>
              </div>
              <Hoverable as="button" style={sx("margin-top:20px; font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 8px 18px -10px rgba(0,0,0,.5); transition:transform .15s ease, filter .15s ease; padding:11px 20px; border-radius:9px")} onClick={v.acct.save} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Save changes</Hoverable>
              <div style={sx("margin-top:20px; padding-top:18px; border-top:1px solid var(--divider)")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:14px; font-weight:600; letter-spacing:-.015em")}>Reset demo data</div>
                <div style={sx("font-size:12px; color:var(--ink-4); margin-top:3px")}>Restores the seed and clears simulated payments, matches, scans, links and subscriptions.</div>
                <Hoverable as="button" style={sx("margin-top:14px; font-size:13px; font-weight:650; padding:11px 20px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.h.resetDemo} hoverStyle={sx("filter:brightness(.97)")}>Reset demo data</Hoverable>
              </div>
            </div>
              </>)}

          {!!(v.st.security) && (<>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:22px; align-items:start")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Sign-in security</div>
                <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:16px")}>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Two-factor authentication</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>A code from your phone at every login</div></div>
                    <button style={sx(v.tgs.twofa.Track)} onClick={v.tgs.twofa.go}><span style={sx(v.tgs.twofa.Knob)} /></button>
                  </div>
                  <div style={sx("display:flex; align-items:center; gap:12px")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Fingerprint or Face ID</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Uses your device, password still works as backup</div></div>
                    <button style={sx(v.tgs.biometric.Track)} onClick={v.tgs.biometric.go}><span style={sx(v.tgs.biometric.Knob)} /></button>
                  </div>
                </div>
                <div style={sx("margin-top:20px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-size:13px; font-weight:700")}>Where you're signed in</div>
                  <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:12px")}>
                    <div style={sx("display:flex; align-items:center; gap:10px; font-size:12.5px")}><span style={sx("flex:1")}>MacBook Pro, Doha</span><span style={sx("font-size:11px; color:var(--ink-2); font-weight:650")}>This device</span></div>
                    <div style={sx("display:flex; align-items:center; gap:10px; font-size:12.5px")}><span style={sx("flex:1")}>iPhone 15, Doha</span><button style={sx("font-size:11.5px; font-weight:600; color:var(--neg)")} onClick={v.h.note} data-note="Signed out of iPhone 15">Sign out</button></div>
                  </div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                <div style={sx("display:flex; align-items:center; gap:10px")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>API keys</div><span style={sx("font-size:11px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>Sandbox</span></div>
                <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:16px")}>
                  <div style={sx("border:1px solid transparent; border-radius:12px; padding:13px")}><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Publishable key</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; margin-top:5px")}>pk_sandbox_qa_8f21••••</div></div>
                  <div style={sx("border:1px solid transparent; border-radius:12px; padding:13px")}><div style={sx("font-size:11.5px; color:var(--ink-4); font-weight:600")}>Secret key</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; margin-top:5px")}>sk_sandbox_qa_••••••••</div></div>
                </div>
                <button style={sx("margin-top:14px; font-size:12.5px; font-weight:600; padding:9px 15px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.note} data-note="Keys rolled. Update your gateway">Roll keys</button>
              </div>
            </div>
              </>)}

          {!!(v.st.billing) && (<>
                <div style={sx("display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px")}>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("display:flex; align-items:center; gap:8px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>{v.plan.tier}</span><span style={sx("font-size:10.5px; font-weight:650; color:var(--accent); background:var(--accent-soft); padding:3px 8px; border-radius:6px")}>CURRENT</span></div>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:24px; font-weight:600; margin-top:10px")}>{v.plan.price}<span style={sx("font-size:12px; color:var(--ink-4)")}>/mo</span></div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.5")}>{v.plan.limitLabel}</div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Free</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.5")}>Not on this account</div>
                <button style={sx("margin-top:14px; width:100%; font-size:12.5px; font-weight:600; padding:9px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.note} data-note="Downgrade is sample-only in this sandbox">Downgrade</button>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Growth</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.5")}>Not on this account</div>
                <button style={sx("margin-top:14px; width:100%; font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px; border-radius:9px")} onClick={v.h.note} data-note="Upgrade is sample-only in this sandbox">Upgrade</button>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Custom</div>
                <div style={sx("font-size:18px; font-weight:650; margin-top:12px")}>Talk to us</div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.5")}>Multiple branches, dedicated support</div>
                <button style={sx("margin-top:14px; width:100%; font-size:12.5px; font-weight:600; padding:9px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.note} data-note="Sales request noted">Contact sales</button>
              </div>
            </div>
            <div style={sx("margin-top:16px; background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
              <div style={sx("display:flex; align-items:center; gap:10px")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>This month's usage</div><div style={sx("margin-left:auto; font-size:12.5px; color:var(--ink-3)")}>{v.usage.label}</div></div>
              <div style={sx("height:9px; background:var(--divider); border-radius:5px; margin-top:12px; overflow:hidden")}><div style={sx(`height:100%; width:${v.usage.pct}; background:linear-gradient(90deg,var(--accent),var(--accent-2)); border-radius:5px`)} /></div>
            </div>
              </>)}
            </>)}

        {!!(v.detail.on) && (<>
              <div style={sx("width:100%")}>
            {!!(v.det.txn) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:flex-start; gap:14px")}>
                  <div>
                    <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:34px; font-weight:600; letter-spacing:-.02em")}>{v.det.o.amt}</div>
                    <div style={sx("font-size:14px; font-weight:600; margin-top:6px")}>{v.det.o.party}</div>
                  </div>
                  <span style={sx(`margin-left:auto; ${v.det.o.chip}`)}>{v.det.o.status}</span>
                </div>
                <div style={sx("display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:24px; padding-top:20px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>DATE</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.d}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>SOURCE</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.src}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>TAG</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.tag}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>MATCHED</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px; color:var(--ink-3)")}>Waiting for review</div></div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px; margin-top:16px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>What happened to this payment</div>
                <div style={sx("display:flex; flex-direction:column; gap:12px; margin-top:16px")}>
                  <div style={sx("display:flex; gap:12px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:11.5px; color:var(--ink-4); width:96px; flex:0 0 96px")}>09:41</span><span style={sx("font-size:12.5px")}>Payment authorised by SkipCash</span></div>
                  <div style={sx("display:flex; gap:12px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:11.5px; color:var(--ink-4); width:96px; flex:0 0 96px")}>09:42</span><span style={sx("font-size:12.5px")}>Matched to invoice automatically</span></div>
                  <div style={sx("display:flex; gap:12px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:11.5px; color:var(--ink-4); width:96px; flex:0 0 96px")}>10:02</span><span style={sx("font-size:12.5px")}>Confirmed by {v.ownerName}</span></div>
                  <div style={sx("display:flex; gap:12px")}><span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:11.5px; color:var(--ink-4); width:96px; flex:0 0 96px")}>06:00 +1</span><span style={sx("font-size:12.5px")}>Pushed to Zoho Books</span></div>
                </div>
              </div>
                </>)}

            {!!(v.det.invoice) && (<>
                  <div style={sx("display:grid; grid-template-columns:1.1fr 1fr; gap:16px; align-items:start")}>
                <InvoicePreview
                  number={v.det.o.no}
                  client={v.det.o.client}
                  clientAddress={v.det.o.clientAddress}
                  businessName={v.det.o.businessName}
                  sellerAddress={v.det.o.sellerAddress || v.profile.address}
                  taxReg={v.det.o.taxReg || v.profile.taxRegistrationNumber}
                  issued={v.det.o.issuedLabel || v.det.o.issued}
                  due={v.det.o.due}
                  status={v.det.o.status}
                  chip={v.det.o.chip}
                  lines={Array.isArray(v.det.o.previewLines) ? v.det.o.previewLines : []}
                  subtotal={v.det.o.previewSubtotal}
                  discount={v.det.o.previewDiscount}
                  total={v.det.o.total}
                  partialPayment={!!v.det.o.partialPayment}
                  reference={v.det.o.reference}
                  notes={v.det.o.notes}
                  bankName={v.det.o.bankName}
                  accountName={v.det.o.accountName}
                  iban={v.det.o.iban}
                />
                <div style={sx("display:flex; flex-direction:column; gap:16px")}>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                    <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>{v.det.o.no}</div>
                    <div style={sx("display:flex; gap:9px; margin-top:16px; flex-wrap:wrap")}>
                      <button style={sx("font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.det.o.sendReminder}>Send reminder</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.duplicate}>Duplicate</button>
                      <button disabled={!!v.det.o.pdfBusyOn} style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); opacity:" + (v.det.o.pdfBusyOn ? ".45" : "1"))} onClick={v.det.o.downloadPdf}>{v.det.o.pdfBusy ? "Downloading…" : "Download PDF"}</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.printInvoice}>Print</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg)")} onClick={v.det.o.voidInvoice}>Void</button>
                    </div>
                  </div>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                    <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Status timeline</div>
                    <div style={sx("display:flex; flex-direction:column; gap:11px; margin-top:14px")}>
                      <div style={sx("display:flex; gap:11px; align-items:center")}><span style={sx("width:8px; height:8px; border-radius:50%; background:var(--pos)")} /><span style={sx("font-size:12.5px; flex:1")}>Created</span><span style={sx("font-size:11.5px; color:var(--ink-4)")}>{v.det.o.createdOn}</span></div>
                      <div style={sx("display:flex; gap:11px; align-items:center")}><span style={sx("width:8px; height:8px; border-radius:50%; background:var(--pos)")} /><span style={sx("font-size:12.5px; flex:1")}>Sent to client</span><span style={sx("font-size:11.5px; color:var(--ink-4)")}>{v.det.o.sentOn}</span></div>
                      <div style={sx("display:flex; gap:11px; align-items:center")}><span style={sx("width:8px; height:8px; border-radius:50%; background:var(--pos)")} /><span style={sx("font-size:12.5px; flex:1")}>Viewed</span><span style={sx("font-size:11.5px; color:var(--ink-4)")}>{v.det.o.viewedOn}</span></div>
                      <div style={sx("display:flex; gap:11px; align-items:center")}><span style={sx("width:8px; height:8px; border-radius:50%; background:var(--toggle-off)")} /><span style={sx("font-size:12.5px; flex:1; color:var(--ink-4)")}>Paid</span><span style={sx("font-size:11.5px; color:var(--ink-4)")}>due {v.det.o.due}</span></div>
                    </div>
                  </div>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:20px")}>
                    <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Reminders sent</div>
                    <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.6")}>3 days before due, sent 2 Aug<br />On due date, scheduled</div>
                  </div>
                </div>
              </div>
                </>)}

            {!!(v.det.link) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:flex-start")}><div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:32px; font-weight:600")}>{v.det.o.amt}</div><div style={sx("font-size:14px; font-weight:600; margin-top:6px")}>{v.det.o.desc}</div></div><span style={sx(`margin-left:auto; ${v.det.o.chip}`)}>{v.det.o.status}</span></div>
                <div style={sx("display:flex; align-items:center; gap:12px; margin-top:22px; padding:14px; background:var(--panel-2); border:1px solid transparent; border-radius:12px")}>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; flex:1")}>{v.det.o.url}</span>
                  <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:8px 14px; border-radius:8px")} onClick={v.det.o.copy} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Copy</Hoverable>
                </div>
                {!!(v.det.o.showSimulate) && (<>
                      <div style={sx("margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                    <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>SIMULATE PAYMENT</div>
                    <div style={sx("display:flex; flex-wrap:wrap; gap:8px; margin-top:10px")}>
                      <button style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:8px 14px; border-radius:8px")} onClick={v.det.o.simSuccess}>Success</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.simDecline}>Decline</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.simTimeout}>Timeout</button>
                      <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.simPartial}>Partial</button>
                    </div>
                  </div>
                    </>)}
                <div style={sx("display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>CREATED</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.created}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>EXPIRES</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.expiry}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>TIMES PAID</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.usesT}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>ACTIONS</div>{!!(v.det.o.canDeactivate) && (<>
                          <button style={sx("font-size:12.5px; font-weight:600; color:var(--neg); margin-top:5px")} onClick={v.det.o.deactivate}>Deactivate</button>
                        </>)}</div>
                </div>
              </div>
                </>)}

            {!!(v.det.plan) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div>
                <div style={sx("display:flex; gap:26px; margin-top:18px")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>PRICE</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.amt}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>SUBSCRIBERS</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.subsT}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>MONTHLY REVENUE</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.mrrT}</div></div>
                </div>
                {!!(v.det.o.descOn) && (<>
                      <div style={sx("font-size:13px; color:var(--ink-3); line-height:1.6; margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>{v.det.o.desc}</div>
                    </>)}
                <div style={sx("display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                  <span style={sx("font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5); flex:0 0 auto")}>Signup link</span>
                  <span style={sx("flex:1; min-width:0; font-size:13px; color:var(--ink-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{v.det.o.url}</span>
                  <Hoverable as="button" style={sx("flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.copy} hoverStyle={sx("filter:brightness(.97)")}>Copy link</Hoverable>
                </div>
                {!!(v.det.o.hasCharges) && (<>
                      <div style={sx("margin-top:18px; padding-top:16px; border-top:1px solid var(--divider)")}>
                    <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>UPCOMING CHARGES</div>
                    {((v.det.o.charges) || []).map((ch: any, chIdx: any) => <Fragment key={ch?.id || ch?.key || 'ch-' + chIdx}>
                          <div style={sx("display:flex; align-items:center; gap:12px; margin-top:10px")}>
                        <span style={sx("flex:1; font-size:13px; font-weight:600")}>{ch.name} · {ch.amountText}</span>
                        <span style={sx("font-size:12px; color:var(--ink-4)")}>{ch.when}</span>
                        <button style={sx("font-size:12px; font-weight:650; padding:7px 12px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={ch.run}>Run billing</button>
                      </div>
                        </Fragment>)}
                  </div>
                    </>)}
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); margin-top:16px; overflow:hidden")}>
                <div style={sx("display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid var(--divider)")}>
                  <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Subscribers</span>
                  <span style={sx("flex:1")} />
                  <Hoverable as="button" style={sx("font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); white-space:nowrap; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.addSub} hoverStyle={sx("filter:brightness(.97)")}>Add subscriber</Hoverable>
                </div>
                {!!(v.det.o.noSubs) && (<>
                      <div style={sx("padding:34px 20px; text-align:center")}>
                    <div style={sx("font-size:13.5px; font-weight:600; color:var(--ink-2)")}>No one has subscribed yet</div>
                    <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:5px; line-height:1.5")}>Share the signup link above and subscribers appear here.</div>
                  </div>
                    </>)}
                {((v.det.subs) || []).map((sb: any, sbIdx: any) => <Fragment key={sb?.id || sb?.key || 'sb-' + sbIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:17px 20px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={sb.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:650")}>{sb.name}</div><div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:2px")}>Since {sb.since} · next {sb.next}</div></div>
                    <span style={sx(sb.chip)}>{sb.status}</span>
                  </Hoverable>
                    </Fragment>)}
              </div>
                </>)}

            {!!(v.det.sub) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div><span style={sx(`margin-left:auto; ${v.det.o.chip}`)}>{v.det.o.status}</span></div>
                <div style={sx("display:flex; gap:26px; margin-top:20px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>SUBSCRIBER SINCE</div><div style={sx("font-size:14px; font-weight:600; margin-top:5px")}>{v.det.o.since}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>NEXT CHARGE</div><div style={sx("font-size:14px; font-weight:600; margin-top:5px")}>{v.det.o.next}</div></div>
                </div>
                <div style={sx("margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Billing history</div>
                  <div style={sx("display:flex; flex-direction:column; gap:10px; margin-top:12px")}>
                    <div style={sx("font-size:12.5px; color:var(--ink-4)")}>No charge history is stored.</div>
                  </div>
                </div>
                <div style={sx("display:flex; gap:9px; margin-top:20px")}>
                  {!!(v.det.o.canAct) && (<>
                        <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.det.o.pause}>Pause</button>
                      </>)}
                  {!!(v.det.o.canAct) && (<>
                        <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg)")} onClick={v.det.o.cancel}>Cancel subscription</button>
                      </>)}
                </div>
              </div>
                </>)}

            {!!(v.det.match) && (<>
                  <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:16px")}>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                  <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>MONEY THAT ARRIVED</div>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; margin-top:8px")}>{v.det.o.amt}</div>
                  <div style={sx("font-size:13px; font-weight:600; margin-top:6px")}>{v.det.o.party}</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Settled via SkipCash</div>
                </div>
                <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px")}>
                  <div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>INVOICE WE THINK IT'S FOR</div>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; margin-top:8px")}>{v.det.o.inv}</div>
                  <div style={sx("font-size:13px; font-weight:600; margin-top:6px")}>{v.det.o.party}</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Due earlier this month</div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:22px; margin-top:16px")}>
                <div style={sx("display:flex; align-items:center; gap:10px")}><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Why we matched these</div><span style={sx("margin-left:auto; font-size:12.5px; font-weight:600; color:var(--ink-3)")}>{v.det.o.confT} sure</span></div>
                <div style={sx("font-size:12.5px; color:var(--ink-3); line-height:1.6; margin-top:10px")}>{v.det.o.why}</div>
                {!!(v.det.o.live) && (<>
                      <div style={sx("display:flex; flex-wrap:wrap; gap:9px; margin-top:18px")}>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 18px; border-radius:9px")} onClick={v.det.o.confirm} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Confirm match</Hoverable>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.pick} hoverStyle={sx("filter:brightness(.97)")}>Link to another invoice</Hoverable>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.reject} hoverStyle={sx("filter:brightness(.97)")}>Not a match</Hoverable>
                  </div>
                    </>)}
                {!!(v.det.o.readonly) && (<>
                      <div style={sx("display:flex; align-items:center; gap:12px; margin-top:18px")}>
                    <span style={sx("font-size:12px; color:var(--ink-5)")}>Matched automatically, no action needed.</span>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.undo} hoverStyle={sx("filter:brightness(.97)")}>Undo match</Hoverable>
                  </div>
                    </>)}
                {!!(v.det.o.picking) && (<>
                      <div style={sx("margin-top:16px; border:1px solid var(--line); border-radius:14px; overflow:hidden")}>
                    <div style={sx("display:flex; align-items:center; gap:10px; padding:12px 15px; background:var(--panel-2); border-bottom:1px solid var(--divider)")}>
                      <span style={sx("font-size:12px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:var(--ink-5)")}>Pick an invoice</span>
                      <Hoverable as="button" style={sx("margin-left:auto; font-size:12px; font-weight:600; color:var(--ink-4); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.det.o.cancelPick} hoverStyle={sx("color:var(--ink)")}>Cancel</Hoverable>
                    </div>
                    {((v.det.o.options) || []).map((op: any, opIdx: any) => <Fragment key={op?.id || op?.key || 'op-' + opIdx}>
                          <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:12px 15px; border-top:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={op.choose} hoverStyle={sx("background:var(--panel-3)")}>
                        <span style={sx("font-size:13px; font-weight:650; width:86px; flex:0 0 86px")}>{op.no}</span>
                        <span style={sx("flex:1; min-width:0; font-size:12.5px; color:var(--ink-3); overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{op.client}</span>
                        <span style={sx("font-size:12.5px; font-weight:650")}>{op.amt}</span>
                      </Hoverable>
                        </Fragment>)}
                  </div>
                    </>)}
              </div>
                </>)}

            {!!(v.det.client) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div>
                <div style={sx("display:flex; gap:26px; margin-top:16px")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>EMAIL</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.email}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>PHONE</div><div style={sx("font-size:13.5px; font-weight:600; margin-top:5px")}>{v.det.o.phone}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>LIFETIME</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:600; margin-top:4px")}>{v.det.o.totalT}</div></div>
                </div>
              </div>
              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); margin-top:16px; overflow:hidden")}>
                <div style={sx("padding:16px 20px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Their invoices</div>
                {((v.det.invoices) || []).map((i: any, iIdx: any) => <Fragment key={i?.id || i?.key || 'i-' + iIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:17px 20px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={i.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px; font-weight:600; width:90px")}>{i.no}</span>
                    <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; flex:1")}>{i.amt}</span>
                    <span style={sx(i.chip)}>{i.status}</span>
                    <span style={sx("font-size:12px; color:var(--ink-4); width:70px; text-align:right")}>{i.due}</span>
                  </Hoverable>
                    </Fragment>)}
              </div>
                </>)}

            {!!(v.det.synclog) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center")}><div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:23px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.target}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>{v.det.o.when}</div></div><span style={sx(`margin-left:auto; ${v.det.o.chip}`)}>{v.det.o.status}</span></div>
                <div style={sx("display:flex; gap:26px; margin-top:20px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>ITEMS PUSHED</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.itemsT}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>ERRORS</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px; color:var(--neg)")}>{v.det.o.errT}</div></div>
                </div>
                <div style={sx("margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Line by line</div>
                  <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:12px")}>
                    <div style={sx("font-size:12.5px; color:var(--ink-4)")}>No sync payload is stored.</div>
                  </div>
                </div>
              </div>
                </>)}

            {!!(v.det.gateway) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center; gap:12px")}>
                  <div style={sx("width:44px; height:44px; border-radius:13px; background:var(--accent-soft); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700")}>SC</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:23px; font-weight:600; letter-spacing:-.03em")}>SkipCash</div><div style={sx("font-size:12.5px; color:var(--ink-4)")}>Simulated connection</div></div>
                  <div style={sx("margin-left:auto; display:flex; align-items:center; gap:3px; padding:3px; background:var(--panel-2); border:1px solid var(--line); border-radius:10px")}>
                    <button style={sx(v.env.testStyle)} onClick={v.env.goTest}>Sandbox</button>
                    <button style={sx(v.env.liveStyle)} onClick={v.env.goLive}>Live</button>
                  </div>
                </div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:22px")}>
                  <div style={sx("border:1px solid transparent; border-radius:12px; padding:14px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>PUBLISHABLE KEY</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; margin-top:6px")}>pk_sandbox_qa_8f21••••</div></div>
                  <div style={sx("border:1px solid transparent; border-radius:12px; padding:14px")}><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>WEBHOOK URL</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12px; margin-top:6px")}>api.flow.qa/hooks/skipcash</div></div>
                </div>
                <div style={sx("display:flex; gap:26px; margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>VOLUME (30D)</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.gateways?.skipcash?.month}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>SETTLED SHARE</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.gateways?.skipcash?.success}</div></div>
                </div>
                <div style={sx("display:flex; gap:9px; margin-top:20px")}>
                  <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 16px; border-radius:9px")} onClick={v.h.testTxn} hoverStyle={sx("filter:brightness(1.12); transform:translateY(-1px)")}>Send test payment</Hoverable>
                  <button style={sx("font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg)")} onClick={v.h.copy}>Disconnect</button>
                </div>
              </div>
                </>)}

            {!!(v.det.report) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center")}><div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>{v.det.o.range} · built {v.det.o.built}</div></div>
                  <div style={sx("margin-left:auto; display:flex; gap:9px")}><button style={sx("font-size:12.5px; font-weight:600; padding:9px 15px; border-radius:8px; border:1px solid var(--line); background:var(--btn-light)")} onClick={v.h.export}>Re-run</button><button style={sx("font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 15px; border-radius:8px")} onClick={v.h.export}>Export</button></div>
                </div>
                <div style={sx("margin-top:22px; display:flex; flex-direction:column; gap:10px")}>
                  {((v.tagTotals) || []).map((tt3: any, tt3Idx: any) => <Fragment key={tt3?.id || tt3?.key || 'tt3-' + tt3Idx}>
                        <div style={sx("display:flex; align-items:center; gap:14px; padding:12px 14px; background:var(--panel-2); border:1px solid transparent; border-radius:11px")}>
                      <span style={sx("font-size:13px; font-weight:650; width:110px")}>{tt3.tag}</span>
                      <div style={sx("flex:1; height:7px; background:var(--divider); border-radius:4px; overflow:hidden")}><div style={sx(`height:100%; width:${tt3.bar}; background:linear-gradient(90deg,var(--accent),var(--accent-2))`)} /></div>
                      <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px; color:var(--pos)")}>{tt3.inT}</span>
                      <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:12.5px")}>{tt3.outT}</span>
                    </div>
                      </Fragment>)}
                </div>
              </div>
                </>)}

            {!!(v.det.member) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center; gap:14px")}>
                  <div style={sx("width:48px; height:48px; border-radius:14px; background:var(--divider); font-size:15px; font-weight:700; color:var(--ink-3); display:flex; align-items:center; justify-content:center")}>{v.det.o.initials}</div>
                  {!!(v.memberEdit.off) && (<>
                        <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:23px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>{v.det.o.email}</div></div>
                    <span style={sx("margin-left:auto; font-size:11.5px; font-weight:650; color:var(--accent); background:var(--accent-soft); padding:5px 12px; border-radius:7px")}>{v.det.o.role}</span>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={v.memberEdit.start} hoverStyle={sx("filter:brightness(.97)")}>Edit</Hoverable>
                      </>)}
                  {!!(v.memberEdit.on) && (<>
                        <div style={sx("flex:1; min-width:0; display:flex; flex-direction:column; gap:8px")}>
                      <Hoverable as="input" style={sx("width:100%; padding:8px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:14px; font-weight:600; background:var(--panel)")} value={v.f.memberName} onChange={v.F.memberName} placeholder="Name" focusStyle={sx("border-color:var(--ink-6)")} />
                      <Hoverable as="input" style={sx("width:100%; padding:8px 11px; border:1px solid var(--line); border-radius:8px; outline:none; font-size:12.5px; background:var(--panel)")} value={v.f.memberEmail} onChange={v.F.memberEmail} placeholder="Email" focusStyle={sx("border-color:var(--ink-6)")} />
                    </div>
                    <select style={sx("margin-left:auto; font-size:12.5px; font-weight:600; padding:8px 11px; border-radius:9px; border:1px solid var(--line); background:var(--panel)")} value={v.f.memberRole} onChange={v.F.memberRole}>
                      <option value="Owner">Owner</option>
                      <option value="Manager">Manager</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Staff">Staff</option>
                    </select>
                    <Hoverable as="button" style={sx("font-size:12.5px; font-weight:650; color:var(--on-block); background:var(--btn-dark); padding:8px 14px; border-radius:9px")} onClick={v.memberEdit.save} hoverStyle={sx("filter:brightness(1.12)")}>Save</Hoverable>
                      </>)}
                </div>
                <div style={sx("margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>What they can do</div>
                  <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:12px; font-size:12.5px; color:var(--ink-2)")}>
                    <div style={sx("display:flex; align-items:center; gap:9px")}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m3 7.4 2.6 2.6L11 4.6" stroke="var(--pos)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>See all transactions and reports</div>
                    <div style={sx("display:flex; align-items:center; gap:9px")}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="m3 7.4 2.6 2.6L11 4.6" stroke="var(--pos)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Create and send invoices</div>
                    <div style={sx("display:flex; align-items:center; gap:9px")}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" stroke="var(--ink-6)" strokeWidth="1.6" strokeLinecap="round" /></svg><span style={sx("color:var(--ink-5)")}>Change connections or billing</span></div>
                  </div>
                </div>
                <div style={sx("margin-top:20px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Recent activity</div>
                  <div style={sx("font-size:12.5px; color:var(--ink-3); margin-top:10px; line-height:1.7")}>Last seen {v.det.o.last}</div>
                </div>
                <button style={sx("margin-top:20px; font-size:12.5px; font-weight:600; padding:10px 16px; border-radius:9px; border:1px solid var(--line); color:var(--neg)")} onClick={v.h.copy}>Deactivate access</button>
              </div>
                </>)}

            {!!(v.det.branch) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("display:flex; align-items:center; gap:14px")}>
                  <div style={sx("width:44px; height:44px; border-radius:13px; background:var(--ink-block); color:var(--on-block); font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center")}>{v.det.o.initials}</div>
                  <div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:23px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>{v.det.o.sub}</div></div>
                </div>
                <div style={sx("display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-top:22px; padding-top:20px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Revenue YTD</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.rev}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Share of group</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.share}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>People</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.staffT}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>Per person</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.perHead}</div></div>
                </div>
                <div style={sx("margin-top:22px; padding-top:18px; border-top:1px solid var(--divider); display:flex; align-items:center; gap:12px")}>
                  <div style={sx("flex:1")}><div style={sx("font-size:13px; font-weight:600")}>Roll this branch into the main view</div><div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Off means it keeps its own ledger</div></div>
                  <button style={sx(v.tgs.combined.Track)} onClick={v.tgs.combined.go}><span style={sx(v.tgs.combined.Knob)} /></button>
                </div>
              </div>

              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); margin-top:16px; padding:22px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>How it compares</div>
                <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:3px")}>Revenue year to date, all branches</div>
                <div style={sx("display:flex; flex-direction:column; gap:14px; margin-top:18px")}>
                  {((v.det.o.compare) || []).map((cb: any, cbIdx: any) => <Fragment key={cb?.id || cb?.key || 'cb-' + cbIdx}>
                        <div>
                      <div style={sx("display:flex; align-items:baseline; gap:12px")}>
                        <span style={sx(cb.nameStyle)}>{cb.name}</span>
                        <span style={sx("flex:1")} />
                        <span style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:13px; font-weight:600; color:var(--ink-2)")}>{cb.rev}</span>
                      </div>
                      <div style={sx("height:8px; border-radius:5px; background:var(--divider); margin-top:7px; overflow:hidden")}>
                        <div style={sx(cb.barStyle)} />
                      </div>
                    </div>
                      </Fragment>)}
                </div>
              </div>

              <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); margin-top:16px; overflow:hidden")}>
                <div style={sx("padding:16px 22px; border-bottom:1px solid var(--divider); font-family:'Urbanist','Cairo',sans-serif; font-size:16.5px; font-weight:600; letter-spacing:-.02em")}>Recent activity here</div>
                {((v.det.o.recent) || []).map((rb: any, rbIdx: any) => <Fragment key={rb?.id || rb?.key || 'rb-' + rbIdx}>
                      <Hoverable as="button" style={sx("width:100%; display:grid; grid-template-columns:minmax(0,1fr) 120px 120px; gap:16px; align-items:center; padding:14px 22px; border-bottom:1px solid var(--divider-2); text-align:left; transition:background .15s ease")} onClick={rb.open} hoverStyle={sx("background:var(--panel-2)")}>
                    <span style={sx("min-width:0")}>
                      <span style={sx("display:block; font-size:13.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{rb.party}</span>
                      <span style={sx("display:block; font-size:11.5px; color:var(--ink-4); margin-top:2px")}>{rb.d} · {rb.tag}</span>
                    </span>
                    <span style={sx("font-size:12.5px; color:var(--ink-4)")}>{rb.src}</span>
                    <span style={sx(rb.amtStyle)}>{rb.amt}</span>
                  </Hoverable>
                    </Fragment>)}
              </div>
                </>)}

            {!!(v.det.employee) && (<>
                  <div style={sx("background:linear-gradient(180deg,var(--surface) 0%,var(--surface-2) 100%); border:1px solid var(--line); border-radius:11px; box-shadow:var(--shadow-card); backdrop-filter:blur(20px); padding:26px")}>
                <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:26px; font-weight:600; letter-spacing:-.03em")}>{v.det.o.name}</div>
                <div style={sx("font-size:13px; color:var(--ink-4); margin-top:4px")}>{v.det.o.role} · paid by {v.det.o.method}</div>
                <div style={sx("display:flex; gap:26px; margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>MONTHLY SALARY</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.sal}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>DEDUCTIONS</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.ded}</div></div>
                  <div><div style={sx("font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5)")}>NET</div><div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; margin-top:4px")}>{v.det.o.net}</div></div>
                </div>
                <div style={sx("margin-top:22px; padding-top:18px; border-top:1px solid var(--divider)")}>
                  <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:15.5px; font-weight:600; letter-spacing:-.02em")}>Payslips</div>
                  <div style={sx("display:flex; flex-direction:column; gap:9px; margin-top:12px")}>
                    <div style={sx("display:flex; align-items:center; gap:12px; font-size:12.5px")}><span style={sx("flex:1")}>July 2026</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>{v.det.o.net}</span><button style={sx("font-size:12px; font-weight:600; color:var(--accent)")} onClick={v.h.note} data-note="Download queued">Download</button></div>
                    <div style={sx("display:flex; align-items:center; gap:12px; font-size:12.5px")}><span style={sx("flex:1")}>June 2026</span><span style={sx("font-family:'Urbanist','Cairo',sans-serif")}>{v.det.o.net}</span><button style={sx("font-size:12px; font-weight:600; color:var(--accent)")} onClick={v.h.note} data-note="Download queued">Download</button></div>
                  </div>
                </div>
              </div>
                </>)}
          </div>
            </>)}

      </div>
    </div>
  </main>

    {!!(v.mob.on) && (<>
        <div style={sx("position:fixed; left:0; right:0; bottom:0; z-index:50; display:flex; align-items:stretch; background:var(--topbar); backdrop-filter:blur(18px); border-top:1px solid var(--line); padding:2px 6px calc(8px + env(safe-area-inset-bottom))")}>
      {((v.bottomNav) || []).map((b: any, bIdx: any) => <Fragment key={b?.id || b?.key || 'b-' + bIdx}>
            <button style={sx(b.style)} onClick={b.go}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={b.d} stroke={b.ic} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{b.short}</span>
        </button>
          </Fragment>)}
    </div>
    <Presence show={!!v.moreOpen}>
          <div className="flow-open-scrim" style={sx("position:fixed; inset:0; z-index:55; background:var(--scrim); display:flex; align-items:flex-end")} onClick={v.h.closeMore}>
        <div className="flow-open-sheet" style={sx("width:100%; background:var(--bar-solid); border-radius:18px 18px 0 0; padding:8px 16px calc(18px + env(safe-area-inset-bottom)); box-shadow:0 -20px 50px -28px rgba(0,0,0,.45)")} onClick={v.h.stop}>
          <div style={sx("width:42px; height:4px; border-radius:4px; background:var(--dash); margin:6px auto 14px")} />
          <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:16px; font-weight:650; margin-bottom:8px")}>More</div>
          {((v.moreItems) || []).map((m: any, mIdx: any) => <Fragment key={m?.id || m?.key || 'm-' + mIdx}>
                <button style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:12px 4px; text-align:left; border-bottom:1px solid var(--divider-2)")} onClick={m.go}>
              <span style={sx("width:34px; height:34px; flex:0 0 34px; border-radius:10px; background:var(--chip); display:flex; align-items:center; justify-content:center")}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d={m.d} stroke="var(--ink-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span style={sx("font-size:14px; font-weight:650")}>{m.label}</span>
            </button>
              </Fragment>)}
        </div>
      </div>
        </Presence>
      </>)}

  <Presence show={!!v.searchOpen}>
        <div className="flow-open-scrim" style={sx("position:fixed; inset:0; background:var(--scrim); backdrop-filter:blur(6px); display:flex; align-items:flex-start; justify-content:center; padding:max(16px, env(safe-area-inset-top)) 12px 24px; z-index:70")} onClick={v.h.closeSearch}>
      <div className="flow-open-pop" style={sx("width:100%; max-width:560px; background:var(--modal); backdrop-filter:blur(34px) saturate(165%); -webkit-backdrop-filter:blur(34px) saturate(165%); border:1px solid var(--glass-edge); border-radius:11px; box-shadow:inset 0 1px 0 var(--glass-top), 0 40px 90px -40px rgba(0,0,0,.6); overflow:hidden; box-shadow:0 40px 90px -20px rgba(0,0,0,.6)")}>
        <div style={sx("display:flex; align-items:center; gap:11px; padding:16px 18px; border-bottom:1px solid var(--divider)")}>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><circle cx="6.2" cy="6.2" r="4.2" stroke="var(--ink-4)" strokeWidth="1.5" /><path d="M9.4 9.4 12 12" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input style={sx("flex:1; border:none; outline:none; background:none; font-size:14.5px")} autoFocus={v.true} placeholder="Search payments, invoices, clients" value={v.f.search} onChange={v.F.search} />
          <Hoverable as="button" style={sx("width:26px; height:26px; border-radius:7px; background:var(--chip); display:flex; align-items:center; justify-content:center; transition:background-color .15s ease")} onClick={v.h.closeSearch} hoverStyle={sx("background:var(--panel-3)")}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6M9 3l-6 6" stroke="var(--ink-3)" strokeWidth="1.7" strokeLinecap="round" /></svg>
          </Hoverable>
        </div>
        <div style={sx("max-height:54vh; overflow-y:auto")}>
          {((v.results.groups) || []).map((g: any, gIdx: any) => <Fragment key={g?.id || g?.key || 'g-' + gIdx}>
                <div style={sx("padding:13px 18px 6px; font-size:10.5px; font-weight:700; letter-spacing:.06em; color:var(--ink-5)")}>{g.label}</div>
            {((g.items) || []).map((it: any, itIdx: any) => <Fragment key={it?.id || it?.key || 'it-' + itIdx}>
                  <Hoverable as="button" style={sx("width:100%; display:flex; align-items:center; gap:12px; padding:11px 18px; text-align:left; transition:background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease, filter .18s ease, transform .2s cubic-bezier(.32,.72,0,1)")} onClick={it.go} hoverStyle={sx("background:var(--panel-2)")}>
                <span style={sx("width:28px; height:28px; flex:0 0 28px; border-radius:8px; background:var(--chip); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:var(--ink-3)")}>{it.abbr}</span>
                <span style={sx("flex:1; min-width:0; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis")}>{it.label}</span>
                <span style={sx("font-size:12px; color:var(--ink-4); white-space:nowrap")}>{it.meta}</span>
              </Hoverable>
                </Fragment>)}
              </Fragment>)}
          {!!(v.results.none) && (<>
                <div style={sx("padding:34px 18px; text-align:center")}><div style={sx("font-size:13.5px; font-weight:650")}>No matches</div><div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>Try a client name, tag or amount.</div></div>
              </>)}
          {!!(v.searchIdle) && (<>
                <div style={sx("padding:30px 18px; text-align:center")}><div style={sx("font-size:12.5px; color:var(--ink-4)")}>Start typing to search across your money.</div></div>
              </>)}
        </div>
      </div>
    </div>
      </Presence>

  <Presence show={!!v.modal.on}>
        <div className="flow-open-scrim" style={sx("position:fixed; inset:0; background:var(--scrim); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:32px; z-index:60")} data-flow-modal="1">
      <div className="flow-open-pop" style={sx("background:var(--modal); backdrop-filter:blur(34px) saturate(165%); -webkit-backdrop-filter:blur(34px) saturate(165%); border:1px solid var(--glass-edge); border-radius:11px; box-shadow:inset 0 1px 0 var(--glass-top), 0 40px 90px -40px rgba(0,0,0,.6); width:100%; max-width:" + (v.modal.wide ? "640px" : "520px") + "; max-height:86vh; overflow-y:auto; box-shadow:0 40px 90px -20px rgba(0,0,0,.6)")}>
        <div style={sx("display:flex; align-items:center; gap:12px; padding:20px 22px 14px; border-bottom:1px solid var(--divider)")}>
          <div style={sx("font-family:'Urbanist','Cairo',sans-serif; font-size:19px; font-weight:600; letter-spacing:-.025em")}>{v.modal.title}</div>
          <div style={sx("flex:1")} />
          <button style={sx("width:30px; height:30px; border-radius:8px; background:var(--panel); display:flex; align-items:center; justify-content:center")} onClick={v.h.closeModal}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6M9 3l-6 6" stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={sx("padding:20px 22px")}>
          {!!(v.modal.pageSettings) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:20px")}>
              <label style={sx("display:block")}>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Link for this page</div>
                <div style={sx("display:flex; align-items:center; border:1px solid var(--line); border-radius:10px; overflow:hidden; background:var(--surface)")}>
                  <span style={sx("padding:11px 0 11px 13px; font-size:13px; color:var(--ink-5); white-space:nowrap")}>pay.flow.qa/p/</span>
                  <input style={sx("flex:1; min-width:0; padding:11px 13px 11px 2px; border:none; outline:none; font-size:13px; background:transparent; color:var(--ink)")} value={v.ps.slug} onChange={v.ps.setSlug} />
                </div>
              </label>

              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>Page theme</div>
                <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:10px")}>
                <Hoverable as="button" style={choiceCard(v.ps.themeLight.on)} onClick={v.ps.themeLight.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.themeLight.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Light</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>White page, dark pay button</span>
                  </span>
                </Hoverable>
                <Hoverable as="button" style={choiceCard(v.ps.themeDark.on)} onClick={v.ps.themeDark.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.themeDark.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Dark</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>Dark page, light pay button</span>
                  </span>
                </Hoverable>
                </div>
              </div>

              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>When the page stops accepting payments</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px")}>
                <Hoverable as="button" style={choiceCard(v.ps.expNone.on)} onClick={v.ps.expNone.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.expNone.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Never</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>The page stays open until you close it</span>
                  </span>
                </Hoverable>
                <Hoverable as="button" style={choiceCard(v.ps.expDate.on)} onClick={v.ps.expDate.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.expDate.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>On a date</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>Useful for events and pre-orders</span>
                  </span>
                </Hoverable>
                  {!!(v.ps.dateOn) && (<>
                        <input type="date" value={v.ps.closeDate} onChange={v.ps.setCloseDate} style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13px; background:var(--surface); color:var(--ink)")} />
                      </>)}
                </div>
              </div>

              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>After a successful payment</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px")}>
                <Hoverable as="button" style={choiceCard(v.ps.afterMsg.on)} onClick={v.ps.afterMsg.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.afterMsg.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Show a thank-you message</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>The customer stays on the page</span>
                  </span>
                </Hoverable>
                <Hoverable as="button" style={choiceCard(v.ps.afterRedirect.on)} onClick={v.ps.afterRedirect.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.ps.afterRedirect.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Send them to your website</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>They are redirected once payment clears</span>
                  </span>
                </Hoverable>
                  {!!(v.ps.redirectOn) && (<>
                        <input type="url" value={v.ps.redirectUrl} onChange={v.ps.setRedirectUrl} style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13px; background:var(--surface); color:var(--ink)")} placeholder="https://desertbloom.qa/thank-you" />
                      </>)}
                </div>
              </div>
            </div>
              </>)}

          {!!(v.modal.receipts) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:20px")}>
              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>Sending receipts</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px")}>
                <Hoverable as="button" style={choiceCard(v.rc.auto.on)} onClick={v.rc.auto.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.rc.auto.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Send automatically</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>Emailed to the customer the moment payment clears</span>
                  </span>
                </Hoverable>
                <Hoverable as="button" style={choiceCard(v.rc.manual.on)} onClick={v.rc.manual.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:50%; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.rc.manual.on) && (<>
                            <span style={sx("width:9px; height:9px; border-radius:50%; background:var(--ink)")} />
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Send them myself</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>You send receipts later from Transactions, and can add your own reference</span>
                  </span>
                </Hoverable>
                </div>
              </div>
              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:9px")}>What the receipt shows</div>
                <div style={sx("display:flex; flex-direction:column; gap:10px")}>
                <Hoverable as="button" style={choiceCard(v.rc.showCustomer.on)} onClick={v.rc.showCustomer.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:5px; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.rc.showCustomer.on) && (<>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="m2.4 6.2 2.2 2.2 5-5.2" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Customer details</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>Name, email and phone appear on the receipt</span>
                  </span>
                </Hoverable>
                <Hoverable as="button" style={choiceCard(v.rc.ref.on)} onClick={v.rc.ref.go} hoverStyle={choiceHover}>
                  <span style={sx("width:17px; height:17px; flex:0 0 17px; margin-top:1px; border-radius:5px; border:1.5px solid var(--ink-6); display:flex; align-items:center; justify-content:center")}>
                    {!!(v.rc.ref.on) && (<>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="m2.4 6.2 2.2 2.2 5-5.2" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </>)}
                  </span>
                  <span style={sx("min-width:0")}>
                    <span style={sx("display:block; font-size:13px; font-weight:600")}>Your reference number</span>
                    <span style={sx("display:block; font-size:12px; color:var(--ink-4); line-height:1.5; margin-top:2px")}>Adds your own order or job number</span>
                  </span>
                </Hoverable>
                </div>
              </div>
            </div>
              </>)}

          {!!(v.modal.link) && (<>
            <LinkCreateForm onClose={v.h.closeModal} />
              </>)}
          {!!(v.modal.scan) && (<>
                <div>
              <div style={sx("border:1.5px dashed var(--dash); border-radius:14px; padding:30px; text-align:center; background:var(--panel-2)")}>
                {!!(v.scan.busy) && (<>
                      <div style={sx("width:44px; height:44px; margin:0 auto; border-radius:15px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center")}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7V4.5A1.5 1.5 0 0 1 4.5 3H7M13 3h2.5A1.5 1.5 0 0 1 17 4.5V7M17 13v2.5a1.5 1.5 0 0 1-1.5 1.5H13M7 17H4.5A1.5 1.5 0 0 1 3 15.5V13M6 10h8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </div>
                  <div style={sx("font-size:13px; font-weight:600; margin-top:12px")}>Reading the bill…</div>
                  <div style={sx("font-size:12px; color:var(--ink-4); margin-top:4px")}>Extracting vendor, date, total, tax and line items</div>
                    </>)}
                {!!(v.scan.notBusy) && (<>
                      <div style={sx("width:44px; height:44px; margin:0 auto; border-radius:15px; background:var(--accent-soft); display:flex; align-items:center; justify-content:center")}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7V4.5A1.5 1.5 0 0 1 4.5 3H7M13 3h2.5A1.5 1.5 0 0 1 17 4.5V7M17 13v2.5a1.5 1.5 0 0 1-1.5 1.5H13M7 17H4.5A1.5 1.5 0 0 1 3 15.5V13M6 10h8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </div>
                  <div style={sx("font-size:13px; font-weight:600; margin-top:12px")}>Drop a bill photo or PDF here</div>
                  <div style={sx("font-size:12px; color:var(--ink-4); margin-top:4px")}>or use your camera</div>
                  <input style={sx("display:none")} id="flow-bill-file" type="file" accept="image/*,application/pdf" onChange={v.scan.onFile} />
                  <button style={sx("margin-top:14px; font-size:12.5px; font-weight:600; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:9px 16px; border-radius:9px")} onClick={v.scan.pickFile}>Choose image or PDF</button>
                  <div style={sx("display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-top:12px")}>
                    {((v.scan.samples) || []).map((sm: any, smIdx: any) => <Fragment key={sm?.id || sm?.key || 'sm-' + smIdx}>
                          <button style={sx("font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light)")} onClick={sm.use}>{sm.cta}</button>
                        </Fragment>)}
                  </div>
                    </>)}
              </div>
              {!!(v.scan.done) && (<>
                    <div style={sx("margin-top:16px; border:1px solid var(--line); border-radius:14px; padding:16px")}>
                  <div style={sx("font-size:12px; font-weight:700; color:var(--ink-3); letter-spacing:.03em")}>FIELDS WE READ, EDIT ANYTHING</div>
                  <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px")}>
                    <label><div style={sx("font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Vendor · {v.scan.conf.vendor}</div><input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px")} value={v.f.scanVendor} onChange={v.F.scanVendor} /></label>
                    <label><div style={sx("font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Total · {v.scan.conf.total}</div><input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.scanAmount} onChange={v.F.scanAmount} /></label>
                    <label><div style={sx("font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Date · {v.scan.conf.date}</div><input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px")} value={v.f.scanDate} onChange={v.F.scanDate} /></label>
                    <label><div style={sx("font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Tax · {v.scan.conf.tax}</div><input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.scanTax} onChange={v.F.scanTax} /></label>
                    <label><div style={sx("font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Tag · {v.scan.conf.tag}</div><input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px")} value={v.f.scanTag} onChange={v.F.scanTag} /></label>
                  </div>
                  <div style={sx("margin-top:14px; font-size:11.5px; color:var(--ink-3); margin-bottom:5px")}>Line items · {v.scan.conf.lines}</div>
                  <div style={sx("display:flex; flex-direction:column; gap:8px")}>
                    {((v.scan.lines) || []).map((ln: any, lnIdx: any) => <Fragment key={ln?.id || ln?.key || 'ln-' + lnIdx}>
                          <div style={sx("display:grid; grid-template-columns:1.4fr 1fr; gap:8px")}>
                        <input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px")} value={ln.description} onChange={ln.setDesc} />
                        <input style={sx("width:100%; padding:9px 11px; border:1px solid var(--line); border-radius:9px; outline:none; font-size:13px; font-family:'Urbanist','Cairo',sans-serif")} value={ln.amount} onChange={ln.setAmount} />
                      </div>
                        </Fragment>)}
                  </div>
                </div>
                  </>)}
            </div>
              </>)}
          {!!(v.modal.expense) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Amount (QR)</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.expAmount} onChange={v.F.expAmount} placeholder="0.00" /></label>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Paid to</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.expParty} onChange={v.F.expParty} placeholder="Vendor name" /></label>
              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:8px")}>Tag</div>
                <div style={sx("display:flex; flex-wrap:wrap; gap:7px")}>
                  {((v.tagPicks) || []).map((tg: any, tgIdx: any) => <Fragment key={tg?.id || tg?.key || 'tg-' + tgIdx}>
                        {!!(tg.on) && (<>
                          <button style={sx("font-size:12px; font-weight:600; padding:7px 12px; border-radius:9px; background:var(--ink-block); color:var(--on-block)")}>{tg.label}</button>
                        </>)}
                    {!!(tg.off) && (<>
                          <button style={sx("font-size:12px; font-weight:600; padding:7px 12px; border-radius:9px; background:linear-gradient(170deg,var(--panel-3),var(--panel)); border:1px solid var(--line); color:var(--ink-3)")} onClick={tg.go}>{tg.label}</button>
                        </>)}
                      </Fragment>)}
                </div>
              </div>
            </div>
              </>)}
          {!!(v.modal.invoice) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Client</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.invClient} onChange={v.F.invClient} placeholder="Select or add a client" /></label>
              <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Amount (QR)</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.invAmount} onChange={v.F.invAmount} placeholder="0.00" /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Due date<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} type="date" value={v.f.invDue} onChange={v.F.invDue} />{!!(v.invoiceDue.errorOn) && (<>
                        <span style={sx("display:block; font-size:12px; font-weight:650; color:var(--neg); margin-top:6px")}>{v.invoiceDue.error}</span>
                      </>)}</label>
              </div>
              <div style={sx("background:linear-gradient(170deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:13px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>A payment link is created automatically and attached to this invoice.</div>
            </div>
              </>)}
          {!!(v.modal.plan) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Plan name<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.planName} onChange={v.F.planName} placeholder="e.g. Monthly Care" /></label>
              <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Amount (QR)<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.planAmount} onChange={v.F.planAmount} placeholder="0.00" /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Bills every<span style={sx("color:var(--neg); margin-left:3px")}>*</span></div>
                  <select style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel)")} value={v.f.planInterval} onChange={v.F.planInterval}>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                    <option value="Quarter">Quarter</option>
                    <option value="Year">Year</option>
                  </select>
                </label>
              </div>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Customer</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.planCustomer} onChange={v.F.planCustomer} placeholder="Optional first subscriber" /></label>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>What subscribers get</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.planDesc} onChange={v.F.planDesc} placeholder="Shown on the signup page" /></label>
              <div style={sx("display:flex; align-items:center; gap:10px; padding:12px 13px; border:1px solid var(--line); border-radius:10px; background:var(--panel-2)")}>
                <svg style={sx("flex:0 0 15px")} width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M8.2 11.8 11.8 8.2M7.4 13.4a2.6 2.6 0 0 1 0-3.7l1.5-1.5M12.6 6.6a2.6 2.6 0 0 1 3.7 3.7l-1.5 1.5" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <span style={sx("font-size:12px; color:var(--ink-4); line-height:1.5")}>A signup link is created automatically. Share it and customers subscribe themselves.</span>
              </div>
            </div>
              </>)}
          {!!(v.modal.member) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Name</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.memberName} onChange={v.F.memberName} /></label>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Email</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.memberEmail} onChange={v.F.memberEmail} /></label>
              <div>
                <div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:8px")}>Role</div>
                <div style={sx("display:flex; gap:7px")}>
                  {((v.rolePicks) || []).map((r: any, rIdx: any) => <Fragment key={r?.id || r?.key || 'r-' + rIdx}>
                        {!!(r.on) && (<>
                          <button style={sx("font-size:12px; font-weight:600; padding:8px 14px; border-radius:8px; background:var(--ink-block); color:var(--on-block)")}>{r.label}</button>
                        </>)}
                    {!!(r.off) && (<>
                          <button style={sx("font-size:12px; font-weight:600; padding:8px 14px; border-radius:8px; background:linear-gradient(170deg,var(--panel-3),var(--panel)); border:1px solid var(--line); color:var(--ink-3)")} onClick={r.go}>{r.label}</button>
                        </>)}
                      </Fragment>)}
                </div>
              </div>
            </div>
              </>)}
          {!!(v.modal.employee) && (<>
                <div style={sx("display:flex; flex-direction:column; gap:14px")}>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Full name</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.empName} onChange={v.F.empName} /></label>
              <div style={sx("display:grid; grid-template-columns:1fr 1fr; gap:12px")}>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Role</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.empRole} onChange={v.F.empRole} /></label>
                <label><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Monthly salary</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; font-family:'Urbanist','Cairo',sans-serif")} value={v.f.empSalary} onChange={v.F.empSalary} /></label>
              </div>
              <label style={sx("display:block")}><div style={sx("font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px")}>Paid by</div><input style={sx("width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px")} value={v.f.empMethod} onChange={v.F.empMethod} placeholder="Bank transfer" /></label>
              <div style={sx("background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:12px; font-size:12.5px; color:var(--ink-3); line-height:1.5")}>Payouts are manual for now, Flow records the payslip and the expense, you make the transfer.</div>
            </div>
              </>)}
          {!!(v.modal.help) && (<>
                <div style={sx("font-size:13px; color:var(--ink-2); line-height:1.65")}>
              <p style={sx("margin:0 0 12px")}>This is a Phase 1 sandbox build for Qatar. Everything settles directly to your own gateway account, Flow never holds your money.</p>
              <p style={sx("margin:0")}>Simulated: SkipCash, Ahli Bank, Zoho Books, Shopify. Anything marked “Coming soon” is a later phase.</p>
            </div>
              </>)}
          {!!(v.modal.reset) && (<>
                <div style={sx("font-size:13px; color:var(--ink-2); line-height:1.65")}>This restores the seed and clears simulated payments, confirmed matches, scanned bills, created links and subscriptions.</div>
              </>)}
        </div>
        {!(v.modal.hideFoot) && (<>
        <div style={sx("display:flex; align-items:center; gap:10px; padding:16px 22px; border-top:1px solid var(--divider); background:var(--modal-foot); border-radius:0 0 26px 26px")}>
          <div style={sx("flex:1")} />
          <button style={sx("font-size:13px; font-weight:600; color:var(--ink-3); padding:10px 16px; border-radius:10px; border:1px solid var(--line); background:var(--surface)")} onClick={v.h.closeModal}>Cancel</button>
          <button style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 20px; border-radius:9px")} onClick={v.h.submitModal}>{v.modal.cta}</button>
        </div>
        </>)}
      </div>
    </div>
      </Presence>

  <Presence show={!!v.toast.on} kind="toast">
        <div className="flow-open-scrim" style={sx("position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--ink-block); color:var(--on-block); padding:12px 18px; border-radius:12px; font-size:13px; font-weight:600; box-shadow:0 12px 32px rgba(21,22,26,.3); z-index:90")}>{v.toast.msg}</div>
      </Presence>
</div>
    </>
  );
}
