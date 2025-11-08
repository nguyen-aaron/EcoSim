"""Agents definition classes (Prey, Predator or GrassPatch)"""
from mesa import Agent
from mesa_abm.random_walk import RandomWalker


class Prey(RandomWalker):
    """
    A prey that walks around, reproduces (asexually) and gets eaten.

    The init is the same as the RandomWalker.
    """

    energy = None

    def __init__(self, unique_id, pos, model, moore, energy=None, chasing_mode=False):
        super().__init__(unique_id, pos, model, moore=moore)
        self.energy = energy
        self.chasing_mode = chasing_mode

    def try_reproduce(self):
        if self.random.random() <= self.model.prey_reproduce:
            self.energy //= 2
            a = Prey(self.model.next_id(), self.pos, self.model, self.moore, energy=self.energy)
            self.model.schedule.add(a)
            self.model.grid.place_agent(a, self.pos)

    def try_eat(self):
        """
        If a fully grown grass patch is placed at the Prey's cell,
        Prey eats it and gain energy
        """
        cell_agents = self.model.grid.get_cell_list_contents([self.pos])
        for agent in cell_agents:
            if isinstance(agent, GrassPatch) and agent.fully_grown:
                self.energy += self.model.prey_gain_from_food
                agent.fully_grown = False
                break

    def try_die_from_energy(self):
        """
        Dies from fatigue
        """
        if self.energy <= 0:
            self.model.schedule.remove(self)
            self.model.grid.remove_agent(self)

    def runaway_move(self):
        """
        Moves according to position of Predator in its neighborhood
        Each cell of its neighborhood has a score according to its relative
        position from potential Predator and fully grown grass position
        """
        neighbor_cells = self.model.grid.get_neighborhood(self.pos,
                                                          moore=self.moore,
                                                          include_center=False)

        neighbor_score = {neighbor_cell: 0 for neighbor_cell in neighbor_cells}
        for neighbor_cell in neighbor_cells:
            cell_agents = self.model.grid.get_cell_list_contents([neighbor_cell])
            for agent in cell_agents:
                if isinstance(agent, Predator):
                    neighbor_score[agent.pos] -= 2 # Predator position
                    enemy_possible_moves = self.model.grid.get_neighborhood(
                        agent.pos, moore=self.moore, include_center=False)
                    for bad_position in (set(enemy_possible_moves) & set(neighbor_cells)):
                        neighbor_score[bad_position] -= 1 # Predator neighborhood
                if isinstance(agent, GrassPatch) and agent.fully_grown:
                    neighbor_score[agent.pos] += 1 # Fully grown grass patch position
        move_score = list(neighbor_score.items())
        self.random.shuffle(move_score)
        next_move = max(move_score, key = lambda x: x[1])[0]
        self.model.grid.move_agent(self, next_move)

    def step(self):
        """
        A model step. Move, then eat grass and reproduce.
        """
        # ... to be completed
        if self.chasing_mode:
            self.runaway_move()
        else:
            self.random_move()
        self.energy -= 1
        self.try_reproduce()
        self.try_eat()
        self.try_die_from_energy()



class Predator(RandomWalker):
    """
    A predator that walks around, reproduces (asexually) and eats prey.
    """

    energy = None

    def __init__(self, unique_id, pos, model, moore, energy=None, chasing_mode=False):
        super().__init__(unique_id, pos, model, moore=moore)
        self.energy = energy
        self.chasing_mode = chasing_mode

    def try_reproduce(self):
        if self.random.random() <= self.model.predator_reproduce:
            self.energy //= 2
            a = Predator(self.model.next_id(), self.pos, self.model, self.moore, energy=self.energy)
            self.model.schedule.add(a)
            self.model.grid.place_agent(a, self.pos)

    def try_eat(self):
        """
        If a Prey is at the same cell as the Predator, the 
        """
        cell_agents = self.model.grid.get_cell_list_contents([self.pos])
        for agent in cell_agents:
            if isinstance(agent, Prey):
                self.energy += int(self.model.predator_gain_from_food * (
                    min(1, agent.energy / self.model.initial_prey_energy))) # Variable energy gain from eating prey
                self.model.schedule.remove(agent)
                self.model.grid.remove_agent(agent)
                break

    def try_die_from_energy(self):
        """
        Dies from fatigue
        """
        if self.energy <= 0:
            self.model.schedule.remove(self)
            self.model.grid.remove_agent(self)

    def chasing_move(self):
        """
        Moves towards prey position
        Each neighbor cell is set a score and the maximum is chosen as the one to move to
        """
        neighbor_cells = self.model.grid.get_neighborhood(self.pos,
                                                          moore=self.moore,
                                                          include_center=False)

        neighbor_score = {neighbor_cell: 0 for neighbor_cell in neighbor_cells}
        for neighbor_cell in neighbor_cells:
            cell_agents = self.model.grid.get_cell_list_contents([neighbor_cell])
            for agent in cell_agents:
                if isinstance(agent, Prey):
                    neighbor_score[agent.pos] += 1
        move_score = list(neighbor_score.items())
        self.random.shuffle(move_score)
        next_move = max(move_score, key = lambda x: x[1])[0]
        self.model.grid.move_agent(self, next_move)


    def step(self):
        # ... to be completed
        if self.chasing_mode:
            self.chasing_move()
        else:
            self.random_move()
        self.energy -= 1
        self.try_reproduce()
        self.try_eat()
        self.try_die_from_energy()



class GrassPatch(Agent):
    """
    A patch of grass that grows at a fixed rate and it is eaten by prey
    """

    def __init__(self, unique_id, pos, model, fully_grown, countdown):
        """
        Creates a new patch of grass

        Args:
            grown: (boolean) Whether the patch of grass is fully grown or not
            countdown: Time for the patch of grass to be fully grown again
        """
        super().__init__(unique_id, model)
        # ... to be completed
        self.fully_grown = fully_grown
        self.countdown = countdown
        self.current_countdown = self.countdown

    def grow(self):
        """
        Countdown before getting fully grown
        after being eaten
        """
        self.current_countdown -= 1
        if self.fully_grown or self.current_countdown == 0:
            self.current_countdown = self.countdown
            self.fully_grown = True

    def step(self):
        # ... to be completed
        self.grow()
