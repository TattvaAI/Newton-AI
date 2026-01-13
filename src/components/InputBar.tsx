import React, { useState, memo } from 'react';
import { Sparkles, Loader2, Orbit, Waves, Zap, Scale, CircleDot, Triangle } from 'lucide-react';

interface InputBarProps {
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
    onRetry?: () => void;
    hasSimulation?: boolean;
}

const PRESETS = [
    {
        label: 'Newton\'s Cradle',
        icon: CircleDot,
        prompt: '5 identical heavy circles suspended by thin constraints from a horizontal bar at the top. First circle on the left is pulled back 100px. High restitution 0.99, no friction. Label them pendulum-1 through pendulum-5.',
        description: 'Conservation of Momentum & Energy'
    },
    {
        label: 'Projectile Motion',
        icon: Triangle,
        prompt: 'A fixed cannon (rotated rectangle) at bottom-left pointing 45 degrees up. Generate 10 small cannonballs with initial velocity shooting from the cannon tip at different angles (30°, 45°, 60°). Show parabolic trajectories. Label each projectile-1, projectile-2, etc.',
        description: 'Parabolic Trajectories'
    },
    {
        label: 'Elastic Collision',
        icon: Zap,
        prompt: 'Two large circles on a horizontal track. Left circle (mass 2, velocity 5 right) labeled heavy-ball. Right circle (mass 0.5, stationary) labeled light-ball. Very high restitution 0.98. Show elastic collision physics.',
        description: 'Energy Transfer in Collisions'
    },
    {
        label: 'Inclined Plane',
        icon: Scale,
        prompt: 'Three identical circles at the top of 3 ramps (30°, 45°, 60° angles). Each ramp has different friction: 0.001, 0.01, 0.1. Label the balls as low-friction, medium-friction, high-friction. Show how friction affects acceleration.',
        description: 'Friction & Acceleration'
    },
    {
        label: 'Pendulum Energy',
        icon: Orbit,
        prompt: 'A large circle suspended by a 300px constraint from a fixed point at top-center. Pull it 200px to the left. High restitution. Label it energy-pendulum. Demonstrate potential to kinetic energy conversion.',
        description: 'Energy Conservation'
    },
    {
        label: 'Domino Effect',
        icon: Waves,
        prompt: '20 tall thin rectangles (10px wide, 60px tall) standing upright in a row with 15px spacing. First domino is tilted 15 degrees. Label them domino-1 through domino-20. Show chain reaction.',
        description: 'Chain Reactions & Energy Transfer'
    }
];

const InputBarComponent: React.FC<InputBarProps> = ({ 
    onGenerate, 
    isGenerating, 
    hasSimulation = false
}) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || isGenerating) return;
        onGenerate(value);
    };

    const handlePresetClick = (prompt: string) => {
        if (isGenerating) return;
        onGenerate(prompt);
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
            <div className="space-y-3">
                {/* Preset Chips - Only show when no simulation is active */}
                {!hasSimulation && (
                    <div className="flex justify-center gap-2 flex-wrap max-w-4xl mx-auto">
                        {PRESETS.map((preset) => {
                            const Icon = preset.icon;
                            return (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset.prompt)}
                                    disabled={isGenerating}
                                    className="group px-3 py-2 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-900/50 hover:border-cyan-500/50 rounded-xl backdrop-blur transition-all active:scale-95 flex flex-col items-center gap-1 min-w-[120px]"
                                    title={preset.description}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className="text-cyan-400 group-hover:text-cyan-300" />
                                        <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                                            {preset.label}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 text-center leading-tight">
                                        {preset.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Input Form - Only show when no simulation */}
                {!hasSimulation && (
                    <form
                        onSubmit={handleSubmit}
                        className={`
          relative group flex items-center gap-3 p-4 
          bg-slate-900/80 backdrop-blur-md 
          border border-cyan-500/30 rounded-2xl shadow-2xl
          transition-all duration-300
          ${isGenerating ? 'border-green-400 shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]' : 'hover:border-cyan-400 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]'}
        `}
                    >
                        <div className="relative">
                            {isGenerating ? (
                                <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
                            ) : (
                                <Sparkles className="w-6 h-6 text-cyan-400" />
                            )}
                        </div>

                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Describe a physics experiment (e.g., '100 bouncy balls in a box')..."
                            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none font-mono text-sm sm:text-base"
                            disabled={isGenerating}
                        />

                        <div className="text-xs text-slate-500 font-mono hidden sm:block">
                            PRESS ENTER
                        </div>

                        {/* Neon Pulse Border Effect */}
                        <div className={`
          absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300
          ${isGenerating ? 'opacity-100 ring-2 ring-green-500/20' : ''}
        `} />
                    </form>
                )}
            </div>
        </div>
    );
};

export const InputBar = memo(InputBarComponent);
