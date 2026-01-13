import type Matter from 'matter-js';

// ============================================================================
// AI MODELS
// ============================================================================

export type GeminiModel = 'flash';

export const GEMINI_MODELS = {
  FLASH: 'gemini-3-flash-preview',
} as const;

// ============================================================================
// PHYSICS
// ============================================================================

export interface PhysicsEngineState {
  engine: Matter.Engine | null;
  runner: Matter.Runner | null;
  render: Matter.Render | null;
}

export interface PhysicsStats {
  bodies: number;
  fps: number;
  constraints: number;
}

// ============================================================================
// SIMULATION
// ============================================================================

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  isDebugMode: boolean;
}

export interface GenerationState {
  isGenerating: boolean;
  prompt: string;
  lastGenerated: string | null;
}

// ============================================================================
// SANDBOX
// ============================================================================

export interface SandboxResult {
  success: boolean;
  error?: string;
  bodiesAdded?: number;
  constraintsAdded?: number;
}

export interface SandboxContext {
  World: typeof Matter.World;
  Bodies: typeof Matter.Bodies;
  Body: typeof Matter.Body;
  Composite: typeof Matter.Composite;
  Constraint: typeof Matter.Constraint;
  Vector: typeof Matter.Vector;
  Events: typeof Matter.Events;
  world: Matter.World;
  engine: Matter.Engine;
  width: number;
  height: number;
}

// ============================================================================
// UI
// ============================================================================

export type ToastType = 'info' | 'error' | 'success' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
}
