import { BookMarked, X, Play as PlayIcon, Trash2 } from 'lucide-react';
import type { SavedSimulation } from '../../lib';

interface SavedSimulationsListProps {
    savedSimulations: SavedSimulation[];
    onLoad: (sim: SavedSimulation) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export function SavedSimulationsList({
    savedSimulations,
    onLoad,
    onDelete,
    onClose
}: SavedSimulationsListProps) {
    return (
        <div className="absolute top-6 right-6 mt-20 z-20 w-96 max-h-[70vh] overflow-hidden">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                    <div className="flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-cyan-300">Saved Simulations</h3>
                    </div>
                    <button
                        onClick={onClose}
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
                                            onClick={() => onLoad(sim)}
                                            className="p-1.5 bg-green-600/20 hover:bg-green-600 rounded-lg transition-colors group/play"
                                            title="Load this simulation"
                                        >
                                            <PlayIcon size={14} className="text-green-400 group-hover/play:text-white" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(sim.id)}
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
    );
}
