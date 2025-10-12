import { useEffect, useRef, useState, useCallback } from "react";

function pushWindow(prev, v, max) {
  if (prev.length >= max) return [...prev.slice(1), v];
  return [...prev, v];
}

//hook to run Lokta-Volterra simulation in a Web Worker 
export function useLoktaVolterra({
  alpha=0.6, beta=0.025, delta=0.01, gamma=0.5,
  x0=40, y0=9, dt=0.05, fps=20,
  windowSize=800,
} = {}) {
  const workerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [prey, setPrey] = useState([]);
  const [pred, setPred] = useState([]);

  //start and listen for messages
  useEffect(() => {
    const w = new Worker(new URL("../EcoystemEngine/LoktaVolterra.js", import.meta.url), { type: "module" });
    workerRef.current = w;
    w.onmessage = (e) => {
      const { prey, predator } = e.data;
      setPrey(prev => pushWindow(prev, prey, windowSize));
      setPred(prev => pushWindow(prev, predator, windowSize));
    };
    return () => { w.postMessage({ type:"stop" }); w.terminate(); };
  }, [windowSize]);

  const start = useCallback(() => {
    setPrey([]); setPred([]);
    workerRef.current?.postMessage({ type:"start", params:{ alpha,beta,delta,gamma, x0,y0, dt,fps }});
    setRunning(true);
  }, [alpha,beta,delta,gamma,x0,y0,dt,fps]);

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type:"stop" });
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setPrey([]); setPred([]);
    workerRef.current?.postMessage({ type:"reset", params:{ x0,y0 } });
  }, [x0,y0]);

  const setParams = useCallback((patch) => {
    workerRef.current?.postMessage({ type:"setParams", params: patch });
  }, []);

  return { running, prey, pred, start, pause, reset, setParams };
}
