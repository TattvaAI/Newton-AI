import type { PhysicsStats, GeminiModel } from '../types';
import { GEMINI_MODELS } from '../types';

interface HUDProps {
  stats: PhysicsStats;
  activeModel: GeminiModel;
}

export function HUD({ stats, activeModel }: HUDProps) {
  const modelName = activeModel === 'pro' ? GEMINI_MODELS.PRO : GEMINI_MODELS.FLASH;
  const modelColor = activeModel === 'pro' ? 'text-purple-400' : 'text-green-400';
  const modelBadge = activeModel === 'pro' ? '(150/day)' : '(1K/day)';
  const modelBadgeColor = activeModel === 'pro' ? 'text-purple-300/50' : 'text-green-300/50';

  return (
    <div className="absolute top-6 left-6 z-10 pointer-events-none">
      <div className="flex flex-col gap-1 text-xs sm:text-sm font-mono text-cyan-500/80 bg-slate-950/50 p-3 rounded-lg border-l-2 border-cyan-500/30 backdrop-blur-sm">
        <div>OBJECTS: <span className="text-cyan-200">{stats.bodies}</span></div>
        <div>FPS: <span className="text-cyan-200">{stats.fps}</span></div>
        <div>CONSTRAINTS: <span className="text-cyan-200">{stats.constraints}</span></div>
        <div>GRAVITY: Y=1.0</div>
        <div className={`text-[10px] mt-1 font-bold uppercase ${modelColor}`}>
          🤖 {modelName}
          <span className={modelBadgeColor}> {modelBadge}</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-700/50">
          <div>SPACE: Pause/Play</div>
          <div>R: Reset • D: Debug</div>
        </div>
      </div>
    </div>
  );
}
