import { useEffect, useRef, useState, useCallback } from "react";

function pushWindow(prev, v, max) {
  return prev.length >= max ? [...prev.slice(1), v] : [...prev, v];
}

// generic hook that talks to any ecosim simulation logic (Lotka-Volterra, etc)
export function useEcosimWorker({
  workerURL,                   // REQUIRED: module path for the worker
  params = {},                  // model parameters passed on "start"
  windowSize = 800,
} = {}) {
  const workerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [prey, setPrey] = useState([]);
  const [predator, setPredator] = useState([]);

  //Recreate the worker whenever workerURL changes
  useEffect(() => {
    if (!workerURL) return;
    console.log('[hook] creating worker', workerURL.toString());
    const w = new Worker(workerURL, { type: "module" });
    workerRef.current = w;

    w.onmessage = (e) => {
      const { prey, pred } = e.data || {};
      if (Number.isFinite(prey)) setPrey(prev => pushWindow(prev, prey, windowSize));
      if (Number.isFinite(pred)) setPredator(prev => pushWindow(prev, pred, windowSize));
      console.log('[hook] received', e.data);
    };

    w.onerror = (e) => {
      console.error('[hook] worker error', e.message, e);
    };
    w.onmessageerror = (e) => {
      console.error('[hook] worker message error', e.message, e);
    }

    return () => {
      w.postMessage({ type: "stop" });
      w.terminate();
      workerRef.current = null;
    };
  }, [workerURL, windowSize]);

  const start = useCallback(() => {
    setPrey([]); setPredator([]);
    workerRef.current?.postMessage({ type: "start", params });
    setRunning(true);
  }, [params]);

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: "stop" });
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setPrey([]); setPredator([]);
    workerRef.current?.postMessage({ type: "reset", params });
  }, [params]);

  const setParams = useCallback((patch) => {
    workerRef.current?.postMessage({ type: "setParams", params: patch });
  }, []);

  return { running, prey, predator, start, pause, reset, setParams };
}
