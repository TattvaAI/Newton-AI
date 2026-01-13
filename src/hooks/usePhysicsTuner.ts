import { useState, useEffect } from 'react';
import Matter from 'matter-js';

export interface PhysicsTunerState {
    gravity: number;
    timeScale: number;
    airDensity: number;
    wind: number;
    elasticity: number;
    frictionMultiplier: number;
    angularDamping: number;
}

export const usePhysicsTuner = (engine: Matter.Engine | null) => {
    const [gravity, setGravity] = useState(1);
    const [timeScale, setTimeScale] = useState(1);
    const [airDensity, setAirDensity] = useState(0.001);
    const [wind, setWind] = useState(0);
    const [elasticity, setElasticity] = useState(1);
    const [frictionMultiplier, setFrictionMultiplier] = useState(1);
    const [angularDamping, setAngularDamping] = useState(0);

    // Apply gravity
    useEffect(() => {
        if (!engine) return;
        engine.world.gravity.y = gravity; // eslint-disable-line react-hooks/immutability
    }, [gravity, engine]);

    // Apply time scale
    useEffect(() => {
        if (!engine) return;
        engine.timing.timeScale = timeScale; // eslint-disable-line react-hooks/immutability
    }, [timeScale, engine]);

    // Apply air density
    useEffect(() => {
        if (!engine) return;
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic) {
                body.frictionAir = airDensity;
            }
        });
    }, [airDensity, engine]);

    // Apply wind force
    useEffect(() => {
        if (!engine) return;

        const windHandler = () => {
            const bodies = Matter.Composite.allBodies(engine.world);
            bodies.forEach(body => {
                if (!body.isStatic) {
                    Matter.Body.applyForce(body, body.position, {
                        x: wind * 0.0005,
                        y: 0,
                    });
                }
            });
        };

        Matter.Events.on(engine, 'beforeUpdate', windHandler);

        return () => {
            Matter.Events.off(engine, 'beforeUpdate', windHandler);
        };
    }, [wind, engine]);

    // Apply global elasticity
    useEffect(() => {
        if (!engine) return;
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic && body.restitution !== undefined) {
                // Store original restitution if not already stored
                if (!(body as any)._originalRestitution) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    (body as any)._originalRestitution = body.restitution; // eslint-disable-line @typescript-eslint/no-explicit-any
                }
                body.restitution = (body as any)._originalRestitution * elasticity; // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        });
    }, [elasticity, engine]);

    // Apply friction multiplier
    useEffect(() => {
        if (!engine) return;
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic && body.friction !== undefined) {
                // Store original friction if not already stored
                if (!(body as any)._originalFriction) { // eslint-disable-line @typescript-eslint/no-explicit-any
                    (body as any)._originalFriction = body.friction; // eslint-disable-line @typescript-eslint/no-explicit-any
                }
                body.friction = (body as any)._originalFriction * frictionMultiplier; // eslint-disable-line @typescript-eslint/no-explicit-any
            }
        });
    }, [frictionMultiplier, engine]);

    // Apply angular damping
    useEffect(() => {
        if (!engine) return;
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic) {
                Matter.Body.setAngularVelocity(body, body.angularVelocity * (1 - angularDamping));
            }
        });
    }, [angularDamping, engine]);

    return {
        gravity, setGravity,
        timeScale, setTimeScale,
        airDensity, setAirDensity,
        wind, setWind,
        elasticity, setElasticity,
        frictionMultiplier, setFrictionMultiplier,
        angularDamping, setAngularDamping
    };
};
