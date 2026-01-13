import { useState } from 'react';
import { Pause, Play, Settings, BookMarked, RotateCcw, Save, Download } from 'lucide-react';
import Matter from 'matter-js';
import type { SavedSimulation } from '../lib';
import { usePhysicsTuner } from '../hooks';
import { PhysicsTuner } from './controls/PhysicsTuner';
import { SavedSimulationsList } from './controls/SavedSimulationsList';
import { ExportMenu } from '../features/export';

interface ControlsProps {
  onReset: () => void;
  onPause: () => void;
  isPaused: boolean;
  engine: Matter.Engine | null;
  render?: Matter.Render | null;
  lastGeneratedCode?: string | null;
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

export function Controls(props: ControlsProps) {
  const [showTuner, setShowTuner] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Physics Tuner Hook
  const tuner = usePhysicsTuner(props.engine);

  const btnClass = "p-3 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 rounded-xl border border-cyan-900/50 backdrop-blur transition-all active:scale-95";

  return (
    <>
      <div className="absolute top-6 right-6 flex gap-3 z-10">

        <button
          onClick={() => setShowTuner(!showTuner)}
          className={`${btnClass} ${showTuner ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''}`}
          title="Physics Tuner"
        >
          <Settings size={20} />
        </button>

        {props.hasSimulation && (
          <button
            onClick={() => setShowExport(!showExport)}
            className={`${btnClass} ${showExport ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''} text-orange-400 hover:text-orange-300`}
            title="Export Simulation"
          >
            <Download size={20} />
          </button>
        )}

        <button
          onClick={props.onToggleSavedPanel}
          className={`${btnClass} ${props.showSavedPanel ? 'bg-slate-700 text-cyan-300 ring-1 ring-cyan-500/50' : ''} relative`}
          title="Saved Simulations Library"
        >
          <BookMarked size={20} />
          {props.savedSimulations && props.savedSimulations.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
              {props.savedSimulations.length}
            </span>
          )}
        </button>

        {props.canReplay && props.onReplay && (
          <button
            onClick={props.onReplay}
            className={`${btnClass} text-purple-400 hover:text-purple-300`}
            title="Restart simulation from beginning"
          >
            <RotateCcw size={20} />
          </button>
        )}

        {props.hasSimulation && props.onSave && (
          <button
            onClick={props.onSave}
            className={`${btnClass} text-green-400 hover:text-green-300`}
            title="Save this simulation"
          >
            <Save size={20} />
          </button>
        )}

        <button
          onClick={props.onPause}
          className={btnClass}
          title={props.isPaused ? "Play (Space)" : "Pause (Space)"}
        >
          {props.isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>

      {showTuner && (
        <PhysicsTuner
          {...tuner}
          onClose={() => setShowTuner(false)}
        />
      )}

      {showExport && (
        <ExportMenu
          render={props.render || null}
          lastGeneratedCode={props.lastGeneratedCode || null}
          onClose={() => setShowExport(false)}
        />
      )}

      {props.showSavedPanel && (
        <SavedSimulationsList
          savedSimulations={props.savedSimulations || []}
          onLoad={props.onLoadSimulation!}
          onDelete={props.onDeleteSimulation!}
          onClose={props.onToggleSavedPanel!}
        />
      )}
    </>
  );
}
