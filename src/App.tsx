import { useState, useCallback, useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { Activity } from 'lucide-react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { InputBar } from './components/InputBar';
import { Controls } from './components/Controls';
import { HUD } from './components/HUD';
import { ToastContainer } from './components/Toast';
import { ObjectInspector } from './components/ObjectInspector';
import { usePhysicsEngine, usePhysicsStats, useKeyboardShortcuts, useToast, useSimulationController } from './hooks';
import { loadSavedSimulations, saveSimulations, type SavedSimulation } from './lib';
import { ObjectEditor } from './features/education/ObjectEditor';
import { PhysicsDashboard } from './features/measurements/PhysicsDashboard';

function App() {
  // Physics engine setup
  const { engine, render } = usePhysicsEngine();
  const stats = usePhysicsStats(engine);
  const { toasts, addToast, removeToast } = useToast();

  // Simulation Controller
  const {
    isGenerating,
    lastGeneratedCode,
    hasSimulation,
    actions: simActions
  } = useSimulationController({ engine });

  // UI State
  const [selectedBody, setSelectedBody] = useState<Matter.Body | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showObjectEditor] = useState(true);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(loadSavedSimulations);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [initialEnergy, setInitialEnergy] = useState<number | null>(null);

  // Ref for accessing engine in async operations
  const engineRef = useRef(engine);
  engineRef.current = engine;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  // Handle generation finished - update UI or initial energy
  useEffect(() => {
    if (hasSimulation && showDashboard) {
      // Calculate initial energy after a brief delay to let physics settle
      setTimeout(async () => {
        if (engineRef.current) {
          const { calculateSystemMeasurements } = await import('./lib/calculations/physics-math');
          const groundY = render?.bounds.max.y || window.innerHeight;
          const measurements = calculateSystemMeasurements(
            engineRef.current.world.bodies,
            groundY,
            engineRef.current.world.gravity.y
          );
          setInitialEnergy(measurements.totalEnergy);
        }
      }, 100);
    } else if (!hasSimulation) {
      setShowDashboard(false);
      setSelectedBody(null);
    }
  }, [hasSimulation, showDashboard, render]);

  // Auto-show dashboard when simulation is created
  useEffect(() => {
    if (hasSimulation && lastGeneratedCode) {
      setShowDashboard(true);
    }
  }, [hasSimulation, lastGeneratedCode]);

  const handleSaveSimulation = useCallback(() => {
    if (!lastGeneratedCode) return;

    const name = prompt('Enter a name for this simulation:', 'My Simulation');
    if (!name) return;

    const newSimulation: SavedSimulation = {
      id: Date.now().toString(),
      name: name.trim(),
      code: lastGeneratedCode,
      timestamp: Date.now()
    };

    const updated = [...savedSimulations, newSimulation];
    setSavedSimulations(updated);
    saveSimulations(updated);

    addToast('success', '💾 Saved!', `"${name}" saved to your library`);
  }, [lastGeneratedCode, savedSimulations, addToast]);

  const handleLoadSimulation = useCallback((simulation: SavedSimulation) => {
    const result = simActions.load(simulation.code);

    if (result && result.success) {
      setShowSavedPanel(false);
      addToast('success', '📂 Loaded', `"${simulation.name}" loaded successfully`);
    } else {
      addToast('error', 'Load Failed', result?.error || 'Could not load simulation');
    }
  }, [simActions, addToast]);

  const handleDeleteSimulation = useCallback((id: string) => {
    const updated = savedSimulations.filter(sim => sim.id !== id);
    setSavedSimulations(updated);
    saveSimulations(updated);
    addToast('info', 'Deleted', 'Simulation removed from library');
  }, [savedSimulations, addToast]);

  const handleToggleDashboard = useCallback(() => {
    setShowDashboard(prev => !prev);
  }, []);

  const handleCloseInspector = useCallback(() => {
    setSelectedBody(null);
  }, []);

  const handleShowDashboard = useCallback(() => {
    setShowDashboard(true);
  }, []);

  const handleToggleSavedPanel = useCallback(() => {
    setShowSavedPanel(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPause: simActions.replay,
    onToggleDashboard: handleToggleDashboard,
  });

  // Object selection logic
  useEffect(() => {
    if (!render) return;

    const canvas = render.canvas;

    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      const bodies = Matter.Composite.allBodies(engineRef.current!.world);
      const clickedBodies = Matter.Query.point(bodies, mousePosition);

      // Find first non-static body
      const dynamicBody = clickedBodies.find(body => !body.isStatic);

      if (dynamicBody) {
        setSelectedBody(dynamicBody);
      } else {
        setSelectedBody(null);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [render]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <SimulationCanvas />

      <HUD stats={stats} engine={engine} />

      <Controls
        onReset={simActions.reset}
        onPause={simActions.replay}
        isPaused={false}
        engine={engine}
        render={render}
        lastGeneratedCode={lastGeneratedCode}
        savedSimulations={savedSimulations}
        onLoadSimulation={handleLoadSimulation}
        onDeleteSimulation={handleDeleteSimulation}
        showSavedPanel={showSavedPanel}
        onToggleSavedPanel={handleToggleSavedPanel}
        canReplay={!!lastGeneratedCode}
        onReplay={simActions.replay}
        onSave={handleSaveSimulation}
        hasSimulation={hasSimulation}
      />

      <InputBar
        onGenerate={simActions.generate}
        isGenerating={isGenerating}
        hasSimulation={hasSimulation}
      />

      {/* Show the new ObjectEditor instead of ObjectInspector when a body is selected */}
      {selectedBody && showObjectEditor ? (
        <ObjectEditor
          body={selectedBody}
          onClose={handleCloseInspector}
        />
      ) : (
        selectedBody && (
          <ObjectInspector
            body={selectedBody}
            onClose={handleCloseInspector}
          />
        )
      )}

      {showDashboard && hasSimulation && (
        <div className="absolute bottom-20 left-6 w-96 max-h-[calc(100vh-200px)] overflow-y-auto animate-in fade-in slide-in-from-left-5 duration-300 z-20">
          <PhysicsDashboard
            engine={engine}
            groundY={render?.bounds.max.y || window.innerHeight}
            gravity={engine?.world.gravity.y || 1}
            initialEnergy={initialEnergy || undefined}
            selectedBody={selectedBody}
          />
        </div>
      )}

      {/* Dashboard Toggle Hint - only show when simulation exists */}
      {hasSimulation && !showDashboard && (
        <button
          onClick={handleShowDashboard}
          className="absolute bottom-6 left-6 p-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 rounded-xl border border-cyan-500/30 backdrop-blur transition-all hover:scale-105 z-10 flex items-center gap-2"
          title="Show Physics Dashboard (M)"
        >
          <Activity className="w-5 h-5" />
          <span className="text-xs font-semibold">Show Measurements</span>
        </button>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-none">
          <div className="text-center">
            <div className="inline-block p-4 bg-slate-800/90 rounded-2xl border border-cyan-500/30 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-lg font-semibold text-cyan-400">Generating Physics...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
