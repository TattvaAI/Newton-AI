import Matter from 'matter-js';
import type { PhysicsEngineState, SandboxResult, SandboxContext } from '../types';
import { PHYSICS } from '../constants';
import { logger } from './logger';

/**
 * Initialize Matter.js physics engine
 */
export const createPhysicsEngine = (
  container: HTMLElement,
  width: number,
  height: number
): PhysicsEngineState => {
  // Create engine
  const engine = Matter.Engine.create({
    gravity: PHYSICS.DEFAULT_GRAVITY,
  });

  // Create renderer
  const render = Matter.Render.create({
    element: container,
    engine: engine,
    options: {
      width,
      height,
      background: 'transparent',
      wireframes: false,
      showAngleIndicator: false,
      showVelocity: false,
      showCollisions: false,
      hasBounds: false,
    },
  });

  // Ensure canvas has proper z-index and styling
  if (render.canvas) {
    render.canvas.style.width = '100%';
    render.canvas.style.height = '100%';
    render.canvas.style.display = 'block';
  }

  // Create runner
  const runner = Matter.Runner.create();

  // Add walls
  const walls = createWalls(width, height);
  Matter.Composite.add(engine.world, walls);

  // Add mouse control
  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  Matter.Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  // Start simulation
  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

  return { engine, runner, render };
};

/**
 * Create boundary walls
 */
const createWalls = (width: number, height: number): Matter.Body[] => {
  const { WALL_THICKNESS } = PHYSICS;
  
  return [
    // Top
    Matter.Bodies.rectangle(
      width / 2,
      -WALL_THICKNESS / 2,
      width,
      WALL_THICKNESS,
      { isStatic: true, label: 'wall-top' }
    ),
    // Bottom
    Matter.Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2,
      width,
      WALL_THICKNESS,
      { isStatic: true, label: 'wall-bottom' }
    ),
    // Right
    Matter.Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      { isStatic: true, label: 'wall-right' }
    ),
    // Left
    Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      { isStatic: true, label: 'wall-left' }
    ),
  ];
};

/**
 * Cleanup physics engine
 */
export const destroyPhysicsEngine = (state: PhysicsEngineState): void => {
  const { render, runner } = state;
  
  if (render) {
    Matter.Render.stop(render);
    if (render.canvas) render.canvas.remove();
  }
  
  if (runner) {
    Matter.Runner.stop(runner);
  }
};

/**
 * Clear all non-static bodies from world
 */
export const clearDynamicBodies = (engine: Matter.Engine): void => {
  const bodiesToRemove = engine.world.bodies.filter(body => !body.isStatic);
  if (bodiesToRemove.length > 0) {
    Matter.Composite.remove(engine.world, bodiesToRemove);
  }
  
  // Also remove constraints
  const constraintsToRemove = engine.world.constraints.filter(
    c => c.label !== 'Mouse Constraint'
  );
  if (constraintsToRemove.length > 0) {
    Matter.Composite.remove(engine.world, constraintsToRemove);
  }
};

/**
 * Reposition walls on window resize
 */
export const repositionWalls = (
  engine: Matter.Engine,
  width: number,
  height: number
): void => {
  const { WALL_THICKNESS } = PHYSICS;
  const walls = engine.world.bodies.filter(b => b.label?.startsWith('wall-'));
  
  if (walls.length >= 4) {
    Matter.Body.setPosition(walls[0], { x: width / 2, y: -WALL_THICKNESS / 2 });
    Matter.Body.setPosition(walls[1], { x: width / 2, y: height + WALL_THICKNESS / 2 });
    Matter.Body.setPosition(walls[2], { x: width + WALL_THICKNESS / 2, y: height / 2 });
    Matter.Body.setPosition(walls[3], { x: -WALL_THICKNESS / 2, y: height / 2 });
  }
};

/**
 * Execute AI-generated physics code in sandbox
 */
/**
 * Validate generated code for common issues
 */
const validateCode = (code: string): { valid: boolean; error?: string } => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code is empty' };
  }
  
  // Check for unmatched parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return { valid: false, error: `Unmatched parentheses: ${openParens} open, ${closeParens} close` };
  }
  
  // Check for unmatched brackets
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    return { valid: false, error: `Unmatched brackets: ${openBrackets} open, ${closeBrackets} close` };
  }
  
  // Check for unmatched braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return { valid: false, error: `Unmatched braces: ${openBraces} open, ${closeBraces} close` };
  }
  
  return { valid: true };
};

export const executeSandboxCode = (
  code: string,
  engine: Matter.Engine
): SandboxResult => {
  try {
    logger.debug('Executing code:', code.substring(0, 200) + '...');
    
    // Validate code structure
    const validation = validateCode(code);
    if (!validation.valid) {
      throw new Error(`Code validation failed: ${validation.error}`);
    }
    
    // Clear existing dynamic bodies
    clearDynamicBodies(engine);
    
    const bodiesBefore = engine.world.bodies.length;
    const constraintsBefore = engine.world.constraints.length;

    // Create sandbox context
    const context: SandboxContext = {
      World: Matter.World,
      Bodies: Matter.Bodies,
      Body: Matter.Body,
      Composite: Matter.Composite,
      Constraint: Matter.Constraint,
      Vector: Matter.Vector,
      Events: Matter.Events,
      world: engine.world,
      engine,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Execute code
    const execute = new Function(...Object.keys(context), code);
    execute(...Object.values(context));

    // Calculate what was added
    const bodiesAfter = engine.world.bodies.length;
    const constraintsAfter = engine.world.constraints.length;
    const bodiesAdded = bodiesAfter - bodiesBefore;
    const constraintsAdded = constraintsAfter - constraintsBefore;
    
    // Ensure all new bodies have visible colors
    const newBodies = engine.world.bodies.slice(bodiesBefore);
    newBodies.forEach((body, index) => {
      if (!body.isStatic && !body.render.fillStyle) {
        const hue = (index * 137.5) % 360; // Golden angle
        body.render.fillStyle = `hsl(${hue}, 70%, 60%)`;
        body.render.strokeStyle = `hsl(${hue}, 70%, 40%)`;
        body.render.lineWidth = 1;
      }
    });

    logger.info(`✅ Sandbox success: +${bodiesAdded} bodies, +${constraintsAdded} constraints`);

    return {
      success: true,
      bodiesAdded,
      constraintsAdded,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('❌ Sandbox execution failed:', message);
    logger.debug('Failed code:', code);
    
    return {
      success: false,
      error: message,
    };
  }
};
