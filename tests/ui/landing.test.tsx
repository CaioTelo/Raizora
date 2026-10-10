import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';

describe('public landing', () => {
  it('makes RAIZORA the main identity and identifies the product partner separately', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'RAIZORA' })).toBeInTheDocument();
    expect(screen.getByText('Planejamento nutricional')).toBeInTheDocument();
    expect(screen.getByText('Plantas que Curam')).toBeInTheDocument();
    expect(screen.getByText('Parceiro de fertilizantes')).toBeInTheDocument();
  });
  it('offers the direct calculator link without a login gate', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /Começar agora/ })).toHaveAttribute('href', '/calculadora');
  });
});
