import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HUD } from './HUD';
import type { PhysicsStats } from '../types';

describe('HUD', () => {
  const mockStats: PhysicsStats = {
    bodies: 5,
    fps: 60,
    constraints: 2,
  };

  const mockEngine = {
    world: {
      gravity: { x: 0, y: 1.0 },
    },
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  it('renders physics stats correctly', () => {
    const { container } = render(
      <HUD stats={mockStats} engine={mockEngine} />
    );

    expect(container.textContent).toContain('OBJECTS: 5');
    expect(container.textContent).toContain('FPS: 60');
    expect(container.textContent).toContain('CONSTRAINTS: 2');
  });

  it('displays Flash model correctly', () => {
    const { container } = render(
      <HUD stats={mockStats} engine={mockEngine} />
    );

    expect(container.textContent).toContain('Gemini 3 Flash');
    expect(container.textContent).toContain('1K/day');
  });

  it('shows keyboard shortcuts', () => {
    const { container } = render(
      <HUD stats={mockStats} engine={mockEngine} />
    );

    expect(container.textContent).toContain('SPACE: Pause/Play');
    expect(container.textContent).toContain('M: Toggle Dashboard');
  });

  it('displays gravity value', () => {
    const { container } = render(
      <HUD stats={mockStats} engine={mockEngine} />
    );

    expect(container.textContent).toContain('GRAVITY: Y=1.0');
  });
});
