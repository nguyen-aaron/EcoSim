import platform

# Lotka-Volterra equations parameters
# alpha: preys' growth rate
# beta: prey death rate due to predation, the rate at which predators encounter prey, decreasing the prey population by 1
# gamma: predators' death rate due to lack of prey, starvation rate
# delta: predators' growth rate
# x0: Initial prey populations
# y): Initial predator populations
# dt: Time unit (e.g., days, months, years)
# t_max: Maximum time
# t: Start time

def simulate_lotka_volterra(alpha, beta, gamma, delta, x0, y0, dt, t_max, clamp_nonneg=True):
    # initial state
    t = 0.0
    x = x0
    y = y0

    # series (include the starting point)
    times = [t]
    prey  = [x]
    pred  = [y]

    # cap steps
    max_steps = 100_000
    steps = 0

    while t < t_max and steps < max_steps:
        # derivatives at current state
        dxdt = alpha * x - beta * x * y
        dydt = -gamma * y + delta * x * y

        # Euler step
        x = x + dxdt * dt
        y = y + dydt * dt
        t = t + dt

        # clamp
        if clamp_nonneg:
            if x < 0: x = 0.0
            if y < 0: y = 0.0

        # record
        times.append(t)
        prey.append(x)
        pred.append(y)

        steps += 1

    # summary
    metrics = {
        "final":   {"prey": prey[-1], "predator": pred[-1]},
        "max":     {"prey": max(prey), "predator": max(pred)},
        "min":     {"prey": min(prey), "predator": min(pred)},
        "steps":   steps
    }

    return {"time": times, "prey": prey, "predator": pred, "metrics": metrics}

if __name__ == "__main__":
    result = simulate_lotka_volterra(
        alpha=1.5, beta=1, gamma=3, delta=1,
        x0=10, y0=5, dt=0.005, t_max=20.0
    )
    print(result["metrics"])