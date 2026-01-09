import { useState, useCallback, useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { SimulationCanvas } from './components/SimulationCanvas';
import { InputBar } from './components/InputBar';
import { Controls } from './components/Controls';
import { HUD } from './components/HUD';
import { ToastContainer } from './components/Toast';
import { ObjectInspector } from './components/ObjectInspector';
import { usePhysicsEngine, usePhysicsStats, useKeyboardShortcuts, useToast } from './hooks';
import { geminiClient, clearDynamicBodies, executeSandboxCode, loadSavedSimulations, saveSimulations, type SavedSimulation } from './lib';
import type { GeminiModel } from './types';

function App() {
  // Physics engine setup
  const { engine, runner, render } = usePhysicsEngine();
  const stats = usePhysicsStats(engine);
  const { toasts, addToast, removeToast } = useToast();

  // Simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDebug, setIsDebug] = useState(false);
  const [activeModel, setActiveModel] = useState<GeminiModel>('pro');
  const [selectedBody, setSelectedBody] = useState<Matter.Body | null>(null);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [hasSimulation, setHasSimulation] = useState(false);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>(loadSavedSimulations);
  const [showSavedPanel, setShowSavedPanel] = useState(false);

  // Ref for accessing engine in async operations
  const engineRef = useRef(engine);
  engineRef.current = engine;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleReset = useCallback(() => {
    if (!engineRef.current) return;
    clearDynamicBodies(engineRef.current);
    setLastGeneratedCode(null);
    setHasSimulation(false);
    addToast('info', 'World Reset', 'All dynamic bodies cleared');
  }, [addToast]);

  const handlePause = useCallback(() => {
    if (!runner) return;
    runner.enabled = !runner.enabled;
    setIsPaused(!runner.enabled);
  }, [runner]);

  const handleDebug = useCallback(() => {
    if (!render) return;
    const options = render.options;
    options.wireframes = !options.wireframes;
    options.showAngleIndicator = !options.showAngleIndicator;
    setIsDebug(!!options.wireframes);
  }, [render]);

  const handleModelChange = useCallback((model: GeminiModel) => {
    setActiveModel(model);
    geminiClient.switchModel(model);
    const modelName = model === 'pro' ? 'Gemini 3 Pro' : 'Gemini 3 Flash';
    addToast('info', 'Model Switched', `Now using ${modelName}`);
  }, [addToast]);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!engineRef.current) {
      addToast('error', 'System Not Ready', 'Physics engine not initialized');
      return;
    }
    
    setIsGenerating(true);
    addToast('info', 'Generating Physics...', `Creating: ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`);

    try {
      // Import the helper functions dynamically
      const { generatePhysicsCode, fixPhysicsCode } = await import('./lib/ai/gemini');
      
      // Generate code using proper system prompt
      const code = await generatePhysicsCode(prompt);
      console.log('Generated code:', code);

      // Execute in sandbox
      let result = executeSandboxCode(code, engineRef.current);

      // Self-healing: try to fix if failed
      if (!result.success && result.error) {
        addToast('info', 'Auto-Healing...', 'Attempting to fix the simulation');
        console.warn('First attempt failed:', result.error);
        
        const fixedCode = await fixPhysicsCode(prompt, code, result.error);
        console.log('Fixed code:', fixedCode);
        result = executeSandboxCode(fixedCode, engineRef.current);

        if (!result.success) {
          throw new Error(`Self-repair failed: ${result.error}`);
        } else {
          setLastGeneratedCode(fixedCode);
          setHasSimulation(true);
          addToast('success', '✨ Self-Repair Successful', 'Simulation recovered automatically');
        }
      } else {
        setLastGeneratedCode(code);
        setHasSimulation(true);
        addToast('success', '🎉 Experiment Created', 'Physics simulation running');
      }

    } catch (error: any) {
      addToast('error', 'Experiment Failed', error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [addToast]);

  const handleReplay = useCallback(() => {
    if (!engineRef.current || !lastGeneratedCode) return;
    
    // Clear current simulation
    clearDynamicBodies(engineRef.current);
    
    // Re-execute the saved code
    const result = executeSandboxCode(lastGeneratedCode, engineRef.current);
    
    if (result.success) {
      addToast('success', '🔄 Replayed', 'Simulation restarted from scratch');
    } else {
      addToast('error', 'Replay Failed', result.error || 'Could not replay simulation');
    }
  }, [lastGeneratedCode, addToast]);

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
    if (!engineRef.current) return;
    
    clearDynamicBodies(engineRef.current);
    const result = executeSandboxCode(simulation.code, engineRef.current);
    
    if (result.success) {
      setLastGeneratedCode(simulation.code);
      setHasSimulation(true);
      setShowSavedPanel(false);
      addToast('success', '📂 Loaded', `"${simulation.name}" loaded successfully`);
    } else {
      addToast('error', 'Load Failed', result.error || 'Could not load simulation');
    }
  }, [addToast]);

  const handleDeleteSimulation = useCallback((id: string) => {
    const updated = savedSimulations.filter(sim => sim.id !== id);
    setSavedSimulations(updated);
    saveSimulations(updated);
    addToast('info', 'Deleted', 'Simulation removed from library');
  }, [savedSimulations, addToast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPause: handlePause,
    onReset: handleReset,
    onDebug: handleDebug,
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
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-cyan-500 selection:bg-cyan-500/30">
      <SimulationCanvas />

      <HUD stats={stats} activeModel={activeModel} />

      <Controls
        onReset={handleReset}
        onPause={handlePause}
        isPaused={isPaused}
        onDebug={handleDebug}
        isDebug={isDebug}
        activeModel={activeModel}
        onModelChange={handleModelChange}
        engine={engineRef.current}
        savedSimulations={savedSimulations}
        onLoadSimulation={handleLoadSimulation}
        onDeleteSimulation={handleDeleteSimulation}
        showSavedPanel={showSavedPanel}
        onToggleSavedPanel={() => setShowSavedPanel(!showSavedPanel)}
        canReplay={!!lastGeneratedCode}
        onReplay={handleReplay}
        onSave={handleSaveSimulation}
        hasSimulation={hasSimulation}
      />

      <InputBar
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        hasSimulation={hasSimulation}
      />

      <ObjectInspector
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
      />

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
