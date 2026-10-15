const SESSION_LOCK = "open-projects-hub.auth";
const SESSION_REVISION = "open-projects-hub.session-revision";
let operationQueue: Promise<unknown> = Promise.resolve();
let channel: BroadcastChannel | undefined;

export const readSessionRevision = (): string | null => {
  try {
    return window.localStorage.getItem(SESSION_REVISION);
  } catch {
    return null;
  }
};

export const notifySessionChange = (): void => {
  const revision = crypto.randomUUID();
  try {
    // Only an invalidation marker is persisted; it contains no identity or credentials.
    window.localStorage.setItem(SESSION_REVISION, revision);
  } catch {
    // BroadcastChannel still invalidates other tabs when storage is unavailable.
  }
  channel?.postMessage(revision);
};

export const subscribeSessionChanges = (invalidate: () => void): (() => void) => {
  let lastRevision = readSessionRevision();
  const handleRevision = (revision: unknown) => {
    if (typeof revision !== "string" || revision === lastRevision) return;
    const currentRevision = readSessionRevision();
    if (currentRevision !== null && revision !== currentRevision) return;
    lastRevision = revision;
    invalidate();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_REVISION) handleRevision(event.newValue);
  };
  window.addEventListener("storage", onStorage);
  if (typeof window.BroadcastChannel === "function") {
    channel ??= new window.BroadcastChannel(SESSION_LOCK);
    const onMessage = (event: MessageEvent<unknown>) => handleRevision(event.data);
    channel.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.removeEventListener("message", onMessage);
    };
  }
  return () => window.removeEventListener("storage", onStorage);
};

export const serializeSessionOperation = async <Result>(
  operation: () => Promise<Result>
): Promise<Result> => {
  // Enqueue globally immediately: a local queue would let another tab's login
  // overtake an already requested logout and then lose its new cookie.
  if (typeof navigator.locks?.request === "function") {
    return await navigator.locks.request(SESSION_LOCK, operation);
  }
  const result = operationQueue.then(operation, operation);
  operationQueue = result.catch(() => undefined);
  return result;
};
