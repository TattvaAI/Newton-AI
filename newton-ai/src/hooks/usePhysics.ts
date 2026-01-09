import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const usePhysics = (engine: Matter.Engine | null) => {
    const bodiesRef = useRef<Matter.Body[]>([]);

    useEffect(() => {
        if (!engine) return;

        const updateBodies = () => {
            bodiesRef.current = Matter.Composite.allBodies(engine.world);
            requestAnimationFrame(updateBodies);
        };

        updateBodies();

        return () => {
            bodiesRef.current = [];
        };
    }, [engine]);

    return bodiesRef.current;
};

export default usePhysics;