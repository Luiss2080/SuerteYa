import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OptionsManager from './OptionsManager';

const setup = (initialOptions = []) => {
  let options = initialOptions;
  const setOptions = vi.fn((next) => {
    options = typeof next === 'function' ? next(options) : next;
  });
  const utils = render(<OptionsManager options={options} setOptions={setOptions} isSpinning={false} />);
  return { ...utils, setOptions, getOptions: () => options };
};

describe('OptionsManager duplicate handling', () => {
  it('rejects an exact duplicate', () => {
    const { setOptions } = setup(['Pizza']);
    const input = screen.getByPlaceholderText('Añade una opción...');

    fireEvent.change(input, { target: { value: 'Pizza' } });
    fireEvent.submit(input);

    expect(setOptions).not.toHaveBeenCalled();
  });

  it('rejects a duplicate that only differs by case', () => {
    const { setOptions } = setup(['Pizza']);
    const input = screen.getByPlaceholderText('Añade una opción...');

    fireEvent.change(input, { target: { value: 'PIZZA' } });
    fireEvent.submit(input);

    expect(setOptions).not.toHaveBeenCalled();
  });

  it('still accepts a genuinely new option', () => {
    const { setOptions } = setup(['Pizza']);
    const input = screen.getByPlaceholderText('Añade una opción...');

    fireEvent.change(input, { target: { value: 'Sushi' } });
    fireEvent.submit(input);

    expect(setOptions).toHaveBeenCalledWith(['Pizza', 'Sushi']);
  });

  it('rejects an empty/whitespace-only option', () => {
    const { setOptions } = setup(['Pizza']);
    const input = screen.getByPlaceholderText('Añade una opción...');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input);

    expect(setOptions).not.toHaveBeenCalled();
  });
});
