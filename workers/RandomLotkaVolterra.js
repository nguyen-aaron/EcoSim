/*
 params:
    alpha: prey growth rate
    beta: predation rate
    delta: predator reproduction rate
    gamma: predator death rate
    sigmaX: noise intensity for prey
    sigmaY: noise intensity for predator
    x, y: initial populations of prey and predator
    dt: time step for simulation
    fps: frames per second for updates
    seed: random seed for reproducibility
    reflect: keeps populations non-negative by reflecting at zero if true
 */

let params = {
  alpha: 0.6,   
  beta:  0.025, 
  delta: 0.01,  
  gamma: 0.5,   
  sigmaX: 0.2,
  sigmaY: 0.2,
  x: 40, y: 9,  
  dt: 0.02,
  fps: 30,
  seed: 12345,  
  reflect: false 
};

//tiny RNG with seed support (Mulberry32) 
function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
// standard normal via Box–Muller
function makeGaussian(rand) {
  let spare = null;
  return function gaussian() {
    if (spare != null) { const v = spare; spare = null; return v; }
    let u = 0, v = 0, s = 0;
    // avoid 0
    while (s === 0 || s >= 1) {
      u = rand()*2 - 1;
      v = rand()*2 - 1;
      s = u*u + v*v;
    }
    const m = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * m;
    return u * m;
  };
}

let rand = null;
let gauss = null;

function initRng() {
    rand = mulberry32(params.seed >>> 0);
    gauss = makeGaussian(rand);
}

let timer = null;
let time = 0;

//no runge-kutta, euler maruyama method for stochastic differential equations
function eulerMaruyamaStep(x, y, p) {
  const { alpha, beta, delta, gamma, sigmaX, sigmaY, dt } = p;

  const fx = alpha * x - beta * x * y;
  const fy = delta * x * y - gamma * y;

  const dWx = gauss() * Math.sqrt(dt);
  const dWy = gauss() * Math.sqrt(dt);

  let nx = x + fx * dt + sigmaX * x * dWx;
  let ny = y + fy * dt + sigmaY * y * dWy;

  if (p.reflect) {
    if (nx < 0) nx = -nx; 
    if (ny < 0) ny = -ny;
  } else {
    if (nx < 0) nx = 0;
    if (ny < 0) ny = 0;
  }

  return [nx, ny];
}

function tick() {
  const [xn, yn] = eulerMaruyamaStep(params.x, params.y, params);
  params.x = xn;
  params.y = yn;
  time += params.dt;
  postMessage({ t: time, prey: xn, pred: yn });
}

function start() {
  stop();
  initRng();
  const ms = 1000 / (params.fps || 20);
  timer = setInterval(tick, ms);
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

onmessage = ({ data }) => {
  const { type, params: newParams } = data || {};
  if (type === "start") {
    params = { ...params, ...(newParams || {}) };
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    time = 0;
    start();
  } else if (type === "pause") {
    stop();
  } else if (type === "resume") {
    start();
  } else if (type === "reset") {
    time = 0;
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    stop();
  } else if (type === "setParams") {
    params = { ...params, ...(newParams || {}) };
    if (newParams?.seed != null) initRng();
  }
};






