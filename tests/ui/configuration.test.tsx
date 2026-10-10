import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CalculatorPage from '@/app/calculadora/page';

describe('configuration screen', () => {
  it('associates optional 10% guidance and static examples without automating manual volume', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />);
    const field = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' });
    expect(field).toHaveAccessibleDescription(/referência opcional.*aproximadamente 10% da capacidade do vaso/i);
    expect(field).toHaveAccessibleDescription(/vaso de 10 L.*1 L.*vaso de 20 L.*2 L/i);
    expect(field).toHaveAccessibleDescription(/vírgula ou ponto decimal/i);
    expect(field).toHaveValue('');
    expect(screen.queryByRole('textbox', { name: /capacidade do vaso/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    const descriptionIds = field.getAttribute('aria-describedby')!.split(' ');
    expect(descriptionIds).toEqual(['fertigationVolumeLiters-help', 'fertigationVolumeLiters-error']);
    for (const id of descriptionIds) expect(document.getElementById(id)).toBeInTheDocument();
    expect(field).toHaveAccessibleDescription(/aproximadamente 10%/);
    await user.type(field, '37,5');
    expect(field).toHaveValue('37,5');
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('heading', { name: 'Produtos', level: 2 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    const edited = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' });
    await user.clear(edited); await user.type(edited, '0.125');
    expect(edited).toHaveValue('0.125');
  });
  it('renders exactly two labeled inputs and units, without cycle duration', () => {
    render(<CalculatorPage />);
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveAttribute('inputmode', 'decimal');
    expect(screen.queryByRole('textbox', { name: 'Fertirrigações por semana' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('group', { name: 'Fertirrigação' })).getAllByRole('textbox')).toHaveLength(1);
    expect(within(screen.getByRole('group', { name: 'Pulverização foliar' })).getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' })).toHaveAttribute('inputmode', 'decimal');
    expect(screen.queryByRole('region', { name: 'Duração do ciclo' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Progresso do planejamento' })).toHaveTextContent('Etapa 2 de 6');
  });
  it('reveals linked errors and focuses the first invalid field on submit', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    const field = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' });
    expect(field).toHaveFocus(); expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription(/Informe o volume/);
    expect(screen.getByRole('heading', { name: 'Configuração', level: 2 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(field).toHaveFocus();
  });
  it.each(['0', '-1', 'texto', '1e3'])('blocks invalid volume %s with an inline message', async value => {
    const user = userEvent.setup(); render(<CalculatorPage />);
    await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }), value);
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveAttribute('aria-invalid', 'true');
  });
  it('accepts decimal volumes, keyboard submission and heading focus at Products', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />);
    await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }), '10,25');
    await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' }), '0.75');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { name: 'Produtos', level: 2 })).toHaveFocus();
  });
  it('allows pending foliar and keeps draft on back', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />);
    await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }), '10');
    await user.click(screen.getByRole('button', { name: /Avançar/ }));
    expect(screen.getByRole('heading', { name: 'Produtos', level: 2 })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveValue('10');
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' })).toHaveValue('');
    expect(within(screen.getByRole('main')).getAllByRole('textbox')).toHaveLength(2);
  });
});
