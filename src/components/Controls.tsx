import { useState, useEffect } from 'react';
import { RefreshCw, Pause, Play, Eye, Zap, Settings, X, BookMarked, Trash2, Play as PlayIcon, RotateCcw, Save } from 'lucide-react';
import Matter from 'matter-js';
import type { GeminiModel } from '../types';

interface SavedSimulation {
  id: string;
  name: string;
  code: string;
  timestamp: number;
}

interface ControlsProps {
  onReset: () => void;
  onPause: () => void;
  isPaused: boolean;
  onDebug: () => void;
  isDebug: boolean;
  activeModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  engine: Matter.Engine | null;
  savedSimulations?: SavedSimulation[];
  onLoadSimulation?: (simulation: SavedSimulation) => void;
  onDeleteSimulation?: (id: string) => void;
  showSavedPanel?: boolean;
  onToggleSavedPanel?: () => void;
  canReplay?: boolean;
  onReplay?: () => void;
  onSave?: () => void;
  hasSimulation?: boolean;
}

export function Controls({
  onReset,
  onPause,
  isPaused,
  onDebug,
  isDebug,
  activeModel,
  onModelChange,
  engine,
  savedSimulations = [],
  canReplay = false,
  onReplay,
  onSave,
  hasSimulation = false,
  onLoadSimulation,
  onDeleteSimulation,
  showSavedPanel = false,
  onToggleSavedPanel,
}: ControlsProps) {
  const [showTuner, setShowTuner] = useState(false);
  const [gravity, setGravity] = useState(1);
  const [timeScale, setTimeScale] = useState(1);
  const [airDensity, setAirDensity] = useState(0.001);
  const [wind, setWind] = useState(0);
  const [elasticity, setElasticity] = useState(1);
  const [frictionMultiplier, setFrictionMultiplier] = useState(1);
  const [angularDamping, setAngularDamping] = useState(0);

  const btnClass = "p-3 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 rounded-xl border border-cyan-900/50 backdrop-blur transition-all active:scale-95";

  // Apply gravity
  useEffect(() => {
    if (!engine) return;
    engine.world.gravity.y = gravity;
  }, [gravity, engine]);

  // Apply time scale
  useEffect(() => {
    if (!engine) return;
    engine.timing.timeScale = timeScale;
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
        if (!(body as any)._originalRestitution) {
          (body as any)._originalRestitution = body.restitution;
        }
        body.restitution = (body as any)._originalRestitution * elasticity;
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
        if (!(body as any)._originalFriction) {
          (body as any)._originalFriction = body.friction;
        }
        body.friction = (body as any)._originalFriction * frictionMultiplier;
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

  return (
    <>
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
          onClick={() => setShowTuner(!showTuner)}
          className={`${btnClass} ${showTuner ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''}`}
          title="Physics Tuner"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={onToggleSavedPanel}
          className={`${btnClass} ${showSavedPanel ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''} relative`}
          title="Saved Simulations Library"
        >
          <BookMarked size={20} />
          {savedSimulations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
              {savedSimulations.length}
        {canReplay && hasSimulation && (
          <>
            <button
              onClick={onReplay}
              className={`${btnClass}`}
              title="Restart simulation from beginning"
            >
              <RotateCcw size={20} />
            </button>
            {onSave && (
              <button
                onClick={onSave}
                className={`${btnClass} text-green-400 hover:text-green-300`}
                title="Save this simulation"
              >
                <Save size={20} />
              </button>
            )}
          </>
        )}

            </span>
          )}
        </button>

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

      {/* Physics Tuner Panel */}
      {showTuner && (
        <div className="absolute top-6 right-6 mt-20 z-20 w-80">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-cyan-300">Physics Tuner</h3>
              </div>
              <button
                onClick={() => setShowTuner(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-5">
              {/* Gravity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-cyan-400">Gravity</label>
                  <span className="text-xs font-mono text-slate-400">{gravity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="5"
                  step="0.1"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Time Scale */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-green-400">Time Scale</label>
                  <span className="text-xs font-mono text-slate-400">{timeScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={timeScale}
                  onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              {/* Air Density */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-purple-400">Air Density</label>
                  <span className="text-xs font-mono text-slate-400">{airDensity.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.001"
                  value={airDensity}
                  onChange={(e) => setAirDensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Wind */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-yellow-400">Wind Force</label>
                  <span className="text-xs font-mono text-slate-400">{wind.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={wind}
                  onChange={(e) => setWind(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-cyan-900/30 my-2" />

              {/* Elasticity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-pink-400">Elasticity (Bounce)</label>
                  <span className="text-xs font-mono text-slate-400">{elasticity.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={elasticity}
                  onChange={(e) => setElasticity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Friction Multiplier */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-orange-400">Friction</label>
                  <span className="text-xs font-mono text-slate-400">{frictionMultiplier.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={frictionMultiplier}
                  onChange={(e) => setFrictionMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Angular Damping */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-blue-400">Angular Damping</label>
                  <span className="text-xs font-mono text-slate-400">{angularDamping.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.001"
                  value={angularDamping}
                  onChange={(e) => setAngularDamping(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-cyan-500/20" />
          </div>
        </div>
      )}

      {/* Saved Simulations Panel */}
      {showSavedPanel && (
        <div className="absolute top-6 right-6 mt-20 z-20 w-96 max-h-[70vh] overflow-hidden">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-cyan-300">Saved Simulations</h3>
              </div>
              <button
                onClick={onToggleSavedPanel}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </button>
            </div>

            {/* Simulations List */}
            <div className="overflow-y-auto p-4 space-y-3 max-h-[calc(70vh-80px)]">
              {savedSimulations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No saved simulations yet</p>
                  <p className="text-xs mt-1">Create and save your favorite experiments!</p>
                </div>
              ) : (
                savedSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="group p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-cyan-300 flex-1 line-clamp-2">
                        {sim.name}
                      </h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onLoadSimulation?.(sim)}
                          className="p-1.5 bg-green-600/20 hover:bg-green-600 rounded-lg transition-colors group/play"
                          title="Load this simulation"
                        >
                          <PlayIcon size={14} className="text-green-400 group-hover/play:text-white" />
                        </button>
                        <button
                          onClick={() => onDeleteSimulation?.(sim.id)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors group/delete"
                          title="Delete this simulation"
                        >
                          <Trash2 size={14} className="text-red-400 group-hover/delete:text-white" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {new Date(sim.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-cyan-500/20" />
          </div>
        </div>
      )}
    </>
  );
}
