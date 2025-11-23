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

  const historyRef = useRef({ prey: [], predator: [] });

  //Recreate the worker whenever workerURL changes
  useEffect(() => {
    if (!workerURL) return;
    console.log('[hook] creating worker', workerURL.toString());
    const w = new Worker(workerURL, { type: "module" });
    workerRef.current = w;

    w.onmessage = (e) => {
      const { prey: x, pred: y } = e.data || {};
      if (Number.isFinite(x)) historyRef.current.prey.push(x);
      if (Number.isFinite(y)) historyRef.current.predator.push(y);

      // update windowed series for the live chart (trimmed)
      if (Number.isFinite(x)) setPrey((prev) => pushWindow(prev, x, windowSize));
      if (Number.isFinite(y)) setPredator((prev) => pushWindow(prev, y, windowSize));

      console.log('[hook] received', e.data);
    };

    w.onerror = (e) => {
      console.error('[hook] worker error', e.message, e);
    };
    w.onmessageerror = (e) => {
      console.error('[hook] worker message error', e.message, e);
    }

    return () => {
      w.postMessage({ type: "pause" });
      w.terminate();
      workerRef.current = null;
    };
  }, [workerURL, windowSize]);

  const start = useCallback(() => {
    setPrey([]);
    setPredator([]);
    historyRef.current = { prey: [], predator: [] };
    workerRef.current?.postMessage({ type: "start", params });
    setRunning(true);
  }, [params]);

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: "pause" });
    setRunning(false);
  }, []);

  const resume = useCallback(() => {
    workerRef.current?.postMessage({ type: "resume" });
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    setPrey([]);
    setPredator([]);
    historyRef.current = { prey: [], predator: [] };
    workerRef.current?.postMessage({ type: "reset", params });
    setRunning(false);
  }, [params]);

  const setParams = useCallback((patch) => {
    workerRef.current?.postMessage({ type: "setParams", params: patch });
  }, []);

  return { running, prey, predator, start, pause, resume, reset, setParams, historyRef };
}
