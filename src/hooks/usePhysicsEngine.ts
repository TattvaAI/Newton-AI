import { useEffect, useState } from 'react';
import type { PhysicsEngineState } from '../types';
import {
  createPhysicsEngine,
  destroyPhysicsEngine,
  repositionWalls,
} from '../lib/physics';

/**
 * usePhysicsEngine - Manages Matter.js engine lifecycle
 * 
 * Creates and manages the physics engine using the global canvas element
 */
export function usePhysicsEngine(): PhysicsEngineState {
  const [state, setState] = useState<PhysicsEngineState>({
    engine: null,
    runner: null,
    render: null,
  });

  // Initialize engine when canvas becomes available
  useEffect(() => {
    const checkCanvas = setInterval(() => {
      if (window.__PHYSICS_CANVAS_ELEMENT__) {
        clearInterval(checkCanvas);
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        const newState = createPhysicsEngine(window.__PHYSICS_CANVAS_ELEMENT__, width, height);
        
        setState(newState);
      }
    }, 50);

    return () => {
      clearInterval(checkCanvas);
      if (state.engine && state.runner && state.render) {
        destroyPhysicsEngine(state);
      }
    };
  }, []); // Only run once on mount

  // Handle window resize
  useEffect(() => {
    if (!state.engine || !state.render) return;

    const handleResize = () => {
      if (!state.engine || !state.render) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      state.render.canvas.width = width;
      state.render.canvas.height = height;
      repositionWalls(state.engine, width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.engine, state.render]);

  return state;
}
