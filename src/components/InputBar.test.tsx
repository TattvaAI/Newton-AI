import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputBar } from './InputBar';

describe('InputBar', () => {
  const mockOnGenerate = vi.fn();

  beforeEach(() => {
    mockOnGenerate.mockClear();
  });

  it('renders the input form when no simulation', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={false} 
        hasSimulation={false}
      />
    );

    const input = screen.getByPlaceholderText(/describe a physics experiment/i);
    expect(input).toBeInTheDocument();
  });

  it('shows preset buttons when no simulation', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={false} 
        hasSimulation={false}
      />
    );

    expect(screen.getByText(/Newton's Cradle/i)).toBeInTheDocument();
    expect(screen.getByText(/Projectile Motion/i)).toBeInTheDocument();
  });

  it('calls onGenerate when form is submitted', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={false} 
        hasSimulation={false}
      />
    );

    const input = screen.getByPlaceholderText(/describe a physics experiment/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'create a bouncing ball' } });
    fireEvent.submit(form!);

    expect(mockOnGenerate).toHaveBeenCalledWith('create a bouncing ball');
  });

  it('disables input when generating', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={true} 
        hasSimulation={false}
      />
    );

    const input = screen.getByPlaceholderText(/describe a physics experiment/i);
    expect(input).toBeDisabled();
  });

  it('calls onGenerate when preset is clicked', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={false} 
        hasSimulation={false}
      />
    );

    const presetButton = screen.getByText(/Newton's Cradle/i);
    fireEvent.click(presetButton);

    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
    expect(mockOnGenerate.mock.calls[0][0]).toContain('circles');
  });

  it('hides presets when simulation exists', () => {
    render(
      <InputBar 
        onGenerate={mockOnGenerate} 
        isGenerating={false} 
        hasSimulation={true}
      />
    );

    expect(screen.queryByText(/Newton's Cradle/i)).not.toBeInTheDocument();
  });
});
