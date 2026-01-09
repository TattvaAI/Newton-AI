import { STORAGE } from '../constants';

export interface SavedSimulation {
  id: string;
  name: string;
  code: string;
  timestamp: number;
}

/**
 * Load saved simulations from localStorage
 */
export function loadSavedSimulations(): SavedSimulation[] {
  try {
    const saved = localStorage.getItem(STORAGE.SAVED_SIMULATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load saved simulations:', error);
    return [];
  }
}

/**
 * Save simulations to localStorage
 */
export function saveSimulations(simulations: SavedSimulation[]): void {
  try {
    localStorage.setItem(STORAGE.SAVED_SIMULATIONS_KEY, JSON.stringify(simulations));
  } catch (error) {
    console.error('Failed to save simulations:', error);
  }
}

/**
 * Add a new simulation to storage
 */
export function addSimulation(name: string, code: string): SavedSimulation {
  const newSimulation: SavedSimulation = {
    id: Date.now().toString(),
    name: name.trim(),
    code,
    timestamp: Date.now()
  };

  const existing = loadSavedSimulations();
  const updated = [...existing, newSimulation];
  saveSimulations(updated);

  return newSimulation;
}

/**
 * Delete a simulation from storage
 */
export function deleteSimulation(id: string): void {
  const existing = loadSavedSimulations();
  const updated = existing.filter(sim => sim.id !== id);
  saveSimulations(updated);
}
