export const MODEL_CONFIG = {
  lotka: {
    label: 'Lotka–Volterra (Predator–Prey)',     
    workerUrl: new URL('../EcosystemEngine/LotkaVolterra.js', import.meta.url),
    defaults: { alpha: 0.6, beta: 0.025, delta: 0.01, gamma: 0.5, x: 40, y: 9, dt: 0.05, fps: 20 },
    fields: [
      { key: 'alpha', label: 'α (prey growth)',    min: 0, step: 0.001, live: true },
      { key: 'beta',  label: 'β (predation rate)', min: 0, step: 0.001, live: true },
      { key: 'delta', label: 'δ (predator birth)', min: 0, step: 0.001, live: true },
      { key: 'gamma', label: 'γ (predator death)', min: 0, step: 0.001, live: true },
      { key: 'x',     label: 'Prey₀ (x, initial prey population)',     min: 0, step: 1, live: false },
      { key: 'y',     label: 'Pred₀ (y, initial predator population)', min: 0, step: 1, live: false },
      { key: 'dt',    label: 'Δt (time step)',     min: 0.001, step: 0.01, live: false },
      { key: 'fps',   label: 'FPS',                min: 1, max: 120, step: 1, live: true },
    ],
    toWorker: (p) => p,
  },

  //add more models here

};
