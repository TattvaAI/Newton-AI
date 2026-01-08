import { useRef, useEffect } from 'react';

/**
 * SimulationCanvas - Renders the Matter.js physics simulation
 * 
 * Now managed by usePhysicsEngine hook - this component just provides the DOM element
 */
export function SimulationCanvas() {
    const sceneRef = useRef<HTMLDivElement>(null);

    // Set the global canvas element for the physics engine
    useEffect(() => {
        if (sceneRef.current) {
            window.__PHYSICS_CANVAS_ELEMENT__ = sceneRef.current;
        }
    }, []);

    return (
        <div 
            ref={sceneRef} 
            className="absolute inset-0 z-0 w-full h-full cursor-crosshair"
            style={{ touchAction: 'none' }}
            aria-label="Physics Simulation Canvas"
        />
    );
}
