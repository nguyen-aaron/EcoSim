import { useEffect, useMemo, useState } from "react";
import { useEcosimWorker } from "../hooks/useEcosimWorker";
import { MODEL_CONFIG } from "../models/registry";
import MiniSVGChart from "../components/MiniSVGChart";
import ParamsPanel from "../components/ParamsPanel.jsx"; //ParamsPanel.jsx since it was ambiguous and caused errors for some reason
import AboutModel from "../components/AboutModel.jsx";

export default function Simulate() {
  console.log(
    "ParamsPanel keys:",
    Object.keys(ParamsPanel),
    "default typeof:",
    typeof ParamsPanel?.default,
  );
  const [model, setModel] = useState("lotka");
  const [paused, setPaused] = useState(false);
  const config = MODEL_CONFIG[model];

  //Series info for chart labels and colors
  const s0 = config.series?.[0];
  const s1 = config.series?.[1];
  //Params for the current model
  const [params, setParams] = useState(config.defaults);
  useEffect(() => setParams(MODEL_CONFIG[model].defaults), [model]);

  //Prepare worker parameters (if any mapping is needed)
  const workerParams = useMemo(
    () => (config.toWorker ? config.toWorker(params) : params),
    [config, params],
  );

  //Ecosim worker hook
  const {
    running,
    prey,
    predator,
    start,
    pause,
    resume,
    reset,
    setParams: sendPatch, historyRef,
  } = useEcosimWorker({
    workerURL: config.workerUrl,
    params: workerParams,
    windowSize: 800,
  });

  const cleanParams = (raw) => {
    const result = { ...raw };
    for (const f of config.fields) {
      const k = f.key;
      if (result[k] === "") {
        // fall back to model defaults if the field was cleared
        result[k] = config.defaults[k];
      }
    }
    return result;
  };

  const handleParamChange = (name, val) => {
    const num = Number(val);
    const next = { ...params, [name]: val === "" ? "" : Number(val) };
    setParams(next);

    const live = config.fields.find((f) => f.key === name)?.live;
    if (running && live && val !== "") {
      const num = Number(val);
      if (Number.isFinite(num)) {
        const patch = config.toWorker
          ? config.toWorker({ [name]: num })
          : { [name]: num };
        sendPatch(patch);
      }
    }
  };

  const handleResetDefaults = () => {
    const defaults = MODEL_CONFIG[model].defaults;
    setParams(defaults);
    if (running)
      sendPatch(config.toWorker ? config.toWorker(defaults) : defaults);
  };

  const handleApplyRestart = () => {
    const cleaned = cleanParams(params);
    const payload = config.toWorker ? config.toWorker(cleaned) : cleaned;
    sendPatch(payload);
    if (running) {
      reset();
      start();
    } else if (paused) {
      reset();
      start();
      setPaused(false);
    } else {
      reset();
    }
  };

  const handleReset = () => {
    reset();
    setPaused(false);
  };

  //----CSV Download----//
function buildCSV({ prey, predator, dt, seriesLabels, params, modelKey }) {
  const header = [
    `# Model: ${modelKey}`,
    `# Params: ${JSON.stringify(params)}`,
    `time,${seriesLabels[0]},${seriesLabels[1]}`
  ];
  const len = Math.max(prey.length, predator.length);
  const rows = [];
  for (let i = 0; i < len; i++) {
    const t = (i * (Number(dt) || 1)).toFixed(6);
    const a = Number.isFinite(prey[i]) ? prey[i] : '';
    const b = Number.isFinite(predator[i]) ? predator[i] : '';
    rows.push(`${t},${a},${b}`);
  }
  return '\uFEFF' + [...header, ...rows].join('\n'); //BOM for Excel
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const handleDownloadCSV = () => {
  const fullPrey = historyRef.current.prey || [];
  const fullPred = historyRef.current.predator || [];

  const MAX_ROWS = 50000; 
  const step = Math.max(1, Math.ceil(Math.max(fullPrey.length, fullPred.length) / MAX_ROWS));

  const preyDown = fullPrey.filter((_, i) => i % step === 0);
  const predDown = fullPred.filter((_, i) => i % step === 0);

  const seriesLabels = [s0?.label ?? 'Prey', s1?.label ?? 'Predator'];
  const dtForTime = params?.dt ?? MODEL_CONFIG[model]?.defaults?.dt ?? 1;

  const csv = buildCSV({
    prey: preyDown,
    predator: predDown,
    dt: dtForTime * step,
    seriesLabels,
    params,
    modelKey: model,
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  downloadText(`ecosim-${model}-${stamp}.csv`, csv);
};

return (
  <div className="container">
    <div className="card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <h2>Simulation</h2>
          <div style={{ color: "var(--muted)" }}>
            Run ecosystem models and visualize results.
          </div>
          <div style={{ marginTop: 8 }}>
            <label
              style={{ fontSize: 12, color: "var(--muted)", marginRight: 8 }}
            >
              Model:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 8,
                border: "10px solid rgba(15,23,36,0.06)",
              }}
            >
              {Object.entries(MODEL_CONFIG).map(([key, m]) => (
                <option key={key} value={key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={handleReset}>
            Reset
          </button>

          {running ? (
            <button
              className="btn"
              onClick={() => {
                pause();
                setPaused(true);
              }}
            >
              Pause
            </button>
          ) : paused ? (
            <button
              className="btn primary"
              onClick={() => {
                resume();
                setPaused(false);
              }}
            >
              Resume
            </button>
          ) : (
            <button
              className="btn primary"
              onClick={() => {
                start();
                setPaused(false);
              }}
            >
              Run
            </button>
          )}

          <button
            className={`btn ${
              paused && (prey.length > 0 || predator.length > 0)
                ? "primary"
                : "secondary"
            }`}
            onClick={handleDownloadCSV}
            disabled={
              !paused || (prey.length === 0 && predator.length === 0)
            }
          >
            Download CSV
          </button>
        </div>
      </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ height: 320 }}>
            <MiniSVGChart
              prey={prey}
              predator={predator}
              height={320}
              preyColor={s0?.color ?? "#5aa9e6"}
              predatorColor={s1?.color ?? "#ef476f"}
              preyLabel={s0?.label ?? "Prey"}
              predatorLabel={s1?.label ?? "Predator"}
            />
          </div>
        </div>

        <ParamsPanel
          title="Parameters"
          fields={config.fields}
          values={params}
          running={running}
          onChange={handleParamChange}
          onReset={handleResetDefaults}
          onApply={handleApplyRestart}
        />

        <AboutModel
          title={config.about?.title}
          summary={config.about?.summary}
          bullets={config.about?.bullets}
          notes={config.about?.notes}
          equation={config.about?.equation}
        />
      </div>
    </div>
  );
}
