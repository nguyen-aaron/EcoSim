import { useEffect, useRef, useState, useCallback } from "react";

const PUBLIC = process.env.PUBLIC_URL || "";
const WORKER_URLS = {
  lotka:               `${PUBLIC}/workers/LotkaVolterra.js`,
  competitivelotka:    `${PUBLIC}/workers/CompetitiveLotkaVolterra.js`,
  randomlotka:         `${PUBLIC}/workers/RandomLotkaVolterra.js`,
  rosenzweigmacarthur: `${PUBLIC}/workers/RosenzweigMacArthur.js`,
};

export function useEcosimWorker({ modelKey, params = {}, windowSize = 800 } = {}) {
  const workerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [prey, setPrey] = useState([]);
  const [predator, setPredator] = useState([]);

  useEffect(() => {
    const url = WORKER_URLS[modelKey];

    if (!url) {
      console.error("[hook] no worker URL for modelKey:", modelKey);
      return;
    }

    console.log("[hook] creating worker", modelKey, url);

    let w;
    try {
      w = new Worker(url);
    } catch (e) {
      console.error("[hook] Worker() constructor failed", e);
      return;
    }

    w.addEventListener("error", (e) => {
      console.error(
        "[hook] worker error",
        {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        },
        e
      );
    });
    w.addEventListener("messageerror", (e) => {
      console.error("[hook] worker messageerror", e);
    });

    workerRef.current = w;

    w.onmessage = (e) => {
      const { prey: x, pred: y } = e.data || {};
      if (Number.isFinite(x))
        setPrey((p) => (p.length >= windowSize ? [...p.slice(1), x] : [...p, x]));
      if (Number.isFinite(y))
        setPredator((p) => (p.length >= windowSize ? [...p.slice(1), y] : [...p, y]));
    };
    w.onerror = (e) => console.error("[hook] worker error", e);
    w.onmessageerror = (e) => console.error("[hook] worker message error", e);

    return () => {
      w.postMessage({ type: "pause" });
      w.terminate();
      workerRef.current = null;
    };
  }, [modelKey, windowSize]);

  const start = useCallback(() => {
    setPrey([]);
    setPredator([]);
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
    workerRef.current?.postMessage({ type: "reset", params });
    setRunning(false);
  }, [params]);

  const setParams = useCallback((patch) => {
    workerRef.current?.postMessage({ type: "setParams", params: patch });
  }, []);

  return { running, prey, predator, start, pause, resume, reset, setParams };
}
