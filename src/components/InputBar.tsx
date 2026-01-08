import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface InputBarProps {
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
    onRetry?: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({ onGenerate, isGenerating }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || isGenerating) return;
        onGenerate(value);
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
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
        </div>
    );
};
