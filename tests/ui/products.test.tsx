import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CalculatorPage from '@/app/calculadora/page';

async function openProducts(foliar = '') {
  const user = userEvent.setup(); render(<CalculatorPage />);
  await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }), '10');
  if (foliar) await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' }), foliar);
  await user.click(screen.getByRole('button', { name: /Avançar/ }));
  return user;
}
describe('product selection', () => {
  it('has exactly five native defaults and a separate partner label', async () => {
    await openProducts();
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    for (const name of ['Joker', 'Coringa Blend', 'Plant Protein', 'Terpeno Plus', 'Tricomax']) expect(screen.getByRole('checkbox', { name })).toBeChecked();
    expect(screen.queryByText('Speed Vega')).not.toBeInTheDocument();
    expect(screen.getByText('Plantas que Curam')).toBeInTheDocument();
  });
  it('toggles by keyboard and preserves choices on return', async () => {
    const user = await openProducts('2');
    screen.getByRole('checkbox', { name: 'Joker' }).focus(); await user.keyboard(' ');
    expect(screen.getByRole('checkbox', { name: 'Joker' })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('checkbox', { name: 'Joker' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Tricomax' })).toBeChecked();
  });
  it('blocks an empty selection with an associated message and focus, including after back', async () => {
    const user = await openProducts('2');
    for (const checkbox of screen.getAllByRole('checkbox')) await user.click(checkbox);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    const group = screen.getByRole('group', { name: 'Produtos do planejamento' });
    expect(group).toHaveFocus(); expect(group).toHaveAccessibleDescription(/Selecione pelo menos um/);
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).not.toBeChecked();
  });
  it('returns to the missing foliar field with selection intact and allows correction', async () => {
    const user = await openProducts();
    await user.click(screen.getByRole('checkbox', { name: 'Coringa Blend' }));
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    const correction = screen.getByRole('button', { name: 'Preencher volume foliar' });
    expect(correction).toHaveFocus();
    await user.click(correction);
    const field = screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' });
    expect(field).toHaveFocus(); expect(field).toHaveAttribute('aria-invalid', 'true');
    await user.type(field, '2');
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('checkbox', { name: 'Coringa Blend' })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).toHaveFocus();
    expect(screen.getByRole('region', { name: 'Produtos da semana' })).toBeInTheDocument();
  });
  it('removes all foliar products to advance without volume; reactivation requires it again', async () => {
    const user = await openProducts();
    for (const name of ['Coringa Blend', 'Plant Protein', 'Terpeno Plus']) await user.click(screen.getByRole('checkbox', { name }));
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    await user.click(screen.getByRole('checkbox', { name: 'Plant Protein' }));
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('button', { name: 'Preencher volume foliar' })).toBeInTheDocument();
  });
});
