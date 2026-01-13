import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Matter from 'matter-js';

interface PhysicsState {
  // Engine State
  engine: Matter.Engine | null;
  render: Matter.Render | null;
  isPaused: boolean;
  
  // Simulation State
  hasSimulation: boolean;
  isGenerating: boolean;
  lastGeneratedCode: string | null;
  
  // Actions
  setEngine: (engine: Matter.Engine | null) => void;
  setRender: (render: Matter.Render | null) => void;
  setPaused: (isPaused: boolean) => void;
  togglePause: () => void;
  setSimulation: (code: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

export const usePhysicsStore = create<PhysicsState>()(
  devtools(
    (set) => ({
      // Initial State
      engine: null,
      render: null,
      isPaused: false,
      hasSimulation: false,
      isGenerating: false,
      lastGeneratedCode: null,

      // Actions
      setEngine: (engine) => set({ engine }),
      
      setRender: (render) => set({ render }),
      
      setPaused: (isPaused) => set({ isPaused }),
      
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      
      setSimulation: (code) =>
        set({
          lastGeneratedCode: code,
          hasSimulation: code !== null,
        }),
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      
      reset: () =>
        set({
          hasSimulation: false,
          lastGeneratedCode: null,
          isPaused: false,
        }),
    }),
    { name: 'PhysicsStore' }
  )
);
