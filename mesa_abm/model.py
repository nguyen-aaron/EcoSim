"""
Predator–Prey Model
================================

Replication of the model found in NetLogo:
    Wilensky, U. (1997). NetLogo Predator Prey Predation model.
    http://ccl.northwestern.edu/netlogo/models/WolfSheepPredation.
    Center for Connected Learning and Computer-Based Modeling,
    Northwestern University, Evanston, IL.
"""

from mesa import Model
from mesa.space import MultiGrid
from mesa.datacollection import DataCollector

from mesa_abm.agents import Prey, Predator, GrassPatch
from mesa_abm.schedule import RandomActivationByBreed


class PredatorPrey(Model):
    """
    Predator–Prey Model
    """

    height = 20
    width = 20

    initial_prey = 100
    initial_predators = 50

    prey_reproduce = 0.04
    predator_reproduce = 0.05

    predator_gain_from_food = 20

    grass = False
    grass_regrowth_time = 30
    prey_gain_from_food = 4

    description = (
        "A model for simulating predator–prey ecosystem dynamics with optional grass."
    )

    def __init__(
        self,
        height=20,
        width=20,
        initial_prey=100,
        initial_predators=50,
        prey_reproduce=0.04,
        predator_reproduce=0.05,
        predator_gain_from_food=20,
        grass=True,
        grass_regrowth_time=30,
        prey_gain_from_food=4,
        grass_countdown=10,
        initial_prey_energy=10,
        initial_predator_energy=10,
        chasing_mode=False,
    ):
        """
        Create a new Predator–Prey model with the given parameters.

        Args:
            initial_prey: Number of prey to start with
            initial_predators: Number of predators to start with
            prey_reproduce: Probability each prey reproduces each step
            predator_reproduce: Probability each predator reproduces each step
            predator_gain_from_food: Energy a predator gains from eating a prey
            grass: Whether prey eat grass for energy
            grass_regrowth_time: How long a grass patch takes to regrow once eaten
            prey_gain_from_food: Energy prey gain from grass, if enabled
        """
        super().__init__()
        # Set parameters
        self.height = height
        self.width = width
        self.initial_prey = initial_prey
        self.initial_predators = initial_predators
        self.prey_reproduce = prey_reproduce
        self.predator_reproduce = predator_reproduce
        self.predator_gain_from_food = predator_gain_from_food
        self.grass = grass
        self.grass_regrowth_time = grass_regrowth_time
        self.prey_gain_from_food = prey_gain_from_food
        self.grass_countdown = grass_countdown
        self.initial_prey_energy = initial_prey_energy
        self.initial_predator_energy = initial_predator_energy
        self.chasing_mode = chasing_mode

        self.schedule = RandomActivationByBreed(self)
        self.grid = MultiGrid(self.height, self.width, torus=True)
        self.datacollector = DataCollector(
            {
                "Predators": lambda m: m.schedule.get_breed_count(Predator),
                "Prey": lambda m: m.schedule.get_breed_count(Prey),
            }
        )

        # Create prey
        for _ in range(self.initial_prey):
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            a = Prey(
                self.next_id(),
                (x, y),
                self,
                moore=True,
                energy=self.initial_prey_energy,
                chasing_mode=self.chasing_mode,
            )
            self.schedule.add(a)
            self.grid.place_agent(a, (x, y))

        # Create predators
        for _ in range(self.initial_predators):
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            a = Predator(
                self.next_id(),
                (x, y),
                self,
                moore=True,
                energy=self.initial_predator_energy,
                chasing_mode=self.chasing_mode,
            )
            self.schedule.add(a)
            self.grid.place_agent(a, (x, y))

        # Create grass patches
        for x in range(self.grid.width):
            for y in range(self.grid.height):
                a = GrassPatch(
                    self.next_id(),
                    (x, y),
                    self,
                    fully_grown=True,
                    countdown=self.grass_countdown,
                )
                self.schedule.add(a)
                self.grid.place_agent(a, (x, y))

    def step(self):
        self.schedule.step()
        self.datacollector.collect(self)

    def run_model(self, step_count=200):
        for _ in range(step_count):
            self.step()
