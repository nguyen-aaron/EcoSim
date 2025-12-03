/*
params:
    r: prey growth rate
    K: prey carrying capacity
    a: predation rate
    b: prey refuge effect
    c: predator efficiency
    d: predator death rate
    x0: initial prey population
    y0: initial predator population
    dt: time step
    fps: simulation steps per second
    sigmaX: noise intensity for prey
    sigmaY: noise intensity for predator
    seed: random seed for reproducibility
    reflect: keeps populations non-negative by reflecting at zero if true (no extinction)
    demographic: if true, uses demographic noise (sqrt(N)) instead of environmental (proportional to N)
*/

let params = {
  r: 1.0, K: 100, a: 0.5, b: 0.05, c: 0.1, d: 0.2,
  x: 40, y: 9, x0: 40, y0: 9,
  dt: 0.05, fps: 20,
  sigmaX: 0.05,          
  sigmaY: 0.05,          
  seed: 12345,           
  reflect: false,        
  demographic: false,   
};

let timer = null;
let time = 0;

const fx = (x, y, p) => p.r * x * (1 - x / p.K) - (p.a * x * y) / (1 + p.b * x);
const fy = (x, y, p) => p.c * (p.a * x * y) / (1 + p.b * x) - p.d * y;

function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function makeGaussian(rand) {
  let spare = null;
  return function gaussian() {
    if (spare != null) { const v = spare; spare = null; return v; }
    let u = 0, v = 0, s = 0;
    while (s === 0 || s >= 1) {
      u = rand() * 2 - 1;
      v = rand() * 2 - 1;
      s = u*u + v*v;
    }
    const m = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * m;
    return u * m;
  };
}

let rand = null, gauss = null;
function initRng() {
  if (params.seed == null) {
    const fallback = () => Math.random();
    gauss = makeGaussian(fallback);
  } else {
    rand = mulberry32(params.seed >>> 0);
    gauss = makeGaussian(rand);
  }
}

function emStep(x, y, p) {
  const { dt, sigmaX = 0, sigmaY = 0, reflect, demographic } = p;
  const dx = fx(x, y, p);
  const dy = fy(x, y, p);

  const dWx = gauss() * Math.sqrt(dt);
  const dWy = gauss() * Math.sqrt(dt);

  const noiseX = demographic ? sigmaX * Math.sqrt(Math.max(x, 0)) : sigmaX * x;
  const noiseY = demographic ? sigmaY * Math.sqrt(Math.max(y, 0)) : sigmaY * y;

  let xn = x + dx * dt + noiseX * dWx;
  let yn = y + dy * dt + noiseY * dWy;

  if (reflect) {
    if (xn < 0) xn = -xn;
    if (yn < 0) yn = -yn;
  } else {
    if (xn < 0) xn = 0;
    if (yn < 0) yn = 0;
  }
  return [xn, yn];
}

function tick() {
  const [xn, yn] = emStep(params.x, params.y, params);
  if (!Number.isFinite(xn) || !Number.isFinite(yn)) {
    console.error('[worker] NaN in state', { xn, yn, params });
    stop();
    return;
  }
  params.x = xn; params.y = yn;
  time += params.dt;
  postMessage({ t: time, prey: xn, pred: yn });
}

function start() {
  stop();
  if (params.x0 != null) params.x = params.x0;
  if (params.y0 != null) params.y = params.y0;
  time = 0;
  initRng();
  postMessage({ t: time, prey: params.x, pred: params.y });
  const ms = 1000 / (params.fps || 20);
  timer = setInterval(tick, ms);
}
function stop() { if (timer) clearInterval(timer); timer = null; }

onmessage = ({ data }) => {
  const { type, params: newParams } = data || {};
  if (type === 'start') {
    params = { ...params, ...(newParams || {}) };
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    time = 0;
    start();
  } else if (type === 'pause') {
    stop();
  } else if (type === 'resume') {
    stop();
    const ms = 1000 / (params.fps || 20);
    if (!gauss) initRng();
    timer = setInterval(tick, ms);
  } else if (type === 'reset') {
    time = 0;
    if (newParams?.x0 != null) params.x = newParams.x0; else if (params.x0 != null) params.x = params.x0;
    if (newParams?.y0 != null) params.y = newParams.y0; else if (params.y0 != null) params.y = params.y0;
    stop();
  } else if (type === 'setParams') {
    const hadSeed = params.seed;
    params = { ...params, ...(newParams || {}) };
    if (newParams?.seed !== undefined && newParams.seed !== hadSeed) initRng();
  }
};
