import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# New Antecedents/Consequents
waiting_queue = ctrl.Antecedent(np.arange(0, 51, 1), 'waiting_queue')
approaching_density = ctrl.Antecedent(np.arange(0, 51, 1), 'approaching_density')
green_duration = ctrl.Consequent(np.arange(10, 61, 1), 'green_duration')

# Membership functions
waiting_queue['short'] = fuzz.trapmf(waiting_queue.universe, [0, 0, 10, 20])
waiting_queue['medium'] = fuzz.trimf(waiting_queue.universe, [10, 25, 40])
waiting_queue['long'] = fuzz.trapmf(waiting_queue.universe, [30, 40, 50, 50])

approaching_density['low'] = fuzz.trapmf(approaching_density.universe, [0, 0, 10, 20])
approaching_density['medium'] = fuzz.trimf(approaching_density.universe, [10, 25, 40])
approaching_density['high'] = fuzz.trapmf(approaching_density.universe, [30, 40, 50, 50])

green_duration['short'] = fuzz.trimf(green_duration.universe, [10, 10, 25])
green_duration['medium'] = fuzz.trimf(green_duration.universe, [20, 35, 50])
green_duration['long'] = fuzz.trimf(green_duration.universe, [40, 60, 60])

# Rules
rule1 = ctrl.Rule(waiting_queue['short'] & approaching_density['low'], green_duration['short'])
rule2 = ctrl.Rule(waiting_queue['short'] & approaching_density['medium'], green_duration['medium'])
rule3 = ctrl.Rule(waiting_queue['short'] & approaching_density['high'], green_duration['long'])

rule4 = ctrl.Rule(waiting_queue['medium'] & approaching_density['low'], green_duration['short'])
rule5 = ctrl.Rule(waiting_queue['medium'] & approaching_density['medium'], green_duration['medium'])
rule6 = ctrl.Rule(waiting_queue['medium'] & approaching_density['high'], green_duration['medium'])

rule7 = ctrl.Rule(waiting_queue['long'] & approaching_density['low'], green_duration['short'])
rule8 = ctrl.Rule(waiting_queue['long'] & approaching_density['medium'], green_duration['short'])
rule9 = ctrl.Rule(waiting_queue['long'] & approaching_density['high'], green_duration['medium'])

# Control System
traffic_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
traffic_sim = ctrl.ControlSystemSimulation(traffic_ctrl)

def calculate_green_duration(queue_length: int, density: int) -> float:
    # Ensure inputs are within bounds
    queue_length = max(0, min(50, queue_length))
    density = max(0, min(50, density))
    
    traffic_sim.input['waiting_queue'] = queue_length
    traffic_sim.input['approaching_density'] = density
    
    try:
        traffic_sim.compute()
        return float(traffic_sim.output['green_duration'])
    except Exception as e:
        print(f"Error computing fuzzy logic: {e}")
        # Default fallback
        return 30.0

if __name__ == "__main__":
    print(calculate_green_duration(5, 45))  # Expected ~long
    print(calculate_green_duration(45, 5))  # Expected ~short
