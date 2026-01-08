import { useEffect, useState } from 'react';
import type Matter from 'matter-js';
import type { PhysicsStats } from '../types';

export function usePhysicsStats(engine: Matter.Engine | null) {
  const [stats, setStats] = useState<PhysicsStats>({
    bodies: 0,
    fps: 0,
    constraints: 0,
  });

  useEffect(() => {
    if (!engine) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let animationFrameId: number;

    const updateStats = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        const bodies = engine.world.bodies.length;
        const constraints = engine.world.constraints.length;

        setStats({ bodies, fps, constraints });
        frameCount = 0;
        lastTime = now;
      }

      animationFrameId = requestAnimationFrame(updateStats);
    };

    animationFrameId = requestAnimationFrame(updateStats);

    return () => cancelAnimationFrame(animationFrameId);
  }, [engine]);

  return stats;
}
