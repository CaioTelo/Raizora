import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import CalculatorPage from '@/app/calculadora/page';

describe('application shells', () => {
  it('renders the landing and its calculator route link', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'RAIZORA', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Começar agora/ })).toHaveAttribute('href', '/calculadora');
  });

  it('renders the calculator route shell', () => {
    render(<CalculatorPage />);
    expect(screen.getByRole('heading', { name: 'Calculadora RAIZORA', level: 1 })).toBeInTheDocument();
  });
});
