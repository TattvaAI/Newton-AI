import { useState, useCallback, useRef } from 'react';
import Matter from 'matter-js';
import { clearDynamicBodies, executeSandboxCode } from '../lib';
import { generatePhysicsCode, fixPhysicsCode } from '../lib/ai/gemini';
import { logger } from '../lib/logger';
import { useToast } from './useToast';

interface UseSimulationControllerProps {
    engine: Matter.Engine | null;
}

export const useSimulationController = ({ engine }: UseSimulationControllerProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
    const [hasSimulation, setHasSimulation] = useState(false);

    const { addToast } = useToast();

    // Store engine in ref to avoid stale closures in async functions
    const engineRef = useRef(engine);
    // Update ref when engine changes
    if (engineRef.current !== engine) {
        engineRef.current = engine;
    }

    const resetSimulation = useCallback(() => {
        if (!engineRef.current) return;
        clearDynamicBodies(engineRef.current);
        setLastGeneratedCode(null);
        setHasSimulation(false);
        addToast('info', 'World Reset', 'All dynamic bodies cleared');
    }, [addToast]);

    const generateSimulation = useCallback(async (prompt: string) => {
        if (!engineRef.current) {
            addToast('error', 'System Not Ready', 'Physics engine not initialized');
            return;
        }

        setIsGenerating(true);
        addToast('info', 'Generating Physics...', `Creating: ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`);

        try {
            // Generate code
            const code = await generatePhysicsCode(prompt);
            logger.log('Generated code:', code);

            // Execute in sandbox
            let result = executeSandboxCode(code, engineRef.current);

            // Self-healing: try to fix if failed
            if (!result.success && result.error) {
                addToast('info', 'Auto-Healing...', 'Attempting to fix the simulation');
                logger.warn('First attempt failed:', result.error);

                const fixedCode = await fixPhysicsCode(prompt, code, result.error);
                logger.log('Fixed code:', fixedCode);
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

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            addToast('error', 'Experiment Failed', message);
        } finally {
            setIsGenerating(false);
        }
    }, [addToast]);

    const replaySimulation = useCallback(() => {
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

    const loadSimulation = useCallback((code: string) => {
        if (!engineRef.current) return;

        clearDynamicBodies(engineRef.current);
        const result = executeSandboxCode(code, engineRef.current);

        if (result.success) {
            setLastGeneratedCode(code);
            setHasSimulation(true);
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    }, []);

    return {
        isGenerating,
        lastGeneratedCode,
        hasSimulation,
        activeEngine: engineRef.current, // Expose current engine ref if needed

        actions: {
            generate: generateSimulation,
            reset: resetSimulation,
            replay: replaySimulation,
            load: loadSimulation,
            setHasSimulation // Exposed for edge cases if needed
        }
    };
};
