import { memo } from 'react';
import type { PhysicsStats } from '../types';
import type Matter from 'matter-js';

interface HUDProps {
  stats: PhysicsStats;
  engine: Matter.Engine | null;
}

export const HUD = memo(function HUD({ stats, engine }: HUDProps) {
  const gravity = engine?.world.gravity.y.toFixed(1) || '1.0';

  return (
    <div className="absolute top-6 left-6 z-10 pointer-events-none">
      <div className="flex flex-col gap-1 text-xs sm:text-sm font-mono text-cyan-500/80 bg-slate-950/50 p-3 rounded-lg border-l-2 border-cyan-500/30 backdrop-blur-sm">
        <div>OBJECTS: <span className="text-cyan-200">{stats.bodies}</span></div>
        <div>FPS: <span className="text-cyan-200">{stats.fps}</span></div>
        <div>CONSTRAINTS: <span className="text-cyan-200">{stats.constraints}</span></div>
        <div>GRAVITY: Y=<span className="text-cyan-200">{gravity}</span></div>
        <div className="text-[10px] mt-1 font-bold uppercase text-green-400">
          🤖 Gemini 3 Flash
          <span className="text-green-300/50"> (1K/day)</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-700/50">
          <div>SPACE: Pause/Play</div>
          <div>M: Toggle Dashboard</div>
        </div>
      </div>
    </div>
  );
});
