export const MODEL_CONFIG = {
  lotka: {
    label: 'Lotka–Volterra (Predator–Prey)',     
    workerUrl: new URL('../EcosystemEngine/LotkaVolterra.js', import.meta.url),
    defaults: { alpha: 0.6, beta: 0.025, delta: 0.01, gamma: 0.5, x: 40, y: 9, dt: 0.05, fps: 20 },
    fields: [
      { key: 'alpha', label: 'α (prey growth)',    min: 0, step: 0.005, live: true },
      { key: 'beta',  label: 'β (predation rate)', min: 0, step: 0.005, live: true },
      { key: 'delta', label: 'δ (predator birth)', min: 0, step: 0.005, live: true },
      { key: 'gamma', label: 'γ (predator death)', min: 0, step: 0.005, live: true },
      { key: 'x',     label: 'Prey₀ (x, initial prey population)',     min: 0, step: 1, live: false },
      { key: 'y',     label: 'Pred₀ (y, initial predator population)', min: 0, step: 1, live: false },
      { key: 'dt',    label: 'Δt (time step)',     min: 0.001, step: 0.05, live: false },
      { key: 'fps',   label: 'FPS',                min: 1, max: 120, step: 1, live: true },
    ],
    about: {
      title: 'About the Lotka–Volterra Model',
      summary: 'The Lotka-Volterra model is a classic mathematical model of predator-prey interactions in ecological systems. It describes how two species, one being a predator and the other being its prey, interact and affect each other\'s population over time. The model is a pair of first-order nonlinear differential equations: ',
      equation: String.raw`
      \begin{aligned}
        \frac{dx}{dt} &= \alpha x - \beta xy \\
        \frac{dy}{dt} &= \delta xy - \gamma y
      \end{aligned}
    `,
      bullets: [
        'The expected behavior of the model is an oscillation between the populations of prey and predators over time.',

      ],
      notes: 'Note: This model assumes an idealized environment where prey food supply is always sufficient, predators have limitless appetite, and there are no effects on population due enviromental changes or disruptions. Therefore, real-world populations do not follow these exact dynamics, but many predator-prey systems show roughly similar patterns as the model.'
    },
    toWorker: (p) => p,
  },

  competitivelotka: {
    label: 'Lotka–Volterra (Competitive)',
    workerUrl: new URL('../EcosystemEngine/CompetitiveLotkaVolterra.js', import.meta.url),
    defaults: { r1: 0.5, r2: 0.4, K1: 100, K2: 80, alpha12: 0.6, alpha21: 0.7, x1: 40, x2: 20, dt: 0.05, fps: 20 },
    fields: [
      { key: 'r1',      label: 'r₁ (growth of species 1)',          min: 0,     step: 0.01,  live: true },
      { key: 'r2',      label: 'r₂ (growth of species 2)',          min: 0,     step: 0.01,  live: true },
      { key: 'K1',      label: 'K₁ (carrying capacity of species 1)',        min: 1,     step: 1,     live: true },
      { key: 'K2',      label: 'K₂ (carrying capacity of species 2)',        min: 1,     step: 1,     live: true },
      { key: 'alpha12', label: 'α₁₂ (species 2 impact on species 1)',     min: 0,     step: 0.01,  live: true },
      { key: 'alpha21', label: 'α₂₁ (species 1 impact on species 2)',     min: 0,     step: 0.01,  live: true },
      { key: 'x1',      label: 'x₁ ₀ (species 1 starting population)',  min: 0,     step: 1,     live: false },
      { key: 'x2',      label: 'x₂ ₀ (species 2 starting population)',  min: 0,     step: 1,     live: false },
      { key: 'dt',      label: 'Δt (time step)',         min: 0.001, step: 0.01,  live: false },
      { key: 'fps',     label: 'FPS',                    min: 1,     max: 120,    step: 1, live: true },

    ],
    about: {
      title: 'About the Competitive Lotka–Volterra Model',
      summary: 'The Competitive Lotka-Volterra model describes the dynamics of two species competing for the same limited resources in an ecosystem. Each species\' growth is influenced not only by its own population size, but also by the presence of the other competing species. The model is represented by a set of differential equations:',
      equation: String.raw`
      \begin{aligned}
        \frac{dx_1}{dt} &= r_1 x_1 \left(1 - \left(\frac{x_1 + \alpha_{12} x_2}{K_1}\right)\right) \\
        \frac{dx_2}{dt} &= r_2 x_2 \left(1 - \left(\frac{x_2 + \alpha_{21} x_1}{K_2}\right)\right)
      \end{aligned}
    `,
      bullets: [
        'The carrying capacity of each species represents the maximum population size that the environment can sustain for that species.',
        'Depending on the parameters, the model is expected to show various outcomes, including competitive exclusion, stable coexistence, or unstable coexistence.'

      ],
      notes: 'Note: This model makes some assumptions, such as constant environmental conditions, no other species interactions, and each interaction of species 1 and 2 are considered to be harmful to one or the other.'
    },
    toWorker: (p) => p
  //add more models here
  }
};
