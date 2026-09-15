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
    expect(screen.getByText('🎡 Ruleta Pro')).toBeInDocument();
    
    // Check default options
    expect(screen.getByText('Pizza')).toBeInDocument();
    expect(screen.getByText('Sushi')).toBeInDocument();
  });

  it('allows adding a new option', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Añade una opción...');
    const addButton = screen.getByRole('button', { name: '' }); // The button with Plus icon
    // Find button by looking at form submit
    
    fireEvent.change(input, { target: { value: 'Helado' } });
    
    // Trigger submit via form (since button has no name, we can trigger submit on the input)
    fireEvent.submit(input);
    
    expect(screen.getByText('Helado')).toBeInDocument();
  });
});
