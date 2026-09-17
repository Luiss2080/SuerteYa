import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock canvas API so tests don't crash
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
}));

describe('Ruleta Pro - App Core Logic', () => {
  it('renders initial options correctly', () => {
    render(<App />);
    expect(screen.getByText('🎡 Ruleta Pro')).toBeInTheDocument();

    // Check default options
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Sushi')).toBeInTheDocument();
  });

  it('allows adding a new option', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Añade una opción...');

    fireEvent.change(input, { target: { value: 'Helado' } });

    // Trigger submit via the form (the submit button has no accessible
    // name of its own - it only renders an icon - so we submit the form
    // directly instead of trying to look the button up by role/name).
    fireEvent.submit(input);

    expect(screen.getByText('Helado')).toBeInTheDocument();
  });
});
