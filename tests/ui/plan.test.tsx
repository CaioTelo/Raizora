import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { PlanView } from '@/features/calculator/views/PlanView';
import { feedingSchedule, applicationResultFor, incompleteSchedule, filters as resultFilters } from './result-fixtures';

const filters = { ...resultFilters, onMoveWeek: () => {} };

function view(stageId = 'vegetative', weekNumber = 4, selected?: string[]) {
  render(<PlanView schedule={feedingSchedule} result={applicationResultFor(feedingSchedule, selected)} {...filters} stageId={stageId} weekNumber={weekNumber} />);
  return within(screen.getByRole('region', { name: 'Produtos da semana' }));
}
describe('nutrition plan', () => {
  it.each([
    ['vegetative', 1, 'Joker', '1 g/L', '10 g', '10 g/semana'],
    ['vegetative', 3, 'Coringa Blend', '5 ml/L', '10 ml', '20 ml/semana'],
    ['vegetative', 7, 'Terpeno Plus', '1 ml/L', '2 ml', '6 ml/semana'],
    ['flowering', 5, 'Plant Protein', '8 ml/L', '80 ml', '80 ml/semana'],
  ] as const)('keeps dose, preparation and weekly amount distinct for %s %d %s', (stage, week, product, dose, preparation, weekly) => {
    const card = within(view(stage, week).getByRole('article', { name: product }));
    expect(card.getByText('Dose oficial').nextElementSibling).toHaveTextContent(dose);
    expect(card.getByText('Quantidade por preparo').nextElementSibling).toHaveTextContent(preparation);
    expect(card.getByText('Consumo semanal').nextElementSibling).toHaveTextContent(weekly);
  });
  it('identifies the planned frequency from the canonical configuration', () => {
    view();
    expect(screen.getByText('Frequência planejada de fertirrigação: 1 por semana.')).toBeInTheDocument();
  });
  it('shows read-only 8+8=16 from the schedule independently of week and selection', () => {
    const root = render(<PlanView schedule={feedingSchedule} result={applicationResultFor()} {...filters} />);
    const duration = screen.getByRole('region', { name: 'Duração do ciclo' });
    expect(duration).toHaveTextContent('Vegetativo8 semanasFloração8 semanasTotal do ciclo16 semanas');
    expect(within(duration).queryByRole('textbox')).not.toBeInTheDocument();
    root.rerender(<PlanView schedule={feedingSchedule} result={applicationResultFor(feedingSchedule, ['joker'])} {...filters} stageId="flowering" weekNumber={8} />);
    expect(screen.getByRole('region', { name: 'Duração do ciclo' })).toHaveTextContent('Total do ciclo16 semanas');
  });
  it('separates official dose, preparation and weekly consumption with units and frequency', () => {
    const cards = view(); const joker = within(cards.getByRole('article', { name: 'Joker' }));
    expect(joker.getByText('Dose oficial')).toBeInTheDocument(); expect(joker.getByText('2 g/L')).toBeInTheDocument();
    expect(joker.getByText('Quantidade por preparo')).toBeInTheDocument(); expect(joker.getByText('20 g')).toBeInTheDocument();
    expect(joker.getByText('Consumo semanal')).toBeInTheDocument(); expect(joker.getByText('20 g/semana')).toBeInTheDocument();
    expect(joker.getByText(/1 fertirrigação por semana/)).toBeInTheDocument();
    expect(cards.getByRole('article', { name: 'Coringa Blend' })).toHaveTextContent('5 ml/L');
    expect(cards.getByRole('article', { name: 'Coringa Blend' })).toHaveTextContent('2 aplicações foliares nesta semana');
  });
  it('shows flowering and confirmed non-use without zero doses', () => {
    const cards = view('flowering', 6);
    expect(cards.getByRole('article', { name: 'Joker' })).toHaveTextContent('Não utilizado nesta semana');
    expect(cards.getByRole('article', { name: 'Coringa Blend' })).toHaveTextContent('Não aplicável neste estágio');
    expect(cards.getByRole('article', { name: 'Plant Protein' })).toHaveTextContent('8 ml/L');
    expect(cards.getByRole('article', { name: 'Plant Protein' })).toHaveTextContent('80 ml/semana');
    expect(cards.queryByText('0 g/L')).not.toBeInTheDocument();
  });
  it('omits deselected products from the single week', () => {
    view('vegetative', 1, ['joker']); expect(screen.queryByText('Plant Protein')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.queryByRole('table', { hidden: true })).not.toBeInTheDocument();
  });
  it('shows one product region and no comparison, including hidden tables', () => {
    view();
    expect(screen.getAllByRole('region', { name: 'Produtos da semana' })).toHaveLength(1);
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.queryByRole('table', { hidden: true })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Vegetativo · Semana 4' })).toBeInTheDocument();
    expect(screen.getByText(/raizora-transcription-1/)).toBeInTheDocument();
    expect(screen.getByText(/Versão do fabricante: não informada/)).toBeInTheDocument();
    expect(screen.getByText(/SRC-001.*Tabela nutricional oficial/)).toBeInTheDocument();
  });
  it.each(feedingSchedule.stages.flatMap(stage => Array.from({ length: stage.weekCount }, (_, i) => [stage.id, i + 1, stage.label] as const)))('details only %s week %d with every selected entry', (stageId, weekNumber, label) => {
    const cards = view(stageId, weekNumber);
    expect(cards.getByRole('heading', { name: `${label} · Semana ${weekNumber}` })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.queryByRole('table', { hidden: true })).not.toBeInTheDocument();
  });
  it('updates controlled stage/week filters using schedule options', async () => {
    function Harness() {
      const [stageId, setStage] = useState('vegetative'); const [weekNumber, setWeek] = useState(1);
      return <PlanView schedule={feedingSchedule} result={applicationResultFor()} stageId={stageId} weekNumber={weekNumber} onStageChange={setStage} onWeekChange={setWeek} onMoveWeek={() => {}} />;
    }
    const user = userEvent.setup(); render(<Harness />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '5');
    expect(screen.getByRole('region', { name: 'Produtos da semana' })).toHaveTextContent('10 g/semana');
    expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('5');
  });
  it('shows NO_RULE as incomplete rather than N/A or zero', () => {
    const schedule = incompleteSchedule(); render(<PlanView schedule={schedule} result={applicationResultFor(schedule)} {...filters} />);
    const joker = within(screen.getByRole('region', { name: 'Produtos da semana' })).getByRole('article', { name: 'Joker' });
    expect(joker).toHaveTextContent('Regra não confirmada'); expect(joker).not.toHaveTextContent('—');
    expect(screen.getByText(/Plano incompleto/)).toHaveAttribute('role', 'status');
    expect(joker).not.toHaveTextContent('0 g');
  });
});
