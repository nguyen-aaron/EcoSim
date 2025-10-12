/*
 params: alpha, beta, delta, gamma, x0, y0, dt, fps
 alpha = prey growth rate
 beta = predation rate
 delta = predator reproduction rate
 gamma = predator death rate
 x0 = initial prey population
 y0 = initial predator population
 dt = time step for simulation
 fps = frames per second for updates  
 */
let params = { alpha:0.6, beta:0.025, delta:0.01, gamma:0.5, x:40, y:9, dt:0.05, fps:20 };
let timer = null;
let time = 0;


//Runge-Kutta 4th order method to compute next population
//used to solve the Lokta-Volterra differential equations since they can't be calculated directly
const rk4 = (x, y, dt, alpha, beta, delta, gamma) => {
  const fx = (X,Y)=> alpha*X - beta*X*Y;
  const fy = (X,Y)=> delta*X*Y - gamma*Y;
  const k1x=fx(x,y),                 k1y=fy(x,y);
  const k2x=fx(x+0.5*dt*k1x,y+0.5*dt*k1y), k2y=fy(x+0.5*dt*k1x,y+0.5*dt*k1y);
  const k3x=fx(x+0.5*dt*k2x,y+0.5*dt*k2y), k3y=fy(x+0.5*dt*k2x,y+0.5*dt*k2y);
  const k4x=fx(x+dt*k3x, y+dt*k3y),        k4y=fy(x+dt*k3x, y+dt*k3y);
  return [
    Math.max(0, x + (dt/6)*(k1x + 2*k2x + 2*k3x + k4x)),
    Math.max(0, y + (dt/6)*(k1y + 2*k2y + 2*k3y + k4y)),
  ];
};

//Each tick, calculate the next point and post it back to Simulate.js
function tick() {
  const { dt, alpha, beta, delta, gamma } = params;
  const [xn, yn] = rk4(params.x, params.y, dt, alpha, beta, delta, gamma);
  params.x = xn;
  params.y = yn;
  time += dt;
  postMessage({ t: time, prey: xn, predator: yn });
}

// Start the simulation with setInterval based on fps
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
  const { type, params: newParams } = data || {};
  if (type === "start") {
    params = { ...params, ...(newParams||{}) };
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
    time = 0;
    start();
  }
  else if (type === "stop") {
    stop();
  }
  else if (type === "reset") {
    time = 0;
    if (newParams?.x0 != null) params.x = newParams.x0;
    if (newParams?.y0 != null) params.y = newParams.y0;
  }
  else if (type === "setParams") {
    params = { ...params, ...(newParams||{}) };
  }
};
