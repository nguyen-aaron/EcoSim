/*
params:
    r1, r2: intrinsic growth rates of species 1 and 2
    K1, K2: carrying capacities of species 1 and 2
    alpha12: effect of species 2 on species 1
    alpha21: effect of species 1 on species 2
    x1, x2: initial populations of species 1 and 2
    dt: time step for simulation
    fps: frames per second for updates
*/    
let params = {
  r1: 0.5, r2: 0.4,
  K1: 100, K2: 80,
  alpha12: 0.6,  
  alpha21: 0.7,  
  x1: 40, x2: 20,
  dt: 0.05, fps: 20
};

let timer = null;
let time = 0;

const rk4 = (x1, x2, dt, p) => {
  const f1 = (X1, X2) => p.r1 * X1 * (1 - (X1 + p.alpha12 * X2) / p.K1);
  const f2 = (X1, X2) => p.r2 * X2 * (1 - (X2 + p.alpha21 * X1) / p.K2);

  const k1x = f1(x1, x2),                   k1y = f2(x1, x2);
  const k2x = f1(x1 + 0.5*dt*k1x, x2 + 0.5*dt*k1y), k2y = f2(x1 + 0.5*dt*k1x, x2 + 0.5*dt*k1y);
  const k3x = f1(x1 + 0.5*dt*k2x, x2 + 0.5*dt*k2y), k3y = f2(x1 + 0.5*dt*k2x, x2 + 0.5*dt*k2y);
  const k4x = f1(x1 + dt*k3x,     x2 + dt*k3y),     k4y = f2(x1 + dt*k3x,     x2 + dt*k3y);

  const nx1 = Math.max(0, x1 + (dt/6)*(k1x + 2*k2x + 2*k3x + k4x));
  const nx2 = Math.max(0, x2 + (dt/6)*(k1y + 2*k2y + 2*k3y + k4y));
  return [nx1, nx2];
};

function tick() {
  const { dt } = params;
  const [nx1, nx2] = rk4(params.x1, params.x2, dt, params);
  params.x1 = nx1; params.x2 = nx2;
  time += dt;
  // need to update when SVG chart is updated to handle more variables than just prey and predator
  postMessage({ t: time, prey: nx1, pred: nx2 });
}

function start() {
  stop();
  const ms = 1000 / (params.fps || 20);
  timer = setInterval(tick, ms);
}
function stop() { 
    if (timer) clearInterval(timer); 
    timer = null; 
}

onmessage = ({ data }) => {
  console.log('worker received message', data);
  const { type, params: newParams } = data || {};
  if (type === "start") {
    params = { ...params, ...(newParams||{}) };
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    time = 0;
    start();
  }
  else if (type === "pause") { // Changed from "stop"
    stop();
  }
  else if (type === "resume") {
    start();
  }
  else if (type === "reset") {
    time = 0;
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    stop();
  }
  else if (type === "setParams") {
    params = { ...params, ...(newParams||{}) };
  }
};
