"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Component } from "../../lib/dashboard/component";
import { getDashRevision, getServerDashRevision, initializeDashStore, subscribeDashStore } from "../../lib/dashboard/session";
import { resetStore } from "../../lib/data/store";
import { DashboardView } from "./view";
import "./dashboard.css";

function applyLiveStore(logic: InstanceType<typeof Component>) {
  try {
    logic.applyStore();
  } catch {
    resetStore();
    logic.applyStore();
  }
}

export function DashboardApp() {
  const revision = useSyncExternalStore(subscribeDashStore, getDashRevision, getServerDashRevision);
  const [, bump] = useState(0);
  const [ready, setReady] = useState(false);
  const logic = useMemo(() => new Component(), []);

  useEffect(() => {
    logic.onState = () => bump(n => n + 1);
    try {
      initializeDashStore();
    } catch {
      resetStore();
    }
    applyLiveStore(logic);
    setReady(true);
  }, [logic]);

  useEffect(() => {
    if (!ready) return;
    applyLiveStore(logic);
  }, [revision, logic, ready]);

  if (!ready) {
    return <div data-theme="light" style={{ height: "100vh", background: "#F2F2F5" }} />;
  }

  return <DashboardView v={logic.renderVals()} />;
}
