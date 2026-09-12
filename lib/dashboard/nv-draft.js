const flushers = new Set();

export function debounce(fn, ms) {
  let timer = null;
  let lastArgs = null;
  const run = () => {
    timer = null;
    const args = lastArgs;
    lastArgs = null;
    if (args) fn(...args);
  };
  const wrapped = (...args) => {
    lastArgs = args;
    if (timer != null) clearTimeout(timer);
    timer = setTimeout(run, ms);
  };
  wrapped.flush = () => {
    if (timer == null) return;
    clearTimeout(timer);
    run();
  };
  wrapped.cancel = () => {
    if (timer != null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };
  return wrapped;
}

export function registerNvDraftFlush(fn) {
  flushers.add(fn);
  return () => {
    flushers.delete(fn);
  };
}

export function flushNvDrafts() {
  flushers.forEach(fn => fn());
}
