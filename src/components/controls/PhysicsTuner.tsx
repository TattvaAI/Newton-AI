import { Settings, X } from 'lucide-react';

interface PhysicsTunerProps {
    gravity: number;
    setGravity: (val: number) => void;
    timeScale: number;
    setTimeScale: (val: number) => void;
    airDensity: number;
    setAirDensity: (val: number) => void;
    wind: number;
    setWind: (val: number) => void;
    elasticity: number;
    setElasticity: (val: number) => void;
    frictionMultiplier: number;
    setFrictionMultiplier: (val: number) => void;
    angularDamping: number;
    setAngularDamping: (val: number) => void;
    onClose: () => void;
}

export function PhysicsTuner({
    gravity, setGravity,
    timeScale, setTimeScale,
    airDensity, setAirDensity,
    wind, setWind,
    elasticity, setElasticity,
    frictionMultiplier, setFrictionMultiplier,
    angularDamping, setAngularDamping,
    onClose
}: PhysicsTunerProps) {
    return (
        <div className="absolute top-6 right-6 mt-20 z-20 w-80">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-cyan-300">Physics Tuner</h3>
                    </div>
                    <button
                        onClick={onClose}
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
    );
}
