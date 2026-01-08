import { RefreshCw, Pause, Play, Eye, Zap } from 'lucide-react';
import type { GeminiModel } from '../types';

interface ControlsProps {
  onReset: () => void;
  onPause: () => void;
  isPaused: boolean;
  onDebug: () => void;
  isDebug: boolean;
  activeModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
}

export function Controls({
  onReset,
  onPause,
  isPaused,
  onDebug,
  isDebug,
  activeModel,
  onModelChange,
}: ControlsProps) {
  const btnClass = "p-3 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 rounded-xl border border-cyan-900/50 backdrop-blur transition-all active:scale-95";

  return (
    <div className="absolute top-6 right-6 flex gap-3 z-10">
      {/* Model Selector */}
      <div className="flex bg-slate-800/80 rounded-xl border border-cyan-900/50 backdrop-blur overflow-hidden">
        <button
          onClick={() => onModelChange('pro')}
          className={`px-4 py-3 flex items-center gap-2 transition-all ${
            activeModel === 'pro'
              ? 'bg-purple-600 text-white'
              : 'text-cyan-400 hover:bg-slate-700'
          }`}
          title="Gemini 3 Pro (Highest Quality - 150 RPD)"
        >
          <Zap size={16} />
          <span className="text-xs font-bold">PRO</span>
        </button>
        <button
          onClick={() => onModelChange('flash')}
          className={`px-4 py-3 flex items-center gap-2 transition-all ${
            activeModel === 'flash'
              ? 'bg-green-600 text-white'
              : 'text-cyan-400 hover:bg-slate-700'
          }`}
          title="Gemini 3 Flash (Fast - 1K RPD)"
        >
          <Zap size={16} />
          <span className="text-xs font-bold">FLASH</span>
        </button>
      </div>

      <button
        onClick={onDebug}
        className={`${btnClass} ${isDebug ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''}`}
        title="Toggle Debug Wireframes (D)"
      >
        <Eye size={20} />
      </button>
      <button
        onClick={onPause}
        className={btnClass}
        title={isPaused ? "Play (Space)" : "Pause (Space)"}
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
      </button>
      <button
        onClick={onReset}
        className={btnClass}
        title="Reset World (R)"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
}
