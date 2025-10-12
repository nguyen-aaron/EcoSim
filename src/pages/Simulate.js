import React, { useState, useCallback, useEffect } from 'react';
import { useLoktaVolterra } from '../hooks/useLoktaVolterra';

function MiniSVGChart({ points = [], width = 800, height = 240, stroke = '#97a97b' }) {
  if (!points || points.length === 0) {
    return (
      <div style={{height, display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)'}}>
        No data yet — run the simulation.
      </div>
    );
  }

  const max = Math.max(...points);
  const min = Math.min(...points);
  const pad = 8;
  const labelSpace = 18; 
  const innerW = width - pad * 2;
  const innerH = height - pad * 2 - labelSpace;

  const norm = (v) => (max === min ? innerH / 2 : ((v - min) / (max - min)) * innerH);

  const format = (n) => Number(n).toFixed(0); //whole numbers for the labels

  const path = points.map((v, i) => {
    const x = pad + (i / Math.max(1, points.length - 1)) * innerW;
    const y = pad + (innerH - norm(v));
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  const areaPath = points.map((v, i) => {
    const x = pad + (i / Math.max(1, points.length - 1)) * innerW;
    const y = pad + (innerH - norm(v));
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ') + ` L ${width - pad} ${pad + innerH} L ${pad} ${pad + innerH} Z`;

  const axisY = pad + innerH; //y-position of the x-axis line

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} aria-hidden>
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        {/* grid lines: horizontal */}
        <g stroke="black" strokeWidth={1} opacity={0.06}>
          {Array.from({length:5}).map((_,i)=>{
            const y = pad + (i/(4)) * innerH;
            return <line key={i} x1={pad} x2={width - pad} y1={y} y2={y} />;
          })}
        </g>
        {/* grid lines: vertical (up to 8) */}
        <g stroke="black" strokeWidth={1} opacity={0.04}>
          {Array.from({length: Math.min(8, Math.max(2, points.length))}).map((_,i)=>{
            const x = pad + (i/(Math.max(1, Math.min(7, points.length-1)))) * innerW;
            return <line key={`v-${i}`} x1={x} x2={x} y1={pad} y2={axisY} />;
          })}
        </g>

        {/* area under curve */}
        <path d={areaPath} fill={stroke} opacity={0.08} />

        {/* main line */}
        <path d={path} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((v, i) => {
          const x = pad + (i / Math.max(1, points.length - 1)) * innerW;
          const y = pad + (innerH - norm(v));
          return <circle key={i} cx={x} cy={y} r={3} fill={stroke} />;
        })}

        {/* y axis labels: max, mid, min*/}
        <g style={{ color:'var(--muted)', fontFamily:'inherit' }} fill="currentColor" fontSize={12} textAnchor="end">
          <text x={pad - 6} y={pad + 4}>{format(max)}</text>
          <text x={pad - 6} y={pad + innerH/2 + 4}>{format((max+min)/2)}</text>
          <text x={pad - 6} y={axisY + 4}>{format(min)}</text>
        </g>

        {/* axes */}
        <g stroke="black" strokeWidth={1} opacity={0.6}>
          <line x1={pad} x2={pad} y1={pad} y2={axisY} />
          <line x1={pad} x2={width - pad} y1={axisY} y2={axisY} />
        </g>

        {/* axis labels (time and population) */}
        <g style={{ color:'var(--muted)', fontFamily:'inherit' }} fill="currentColor" fontSize={12}>
          <text x={width/2} y={axisY + 23} textAnchor="middle">time</text>
          <text
            textAnchor="middle"
            transform={`translate(${pad - 50}, ${pad + innerH/2}) rotate(-90)`}
          >
            population
          </text>
        </g>
      </svg>
    </>
  );
}

function Simulate() {
  const [running, setRunning] = useState(false);
  //the array of y-values for the chart
  const [data, setData] = useState([]);
  // pull data from the useLoktaVolterra.js hook, only prey for now
  const { prey = [], start, pause, reset } = useLoktaVolterra?.() || {}; 



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
    //keeping the demo data for now
    runOnce();
  };

  const handlePause = () => {
    setRunning(false);
    if (pause) pause();
  };
  const handleReset = () => { setRunning(false); if (reset) reset(); setData([]); };

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
          <div style={{height:280}}>
            <MiniSVGChart points={data} height={280} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Simulate;
