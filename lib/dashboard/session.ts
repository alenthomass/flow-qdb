import { hydrateStore } from "../data/hydrate";

let revision = 0;
let initialized = false;
const listeners = new Set<() => void>();

export const getDashRevision = () => revision;
export const getServerDashRevision = () => 0;

export function subscribeDashStore(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function publishDashStore() {
  revision += 1;
  listeners.forEach(listener => listener());
}

export function initializeDashStore() {
  if (initialized) return;
  hydrateStore();
  initialized = true;
  publishDashStore();
}
