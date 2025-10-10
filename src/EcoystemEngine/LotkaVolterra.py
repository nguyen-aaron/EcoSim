import platform

# Lotka-Volterra equations parameters
# alpha: preys' growth rate
alpha = 0.8
# beta: prey death rate due to predation, the rate at which predators encounter prey, decreasing the prey population by 1
beta = 0.04
# gamma: predators' death rate due to lack of prey, starvation rate
gamma = 0.5
# delta: predators' growth rate
delta = 0.01
# Initial prey populations
x0 = 60
# Initial predator populations
y0 = 15
# Time unit (e.g., days, months, years)
dt = 0.005
# Maximum time
t_max = 200.0
# Start time
t = 0.0

# Current populations
x = x0
y = y0

# Store population 
prey_list = []
pred_list = []

# Store time
time_list = []

while t < t_max:
    # preygrowth is the same as dx/dt
    preygrowth = alpha * x - beta * x * y
    # predgrowth is the same as dy/dt
    predgrowth = -gamma * y + delta * x * y
    x += preygrowth * dt
    y += predgrowth * dt
    print("prey:", x)
    print("pred:", y)
    prey_list.append(x)
    pred_list.append(y)
    time_list.append(t)
    if x < 0:
        x = 0
    if y < 0:
        y =0
    t += dt