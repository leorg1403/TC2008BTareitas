from agentind import RandomAgent, ObstacleAgent, ChargingStationAgent, TrashAgent
from modelind import RandomModel

from mesa.visualization import (
    Slider,
    SolaraViz,
    make_space_component,
    make_plot_component,
)

from mesa.visualization.components import AgentPortrayalStyle

COLORS = {"trash_count": "#0000FF", "num_trash": "#00FF00", "energy": "#FF0000"}

def random_portrayal(agent):
    if agent is None:
        return

    portrayal = AgentPortrayalStyle(
        size=50,
        marker="o",
    )

    if isinstance(agent, RandomAgent):
        portrayal.color = "red"
        portrayal.size = 60
    elif isinstance(agent, ObstacleAgent):
        portrayal.color = "gray"
        portrayal.marker = "s"
        portrayal.size = 100
    elif isinstance(agent, ChargingStationAgent):
        portrayal.color = "green"
        portrayal.marker = "s"
        portrayal.size = 70
    elif isinstance(agent, TrashAgent):
        portrayal.color = "blue"
        portrayal.marker = "s"
        portrayal.size = 40
    else:
        # Cualquier otro agente
        portrayal.color = "brown"
        portrayal.marker = "^"
        portrayal.size = 40

    return portrayal

def post_process(ax):
    ax.set_aspect("equal")

model_params = {
    "seed": {
        "type": "InputText",
        "value": 42,
        "label": "Random Seed",
    },
    "width": Slider("Grid width", 28, 10, 50),
    "height": Slider("Grid height", 28, 10, 50),
    "porObs": Slider("Porcentaje de Obstaculos", 0.2, 0.0, 0.5, 0.05),
    "probTrash": Slider("Probabilidad de Basura", 0.5, 0.0, 1.0, 0.05),
    "max_steps": Slider("Maximo de Steps", 200, 50, 1000, 50),
}

# Create the model using the initial parameters from the settings
# NOTE: No num_agents parameter - always 1 agent starting at [1,1]
model = RandomModel(
    width=model_params["width"].value,
    height=model_params["height"].value,
    porObs=model_params["porObs"].value,
    probTrash=model_params["probTrash"].value,
    max_steps=model_params["max_steps"].value,
    seed=model_params["seed"]["value"]
)

space_component = make_space_component(
        random_portrayal,
        draw_grid = False,
        post_process=post_process
)

plot_component = make_plot_component(
    {"Basura Recolectada": "blue", "Energia promedio": "red",},
)

plot_component2 = make_plot_component(
    {"Porcentaje Limpio": "green",},
)
plot_component3 = make_plot_component(
    {"Movimientos Totales": "orange"}
)

page = SolaraViz(
    model,
    components=[space_component, plot_component, plot_component2, plot_component3],
    model_params=model_params,
    name="Simulacion Individual - Agente en [1,1]",
)
