const PUBLIC = process.env.PUBLIC_URL || "";

export const MODEL_CONFIG = {
  lotka: {
    label: 'Lotka–Volterra (Classic Predator–Prey)',     
    workerUrl: `${PUBLIC}/workers/LotkaVolterra.js`,
    defaults: { alpha: 0.6, beta: 0.025, delta: 0.01, gamma: 0.5, x: 40, y: 9, dt: 0.05, fps: 20 },
    series: [
      { slot: "prey", label: "Prey",         color: "#5aa9e6"},
      { slot: "predator", label: "Predator", color: "#e65a5a" }
    ],
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
      title: 'About the Classic Predator-Prey Lotka–Volterra Model',
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
    workerUrl: `${PUBLIC}/workers/CompetitiveLotkaVolterra.js`,
    defaults: { r1: 0.5, r2: 0.4, K1: 100, K2: 80, alpha12: 0.6, alpha21: 0.7, x1: 40, x2: 20, dt: 0.05, fps: 20 },
    series: [
      { slot: "prey",     label: "Species 1", color: "#4CAF50"},
      { slot: "predator", label: "Species 2", color: "#2196F3" }
    ],
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
  },

  randomlotka: {
    label: "Lotka–Volterra (Random Fluctuations)",
    workerUrl: `${PUBLIC}/workers/RandomLotkaVolterra.js`,
    defaults: {
      alpha: 0.6, beta: 0.025, delta: 0.01, gamma: 0.5,
      sigmaX: 0.2, sigmaY: 0.2,
      x: 40, y: 9,
      dt: 0.02, fps: 30,
      seed: 12345,
      reflect: false
    },
    series: [
      { slot: "prey",    label: "Prey",      color: "#5aa9e6"},
      { slot: "predator", label: "Predator", color: "#e65a5a"}
    ],
    fields: [
      { key: 'alpha', label: 'α (prey growth)',        min: 0, step: 0.01, live: true },
      { key: 'beta',  label: 'β (predation rate)',     min: 0, step: 0.001, live: true },
      { key: 'delta', label: 'δ (predator reproduction rate)',    min: 0, step: 0.001, live: true },
      { key: 'gamma', label: 'γ (predator death)',     min: 0, step: 0.01, live: true },
      { key: 'sigmaX',label: 'σₓ (prey randomness)',        min: 0, step: 0.01, live: true },
      { key: 'sigmaY',label: 'σᵧ (predator randomness)',    min: 0, step: 0.01, live: true },
      { key: 'x',     label: 'x₀ (prey start)',        min: 0, step: 1, live: false },
      { key: 'y',     label: 'y₀ (predator start)',    min: 0, step: 1, live: false },
      { key: 'dt',    label: 'Δt (time step)',         min: 0.001, step: 0.001, live: false },
      { key: 'fps',   label: 'FPS',                    min: 1, max:120, step: 1, live: true },
      { key: 'seed',  label: 'seed (for randomness)',                   min: 0, step: 1, live: false },
      { key: 'reflect', label: 'Disable extinction due to randomness (mirror negatives into positives)', type: 'checkbox', live: false }
    ],
    about: {
      title: 'About the Random Lotka–Volterra Model',
      summary: 'The Random Lotka-Volterra model is an extension of the classic Lotka-Volterra predator-prey model that integrates stochastic (random) fluctuations in the population dynamics. This randomness is to simulate unpredictable environmental variations such as disease, natural disasters, resource fluctuations, climate changes, and other random factors that can affect populations negatively or positively. The model is represented by the following stochastic differential equations:',
      equation: String.raw`
      \begin{aligned}
        dx &= \left(\alpha x - \beta xy\right)dt + \sigma_x x dW_t^x \\
        dy &= \left(\delta xy - \gamma y\right)dt + \sigma_y y dW_t^x
      \end{aligned}
    `,
      bullets: [
        'The terms σₓX dWₓ and σᵧY dWᵧ represent the stochastic components, where σₓ and σᵧ are the noise intensities for prey and predator populations, respectively, and dWₓ and dWᵧ are increments of Wiener processes (representing random fluctuations).',
        'The expected behavior of this model includes oscillations in population sizes similar to the classic Lotka-Volterra model, but with added variability due to the stochastic terms.'
      ],
      notes: 'Note: This model assumes that the random fluctuations are normally distributed. Depending on the noise intensity, populations may face extinction if enabled or rapid growth spurts may occur.'

    },
    toWorker: (p) => p,
  },

  rosenzweigmacarthur: {
    label: 'Stochastic Rosenzweig–MacArthur (Realistic Predator-Prey)',
    workerUrl: `${PUBLIC}/workers/RosenzweigMacArthur.js`,
    defaults: { 
      r: 0.94, K: 100, a: 0.25, b: 0.05, c: 0.1, d: 0.35, 
      x0: 24, y0: 6, dt: 0.05, fps: 20, 
      sigmaX: 0.01, sigmaY: 0.01, seed: 12345, 
      reflect: false, demographic: false 
    },
    series: [
      { slot: "prey",     label: "Prey",      color: "#5aa9e6"},
      { slot: "predator", label: "Predator",  color: "#e65a5a" }
    ],
    fields: [
      { key: "r",   label: "r (prey growth)", live: true },
      { key: "K",   label: "K (prey carrying capacity)", live: true },
      { key: "a",   label: "a (predator attack rate)", live: true },
      { key: "b",   label: "b (prey refuge effect)", live: true },
      { key: "c",   label: "c (conversion of prey biomass into predator growth)", live: true },
      { key: "d",   label: "d (predator death in absence of prey)", live: true },
      { key: "x0",  label: "x₀ (starting prey population)" },
      { key: "y0",  label: "y₀ (starting predator population)" },
      { key: "dt",  label: "dt (time step)", live: true },
      { key: "fps", label: "fps" },
      { key: "sigmaX", label: "σx (prey randomness)", live: true },
      { key: "sigmaY", label: "σy (predator randomness)", live: true },
      { key: "seed", label: "seed" },
      { key: "reflect", label: "Disable extinction due to randomness (mirror negatives into positives)", type: "checkbox", live: true },
      { key: "demographic", label: "Disable environmental randomness (enable individual pred/prey randomness)", type: "checkbox", live: true },
    ],
    about: {
      title: 'About the Stochastic Rosenzweig–MacArthur Model',
      summary: 'The Rosenzweig-MacArthur model is an extension of the classic Lotka-Volterra predator-prey model that incorporates more realistic ecological dynamics, particularly in terms of predator-prey interactions. Unlike the classic Lotka-Volterra model, the Rosenzweig-MacArthur model introduces a saturating functional response for predation, which accounts for the fact that predators have a limited capacity to consume prey as prey density increases. The model is represented by the following differential equations:',
      equation: String.raw`
        \begin{aligned}
          dX_t &= \left[
            r X_t \left(1 - \frac{X_t}{K}\right)
            - \frac{a X_t Y_t}{1 + b X_t}
          \right] dt
          + \sigma_X X_t\, dW_t^{(x)} \\[8pt]
          dY_t &= \left[
            c\,\frac{a X_t Y_t}{1 + b X_t}
              - d Y_t
            \right] dt
            + \sigma_Y Y_t\, dW_t^{(y)}
          \end{aligned}
        `,
      bullets: [
        'Check the individual randomness box to see extinction risks or realistic fluctuations at low populations. Keep it unchecked to see smoother population curves that affect both popululations equally.',
        'The terms σₓX dWₓ and σᵧY dWᵧ represent the stochastic components, where σₓ and σᵧ are the noise intensities for prey and predator populations, respectively, and dWₓ and dWᵧ are increments of Wiener processes (representing random fluctuations).',
        'This model includes an added random component to the original Rosenzweig-MacArthur model to simulate environmental and demographic randomness affecting both prey and predator populations',
        'The expected behavior of this model includes stable oscillations in population sizes, with the potential for more complex dynamics such as limit cycles or chaotic behavior depending on the parameters.'
      ],
      notes: 'Note: This model assumes that the environment has a carrying capacity for the prey population and that predators have a limited ability to consume prey. These factors lead to more complex dynamics compared to the classic Lotka-Volterra model.'
    },
    toWorker: (p) => p,

  }, 
    //add more models here

};
