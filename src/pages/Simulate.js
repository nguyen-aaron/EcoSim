import React, { useState, useCallback, useEffect } from 'react';
import { useLoktaVolterra } from '../hooks/useLoktaVolterra';


//draws an SVG line chart of the data
function MiniSVGChart({
  prey = [],
  predator = [],
  width = 800,
  height = 240,
  preyColor = '#5aa9e6',
  predatorColor = '#ef476f'
}) {
  
  //filter datapoints to valid numbers only. there was an issue with NaN values being added, not sure why
  prey = Array.isArray(prey) ? prey.filter(Number.isFinite) : [];
  predator = Array.isArray(predator) ? predator.filter(Number.isFinite) : [];

  const allPoints = [...prey, ...predator];
  if (!allPoints.length) {
    return (
      <div style={{height, display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)'}}>
        No data yet — run the simulation.
      </div>
    );
  }

  const max = Math.max(...allPoints);
  const min = Math.min(...allPoints);
  const pad = 30;
  const labelSpace = 18;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2 - labelSpace;

  //function to normalize values to fit in the chart height
  const norm = (v) => (max === min ? innerH / 2 : ((v - min) / (max - min)) * innerH);

  //gemerate the line path for the given array of y-values
  const makePath = (arr) =>
    arr.map((v, i) => {
      const x = pad + (i / Math.max(1, arr.length - 1)) * innerW;
      const y = pad + (innerH - norm(v));
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  
  const format = (n) => Number(n).toFixed(0);

  const preyPath = prey.length ? makePath(prey) : '';
  const predPath = predator.length ? makePath(predator) : '';
  const axisY = pad + innerH;
  const mid = (max + min) / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <rect width={width} height={height} fill="transparent" />
      <g stroke="black" strokeWidth={1} opacity={0.06}>
        {Array.from({ length: 5 }).map((_, i) => {
          const y = pad + (i / 4) * innerH;
          return <line key={i} x1={pad} x2={width - pad} y1={y} y2={y} />;
        })}
      </g>

      {prey.length > 0 && (
        <>
          <path d={`${preyPath} L ${width - pad} ${axisY} L ${pad} ${axisY} Z`} fill={preyColor} opacity={0.06} />
          <path d={preyPath} fill="none" stroke={preyColor} strokeWidth={2.5} />
        </>
      )}

      {predator.length > 0 && (
        <>
          <path d={`${predPath} L ${width - pad} ${axisY} L ${pad} ${axisY} Z`} fill={predatorColor} opacity={0.05} />
          <path d={predPath} fill="none" stroke={predatorColor} strokeWidth={2.5} />
        </>
      )}

      <g stroke="black" strokeWidth={1} opacity={0.6}>
        <line x1={pad} x2={pad} y1={pad} y2={axisY} />
        <line x1={pad} x2={width - pad} y1={axisY} y2={axisY} />
      </g>

      <g style={{ color: 'var(--muted)', fontFamily: 'inherit' }} fill="currentColor" fontSize={12}>
        <text x={width / 2} y={axisY + 23} textAnchor="middle">time</text>
        <text textAnchor="middle" transform={`translate(${pad - 50}, ${pad + innerH / 2}) rotate(-90)`}>population</text>
        <text x={pad - 20} y={pad - 5}>{format(max)}</text>
        <text x={pad - 15} y={pad - 5 + innerH / 2 + 4}>{format(mid)}</text>
        <text x={pad - 15} y={axisY + 15}>{format(min)}</text>
      </g>

      <g style={{ color: 'var(--muted)', fontFamily: 'inherit' }} fill="currentColor" fontSize={12}>
        <g transform={`translate(${width - pad - 140}, ${pad - 20})`}>
          <line x1="0" y1="0" x2="16" y2="0" stroke={preyColor} strokeWidth="3" />
          <text x="22" y="4">Prey</text>
        </g>
        <g transform={`translate(${width - pad - 70}, ${pad - 20})`}>
          <line x1="0" y1="0" x2="16" y2="0" stroke={predatorColor} strokeWidth="3" />
          <text x="22" y="4">Predator</text>
        </g>
      </g>
    </svg>
  );
}

function Simulate() {
  const [running, setRunning] = useState(false);
  //the array of y-values for the chart
  const [data, setData] = useState([]);
  // pull data from the useLoktaVolterra.js hook, for both prey and predator
  // (could add options to configure the parameters later)
  const { prey = [], predator = [], start, pause, reset } = useLoktaVolterra?.() || {}; 

  const runOnce = useCallback(() => {
     // generate sample data (sine-ish) for demo
     // in real use, data comes from the simulation
    const pts = Array.from({length:40}, (_,i) => {
      const t = i / 6;
      return Math.round(50 + Math.sin(t) * 30 + Math.random() * 6);
    });
    setData(pts);
  }, []);

  // update data when the hook recieves update from LoktaVolterra.js (based on the fps param))
  useEffect(() => {
    setData(prey || []);
  }, [prey]);

  const handleRun = () => {
    setRunning(true);
    if (start) start();
  };

  const handlePause = () => {
    setRunning(false);
    if (pause) pause();
  };
  const handleReset = () => { 
    setRunning(false); 
    if (reset) reset(); 
    setData([]); 
  };

  return (
    <div className="container">
      <div className="card" style={{padding:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>
            <h2>Simulation</h2>
            <div style={{color:'var(--muted)'}}>Run ecosystem models and visualize results.</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn secondary" onClick={handleReset}>Reset</button>
            {running ? (
              <button className="btn" onClick={handlePause}>Pause</button>
            ) : (
              <button className="btn primary" onClick={handleRun}>Run</button>
            )}
          </div>
        </div>

        <div style={{marginTop:16}}>
          <div style={{height:320}}>
            <MiniSVGChart prey={prey} predator={predator} height={320} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Simulate;
