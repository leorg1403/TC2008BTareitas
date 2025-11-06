# FixedAgent: Immobile agents permanently fixed to cells
from mesa.discrete_space import FixedAgent

class Cell(FixedAgent):
    """Represents a single ALIVE or DEAD cell in the simulation."""

    DEAD = 0
    ALIVE = 1

    @property
    def x(self):
        return self.cell.coordinate[0]

    @property
    def y(self):
        return self.cell.coordinate[1]

    @property
    def is_alive(self):
        return self.state == self.ALIVE

    @property
    def neighbors(self):
        return self.cell.neighborhood.agents
    
    def __init__(self, model, cell, init_state=DEAD):
        """Create a cell, in the given state, at the given x, y position."""
        super().__init__(model)
        self.cell = cell
        self.pos = cell.coordinate
        self.state = init_state
        self._next_state = None
        self.decision = 0
        self.top_left = 0
        self.top_right = 0
        self.top_center = 0

    def determine_state(self):
        # Reiniciamos los valores de los vecinos
        self.top_left = 0
        self.top_center = 0
        self.top_right = 0

        # Si estamos en la primera fila (y=0), miramos la última fila (efecto toroidal)
        if self.y == 0:
            target_y = self.model.grid.height - 1
        else:
            target_y = self.y - 1

        # Sacamos la lista de vecinos y buscamos los que están en la fila objetivo (arriba o última fila)
        for neighbor in self.neighbors:
            if neighbor.x == self.x - 1 and neighbor.y == target_y:
                self.top_left = neighbor.is_alive
            elif neighbor.x == self.x and neighbor.y == target_y:
                self.top_center = neighbor.is_alive
            elif neighbor.x == self.x + 1 and neighbor.y == target_y:
                self.top_right = neighbor.is_alive

        # Determinamos el estado de los vecinos de arriba para ver nuestro estado
        if (self.top_left, self.top_center, self.top_right) == (1, 1, 1):
            next_bit = 0
        elif (self.top_left, self.top_center, self.top_right) == (1, 1, 0):
            next_bit = 1
        elif (self.top_left, self.top_center, self.top_right) == (1, 0, 1):
            next_bit = 0
        elif (self.top_left, self.top_center, self.top_right)   == (1, 0, 0):
            next_bit = 1
        elif (self.top_left, self.top_center, self.top_right) == (0, 1, 1):
            next_bit = 1
        elif (self.top_left, self.top_center, self.top_right) == (0, 1, 0):
            next_bit = 0
        elif (self.top_left, self.top_center, self.top_right) == (0, 0, 1):
            next_bit = 1
        elif (self.top_left, self.top_center, self.top_right) == (0, 0, 0):
            next_bit = 0
        else:
            next_bit = 0

        # Todas las celdas cambian de estado según las reglas
        self._next_state = self.ALIVE if next_bit == 1 else self.DEAD



    def assume_state(self):
        """Set the state to the new computed state -- computed in step()."""
        self.state = self._next_state