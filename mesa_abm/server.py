import os
from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization.modules import CanvasGrid, ChartModule
from mesa.visualization.UserParam import UserSettableParameter

from mesa_abm.agents import Predator, Prey, GrassPatch, InvasivePredator
from mesa_abm.model import PredatorPrey


def predator_prey_portrayal(agent):
    if agent is None:
        return

    portrayal = {}

    if isinstance(agent, Prey):
        # Draw prey
        portrayal = {
            "Shape": f"{os.path.dirname(os.path.realpath(__file__))}/sheep.png",
            "x": 0,
            "y": 0,
            "scale": 0.5,
            "Layer": 1,
            "text": agent.energy,
            "text_color": "black",
        }
        # Alternative (no image):
        # portrayal = {"Shape": "circle", "Color": "white", "Filled": "true", "Layer": 1, "r": 0.5}

    elif isinstance(agent, InvasivePredator):
        # Draw invasive predator (purple circle)
        portrayal = {
            "Shape": "circle",
            "Color": "#6A0DAD",
            "Filled": "true",
            "Layer": 2,
            "r": 0.5,
            "text": agent.energy,
            "text_color": "white",
        }

    elif isinstance(agent, Predator):
        # Draw predator
        portrayal = {
            "Shape": f"{os.path.dirname(os.path.realpath(__file__))}/wolf.png",
            "x": 0,
            "y": 0,
            "scale": 0.5,
            "Layer": 1,
            "text": agent.energy,
            "text_color": "black",
        }
        # Alternative (no image):
        # portrayal = {"Shape": "circle", "Color": "red", "Filled": "true", "Layer": 2, "r": 0.5}

    elif isinstance(agent, GrassPatch):
        # Draw grass (green if fully grown, pale if eaten/regrowing)
        if agent.fully_grown:
            portrayal = {
                "Shape": "rect",
                "Color": "green",
                "Filled": "true",
                "Layer": 0,
                "w": 1,
                "h": 1,
            }
        else:
            portrayal = {
                "Shape": "rect",
                "Color": "#ffffe0",
                "Filled": "true",
                "Layer": 0,
                "w": 1,
                "h": 1,
            }

    return portrayal


model_params = {
    # Predators
    "initial_predators": UserSettableParameter("slider", "Initial number of predators", 10, 10, 200, 1),
    "predator_reproduce": UserSettableParameter("slider", "Predator reproduce rate", 0.09, 0, 1, 0.01),
    "predator_gain_from_food": UserSettableParameter("slider", "Energy gained from eating prey", 10, 1, 50, 1),
    "initial_predator_energy": UserSettableParameter("slider", "Predator energy at creation", 4, 1, 100, 1),

    # Prey
    "initial_prey": UserSettableParameter("slider", "Initial number of prey", 40, 10, 200, 1),
    "prey_reproduce": UserSettableParameter("slider", "Prey reproduce rate", 0.09, 0, 1, 0.01),
    "prey_gain_from_food": UserSettableParameter("slider", "Energy gained from eating grass", 10, 1, 20, 1),
    "initial_prey_energy": UserSettableParameter("slider", "Prey energy at creation", 10, 1, 100, 1),

    # Invasive predator
    "initial_invasive": UserSettableParameter("slider", "Initial number of invasive predators", 0, 0, 50, 1),
    "invasive_reproduce": UserSettableParameter("slider", "Invasive reproduce rate", 0.08, 0, 1, 0.01),
    "invasive_gain_from_food": UserSettableParameter("slider", "Invasive energy from eating prey", 30, 1, 200, 1),
    "invasive_gain_from_predator": UserSettableParameter("slider", "Invasive energy from eating predator", 40, 1, 200, 1),
    "initial_invasive_energy": UserSettableParameter("slider", "Invasive energy at creation", 20, 1, 200, 1),

    # Grass + behavior
    "grass_countdown": UserSettableParameter("slider", "Grass growing time after being eaten", 16, 1, 100, 1),
    "chasing_mode": UserSettableParameter("checkbox", "Chasing mode", False),
}

canvas_element = CanvasGrid(predator_prey_portrayal, 20, 20, 500, 500)
chart_element = ChartModule(
    [
        {"Label": "Predators", "Color": "#AA0000"},
        {"Label": "Prey", "Color": "#666666"},
        {"Label": "Invasive", "Color": "#6A0DAD"},
    ]
)

server = ModularServer(
    PredatorPrey, [canvas_element, chart_element], "Predator–Prey Model", model_params
)
server.port = 8522
