import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Matter from 'matter-js';
import type { SavedSimulation } from '../lib';

interface UIState {
  // Selected Objects
  selectedBody: Matter.Body | null;
  
  // Panel Visibility
  showDashboard: boolean;
  showObjectEditor: boolean;
  showSavedPanel: boolean;
  
  // Saved Simulations
  savedSimulations: SavedSimulation[];
  
  // Measurements
  initialEnergy: number | null;
  
  // Actions
  setSelectedBody: (body: Matter.Body | null) => void;
  toggleDashboard: () => void;
  setShowDashboard: (show: boolean) => void;
  toggleObjectEditor: () => void;
  toggleSavedPanel: () => void;
  setSavedSimulations: (simulations: SavedSimulation[]) => void;
  addSavedSimulation: (simulation: SavedSimulation) => void;
  removeSavedSimulation: (id: string) => void;
  setInitialEnergy: (energy: number | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        selectedBody: null,
        showDashboard: false,
        showObjectEditor: true,
        showSavedPanel: false,
        savedSimulations: [],
        initialEnergy: null,

        // Actions
        setSelectedBody: (body) => set({ selectedBody: body }),
        
        toggleDashboard: () =>
          set((state) => ({ showDashboard: !state.showDashboard })),
        
        setShowDashboard: (show) => set({ showDashboard: show }),
        
        toggleObjectEditor: () =>
          set((state) => ({ showObjectEditor: !state.showObjectEditor })),
        
        toggleSavedPanel: () =>
          set((state) => ({ showSavedPanel: !state.showSavedPanel })),
        
        setSavedSimulations: (simulations) =>
          set({ savedSimulations: simulations }),
        
        addSavedSimulation: (simulation) =>
          set((state) => ({
            savedSimulations: [...state.savedSimulations, simulation],
          })),
        
        removeSavedSimulation: (id) =>
          set((state) => ({
            savedSimulations: state.savedSimulations.filter(
              (sim) => sim.id !== id
            ),
          })),
        
        setInitialEnergy: (energy) => set({ initialEnergy: energy }),
      }),
      {
        name: 'newton-ai-ui',
        partialize: (state) => ({
          savedSimulations: state.savedSimulations,
          showObjectEditor: state.showObjectEditor,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
