import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { RecipeView } from '@/features/calculator/views/RecipeView';
import { feedingSchedule, applicationResultFor, incompleteSchedule, filters } from './result-fixtures';

function view(stageId = 'vegetative', weekNumber = 4, selected?: string[]) {
  render(<RecipeView schedule={feedingSchedule} result={applicationResultFor(feedingSchedule, selected)} {...filters} stageId={stageId} weekNumber={weekNumber} />);
}
describe('recipe for one preparation', () => {
  it('identifies the planned frequency from the canonical configuration', () => {
    view();
    expect(screen.getByText('Frequência planejada de fertirrigação: 1 por semana.')).toBeInTheDocument();
  });
  it('uses amountPerApplication, never weeklyAmount, for Joker S4', () => {
    view(); const group = within(screen.getByRole('region', { name: 'Fertirrigação' }));
    expect(group.getByText('Volume por preparo: 10 L')).toBeInTheDocument();
    const joker = within(group.getByRole('article', { name: 'Joker' }));
    expect(joker.getByText('2 g/L')).toBeInTheDocument(); expect(joker.getByText('20 g')).toBeInTheDocument();
    expect(joker.getByText(/1 fertirrigação por semana/)).toBeInTheDocument();
    expect(screen.queryByText(/60 g/)).not.toBeInTheDocument(); expect(screen.queryByText('Consumo semanal')).not.toBeInTheDocument();
    expect(group.queryByText('Coringa Blend')).not.toBeInTheDocument();
  });
  it('separates foliar quantities 10/6/2 ml and prescribed frequency', () => {
    view(); const group = within(screen.getByRole('region', { name: 'Pulverização foliar' }));
    expect(group.getByText('Volume por preparo: 2 L')).toBeInTheDocument();
    for (const [product, dose, amount] of [['Coringa Blend', '5 ml/L', '10 ml'], ['Plant Protein', '3 ml/L', '6 ml'], ['Terpeno Plus', '1 ml/L', '2 ml']]) {
      const card = within(group.getByRole('article', { name: product }));
      expect(card.getByText(dose)).toBeInTheDocument(); expect(card.getByText(amount)).toBeInTheDocument();
      expect(card.getByText(/2 aplicações foliares nesta semana/)).toBeInTheDocument();
    }
    expect(group.queryByText('Joker')).not.toBeInTheDocument();
    expect(group.queryByText('20 ml')).not.toBeInTheDocument();
  });
  it('filters stage, week and via with native controls', async () => {
    function Harness() {
      const [stageId, setStage] = useState('vegetative'); const [weekNumber, setWeek] = useState(4);
      return <RecipeView schedule={feedingSchedule} result={applicationResultFor()} stageId={stageId} weekNumber={weekNumber} onStageChange={setStage} onWeekChange={setWeek} />;
    }
    const user = userEvent.setup(); render(<Harness />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Via de aplicação' }), 'FOLIAR');
    expect(screen.queryByRole('region', { name: 'Fertirrigação' })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Via de aplicação' }), 'ALL');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '5');
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).toHaveTextContent('80 ml');
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).toHaveTextContent('Tricomax');
    expect(screen.getByRole('region', { name: 'Pulverização foliar' })).toHaveTextContent('Nenhuma aplicação foliar prevista nesta semana.');
  });
  it('omits deselected and not applicable entries; empty routes are informative', () => {
    view('flowering', 8, ['joker']);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).toHaveTextContent('Nenhuma fertirrigação prevista nesta semana.');
    expect(screen.getByRole('region', { name: 'Pulverização foliar' })).toHaveTextContent('Nenhuma aplicação foliar prevista nesta semana.');
    expect(screen.queryByText('0 g')).not.toBeInTheDocument();
  });
  it('does not claim an empty route is confirmed when a rule is unknown', () => {
    const schedule = incompleteSchedule(); render(<RecipeView schedule={schedule} result={applicationResultFor(schedule, ['joker'])} {...filters} />);
    expect(screen.getByRole('status')).toHaveTextContent('Receita incompleta');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    for (const group of screen.getAllByRole('region')) expect(group).toHaveTextContent('Via sem quantidade confirmada: receita incompleta nesta semana.');
    expect(screen.queryByText(/Nenhuma.*prevista/)).not.toBeInTheDocument();
  });
});
