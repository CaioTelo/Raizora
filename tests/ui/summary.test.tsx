import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SummaryView } from '@/features/calculator/views/SummaryView';
import { feedingSchedule, applicationResultFor, incompleteSchedule } from './result-fixtures';
import { deepFreeze } from '../unit/fixtures';

describe('cycle summary', () => {
  it('identifies the planned frequency from the canonical configuration', () => {
    render(<SummaryView schedule={feedingSchedule} result={applicationResultFor()} />);
    expect(screen.getByText('Frequência planejada de fertirrigação: 1 por semana.')).toBeInTheDocument();
  });
  it.each([
    ['Joker', '140 g', '120 g', '260 g'], ['Coringa Blend', '160 ml', 'Não aplicável neste estágio', '160 ml'],
    ['Plant Protein', '96 ml', '500 ml', '596 ml'], ['Terpeno Plus', '32 ml', 'Não aplicável neste estágio', '32 ml'],
    ['Tricomax', 'Não aplicável neste estágio', '100 g', '100 g'],
  ])('shows canonical stage and cycle quantities for %s', (product, vegetative, flowering, cycle) => {
    const result = deepFreeze(applicationResultFor()); render(<SummaryView schedule={feedingSchedule} result={result} />);
    const card = within(within(screen.getByRole('region', { name: 'Totais por produto' })).getByRole('article', { name: product }));
    expect(card.getByText('Vegetativo').nextElementSibling).toHaveTextContent(vegetative);
    expect(card.getByText('Floração').nextElementSibling).toHaveTextContent(flowering);
    expect(card.getByText('Total do ciclo').nextElementSibling).toHaveTextContent(cycle);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('omits deselected products without zero placeholders', () => {
    render(<SummaryView schedule={feedingSchedule} result={applicationResultFor(feedingSchedule, ['joker'])} />);
    expect(screen.queryByText('Plant Protein')).not.toBeInTheDocument(); expect(screen.queryByText('0 ml')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
  it('does not expose a definitive affected total for NO_RULE, labels partial subtotals', () => {
    const schedule = incompleteSchedule(); render(<SummaryView schedule={schedule} result={applicationResultFor(schedule)} />);
    expect(screen.getByRole('status')).toHaveTextContent('Resumo incompleto');
    const joker = within(within(screen.getByRole('region', { name: 'Totais por produto' })).getByRole('article', { name: 'Joker' }));
    expect(joker.getByText('Total do ciclo').nextElementSibling).toHaveTextContent('Regra não confirmada');
    expect(joker.getByText('Total do ciclo').nextElementSibling).toHaveTextContent('Subtotal conhecido (parcial): 240 g');
    expect(joker.getByText('Floração').nextElementSibling).toHaveTextContent('120 g');
    expect(joker.queryByText('260 g')).not.toBeInTheDocument();
  });
  it('uses semantic table headers and independent units without a mixed grand total', () => {
    render(<SummaryView schedule={feedingSchedule} result={applicationResultFor()} />);
    const table = within(screen.getByRole('table', { name: 'Consumo por produto no ciclo' }));
    expect(table.getAllByRole('columnheader').map(th => th.textContent)).toEqual(['Produto', 'Vegetativo', 'Floração', 'Total do ciclo']);
    for (const th of table.getAllByRole('columnheader')) expect(th).toHaveAttribute('scope', 'col');
    for (const th of table.getAllByRole('rowheader')) expect(th).toHaveAttribute('scope', 'row');
  });
});
