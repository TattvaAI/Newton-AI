// ============================================================================
// PHYSICS CONSTANTS
// ============================================================================

export const PHYSICS = {
  WALL_THICKNESS: 60,
  DEFAULT_GRAVITY: { x: 0, y: 1 },
  DEFAULT_RESTITUTION: 0.9,
  DEFAULT_FRICTION: 0.05,
  DEFAULT_AIR_FRICTION: 0.01,
} as const;

// ============================================================================
// RENDERING CONSTANTS
// ============================================================================

export const RENDER = {
  BACKGROUND: 'transparent',
  WIREFRAME_COLOR: '#00ffff',
  DEFAULT_FILL: '#06b6d4',
} as const;

// ============================================================================
// AI CONSTANTS
// ============================================================================

export const AI = {
  MAX_RETRIES: 1,
  GENERATION_TIMEOUT: 30000, // 30 seconds
  MIN_CODE_LENGTH: 10,
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  TOAST_DURATION: 5000,
  STATS_UPDATE_INTERVAL: 1000,
  DEBOUNCE_DELAY: 300,
} as const;

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

export const SHORTCUTS = {
  PAUSE: 'Space',
  RESET: 'KeyR',
  DEBUG: 'KeyD',
  HELP: 'KeyH',
} as const;
