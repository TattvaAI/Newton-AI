import { useState, useCallback, useRef } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { InputBar } from './components/InputBar';
import { Controls } from './components/Controls';
import { HUD } from './components/HUD';
import { ToastContainer } from './components/Toast';
import { usePhysicsEngine, usePhysicsStats, useKeyboardShortcuts, useToast } from './hooks';
import { geminiClient, clearDynamicBodies, executeSandboxCode } from './lib';
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

  // Ref for accessing engine in async operations
  const engineRef = useRef(engine);
  engineRef.current = engine;

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const handleReset = useCallback(() => {
    if (!engineRef.current) return;
    clearDynamicBodies(engineRef.current);
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
          addToast('success', '✨ Self-Repair Successful', 'Simulation recovered automatically');
        }
      } else {
        addToast('success', '🎉 Experiment Created', 'Physics simulation running');
      }

    } catch (error: any) {
      addToast('error', 'Experiment Failed', error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [addToast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPause: handlePause,
    onReset: handleReset,
    onDebug: handleDebug,
  });

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
      />

      <InputBar
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
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
